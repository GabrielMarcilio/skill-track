

describe("Testing Skill Network", function() {
    beforeEach(function() {
        // Creating Mushroom kingdon network to use in tests
    	this.network = new createTestNetwork();
    });
    
    
    it("Testing Create Nodes", function(){
    	
    	nodes = createNodes(this.network);
    	
    	expected_nodes =[];
    	expected_nodes['mario_id'] = 'Mario';
    	expected_nodes['luigi_id'] = 'Luigi';
    	expected_nodes['princess_peach_id'] = 'Peach';
    	expected_nodes['bowser_id'] = 'Bowser';
    	expected_nodes['toad_id'] = 'Toad';
    	expected_nodes['yoshi_id'] = 'Yoshi';
    	expected_nodes['koopa_id'] = 'Koopa';

    	expected_nodes['Jump'] = 'Jump';
    	expected_nodes['Shooting'] = 'Shooting';
    	expected_nodes['Charisma'] = 'Charisma';
    	
    	expected_nodes['Planning'] = 'Planning';
    	expected_nodes['Running'] = 'Running';
    	expected_nodes['Dino Ridding'] = 'Dino Ridding';
    	expected_nodes['March'] = 'March';
    	
    	expect(nodes.length).toBe(14);
   
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
    	expect(edges.length).toBe(9);
    	
    	mario_edges = [];
    	edge_ids = edges.getIds();
    	for (var i = 0; i < edge_ids.length; i++) {
    		var edge_id = edge_ids[i];
    		var edge = edges.get(edge_id);
    		if (edge.from == 'mario_id'){
    			mario_edges.push(edge.to);
    		}
    	}
    	
    	expect(mario_edges.length).toBe(3)
    	expect(mario_edges.indexOf('Jump')).not.toBe(-1);
    	expect(mario_edges.indexOf('Shooting')).not.toBe(-1);
    	expect(mario_edges.indexOf('March')).toBe(-1);
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
