/*********************************************************
 * Money Functions
 *********************************************************/
 /**
 *                                                     Credits
 * Main Helpers: Davandi[bandi](watching tv with his ayush doll (1.0-1.1)), Slayer95(HUGE HELP: Roulette,Money-Saving(1.0)), and EliteFive(tons of New items, bug fixes(1.0))
 * Contributors: Piiiikachuuu(help setting 1.0 up(1.0)), Cosy(Retired helper, tons of functions/commands(1.0))
 * Shoutouts: Orivexes(Original money mod and letting me have his ideas) Nollan(Another money mod) jd(being jd and avi command) 
 *                                                     Statistics
 * Version: 1.1
 * Updates from 1.1: New outline/format of code, Cleaner code, Avatar/Room manually,NaN/0 fixes,New shop items
 * Rating: 3 1/2 Stars(from server of leagueinc)
 */
 
exports.money = function(m) {
  if (typeof m != "undefined") var money = m; else var money = new Object();
   var usermoney = {};
   var usertkts = {};

var Moneystuff = {
    importUsertkts: function () {
	for (var i in usertkts) delete usertkts[i];
	fs.readFile('config/usertkts.csv', function(err, data) {
		if (err) return;
		data = (''+data).split("\n");
		for (var i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			var row = data.split(",");
			usertkts[toId(row[0])] = row[1] || 0;
			}
	});
},
    importUserwealth: function() {
	for (var i in usermoney) delete usermoney[i];
	fs.readFile('config/userwealth.csv', function(err, data) {
		if (err) return;
		data = (''+data).split("\n");
		for (var i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			var row = data[i].split(",");
			usermoney[toId(row[0])] = row[1] || 0;
		}
	});
},
	exportmoney: function() {
	var buffer = '';
	for (var i in usermoney) {
    buffer += i + ',' + usermoney[i] + "\n";
	}
	fs.writeFile('config/userwealth.csv', buffer);
	money.importUserwealth();
    },
	exporttkts: function(){
	var buffer = '';
	for (var i in usermoney) {
		buffer += i + ',' + usertkts[i] + "\n";
		}
	fs.writeFile('config/usertkts.csv', buffer);
	money.importUsertkts();
    },
	started: false,
	//item functions .3.
	shop: require('./shop.js').shop,
	checkItem: function(target){
	if(money.shop[target] !== undefined) return true
	else return false;
	},
	alltkts: usertkts,
	allmoney: usermoney,
		reset: function(){
		for(var i in Users.users){
		Users.users[i].money = 0;
		Users.users[i].tkts = 0;
		money.save(Users.users[i]);
		Users.users[i].popup('Money was erased by ' + user.name)
		}
		},
		write: function(user){
		user.writemoney()
		user.writetkts()
		},
		read: function(user){
		money.importUserwealth()
		user.readmoney()
		user.readtkts()
		},
		//jobs: require('./jobs.js')  //for version 1.3
		//roul: require('./roulette.js').roul(),
		save: function(user){
		money.write(user);
		money.exportmoney();
        money.exporttkts();
		}
	};
	Users.User.prototype.money = 0;
	Users.User.prototype.tkts = 0;
	Users.User.prototype.readmoney = function(){
	if(usermoney[this.userid]){
                this.money = parseInt(usermoney[this.userid]);
                                }
								}
    Users.User.prototype.writemoney = function(){
                userwealth[this.userid] = this.money;
				   }          
	Users.User.prototype.readtkts = function(){
	 if(usertkts[this.userid]) {
                this.tkts = parseInt(usertkts[this.userid]);
                                }
								}
    Users.User.prototype.writetkts = function(){
                usertkts[this.userid] = this.tkts;
				Object.merge(money, Moneystuff);
                                }
								Object.merge(money, Moneystuff);
	                            return money;
        };
	
  

/*********************************************************
 * Money Commands
 *********************************************************/
