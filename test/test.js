require('should');
var fs = require('fs')
var path = require('path')
var fsExtra = require('fs-extra')
exec = require('child_process').exec
var testFolderRelative = path.normalize('test/test-dir')
var testFolder = path.join(process.cwd(), testFolderRelative)

module.exports = {
    asyncCatch: asyncCatch,
    cleanUp: cleanUp,
    setup: setup,
    newSGF: newSGF,
    run: run,
    newGit: newGit,
    randomFileName: randomFileName,
    randomFileContent: randomFileContent,
    randomString: randomString,
    moveFile: moveFile,
    newFile: newFile,
    addFile: addFile,
    addFiles: addFiles,
    addAndCommitFile: addAndCommitFile,
    testFolder
}

function asyncCatch (done, test) {
    return function (err, value) {
        if (err) {
            done(err);
        }
        else {
            try {
                test(value);
                done();
            }
            catch (err) {
                done(err);
            }
        }
    }
}

function cleanUp (callback) {
    try {
        var paths = fsExtra.removeSync(testFolder)
        callback(null, paths)
    } catch (error) {
        callback(error)
    }
}

function setup (callback) {
    cleanUp(function (err) {
        if (err) {
            callback(err)
        } else {
            fsExtra.mkdirp(testFolder, function (err, result) {
                callback(err || null, result)
            })
        }
    })
}

function newSGF () {
    delete require.cache[ require.resolve('../') ]

    var sgf = require('../')
    sgf.cwd = testFolder
    return sgf
}

function run (command, callback) {
    exec('cd "' + testFolderRelative + '" && git init', callback)
}

function newGit (callback) {
    try {
        fsExtra.removeSync(path.join(testFolder, '.git'))
        run('git init', callback)
    } catch (error) {
        callback(error)
    }
}

function randomFileName (lengths) {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var filename = randomString(possible, lengths[ 0 ])
    for (var i = 1; i < lengths.length; i++) {
        filename += '.' + randomString(possible, lengths[ i ])
    }
    return filename
}

function randomFileContent (length) {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \t\n,.;\'[](){}":?><'
    return randomString(possible, length)
}

function randomString (possible, length) {
    var text = ''

    while (length--) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

function moveFile (opts, callback) {
    var oldPath = path.join(testFolder, opts.oldFileName)
    var newPath = path.join(testFolder, opts.newFileName)

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            callback(err)
        } else {
            run('git add ' + opts.oldFileName + ' ' + opts.newFileName, function (err, stdout, stderr) {
                if (err || stderr) {
                    callback(err || new Error(stderr))
                } else {
                    callback(null, opts)
                }
            })
        }
    })
}

function newFile (opts, callback) {

    if (typeof opts == 'function') {
        callback = opts
        opts = {}
    }

    opts.filename = opts.filename || randomFileName([ 8, 3 ])
    opts.content = opts.content || randomFileContent(10000)

    fs.writeFile(path.join(testFolder, opts.filename), opts.content, function (err) {
        if (err) {
            callback(err)
        } else {
            callback(null, opts)
        }
    })
}

function addFile (opts, callback) {
    if (typeof opts == 'function') {
        callback = opts
        opts = {}
    }

    newFile(opts, function (err, opts) {
        if (err) {
            callback(err)
        } else {
            run('git add ' + opts.filename, function (err, stdout, stderr) {
                if (err || stderr) {
                    callback(err || new Error(stderr))
                } else {
                    callback(null, opts)
                }
            })
        }
    })
}

function addFiles (number, callback) {
    var files = []

    var runner = function (err, data) {
        if (err) {
            callback(err)
        }
        else {
            files.push(data)
            if (files.length == number) {
                callback(null, files)
            }
            else {
                addFile(runner)
            }
        }
    }

    addFile(runner)
}

function addAndCommitFile (opts, callback) {

    if (typeof opts == 'function') {
        callback = opts
        opts = {}
    }

    addFile(opts, function (err, opts) {
        if (err) {
            callback(err)
        } else {
            run('git commit -m \'adding ' + opts.filename + '\'', function (err, stdout, stderr) {
                if (err || stderr) {
                    callback(err || new Error(stderr))
                } else {
                    callback(null, opts)
                }

            })
        }
    })
}
