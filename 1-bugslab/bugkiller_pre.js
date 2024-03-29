/**
 * @license
 * Game created by Alberto Congiu
 * twitter.com/4lbertoc
 */

var game = game || {};

game.goal = function() {
	var text = gamestrings.gamegoal;
	alert(text);
};

game.commands = function() {
	var commands = gamestrings.commands;
	alert(commands);
};

game.Food = function () {};

game.Lab = game.Lab || {};

game.Lab.motherDNA = {
		'onClickBehavior': function() {
			alert("Grrr...");
		},
		'onHatch': null,
		'onSpawn': null
};

game.Lab.bugDNA = {
		'onClickBehavior': function() {
			alert("Ouch!");
		},
		'onSpawn': null
};

function log(message) {
	console.log(message);
}

var run = function() {
	var numBugs = 1;
	var mainContainer = document.getElementById('desk');
	var fieldContainer = null;
	var safeContainer = null;

	var otherShitInTheFlask = 2;
	
	var outerBugs = [];
	
	var livingMother = null;
	
	var stringScramble = function(str) {
		var n = '';
		for(var i = 0; i < str.length; i++) {
			if(str[i] == '\n') {
				n += str[i];
			}
			else {
				n += String.fromCharCode(str.charCodeAt(i) ^ 1);
			}
		}
		return (n);
	};
	
	game.Food.add = function (quantity) {
		quantity = quantity || 1;
		for(var i = 0; i < quantity; i++) {
			var f = document.createElement('div');
			f.setAttribute('class','food');
			f.style.left = (10 + Math.floor(Math.random() * 70)) + '%';
			f.style.top = (10 + Math.floor(Math.random() * 70)) + '%';

			fieldContainer.appendChild(f);
		}
	};
	
	game.Lab.addMother = function() {
		var foodElements = document.getElementsByClassName('food');
		if(foodElements.length > 0)
		{
			foodElements[0].parentNode.removeChild(foodElements[0]);
			livingMother = new Mother(fieldContainer);
			livingMother.spawn();
		}
		else
		{
			log(stringScramble(gamestrings.notenoughfood));
		}
	};
	
	var Mother = function(container) {
		this.container = container;
		this.bugDNA = {};
		for(i in game.Lab.bugDNA)
			this.bugDNA[i] = game.Lab.bugDNA[i];
		this.motherDNA = {};
		for(i in game.Lab.motherDNA)
			this.motherDNA[i] = game.Lab.motherDNA[i];
	};
	
	Mother.prototype.spawn = function() {
		var newMother = document.createElement('div');
		newMother.setAttribute('class','mother bugcursor');
		newMother.style.left = (10 + Math.floor(Math.random() * 70)) + '%';
		newMother.style.top = (10 + Math.floor(Math.random() * 70)) + '%';
		newMother.innerHTML = '<p>U_U</p>';
		newMother.title = stringScramble(gamestrings.mothertitle);
		newMother.onclick = this.motherDNA['onClickBehavior'];
		
		this.body = newMother;
		
		var mother = this;
		var hatcher = null;
		hatcher = setInterval(function() {
			if(mother.body.parentNode != null)
				mother.hatch();
			else
				clearInterval(hatcher);
		},250);
		this.container.appendChild(newMother);
		if(this.motherDNA['onSpawn'])
			this.motherDNA['onSpawn']();
		console.log(stringScramble(gamestrings.motherspawned));
	};
	
	Mother.prototype.hatch = function() {
		
		var Bug = function () {};
		
		var mother = this;
		Bug.prototype.spawn = function(container) {
			if(!this.body)
			{
				var newBug = document.createElement('div');
				newBug.setAttribute('class','bug bugcursor');
				newBug.title = stringScramble(gamestrings.bugtitlefield);
				newBug.style.left = (10 + Math.floor(Math.random() * 80)) + '%';
				newBug.style.top = (10 + Math.floor(Math.random() * 80)) + '%';
				newBug.innerHTML = ':E';
				newBug.onclick = mother.bugDNA['onClickBehavior'];
				
				container.appendChild(newBug);
				this.body = newBug;
				
				var bug = this;
				this['proliferationBehavior'] = setInterval(function() {
					bug.canProliferate = true;
					if(bug.body.parentElement == mainContainer) {
						bug.body.style.background = '#0f0';
						var a = new Bug();
						a.spawn(bug.body.parentElement);
						a.hasProliferated = true;
						a.body.style.background = '#f55';
						a.body.title = stringScramble(gamestrings.bugtitlefree);
						log(stringScramble(gamestrings.bugspreading));
					}
				},10000);

				if(mother.bugDNA['onSpawn'])
					mother.bugDNA['onSpawn'].call(this);
				
				outerBugs.push(this);
				
				console.log(stringScramble(gamestrings.bugspawned));
			}
		};
		
		if(mother.body.parentNode.childElementCount < numBugs) {
			var newBug = new Bug();
			newBug.spawn(this.container);
		}
		if(this.motherDNA['onHatch'])
			this.motherDNA['onHatch']();
	};

	var createFieldContainer = function(mainContainer) {
		var gameDiv = document.createElement('div');
		gameDiv.setAttribute('class','field');
		
		mainContainer.appendChild(gameDiv);
		
		return gameDiv;
	};
	
	var createSafeContainer = function(mainContainer) {
		var gameDiv = document.createElement('div');
		gameDiv.setAttribute('class','flask');
		
		mainContainer.appendChild(gameDiv);
		
		return gameDiv;
	};
	
	var createCounter = function(mainContainer) {
		var counterDiv = document.createElement('div');
		counterDiv.setAttribute('style','position: absolute; right: 0px; top:0px');
		counterDiv.innerHTML = stringScramble(gamestrings.bugsinflask) + '0';
		
		mainContainer.appendChild(counterDiv);
		
		setInterval(function () {
			var num = mainContainer.childElementCount - otherShitInTheFlask;
			while(num > 10) {
				var a = mainContainer.children[otherShitInTheFlask];
				mainContainer.removeChild(a);
				a.style.background = '#f55';
				a.classList.remove('safebug');
				a.title = stringScramble(gamestrings.bugtitlefree);
				mainContainer.parentNode.appendChild(a);
				log(stringScramble(gamestrings.uhoh));
				num = mainContainer.childElementCount - otherShitInTheFlask;
			}
			for(var i = otherShitInTheFlask; i < mainContainer.childElementCount; i++) {
				var el = mainContainer.children[i];
				if(!el.classList.contains('safebug')) {
					el.classList.add('safebug');
					el.title = stringScramble(gamestrings.bugtitleinflask);
				}
			}
			counterDiv.innerHTML = stringScramble(gamestrings.bugsinflask) +
				num;}, 1000);
	};
	
	fieldContainer = createFieldContainer(mainContainer);
	safeContainer = createSafeContainer(mainContainer);
	createCounter(safeContainer);
	
	setInterval(function() {
		var foodElements = document.getElementsByClassName('food');
		var mothers = document.getElementsByClassName('mother');
		if(foodElements.length > 0 && mothers.length == 0)
		{
			numBugs *= 2;
			game.Lab.addMother();
		}
	},5000);
	
	(function addSubmitButton() {
		var button = document.createElement('input');
		button.setAttribute('class','submitbutton');
		button.type = 'button';
		button.value = 'Submit';
		safeContainer.appendChild(button);
		
		var submissionCheck = function() {
			var stillInFieldBugs = 0;
			var savedBugs = 0;
			var normalBugs = 0;
			var inhibitedBugs = 0;
			var proliferatedBugs = 0; 
			
			for(var i = 0; i < outerBugs.length; i++)
			{
				var curBug = outerBugs[i];
				if(curBug.body.parentNode == safeContainer)
				{
					savedBugs += 1;
					if(curBug.canProliferate) {
						normalBugs += 1;
					}
					else {
						inhibitedBugs += 1;
					}
					if(curBug.hasProliferated) {
						proliferatedBugs += 1;
					}
				}
				else if(curBug.body.parentNode != null) {
					stillInFieldBugs += 1;
				}
			}
			
			var msg = "";
			msg += ("You collected " + savedBugs + " bugs...");
			if(savedBugs < 10) {
				msg += (stringScramble(gamestrings.notenoughbugs));
			}
			else if(stillInFieldBugs > 0) {
				msg += (" but " + stillInFieldBugs + 
						stringScramble(gamestrings.bugsoutside));
			}
			else {
				var ending = "";
				if(inhibitedBugs == 0 || proliferatedBugs == 0){
					ending = stringScramble(gamestrings.candobetter);
				}
				else {
					ending = stringScramble(gamestrings.complete);
				}
				if(inhibitedBugs > 0 || proliferatedBugs > 0){
					msg += ("...of which:");
					msg += ("\n\n");
					msg += (normalBugs + stringScramble(gamestrings.normalbugs));
					if(inhibitedBugs > 0) {
						msg += ("\n\n");
						msg += (inhibitedBugs + stringScramble(gamestrings.inhibited));
					}
					if(proliferatedBugs > 0) {
						msg += ("\n\n");
						msg += (proliferatedBugs + stringScramble(gamestrings.proliferated));
					}
				}
				msg += (ending);
			}
			
			alert(msg);
		};
		
		button.onclick = submissionCheck;
	})();
	
	log('Hello! Have a look at game object and game.goal() to get more information and game.commands() to know where to start!');
	alert('Open your JS console!');
};

window['game'] = game;
window['game']['goal'] = game.goal;
window['game']['commands'] = game.commands;
window['game']['Food'] = game.Food;
window['game']['Food']['add'] = game.Food.add;
window['game']['Lab'] = game.Lab;
window['game']['Lab']['motherDNA'] = game.Lab.motherDNA;
window['game']['Lab']['bugDNA'] = game.Lab.bugDNA;
window['game']['run'] = run;