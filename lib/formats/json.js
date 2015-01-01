function errorMessage(err) {

    return ('JSON parse error: ' + err.message);
}

exports.parse = function (Graph, string, options) {

    var data;

    try {
        data = JSON.parse(string);
    }
    catch (err) {
        throw new SyntaxError(errorMessage(err));
    }

    return new Graph(data.directed, data.label, data.nodes, data.edges);
};

exports.stringify = function (graph, options) {

    return JSON.stringify(graph, null, options.indent || '  ');
};
