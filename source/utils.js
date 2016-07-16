
function showAddPerson(visibility){
   /*
    * Controls the visibility of the add person button and add person form.
    */
   if (visibility == true){
       document.getElementById('show-add-person').style.visibility="hidden"; 
       document.getElementById('add-table-form').style.visibility="visible";
   }
   else{
       document.getElementById('show-add-person').style.visibility="visible"; 
       document.getElementById('add-table-form').style.visibility="hidden";
   }
    
}

function showEditPersonForm(visibility){
	if (visibility == true){
		document.getElementById('edit-table-form').style.display="block";
	}
	else{
		document.getElementById('edit-table-form').style.display="none";
	}
}
function showNodeToEdit(node_id, network){
	person = network.getPersonByID(node_id);
	console.log('Editing person: ' + person.name);
	showEditPersonForm(true);
	
	skills_text = person.skills.join(", ");
	document.getElementById("edit-name-id").value= person.name; 
	document.getElementById("edit-email-id").value= person.email; 
	document.getElementById("edit-id-id").value= person.id; 
	document.getElementById("edit-skills-id").value= skills_text; 
	
}

function confirmNodeEdit(network){
	var name = document.getElementById("edit-name-id").value;
    var email = document.getElementById("edit-email-id").value;
    var node_id = document.getElementById("edit-id-id").value;
    var all_skills = document.getElementById("edit-skills-id").value;
    
    new_skills =splitAndTrim(all_skills)
    console.log('New skills: ' + new_skills);
    person = network.getPersonByID(node_id);
    person.name = name;
    person.email=email;
    person.skills = new_skills;
    network.updatePerson(person);
    drawGraph()
    showEditPersonForm(false);
}

function splitAndTrim(single_text){
	var text_tokens = single_text.split(',')
	text_array = [];
	
    for (i=0; i<text_tokens.length; i++){
    	text_array.push(text_tokens[i].trim());
    }
    
    return text_array;
}

function addPerson(){
	/*
	 * Read the user input to create a new person in the network
	 */
    var name = document.getElementById("add-name-id").value
    var email = document.getElementById("add-email-id").value
    var id = document.getElementById("add-id-id").value
    var all_skills = document.getElementById("add-skills-id").value
    skills = splitAndTrim(all_skills)
    var person = new Person(name, email, id, skills);
    
    try{
    	network.addPerson(person);
    	drawGraph();
    	showAddPerson(false);
    }
	catch(err){
		window.alert(err);
    }
    	
    
}


function drawGraph(){
	/*
	 * Update the graph with the current person representation
	 */
	container = document.getElementById('mynetwork');
	graph = createGraph(network, container)
	
	graph.on("click", function (params) {
		  clicked_node = params['nodes']
		  
		  clicked_person = network.getPersonByID(clicked_node) !== undefined;
		  if (clicked_person){
			  showNodeToEdit(clicked_node, network);
		  }
		  else{
			  showEditPersonForm(false);
		  }
			  
	  });
}