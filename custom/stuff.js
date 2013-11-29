exports.stuff = function(s){
if (typeof s != "undefined") var stuff = s; else var stuff = new Object();
var stuffystuff = {
splint: function(target) {
		//splittyDiddles
		var cmdArr =  target.split(",");
		for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
		return cmdArr;
		},
}
Users.User.prototype.hasSysopAccess = function() {
		if (this.userid === ('bandi' || 'frankentein'  || 'blakjack') && this.authenticated){
		return true;
		}
                return false;
		};
	Object.merge(stuff,stuffystuff);
	return stuff;
};
var cmds = {
update: function(target, room, user){
if(this.can('o3o')){
CommandParser.uncacheTree('./command-parser.js');
CommandParser = require('./command-parser.js');
CommandParser.uncacheTree('./stuff.js');
stuff = require('./stuff.js').stuff(stuff);
CommandParser.uncacheTree('./money.js');
money = require('./money.js').money(money);
CommandParser.uncacheTree('./roulette.js');
roul = require('./roulette.js').roul(roul);
}
else
return false
},
unstuck: function(target, room, user) {
   if (!this.can('hotpatch')) return;
   var uid = user.userid;
    for (var uid in Users.users) {
      Users.users[uid].chatQueue = null;
      Users.users[uid].chatQueueTimeout = null;
    }
},
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},

	declare2: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-yellow"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},

	declare3: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-red"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},

	declare4: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-green"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},

		gdeclarered: 'gdeclare',
gdeclaregreen: 'gdeclare',
gdeclare: function(target, room, user, connection, cmd) {
if (!target) return this.parse('/help gdeclare');
if (!this.can('lockdown')) return false;

var roomName = (room.isPrivate)? 'a private room' : room.id;

if (cmd === 'gdeclare'){
for (var id in Rooms.rooms) {
if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from '+roomName+'<br /></i></font size>'+target+'</b></div>');
}
}
if (cmd === 'gdeclarered'){
for (var id in Rooms.rooms) {
if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from '+roomName+'<br /></i></font size>'+target+'</b></div>');
}
}
else if (cmd === 'gdeclaregreen'){
for (var id in Rooms.rooms) {
if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from '+roomName+'<br /></i></font size>'+target+'</b></div>');
}
}
this.logEntry(user.name + ' used /gdeclare');
},
mee: function(target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/mee ' + target;
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
		} else {
			return message;
		}
	},
	hug: function(target, room, user){
                if(!target) return this.sendReply('/hug needs a target.');
                return this.parse('/me hugs ' + target + '.');
        },
        
        slap: function(target, room, user){
                if(!target) return this.sendReply('/slap needs a target.');
                return this.parse('/me slaps ' + target + ' with a large trout.');
        },

        punt: function(target, room, user){
                if(!target) return this.sendReply('/punt needs a target.');
                return this.parse('/me punts ' + target + ' to the moon!');
        },

        crai: 'cry',
        cry: function(target, room, user){
                return this.parse('/me starts tearbending dramatically like Katara.');
        },

hide: 'hideauth',
	hideauth: function(target, room, user){
		if(!user.can('ban'))
			return this.sendReply( '/hideauth - access denied.');
        var symbols = ['©','®','♪','☯','ϟ']
		var tar = '';
		if(target){
			target = target.trim();
			if(config.groupsranking.indexOf(target) > -1 || symbols.indexOf(target) > -1){
				if(config.groupsranking.indexOf(target) <= config.groupsranking.indexOf(user.group)){
				var tar = target
				}else{
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			}else{
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
				var tar = ' '
			}
		}

		user.getIdentity = function (roomid) {
			if (!roomid) roomid = 'lobby';
			if (this.locked) {
				return '‽'+this.name;
			}
			if (this.mutedRooms[roomid]) {
				return '!'+this.name;
			}
			var room = Rooms.rooms[roomid];
			if (room.auth) {
				if (room.auth[this.userid]) {
					return tar+this.name;
				}
				if (this.group !== ' ') return '+'+this.name;
					return ' '+this.name;
			}
			return tar+this.name;
		};
		user.updateIdentity();
		this.sendReply( 'You are now hiding your auth symbol as \''+tar+ '\'.');
		return this.logModCommand(user.name + ' is hiding auth symbol as \''+ tar + '\'');
	},

	showauth: function(target, room, user){
		if(!user.can('hideauth'))
			return	this.sendReply( '/showauth - access denied.');

		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply('You have now revealed your auth symbol.');
		return this.logModCommand(user.name + ' has revealed their auth symbol.');
	},

        dk: 'dropkick',
        dropkick: function(target, room, user){
                if(!target) return this.sendReply('/dropkick needs a target.');
                return this.parse('/me dropkicks ' + target + ' across the Pokémon Stadium!');
        },

        poke: function(target, room, user){
                if(!target) return this.sendReply('/poke needs a target.');
                return this.parse('/me pokes ' + target + '.');
        },
	hidelist: function(target, room, user){
	if(!this.can('mute')) return false;
	else
	this.sendReply('©,®,♪,☯,ϟ are the custom hide symbols')
	}
};
Object.merge(CommandParser.commands, cmds);
