function Node(id, label) {

    this.graph = null;
    this.id = id || 0;
    this.label = label || '';
    this.incoming = 0;
    this.outgoing = 0;
}

Node.prototype.clear = function () {

    this.graph = null;
    this.incoming = 0;
    this.outgoing = 0;

    return this;
};

Node.prototype.isRoot = function () {

    return !this.incoming;
};

Node.prototype.isTerminal = function () {

    return !this.outgoing;
};

Node.prototype.toJSON = function () {

    return {
        id: this.id,
        label: this.label
    };
};

module.exports = Node;
