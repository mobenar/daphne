/*global describe, before, beforeEach, after, it */

var expect = require('chai').expect;
var fs = require('fs');

var Graph = require('../index');

function getValues(objects, key) {

	return objects.map(function (object) {

		return object[key];
	});
}

describe('graph', function () {

	var graph = null;
	var json = null;

	before(function () {

		json = JSON.parse(fs.readFileSync('test/graph.json', 'utf8'));
	});

	beforeEach(function () {

		graph = new Graph(json);
	});

	after(function () {

		graph = null;
		json = null;
	});

	it('should find root nodes', function () {

		var rootNodes = graph.getRootNodes();

		expect(rootNodes.length).to.equal(1);
		expect(rootNodes[0].id).to.equal(1);
	});

	it('should find terminal nodes', function () {

		var nodeIds = getValues(graph.getTerminalNodes(), 'id');

		expect(nodeIds).to.have.members([4, 5, 6, 7]);
	});

	it('should remove a node and its edges', function () {

		graph.removeNode(graph.getNodeById(2));

		var nodeIds = getValues(graph.getNodes(), 'id');
		var edgeLabels = getValues(graph.getEdges(), 'label');

		expect(nodeIds).to.have.members([1, 3, 4, 5, 6, 7]);
		expect(edgeLabels).to.have.members(['A->C', 'C->F', 'C->G']);
	});

	it('should be converted to valid JSON', function () {

		expect(graph.toJSON()).to.deep.equal(json);
	});

});
