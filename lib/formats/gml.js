/*
Options (yEd)

graphAttributes:
    hierarchic: {0|1}

nodeAttributes:
    graphics [
        x {number}
        y {number}
        w {number}
        h {number}
        type {string}
        fill "#RRGGBB"
        outline	"#RRGGBB"
    ]
    LabelGraphics [
        text {string}
        color "#RRGGBB"
        fontSize {number}
        fontStyle {string}
        fontName {string}
        underlineText {0|1}
        visible {0|1}
    ]

edgeAttributes:
    graphics [
        style {string}
        fill "#RRGGBB"
        targetArrow	{string}
    ]
    LabelGraphics [
        text {string}
        fontSize {number}
        fontName {string}
    ]
*/

var toString = Object.prototype.toString;

function parseError(lineNumber, line) {

    var message = 'GML parse error';

    if (lineNumber) {
        message += ', line ' + lineNumber;
    }

    if (line) {
        message += ': ' + line;
    }

    return new SyntaxError(message);
}

exports.parse = function (Graph, string, options) {

    // TODO: Parse GML
    throw Error('GML parse not implemented yet');
};

exports.stringify = function (graph, options) {

    var indent1 = (typeof options.indent === 'string' ? options.indent : '  ');
    var indent2 = indent1 + indent1;
    var getGraphAttributes = options.graphAttributes || null;
    var getNodeAttributes = options.nodeAttributes || null;
    var getEdgeAttributes = options.edgeAttributes || null;

    var lines = ['graph ['];

    function attribute(key, value) {

        return (key + ' ' + JSON.stringify(value));
    }

    function addAttributes(attributes, indent) {

        if (!attributes) {
            return;
        }

        Object.keys(attributes).forEach(function (key) {

            var value = attributes[key];

            if (value && toString.call(value) === '[object Object]') {
                lines.push(indent + key + ' [');
                addAttributes(value, indent + indent1);
                lines.push(indent + ']');
            }
            else {
                lines.push(indent + attribute(key, value));
            }
        });
    }

    addAttributes({
        directed: graph.directed ? 1 : 0,
        label: graph.label
    }, indent1);

    if (getGraphAttributes) {
        addAttributes(getGraphAttributes(graph), indent1);
    }

    graph.forEachNode(function (node) {

        lines.push(indent1 + 'node [');

        addAttributes({
            id: node.id,
            label: node.label
        }, indent2);

        if (getNodeAttributes) {
            addAttributes(getNodeAttributes(node), indent2);
        }

        lines.push(indent1 + ']');
    });

    graph.forEachEdge(function (edge) {

        lines.push(indent1 + 'edge [');

        addAttributes({
            source: edge.sourceNode.id,
            target: edge.targetNode.id,
            label: edge.label
        }, indent2);

        if (getEdgeAttributes) {
            addAttributes(getEdgeAttributes(edge), indent2);
        }

        lines.push(indent1 + ']');
    });

    lines.push(']');

    return lines.join('\n');
};
