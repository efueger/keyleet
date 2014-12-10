"use strict";

var InvalidInputException = function(message) {
    this.name = "InvalidInputException";
    this.message = message;
};

var isArray = function(possibleArray) {
    return (!!possibleArray) && (possibleArray.constructor == Array);
};

/**
 * Checks if possibleString is a string.
 *
 * To note: Doesn't correctly function for object-wrapped strings. ex: new String('test')
 *
 * @param possibleString
 * @returns {boolean}
 */
var isString = function(possibleString) {
    return typeof possibleString === 'string';
};

/**
 * Function only matches object literal, not any custom made object or something.
 *
 * @param possibleObject
 * @returns {boolean}
 */
var isObject = function(possibleObject) {
    return (!!possibleObject) && (possibleObject.constructor === Object);
};

var getAllKeysForObject =  function(object, prefixKey, arrayOfValues) {
    arrayOfValues = arrayOfValues || [];
    var prefix = prefixKey || undefined;
    if (object) {
        for (var property in object) {
            if (typeof object[property] == "object") {
                var methodProperty = "";
                if (typeof prefix !== 'undefined') {
                    methodProperty += prefix + ".";
                }
                methodProperty += property;
                getAllKeysForObject(object[property], methodProperty, arrayOfValues);
            } else if (typeof object[property] != "function") {
                var valueProperty = "";
                if (typeof prefix !== 'undefined') {
                    valueProperty += prefix + ".";
                }
                valueProperty += property;
                arrayOfValues[valueProperty] = object[property];
            }
        }
    }
    return arrayOfValues;
};

var toMultiLayeredObject = function (data) {
    var result = {};
    Object.keys(data).forEach(function (key) {
        var value = data[key];
        var keyParent = key.split(".")[0];
        var keyChild = key.split(".")[1];

        if (!result[keyParent]) {
            result[keyParent] = {};
        }

        if (!keyChild) {
            result[keyParent] = value;
            return;
        }

        result[keyParent][keyChild] = value;
    });

    return result;
};

var processObject = function(dotArray, removeCondition) {
    var dotArrayOfKeys = getAllKeysForObject(removeCondition);

    for (var key1 in dotArray) {
        for (var key2 in dotArrayOfKeys) {
            if (dotArray.hasOwnProperty(key2)) {
                delete dotArray[key2];
            }
        }
    }

    return toMultiLayeredObject(dotArray);
};

var processString = function(dotArray, removeConditionString) {
    if (dotArray.hasOwnProperty(removeConditionString)) {
        delete dotArray[removeConditionString];
    }

    return toMultiLayeredObject(dotArray);
};

var deleteKeys = function(object, removeConditions) {
    // First parameter should always be object
    if (!(isObject(object))) {
        throw new InvalidInputException('First parameter should be object literal');
    }

    if (typeof removeConditions === 'undefined') {
        throw new InvalidInputException('Second parameter should be provided');
    }

    var dotArray = getAllKeysForObject(object);

    // From now on removeConditions will be checked, a few options are possible:
    // 1. Object literal containing keys and possibly values which should be removed from the object
    // 2. Array containing a bunch of number 1.
    // 3. String in the form of key.nestedkey which will delete the keys from an object
    // 4. Array containing number 3.

    // Number 3
    if (isString(removeConditions)) {
        return processString(dotArray, removeConditions);
    }

    // Number 1
    if (isObject(removeConditions)) {
        return processObject(dotArray, removeConditions);
    }

    if (isArray(removeConditions)) {
        for (var i = 0, length = removeConditions.length; i < length; ++i) {
            var removeCondition = removeConditions[i];

            // Number 2
            if (isObject(removeCondition)) {
                processObject(dotArray, removeCondition);
            }

            if (isString(removeCondition)) {
                processString(dotArray, removeCondition);
            }
        }

        return toMultiLayeredObject(dotArray);
    }
};

module.exports = deleteKeys;