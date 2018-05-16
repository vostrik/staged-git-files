var test = require('./test')

describe('As a module', function () {

    describe('current working directory should', function () {
        it('default to node\'s current working directory', function () {
            var sgf = require('../')
            sgf.cwd.should.equal(process.cwd())
        })

        it('be over writable', function () {
            var sgf = require('../')
            sgf.cwd = test.testFolder
            sgf.cwd.should.equal(test.testFolder)
        })
    })

    describe('getHead will return', function () {

        beforeEach(function (done) {
            test.setup(function (err) {
                if (err) {
                    done(err)
                } else {
                    test.newGit(function (err, stdout, stderr) {
                        if (err || stderr) {
                            done(err || new Error(stderr))
                        } else {
                            done()
                        }
                    })
                }
            })
        })

        it('firstHead in a repo without commits', function (done) {
            var sgf = test.newSGF()
            sgf.getHead(test.asyncCatch(done, function (head) {
                head.should.equal(sgf.firstHead)
            }))
        })

        it('some hash in a repo with commits', function (done) {
            test.addAndCommitFile(function (err, data) {
                if (err) {
                    done(err)
                } else {
                    var sgf = test.newSGF()
                    sgf.getHead(test.asyncCatch(done, function (head) {
                        head.should.not.equal(sgf.firstHead)
                    }))
                }
            })
        })
    })

    describe('used in a directory with staged files', function () {

        beforeEach(function (done) {
            test.setup(function (err) {
                if (err) {
                    done(err)
                } else {
                    test.newGit(function (err, stdout, stderr) {
                        if (err || stderr) {
                            done(err || new Error(stderr))
                        } else {
                            test.addAndCommitFile(function (err) {
                                done(err)
                            })
                        }
                    })
                }
            })
        })

        it('I, being the cli, should log the file paths and their git status', function (done) {
            test.addFiles(2, function (err, data) {
                if (err) return done(err)

                var sorter = function (a, b) {
                    if (a.filename > b.filename) {
                        return 1
                    }
                    else if (a.filename < b.filename) {
                        return -1
                    }
                    else {
                        return 0
                    }
                }
                data.sort(sorter)

                exec('../../bin/cli.js', { cwd: test.testFolder }, function (err, stdout, stderr) {
                    if (err) return done(err)
                    var results = stdout.trim().split('\n').map(function (line) {
                        var p = line.split(' ')
                        var status = p[ 0 ]
                        var filename = p.slice(1).join(' ')
                        return {
                            status: status,
                            filename: filename
                        }
                    })
                    results.sort(sorter)
                    for (var i = 0; i < results.length; i++) {
                        results[ i ].filename.should.equal(data[ i ].filename)
                        results[ i ].status.should.equal('Added')
                    }
                    done()
                })
            })
        })

        it('I should return the file paths and their git status', function (done) {
            this.timeout(1000000000)
            test.addFiles(1000, function (err, data) {
                if (err) {
                    done(err)
                }
                else {

                    var sorter = function (a, b) {
                        if (a.filename > b.filename) {
                            return 1
                        }
                        else if (a.filename < b.filename) {
                            return -1
                        }
                        else {
                            return 0
                        }
                    }

                    data.sort(sorter)

                    var sgf = test.newSGF()
                    sgf(test.asyncCatch(done, function (results) {
                        results.sort(sorter)
                        for (var i = 0; i < results.length; i++) {
                            results[ i ].filename.should.equal(data[ i ].filename)
                            results[ i ].status.should.equal('Added')
                        }
                    }))
                }
            })
        })

        it('I should find renames', function (done) {
            test.addAndCommitFile(function (err, data) {
                if (err) {
                    done(err)
                } else {
                    var newFileName = test.randomFileName([ 8, 3 ])

                    test.moveFile({
                        oldFileName: data.filename,
                        newFileName: newFileName
                    }, function (err) {
                        var sgf = test.newSGF()
                        sgf(test.asyncCatch(done, function (results) {
                            results.length.should.equal(1)
                            results[ 0 ].filename.should.equal(newFileName)
                            results[ 0 ].status.should.equal('Renamed')
                        }))
                    })
                }
            })
        })

        it('if \'R\' flag is not included I should not find renames', function (done) {
            test.addAndCommitFile(function (err, data) {
                if (err) {
                    done(err)
                } else {
                    var newFileName = test.randomFileName([ 8, 3 ])

                    test.moveFile({
                        oldFileName: data.filename,
                        newFileName: newFileName
                    }, function (err) {
                        var sgf = test.newSGF()
                        sgf('A', test.asyncCatch(done, function (results) {
                            results.length.should.equal(1)
                            results[ 0 ].filename.should.equal(newFileName)
                            results[ 0 ].status.should.equal('Added')
                        }))
                    })
                }
            })
        })

        it('if includeContent is set to true I should return the file paths, their git status and the content', function (done) {
            test.addFile(function (err, data) {
                var sgf = test.newSGF()
                sgf.includeContent = true
                sgf(test.asyncCatch(done, function (results) {
                    results[ 0 ].filename.should.equal(data.filename)
                    results[ 0 ].status.should.equal('Added')
                    results[ 0 ].content.should.equal(data.content)
                }))
            })
        })

        it('readFile will aysnc read a file and return its content', function (done) {
            test.addFile(function (err, data) {
                var sgf = test.newSGF()
                sgf.readFile(data.filename, {
                    encoding: 'utf8'
                }, function (err, content) {
                    content.should.equal(data.content)
                    done(err)
                })
            })
        })

        it('the staged filename contains chinese', function (done) {
            test.addAndCommitFile(function (err, data) {
                if (err) {
                    done(err)
                } else {
                    var newFileName = '你好世界'
                    test.moveFile({
                        oldFileName: data.filename,
                        newFileName: newFileName
                    }, function (err) {
                        var sgf = test.newSGF()
                        sgf(test.asyncCatch(done, function (results) {
                            results.length.should.equal(1)
                            results[ 0 ].filename.should.equal(newFileName)
                            results[ 0 ].status.should.equal('Renamed')
                        }))
                    })
                }
            })
        })

        after(function (done) {
            test.cleanUp(done)
        })
    })
})
