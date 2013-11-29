exports.roul = function(r){
if (typeof r != "undefined"){ 
var roul = r; 
}
else {
var roul = new Object();
}
var Roulettestuff = {
colors: ['red','red','red','red','red','red','red','red','red','red','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','green','green','green','green','orange','orange','orange','orange','black','black','gold'],
reset: function(room){
 roul[room.id] = {
        color: null,
		winners: [],
		users: [],
		isOn: false,
		};
		},
		start: function(room, user){
		var part1 = '<h3><font size="2"><font color="green">A roulette has been started by</font><font size="2"><font color="black">' + user.name +'</font></h3><br />';
		var part2 = 'To bet do /bet then one of the following colors: red, yellow, green , black , orange<br />';
		var part3 = '<b>black</b> = 5000 BP <br /><font color=#ffff00><b>yellow</b></font color> & <font color="red"><b>red</b></font color> = 100 BP<br /> <font color="green"><b>green</b></font color> & <font color=#ff881f><b>orange</b></font color> = 500 BP<br /><font color=rgb(249,237,50)><b><i>gold</i></b></font color> = 100,000,000 BP (Feelin\' lucky?)<br /></b><i>(Hint: red = 25%, yellow = 25%, green = 20%, orange = 20%, black = 9%, gold = 1%)';
		room.addRaw(part1 + part2 + part3);
		roul[room.id].isOn = true; 
	
		},
		
};
Users.User.prototype.bet = null;
Users.User.prototype.bets = 0;
Object.merge(roul, Roulettestuff);
return roul
};
var cmds = {
roul: 'startroulette',
	roulette: 'startroulette',
	startroulette: function (target, room, user) {
		if (!user.can('host')) {
			return this.sendReply('Whoa, kid! You\'re not old enough to gamble!');
		}
		var rid = room.id;
		var uid = user.userid;
		var winners = roul[rid].winners;
		var color = roul[rid].color;
		if (!roul[rid].isOn == false) {
			return this.sendReply('There is already a roulette on.');
		} else {
			roul.start(room, user);
		}

	},

	bet: function (target, room, user) {
	    var rid = room.id;
		if (!roul[rid].isOn) return this.sendReply('There is no roulette game running in this room.');
		targets = target.split(',');
		target = toId(targets[0]);
		if (roul.colors.indexOf(target) === -1) return this.sendReply(target + ' is not a valid color.');
		if (targets[1]) {
			var times = parseInt(toId(targets[1]));
			if (!isNaN(times) && times > 0) {
				if (user.tkts < times) return this.sendReply('You do not have enough tickets!');
				user.bets += times;
				user.tkts -= times;
				user.bet = target;
			} else {
				return this.sendReply('That is an invalid amount of bets!');
			}
		} else {
			if (user.tkts < 1) return this.sendReply('You do not even have a ticket!');
			user.bets++;
			user.tkts--;
			user.bet = toid(targets[0]);
		}
		if (roul[rid].users.indexOf(user.userid) === -1) roul[rid].users.push(user.userid);
		return this.sendReply('You are currently betting ' + user.bets + ' times to ' + target);

	},

	spin: function (target, room, user) {
		if (!roul[room.id].isOn == true) return this.sendReply('There is no roulette game currently.');
		if (users === 0) return this.sendReply('Nobody has made bets in this game');
		for (var i = 0; i < roul[rid].users.length; i++) {
			var loopuser = Users.get(roul[rid].users[i]);
			var loopchoice = '';
			if (loopuser) {
				loopchoice = loopuser.bet;
				if (loopchoice === color) winners.push(loopuser.userid);
			} else {
				continue;
			}
		}

		if (winners === []) {
			for (var i = 0; i < roul[room.id].users.length; i++) {
				var loopuser = Users.get(roul[rid].users[i]);
				if (loopuser) {
					loopuser.bet = null;
					loopuser.bets = 0;
				}
			}
			return room.addRaw('Nobody won this time');
		}

		var perbetwin = 0;
        roul[room.id].color = roul.colors[Math.floor(Math.random*roul.colors.length)]
		switch (roul[room.id].color) {
		case "red":
			perbetwin = 100;
			break;
		case "yellow":
			perbetwin = 100;
			break;
		case "black":
			perbetwin = 5000;
			break;
		case "green":
			perbetwin = 500;
			break;
		case "orange":
			perbetwin = 500;
			break;
		case "gold":
			perbetwin = 100000000;
		}

		for (var i = 0; i < winners.length; i++) {
			loopwinner = Users.get(winners[i]);
			totalwin[i] = perbetwin * loopwinner.bets;
			loopwinner.money += totalwin[i];
			loopwinner.prewritemoney();
		}
		if (winners.length) Users.exportUserwealth();

		for (var i = 0; i < roul[rid].users.length; i++) {
			var loopuser = Users.get(roul.users[i]);
			if (loopuser) {
				loopuser.bet = null;
				loopuser.bets = 0;
			}
		}
		if (winners.length === 1) {
			room.addRaw('The roulette landed on ' + color + '. The only winner was ' + winners[0] + ', who won the sum of ' + totalwin[0] + ' Battle Points.');
		} else if (winners.length) {
			room.addRaw('The roulette landed on ' + color + '. Winners: ' + winners.toString() + '. They won, respectively, ' + totalwin.toString() + ' Battle Points.');
		} else {
			room.addRaw('The roulette landed on ' + color + '. Nobody won this time.');
		}
		roul.reset(room);
		},
	endroul: function(target, room, user){
	if(user.can('host')){
	this.add('The roulette has been ended!');
	roul.reset(room);
	}
	}
};
Object.merge(CommandParser.commands, cmds);
