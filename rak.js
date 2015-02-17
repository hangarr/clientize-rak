;(function() {
	'use strict';

	// Return Rak functions from wrapper function after configuration
	module.exports = function(promiseMod) {

		var Q = require('kew')
		  , util = require('util');

		if(promiseMod)
			var Promise = promiseMod;
		
		// technique underscore uses to return an independent object rather than
		// var Rak = {};
		var Rak = function(obj) {
		    if (obj instanceof Rak) return obj;
		    if (!(this instanceof Rak)) return new Rak(obj);
		    this.RakWrapped = obj;
		};
		
	/*	
		// Crockford's .bind for pre-ECMAScript5 browsers
	    if (!Function.prototype.bind) {
	    	console.log('Attaching function.bind() because browser for preECMAScript 5 browser');
	        Function.prototype.bind = function (oThis) {
	        	if (typeof this !== "function") {
	        		// closest thing possible to the ECMAScript 5 internal isCallable function
	        		throw new TypeError ("Function.prototype.bind - trying to bind something that is not callable");
	        	};

				var aArgs = Array.prototype.slice.call (arguments, 1), fToBind = this, 
					fNOP = function () {},
	            	fBound = function () {
						return fToBind.apply ((this instanceof fNOP && oThis ? this : oThis), 
								aArgs.concat (Array.prototype.slice.call (arguments)));
					};

				fNOP.prototype = this.prototype;
				fBound.prototype = new fNOP ();

				return fBound;
	        };
	    };
	*/
	    // Creates a deferred wrapped around an ES6 promise
		Rak.deferred = function() {
			var deferred = {};
			deferred.promise = new Promise(function(resolve, reject) {
				deferred.resolve = resolve;
				deferred.reject = reject;
			});
			
			return deferred;
		};

		// Converts a Q promise to an ES6 promise
		// Callback needed to bind the Q-promise
		Rak.promiseQ = function(qp) {
			return new Promise(function(resolve, reject) {
				var _qp = qp;
				var _resolve = resolve;
				var _reject = reject;
				
				_qp
				.then(function(result) {
					_resolve(result);
				})
				.fail(function(fail) {
					_reject(fail);
				});	    		
	    	});
		};


		// Get constructor names for each of the objects that can be constructed
		var constructors = {};
		constructors[Rak.deferred().promise.constructor.name] = true;
		constructors[Rak.promiseQ(Q.defer()).constructor.name] = true;

		// Parallel promises pattern extended from Promise.js "Parallel.all()" pattern
		// https://www.promisejs.org/patterns/
		Rak.parallel = function(promisers, values) {		
			if(!Array.isArray(promisers))
				throw new TypeError('Must supply an array of functions that return promises');
			
			// initiate all promises in parallel
			var promises = [];
			var promise;
			for(var i=0; i<promisers.length; i++) {
				(function(k) {
					if(Array.isArray(values))
						promise = promisers[k](values[k]);
					else if(typeof values !== 'undefined')
						promise = promisers[k](values);
					else
						promise = promisers[k]();

					if(typeof constructors[promise.constructor.name] === 'undefined' 
							|| !constructors[promise.constructor.name])
						throw new TypeError('Argument array item is not a Promise');
					promises.push(promise);
				})(i);
			};

			return Promise.all(promises);
		};
		
		// Series pattern is a Waterfall pattern
		Rak.series = function(promisers, values) {		
			if(!Array.isArray(promisers))
				throw new TypeError('Must supply an array of functions that return promises');
			
			// initiate all promises in parallel
			var promises = [];
			var promiseZ = Promise.resolve(null);
			var promise;
			for(var i=0; i<promisers.length; i++) {
				(function(k) {
					promiseZ = promiseZ.then(function(result) {
						if(Array.isArray(values))
							promise = promisers[k](values[k]);
						else if(typeof values !== 'undefined') {
							if(k == 0)
								promise = promisers[k](values);
							else
								promise = promisers[k](result);
						}
						else
							promise = promisers[k]();

						if(typeof constructors[promise.constructor.name] === 'undefined' 
								|| !constructors[promise.constructor.name])
							throw new TypeError('Argument array item is not a Promise');
						promises.push(promise);
						return promise;
					});
				})(i);
			};

			return promiseZ.then(function() {
				return Promise.all(promises);
			});
		};

		return Rak;
	};
	
}).call(this);
