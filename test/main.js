var fs = require('fs');
var expect = require('chai').expect;

var Graph = require('../index');

var fixtures = {
    nodeIds: [1, 2, 3, 4, 5, 6, 7],
    edgeLabels: ['A->B', 'A->C', 'B->D', 'B->E', 'C->F', 'C->G']
};

function readFile(filePath) {

    return fs.readFileSync('test/fixtures/' + filePath, { encoding: 'utf8' });
}

function createGraph(nodeLength, edges) {

    var graph = new Graph(true, 'test');

    for (var i = 1; i <= nodeLength; i++) {
        graph.addNode(new Graph.Node(i, '' + i));
    }

    edges.forEach(function (edge) {

        var sourceNode = graph.getNodeById(edge[0]);
        var targetNode = graph.getNodeById(edge[1]);
        var label = sourceNode.label + '->' + targetNode.label;

        graph.addEdge(new Graph.Edge(sourceNode, targetNode, label));
    });

    return graph;
}

function getValues(objects, key) {

    return objects.map(function (object) {

        return object[key];
    });
}

function getNodeIds(graph) {

    return getValues(graph.getNodes(), 'id');
}

function getEdgeLabels(graph) {

    return getValues(graph.getEdges(), 'label');
}

describe('graph', function () {

    it('should find root nodes', function () {

        var graph = createGraph(3, [[1, 2], [1, 3]]);
        var rootNodes = graph.getRootNodes();

        expect(rootNodes.length).to.equal(1);
        expect(rootNodes[0].id).to.equal(1);
    });

    it('should find terminal nodes', function () {

        var graph = createGraph(3, [[1, 2], [1, 3]]);
        var terminalNodes = graph.getTerminalNodes();
        var nodeIds = getValues(terminalNodes, 'id');

        expect(nodeIds).to.have.members([2, 3]);
    });

    it('should remove a node and its edges', function () {

        var graph = createGraph(3, [[1, 2], [1, 3]]);
        var rootNode = graph.getNodeById(1);

        graph.removeNode(graph.getNodeById(2));

        var nodeIds = getNodeIds(graph);
        var edgeLabels = getValues(graph.getOutgoingEdges(rootNode), 'label');

        expect(nodeIds).to.have.members([1, 3]);
        expect(edgeLabels).to.have.members(['1->3']);
    });

    it('should parse JSON format', function () {

        var graph = Graph.parse('json', readFile('graph.json'));
        var nodeIds = getNodeIds(graph);
        var edgeLabels = getEdgeLabels(graph);

        expect(nodeIds).to.have.members(fixtures.nodeIds);
        expect(edgeLabels).to.have.members(fixtures.edgeLabels);
    });

    it('should parse TGF format', function () {

        var graph = Graph.parse('tgf', readFile('graph.tgf'));
        var nodeIds = getNodeIds(graph);
        var edges = graph.getEdges();

        expect(nodeIds).to.have.members(fixtures.nodeIds);
        expect(edges.length).to.equal(fixtures.edgeLabels.length);
    });

    it.skip('should parse GML format', function () {

        var graph = Graph.parse('gml', readFile('graph.gml'));
        var nodeIds = getNodeIds(graph);
        var edgeLabels = getEdgeLabels(graph);

        expect(nodeIds).to.have.members(fixtures.nodeIds);
        expect(edgeLabels).to.have.members(fixtures.edgeLabels);
    });
});
