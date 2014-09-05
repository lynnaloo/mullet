// Load modules

var Lab = require('lab');
var Items = require('../');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var describe = lab.experiment;
var it = lab.test;
var expect = Lab.expect;


describe('Items', function () {

    describe('#serial', function (done) {

        it('calls methods in serial', function (done) {

            var called = [];
            var array = [1, 2, 3, 4, 5];
            var method = function (item, next) {

                called.push(item);
                setTimeout(next, 5);
            };

            Items.serial(array, method, function (err) {

                expect(err).to.not.exist;
                expect(called).to.deep.equal(array);
                done();
            });
        });

        it('skips on empty array', function (done) {

            var called = [];
            var array = [];
            var method = function (item, next) {

                called.push(item);
                setTimeout(next, 5);
            };

            Items.serial(array, method, function (err) {

                expect(err).to.not.exist;
                expect(called).to.deep.equal(array);
                done();
            });
        });

        it('aborts with error', function (done) {

            var called = [];
            var array = [1, 2, 3, 4, 5];
            var method = function (item, next) {

                called.push(item);
                if (item === 3) {
                    return next('error')
                }

                setTimeout(next, 5);
            };

            Items.serial(array, method, function (err) {

                expect(err).to.equal('error');
                expect(called).to.deep.equal([1, 2, 3]);
                done();
            });
        });
    });

    describe('#parallel', function (done) {

        it('calls methods in parallel', function (done) {

            var called = [];
            var array = [[1, 1], [2, 4], [3, 2], [4, 3], [5, 5]];
            var method = function (item, next) {

                setTimeout(function () {

                    called.push(item[0]);
                    next();
                }, item[1]);
            };

            Items.parallel(array, method, function (err) {

                expect(err).to.not.exist;
                expect(called).to.deep.equal([1, 3, 4, 2, 5]);
                done();
            });
        });

        it('skips on empty array', function (done) {

            var called = [];
            var array = [];
            var method = function (item, next) {

                setTimeout(function () {

                    called.push(item[0]);
                    next();
                }, item[1]);
            };

            Items.parallel(array, method, function (err) {

                expect(err).to.not.exist;
                expect(called).to.deep.equal([]);
                done();
            });
        });

        it('aborts with error', function (done) {

            var called = [];
            var array = [[1, 1], [2, 4], [3, 2], [4, 3], [5, 5]];
            var method = function (item, next) {

                setTimeout(function () {

                    if (item[0] === 3) {
                        return next('error')
                    }

                    called.push(item[0]);
                    next();
                }, item[1]);
            };

            Items.parallel(array, method, function (err) {

                expect(err).to.equal('error');
                expect(called).to.deep.equal([1]);
                done();
            });
        });
    });
});