var cmds = {
startmoney: function (target, room, user) {
if(this.can('derp')){
if(money.started == true){ 
this.sendReply('Money is already on.'); 
return false
}
if(money.started == false) {
money.started = true;
room.addRaw('<b>Money has been started, hopefully all the bugs have been fixed. If you have any bug reports please pm bandi,mrsmellyfeet, or one of our tech support<b>')
} 
else { 
return false
}
}
},
givemoney: function (target, room, user) {
        money.read(user);
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if (user.money < 1) {
			return this.sendReply('You do not have enough Battle Points to give.');
		} else if (user.money >= 1) {
			user.money -= 1;
		}
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var givemoney = parseInt(targets[1]);
		if (isNaN(givemoney)) return this.sendReply('Invalid sum of Battle Points.');
		if (givemoney < 1) return this.sendReply('Invalid sum of Battle Points.');
		if (givemoney > user.money) return this.sendReply('You cannot give more than your own BP.');
		targetUser.money += givemoney;
		user.money -= givemoney;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + givemoney + ' BP from you.');
		}
	},

	givetkt: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
	    else {
		if (user.tickets < 1) return this.sendReply('You do not have enough tickets to give.');
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var givetkt = parseInt(targets[1]);
		if (isNaN(givetkt)) return this.sendReply('Invalid number of tickets.');
		if (givetkt < 1) return this.sendReply('Invalid number of tickets.');
		if (givetkt > user.money) return this.sendReply('You cannot give more than your own tickets.');
		targetUser.tickets += givetkt;
		user.tickets -= givetkt;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + givetkt + ' ticket(s) from you.');
		}
	},

	//money commands for admins
	awardbp: 'awardmoney',
	award: 'awardmoney',
	awardmoney: function (target, room, user) {
	     money.read(user)
		if(money.started == false){ this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var addmoney = parseInt(targets[1]);
		if (isNaN(addmoney)) return this.sendReply('Invalid sum of money.');
		targetUser.money += addmoney;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + addmoney + ' Battle Points.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has received ' + addmoney + ' BP from ' + user.name);
	    }
	},

	rmvbp: 'removemoney',
	rmvmoney: 'removemoney',
	removemoney: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false;
		}
		else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var removemoney = parseInt(targets[1]);
		if (isNaN(removemoney)) return this.sendReply('Invalid sum of money.');
		if (removemoney > targetUser.money) return this.sendReply('Invalid sum of money.');
		targetUser.money -= removemoney;
		money.save(user);
		this.sendReply(targetUser.name + ' has had ' + removemoney + ' BP removed from their bagpack.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has had ' + removemoney + ' Battle Points removed from their bagpack by ' + user.name);
	    }
	},
	awardtkt: function (target, room, user) {
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs');
		return false;
        }		
		else {
		money.read(user)
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var addtkt = parseInt(targets[1]);
		if (isNaN(addtkt)) return this.sendReply('Invalid number of tickets.');
		if(user.tkts < addtkts) return this.sendReply('Dont even try');
		else
		targetUser.tkts += addtkt;
		money.save(user)
		this.sendReply(targetUser.name + ' has received ' + addtkt + ' ticket(s).');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has received ' + addtkt + ' ticket(s) from ' + user.name);
	    }
	},

	rmvtkt: function (target, room, user) {
	    if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false
		}
	    else {
		if (!user.can('hotpatch')) return false;
		targets = target.split(',');
		target = toId(targets[0]);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('The user ' + targetUser + ' was not found.');
		var removeticket = parseInt(targets[1]);
		if (isNaN(removemoney)) return this.sendReply('Invalid number of tickets.');
		if (removeticket > targetUser.tickets) return this.sendReply('Invalid number of tickets.');
		targetUser.tkts -= removeticket;
		money.save(user)
		this.sendReply(targetUser.name + ' has had ' + removeticket + ' tickets removed from their bagpack.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(targetUser.name + ' has had ' + removeticket + ' tickets removed from their bagpack by ' + user.name);
	    }
	},

	//Check everyone on server if they have over a certain amount of money 
	checkallmoney: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we ae fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		if (!target) return this.sendReply('You need to enter in a value of ' + item + ' to search.');
        else
		var x = '';
		for (var i in Users.users) {
			if (Users.users[i].money === target || room.users[i].money > target) {
				x += Users.users[i].name + ' : ' + room.users[i].money;
				x += ', ';
			}
			//if (i < room.users.length) x += ', ';
		}
		if (!x) return this.sendReply('No user has over that amount.');

		this.sendReply('Users in this room with over ' + target + ' Battle Points:');
		this.sendReply(x);
		}
	},

	//Check everyone on server if they have over a certain amount of tickets 
	checkalltickets: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we ae fixing bugs'); 
		return false
		}
		else {
		if (!user.can('hotpatch')) return false;
		if (!target) return this.sendReply('You need to enter in a value of ' + item + ' to search.');

		var x = '';
		for (var i in Users.users) {
			if (Users.users[i].tkts === target || Users.users[i].tkts > target) {
				x += Users.users[i].name + ' : ' + Users.users[i].tkts;
				x += ', ';
			}
			//if (i < room.users.length) x += ', ';
		}
		if (!x) return this.sendReply('No user has over that amount.');

		this.sendReply('Users in this room with over ' + target + ' Tickets:');
		this.sendReply(x);
		}
	},

	//DO NOT USE UNLESS NEEDED OTHERWISE IT WILL WIPE EVERYONE'S MONEY AND TICKETS
	clearallbags: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we ae fixing bugs'); 
		return false
		}
	    else {
		if (!user.can('hotpatch')) return false;
		if (!target) return this.sendReply('What you are about to do will clear EVERYONE\'S BAG of money and tickets. Do /clearallbags yes if you want to.');
		var target = target.toLowerCase();
		if (target !== 'yes') return this.sendReply('What you are about to do will clear EVERYONE\'S BAG of money and tickets. Do /clearallbags yes if you want to.');
		else
		money.reset(user)
		this.sendReply('All users bags have been emptied.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(user.name + ' has removed all tickets and Battle Points from everyones bags.');
	    }
	},

	wallet: 'backpack',
	bag: 'backpack',
	bp: 'backpack',
	backpack: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we ae fixing bugs'); 
		return false
		}
		else {
		if(!this.canBroadcast()) return;
		money.save(user)
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (targetUser) {
			this.sendReply(targetUser.name + ' backpack contains:');
			this.sendReply('- Battle Points: ' + targetUser.money);
			this.sendReply('- Tickets: ' + targetUser.tkts);
		} else {
			this.sendReply('Your backpack contains:');
			this.sendReply('- Battle Points: ' + user.money);
			this.sendReply('- Tickets: ' + user.tkts);
		}
		}
	},

	moneyintro: function (target, room, user) {
		this.sendReplyBox('<h2>Money Commands</h2><br /><hr />' +
			'<h3>Every User Commands</h3><br /><hr />' +
			'/buy <em>Use this to buy a item\'s id</em><br />' +
			'/bet <em> Bet a color on the roulette.</em><br />' +
			/*'/scratchtkt <em> Not done but will allow you to scratch a ticket there will be chances to the amount you win. </em><br />'+*/
			'<h3>Voice And Up Commands</h3><br /><hr />' +
			'!shop <em>Allows a voiced user to show the shop.</em><br />' +
			'!moneyintro <em>Shows you this.</em><br />' +
			'!emotes <em>Shows the emote list.</em>' +
			'<h3>Driver And Up Commands</h3><br /><hr />' +
			'/roul <em> Starts a roulette this  will not work in lobby.</em><br />' +
			'/spin <em>Spins the roulette.</em><br />' +
			'<h3>VIP Commands</h3><br /><hr />' +
			'/emote <em>Use ths with the emote ID to display a emote.</em><br />' +
			'/mark <em>Allows you to give yourself a custom sign. (not done yet)</em><br />' +
			'<h3>Admin And Bandi Commands</h3><br /><hr />' +
			'/award <em>Lets you give a user a amount of PokeDollars.</em><br />' +
			'/awardtkt <em> gives the user a amount tickets</em><br />' +
			'/rmvmoney <em> removes an amount of money from a user</em><br />' +
			'/rmvtkt <em>removes an amount of tickets from a user</em><br />' +
			'/checkalltickets <em>check everyone of their amount of tickets</em><br />' +
			'/checkallmoney <em>Checks every users money</em><br />' +
			'<h3>FAQ</h3><br /><hr />' +
			'How do I get Battle Points?: Win a Tournament or a Roulette.<br />' +
			'How do I get tickets? Buy them. Check the shop with /shop<br />' +
			'What is a Roulette? A virtual machine that spins and if it lands on the color you bet you win Battle Points.<br />' +
			'How do i check my Battle Points?: /bp or /wallet or /bag');
	},
	

	shop: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if(money.started == false) this.sendReply('Money isn\'t on yet, we ae fixing bugs');
		else
		this.sendReplyBox('<center></h4><table border="1" cellspacing ="0" cellpadding="4"><b>Welcome to the Battle Shop. Spend your Battle Points (BP) here!</b>' +
			'<tr>' +
			'<th>Item</th>' +
			'<th>Price</th>' +
			'<th>Description</th>' +
			'<th>ID</th>' +
			'</tr>' +
			'<td>Ticket</td>' +
			'<td>50 BP</td>' +
			'<td>A ticket which can be used to win Battle Points</td>' +
			'<td>tkt</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Reel</td>' +
			'<td>475 BP</td>' +
			'<td>A reel of Tickets (Save 5%!) [10 tkts]</td>' +
			'<td>reel</td>' +
			'</tr>' +
			'<td>Ticket Box</td>' +
			'<td>2250 BP</td>' +
			'<td>A box of Tickets (Save 10%!) [50 tkts]</td>' +
			'<td>box</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Chest</td>' +
			'<td>4250 BP</td>' +
			'<td>A chest of Tickets (Save 15%!) [100 tkts]</td>' +
			'<td>chest</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Ticket Truck</td>' +
			'<td>40,000 BP</td>' +
			'<td>A TRUCKLOAD OF TICKETS! (Save 20%!) [1000 tkts]</td>' +
			'<td>truck</td>' +
			'</tr>' +


			/*'<tr>' +
			'<td>Dancing Trapinch</td>' +
			'<td>10,000 BP</td>' +
			'<td>A dancing Trapinch.</td>' +
			'<td>trap</td>' +
			'</tr>' +*/

			'<tr>' +
			'<td>Avatar</td>' +
			'<td>1 RP</td>' +
			'<td>A custom avatar sized 80px x 80px</td>' +
			'<td>ava</td>' +
			'</tr>' +
			
			'<tr>' +
			'<td>Voice</td>' +
			'<td>2 RP</td>' +
			'<td>A promotion to Voice. For more details, use /groups.</td>' +
			'<td>voice</td>' +
			'</tr>'
			);
	},

	buy: function (target, room, user) {
	    money.read(user)
		if(money.started == false){ 
		this.sendReply('Money isn\'t on yet, we are fixing bugs'); 
		return false;
		}
		else {
		if(!target){ 
		this.sendReply('Please specify a item.');
		return false;
		}
		}
		var tar = target;
		if(money.checkItem(target) == false){ 
		return this.sendReply('That item doesn\'t exist');
		return false;
		}
		else {
	money.read(user);
	var taritem = money.shop[target];
	if(taritem.price < user.money || user.money == taritem.price){
	this.sendReply('You have successfully purchased a ' + taritem.name + '.You benefit ' + taritem.benefits + ' from ' + taritem.name +'.');
	user.money -= taritem.price;
	if(taritem.add){
	room.add(taritem.add)
	}
	if(taritem.tkts){
	user.tkts += taritem.tkts;
	}
	if(taritem.say){
	this.parse(taritem.say)
	}
	if(taritem.userproperties){
	Object.merge(user, taritem.userproperties);
	}
	if(taritem.promo && config.groupsranking.indexOf(user.group) < config.groupsranking.indexOf(taritem.promo)){
	  Users.setOfflineGroup(user.userid, taritem.promo);
	}
	money.save(user)
	}
	else{
	this.sendReply('You do not have enough money to purchase that item.');
	return false;
	}
	}
	}
};
Object.merge(CommandParser.commands,cmds);
