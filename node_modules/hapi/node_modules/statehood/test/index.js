
// Load modules

var Lab = require('lab');
var Iron = require('iron');
var Hoek = require('hoek');
var Cryptiles = require('cryptiles');
var Statehood = require('../');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;


describe('Statehood', function () {

    describe('Definitions', function () {

        it('generates with defaults', function (done) {

            var definitions = new Statehood.Definitions();
            expect(definitions.settings).to.deep.equal({
                strictHeader: true,
                failAction: 'error'
            });
            done();
        });

        it('overrides failAction', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            expect(definitions.settings).to.deep.equal({
                strictHeader: true,
                failAction: 'ignore'
            });
            done();
        });

        it('overrides strictHeader', function (done) {

            var definitions = new Statehood.Definitions({ strictHeader: false });
            expect(definitions.settings).to.deep.equal({
                strictHeader: false,
                failAction: 'error'
            });
            done();
        });

        describe('#add', function () {

            it('throws on missing name', function (done) {

                var definitions = new Statehood.Definitions();
                expect(function () {

                    definitions.add();
                }).to.throw('Invalid name');
                done();
            });

            it('uses defaults', function (done) {

                var definitions = new Statehood.Definitions();
                definitions.add('test');
                expect(definitions.cookies.test).to.deep.equal({
                    strictHeader: true,
                    failAction: 'error',
                    isSecure: false,
                    isHttpOnly: false,
                    path: null,
                    domain: null,
                    ttl: null,
                    encoding: 'none'
                });
                done();
            });
        });
    });

    describe('#parse', function () {

        it('parses cookie', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=b', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: 'b' });
                done();
            });
        });

        it('parses cookie (loose)', function (done) {

            var definitions = new Statehood.Definitions({ strictHeader: false });
            Statehood.parse('a="1; b="2"; c=3; d[1]=4', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '"1', b: '2', c: '3', 'd[1]': '4' });
                done();
            });
        });

        it('parses cookie (empty)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '' });
                done();
            });
        });

        it('parses cookie (quoted empty)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=""', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '' });
                done();
            });
        });

        it('parses cookie (semicolon single)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=;', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '' });
                done();
            });
        });

        it('parses cookie (number)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=23', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '23' });
                done();
            });
        });

        it('parses cookie (array)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=1; a=2', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: ['1', '2'] });
                done();
            });
        });

        it('parses cookie (mixed style array)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=1; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '1', b: '2', c: '3' });
                done();
            });
        });

        it('parses cookie (mixed style array quoted first)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a="1"; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '1', b: '2', c: '3' });
                done();
            });
        });

        it('parses cookie (white space)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('A    = b;   b  =   c', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ A: 'b', b: 'c' });
                done();
            });
        });

        it('parses cookie (raw form)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a="b=123456789&c=something"', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: 'b=123456789&c=something' });
                done();
            });
        });

        it('parses cookie (raw percent)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=%1;b=x', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '%1', b: 'x' });
                done();
            });
        });

        it('parses cookie (raw encoded)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('z=%20%22%2c%3b%2f', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ z: '%20%22%2c%3b%2f' });
                done();
            });
        });

        it('parses cookie (form single)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { encoding: 'form' });
            Statehood.parse('a="b=%p123456789"', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: { b: '%p123456789' } });
                done();
            });
        });

        it('parses cookie (form multiple)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { encoding: 'form' });
            Statehood.parse('a="b=123456789&c=something%20else"', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: { b: '123456789', c: 'something else' } });
                done();
            });
        });

        it('parses cookie (base64 array 2)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { encoding: 'base64' });
            Statehood.parse('a=dGVzdA; a=dGVzdA', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: ['test', 'test'] });
                done();
            });
        });

        it('parses cookie (base64 array 3)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { encoding: 'base64' });
            Statehood.parse('a=dGVzdA; a=dGVzdA; a=dGVzdA', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: ['test', 'test', 'test'] });
                done();
            });
        });

        it('parses cookie (base64 padding)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'base64' });
            Statehood.parse('key=dGVzdA==', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: 'test' });
                done();
            });
        });

        it('parses cookie (base64)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'base64' });
            Statehood.parse('key=dGVzdA', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: 'test' });
                done();
            });
        });

        it('parses cookie (none encoding)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'none' });
            Statehood.parse('key=dGVzdA', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: 'dGVzdA' });
                done();
            });
        });

        it('parses cookie (base64json)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'base64json' });
            Statehood.parse('key=eyJ0ZXN0aW5nIjoianNvbiJ9', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: { testing: 'json' } });
                done();
            });
        });

        it('parses cookie (iron)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'iron', password: 'password' });
            Statehood.parse('key=Fe26.2**f3fc42242467f7a97c042be866a32c1e7645045c2cc085124eadc66d25fc8395*URXpH8k-R0d4O5bnY23fRQ*uq9rd8ZzdjZqUrq9P2Ci0yZ-EEUikGzxTLn6QTcJ0bc**3880c0ac8bab054f529afec8660ebbbbc8050e192e39e5d622e7ac312b9860d0*r_g7N9kJYqXDrFlvOnuKpfpEWwrJLOKMXEI43LAGeFg', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: { a: 1, b: 2, c: 3 } });
                done();
            });
        });

        it('parses cookie (iron settings)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'iron', password: 'password', iron: Iron.defaults });
            Statehood.parse('key=Fe26.2**f3fc42242467f7a97c042be866a32c1e7645045c2cc085124eadc66d25fc8395*URXpH8k-R0d4O5bnY23fRQ*uq9rd8ZzdjZqUrq9P2Ci0yZ-EEUikGzxTLn6QTcJ0bc**3880c0ac8bab054f529afec8660ebbbbc8050e192e39e5d622e7ac312b9860d0*r_g7N9kJYqXDrFlvOnuKpfpEWwrJLOKMXEI43LAGeFg', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ key: { a: 1, b: 2, c: 3 } });
                done();
            });
        });

        it('parses cookie (signed form)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8*xGhc6WvkE55V-TzucCl0NVFmbijeCwgs5Hf5tAVbSUo', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ sid: { a: '1', b: '2', c: '3 x' } });
                done();
            });
        });

        it('parses cookie (signed form integrity settings)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password', integrity: Iron.defaults.integrity } });
            Statehood.parse('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8*xGhc6WvkE55V-TzucCl0NVFmbijeCwgs5Hf5tAVbSUo', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ sid: { a: '1', b: '2', c: '3 x' } });
                done();
            });
        });

        it('parses cookie (cookie level strict override)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { strictHeader: false });
            Statehood.parse('a="1', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(states).to.deep.equal({ a: '"1' });
                done();
            });
        });

        it('fails parsing cookie (mismatching quotes)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a="1; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(invalids).to.deep.equal({
                    a: {
                        value: '"1',
                        settings: {
                            isSecure: false,
                            isHttpOnly: false,
                            path: null,
                            domain: null,
                            ttl: null,
                            encoding: 'none',
                            strictHeader: true,
                            failAction: 'error'
                        },
                        reason: 'Invalid cookie value'
                    }
                });
                done();
            });
        });

        it('ignores failed parsing cookie (mismatching quotes)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            Statehood.parse('a="1; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(invalids).to.deep.equal({
                    a: {
                        value: '"1',
                        settings: {
                            isSecure: false,
                            isHttpOnly: false,
                            path: null,
                            domain: null,
                            ttl: null,
                            encoding: 'none',
                            strictHeader: true,
                            failAction: 'ignore'
                        },
                        reason: 'Invalid cookie value'
                    }
                });
                done();
            });
        });

        it('ignores failed parsing cookie (cookie settings)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('a', { failAction: 'ignore' });
            Statehood.parse('a="1', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails parsing cookie (name)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a@="1"; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(invalids).to.deep.equal({
                    'a@': {
                        value: '1',
                        settings: {
                            isSecure: false,
                            isHttpOnly: false,
                            path: null,
                            domain: null,
                            ttl: null,
                            encoding: 'none',
                            strictHeader: true,
                            failAction: 'error'
                        },
                        reason: 'Invalid cookie name'
                    }
                });
                done();
            });
        });

        it('ignores failed parsing cookie (name)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            Statehood.parse('a@="1"; b="2"; c=3', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                expect(invalids).to.deep.equal({
                    'a@': {
                        value: '1',
                        settings: {
                            isSecure: false,
                            isHttpOnly: false,
                            path: null,
                            domain: null,
                            ttl: null,
                            encoding: 'none',
                            strictHeader: true,
                            failAction: 'ignore'
                        },
                        reason: 'Invalid cookie name'
                    }
                });
                done();
            });
        });

        it('fails parsing cookie (empty pair)', function (done) {

            var definitions = new Statehood.Definitions();
            Statehood.parse('a=1; b=2; c=3;;', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie header');
                expect(invalids).to.deep.equal({});
                done();
            });
        });

        it('fails parsing cookie (base64json)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('x', { encoding: 'base64json' });
            Statehood.parse('x=XeyJ0ZXN0aW5nIjoianNvbiJ9', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: x');
                expect(invalids).to.deep.equal({
                    x: {
                        value: 'XeyJ0ZXN0aW5nIjoianNvbiJ9',
                        settings: {
                            strictHeader: true,
                            failAction: 'error',
                            isSecure: false,
                            isHttpOnly: false,
                            path: null,
                            domain: null,
                            ttl: null,
                            encoding: 'base64json'
                        },
                        reason: 'Unexpected token ]'
                    }
                });

                done();
            });
        });

        it('ignores failed parsing cookie (base64json)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            definitions.add('x', { encoding: 'base64json' });
            Statehood.parse('x=XeyJ0ZXN0aW5nIjoianNvbiJ9', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails parsing cookie (double base64json)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('x', { encoding: 'base64json' });
            Statehood.parse('x=XeyJ0ZXN0aW5nIjoianNvbiJ9; x=XeyJ0ZXN0aW5dnIjoianNvbiJ9', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: x');
                done();
            });
        });

        it('ignores failed parsing cookie (double base64json)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            definitions.add('x', { encoding: 'base64json' });
            Statehood.parse('x=XeyJ0ZXN0aW5nIjoianNvbiJ9; x=XeyJ0ZXN0aW5dnIjoianNvbiJ9', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails parsing cookie (iron)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'iron', password: 'password' });
            Statehood.parse('key=Fe26.1**f3fc42242467f7a97c042be866a32c1e7645045c2cc085124eadc66d25fc8395*URXpH8k-R0d4O5bnY23fRQ*uq9rd8ZzdjZqUrq9P2Ci0yZ-EEUikGzxTLn6QTcJ0bc**3880c0ac8bab054f529afec8660ebbbbc8050e192e39e5d622e7ac312b9860d0*r_g7N9kJYqXDrFlvOnuKpfpEWwrJLOKMXEI43LAGeFg', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: key');
                done();
            });
        });

        it('fails parsing cookie (iron password)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('key', { encoding: 'iron', password: 'passwordx' });
            Statehood.parse('key=Fe26.2**f3fc42242467f7a97c042be866a32c1e7645045c2cc085124eadc66d25fc8395*URXpH8k-R0d4O5bnY23fRQ*uq9rd8ZzdjZqUrq9P2Ci0yZ-EEUikGzxTLn6QTcJ0bc**3880c0ac8bab054f529afec8660ebbbbc8050e192e39e5d622e7ac312b9860d0*r_g7N9kJYqXDrFlvOnuKpfpEWwrJLOKMXEI43LAGeFg', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: key');
                done();
            });
        });

        it('fails parsing cookie (signed form missing options)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: {} });
            Statehood.parse('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8*khsb8lmkNJS-iljqDKZDMmd__2PcHBz7Ksrc-48gZ-0', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });

        it('fails parsing cookie (signed form missing signature)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });

        it('ignores failed parsing cookie (signed form missing signature)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails parsing cookie (signed form missing signature double)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x; sid=a=1&b=2&c=3%20x', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });

        it('ignores failed parsing cookie (signed form missing signature double)', function (done) {

            var definitions = new Statehood.Definitions({ failAction: 'ignore' });
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x; sid=a=1&b=2&c=3%20x', definitions, function (err, states, invalids) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails parsing cookie (signed form missing signature with sep)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x.', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });

        it('fails parsing cookie (signed form invalid signature)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });

        it('fails parsing cookie (signed form wrong signature)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form', sign: { password: 'password' } });
            Statehood.parse('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8*-Ghc6WvkE55V-TzucCl0NVFmbijeCwgs5Hf5tAVbSUo', definitions, function (err, states, invalids) {

                expect(err).to.exist;
                expect(err.message).to.equal('Bad cookie value: sid');
                done();
            });
        });
    });

    describe('#format', function () {

        it('skips an empty header', function (done) {

            Statehood.format(null, null, function (err, header) {

                expect(err).to.not.exist;
                expect(header).to.deep.equal([]);
                done();
            });
        });

        it('skips an empty array', function (done) {

            Statehood.format([], null, function (err, header) {

                expect(err).to.not.exist;
                expect(header).to.deep.equal([]);
                done();
            });
        });

        it('formats a header', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { ttl: 3600, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' } }, null, function (err, header) {

                var expires = new Date(Date.now() + 3600);
                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fihfieuhr9384hf; Max-Age=3; Expires=' + expires.toUTCString() + '; Secure; HttpOnly; Domain=example.com; Path=/');
                done();
            });
        });

        it('formats a header (with null ttl)', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { ttl: null, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fihfieuhr9384hf; Secure; HttpOnly; Domain=example.com; Path=/');
                done();
            });
        });

        it('formats a header (with zero ttl)', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { ttl: 0, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fihfieuhr9384hf; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; Domain=example.com; Path=/');
                done();
            });
        });

        it('formats a header with null value', function (done) {

            Statehood.format({ name: 'sid', options: { ttl: 3600, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' } }, null, function (err, header) {

                var expires = new Date(Date.now() + 3600);
                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=; Max-Age=3; Expires=' + expires.toUTCString() + '; Secure; HttpOnly; Domain=example.com; Path=/');
                done();
            });
        });

        it('formats a header with server definition', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { ttl: 3600, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' });
            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf' }, definitions, function (err, header) {

                var expires = new Date(Date.now() + 3600);
                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fihfieuhr9384hf; Max-Age=3; Expires=' + expires.toUTCString() + '; Secure; HttpOnly; Domain=example.com; Path=/');
                done();
            });
        });

        it('formats a header with server definition (base64)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'base64' });
            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf' }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=ZmloZmlldWhyOTM4NGhm');
                done();
            });
        });

        it('formats a header with server definition (base64json)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'base64json' });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: 3 } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=eyJhIjoxLCJiIjoyLCJjIjozfQ==');
                done();
            });
        });

        it('fails on a header with server definition and bad value (base64json)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'base64json' });
            var bad = { a: {} };
            bad.b = bad.a;
            bad.a.x = bad.b;

            Statehood.format({ name: 'sid', value: bad }, definitions, function (err, header) {

                expect(err).to.exist;
                done();
            });
        });

        it('formats a header with server definition (form)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'form' });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: '3 x' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=a=1&b=2&c=3%20x');
                done();
            });
        });

        it('formats a header with server definition (form+sign)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', {
                encoding: 'form',
                sign: {
                    password: 'password',
                    integrity: {
                        saltBits: 256,
                        algorithm: 'sha256',
                        iterations: 1,
                        salt: '2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8'
                    }
                }
            });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: '3 x' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=a=1&b=2&c=3%20x.2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8*xGhc6WvkE55V-TzucCl0NVFmbijeCwgs5Hf5tAVbSUo');
                done();
            });
        });

        it('formats a header with server definition (form+sign, buffer password)', function (done) {

            var buffer = new Buffer('fa4321e8c21b44a49d382fa7709226855f40eb23a32b2f642c3fd797c958718e', 'base64');
            var definitions = new Statehood.Definitions();
            definitions.add('sid', {
                encoding: 'form',
                sign: {
                    password: buffer,
                    integrity: {
                        saltBits: 256,
                        algorithm: 'sha256',
                        iterations: 1,
                        salt: '2d75635d74c1a987f84f3ee7f3113b9a2ff71f89d6692b1089f19d5d11d140f8'
                    }
                }
            });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: '3 x' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=a=1&b=2&c=3%20x.*4wjD4tIxyiNW-rC3xBqL56TxUbb_aQT5PMykruWlR0Q');
                done();
            });
        });

        it('fails a header with bad server definition (form+sign)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', {
                encoding: 'form',
                sign: {}
            });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: '3 x' } }, definitions, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Failed to sign cookie (sid) value: Empty password');
                done();
            });
        });

        it('formats a header with server definition (iron)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'iron', password: 'password' });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: 3 } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.have.string('sid=Fe26.2*');
                done();
            });
        });

        it('formats a header with server definition (iron + options)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'iron', password: 'password', iron: Iron.defaults });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: 3 } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.have.string('sid=Fe26.2*');
                done();
            });
        });

        it('formats a header with server definition (iron + options, buffer password)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'iron', password: Cryptiles.randomBits(256), iron: Iron.defaults });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: 3 } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.have.string('sid=Fe26.2*');
                done();
            });
        });

        it('fails a header with bad server definition (iron)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('sid', { encoding: 'iron' });
            Statehood.format({ name: 'sid', value: { a: 1, b: 2, c: 3 } }, definitions, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Failed to encode cookie (sid) value: Empty password');
                done();
            });
        });

        it('formats a header with multiple cookies', function (done) {

            Statehood.format([
                { name: 'sid', value: 'fihfieuhr9384hf', options: { ttl: 3600, isSecure: true, isHttpOnly: true, path: '/', domain: 'example.com' } },
                { name: 'pid', value: 'xyz' }
            ], null, function (err, header) {

                var expires = new Date(Date.now() + 3600);
                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fihfieuhr9384hf; Max-Age=3; Expires=' + expires.toUTCString() + '; Secure; HttpOnly; Domain=example.com; Path=/');
                expect(header[1]).to.equal('pid=xyz');
                done();
            });
        });

        it('fails on bad cookie name', function (done) {

            Statehood.format({ name: 's;id', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid cookie name: s;id');
                done();
            });
        });

        it('allows bad cookie name in loose mode', function (done) {

            var definitions = new Statehood.Definitions({ strictHeader: false });
            Statehood.format({ name: 's;id', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('s;id=fihfieuhr9384hf; Secure; Domain=example.com; Path=/');
                done();
            });
        });

        it('allows bad cookie name in loose mode (cookie level)', function (done) {

            var definitions = new Statehood.Definitions();
            definitions.add('s;id', { strictHeader: false });
            Statehood.format({ name: 's;id', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('s;id=fihfieuhr9384hf; Secure; Domain=example.com; Path=/');
                done();
            });
        });

        it('fails on bad cookie value', function (done) {

            Statehood.format({ name: 'sid', value: 'fi"hfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid cookie value: fi"hfieuhr9384hf');
                done();
            });
        });

        it('fails on bad cookie value (non string)', function (done) {

            Statehood.format({ name: 'sid', value: {}, options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid cookie value: [object Object]');
                done();
            });
        });

        it('allows bad cookie value in loose mode', function (done) {

            var definitions = new Statehood.Definitions({ strictHeader: false });
            Statehood.format({ name: 'sid', value: 'fi"hfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: 'example.com' } }, definitions, function (err, header) {

                expect(err).to.not.exist;
                expect(header[0]).to.equal('sid=fi"hfieuhr9384hf; Secure; Domain=example.com; Path=/');
                done();
            });
        });

        it('fails on bad cookie domain', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: '-example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid cookie domain: -example.com');
                done();
            });
        });

        it('fails on too long cookie domain', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: '1234567890123456789012345678901234567890123456789012345678901234567890.example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Cookie domain too long: 1234567890123456789012345678901234567890123456789012345678901234567890.example.com');
                done();
            });
        });

        it('formats a header with cookie domain with . prefix', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: '/', domain: '.12345678901234567890.example.com' } }, null, function (err, header) {

                expect(err).to.not.exist;
                done();
            });
        });

        it('fails on bad cookie path', function (done) {

            Statehood.format({ name: 'sid', value: 'fihfieuhr9384hf', options: { isSecure: true, isHttpOnly: false, path: 'd', domain: 'example.com' } }, null, function (err, header) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid cookie path: d');
                done();
            });
        });
    });

    describe('#prepareValue', function () {

        it('throws when missing options', function (done) {

            expect(function () {

                Statehood.prepareValue('name', 'value');
            }).to.throw('Missing or invalid options');
            done();
        });
    });
});