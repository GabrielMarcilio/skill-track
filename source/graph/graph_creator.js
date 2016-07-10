
function createNodes(skill_network){
	var node_data = [];
	
	// Creating the nodes associated with persons
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		node_data.push(
			{
				id:person.id,
				label: person.name,
				group: 'person'
			}
		);
	}
	
	//Creating the nodes associated with skills
	for(skill_id in skill_network.skills) {
		skill = skill_network.skills[skill_id];
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

function createEdges(skill_network){
	edge_data = [];
	
	for(person_id in skill_network.persons) {
		person = skill_network.persons[person_id];
		
		for(var i=0; i<person.skills.length; i++){
			skill = person.skills[i];
			edge_data.push(
				{
					from: person_id, to: skill
				}
						
			)
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
	             color: {background:'rgb(102,255,102)',border:'rgb(102,255,102)'},
	             shape: 'elipse',
	             size: 40
	         },
	         skill: {
	        	 color: {background:'rgb(255,255,102)', border:'rgb(255,255,102)'},
	        	 shape: 'big diamond',
	        	 size: 40
	         },
		 },
		 edges:{
			 width:2,
		 }
	}
	return new vis.Network(container, data, options);
}















