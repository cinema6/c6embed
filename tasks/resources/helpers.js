(function() {
    'use strict';

    var grunt = require('grunt'),
        crypto = require('crypto'),
        Q = require('q');

    module.exports = {
        myIP: function() {
            var os = require('os'),
                ifaces = os.networkInterfaces(),
                result;

            function findIP(details) {
                if (details.family==='IPv4') {
                    result = details.address;
                    grunt.log.writeln('Found IP: ' + result);
                }
            }

            grunt.log.subhead('Finding IP Address');

            for (var dev in ifaces) {
                if (dev.substr(0,3).toLowerCase() === 'loo') {
                    grunt.log.writeln('Skipping interface: ' + dev);
                    continue;
                }

                ifaces[dev].forEach(findIP);
            }

            if (!result) {
                result = 'localhost';
                grunt.log.error('Could not find IP. Using "localhost".');
            } else {
                grunt.log.ok('Using IP: ' + result);
            }

            return result;
        },

        mountFolder: function(connect, dir) {
            return connect.static(require('path').resolve(dir));
        },

        genId: function(prefix) {
            var hash = crypto.createHash('sha1');
            var txt =   process.env.host                    +
                        process.pid.toString()              +
                        process.uptime().toString()         +
                        (new Date()).valueOf().toString()   +
                        (Math.random() * 999999999).toString();

            hash.update(txt);
            return (prefix + '-' + hash.digest('hex').substr(0,14));
        },

        QS3: function(s3) {
            for (var prop in s3) {
                if (typeof s3[prop] === 'function') {
                    this[prop] = Q.nbind(s3[prop], s3);
                }
            }
        }
    };
})();
