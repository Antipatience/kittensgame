/**
 * Dimplomacy
 */ 
dojo.declare("com.nuclearunicorn.game.upgrades.DiplomacyManager", null, {

	game: null,
	
	races: [{
		name: "lizards",
		title: "Lizards",
		trait: "friendly",	//neutral, friendly, agressive
		unlocked: false
	},{
		name: "sharks",
		title: "Sharks",
		trait: "neutral",
		unlocked: false
	}],
	
	constructor: function(game){
		this.game = game;
	},

	get: function(raceName){
		for( var i = 0; i< this.races.length; i++){
			if (this.races[i].name == raceName){
				return this.races[i];
			}
		}
		console.error("Failed to get race for id '"+raceName+"'");
		return null;
	},
	
	save: function(saveData){
		saveData.diplomacy = {
			races: this.races
		}
	},
	
	load: function(saveData){
		if (saveData.diplomacy){
			var diplomacy = saveData.diplomacy.races;

			
			if (saveData.diplomacy.races && saveData.diplomacy.races){
				for(var i = 0; i< saveData.diplomacy.races.length; i++){
					var savedRace = saveData.diplomacy.races[i];
					
					if (savedRace != null){
						var race = this.game.diplomacy.get(savedRace.name);
	
						race.unlocked = savedRace.unlocked;
					}
				}
			}
		}
	},
	
	hasUnlockedRaces: function(){
		for (var i = 0; i< this.races.length; i++){
			if (this.races[i].unlocked){
				return true;
			}
		}
		return false;
	},
	
	unlockRandomRace: function(){
		var unmetRaces = [];
		for (var i = 0; i< this.races.length; i++){
			if (!this.races[i].unlocked){
				unmetRaces.push(this.races[i]);
			}
		}
		
		var raceId = (Math.floor(Math.random()*unmetRaces.length));
		unmetRaces[raceId].unlocked = true;
		
		return unmetRaces[raceId];
	},
	
	update: function(){
		if (!this.hasUnlockedRaces()){
			
			if (this.game.calendar.year <20){
				return;
			}
			
			var race = this.unlockRandomRace();
			
			this.game.diplomacyTab.visible = true;
			this.game.render();
			
			this.game.msg("An emissary of " + race.title + " comes to your village");
		} 
	}

});
 

dojo.declare("com.nuclearunicorn.game.ui.tab.Diplomacy", com.nuclearunicorn.game.ui.tab, {
	
	racePanels: null,
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;
		
		this.racePanels = [];
	},
	
	render: function(tabContainer){
		this.inherited(arguments);
		var races = this.game.diplomacy.races;
		
		for (var i = 0; i< races.length; i++){
			var race = races[i];
			if (!race.unlocked){
				continue;
			}

			var racePanel = new com.nuclearunicorn.game.ui.Panel(race.title);
			var content = racePanel.render(tabContainer);

			//---------- render shit there -------------
			
			this.racePanels.push(racePanel);
		}
	},
	
		
	update: function(){
		this.inherited(arguments);
	}
});
