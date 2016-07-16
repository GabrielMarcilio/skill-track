

describe("Testing Skill Network", function() {
	beforeEach(function() {
		// Creating Mushroom kingdon network to use in tests
		this.network = new createTestNetwork();
		
	});
	
	it("Testing getPersonByID", function(){
		// Check if we can Get Persons by id
		person = this.network.getPersonByID('mario_id');
		expect(person.name).toBe('Mario');

		person = this.network.getPersonByID('princess_peach_id');
		expect(person.name).toBe('Peach');
		
		// Checking for a person that do not exist
		person = this.network.getPersonByID('koopa');
		expect(person).toBe(undefined);
		
		// Adding a person with an id already in use. Expecting an error
		var addClone = function() {
			mario_clone = new Person('Mario', 'mario@plumber.com', 'mario_id');
			network.addPerson(mario_clone);
	    };
		expect(addClone).toThrow('Id mario_id já cadastrado. Para o nome: Mario');
	});
	
	
	it("Testing Get Skills", function(){
		
		skills_obtained = this.network.getSkills();
		var expected_skills = [ 
            'Jump', 'Shooting', 'Dino Ridding', 'Running', 'Charisma', 'Planning', 'March' 
        ];
		
		expect(skills_obtained.length).toBe(7);
		
		for(var i=0; i<expected_skills; i++){
			expected_skill = expected_skills[i]
			expect(skills_obtained.indexOf(expected_skill)).not.toBe(-1);
		}
		
		// Removing some skills from one element
		mario = this.network.getPersonByID('mario_id');
		mario.skills = ['Jump', 'Shooting']
		this.network.updatePerson(mario)
		
		// Addiing a new skill to another network member
		peach = this.network.getPersonByID('princess_peach_id');
		peach.skills = ['Charisma', 'Jiu-Jitsu']
		
		dino_index = expected_skills.indexOf('Dino Ridding')
		expected_skills.splice(dino_index, 1);
		
		expected_skills.push('Jiu-Jitsu')
		skills_obtained = this.network.getSkills();
		
		for(var i=0; i<expected_skills.length; i++){
			expected_skill = expected_skills[i]
			expect(skills_obtained.indexOf(expected_skill)).not.toBe(-1);
		}
		
	});
	
	xit("Testing get interaction method", function(){
		
		mario_interactions = this.network.getPersonInteractions('mario_id');
		expect(mario_interactions.length).toBe(3);
		
	});
	
});
