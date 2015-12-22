'use strict';

const Houdin = require('houdin');
const Supervizor = require('supervizor');

exports.register = function (server, options, next) {

    const plugin = {
        register: Supervizor,
        options: {
            validator: Houdin.validate,
            whitelist: options.whitelist
        }
    };

    server.register(plugin, next);
};

exports.register.attributes = {
    pkg: require('../package.json')
};
