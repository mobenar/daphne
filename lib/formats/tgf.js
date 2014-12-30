function badFormat() {

    return Error('Bad format');
}

exports.parse = function (Graph, string, options) {

    var graph = new Graph();
    var parts = string.split('\n#\n');

    if (parts.length !== 2) {
        throw badFormat();
    }

    parts[0].split('\n').forEach(function (line) {

        var matches = line.match(/^(\d+) (.+)$/);

        if (!matches) {
            throw badFormat();
        }

        var id = parseInt(matches[1], 10);
        var label = matches[2];

        graph.addNode(new Graph.Node(id, label));
    });

    parts[1].split('\n').forEach(function (line) {

        var matches = line.match(/^(\d+) (\d+)$/);

        if (!matches) {
            throw badFormat();
        }

        var sourceId = parseInt(matches[1], 10);
        var targetId = parseInt(matches[2], 10);
        var sourceNode = graph.getNodeById(sourceId);
        var targetNode = graph.getNodeById(targetId);

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
