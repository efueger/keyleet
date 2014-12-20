# Keyleet

## Library to delete keys from objects.

[![Build Status](https://travis-ci.org/jkaan/keyleet.svg?branch=master)](https://travis-ci.org/jkaan/keyleet)

### Installation
`npm install keyleet`

### Usage

This module exports one object containing three functions: deleteKeys, addKeys and accessValueByString, example of using this library is shown below.

#### AddKeys & DeleteKeys

The documentation for the deleteKeys & addKeys method is basically the same, the examples apply to both functions but deleteKeys is used as an example.

```js
var keyleet = require('keyleet');

var object = {
    data: {
        name: 'Testy Test',
        firstName: 'Testy',
        lastName: 'Test'
    }
};

var modifiedObject = keyleet.deleteKeys(object, {data: {name: ''}}); // Returns object not containing name attribute in the data array anymore.
```

### Things to note

First parameter passed to the function should always be an object literal for now.

The second object describes which keys you would like removed from the object. These can be four of the following options:

* String in the form of: `key.nestedkey`. Example for the above object would be: `'data.name'`

* Object containing the keys, example for the above object would be:

```js
var removeKeysObject = {
    data: {
        name: ''
    }
}
```

The values of these keys don't matter, can be either null or some value.

* Array containing strings described in number 1. Example would be: `['data.name', 'data.firstName']`

* Array containing objects described in number 2. Example for above object would be:

```js
var arrayOfRemoveKeysObjects = [
    {
        data: {
            name: ''
        }
    },
    {
        data: {
            firstName: ''
        }
    }
]
```

* Array containing both strings and object described in number 1 & 2. Example for above object would be:

```js
var mixedArrayOfRemoveKeys = [
    'data.name',
    {
        data: {
            firstName: ''
        }
    },
    'data.lastName'
];
```

#### AccessValueByString
If you have an object with several nested keys it can be hard to directly access the values of those nested keys.

This function makes it easy to do so and works as following:

```js
var keyleet = require("keyleet");

var object = {
    data: {
        personalInfo: {
            name: {
                firstName: 'Testy'
                }
        }
    }
};

// Access nested property
var value = keyleet.accessValueByString(object, 'data.personalInfo.name.firstName');

// Access top level key
var dataArray = keyleet.accessValueByString(object, 'data');
```

**To note:** Accessing a nested key which value resolves to an array will return undefined, not yet supported.