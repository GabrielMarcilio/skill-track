
function createNodes(skill_network){
	var node_data = [];
	
	// Creating the nodes associated with persons
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		node_data.push(
			{
				id:person.id,
				label: person.name
			}
		);
	}
	
	//Creating the nodes associated with skills
	for(skill_id in skill_network.skills) {
		skill = skill_network.skills[skill_id];
		node_data.push(
			{
				id:skill.name,
				label: skill.name
			}
		);
	}
	return new vis.DataSet(node_data);
}

function createEdges(skill_network){
	edge_data = [];
	
	interactions = skill_network.interactions;
	for(var i=0; i<interactions.length; i++ ){
		interaction = interactions[i];
		
		edge_data.push(
			{
				from: interaction.person, to: interaction.skill_name
			}
				
		)
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
	  }
	}
	return new vis.Network(container, data, options);
}

