
function Person(name, email, id, skills, passions){
	/**
	 * Represents a person within the network.
	 * 
	 * @constructor
	 * @param{string} name - The person name.
	 * @param{int} age - The person age.
	 * @param{string} email - Person email contact.
	 * @param{string} id - Uniquely identifies a person.
	 * @param{array} skills - Person skills.
	 * @param{array} passions - Person passions.
	 */
	this.name = name;
	this.email = email;
	this.id = id;
	
	if (skills == undefined){
		this.skills = []; 
	}
	else{
		this.skills = skills;
	}
	if (passions == undefined){
		this.passions = []; 
	}
	else{
		this.passions = passions;
	}
}

Person.prototype = {
    constructor: Person,
	    
    getInterests:function(){
    	/**
    	 * Get A list containing the person skills and passions
    	 */
    	return this.skills.concat(this.passions)
    	
    },
    
    createMemento:function(){
    	/**
    	 * Creates a memento with the person attributes (in a json representation). This memento can
    	 * be stored in a database (so arrays attrtibutes are converted to strings) and can be used
    	 * recreate the person within a network. As expected the memento will not contain any of the
    	 * Person class methods
    	 */
    	var skills_text = this.skills.join(",");
    	var passions_text = this.passions.join(",");
    	
    	var person_json = {
			'name':this.name,
			'email':this.email, 
			'skills':skills_text, 
			'passions':passions_text,
			'id':this.id
		}
    	
    	return person_json
    },
    
    setMemento:function(memento){
    	var skills_array = splitAndTrim(memento.skills);
    	var passions_array = splitAndTrim(memento.passions);
    	
    	this.name = memento.name;
    	this.email = memento.email;
    	this.id = memento.id;
    	
		this.skills = skills_array;
		this.passions = passions_array;
    }
}

function splitAndTrim(single_text){
	/*
	 * Splits the given string into an array of strings. The comas in the given text will be used
	 * as key to the split method. Also all texts in given array will be trimmed.
	 */
	var text_to_split  = single_text.trim()
	
	if(text_to_split.length == 0){
		return [];
	}
	
	//else...
	var text_tokens = text_to_split.split(',')
	text_array = [];
	
    for (i=0; i<text_tokens.length; i++){
    	text_array.push(text_tokens[i].trim());
    }
    
    return text_array;
}


function Interaction(person, skill_name, date, description, reporter){
	/**
	 * Represent a interactoin betwee a people and a sikil within the network.
	 *
	 *@constructor
	 *@param{string} person_id - The id of the person that used the skill.
	 *@param{string} skill_name - The name of the skill to register the interaction.
	 *@param{Date} date - The interaction date.
	 *@param{string} description - The interaction description.
	 *@param{string} reporter - The id of the person reporing the interaction.
	 */
	this.person_id = person;
	this.skill_name = skill_name;
	this.date = date;
	this.description = description
	this.reporter = reporter
	
}


function SkillNetwork(name){
	/**
	 * Registers the interactions between persons and skills within a network
	 * 
	 * @param{string} name - The network name.
	 */
	this.name = name;
	this.persons = [];
	this.interactions = [];
}

