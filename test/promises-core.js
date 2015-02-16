/**
 * Single promise tests
 */
;(function() {
	var assert = require('assert')
	  , testUtils = require('./lib/test-utils.js');
	
	// Delay generator for setTimeout() based promises
	var tdelayGen = testUtils.delay(100, 50);
	
	// Test the supplied promise object with a standard callback example
	describe('promise', function() {
		describe('callback', function() {
			it('should show resolved', function(done) {
				var promise = testUtils.promiseCallback(true, tdelayGen())();
				promise.then(function(result) {
					assert(true, result + ' when should have been resolved');
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});
			
			it('should show rejected', function(done) {
				var promise = testUtils.promiseCallback(false, tdelayGen())();
				promise.then(function(result) {
					assert(false, result + ' when should have been rejected');
				}, function(fail) {
					assert(true, fail + ' when should have been rejected');
				}).then(done, done);
			});
		});		
	});

	// Test the deferred with a standard callback example
	describe('deferred', function() {
		describe('callback', function() {
			it('should show resolved', function(done) {
				var promise = testUtils.deferredCallback(true, tdelayGen())();
				promise.then(function(result) {
					assert(true, result + ' when should have been resolved');
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});
			
			it('should show rejected', function(done) {
				var promise = testUtils.deferredCallback(false, tdelayGen())();
				promise.then(function(result) {
					assert(false, result + ' when should have been rejected');
				}, function(fail) {
					assert(true, fail + ' when should have been rejected');
				}).then(done, done);
			});
		});		
	});
	
	// Test the deferred with a q/kew style promise example
	describe('deferred', function() {
		describe('q-promise', function() {
			it('should show resolved', function(done) {
				var promise = testUtils.deferredQPromise(true, tdelayGen())();
				promise.then(function(result) {
					assert(true, result + ' when should have been resolved');
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});
			
			it('should show rejected', function(done) {
				var promise = testUtils.deferredQPromise(false, tdelayGen())();
				promise.then(function(result) {
					assert(false, result + ' when should have been rejected');
				}, function(fail) {
					assert(true, fail + ' when should have been rejected');
				}).then(done, done);
			});
		});		
	});
	
	// Test the promise with a q/kew style promise example
	describe('promise', function() {
		describe('q-promise', function() {
			it('should show resolved', function(done) {
				var promise = testUtils.promiseQPromise(true, tdelayGen())();
				promise.then(function(result) {
					assert(true, result + ' when should have been resolved');
				}, function(fail) {
					assert(false, fail + ' when should have been resolved');
				}).then(done, done);
			});
			
			it('should show rejected', function(done) {
				var promise = testUtils.promiseQPromise(false, tdelayGen())();
				promise.then(function(result) {
					assert(false, result + ' when should have been rejected');
				}, function(fail) {
					assert(true, fail + ' when should have been rejected');
				}).then(done, done);
			});
		});		
	});

}).call(this);
