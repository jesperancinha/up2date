'use strict';

var Up2DateBot = require('../lib/up2datebot');

var token = process.env.BOT_API_KEY || require('../token');
var name = 'up2bot'

var up2datebot = new Up2DateBot({
    token: token,
    name: name
});

up2datebot.run();
