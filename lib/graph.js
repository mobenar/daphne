var Node = require('./node');
var Edge = require('./edge');

var toString = Object.prototype.toString;

function Graph(directed, label, nodes, edges) {

    var self = this;

    this.directed = !!directed;
    this.label = label || '';
    this.nodes = [];
    this.edges = [];
    this.nodesDirty = false;
    this.edgesDirty = false;

    if (nodes) {
        nodes.forEach(function (node) {

            self.addNode(new Graph.Node(node.id, node.label));
        });
    }

    if (edges) {
        edges.forEach(function (edge) {

            var sourceNode = self.getNodeById(edge.source);
            var targetNode = self.getNodeById(edge.target);

            self.addEdge(new Graph.Edge(sourceNode, targetNode, edge.label));
        });
    }
}

Graph.prototype.clear = function () {

    this.forEachEdge(this.removeEdge, this);

    this.edges = [];
    this.edgesDirty = false;

    this.forEachNode(this.removeNode, this);

    this.nodes = [];
    this.nodesDirty = false;
};

Graph.prototype.addNode = function (node) {

    if (node.graph !== this) {
        if (node.graph) {
            throw Error('Node belongs to another graph');
        }

        node.graph = this;
        this.nodes.push(node);
    }

    return this;
};

Graph.prototype.removeNode = function (node) {

    var self = this;

    this.forEachEdge(function (edge) {

        if (edge.isConnectedTo(node)) {
            self.removeEdge(edge);
        }
    });

    node.clear();

    this.nodesDirty = true;

    return this;
};

Graph.prototype.hasNode = function (node) {

    return (node.graph === this);
};

Graph.prototype.getNodeBy = function (key, value) {

    var nodes = this.nodes;
    var node;

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];

        if (node.graph === this && node[key] === value) {
            return node;
        }
    }

    return null;
};

Graph.prototype.getNodeById = function (id) {

    return this.getNodeBy('id', id);
};

Graph.prototype.getNodeByLabel = function (label) {

    return this.getNodeBy('label', label);
};

Graph.prototype.getNodes = function () {

    return this.filterNodes();
};

Graph.prototype.forEachNode = function (callback) {

    var self = this;

    this.nodes.forEach(function (node) {

        if (node.graph === self) {
            callback(node);
        }
    });
};

Graph.prototype.filterNodes = function (filter) {

    var self = this;

    return this.nodes.filter(function (node) {

        return (node.graph === self && (!filter || filter(node)));
    });
};

Graph.prototype.sortNodes = function (compare) {

    var self = this;

    this.nodes.sort(function (node1, node2) {

        if (node1.graph !== self) {
            return -1;
        }

        if (node2.graph !== self) {
            return 1;
        }

        return compare(node1, node2);
    });

    return this;
};

Graph.prototype.getRootNodes = function () {

    return this.filterNodes(function (node) {

        return node.isRoot();
    });
};

Graph.prototype.getTerminalNodes = function () {

    return this.filterNodes(function (node) {

        return node.isTerminal();
    });
};

Graph.prototype.getSourceNodes = function (node) {

    return this.getEdgesByTarget(node).map(function (edge) {

        return edge.sourceNode;
    });
};

Graph.prototype.getTargetNodes = function (node) {

    return this.getEdgesBySource(node).map(function (edge) {

        return edge.targetNode;
    });
};

Graph.prototype.getEdgesBySource = function (node) {

    if (node.isTerminal()) {
        return [];
    }

    return this.filterEdges(function (edge) {

        return (edge.sourceNode === node);
    });
};

Graph.prototype.getEdgesByTarget = function (node) {

    if (node.isRoot()) {
        return [];
    }

    return this.filterEdges(function (edge) {

        return (edge.targetNode === node);
    });
};

Graph.prototype.addEdge = function (edge) {

    var sourceNode;
    var targetNode;

    if (edge.graph !== this) {
        if (edge.graph) {
            throw Error('Edge belongs to another graph');
        }

        sourceNode = edge.sourceNode;
        targetNode = edge.targetNode;

        if (!sourceNode || sourceNode.graph !== this) {
            throw Error('Edge source not in graph');
        }

        if (!targetNode || targetNode.graph !== this) {
            throw Error('Edge target not in graph');
        }

        if (sourceNode === targetNode) {
            throw Error('Edge has same source and target');
        }

        sourceNode.targetLength++;
        targetNode.sourceLength++;

        edge.graph = this;
        this.edges.push(edge);
    }

    return this;
};

