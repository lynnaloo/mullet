// Load modules

var Querystring = require('querystring');
var Iron = require('iron');
var Items = require('items');
var Cryptiles = require('cryptiles');
var Boom = require('boom');
var Hoek = require('hoek');


// Declare internals

var internals = {};


internals.defaults = {
    global: {
        strictHeader: true,
        failAction: 'error',                            // 'error' bails on first error, other values ignored
    },
    cookie: {
        isSecure: false,
        isHttpOnly: false,
        path: null,
        domain: null,
        ttl: null,                                      // MSecs, 0 means remove
        encoding: 'none'                                // options: 'base64json', 'base64', 'form', 'iron', 'none'
    }
};


exports.Definitions = internals.Definitions = function (options) {

    this.settings = Hoek.applyToDefaults(internals.defaults.global, options || {});
    this.cookieDefaults = Hoek.applyToDefaults(internals.defaults.cookie, this.settings);
    this.cookies = {};
};


internals.Definitions.prototype.add = function (name, options) {

    Hoek.assert(name && typeof name === 'string', 'Invalid name');
    Hoek.assert(!this.cookies[name], 'State already defined:', name);

    this.cookies[name] = Hoek.applyToDefaults(this.cookieDefaults, options || {});
};


internals.empty = new internals.Definitions();


// Header format

//                      1: name                2: quoted  3: value
internals.parseRx = /\s*([^=\s]+)\s*=\s*(?:(?:"([^\"]*)")|([^\;]*))(?:(?:;|(?:\s*\,)\s*)|$)/g;

internals.validateRx = {
    nameRx: {
        strict: /^[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+$/,
        loose: /^[^=\s]+$/
    },
    valueRx: {
        strict: /^[^\x00-\x20\"\,\;\\\x7F]*$/,
        loose: /^(?:"([^\"]*)")|(?:[^\;]*)$/
    },
    domainRx: /^\.?[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d]))(?:\.[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d])))*$/,
    domainLabelLenRx: /^\.?[a-z\d\-]{1,63}(?:\.[a-z\d\-]{1,63})*$/,
    pathRx: /^\/[^\x00-\x1F\;]*$/
};


exports.parse = function (cookies, definitions, next) {

    var state = {};
    var names = [];
    var verify = cookies.replace(internals.parseRx, function ($0, $1, $2, $3) {

        var name = $1;
        var value = $2 || $3 || '';

        if (state[name]) {
            if (!Array.isArray(state[name])) {
                state[name] = [state[name]];
            }

            state[name].push(value);
        }
        else {
            state[name] = value;
            names.push(name);
        }

        return '';
    });

    // Validate cookie header syntax

    if (verify !== '' &&
        definitions.settings.failAction === 'error') {

        return next(Boom.badRequest('Bad cookie header'), null, {});
    }

    // Fail action

    var invalids = {};

    var shouldStop = function (error, name, value, definition) {

        invalids[name] = {
            value: value,
            settings: definition,
            reason: error.message
        };

        if (definition.failAction === 'error') {
            next(Boom.badRequest('Bad cookie value: ' + Hoek.escapeHtml(name)), null, invalids);
            return true;
        }

        return false;
    };

    // Parse cookies

    var parsed = {};
    Items.serial(names, function (name, nextName) {

        var value = state[name];
        var definition = definitions.cookies[name] || definitions.cookieDefaults;

        // Validate cookie

        if (definition.strictHeader) {
            if (!name.match(internals.validateRx.nameRx.strict)) {
                if (shouldStop(Boom.badRequest('Invalid cookie name'), name, value, definition)) {
                    return;     // shouldStop calls next()
                }
            }

            var values = [].concat(state[name]);
            for (var v = 0, vl = values.length; v < vl; ++v) {
                if (!values[v].match(internals.validateRx.valueRx.strict)) {
                    if (shouldStop(Boom.badRequest('Invalid cookie value'), name, value, definition)) {
                        return;     // shouldStop calls next()
                    }
                }
            }
        }

        // Check cookie format

        if (definition.encoding === 'none') {
            parsed[name] = value;
            return nextName();
        }

        // Single value

        if (!Array.isArray(value)) {
            internals.unsign(name, value, definition, function (err, unsigned) {

                if (err) {
                    if (shouldStop(err, name, value, definition)) {
                        return;     // shouldStop calls next()
                    }

                    return nextName();
                }

                internals.decode(unsigned, definition, function (err, result) {

                    if (err) {
                        if (shouldStop(err, name, value, definition)) {
                            return;     // shouldStop calls next()
                        }

                        return nextName();
                    }

                    parsed[name] = result;
                    return nextName();
                });
            });

            return;
        }

        // Array

        var arrayResult = [];
        Items.serial(value, function (arrayValue, nextArray) {

            internals.unsign(name, arrayValue, definition, function (err, unsigned) {

                if (err) {
                    if (shouldStop(err, name, value, definition)) {
                        return;     // shouldStop calls next()
                    }

                    return nextName();
                }

                internals.decode(unsigned, definition, function (err, result) {

                    if (err) {
                        if (shouldStop(err, name, value, definition)) {
                            return;     // shouldStop calls next()
                        }

                        return nextName();
                    }

                    arrayResult.push(result);
                    nextArray();
                });
            });
        },
        function (err) {

            parsed[name] = arrayResult;
            return nextName();
        });
    },
    function (err) {

        // All cookies parsed

        return next(null, parsed, invalids);
    });
};


