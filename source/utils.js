function showEditor(visibility){
   /*
    * Controls the visibility of the add person button and add person form.
    */
   if (visibility == true){
       document.getElementById('show-add-person').style.visibility="hidden"; 
       document.getElementById('add-person-form').style.display="block";
   }
   else{
       document.getElementById('show-add-person').style.visibility="visible"; 
       document.getElementById('add-person-form').style.display="none";
   }
    
}

function addPerson(){
	/*
	 * Read the user input to create a new person in the network
	 */
    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var id = document.getElementById('id').value
    var all_skills = document.getElementById('skills').value
    var skill_tokens = all_skills.split(',')
    
    skills = [];
    for (i=0; i<skill_tokens.length; i++){
    	skills.push(skill_tokens[i].trim());
    }
    
    var person = new Person(name, email, id, skills);
    network.addPerson(person);
    showEditor(false);
    drawGraph()
    
}

function drawGraph(){
	/*
	 * Update the graph with the current person representation
	 */
	console.log('Updating graph');
	container = document.getElementById('mynetwork');
	graph = createGraph(network, container)
}