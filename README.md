![100% test coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

# timeout-raf
> Bare-bones animation-friendly cancelable timeouts via requestAnimationFrame

Provides the familiarity of `setTimeout`, but via `requestAnimationFrame`.
Deferred callbacks can be fired immediately or killed. 
See "usage" below.


#### Important to consider
The `requestAnimationFrame` approach means your callbacks will likely not fire exactly when you originally instructed.
If things are running at a smooth 60fps, callbacks should generally fire within 16ms of being told to.
Run the tests to see typical results.


## Installation
Install via npm.

```sh
$ npm i timeout-raf
```


## Usage
Require the module - it exposes a single factory function (so there's no need to instantiate instances).
Call as you would `window.setTimeout`, passing a callback and duration.

```js
var timeout = require('timeout-raf');

// typical usage; console.log is called after 1s
timeout(function () {
  console.log('1 second later...');
}, 1000);
```


### Passing context as a parameter
You can pass context via an optional third parameter, allowing you to define the context of the callback.

```js
var awesomeObject = {awesome: 'clearly'};

// logs `clearly` after (about) 1 second
timeout(function () {
  console.log(this.awesome);
}, 1000, awesomeObject);
```


### Passing context normally
You can also pass context per usual by binding the callback to any object.

```js
var awesomeObject = {awesome: 'clearly'};

// also logs `clearly` after (about) 1 second
timeout(function () {
  console.log(this.awesome);
}.bind(awesomeObject), 1000);
```


### Killing a timeout
Keep a reference to the timeout and then call its `kill()` method to prevent it from ever firing its callback.

```js
// never writes to the console...
var to = timeout(function () {
  console.log('I am never heard from again');
}, 1000);

to.kill();
```


### Impatient-friendly
You can tell a timeout to fire its callback at any time earlier than originally requested.
Keep a reference to the timeout and call its `fire` method if you get antsy.
The callback will fire immediately, and never again. 

```js
// fired after 1 second and never again
var to = timeout(function () {
  console.log('I could only wait a second!');
}, 2000);

timeout(function () {
  to.fire();
}, 1000);
```


## Tests

Tests can be run in-browser via `npm test`.