Graph.prototype.removeEdge = function (edge) {

    edge.sourceNode.targetLength--;
    edge.targetNode.sourceLength--;

    edge.clear();

    this.edgesDirty = true;

    return this;
};

Graph.prototype.hasEdge = function (edge) {

    return (edge.graph === this);
};

Graph.prototype.getEdgeBy = function (key, value) {

    var edges = this.edges;
    var edge;

    for (var i = 0; i < edges.length; i++) {
        edge = edges[i];

        if (edge.graph === this && edge[key] === value) {
            return edge;
        }
    }

    return null;
};

Graph.prototype.getEdgeByLabel = function (label) {

    return this.getEdgeBy('label', label);
};

Graph.prototype.getEdges = function () {

    return this.filterEdges();
};

Graph.prototype.forEachEdge = function (callback) {

    var self = this;

    this.edges.forEach(function (edge) {

        if (edge.graph === self) {
            callback(edge);
        }
    });
};

Graph.prototype.filterEdges = function (filter) {

    var self = this;

    return this.edges.filter(function (edge) {

        return (edge.graph === self && (!filter || filter(edge)));
    });
};

Graph.prototype.sortEdges = function (compare) {

    var self = this;

    this.edges.sort(function (edge1, edge2) {

        if (edge1.graph !== self) {
            return -1;
        }

        if (edge2.graph !== self) {
            return 1;
        }

        return compare(edge1, edge2);
    });

    return this;
};

Graph.prototype.getCyclicEdges = function () {

    // TODO: Find cyclic edges
    return [];
};

/*
Graph.prototype.isCyclicEdge = function (edge) {

    if (edge.graph !== this) {
        return false;
    }

    var cyclic = false;

    this.traverse(edge.targetNode, function (error) {

        if (error && error.cyclic) {
            cyclic = true;
            return true;
        }

        return false;
    });

    return cyclic;
};
*/

Graph.prototype.sort = function () {

    function compare(num1, num2) {

        if (num1 < num2) {
            return 1;
        }

        if (num1 > num2) {
            return -1;
        }

        return 0;
    }

    this.sortNodes(function (node1, node2) {

        return compare(node1.sourceLength, node2.sourceLength);
    });

    this.sortEdges(function (edge1, edge2) {

        return compare(edge1.sourceNode.sourceLength, edge2.sourceNode.sourceLength);
    });

    return this;
};

Graph.prototype.traverse = function (startNode, callback) {

    var self = this;

    function traverse(sourceNode, sourceEdge) {

        if (!sourceNode || callback(null, sourceNode, sourceEdge)) {
            return;
        }

        var edges = self.getEdgesBySource(sourceNode);
        var edge;

        for (var i = 0; i < edges.length; i++) {
            edge = edges[i];

            if (edge.targetNode === startNode) {
                // Cyclic
                if (callback({ cyclic: true }, edge.targetNode, edge)) {
                    return;
                }
            }
            else {
                traverse(edge.targetNode, edge);
            }
        }
    }

    traverse(startNode, null);

    return this;
};

Graph.prototype.clean = function () {

    if (this.nodesDirty) {
        this.nodes = this.filterNodes();
        this.nodesDirty = false;
    }

    if (this.edgesDirty) {
        this.edges = this.filterEdges();
        this.edgesDirty = false;
    }

    return this;
};

Graph.prototype.toString = function (format, options) {

    if (!format) {
        return this.label;
    }

    if (typeof format === 'string') {
        format = require('./formats/' + format.toLowerCase());
    }

    return format.stringify(this, options || null);
};

Graph.parse = function (format, string, options) {

    if (!format) {
        return null;
    }

    if (typeof format === 'string') {
        format = require('./formats/' + format.toLowerCase());
    }

    return format.parse(Graph, string, options || null);
};

Graph.Node = Node;
Graph.Edge = Edge;

module.exports = Graph;
