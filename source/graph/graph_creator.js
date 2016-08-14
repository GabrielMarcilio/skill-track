
function createNodes(skill_network){
	var node_data = [];
	
	// Creating the nodes associated with persons
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		node_data.push(
			{
				id:person.id,
				label: person.name,
				group: 'person',
				font:{color:'white'}
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
				group: 'skill'
			}
		);
	}
	
	return new vis.DataSet(node_data);
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
function createGraph(skill_network, container){
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
	         person: {
	             color: {background:'rgb(0,0,0)',border:'rgb(0,0,0)'},
	             shape: 'elipse',
	             size: 40
	         },
	         skill: {
	        	 color: {background:'rgb(255,255,102)', border:'rgb(255,255,102)'},
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
	return new vis.Network(container, data, options);
}















