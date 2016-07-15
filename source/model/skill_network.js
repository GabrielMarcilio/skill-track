
function Person(name, email, id, skills){
	/**
	 * Represents a person within the network.
	 * 
	 * @constructor
	 * @param{string} name - The person name.
	 * @param{int} age - The person age.
	 * @param{string} email - Person email contact.
	 * @param{string} id - Uniquely identifies a person.
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
}


function Interaction(person, skill_name, date, description){
	/**
	 * Represent a interactoin betwee a people and a sikil within the network.
	 *
	 *@constructor
	 *@param{string} person - The id of the person that used the skill.
	 *@param{string} skill_name - The name of the skill to register the interaction.
	 *@param{Date} date - The interaction date.
	 *@param{string} description - The interaction description.
	 */
	this.person = person;
	this.skill_name = skill_name;
	this.date = date;
	this.description = description
	
}


function SkillNetwork(name){
	/**
	 * Registers the interactions between persons and skills within a network
	 * 
	 * @param{string} name - The network name.
	 */
	this.name = name;
	this.persons = [];
	this.skills =[];
	this.interactions = [];
}

SkillNetwork.prototype = {
    constructor: SkillNetwork,
    
    addPerson:function(person){
    	/**
    	 * Add a person in the network.
    	 * 
    	 * @param{Person} person - The prson to add.
    	 */
    	if (this.persons[person.id] !== undefined){
    		throw "Id " + person.id + " já cadastrado. Para o nome:" + this.persons[person.id].name
    	}
    	else{
    		this.updatePerson(person);
    	}
    },
    
    updatePerson:function(person){
    	this.persons[person.id] = person;
    	
    	for (var i=0; i<person.skills.length; i++){
    		skill = person.skills[i];
    		this.skills[skill] = skill
    	}

    },

	addSkill:function(skill){
		/**
		 * Add a skill in the network.
		 * 
		 * @param{Skill} skill - The skill to add.
		 */
		this.skills[skill] = skill;
	},
    
    addInteraction:function(interaction){
    	/**
    	 * Add an interacion between a people and a skill.
    	 * 
    	 * @param{Interaction} interaction - the interaction to add.
    	 */
    	this.interactions.push(interaction);
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
    
    
    getPersonInteractions:function(person_id){
    	/**
    	 * Retrieve all interactions registered for a given person.
    	 * 
    	 * @param{string} person_id - The id of the person to obtain the interactions
    	 */
    	result = this.interactions.filter(inter => inter.person == person_id);
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
	luigi.skills = ['Running'];
	peach.skills = ['Charisma'];
	bowser.skills = ['Planning'];
	toad.skills = ['Running'];
	yoshi.skills = ['Running'];
	koopa.skills = ['March'];

	network.addPerson(mario);
	network.addPerson(luigi);
	network.addPerson(peach)
	network.addPerson(bowser)
	network.addPerson(toad)
	network.addPerson(yoshi)
	network.addPerson(koopa)

	return network;
}
