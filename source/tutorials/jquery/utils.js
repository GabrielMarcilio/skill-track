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
    	
    }
}

function createPersons(){
	
	  mario = new Person('Mario', 'mario@nintendo.com', 'mario');
	  luigi = new Person('Luigi', 'luigi@nintendo.com', 'luigi');

	  mario.skills = ['Running', 'Jumping'];
	  mario.passions = ['Juventus', 'Pasta'];

	  luigi.skills = ['Jumping', 'Dino Ridding']; 
	  luigi.passions = ['Cooking', 'Ferrari f1']; 

	  return [mario, luigi]
}