SkillNetwork.prototype = {
    constructor: SkillNetwork,
    
    clear:function(){
    	this.persons = [];
    	this.interactions = [];
    },
    
    addPerson:function(person){
    	/**
    	 * Add a person in the network.
    	 * 
    	 * @param{Person} person - The prson to add.
    	 */
    	if (this.persons[person.id] !== undefined){
    		throw "Id " + person.id + " já cadastrado. Para o nome: " + this.persons[person.id].name
    	}
    	else{
    		this.updatePerson(person);
    	}
    },
    
    updatePerson:function(person){
    	this.persons[person.id] = person;
    	
    },

	    

    getPersonByID:function(person_id){
    	/**
    	 * Get a Person object assciated with the given id.
    	 * 
    	 * @param{String} person_id - The id of the perso to obtain information
    	 * 
    	 * @returns{Person} The person registered with the given id (or undefined if no such person 
    	 * was found).
    	 */
    	return this.persons[person_id];
    },
    
    
    getInterests:function(){
    	/**
    	 * An intrest is either a skill or a passion. This method will obtain all skills and passions
    	 * registered by a person.
    	 */
    	// An associative array to avoid repetitions
    	var  interest_set = []
    	
    	// Iterating over all persons
    	for(person_id in this.persons) {
    		person = this.persons[person_id];
    		
    		//Interating over all person interests
    		var interests = person.getInterests();
    		for (var i=0; i<interests.length; i++){
    			interest = interests[i];
    			interest_set[interest] = interest;
    		}
    	}
    	
    	var interest_array =[]
    	// Creating an array from the associative array
    	for(interest_name in interest_set){
    		interest_array.push(interest_name);
    	}
    	
    	return interest_array;
    },
    
    
    addInteraction:function(interaction){
    	/**
    	 * Add an interacion between a people and a skill.
    	 * 
    	 * @param{Interaction} interaction - the interaction to add.
    	 */
    	this.interactions.push(interaction);
    },

    getPersonInteractions:function(person_id, skill_id){
    	/**
    	 * Retrieve all interactions registered for a given person.
    	 * 
    	 * @param{string} person_id - The id of the person to obtain the interactions
    	 */
    	result =[]
    	
    	for(var i=0; i<this.interactions.length; i++){
    		var inter = this.interactions[i];
    		var valid_skill = (skill_id == undefined) || (skill_id == inter.skill_name);
    		var valid_person = inter.person_id == person_id;
    		if(valid_person && valid_skill){
    			result.push(inter)
    		}
    	}
    	
    	return result;
    }
}



function createTestNetwork(){
	/**
	 * Creates a network to be used in tests.
	 * @returns{SkillNetwork} The created network.
	 * 
	 */
	network = network = new SkillNetwork('Mushroom Kingdom');

	mario = new Person('Mario', 'mario@plumber.com', 'mario_id');
	luigi = new Person('Luigi', 'luigi@plumber.com', 'luigi_id');
	peach = new Person('Peach', 'peach@princess.com', 'princess_peach_id');
	bowser = new Person('Bowser', 'bowser@overlord.com', 'bowser_id');
	toad = new Person('Toad', 'toad@mushroom.com', 'toad_id');
	yoshi = new Person('Yoshi', 'yoshi@dino.com', 'yoshi_id');
	koopa = new Person('Koopa', 'koopa@henchmen.com', 'koopa_id');
	
	mario.skills = ['Jump', 'Shooting', 'Dino Ridding'];
	mario.passions = ['Gardening', 'Italian Food'];

	luigi.skills = ['Running'];
	luigi.passions = ['Italian Food', 'Milan FC'];
	
	
	peach.skills = ['Charisma'];
	peach.passions = ['Flowers', 'Martial Arts'];
	
	
	bowser.skills = ['Planning'];
	bowser.passions = ['Old Castles'];
	
	
	toad.skills = ['Running'];
	toad.passions = ['Old Castles'];
	
	
	yoshi.skills = ['Running'];
	yoshi.passions = ['Coins', 'Apples'];
	
	
	koopa.skills = ['March'];
	koopa.passions = ['Cannons', 'Flying Boats'];

	network.addPerson(mario);
	network.addPerson(luigi);
	network.addPerson(peach)
	network.addPerson(bowser)
	network.addPerson(toad)
	network.addPerson(yoshi)
	network.addPerson(koopa)

	// Registering some interactions for mario
	interaction_date = new Date(1988, 10, 30);
	mario_interaction_1 = new Interaction('mario_id', 'Shooting', interaction_date, 'Mario Defeated Bowser with a flower shot', 'princess_peach_id');
	mario_interaction_2 = new Interaction('mario_id', 'Jump', interaction_date, 'Mario Jumped over an incredible ledge', 'luigi_id');
	mario_interaction_3 = new Interaction('mario_id', 'Dino Ridding', interaction_date, 'He passed like the wind', 'toad_id');
	mario_interaction_4 = new Interaction('mario_id', 'Shooting', interaction_date, 'Mario made a barbecue with  flower shot', 'yoshi_id');
	
	network.addInteraction(mario_interaction_1);
	network.addInteraction(mario_interaction_2);
	network.addInteraction(mario_interaction_3);
	network.addInteraction(mario_interaction_4);
	
	
	return network;
}


//This code might be invoke from the browser. In this case we dont need to export the functions 
// (in fact we can't).
if (typeof module !== 'undefined' && module.exports) {
	module.exports ={
		createTestNetwork: createTestNetwork,
		SkillNetwork:SkillNetwork,
		Interaction:Interaction,
		Person:Person,
	}
}
