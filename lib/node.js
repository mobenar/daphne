/**
 * Node constructor.
 *
 * @public
 * @constructor
 * @param {Number} [id]
 * @param {String} [label]
 */
function Node(id, label) {

	/** @member {Graph} */
	this.graph = null;

	/** @member {Number} */
	this.id = id || 0;

	/** @member {String} */
	this.label = label || '';

	/** @member {Number} */
	this.incoming = 0;

	/** @member {Number} */
	this.outgoing = 0;
}

/**
 * Clears the node.
 *
 * @returns {Node}
 */
Node.prototype.clear = function () {

	this.graph = null;
	this.incoming = 0;
	this.outgoing = 0;

	return this;
};

/**
 * Returns true if the node is root (no incoming edges).
 *
 * @returns {Boolean}
 */
Node.prototype.isRoot = function () {

	return !this.incoming;
};

/**
 * Returns true if the node is terminal (no outgoing edges).
 *
 * @returns {Boolean}
 */
Node.prototype.isTerminal = function () {

	return !this.outgoing;
};

/**
 * Returns the JSON format of the node.
 *
 * @returns {Object}
 */
Node.prototype.toJSON = function () {

	return {
		id: this.id,
		label: this.label
	};
};

module.exports = Node;
