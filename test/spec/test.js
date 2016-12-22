/* global describe, it, assert, timeoutRaf */
'use strict';

/**
 * timeoutRaf mocha tests
 * @see https://mochajs.org/
 */
describe('timeoutRaf', function () {
	it('should be a function', function () {
		assert.equal(typeof timeoutRaf, 'function');
	});

	it('should fire when expected', function(done) {
		var t = Date.now();
		var e = 0;

		timeoutRaf(() => {
			e = Date.now();
			assert.closeTo(e - t, 1000, 100, 'numbers are close');
			done();
		}, 1000);
	});

	it('should keep context', function(done) {
		var ctx = {
			testprop: 'exists'
		};

		timeoutRaf(function () {
			assert.equal(this.testprop, 'exists');
			done();
		}, 1000, ctx);
	});

	it('should keep traditional context', function(done) {
		var ctx = {testprop: 'exists'};

		timeoutRaf(function()  {
			assert.equal(this.testprop, 'exists');
			done();
		}.bind(ctx), 1000);
	});

	it('should be killable', function(done) {
		var v = 1;

		var timeout1 = timeoutRaf(() => {
			v = 2;
		}, 1000);

		var timeout2 = timeoutRaf(() => {
			timeout1.kill();
		}, 500);

		var timeout3 = timeoutRaf(() => {
			assert.equal(v, 1);
			done();
		}, 1500);
	});

	it('should fire immediately when told to', function(done) {
		var v = 1;

		var timeout1 = timeoutRaf(() => {
			v = 2;
		}, 1500);

		timeoutRaf(() => {
			timeout1.fire();
			assert.equal(v, 2);
			done();
		}, 1000);
	});
});
