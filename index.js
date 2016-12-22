'use strict';

/**
 * Bare-bones animation-friendly cancelable timeouts via requestAnimationFrame
 * @module timeoutRaf
 * @return {timeoutRaf} - Instance factory
 */
module.exports = (function () {
	/**
	 * @class Ticker
	 * @classdesc Simple object to keep a clean self-reference to itself
	 *
	 * @param {Function} fn - Function to be called upon timeout
	 * @param {Number} del - Timeout duration (delay)
	 * @param {Object} ctx - Context to run fn within
	 */
	function Ticker(fn, del, ctx) {
		this.start = Date.now();
		this.context = ctx;
		this.delay = del;
		this.func = fn;

		this._tick = this._tick.bind(this);
		this.kill = this.kill.bind(this);

		this.id = requestAnimationFrame(this._tick);
	}

	/**
	 * Kills the timeout without firing this.func
	 * @return {Null}
	 */
	Ticker.prototype.kill = function () {
		cancelAnimationFrame(this.id);

		this.context = null;
		this.func = null;
		this.id = null;
	};

	/**
	 * Calls this.func immediately,
	 * @return {Null}
	 */
	Ticker.prototype.fire = function () {
		this.func.call(this.context);
		this.kill();
	};

	/**
	 * @private _tick
	 * Internal tick method to ascertain updated request ID
	 * @return {Null}
	 */
	Ticker.prototype._tick = function () {
		if ((Date.now() - this.start) >= this.delay) {
			this.func.call(this.context);
			this.kill();
		} else {
			this.id = requestAnimationFrame(this._tick);
		}
	};

	/**
	 * @function
	 * requestAnimationFrame-powered timeout functionality
	 *
	 * @param  {Function} fn - Function to be called upon timeout
	 * @param  {Number} del - Timeout duration (delay)
	 * @param  {Object} ctx - Context to run fn within
	 * @return {Object} Ticker
	 */
	return function (fn, del, ctx) {
		return new Ticker(fn, del, ctx);
	};
})();
