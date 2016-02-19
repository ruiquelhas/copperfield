'use strict';

const Fs = require('fs');
const Os = require('os');
const Path = require('path');

const Code = require('code');
const FormData = require('form-data');
const Hapi = require('hapi');
const Lab = require('lab');
const StreamToPromise = require('stream-to-promise');

const Copperfield = require('../lib/');

const lab = exports.lab = Lab.script();

lab.experiment('copperfield', () => {

    let server;

    lab.before((done) => {

        server = new Hapi.Server();
        server.connection();

        const setup = {
            register: Copperfield,
            options: {
                whitelist: ['png']
            }
        };

        const route = {
            handler: (request, reply) => reply(),
            method: '*',
            path: '/'
        };

        server.route(route);
        server.register(setup, done);
    });

    lab.test('should return error if some file in the payload is not allowed', (done) => {

        const png = Path.join(Os.tmpdir(), 'foo.png');
        Fs.createWriteStream(png).end(new Buffer([0x89, 0x50]));

        const gif = Path.join(Os.tmpdir(), 'foo.gif');
        Fs.createWriteStream(gif).end(new Buffer([0x47, 0x49]));

        const form = new FormData();
        form.append('file1', Fs.createReadStream(gif));
        form.append('file2', Fs.createReadStream(png));
        form.append('file3', Fs.createReadStream(gif));
        form.append('foo', 'bar');

        StreamToPromise(form).then((payload) => {

            server.inject({ headers: form.getHeaders(), method: 'POST', payload: payload, url: '/' }, (response) => {

                Code.expect(response.statusCode).to.equal(400);
                Code.expect(response.headers['content-validation']).to.equal('failure');
                Code.expect(response.result).to.include(['message', 'validation']);
                Code.expect(response.result.message).to.equal('child \"file1\" fails because [\"file1\" type is not allowed]');
                Code.expect(response.result.validation).to.include(['source', 'keys']);
                Code.expect(response.result.validation.source).to.equal('payload');
                Code.expect(response.result.validation.keys).to.include('file1');
                done();
            });
        });
    });

    lab.test('should return control to the server if all files the payload are allowed', (done) => {

        const png = Path.join(Os.tmpdir(), 'foo.png');
        Fs.createWriteStream(png).end(new Buffer([0x89, 0x50]));

        const form = new FormData();
        form.append('file1', Fs.createReadStream(png));
        form.append('file2', Fs.createReadStream(png));
        form.append('foo', 'bar');

        StreamToPromise(form).then((payload) => {

            server.inject({ headers: form.getHeaders(), method: 'POST', payload: payload, url: '/' }, (response) => {

                Code.expect(response.statusCode).to.equal(200);
                Code.expect(response.headers['content-validation']).to.equal('success');
                done();
            });
        });
    });
});
