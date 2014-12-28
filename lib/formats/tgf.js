exports.parse = function (Graph, string, options) {

    var graph = new Graph(true);
    var parts = string.split('\n#\n');

    parts[0].split('\n').forEach(function (line) {

        var matches = line.match(/^(\d+) (.+)$/);

        graph.addNode(new Graph.Node(matches[1], matches[2]));
    });

    parts[1].split('\n').forEach(function (line) {

        var matches = line.match(/^(\d+) (\d+)$/);
        var sourceNode = graph.getNodeById(matches[1]);
        var targetNode = graph.getNodeById(matches[2]);

        graph.addEdge(new Graph.Edge(sourceNode, targetNode));
    });

    return graph;
};

exports.stringify = function (graph, options) {

    var lines = [];

    graph.forEachNode(function (node) {

        lines.push('' + node.id + ' ' + node.label);
    });

    lines.push('#');

    graph.forEachEdge(function (edge) {

        lines.push('' + edge.sourceNode.id + ' ' + edge.targetNode.id);
    });

    return lines.join('\n');
};
