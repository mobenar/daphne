exports.parse = function (Graph, string, options) {

    var data = JSON.parse(string);
    var graph = new Graph(data.directed, data.label);
    var nodes = data.nodes || [];
    var edges = data.edges || [];

    nodes.forEach(function (node) {

        graph.addNode(new Graph.Node(node.id, node.label));
    });

    edges.forEach(function (edge) {

        var sourceNode = graph.getNodeById(edge.source);
        var targetNode = graph.getNodeById(edge.target);

        graph.addEdge(new Graph.Edge(sourceNode, targetNode, edge.label));
    });

    return graph;
};

exports.stringify = function (graph, options) {

    options = options || {};

    return JSON.stringify(graph, null, options.indent || '  ');
};
