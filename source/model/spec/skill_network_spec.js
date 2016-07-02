

describe("Testing Skill Network", function() {
	beforeEach(function() {
		// Creating Mushroom kingdon network to use in tests
		this.network = network = new SkillNetwork('Mushroom Kingdom');

		this.mario = new Person('Mario', 45, 'mario@plumber.com', 'mario_id');
		this.luigi = new Person('Luigi', 38, 'luigi@plumber.com', 'luigi_id');
		this.peach = new Person('Peach', 28, 'peach@princess.com', 'princess_peach_id');
		
		network.addPerson(this.mario);
		network.addPerson(this.luigi);
		network.addPerson(this.peach)

		// Skills
		this.jump_skill = new Skill('Jump', 'Very usefull to cross over holes') ;
		this.fire_flower_shot = new Skill('Shooting', 'Fires small fireballs over enemies');
		this.charisma = new Skill('Charisma', "Some have, others don't");
		
		network.addSkill(this.jump_skill);
		network.addSkill(this.fire_flower_shot);
		network.addSkill(this.charisma);
		
		// Interactions 
		this.jump_lessons = new Interaction(
			this.mario.id, 
			'Jump', 
			new Date(1981, 30, 10), 
			'Mario have jump lessons to Luigi'
		);

		this.princess_save = new Interaction(
			this.mario.id, 
			'Shooting', 
			new Date(1981, 30, 11),
			'Mario saved peach using the fire flower.'
		);
		
		network.addInteraction(this.jump_lessons);
		network.addInteraction(this.princess_save);
	});
	
	it("Testing getPersonByID", function(){
		// Check if we can Get Persons by id
		person = this.network.getPersonByID(this.mario.id);
		expect(person).toBe(this.mario);

		person = this.network.getPersonByID(this.peach.id);
		expect(person).toBe(this.peach);
		expect(person).not.toBe(this.luigi);
		
		// Checking for a person that do not exist
		person = this.network.getPersonByID('koopa');
		expect(person).toBe(undefined);
		
		
		// Adding a person with an id already in use. Expecting an error
		var addClone = function() {
			mario_clone = new Person('Mario', 45, 'mario@plumber.com', 'mario_id');
			network.addPerson(mario_clone);
	    };
		expect(addClone).toThrow("There is already a person with id: mario_id");
	});
	
	it("Testing Skills Add/Get methods", function(){
		skill = this.network.getSkillByName("Jump");
		expect(skill).toBe(this.jump_skill);
	});
	
	
	it("Testing get interaction method", function(){
		
		mario_interactions = this.network.getPersonInteractions(this.mario.id);
		expect(mario_interactions.length).toBe(2);
		
		jump_index = mario_interactions.indexOf(this.jump_lessons);
		expect(jump_index).not.toBe(-1);
		
		save_index = mario_interactions.indexOf(this.princess_save);
		expect(save_index).not.toBe(-1);
	});
	
});
