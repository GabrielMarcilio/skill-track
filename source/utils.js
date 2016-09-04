function setEditPersonEnabled(enabled){
	document.getElementById("edit-name-id").disabled= !enabled; 
	document.getElementById("edit-email-id").disabled= !enabled; 
	document.getElementById("edit-skills-id").disabled= !enabled; 
	document.getElementById("edit-passions-id").disabled= !enabled; 

    if(enabled){
    	document.getElementById("confirm-person-changes-id").style.visibility="visible";
    }
    else{
    	document.getElementById("confirm-person-changes-id").style.visibility="hidden";
    }
}

function setFormVisible(form_id, visible){
	if(visible){
		document.getElementById(form_id).style.display='block'
	}
	else{
		document.getElementById(form_id).style.display='none'
	}
}


function showEditPersonForm(visibility){
	console.log('Calling show edit person form ' + visibility)
	setFormVisible('edit_person', visibility)
}


function showAddInteraction(visibility){
	/**
	 * Change the visibility of the editor to add interactions 
	 */
	setFormVisible('edit_interaction', visibility)
}


function showInteractionToAdd(person_id, skill){
	/**
	 * Set the values in the fields to add an interaction and make the create interaction editor 
	 * visible
	 */
	var person = network.getPersonByID(person_id);
	var today = new Date()
	
    // Adding current timezone
	today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
	
	document.getElementById("add-inter-person-id").value= person.name; 
	document.getElementById("add-inter-skill-id").value= skill; 
	document.getElementById("add-inter-date-id").value= today.toJSON().substring(0, 10); 
	document.getElementById("add-inter-description-id").value= ""; 
	
	showAddInteraction(true);
}

function confirmAddInteraction(){
	var selected_edges = graph.getSelectedEdges();
	var connected_nodes = graph.getConnectedNodes(selected_edges[0]);
	var person_id = connected_nodes[0];
	var skill = connected_nodes[1];
	
	var date_string = document.getElementById("add-inter-date-id").value;
	var date = new Date(date_string);
	date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    var description = document.getElementById("add-inter-description-id").value;
    var reporter = current_user_id
    console.log('Adding interaction for ' + current_user_id)
    
    var interaction = new Interaction(person_id, skill, date, description, reporter);
    showAddInteraction(false);
    addInteractionInDatabase(interaction, network);
    
    drawGraph();
}


function showNodeToEdit(node_id, network){
	person = network.getPersonByID(node_id);
	showEditPersonForm(true);
	
	var edit_enabled = person.id == current_user_id;
	setEditPersonEnabled(edit_enabled)
	
	var skills_text = person.skills.join(", ");
	var passions_text = person.passions.join(", ");
	document.getElementById("edit-name-id").value= person.name; 
	document.getElementById("edit-email-id").value= person.email; 
	document.getElementById("edit-skills-id").value= skills_text; 
	document.getElementById("edit-passions-id").value= passions_text; 
	
	console.log('Editing current user: ' + person.id + ' ' + current_user_id + ' ' + (person.id == current_user_id));
	
}

function confirmNodeEdit(network){
	var name = document.getElementById("edit-name-id").value;
    var email = document.getElementById("edit-email-id").value;
    var all_skills = document.getElementById("edit-skills-id").value;
    var all_passions = document.getElementById("edit-passions-id").value;
    
    var node_id = graph.getSelectedNodes();
    var new_skills =splitAndTrim(all_skills)
    var new_passions =splitAndTrim(all_passions)
    var person = network.getPersonByID(node_id);
    person.name = name;
    person.email=email;
    person.skills = new_skills;
    person.passions = new_passions
    showEditPersonForm(false);
    updatePersonInDatabase(person, network);
}



function addPerson(){
	/*
	 * Read the user input to create a new person in the network
	 */
    var name = document.getElementById("add-name-id").value
    var email = document.getElementById("add-email-id").value
    var id = document.getElementById("add-id-id").value
    var all_skills = document.getElementById("add-skills-id").value
    var all_passions = document.getElementById("add-passions-id").value
    
    var skills = splitAndTrim(all_skills)
    var passions = splitAndTrim(all_passions)
    
    var person = new Person(name, email, id, skills, passions);
    
    var passions = splitAndTrim(all_passions)
    try{
    	network.addPerson(person);
    	drawGraph();
    	showAddPerson(false);
    	addPersonInDatabase(person)
    }
	catch(err){
		window.alert(err);
    }
    	
}


function handleNodeSeletion(clicked_node){
	var clicked_person = network.getPersonByID(clicked_node) !== undefined;
	if(clicked_person){
		showNodeToEdit(clicked_node, network);
	}
	else{
		showEditPersonForm(false);
	}
	showAddInteraction(false);
}

function handleEdgeSelection(selected_edge){
	var connected_nodes = graph.getConnectedNodes(clicked_edge)
	if (connected_nodes.length ==2){
	    var person_id = connected_nodes[0];
	    var skill = connected_nodes[1];
		showInteractionToAdd(person_id, skill)
	}
	else {
	    showAddInteraction(false)
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
		  clicked_edge = params['edges']
		  
		  if (clicked_node.length > 0){
			  handleNodeSeletion(clicked_node)
		  }
		  else if(clicked_edge.length > 0){
			  handleEdgeSelection(clicked_edge);
		  }
		  else{
			  showEditPersonForm(false);
			  showAddInteraction(false);
		  }
			  
	  });
}


function updatePersonInDatabase(person, network){
	var person_memento = person.createMemento();
	 $.post(
		"/updatePerson",
		{'person':person_memento},
	    function(data, status){
			console.log('Update person result: ' + data + status)
			loadNetwork(network)
    });
}
function addPersonInDatabase(person){
	/**
	 * Send a request to the server to store the person created in the database
	 */
	var person_memento = person.createMemento();
    $.post(
		"/storePerson",
		{'person':person_memento},
	    function(data, status){
//	        alert("Store person result: " + data + "\nStatus: " + status);
    });
    	
}

function addInteractionInDatabase(interaction){
	$.post(
		"/storeInteraction",
		{'interaction':interaction},
	    function(data, status){
			console.log('Interaction store result: ' + data + status)
			loadNetwork(network)
    });
}

function loadNetwork(network){
	/**
	 * Populates the given etwork with information from the database
	 */
	$.get("/loadPersons", function(data, status){
		network.clear();
    	for(var i=0; i< data.length; i++){
    		var person_memento = data[i];
    		var person = new Person();
    		person.setMemento(person_memento);
    		network.addPerson(person);
    	}
    	
    	// The persons are loaded, time to load the interactions
    	$.get("/loadInteractions", function(data, status){
    		for(var i=0; i< data.length; i++){
        		var interaction_data = data[i];
        		var interaction = new Interaction(
        			interaction_data.person_id, 
        			interaction_data.skill_name,
        			interaction_data.date, 
        			interaction_data.description, 
        			interaction_data.reporter
    			)
        		network.addInteraction(interaction);
    		}
    		drawGraph();
    	});
    	
    }); 
}