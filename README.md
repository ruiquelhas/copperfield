# copperfield
Server-level [houdin](https://github.com/ruiquelhas/houdin) validation for [hapi](https://github.com/hapijs/hapi).

[![NPM Version][fury-img]][fury-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Dependencies][david-img]][david-url]

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
- [Supported File Types](#supported-file-types)

## Installation
Install via [NPM](https://www.npmjs.org).

```sh
$ npm install copperfield
```

## Usage

Register the package as a server plugin to enable validation for each route that parses — `parse: true` — and reads the request payload into memory — `output: 'data'`. For every other route with a different configuration, the validation is skipped.

If the validation fails, a [joi](https://github.com/hapijs/joi)-like `400 Bad Request` error is returned alongside an additional `content-validation: failure` response header. If everything is ok, the response will ultimately contain a `content-validation: success` header.

### Example

```js
const Hapi = require('hapi');
const Copperfield = require('copperfield');

server = new Hapi.Server();
server.connection({
    // go nuts
});

const plugin = {
    register: Copperfield,
    options: {
      // Allow png files only
      whitelist: ['png']
    }
};

server.register(plugin, (err) => {

    server.route({
        config: {
            payload: {
                output: 'data',
                parse: true
            }
            // go nuts
        }
    });

    server.start(() => {
        // go nuts
    });
});
```

## Supported File Types

The same as [magik](https://github.com/ruiquelhas/magik#supported-file-types).

[coveralls-img]: https://coveralls.io/repos/ruiquelhas/copperfield/badge.svg
[coveralls-url]: https://coveralls.io/github/ruiquelhas/copperfield
[david-img]: https://david-dm.org/ruiquelhas/copperfield.svg
[david-url]: https://david-dm.org/ruiquelhas/copperfield
[fury-img]: https://badge.fury.io/js/copperfield.svg
[fury-url]: https://badge.fury.io/js/copperfield
[travis-img]: https://travis-ci.org/ruiquelhas/copperfield.svg
[travis-url]: https://travis-ci.org/ruiquelhas/copperfield
