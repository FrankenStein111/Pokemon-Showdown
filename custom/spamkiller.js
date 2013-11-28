/**
This is the file where I edit anything message wise.
I add a spam system mostly, howeever I also edit some errors such as the ways where users couldn't talk.
I also make a edit to the spamroom system. I make sure the spam logs are logged in a file along with  the spamroom.
Enjoy my  message edting/spam filter. Email me any errors at imdatbulll@gmail.com(yes 3 ls)
Credits:
Davandi(me)
TalkTakesTime(original creator of spamroom)

**/
exports.spam = function(s){
if(typeof s != "undefined") var spam = s; else var spam = new Object();
//var spamlog = fs.createWriteStream('/config/spamlog.txt', {'flags': 'a'});
var today = new Date(); 
var spammy = {
spammers: new Array('gavigator','professorgavin','suk'),
//rated mature
words: new Array('nigger','fag','snen','penis','wank','cunt','rape','queef','spic','porn','fgt','kike','tits','anal','cock','pussy','ann coulter','howard stern','jizz','cum','spamspamspam','donger',"t1ts", "c0ck", "p0rn", "n1gger"),
 spamcream: function(user, room, connection, message) {
	if (!user.named) {
		connection.popup("You must choose a name before you can talk.");
		return false;
	}
	if (room && user.locked) {
		connection.sendTo(room, 'You are locked from talking in chat.');
		return false;
	}
	if (room && user.mutedRooms[room.id]) {
		connection.sendTo(room, 'You are muted and cannot talk in this room.');
		return false;
	}
	if (room && room.modchat) {
		if (room.modchat === 'crash') {
			if (!user.can('ignorelimits')) {
				connection.sendTo(room, 'Because the server has crashed, you cannot speak in lobby chat.');
				return false;
			}
		} else {
			var userGroup = user.group;
			if (room.auth) {
				if (room.auth[user.userid]) {
					userGroup = room.auth[user.userid];
				} else if (userGroup !== ' ') {
					userGroup = '+';
				}
			}
			if (!user.autoconfirmed && (room.auth && room.auth[user.userid] || user.group) === ' ' && room.modchat === 'autoconfirmed') {
				connection.sendTo(room, 'Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.');
				return false;
			} else if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(room.modchat)) {
				var groupName = config.groups[room.modchat].name;
				if (!groupName) groupName = room.modchat;
				connection.sendTo(room, 'Because moderated chat is set, you must be of rank ' + groupName +' or higher to speak in this room.');
				return false;
			}
		}
	}
	if (room && !(user.userid in room.users)) {
		connection.popup("You can't send a message to this room without being in it.");
		return false;
	}
    if(spam.spammers.indexOf(user.userid)){
    spamroom[user.userid] = true;
	return false
	}
	if (typeof message === 'string') {
		if (!message) {
			connection.popup("Your message can't be blank.");
			return false;
		}
		if (message.length > 80 && !user.can('ignorelimits')) {
			connection.popup("Your message is too long:\n\n"+message);
			return false;
		}

		// hardcoded low quality website
		if (/\bnimp\.org\b/i.test(message)) return false;

		// remove zalgo
		message = message.replace(/[\u0300-\u036f\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,'');

		if (room && room.id === 'lobby') {
			var normalized = message.trim();
			if ((normalized === user.lastMessage) &&
					((Date.now() - user.lastMessageTime) < 5*60*1000)) {
				connection.popup("You can't send the same message again so soon.");
				return false;
			}
			user.lastMessage = message;
			user.lastMessageTime = Date.now();
            if((user.o3omessagetime - today.getMinutes()) > 1){
			user.numMessages = 0;
			user.o3omessagetime = today.getMinutes();
			}
			if (user.group === ' ') {
				if (message.toLowerCase().indexOf('spoiler:') >= 0 || message.toLowerCase().indexOf('spoilers:') >= 0) {
					connection.sendTo(room, "Due to spam, spoilers can't be sent to the lobby.");
					return false;
				}
			}
		}
	// if user is not in spamroom
	if(spamroom[user.userid]) {
		Rooms.rooms.spamroom.add('|c|' + user.getIdentity() + '|' + message);
		connection.sendTo(room, "|c|" + user.getIdentity() + "|" + message);
		return false;
	}
	
	if(spam.words.indexOf(message) > -1) {
			if (!spamroom[user.userid]) spamroom[user.userid] = true;
			if (Rooms.rooms.staff) Rooms.rooms.staff.add(user.name + ' was added to spamroom (spammer).');
			return false;
		}
		if(!user.numMessages){
		user.numMessages = 0;
		user.o3omessagetime = today.getMinutes();
		}
		if(user.numMessages > 12){
		connection.popup("You have sent more than 12 messages within a minute. You will now be muted for 7 minutes");
		user.mute(room.id, 7*60*1000);
		}
	if (!user.spamchecked){
		// check to see if an alt exists in list
		user.spamchecked = true;
		var altlist = user.getAlts();
		for (var i = 0; i <altlist.length; i++) {
			altlist[i] = toId(altlist[i]);
			if (spamroom[altlist[i]]);
				spamroom[user.userid] = true;
				Rooms.rooms.spamroom.add('|c|' + user.getIdentity() + '|' + message);
				connection.sendTo(room, "|c|" + user.getIdentity() + "|" + message);
				//spamlog.write(user.userid + ': ' + message)
				return false;
			}
		}
		if (config.chatfilter) {
			return config.chatfilter(user, room, connection.socket, message);
		}
		user.numMessages += 1;
		return message;
	}

	return true;
}
}
Object.merge(spam, spammy);
return spam
};
var parserstuff = {
canTalk: function(message, relevantRoom) {
				var innerRoom = (relevantRoom !== undefined) ? relevantRoom : room;
				return spam.spamcream(user, innerRoom, connection, message);
			},
}
Object.merge(CommandParser, parserstuff);
var cmds = {
unspam: 'unspamroom',
	unspammer: 'unspamroom',
	unspamroom: function(target, room, user, connection) {
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (!spamroom[targetUser]) {
			return this.sendReply('That user is not in the spamroom list.');
		}
		for(var u in spamroom)
			if(targetUser == Users.get(u))
				delete spamroom[u];
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was removed from the spamroom list.</b>');
		this.logModCommand(targetUser + ' was removed from spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' and their alts were successfully removed from the spamroom list.');
	},
	spam: 'spamroom',
	spammer: 'spamroom',
	spamroom: function(target, room, user, connection) {
		if (!target) return this.sendReply('Please specify a user.');
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if(!Rooms.rooms.spamroom){
this.parse('/makechatroom spamroom');
Rooms.rooms.spamroom.isPrivate = true;
}
		if (spamroom[targetUser]) {
			return this.sendReply('That user\'s messages are already being redirected to the spamroom.');
		}
		spamroom[targetUser] = true;
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was added to the spamroom list.</b>');
		this.logModCommand(targetUser + ' was added to spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' was successfully added to the spamroom list.');
	},
	
me: function(target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/me ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
			spamlog.write(user.userid + ': ' + message)
		} else {
			return message;
		}
	},
    

	
	me: function(target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/me ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
			spamlog.write(user.userid + ': ' + message)
		} else {
			return message;
		}
	},
};
Object.merge(CommandParser.commands, cmds);
