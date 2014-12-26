function Node(id, label) {

    this.graph = null;
    this.id = id || 0;
    this.label = label || '';
    this.sourceLength = 0;
    this.targetLength = 0;
}

Node.prototype.clear = function () {

    this.graph = null;
    this.sourceLength = 0;
    this.targetLength = 0;

    return this;
};

Node.prototype.isRoot = function () {

    return !this.sourceLength;
};

Node.prototype.isTerminal = function () {

    return !this.targetLength;
};

Node.prototype.toString = function () {

    return this.label;
};

module.exports = Node;
