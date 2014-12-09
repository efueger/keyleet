"use strict"

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
                this.getAllKeysForObject(object[property], methodProperty, arrayOfValues);
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

var deleteKeys = function(object1, object2) {
    if (Object.prototype.toString.call(object1) === '[object Object]') {
        var dotArray1 = getAllKeysForObject(object1);
    }

    if (Object.prototype.toString.call(object2) === '[object Object]') {
        var dotArray2 = getAllKeysForObject(object2);
    }

    for (var key1 in dotArray1) {
        for (var key2 in dotArray2) {
            if (dotArray1.hasOwnProperty(key2)) {
                delete dotArray1[key2];
            }
        }
    }

    return toMultiLayeredObject(dotArray1);
};

module.exports = deleteKeys;