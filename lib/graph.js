/** type {Node} */
var Node = require('./node');

/** type {Edge} */
var Edge = require('./edge');

/**
 * Graph constructor.
 *
 * @public
 * @constructor
 * @param {Boolean|Object} [directed=true]
 * @param {String} [label='']
 * @param {Object[]} [nodes=null]
 * @param {Object[]} [edges=null]
 */
function Graph(directed, label, nodes, edges) {

	var self = this;
	var options;

	if (directed && typeof directed === 'object') {
		options = directed;
		directed = options.directed;
		label = options.label;
		nodes = options.nodes;
		edges = options.edges;
	}

	/** @member {Boolean} */
	this.directed = (arguments.length ? !!directed : true);

	/** @member {String} */
	this.label = label || '';

	/** @member {Node[]} */
	this.nodes = [];

	/** @member {Edge[]} */
	this.edges = [];

	/** @member {Number} */
	this.nodesRemoved = 0;

	/** @member {Number} */
	this.edgesRemoved = 0;

	if (nodes) {
		nodes.forEach(function (node) {

			self.addNode(node.id, node.label);
		});
	}

	if (edges) {
		edges.forEach(function (edge) {

			self.addEdge(edge.source, edge.target, edge.label);
		});
	}
}

/**
 * Removes all nodes and edges.
 *
 * @returns {Graph}
 */
Graph.prototype.clear = function () {

	this.forEachEdge(this.removeEdge, this);

	this.edges = [];
	this.edgesRemoved = 0;

	this.forEachNode(this.removeNode, this);

	this.nodes = [];
	this.nodesRemoved = 0;

	return this;
};

/**
 * Adds a node to the graph.
 *
 * @param {Number|Node} id
 * @param {String} [label='']
 * @returns {Graph}
 * @throws {Error}
 */
Graph.prototype.addNode = function (id, label) {

	var node = (id instanceof Node ? id : new Node(id, label));

	if (node.graph !== this) {
		if (node.graph) {
			throw Error('Node belongs to another graph');
		}

		node.graph = this;
		this.nodes.push(node);
	}

	return this;
};

/**
 * Removes a node from the graph.
 *
 * @param {Node} node
 * @returns {Graph}
 */
Graph.prototype.removeNode = function (node) {

	var self = this;

	this.forEachEdge(function (edge) {

		if (edge.isConnectedTo(node)) {
			self.removeEdge(edge);
		}
	});

	node.clear();

	this.nodesRemoved++;

	return this;
};

/**
 * Returns true if node is added to the graph.
 *
 * @param {Node} node
 * @returns {Boolean}
 */
Graph.prototype.hasNode = function (node) {

	return (node.graph === this);
};

/**
 * Returns a node by key and value, or null if not found.
 *
 * @param {String} key
 * @param {*} value
 * @returns {Node|null}
 */
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

/**
 * Returns a node by id, or null if not found.
 *
 * @param {String} id
 * @returns {Node|null}
 */
Graph.prototype.getNodeById = function (id) {

	return this.getNodeBy('id', id);
};

/**
 * Returns a node by label, or null if not found.
 *
 * @param {String} label
 * @returns {Node|null}
 */
Graph.prototype.getNodeByLabel = function (label) {

	return this.getNodeBy('label', label);
};

/**
 * Returns all nodes (added but not removed).
 *
 * @returns {Node[]}
 */
Graph.prototype.getNodes = function () {

	return this.filterNodes();
};

/**
 * Invokes callback for each node (added but not removed).
 *
 * @param {Function} callback - callback(node): undefined
 * @param {Object} [context=null]
 * @returns {Graph}
 */
Graph.prototype.forEachNode = function (callback, context) {

	var self = this;

	this.nodes.forEach(function (node) {

		if (node.graph === self) {
			callback.call(context || null, node);
		}
	});

	return this;
};

/**
 * Returns all nodes that passes the filter function.
 *
 * @param {Function} [filter=null] - filter(Node): Boolean
 * @returns {Node[]}
 */
