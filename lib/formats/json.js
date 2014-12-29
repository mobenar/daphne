exports.parse = function (Graph, string, options) {

    var data = JSON.parse(string);

    return new Graph(data.directed, data.label, data.nodes, data.edges);
};

exports.stringify = function (graph, options) {

    return JSON.stringify(graph, null, options.indent || '  ');
};
