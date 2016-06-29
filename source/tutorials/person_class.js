


function Person(name, age){
	
	return {
		name:name,
		age:age,
		greetings:function(){
			return 'Hello ' + this.name;
		}
		
	};
}

var p = new Person('Jonh', 32);
console.log( p.greetings());