Graph.prototype.filterNodes = function (filter) {

	var self = this;

	return this.nodes.filter(function (node) {

		return (node.graph === self && (!filter || filter(node)));
	});
};

/**
 * Sorts nodes according to the compare function.
 *
 * @param {Function} [compare] - compare(Node, Node): Number
 * @returns {Graph}
 */
Graph.prototype.sortNodes = function (compare) {

	var self = this;

	compare = compare || compareNodes;

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

/**
 * Returns all root nodes (without incoming edges).
 *
 * @returns {Node[]}
 */
Graph.prototype.getRootNodes = function () {

	return this.filterNodes(function (node) {

		return node.isRoot();
	});
};

/**
 * Returns all terminal nodes (without outgoing edges).
 *
 * @returns {Node[]}
 */
Graph.prototype.getTerminalNodes = function () {

	return this.filterNodes(function (node) {

		return node.isTerminal();
	});
};

/**
 * Returns all nodes with edges that targets the specified node.
 *
 * @param {Node} node
 * @returns {Node[]}
 */
Graph.prototype.getSourceNodes = function (node) {

	return this.getIncomingEdges(node).map(function (edge) {

		return edge.sourceNode;
	});
};

/**
 * Returns all nodes that are targeted by edges from the specified node.
 *
 * @param {Node} node
 * @returns {Node[]}
 */
Graph.prototype.getTargetNodes = function (node) {

	return this.getOutgoingEdges(node).map(function (edge) {

		return edge.targetNode;
	});
};

/**
 * Adds an edge to the graph.
 *
 * @param {Number|Edge} sourceNodeId
 * @param {Number} [targetNodeId]
 * @param {String} [label]
 * @returns {Graph}
 * @throws {Error}
 */
Graph.prototype.addEdge = function (sourceNodeId, targetNodeId, label) {

	var sourceNode;
	var targetNode;
	var edge;

	if (sourceNodeId instanceof Edge) {
		edge = sourceNodeId;
		sourceNode = edge.sourceNode;
		targetNode = edge.targetNode;
	}
	else {
		sourceNode = this.getNodeById(sourceNodeId);
		targetNode = this.getNodeById(targetNodeId);
		edge = new Edge(sourceNode, targetNode, label);
	}

	if (edge.graph !== this) {
		if (edge.graph) {
			throw Error('Edge belongs to another graph');
		}

		if (!sourceNode || sourceNode.graph !== this) {
			throw Error('Edge source not in graph');
		}

		if (!targetNode || targetNode.graph !== this) {
			throw Error('Edge target not in graph');
		}

		if (sourceNode === targetNode) {
			throw Error('Edge has same source and target');
		}

		sourceNode.outgoing++;
		targetNode.incoming++;

		edge.graph = this;
		this.edges.push(edge);
	}

	return this;
};

/**
 * Removes an edge from the graph.
 *
 * @param {Edge} edge
 * @returns {Graph}
 */
Graph.prototype.removeEdge = function (edge) {

	edge.sourceNode.outgoing--;
	edge.targetNode.incoming--;

	edge.clear();

	this.edgesRemoved++;

	return this;
};

/**
 * Returns true if edge is added to the graph.
 *
 * @param {Edge} edge
 * @returns {Boolean}
 */
Graph.prototype.hasEdge = function (edge) {

	return (edge.graph === this);
};

/**
 * Returns an edge by key and value, or null if not found.
 *
 * @param {String} key
 * @param {*} value
 * @returns {Edge|null}
 */
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

/**
 * Returns an edge by label, or null if not found.
 *
 * @param {String} label
 * @returns {Edge|null}
 */
Graph.prototype.getEdgeByLabel = function (label) {

	return this.getEdgeBy('label', label);
};

/**
 * Returns all edges (added but not removed).
 *
 * @returns {Edge[]}
 */
Graph.prototype.getEdges = function () {

	return this.filterEdges();
};

/**
 * Returns all incoming edges for a node.
 *
 * @param {Node} node
 * @returns {Edge[]}
 */
Graph.prototype.getIncomingEdges = function (node) {

	if (node.isRoot()) {
		return [];
	}

	return this.filterEdges(function (edge) {

		return (edge.targetNode === node);
	});
};

/**
 * Returns all outgoing edges for a node.
 *
 * @param {Node} node
 * @returns {Edge[]}
 */
Graph.prototype.getOutgoingEdges = function (node) {

	if (node.isTerminal()) {
		return [];
	}

	return this.filterEdges(function (edge) {

		return (edge.sourceNode === node);
	});
};

/**
 * Invokes callback for each edge (added but not removed).
 *
 * @param {Function} callback - callback(Edge): undefined
 * @param {Object} [context=null]
 * @returns {Graph}
 */
Graph.prototype.forEachEdge = function (callback, context) {

	var self = this;

	this.edges.forEach(function (edge) {

		if (edge.graph === self) {
			callback.call(context || null, edge);
		}
	});

	return this;
};

/**
 * Returns all edges that passes a filter function.
 *
 * @param {Function} [filter=null] - filter(Edge): Boolean
 * @returns {Edge[]}
 */
Graph.prototype.filterEdges = function (filter) {

	var self = this;

	return this.edges.filter(function (edge) {

		return (edge.graph === self && (!filter || filter(edge)));
	});
};

/**
 * Sorts all edges according to a compare function.
 *
 * @param {Function} [compare] - compare(Edge, Edge): Number
 * @returns {Graph}
 */
Graph.prototype.sortEdges = function (compare) {

	var self = this;

	compare = compare || compareEdges;

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

/**
 * Returns all cyclic edges.
 *
 * @returns {Edge[]}
 * @throws {Error}
 */
Graph.prototype.getCyclicEdges = function () {

	// TODO: Find cyclic edges
	throw Error('Detecting cyclic edges not implemented');
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

/**
 * Sorts nodes and edges.
 *
 * @returns {Graph}
 */
Graph.prototype.sort = function () {

	return this.sortNodes().sortEdges();
};

/**
 * Invokes callback for each visited node.
 *
 * @param {Node} startNode
 * @param {Function} callback - callback(Object|null, Node, Edge): Boolean
 * @param {Object} [context=null]
 * @returns {Graph}
 */
Graph.prototype.traverse = function (startNode, callback, context) {

	var self = this;

	context = context || null;

	function traverse(sourceNode, sourceEdge) {

		if (!sourceNode || callback.call(context, null, sourceNode, sourceEdge)) {
			return;
		}

		var edges = self.getEdgesBySource(sourceNode);
		var edge;

		for (var i = 0; i < edges.length; i++) {
			edge = edges[i];

			if (edge.targetNode === startNode) {
				// Cyclic
				if (callback.call(context, { cyclic: true }, edge.targetNode, edge)) {
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

/**
 * Removes all nodes and edges that does not belong in the graph.
 *
 * @returns {Graph}
 */
Graph.prototype.clean = function () {

	if (this.nodesRemoved) {
		this.nodes = this.filterNodes();
		this.nodesRemoved = 0;
	}

	if (this.edgesRemoved) {
		this.edges = this.filterEdges();
		this.edgesRemoved = 0;
	}

	return this;
};

/**
 * Returns the JSON format of the graph.
 *
 * @returns {Object}
 */
Graph.prototype.toJSON = function () {

	function toJSON(object) {

		return object.toJSON();
	}

	return {
		directed: this.directed,
		label: this.label,
		nodes: this.filterNodes().map(toJSON),
		edges: this.filterEdges().map(toJSON)
	};
};

Graph.Node = Node;

Graph.Edge = Edge;

function compareNodes(node1, node2) {

	return (node1.incoming - node2.incoming || node1.outgoing - node2.outgoing);
}

function compareEdges(edge1, edge2) {

	return compareNodes(edge1.sourceNode, edge2.sourceNode);
}

module.exports = Graph;
