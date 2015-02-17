# Clientize-Rak
Utilities to make working with ES6 promises easier

## Promise overview.
[ECMAScript 6 promises](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects) are a subset of the [Promises/A+](https://promisesaplus.com/) specification. The [Promise.js proposal](https://www.promisejs.org) provides some additional info.

`Clientize-Rak` can use the [bluebird](),  [es6-promises](https://www.npmjs.com/package/es6-promise), or any other ECMAScript6 style package in ECMAScript5. To install and use
```
var Promise = require('es6-promise').Promise;
var Promise = require('bluebird');
```
The package has a convenience method to convert the AngularJS $q promise to an ES6 promise
```
var Promise = require('clientize-rak').angular($q);
```

An ES6 Promise is created with the `Promise(executor)` constructor that accepts an executor `function()` as an argument:
```
var promise = new Promise(function(resolve, reject) {
    // Do some stuff, promise remains "unfulfilled" until finished
    ...

    // If successful, result is returned as 
    resolve(result);
    ...

    // If unsucessful, fail reason is returned as
    reject(fail);
    ...
});
```

A promise has a `.then()` method that is used to catch the `resolve`ed and `reject`ed result state of the fullfilled promise:
```
promise
.then(function(result) {
   // Do processing for resolved promise here
   ...
}, function(fail) {
   // Do processing for rejected promise here
   ...
})
.then( ... );   // Chained `.then()`
```
The object returned by the `then()` method depends on whether the "resolved" or "rejected" handler was invoked and the value it returns. For full details see the [Promises/A+](https://promisesaplus.com/) specification.  In summary the relevant cases are:
<ol>
<li>If the handler ends without an explicit `return()` (i.e. returns 'undefined'), `.then()` returns a new promise fulfilled in the same way and with the same value as the parent promise.</li>
<li>If the handler explicitly ends with `return(nonThenable)`, `then()` returns a new promised with the `nonThenable` value fulfilled on the returned value.</li>
<li> If the handler explicitly ends with `return(thenable)` (e.g. typically a new promise), `then()` returns that promise.</li>
</ol>
An object or function is "thenable" if it includes a `.then()` method

## Use
`Clientize-Rak` can use the [bluebird](),  [es6-promises](https://www.npmjs.com/package/es6-promise), or any other ECMAScript6 style package in ECMAScript5. To install and use
```
var rak = require('clientize-rak')(require('es6-promise').Promise);
var rak = require('clientize-rak')(require('bluebird'));
```
When ECMAScript 6 becomes available, just use
```
var rak = require('clientize-rak')();
```

Although not yet tested, the package should also work in AngularJS browser clients, by substituting
```
var rak = require('clientize-rak')(require('clientize-rak').angular($q));
```

## Core functions
Much more functionality will be added. For now the core functionality includes two functions.
### rak.promiseQ(q)
Wraps an ES6 promise around a Q/kew-style promise:
```
var Q = require('kew');
var rak = require('clientize-rak')(require('bluebird'));

var defer = Q.defer()
// Rest of the "defer" coding

var promise = rak.promiseQ(defer);
```

### rak.deferred()
Creates a Q-style deferred from an ES6 promise
```
var rak = require('clientize-rak')(require('bluebird'));

var defer = rak.deferred();
```
A deferred is an object with three members
```
{
    promise: new Promise( ... ),
    resolve: function(result) { ... } // The captured "resolve" function
    reject: function(fail) { ... }    // The captured "reject" function
}
```

## Multi-promise Sequencers
The multi-promise sequencers coordinate execution of a sequence of cascadeable factory-like functions ("promisers") that return promises and then returns a promise that is fulfilled with an array of results or a fail message.
```
// The outer factory function captures promiser configuration options
var promiserFactory = function(options) {
	var _options = options;
	...
	// Optional additional configuration processing
	...

    // The returned function is a "promiser"
	return function(input) {
		...
		// optional additional runtime processing
		...
		return Promise(function(resolve, reject) {
		    ...
		    // successful operation
		    resolve(result);
		    ...
		    // unsuccessful operation
		    reject(fail)
		});
	};
};
```

### rak.series(promisers, [inputs])
The `rack.series()` sequencer accepts an array of promises and an optional set of inputs and then invokes the promisers sequentially.
```
// build the array of promisers in some fashion, e.g.
var promisers = [];
for(var i=0; i<TOTAL_PROMISERS; i++) {
    promisers.push(promiserFactory(options));
}

rak.series(promisers)
.then(function(results) {
    ...
    // "results" array is same length as "promisers" array
    ...
}, function(fail) {
    ...
    // "fail" is whatever fail result the first rejected promise returns
    ...
});
```
This basic form doesn't pass any input (i.e. the input is 'undefined') to the promisers when they are invoked. 

When invoked with a non-array `input` as
```
rak.series(promisers, input).then(...);
```
the sequencer passes the `input` to the first promiser and invokes the rest of the promisers in waterfall fashion.  That is, the resolved value of a promise is passed as input to the next promiser.

When the sequencer is invoked with an array of inputs:
```
rak.series(promisers, inputs).then(...);
```
each promiser in the `promisers` is provided with the corresponding input from the `inputs` array.  If the `inputs` array is shorter than the `promisers` array the promise returned by the `rak.series()` sequencer is rejected.

### rak.parallel(promisers, [inputs])
The parallel sequencer executes the `promisers` in parallel and returns a promise that is resolved when all of the promisers are resolved or one is rejected.
```
// build the array of promisers in some fashion, e.g.
var promisers = [];
for(var i=0; i<TOTAL_PROMISERS; i++) {
    promisers.push(promiserFactory(options));
}

rak.parallel(promisers)
.then(function(results) {
    ...
    // "results" array is same length as "promisers" array
    ...
}, function(fail) {
    ...
    // "fail" is whatever fail result the first rejected promise returns
    ...
});
```
When no inputs or an `inputs` array is provide, each promiser is provided with no input or the corresponding input from the `inputs` array as for the `rak.series()` sequencer. 

If the sequencer is invoked with a non-array `input`
```
rak.parallel(promisers, input).then(...);
```
the sequencer passes that `input` to all of the promisers when they are invoked.

