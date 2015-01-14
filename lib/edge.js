/**
 * Edge constructor.
 *
 * @public
 * @constructor
 * @param {Node} [sourceNode]
 * @param {Node} [targetNode]
 * @param {String} [label]
 */
function Edge(sourceNode, targetNode, label) {

	/** @member {Graph} */
	this.graph = null;

	/** @member {Node} */
	this.sourceNode = sourceNode || null;

	/** @member {Node} */
	this.targetNode = targetNode || null;

	/** @member {String} */
	this.label = label || '';
}

/**
 * Clears the edge.
 *
 * @returns {Edge}
 */
Edge.prototype.clear = function () {

	this.graph = null;
	this.sourceNode = null;
	this.targetNode = null;

	return this;
};

/**
 * Returns true if the edge is connected to the specified node.
 *
 * @param {Node} node
 * @returns {Boolean}
 */
Edge.prototype.isConnectedTo = function (node) {

	return (this.sourceNode === node || this.targetNode === node);
};

/**
 * Returns the JSON format of the edge.
 *
 * @returns {Object}
 */
Edge.prototype.toJSON = function () {

	return {
		source: this.sourceNode.id,
		target: this.targetNode.id,
		label: this.label
	};
};

module.exports = Edge;