internals.macPrefix = 'hapi.signed.cookie.1';


internals.unsign = function (name, value, definition, next) {

    if (!definition.sign) {
        return next(null, value);
    }

    var pos = value.lastIndexOf('.');
    if (pos === -1) {
        return next(Boom.badRequest('Missing signature separator'));
    }

    var unsigned = value.slice(0, pos);
    var sig = value.slice(pos + 1);

    if (!sig) {
        return next(Boom.badRequest('Missing signature'));
    }

    var sigParts = sig.split('*');
    if (sigParts.length !== 2) {
        return next(Boom.badRequest('Bad signature format'));
    }

    var hmacSalt = sigParts[0];
    var hmac = sigParts[1];

    var macOptions = Hoek.clone(definition.sign.integrity || Iron.defaults.integrity);
    macOptions.salt = hmacSalt;
    Iron.hmacWithPassword(definition.sign.password, macOptions, [internals.macPrefix, name, unsigned].join('\n'), function (err, mac) {

        if (err) {
            return next(err);
        }

        if (!Cryptiles.fixedTimeComparison(mac.digest, hmac)) {
            return next(Boom.badRequest('Bad hmac value'));
        }

        return next(null, unsigned);
    });
};


internals.decode = function (value, definition, next) {

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (definition.encoding === 'iron') {
        Iron.unseal(value, definition.password, definition.iron || Iron.defaults, function (err, unsealed) {

            if (err) {
                return next(err);
            }

            return next(null, unsealed);
        });

        return;
    }

    var result = value;

    try {
        switch (definition.encoding) {
            case 'base64json':
                var decoded = (new Buffer(value, 'base64')).toString('binary');
                result = JSON.parse(decoded);
                break;
            case 'base64':
                result = (new Buffer(value, 'base64')).toString('binary');
                break;
            case 'form':
                result = Querystring.parse(value);
                break;
        }
    }
    catch (err) {
        return next(err);
    }

    return next(null, result);
};


