# copperfield
Server-level [houdin](https://github.com/ruiquelhas/houdin) validation for [hapi](https://github.com/hapijs/hapi).

[![NPM Version][version-img]][version-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Dependencies][david-img]][david-url] [![Dev Dependencies][david-dev-img]][david-dev-url]

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

try {
    const server = new Hapi.Server();

    await server.register({
        plugin: Copperfield,
        options: {
            // Allow png files only
            whitelist: ['image/png']
        }
    });

    server.route({
        options: {
            payload: {
                output: 'data',
                parse: true
            }
            // go nuts
        }
    });

    await server.start();
}
catch (err) {
    throw err;
}
```

## Supported File Types
The same as [file-type](https://github.com/sindresorhus/file-type/tree/v7.0.0#supported-file-types).

[coveralls-img]: https://img.shields.io/coveralls/ruiquelhas/copperfield.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/ruiquelhas/copperfield
[david-img]: https://img.shields.io/david/ruiquelhas/copperfield.svg?style=flat-square
[david-url]: https://david-dm.org/ruiquelhas/copperfield
[david-dev-img]: https://img.shields.io/david/dev/ruiquelhas/copperfield.svg?style=flat-square
[david-dev-url]: https://david-dm.org/ruiquelhas/copperfield?type=dev
[version-img]: https://img.shields.io/npm/v/copperfield.svg?style=flat-square
[version-url]: https://www.npmjs.com/package/copperfield
[travis-img]: https://img.shields.io/travis/ruiquelhas/copperfield.svg?style=flat-square
[travis-url]: https://travis-ci.org/ruiquelhas/copperfield
