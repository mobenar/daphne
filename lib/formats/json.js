function parseError(err) {

    return new SyntaxError('JSON parse error: ' + err.message);
}

exports.parse = function (Graph, string, options) {

    var data;

    try {
        data = JSON.parse(string);
    }
    catch (err) {
        throw parseError(err);
    }

    return new Graph(data.directed, data.label, data.nodes, data.edges);
};

exports.stringify = function (graph, options) {

    return JSON.stringify(graph, null, options.indent || '  ');
};
