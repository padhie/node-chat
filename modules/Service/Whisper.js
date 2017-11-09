function Whisper() {
    this.sendMessage = function(sorceUser, targetUser, message) {
        var data = {zeit: new Date(), name: sourceUser.getName(), text: message, whisper: 1};
        sourceUser.getSocket().emit('chat', data);
        targetUser.getSocket().emit('chat', data);
    }
}

module.exports = Whisper;