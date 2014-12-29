/**
 * Edge constructor.
 *
 * @param {Node} [sourceNode]
 * @param {Node} [targetNode]
 * @param {String} [label]
 */
function Edge(sourceNode, targetNode, label) {

    /** @type {Graph} */
    this.graph = null;

    /** @type {Node} */
    this.sourceNode = sourceNode || null;

    /** @type {Node} */
    this.targetNode = targetNode || null;

    /** @type {String} */
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
