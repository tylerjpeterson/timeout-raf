'use strict';

const test = require('tape');
const timeoutRaf = require('./../..');

/**
 * TimeoutRaf tape tests
 * @see https://github.com/substack/tape
 */
test('should be a function', assert => {
	assert.equal(typeof timeoutRaf, 'function');
	assert.end();
});

test('should fire when expected', assert => {
	const t = Date.now();
	const e = 0;

	timeoutRaf(() => {
		const diff = e - t < 100;
		assert.equal(diff, true);
		assert.end();
	}, 1000);
});

test('should keep context', assert => {
	const ctx = {
		testprop: 'exists'
	};

	timeoutRaf(function () {
		assert.equal(this.testprop, 'exists');
		assert.end();
	}, 1000, ctx);
});

test('should keep traditional context', assert => {
	const ctx = {testprop: 'exists'};

	timeoutRaf(function () {
		assert.equal(this.testprop, 'exists');
		assert.end();
	}.bind(ctx), 1000);
});

test('should be killable', assert => {
	let v = 1;

	const timeout1 = timeoutRaf(() => {
		v = 2;
	}, 1000);

	timeoutRaf(() => {
		timeout1.kill();
	}, 500);

	timeoutRaf(() => {
		assert.equal(v, 1);
		assert.end();
	}, 1500);
});

test('should fire immediately when told to', assert => {
	let v = 1;

	const timeout1 = timeoutRaf(() => {
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
