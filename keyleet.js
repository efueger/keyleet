"use strict";

var InvalidInputException = function (message) {
    this.name = "InvalidInputException";
    this.message = message;
};

/**
 * Checks if possibleString is a string.
 *
 * Works for primitive-type strings and also for object-wrapped strings.
 *
 * @param possibleString
 * @returns {boolean}
 */
var isString = function (possibleString) {
    return (!!possibleString) && (possibleString.constructor === String);
};
/**
 * Function only matches object literal, not any custom made object that has a different constructor than Object.
 *
 * @param possibleObject
 * @returns {boolean}
 */
var isObject = function (possibleObject) {
    return (!!possibleObject) && (possibleObject.constructor === Object);
};

/**
 * Checks if posibleArray is an array
 *
 * @param possibleArray
 * @returns {boolean}
 */
var isArray = function (possibleArray) {
    return (!!possibleArray) && (possibleArray.constructor === Array);
};

var getAllKeysForObject = function (object, prefixKey, arrayOfValues) {
    arrayOfValues = arrayOfValues || [];
    var prefix = prefixKey || undefined;

    if (!object) {
        return arrayOfValues;
    }

    for (var property in object) {
        var objectProperty = "";

        if (typeof prefix !== 'undefined') {
            objectProperty += prefix + ".";
        }

        objectProperty += property;

        if (typeof object[property] == "object") {
            getAllKeysForObject(object[property], objectProperty, arrayOfValues);
        } else if (typeof object[property] != "function") {
            arrayOfValues[objectProperty] = object[property];
        }
    }
    return arrayOfValues;
};

var toMultiLayeredObject = function (objectToTransform) {
    var result = {};

    var objectKeys = Object.keys(objectToTransform);

    for (var i = 0, length = objectKeys.length; i < length; ++i) {
        var currentKey = objectKeys[i];
        var value = objectToTransform[currentKey];
        var keyParent = currentKey.split(".")[0];
        var keyChild = currentKey.split(".")[1];

        if (!result[keyParent]) {
            result[keyParent] = {};
        }

        if (!keyChild) {
            result[keyParent] = value;
            return;
        }

        result[keyParent][keyChild] = value;
    }

    return result;
};

var processDeleteObject = function (dotArray, removeConditionObject) {
    var dotArrayOfKeys = getAllKeysForObject(removeConditionObject);

    for (var key in dotArrayOfKeys) {
        if (dotArray.hasOwnProperty(key)) {
            delete(dotArray[key]);
        }
    }

    return toMultiLayeredObject(dotArray);
};

var processDeleteString = function (dotArray, removeConditionString) {
    if (dotArray.hasOwnProperty(removeConditionString)) {
        delete dotArray[removeConditionString];
    }

    return toMultiLayeredObject(dotArray);
};

var processAddString = function (dotArray, addConditionString) {
    if (dotArray.hasOwnProperty(addConditionString)) {
        return toMultiLayeredObject(dotArray);
    }

    dotArray[addConditionString] = '';

    return toMultiLayeredObject(dotArray);
};

var processAddObject = function (dotArray, addConditionObject) {
    var dotArrayOfKeys = getAllKeysForObject(addConditionObject);

    for (var key in dotArrayOfKeys) {
        if (!dotArray.hasOwnProperty(key)) {
            dotArray[key] = '';
        }
    }

    return toMultiLayeredObject(dotArray);
};

var keyleet = {
    /**
     * Deletes keys from object based on what object and removeConditions have in common
     *
     * @param object
     * @param removeConditions
     */
    deleteKeys: function (object, removeConditions) {
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
            return processDeleteString(dotArray, removeConditions);
        }

        // Number 1
        if (isObject(removeConditions)) {
            return processDeleteObject(dotArray, removeConditions);
        }

        if (isArray(removeConditions)) {
            for (var i = 0, length = removeConditions.length; i < length; ++i) {
                var removeCondition = removeConditions[i];

                // Number 2
                if (isObject(removeCondition)) {
                    processDeleteObject(dotArray, removeCondition);
                }

                // Number 4
                if (isString(removeCondition)) {
                    processDeleteString(dotArray, removeCondition);
                }
            }

            return toMultiLayeredObject(dotArray);
        }
    },
    /**
     * Returns a value of an object which is determined by the keyString, returns undefined if no value is found
     *
     * @param object
     * @param keyString Form of: 'key.nestedkey', 'key' also works
     */
    accessValueByString: function (object, keyString) {
        // First parameter should always be object
        if (!(isObject(object))) {
            throw new InvalidInputException('First parameter should be object literal');
        }

        // Check if a dot is not present, then just return the key
        if (keyString.indexOf('.') == -1) {
            return object[keyString];
        }

        var keys = keyString.split(".");

        var currentArrayValue = undefined;

        // Loop over all entries in keys array while traversing through the array until final result is reached
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];

            if (currentArrayValue) {
                currentArrayValue = currentArrayValue[key];
                continue;
            }

            currentArrayValue = object[key];
        }

        return currentArrayValue;
    },
    addKeys: function (object, addConditions) {
        // First parameter should always be object
        if (!(isObject(object))) {
            throw new InvalidInputException('First parameter should be object literal');
        }

        if (typeof addConditions === 'undefined') {
            throw new InvalidInputException('Second parameter should be provided');
        }

        var dotArray = getAllKeysForObject(object);

        // From now on addConditions will be checked, a few options are possible:
        // 1. Object literal containing keys and possibly values which should be added to the object
        // 2. Array containing a bunch of number 1.
        // 3. String in the form of key.nestedkey which will add the keys to an object
        // 4. Array containing number 3.

        // Number 3
        if (isString(addConditions)) {
            return processAddString(dotArray, addConditions);
        }

        // Number 1
        if (isObject(addConditions)) {
            return processAddObject(dotArray, addConditions);
        }

        if (isArray(addConditions)) {
            for (var i = 0, length = addConditions.length; i < length; ++i) {
                var addCondition = addConditions[i];

                // Number 2
                if (isObject(addCondition)) {
                    processAddObject(dotArray, addCondition);
                }

                if (isString(addCondition)) {
                    processAddString(dotArray, addCondition);
                }
            }

            return toMultiLayeredObject(dotArray);
        }
    }
};

module.exports = keyleet;