

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
			mario_clone = new Person('Mario', 45, 'mario@plumber.com', 'mario_id');
			network.addPerson(mario_clone);
	    };
		expect(addClone).toThrow("There is already a person with id: mario_id");
	});
	
	xit("Testing get interaction method", function(){
		
		mario_interactions = this.network.getPersonInteractions('mario_id');
		expect(mario_interactions.length).toBe(3);
		
	});
	
});
