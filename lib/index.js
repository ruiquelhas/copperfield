'use strict';

const Boom = require('boom');
const Houdin = require('houdin');
const pluck = require('lodash.pluck');

const internals = {};

internals.onPreHandler = function (options) {

    return function (request, reply) {

        if (request.method !== 'post' || request.mime !== 'multipart/form-data') {
            return reply.continue();
        }

        Houdin.validate(request.payload, options, (err, valid) => {

            if (err) {
                const error = Boom.badRequest(err.message);
                error.output.headers['magic-pattern'] = 'invalid';
                error.output.payload.validation = {
                    source: 'payload',
                    keys: pluck(err.details, 'path')
                };

                return reply(error);
            }

            if (valid) {
                request.app.magic = true;
            }

            return reply.continue();
        });
    };
};

internals.onPreResponse = function (options) {

    return function (request, reply) {

        if (!request.response.isBoom && request.app.magic === true) {
            request.response.header('magic-pattern', 'valid');
        }

        reply.continue();
    };
};

exports.register = function (server, options, next) {

    server.ext('onPreHandler', internals.onPreHandler(options));
    server.ext('onPreResponse', internals.onPreResponse(options));

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
