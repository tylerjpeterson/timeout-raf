/* global describe, it, assert, timeoutRaf */
'use strict';

const test = require('tape');
const timeoutRaf = require('./../../');

/**
 * timeoutRaf mocha tests
 * @see https://mochajs.org/
 */

test('should be a function', assert => {
	assert.equal(typeof timeoutRaf, 'function');
	assert.end();
});

test('should fire when expected', assert => {
	var t = Date.now();
	var e = 0;

	timeoutRaf(() => {
		var diff = e - t < 100;
		assert.equal(diff, true);
		assert.end();
	}, 1000);
});

test('should keep context', assert => {
	var ctx = {
		testprop: 'exists'
	};

	timeoutRaf(function () {
		assert.equal(this.testprop, 'exists');
		assert.end();
	}, 1000, ctx);
});

test('should keep traditional context', assert => {
	var ctx = {testprop: 'exists'};

	timeoutRaf(function()  {
		assert.equal(this.testprop, 'exists');
		assert.end();
	}.bind(ctx), 1000);
});

test('should be killable', assert => {
	var v = 1;

	var timeout1 = timeoutRaf(() => {
		v = 2;
	}, 1000);

	var timeout2 = timeoutRaf(() => {
		timeout1.kill();
	}, 500);

	var timeout3 = timeoutRaf(() => {
		assert.equal(v, 1);
		assert.end();
	}, 1500);
});

test('should fire immediately when told to', assert => {
	var v = 1;

	var timeout1 = timeoutRaf(() => {
		v = 2;
	}, 1500);

	timeoutRaf(() => {
		timeout1.fire();
		assert.equal(v, 2);
		assert.end();
		setTimeout(() => {
			window.close();
		}, 1000);
	}, 1000);
});
