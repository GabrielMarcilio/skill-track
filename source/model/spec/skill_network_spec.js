

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
	
	
	it("Testing Get Interests", function(){
		
		skills_obtained = this.network.getInterests();
		var expected_skills = [ 
            'Jump', 'Shooting', 'Dino Ridding', 'Running', 'Charisma', 'Planning', 'March',
            'Gardening', 'Italian Food', 'Milan FC', 'Flowers', 'Martial Arts', 'Old Castles',
            'Coins', 'Apples', 'Cannons', 'Flying Boats'
        ];
		
		expect(skills_obtained.length).toBe(17);
		
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
		skills_obtained = this.network.getInterests();
		
		for(var i=0; i<expected_skills.length; i++){
			expected_skill = expected_skills[i]
			expect(skills_obtained.indexOf(expected_skill)).not.toBe(-1);
		}
		
	});
	
	it("Testing get interaction method", function(){
		
		mario_interactions = this.network.getPersonInteractions('mario_id');
		expect(mario_interactions.length).toBe(4);
		
		mario_shooting_iteractions = this.network.getPersonInteractions('mario_id', 'Shooting');
		expect(mario_shooting_iteractions.length).toBe(2);
		
	});
	
	
	it("Test get interests", function(){
		mario = this.network.getPersonByID('mario_id');
		
		expected_interests = ['Jump', 'Shooting', 'Dino Ridding', 'Gardening', 'Italian Food'];
		mario_interests = mario.getInterests()
		
		for(var i=0; i<expected_interests.length; i++){
			expected_interest = expected_interests[i]
			expect(mario_interests.indexOf(expected_interest)).not.toBe(-1);
		}
		
	});
	
	it("Test Get and Set Memento", function(){
		mario = new Person('Mario', 'mario@plumber.com', 'mario_id')
		mario.skills = ['Jump', 'Shooting', 'Dino Ridding'];
		mario.passions = ['Gardening', 'Italian Food'];
		
		mario_memento = mario.createMemento();
		
		// Check if the person skills and passions where converted to strings
		console.log('Memento skills: ' + mario_memento.skills);
		expect(mario_memento.skills).toBe('Jump,Shooting,Dino Ridding');
		expect(mario_memento.passions).toBe('Gardening,Italian Food');
		
		clonned_mario = new Person();
		clonned_mario.setMemento(mario_memento);
		
		expect(clonned_mario.name).toBe('Mario');
		expect(clonned_mario.email).toBe('mario@plumber.com');
		expect(clonned_mario.id).toBe( 'mario_id');
		
		expect(clonned_mario.skills.length).toBe(3);
		// When the memento is set the vakues are converted once again to array
		for(var i=0; i<3; i++){
			expect(clonned_mario.skills[i]).toBe(mario.skills[i])
		}

		expect(clonned_mario.passions.length).toBe(2);
		for(var i=0; i<3; i++){
			expect(clonned_mario.passions[i]).toBe(mario.passions[i])
		}
		
	})
	
});
