var expect = require('chai').expect;

var Graph = require('../index');

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

        var nodeIds = getValues(graph.getNodes(), 'id');
        var edgeLabels = getValues(graph.getOutgoingEdges(rootNode), 'label');

        expect(nodeIds).to.have.members([1, 3]);
        expect(edgeLabels).to.have.members(['1->3']);
    });
});
