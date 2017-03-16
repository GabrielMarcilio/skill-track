
function setHighlightedNodes(skill_network, graph, highlighted_nodes){
	
	var all_nodes = graph.body.data.nodes
	var all_ids = all_nodes.getIds()
	var extended_selected = getExtendendSelectedNodes(skill_network, highlighted_nodes)
	
	var group, current_node; 
	
	for(var i=0; i<all_ids.length; i++){
		var node_id = all_ids[i];
		var selected = extended_selected.indexOf(node_id) >=0
		
		current_node = all_nodes.get(node_id);
		if(current_node.is_person){
			if(extended_selected.length == 0 || selected ){
				group = 'highlighted_person';
			}
			else{
				group = 'transparent_person';
			}
		}
		else{
			if(extended_selected.length == 0 || selected){
				group = 'highlighted_skill';
			}
			else{
				group = 'transparent_skill';
			}
		}
	    current_node.group = group;
	    all_nodes.update(current_node);
	}
}


function createNodes(skill_network){
	var node_data = [];
	
	// Creating the nodes associated with persons
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		
		node_data.push(
			{
				id:person_id,
				label: person.name,
				font:{color:'white'},
				is_person:true
			}
		);
	}
	
	//Creating the nodes associated with skills
	network_skills = skill_network.getInterests()
	for(var i=0; i<network_skills.length; i++){
		skill = network_skills[i];
		node_data.push(
			{
				id:skill,
				label: skill,
				font:{color:'white'},
				is_person:false
			}
		);
	}
	
	return new vis.DataSet(node_data);
}


function getExtendendSelectedNodes(skill_network, highlighted_nodes){
	var extended_selected_nodes = [];
	
	// Checking for selected persons. All their insterests become highlighted
	for(var i=0; i<highlighted_nodes.length; i++){
		var current_person_id = highlighted_nodes[i];
		var person = skill_network.getPersonByID(current_person_id);
		
		if(person !== undefined){
			extended_selected_nodes = extended_selected_nodes.concat(person.passions);
			extended_selected_nodes = extended_selected_nodes.concat(person.skills);
			extended_selected_nodes.push(current_person_id);
		}
	}
	
	// Checking if the selected node is an skill/pasion. IN that case all persons with that skill /
	//passion become highlighted
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		
		for(var i=0; i<highlighted_nodes.length; i++){
			var current_interest = highlighted_nodes[i];
			
			if(person.passions.indexOf(current_interest) >= 0){
				extended_selected_nodes.push(person_id);
				extended_selected_nodes.push(current_interest);
			}
			else if(person.skills.indexOf(current_interest) >= 0){
				extended_selected_nodes.push(person_id);
				extended_selected_nodes.push(current_interest);
			}
		}
	}
	
	return extended_selected_nodes

}
function getEdgeValue(person_id, skill_name, network){
	/**
	 * Get the value of the edge that connects the given person to the given skill.
	 * 
	 * @param{string} person_id - The id of the person to obtain the edge value.
	 * @param{string} skill_name - The name of the skill in the edge to obtain the value
	 * @param{SkillNetwork} network - Holds information about the person, skills and interactions.
	 * 
	 * @returns{int} The edge value, based on the number of registered interactions between the given
	 * person and skill. 
	 */
	interactions = network.getPersonInteractions(person_id, skill_name);
	return interactions.length + 1;
}


function createEdges(skill_network){
	edge_data = [];
	
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		
		var skills_conf = [person.skills, 'rgb(102,102,255)']
		var passions_conf = [person.passions, 'rgb(255,128,0)']
		var interest_and_config = [skills_conf, passions_conf];
		
		for(var j=0; j<interest_and_config.length; j++){
			var interests_and_conf = interest_and_config[j];
			var interests = interests_and_conf[0];
			var edge_color = interests_and_conf[1];
			
			for(var i=0; i<interests.length; i++){
				var interest = interests[i];
				var edge_value = getEdgeValue(person_id, interest, network);
				
				var edge_title = person.name + ' tem ' +(edge_value -1) + ' interações com ' + interest
				edge_data.push(
					{
						from: person_id, to: interest,	value:edge_value, color:edge_color, title:edge_title
					}
		
				)
			}
		}
	}
	
	return new vis.DataSet(edge_data);
	
}
function createGraph(skill_network, container, highlight){
	
	highlight = typeof highlight !== 'undefined' ? highlight : [];
	var edges = createEdges(skill_network);
	var nodes = createNodes(skill_network);
	
	var data = {
	    nodes: nodes,
	    edges: edges
	};
	var options = {
		layout: {
		    randomSeed: 1,
		    improvedLayout:true,
		 },
		 groups: {
			 highlighted_person: {
	             color: {background: 'rgba(0,0,0, 1)',border:'rgb(0,0,0)'},
	             shape: 'elipse',
	             size: 40
	         },
	         highlighted_skill: {
	        	 color: {background:'rgba(0,80, 0, 1)', border:'rgb(255,255,102)'},
	        	 shape: 'elipse',
	        	 size: 40
	         },
	         transparent_person: {
	        	 color: {background: 'rgba(0,0,0, 0.2)',border:'rgb(0,0,0)'},
	        	 shape: 'elipse',
	        	 size: 40
	         },
	         transparent_skill: {
	        	 color: {background:'rgba(0, 80, 0, 0.2)', border:'rgb(255,255,102)'},
	        	 shape: 'elipse',
	        	 size: 40
	         },
		 },
		 edges:{
			 width:2,
			 scaling:{
				 min:2, max:8
			 }
		 }
	}
	graph = new vis.Network(container, data, options);
	setHighlightedNodes(skill_network, graph, highlight)
	return graph;
}















