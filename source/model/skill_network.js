
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