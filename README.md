# Keyleet

## Library to delete keys from objects.

### Installation
`npm install keyleet`

### Usage

This module exports one single function, example of using this library is shown below.

```js
var deleteKeys = require('keyleet');

var object = {
    data: {
        name: 'Testy Test',
        firstName: 'Testy',
        lastName: 'Test'
    }
};

var modifiedObject = deleteKeys(object, {data: {name: ''}}); // Returns object not containing name attribute in the data array anymore.
```

### Things to note

First parameter passed to the function should always be an object literal for now.

The second object describes which keys you would like removed from the object. These can be four of the following options:

1. String in the form of: `key.nestedkey`. Example for the above object would be: `'data.name'`

2. Object containing the keys, example for the above object would be:

```js
var removeKeysObject = {
    data: {
        name: ''
    }
}
```

The values of these keys don't matter, can be either null or some value.

3. Array containing strings described in number 1. Example would be: `['data.name', 'data.firstName']`

4. Array containing objects described in number 2. Example for above object would be:

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

5. Array containing both strings and object described in number 1 & 2. Example for above object would be:

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