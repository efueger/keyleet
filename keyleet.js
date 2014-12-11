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

var processDeleteObject = function(dotArray, removeConditionObject) {
    var dotArrayOfKeys = getAllKeysForObject(removeConditionObject);

    for (var key1 in dotArray) {
        for (var key2 in dotArrayOfKeys) {
            if (dotArray.hasOwnProperty(key2)) {
                delete dotArray[key2];
            }
        }
    }

    return toMultiLayeredObject(dotArray);
};

var processDeleteString = function(dotArray, removeConditionString) {
    if (dotArray.hasOwnProperty(removeConditionString)) {
        delete dotArray[removeConditionString];
    }

    return toMultiLayeredObject(dotArray);
};

var processAddString = function(dotArray, addConditionString) {
    if (dotArray.hasOwnProperty(addConditionString)) {
        return toMultiLayeredObject(dotArray);
    }

    dotArray[addConditionString] = '';

    return toMultiLayeredObject(dotArray);
};

var processAddObject = function(dotArray, addConditionObject) {
    var dotArrayOfKeys = getAllKeysForObject(addConditionObject);

    for (var key1 in dotArray) {
        for (var key2 in dotArrayOfKeys) {
            if (!dotArray.hasOwnProperty(key2)) {
                dotArray[key2] = '';
            }
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
    deleteKeys: function(object, removeConditions) {
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
    accessValueByString: function(object, keyString) {
        // First parameter should always be object
        if (!(isObject(object))) {
            throw new InvalidInputException('First parameter should be object literal');
        }

        // Check if a dot is not present, then just return the key
        if (keyString.indexOf('.') < 1) {
            return object[keyString];
        }

        var dotArray = getAllKeysForObject(object);

        return dotArray[keyString];
    },
    addKeys: function(object, addConditions) {
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