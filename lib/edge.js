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

Edge.prototype.toString = function () {

    return this.label;
};

module.exports = Edge;