exports.format = function (cookies, definitions, callback) {

    definitions = definitions || internals.empty;

    if (!cookies ||
        (Array.isArray(cookies) && !cookies.length)) {

        return Hoek.nextTick(callback)(null, []);
    }

    if (!Array.isArray(cookies)) {
        cookies = [cookies];
    }

    var header = [];
    Items.serial(cookies, function (cookie, next) {

        // Apply definition to local configuration

        var base = definitions.cookies[cookie.name] || definitions.cookieDefaults;
        var definition = cookie.options ? Hoek.applyToDefaults(base, cookie.options) : base;

        // Validate name

        var nameRx = (definition.strictHeader ? internals.validateRx.nameRx.strict : internals.validateRx.nameRx.loose);
        if (!nameRx.test(cookie.name)) {
            return callback(Boom.badImplementation('Invalid cookie name: ' + cookie.name));
        }

        // Prepare value (encode, sign)

        exports.prepareValue(cookie.name, cookie.value, definition, function (err, value) {

            if (err) {
                return callback(err);
            }

            // Validate prepared value

            var valueRx = (definition.strictHeader ? internals.validateRx.valueRx.strict : internals.validateRx.valueRx.loose);
            if (value &&
                (typeof value !== 'string' || !value.match(valueRx))) {

                return callback(Boom.badImplementation('Invalid cookie value: ' + cookie.value));
            }

            // Construct cookie

            var segment = cookie.name + '=' + (value || '');

            if (definition.ttl !== null &&
                definition.ttl !== undefined) {            // Can be zero

                var expires = new Date(definition.ttl ? Date.now() + definition.ttl : 0);
                segment += '; Max-Age=' + Math.floor(definition.ttl / 1000) + '; Expires=' + expires.toUTCString();
            }

            if (definition.isSecure) {
                segment += '; Secure';
            }

            if (definition.isHttpOnly) {
                segment += '; HttpOnly';
            }

            if (definition.domain) {
                var domain = definition.domain.toLowerCase();
                if (!domain.match(internals.validateRx.domainLabelLenRx)) {
                    return callback(Boom.badImplementation('Cookie domain too long: ' + definition.domain));
                }

                if (!domain.match(internals.validateRx.domainRx)) {
                    return callback(Boom.badImplementation('Invalid cookie domain: ' + definition.domain));
                }

                segment += '; Domain=' + domain;
            }

            if (definition.path) {
                if (!definition.path.match(internals.validateRx.pathRx)) {
                    return callback(Boom.badImplementation('Invalid cookie path: ' + definition.path));
                }

                segment += '; Path=' + definition.path;
            }

            header.push(segment);
            return next();
        });
    },
    function (err) {

        return callback(null, header);
    });
};


exports.prepareValue = function (name, value, options, callback) {

    Hoek.assert(options && typeof options === 'object', 'Missing or invalid options');

    // Encode value

    internals.encode(value, options, function (err, encoded) {

        if (err) {
            return callback(Boom.badImplementation('Failed to encode cookie (' + name + ') value: ' + err.message));
        }

        // Sign cookie

        internals.sign(name, encoded, options.sign, function (err, signed) {

            if (err) {
                return callback(Boom.badImplementation('Failed to sign cookie (' + name + ') value: ' + err.message));
            }

            return callback(null, signed);
        });
    });
};


internals.encode = function (value, options, callback) {

    callback = Hoek.nextTick(callback);

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (value === undefined) {
        return callback(null, value);
    }

    if (options.encoding === 'none') {
        return callback(null, value);
    }

    if (options.encoding === 'iron') {
        Iron.seal(value, options.password, options.iron || Iron.defaults, function (err, sealed) {

            if (err) {
                return callback(err);
            }

            return callback(null, sealed);
        });

        return;
    }

    var result = value;

    try {
        switch (options.encoding) {
            case 'base64':
                result = (new Buffer(value, 'binary')).toString('base64');
                break;
            case 'base64json':
                var stringified = JSON.stringify(value);
                result = (new Buffer(stringified, 'binary')).toString('base64');
                break;
            case 'form':
                result = Querystring.stringify(value);
                break;
        }
    }
    catch (err) {
        return callback(err);
    }

    return callback(null, result);
};


internals.sign = function (name, value, options, callback) {

    if (value === undefined ||
        !options) {

        return Hoek.nextTick(callback)(null, value);
    }

    Iron.hmacWithPassword(options.password, options.integrity || Iron.defaults.integrity, [internals.macPrefix, name, value].join('\n'), function (err, mac) {

        if (err) {
            return callback(err);
        }

        var signed = value + '.' + mac.salt + '*' + mac.digest;
        return callback(null, signed);
    });
};

