

describe("Testing Skill Network", function() {
    beforeEach(function() {
        // Creating Mushroom kingdon network to use in tests
    	this.network = new createTestNetwork();
    });
    
    
    it("Testing Create Nodes", function(){
    	
    	var nodes = createNodes(this.network, []);
    	
    	var all_interests = this.network.getInterests()
    	
    	var expected_nodes =[];
    	for(var i=0; i<all_interests.length; i++){
    		interest = all_interests[i];
    		expected_nodes[interest]=interest
    	}
    	
    	// Adding persons to the expected nodes
    	persons = this.network.persons
    	for(person_id in this.network.persons) {
    		person = this.network.persons[person_id]
    		person_name = person.name
    		expected_nodes[person_id] = person_name;
    	}
    	
    	expect(nodes.length).toBe(24);
   
    	node_ids = nodes.getIds()
    	var nodes_length = node_ids.length;
    	for (var i = 0; i < nodes_length; i++) {
    		node_id = node_ids[i];
    		node = nodes.get(node_id);
    		
    		expected_caption = expected_nodes[node_id];
    		expect(node.label).toBe(expected_caption);
    	}
    });
    
    it("Testing Create Edges", function(){
    	
    	edges = createEdges(this.network);
    	expect(edges.length).toBe(21);
    	
    	mario_edges = [];
    	edge_ids = edges.getIds();
    	for (var i = 0; i < edge_ids.length; i++) {
    		var edge_id = edge_ids[i];
    		var edge = edges.get(edge_id);
    		if (edge.from == 'mario_id'){
    			mario_edges.push(edge.to);
    		}
    	}
    	
    	expect(mario_edges.length).toBe(5) // 3 Skills and 2 passions
    	
    	//Testing Skills
    	expect(mario_edges.indexOf('Jump')).not.toBe(-1);
    	expect(mario_edges.indexOf('Shooting')).not.toBe(-1);
    	expect(mario_edges.indexOf('March')).toBe(-1);

    	// Testing Passions
    	expect(mario_edges.indexOf('Gardening')).not.toBe(-1);
    	expect(mario_edges.indexOf('Italian Food')).not.toBe(-1);
    });
    
    it("Testing edge values", function(){
    	
    	edges = createEdges(this.network);
    	edge_values = []
    	edge_values['Jump']=0;
    	edge_values['Shooting']=0;
    	edge_values['Dino Ridding']=0;
    	
    	edge_ids = edges.getIds();
    	for (var i = 0; i < edge_ids.length; i++) {
    		var edge_id = edge_ids[i];
    		var edge = edges.get(edge_id);
    		
    		if (edge.from == 'mario_id'){
    			edge_values[edge.to] = edge.value
    		}
    	}
    	
    	expect(edge_values['Jump']).toBe(2);
    	expect(edge_values['Dino Ridding']).toBe(2);
    	expect(edge_values['Shooting']).toBe(3);
    	
    	
    });
});
