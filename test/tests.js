"use strict";

var assert = require("assert");
var should = require('should');
var keyleet = require("../keyleet.js");

var object = {
    data: {
        name: 'Testie Test',
        firstName: 'Testie',
        lastName: 'Test',
        profile: {
            address: 'Test Street'
        }
    }
};

describe('delKey', function() {
    it('shall check if deleteKeys parameter 1 is object', function() {
            try {
                keyleet.deleteKeys('test', 'data.test');
                assert.fail('First parameter not object should throw error');
            } catch (ex) {
                ex.should.not.be.equal(null);
            }
        }
    );

    it('shall check if deleteKeys parameter 2 is not provided throws error', function() {
        try {
            keyleet.deleteKeys({});
            assert.fail('No second parameter should throw error');
        } catch (ex) {
            ex.should.not.be.equal(null);
        }
    });

    it('shall check if deleteKeys correctly working if second parameter is object literal', function() {
        var returnedObject = keyleet.deleteKeys(object, {data: {name: ''}});

        assert.equal(returnedObject.data.name, undefined, 'key should be deleted');
    });

    it('shall check if deleteKeys correctly working if second parameter is string', function() {
        var returnedObject = keyleet.deleteKeys(object, 'data.name');

        assert.equal(returnedObject.data.name, undefined, 'key should be deleted');
    });

    it('shall check if deleteKeys correctly working if second parameter is array of object literals', function() {
        var returnedObject = keyleet.deleteKeys(object, [{data: {name: ''}}, {data: {firstName: ''}}]);

        assert.equal(returnedObject.data.name, undefined, 'key should be deleted');
        assert.equal(returnedObject.data.firstName, undefined, 'key should be deleted');
    });

    it('shall check if deleteKeys correctly working if second parameter is array of strings', function() {
        var returnedObject = keyleet.deleteKeys(object, ['data.name', 'data.firstName']);

        assert.equal(returnedObject.data.name, undefined, 'key should be deleted');
        assert.equal(returnedObject.data.firstName, undefined, 'key should be deleted');
    });

    it('shall check if deleteKeys correctly working if second parameter is array of both object literal and strings', function() {
        var returnedObject = keyleet.deleteKeys(object, [{data: {name: ''}}, 'data.firstName']);

        assert.equal(returnedObject.data.name, undefined, 'key should be deleted');
        assert.equal(returnedObject.data.firstName, undefined, 'key should be deleted');
    });

    it('shall check if accessValueByString method correctly works if nested key should be retrieved', function() {
        var value = keyleet.accessValueByString(object, 'data.firstName');

        assert.equal(value, 'Testie', 'Value should be equal to Testie');
    });

    it('shall check if accessValueByString method correctly works if normal key should be retrieved', function() {
        var value = keyleet.accessValueByString(object, 'data');

        assert.deepEqual(value, {name: 'Testie Test', firstName: 'Testie', lastName: 'Test', profile: {address: 'Test Street'}});
    });

    it('shall check if accessValueByString method correctly works if nested key is retrieved which resolves to array', function() {
        var value = keyleet.accessValueByString(object, 'data.profile');

        assert.deepEqual(value, {address: 'Test Street'});
    });

    it('shall check if addKeys parameter 1 is object', function() {
            try {
                keyleet.addKeys('test', 'data.test');
                assert.fail('First parameter not object should throw error');
            } catch (ex) {
                ex.should.not.be.equal(null);
            }
        }
    );

    it('shall check if addKeys parameter 2 is not provided is correctly working', function() {
        try {
            keyleet.deleteKeys({});
            assert.fail('No second parameter should throw error');
        } catch (ex) {
            ex.should.not.be.equal(null);
        }
    });

    it('shall check if addKeys correctly working if second parameter is object literal', function() {
        var returnedObject = keyleet.addKeys(object, {data: {test: ''}});

        assert.equal(returnedObject.data.test, '', 'key should be added');
    });

    it('shall check if addKeys correctly working if second parameter is string', function() {
        var returnedObject = keyleet.addKeys(object, 'data.test');

        assert.equal(returnedObject.data.test, '', 'key should be added');
    });

    it('shall check if addKeys correctly working if second parameter is array of object literals', function() {
        var returnedObject = keyleet.addKeys(object, [{data: {test1: ''}}, {data: {test2: ''}}]);

        assert.equal(returnedObject.data.test1, '', 'key should be added');
        assert.equal(returnedObject.data.test2, '', 'key should be added');
    });

    it('shall check if addKeys correctly working if second parameter is array of strings', function() {
        var returnedObject = keyleet.addKeys(object, ['data.test1', 'data.test2']);

        assert.equal(returnedObject.data.test1, '', 'key should be added');
        assert.equal(returnedObject.data.test2, '', 'key should be added');
    });

    it('shall check if addKeys correctly working if second parameter is array of both object literal and strings', function() {
        var returnedObject = keyleet.addKeys(object, [{data: {test1: ''}}, 'data.test2']);

        assert.equal(returnedObject.data.test1, '', 'key should be added');
        assert.equal(returnedObject.data.test2, '', 'key should be added');
    });
});