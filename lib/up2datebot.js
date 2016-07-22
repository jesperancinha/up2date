'use strict';

var util = require('util');
var Bot = require('slackbots');

var Up2DateBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'Up2DateBot';
    this.user = null;
    this.groupKey = 'group:';
    this.artifactKey = 'artifact:';
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
    console.log(message);
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromBot(message) &&
        this._isMentioningStatus(message)
    ) {
        this._replyWithLatestVersion(message);
    }
};

Up2DateBot.prototype._isMentioningStatus = function (message) {
    var versionMessage = null;
    var text = message.text.toLowerCase();

    if (text.indexOf('check') > -1 && this._containsGroup(text) && this._containsArtifact(text)) {
        var inputs = text.split(" ");
        var groupId = null;
        var artifactId = null;

        for (var i = 0, l = inputs.length; i < l; i++) {
            if (this._containsGroup(inputs[i])) {
                groupId = inputs[i].replace(this.groupKey, '');
            } else if (this._containsArtifact(inputs[i])) {
                artifactId = inputs[i].replace(this.artifactKey, '');
            }
        }

        if (groupId != null && artifactId != null) {
            versionMessage = "OK :: " + groupId + " :: " + artifactId;
        }
    }

    return this._replyWithLatestVersion(message, versionMessage);
};

Up2DateBot.prototype._containsGroup = function(source) {
    return source.indexOf(this.groupKey) > -1
};

Up2DateBot.prototype._containsArtifact = function(source) {
    return source.indexOf(this.artifactKey) > -1
};

Up2DateBot.prototype._replyWithLatestVersion = function(originalMessage, versionMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, (versionMessage != null ? versionMessage : 'I still have no idea of that latest version'), {as_user: true});
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

Up2DateBot.prototype._firstRunCheck = function () {
    var self = this;
    self._welcomeMessage();
};


module.exports = Up2DateBot;
