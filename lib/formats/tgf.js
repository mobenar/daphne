exports.parse = function (Graph, string, options) {

    var data = {}; //parse(string);

    return new Graph(data.directed, data.label, data.nodes, data.edges);
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
