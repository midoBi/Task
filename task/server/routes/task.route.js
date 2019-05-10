const express = require('express');
const request = require('request');
const BufferList = require('bufferlist').BufferList;
const buffer = new BufferList();
const fs = require('fs');
const CronJob = require('cron').CronJob;

const config = require('../config/config');
const router = express.Router();
module.exports = router;

new CronJob('* * * * * *', function () {
    let currentPage = 1;
    let baseUrl = ` https://reqres.in/api/users?page=${currentPage}`;
    console.log("Start Cron Job ...");
    try {
        request({url: baseUrl}, (err, response, body) => {
            console.log("Response Code : ", response.statusCode);

            if (!err && response.statusCode === 200 && body) {
                let users = JSON.parse(body);
                // Increment Page
                currentPage++;
                let jsonFile = "users.json";
                fs.exists(jsonFile, (exist) => {
                    if (exist) {
                        // append to file
                        fs.appendFile(jsonFile, users, (err) => {
                            console.error(err);
                        })
                    } else {
                        // if not exist create new File
                        fs.writeFile(jsonFile, {flag: 'wx'}, (err, data) => {
                            if (err) {
                                console.error('Error Creating File ');
                            }
                        })
                    }
                })
            }

        });
    } catch (e) {
        console.error(e);
    }
}, null, true, 'America/Los_Angeles');

router.route('/')
    .get((req, res) => {
        res.status(200).json({result: []});
    });

router.route('/:id')
    .get((req, res) => {

        const param = req.params.id;
        console.log('Prams ', param);
        try {
            if (param) {
                let userId = {id: parseInt(param)};
                request({url: config.url, qs: userId}, (err, response, body) => {
                    console.log("Response Code : ", response.statusCode);
                    if (err) {
                        res.status(404).json({Error: err});
                    }
                    const data = JSON.parse(body);
                    res.status(200).json(data);

                });

            }
        } catch (e) {
            res.status(500).json({Error: e});

        }


    });

router.route('/:id/avatar')
    .get((req, res) => {
        const param = req.params.id;
        try {
            if (param) {
                let userId = {id: parseInt(param)};
                request({url: config.url, qs: userId}, (err, response, body) => {
                    if (err) {
                        res.status(404).json({Error: err});
                    }
                    let avatar = "";
                    let result = JSON.parse(body);
                    if (result && result.data) {
                        avatar = result.data.avatar;
                    }
                    if (avatar !== "") {
                        request({uri: avatar, responseBodyStream: buffer}, function (error, response, body) {

                            if (!error && response.statusCode === 200) {
                                let type = response.headers["content-type"];
                                let prefix = "data:" + type + ";base64,";
                                let base64 = new Buffer(body.toString(), 'binary').toString('base64');
                                // base 64 Result
                                let data = prefix + base64;
                                // create new file image
                                const fileName = `${param}.jpg`;
                                fs.writeFile(fileName, data, (err) => {
                                    if (err) {
                                        res.status(500).json({Error: "Error to store file"});
                                    }
                                    res.status(201).json({message: "File Created "});

                                })

                            }
                        });
                    }

                });

            }
        } catch (e) {
            res.status(500).json({Error: e});

        }


    });

router.route('/:id/avatar')
    .delete((req, res) => {
        const param = req.params.id;

        if (param) {
            const path = `${param}.jpg`;

            fs.unlink(path, (err) => {
                if (err) {
                    res.status(500).json({Error: "Can not remove  file"});
                }
                //file removed
                res.status(200).json({message: "File removed "});
            })
        }
    });