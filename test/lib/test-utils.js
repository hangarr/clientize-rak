/**
 * Some utils to make it easier to test Rak functions
 */
;(function() {
	'use strict';
	
	var Promise = require('es6-promise').Promise
	  , Q = require('kew')
	  , rak = require('../../rak')
	  , util = require('util');

	var testUtils = {};
	
	testUtils.cb = function testUtils$cb(deferred) {
		var _deferred = deferred;
		return function(err, result) {
			if(!err)
				if(typeof result !== 'undefined')
					_deferred.resolve(result);
				else
					_deferred.resolve('resolved');
			else
				_deferred.reject('rejected');
		};
	};
	
	testUtils.fn = function testUtils$fn(condition, cb, tdelay) {
		var _cb = cb;
		var _condition = condition;
		var _tdelay = tdelay;
		return function(result) {
			setTimeout(function() {
				if(_condition)
					_cb(null, result);
				else
					_cb('fail', null);
			
			}, _tdelay);
		};
	};
	
	testUtils.delay = function testUtils$delay(mu, sigma) {
		var _mu = mu;
		var _sigma = sigma;
		return function() {
			var x = sigma * (Math.random() - 0.5);
			return mu + (x < 0 ? Math.ceil(x) : Math.floor(x));
		};
	};

	// Returns a promise wrapped around a function w/ a callback
	testUtils.promiseCallback = function(value, tdelay) {
		var _value = value;
		var _tdelay = tdelay;
		return function(result) {
			var promise = new Promise(function(resolve, reject) {
				testUtils.fn(_value, testUtils.cb({resolve: resolve, reject: reject}), _tdelay)(result);
			});
			return promise;
		};
	};

	// Returns a promise wrapped around a function w/ a callback wrapped around a deferred
	testUtils.deferredCallback = function(value, tdelay) {
		var _value = value;
		var _tdelay = tdelay;
		return function(result) {
			var deferred = rak.deferred();
			testUtils.fn(_value, testUtils.cb(deferred), _tdelay)(result);
			return deferred.promise;
		};
	};
	
	// Returns a promised wrapped around a Q-promise wrapped around a deferred
	testUtils.deferredQPromise = function(value, tdelay) {
		var _value = value;
		var _tdelay = tdelay;
		return function(result) {
			var deferred = rak.deferred();
			var q = Q.defer();
			testUtils.fn(_value, q.makeNodeResolver(), _tdelay)(result);
			q.promise
			.then(function(result){
				deferred.resolve('resolved');
			})
			.fail(function(fail) {
				deferred.reject('rejected');
			});

			return deferred.promise;
		};
	};

	// Returns a promised wrapped around a Q-promise
	testUtils.promiseQPromise = function(value, tdelay) {
		var _value = value;
		var _tdelay = tdelay;
		return function(result) {
			var q = Q.defer();
			testUtils.fn(_value, q.makeNodeResolver(), _tdelay)(result);
			return rak.promiseQ(q.promise);
		};
	};

	module.exports = testUtils;

}).call(this);