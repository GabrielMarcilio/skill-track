describe("Person Suite", function() {

    it("Check Constructor", function(){
	    var mike = new Person('Mike', 25);
	    
	    expect(mike.name).toBe('Mike');
	    expect(mike.age).toBe(25);
    });
});

describe("Yet Another Suite", function() {
	beforeEach(function() {
		this.person = new Person("Oscar", 40);
	});
	
	it("Testing setup", function(){
		expect(this.person.name).toBe('Oscar');
	    expect(this.person.age).toBe(40);
	});
	it("Initialized values can change", function(){
		this.person.name = 'Mary';
		expect(this.person.name).toBe('Mary');
		expect(this.person.age).toBe(40);
	});
	
});
