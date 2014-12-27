function Edge(sourceNode, targetNode, label) {

    this.graph = null;
    this.sourceNode = sourceNode || null;
    this.targetNode = targetNode || null;
    this.label = label || '';
}

Edge.prototype.clear = function () {

    this.graph = null;
    this.sourceNode = null;
    this.targetNode = null;

    return this;
};

Edge.prototype.isConnectedTo = function (node) {

    return (this.sourceNode === node || this.targetNode === node);
};

Edge.prototype.toJSON = function () {

    return {
        source: this.sourceNode.id,
        target: this.targetNode.id,
        label: this.label
    };
};

module.exports = Edge;
