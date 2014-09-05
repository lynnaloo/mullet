// Load modules


// Declare internals

var internals = {};


exports.serial = function (array, method, callback) {

    var il = array.length
    if (!il) {
        callback();
    }
    else {
        var i = 0;
        var iterate = function () {

            var done = function (err) {

                if (err) {
                    callback(err);
                }
                else {
                    i += 1;
                    if (i < il) {
                        iterate();
                    }
                    else {
                        callback();
                    }
                }
            };

            method(array[i], done);
        };

        iterate();
    }
};


exports.parallel = function (array, method, callback) {

    var il = array.length
    if (!il) {
        callback();
    }
    else {
        var count = 0;

        var done = function (err) {

            if (callback) {
                if (err) {
                    callback(err);
                    callback = null;
                }
                else {
                    count += 1;
                    if (count === array.length) {
                        callback();
                    }
                }
            }
        };

        for (var i = 0; i < il; ++i) {
            method(array[i], done);
        }
    }
};
