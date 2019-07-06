// Creates a new bot client
const discord = require('discord.js');
const bot = new discord.Client();

// Configurations the bot will run on
const config = require('./config.js');

// Command Controller
bot.on('message', message=> {
    
    // Ignore bot messages
    if (message.author.id == bot.user.id) {
        return;
    };
    //
    
    
    // Show list of commands
    if (message.content.startsWith(config.prefix + 'help')) {
        message.channel.send('```.help -- list of commands \n.ticket [reason] -- create a new ticket \n.close -- closes a ticket```')
    };
    //
    
    
    // Creates a new ticket
    if (message.content.startsWith(config.prefix + 'ticket')) {
        
        // Creates a new channel between user and staff
        message.guild.createChannel(message.author.username, 'text')
        .then(channel => {
            // Doesn't allow anyone to view channel other than client & staff
            channel.overwritePermissions(message.guild.defaultRole.id, {VIEW_CHANNEL: false});
            channel.overwritePermissions(message.author.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            // Places channel into category
            channel.setParent(config.ticketCategory);
            // Message staff that a new ticket was made
            const checkIfReason = ()=> {
                let getReason = message.content.substr(8, message.content.length);
                if (getReason !== '') {
                    return getReason
                } else {
                    return 'Undefined.'
                }
            }
            channel.send('<@&ROLEID> A new ticket was created by' + message.author + '! \nReason: ' + checkIfReason())
        });
    };
    //
    
    
    // Closes a ticket 
    if (message.content.startsWith(config.prefix + 'close')) {
        if (message.channel.parent.id == config.ticketParentChannel) {
            message.channel.delete();
        };
    };
    //
	
	// Displays IP
	if (message.content.startsWith(config.prefix + 'ip')) {
		message.channel.send(message.author + 'the ip is `play.primalmoon.net`')
	}
    //
	
    // Adds reactions to submissions in desired channel
    config.submissionChannels.forEach(function(item) {
        if (message.channel.id == item) {
            config.reactionEmotes.forEach(function(item) {
                message.react(item);
            });
        };
    });
    //
    
})

// Bot is ready!
bot.on('ready', ()=> {
    console.log('Bot is online!');
    bot.user.setActivity(config.activity);
});
//

// Turn bot on
bot.login(config.token);
//