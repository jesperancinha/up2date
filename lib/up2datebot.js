'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');

var Up2DateBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'Up2DateBot';
    this.user = null;
};

util.inherits(Up2DateBot, Bot);

Up2DateBot.prototype.run = function () {
    Up2DateBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

Up2DateBot.prototype._onStart = function () {
    this._loadBotUser();
    this._firstRunCheck();
};

Up2DateBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromBot(message) &&
        this._isMentioningStatus(message)
    ) {
        this._replyWithLatestVersion(message);
    }
};

Up2DateBot.prototype._isMentioningStatus = function (message){
    return message.text.toLowerCase().indexOf('status') > -1;
};

Up2DateBot.prototype._replyWithRandomJoke = function (originalMesasage) {
        self.postMessageToChannel(channel.name, 'I still have no idea of that latest version', {as_user: true});
};

Up2DateBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

Up2DateBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys!!! Welcome I will assist you with your versioning system. Sooon!!',
        {as_user: true});
};

Up2DateBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

Up2DateBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'
        ;
};

Up2DateBot.prototype._isFromBot = function (message) {
    return message.user === this.user.id;
};

Up2DateBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = Up2DateBot;
