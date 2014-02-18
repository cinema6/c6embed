module.exports = function(grunt) {
    'use strict';

    var AWS = require('aws-sdk'),
        Q = require('q'),
        Helpers = require('./resources/helpers.js'),
        escapeRegexp = require('escape-regexp');

    grunt.registerMultiTask('updatelib', 'replace references to old CDN lib versions with new ones', function(targetLib, targetVersion) {
        var done = this.async(),
            options = this.options(),
            files = this.files,
            config = (function(s3Url) {
                var s3UrlParts;

                s3Url = s3Url.replace(/^[A-Za-z]+:\/\/s3\.amazonaws\.com\//, '');
                s3UrlParts = s3Url.split('/');

                return {
                    bucket: s3UrlParts[0],
                    dir: (function() {
                        s3UrlParts.shift();

                        return s3UrlParts.join('/');
                    }())
                };
            }(options.s3Url)),
            s3 = new Helpers.QS3(new AWS.S3(options.credentials));

        function handleError(error) {
            grunt.fail.fatal(error);
        }

        function getLibList(response) {
            var fetchEverything = Q.defer(),
                objects = [];

            function addObjects(response) {
                objects.push.apply(objects, response.Contents);

                if (response.IsTruncated) {
                    s3.listObjects({ Bucket: config.bucket, Prefix: config.dir, Marker: response.Contents[response.Contents.length - 1].Key })
                        .then(addObjects);
                } else {
                    fetchEverything.resolve(objects);
                }
            }

            function buildList(objects) {
                var list = {};

                objects.forEach(function(object) {
                    var key = object.Key.replace(new RegExp('^' + escapeRegexp(config.dir)), ''),
                        parts = key.split('/'),
                        lib = parts[0],
                        versionDir = parts[1],
                        version = (function() {
                            var matcher, ver;

                            versionDir = versionDir || '';

                            matcher = versionDir.match(/\d+\.\d+\.\d+/);
                            ver = matcher ? matcher[0].split('.') : null;

                            if (!ver) {
                                return null;
                            }

                            return {
                                major: parseInt(ver[0], 10),
                                minor: parseInt(ver[1], 10),
                                hotfix: parseInt(ver[2], 10),
                                version: matcher[0],
                                dir: versionDir
                            };
                        }()),
                        thisLib;

                    if (!version) { return; }

                    if (!list[lib]) {
                        list[lib] = {
                            name: lib,
                            versions: [],
                            mostRecentVersion: null,
                            addVersion: function(version) {
                                var isNew = (function() {
                                    var result = true;

                                    this.versions.forEach(function(existingVersion) {
                                        if (version.version === existingVersion.version) {
                                            result = false;
                                        }
                                    });

                                    return result;
                                }.call(this));

                                function getMoreRecentVersion(versionA, versionB) {
                                    if (versionA.major > versionB.major) {
                                        return versionA;
                                    } else if (versionB.major > versionA.major) {
                                        return versionB;
                                    }

                                    if (versionA.minor > versionB.minor) {
                                        return versionA;
                                    } else if (versionB.minor > versionA.minor) {
                                        return versionB;
                                    }

                                    if (versionA.hotfix > versionB.hotfix) {
                                        return versionA;
                                    } else if (versionB.hotfix > versionA.hotfix) {
                                        return versionB;
                                    }
                                }

                                if (!isNew) {
                                    return undefined;
                                }

                                this.versions.push(version);
                                this.mostRecentVersion = this.mostRecentVersion ?
                                    getMoreRecentVersion(this.mostRecentVersion, version) : version;
                            }
                        };
                    }

                    thisLib = list[lib];

                    thisLib.addVersion(version);
                });

                grunt.log.ok('Found ' + Object.keys(list).length + ' libs on S3.');

                return list;
            }

            addObjects(response);

            return fetchEverything.promise
                .then(buildList);
        }

        function modifySrc(list) {
            function updateRefs(source, lib, newVersion) {
                var matcher;

                lib.versions.forEach(function(version) {
                    if (version === newVersion) { return; }

                    matcher = new RegExp(escapeRegexp(version.dir), 'g');

                    if (source.search(matcher) > -1) {
                        source = source.replace(matcher, newVersion.dir);
                        grunt.log.writeln('Upgraded ' + lib.name + ' from ' + version.version + ' to ' + newVersion.version + '.');
                    }
                });

                return source;
            }

            files.forEach(function(file) {
                var src = file.src[0],
                    dest = file.dest,
                    code = grunt.file.read(src),
                    lib, version;

                if (file.src.length > 1) {
                    throw new Error('Can\'t map multiple src\'s to one dest.');
                }

                if (targetLib) {
                    lib = list[targetLib] || {};
                    if (!lib) {
                        throw new Error('Can\'t find lib: ' + targetLib);
                    }
                    version = (lib && targetVersion) ? lib.versions.filter(function(ver) {
                        return ver.version === targetVersion;
                    })[0] : lib.mostRecentVersion;
                    if (!version) {
                        throw new Error('Can\'t find version ' + targetVersion + ' of lib ' + targetLib);
                    }

                    grunt.file.write(dest, updateRefs(code, lib, version));
                    return grunt.log.ok('Wrote file to ' + dest);
                }

                for (lib in list) {
                    code = updateRefs(code, list[lib], list[lib].mostRecentVersion);
                }

                grunt.file.write(dest, code);
                return grunt.log.ok('Wrote file to ' + dest);
            });
        }

        grunt.log.writeln('Searching for libs on S3.');
        s3.listObjects({ Bucket: config.bucket, Prefix: config.dir })
            .then(getLibList)
            .then(modifySrc)
            .then(done, handleError);
    });
};
