
function Person(name, age, email, id){
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
	this.age = age;
	this.email = email;
	this.id = id;
}


function Skill(name, description){
	/**
	 * Represent a skill within the network.
	 * 
	 * @constructor.
	 * @param{string} name - The skill name.
	 * @oaram{string} description - The skill description.
	 */
	this.name=name;
	this.description = description;
	
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
    		throw "There is already a person with id: " + person.id
    	}
    	else{
    		this.persons[person.id] = person;
    	}
    },

	addSkill:function(skill){
		/**
		 * Add a skill in the network.
		 * 
		 * @param{Skill} skill - The skill to add.
		 */
		this.skills[skill.name] = skill;
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
    
    getSkillByName:function(skill_name){
    	/**
    	 * Retrieve the skill associated with a given name.
    	 * 
    	 * @param{string} skill_name - The skill name.
    	 * @returns{Skill} The registered skill (or undefined if no such skill was found.
    	 */
    	return this.skills[skill_name];
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

	mario = new Person('Mario', 45, 'mario@plumber.com', 'mario_id');
	luigi = new Person('Luigi', 38, 'luigi@plumber.com', 'luigi_id');
	peach = new Person('Peach', 28, 'peach@princess.com', 'princess_peach_id');
	bowser = new Person('Bowser', 28, 'bowser@overlord.com', 'bowser_id');
	toad = new Person('Toad', 28, 'toad@mushroom.com', 'toad_id');
	yoshi = new Person('Yoshi', 28, 'yoshi@dino.com', 'yoshi_id');
	koopa = new Person('Koopa', 28, 'koopa@henchmen.com', 'koopa_id');
	
	network.addPerson(mario);
	network.addPerson(luigi);
	network.addPerson(peach)
	network.addPerson(bowser)
	network.addPerson(toad)
	network.addPerson(yoshi)
	network.addPerson(koopa)

	// Skills
	jump_skill = new Skill('Jump', 'Very usefull to cross over holes') ;
	fire_flower_shot = new Skill('Shooting', 'Fires small fireballs over enemies');
	charisma = new Skill('Charisma', "Some have, others don't");
	planning = new Skill('Planning', "Now all i want is one paper clip, two bananas and a fork...");
	running = new Skill('Running', "Out of my way!");
	dino_riding = new Skill('Dino Ridding', "yeeeeeeeeeeeha!");
	march = new Skill('March', "1, 2, 1, 2, 1, 2!");
	
	network.addSkill(jump_skill);
	network.addSkill(fire_flower_shot);
	network.addSkill(charisma);
	network.addSkill(planning);
	network.addSkill(running);
	network.addSkill(dino_riding);
	network.addSkill(march);
	
	// Interactions 
	jump_lessons = new Interaction(
		mario.id, 
		jump_skill.name, 
		new Date(1981, 30, 10), 
		'Mario have jump lessons to Luigi'
	);
	dino_ridding = new Interaction(
			mario.id, 
			dino_riding.name, 
			new Date(1981, 30, 10), 
			'Mario and yoshi are as one'
	);

	princess_save = new Interaction(
		mario.id, 
		fire_flower_shot.name, 
		new Date(1981, 30, 11),
		'Mario saved peach using the fire flower.'
	);
	princess_charisma = new Interaction(
		peach.id, 
		charisma.name, 
		new Date(1981, 30, 11),
		'Peach was like a sunshine that day.'
	);
	kidnap_planning = new Interaction(
			bowser.id, 
			planning.name, 
			new Date(1981, 30, 11),
			'Peach was like a sunshine that day.'
	);
	running_luigi = new Interaction(
			luigi.id, 
			running.name, 
			new Date(1981, 30, 11),
			'Faster than a Usain Bolt.'
	);
	running_toad = new Interaction(
			toad.id, 
			running.name, 
			new Date(1981, 30, 11),
			'Just a little slower than luigi.'
	);
	koopa_march = new Interaction(
			koopa.id, 
			march.name, 
			new Date(1981, 30, 11),
			'Foward.'
	);

	yoshi_run = new Interaction(
			yoshi.id, 
			running.name, 
			new Date(1981, 30, 11),
			'vushhhhhh.'
	);
	
	
	network.addInteraction(jump_lessons);
	network.addInteraction(princess_save);
	network.addInteraction(princess_charisma);
	network.addInteraction(kidnap_planning);
	network.addInteraction(running_luigi);
	network.addInteraction(running_toad);
	network.addInteraction(koopa_march);
	network.addInteraction(dino_ridding);
	network.addInteraction(yoshi_run);
	
	return network;
}