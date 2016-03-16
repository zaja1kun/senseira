var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function (ko, $) {
    'use strict';

    // node is specifically structured object, which has name, value and, optionally, children
    function TreeNode(node) {
        var self = this;
        self.name = ko.observable(node.name || "");
        self.value = ko.observable(node.value || 0);
        self.children = []; // cannot be ko observableArray, because has to be populated by d3 tree
        self._children = null;
        self.childrenTotal = 0;

        self.getChildren = function () {
            return self.children || self._children;
        };

        self.hasChildren = function () {
            return self.getChildren().length > 0;
        };

        self.updateChildrenTotalValues = function () {
            var total = 0;
            self.getChildren().forEach(function (child) {
                total += child.value();
                child.updateChildrenTotalValues();
            });
            this.childrenTotal = total;
        };

        self.pushChild = function (child) {
            if (child instanceof TreeNode) {
                self.getChildren().push(child);
            }
        };

        self.addChildren = function (childArray) {
            if (childArray instanceof TreeNode) {
                self.pushChild(childArray);
            } else if (childArray instanceof Array) {
                childArray.forEach(function (child) {
                    self.pushChild(child);
                });
            }
        };

        self.getExpandedNodesCount = function () {
            var count = 0;
            if (self.children && self.children.length > 0) {
                self.children.forEach(function (child) {
                    count += child.getExpandedNodesCount();
                });
            } else {
                count = 1;
            }
            return count;
        };

        self.collapse = function () {
            if (self.children) {
                self._children = self.children;
                self._children.forEach(function (c) {
                    c.collapse();
                });
                self.children = null;
            }
        };

        self.toggle = function () {
            if (self.children) {
                self._children = self.children;
                self.children = null;
            } else {
                self.children = self._children;
                self._children = null;
            }
        };

        if (node.children) {
            node.children.forEach(function (n) {
                self.addChildren(new TreeNode(n));
            });
        }
        self.updateChildrenTotalValues();
    }

    function ModuleSystemCreatorViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }

        // replace r definition with getting object from server
        var r = {
            name: "Семестр",
            value: 100,
            children: [{
                name: "1 модуль",
                value: 15,
                children: [{
                    name: "Лаба 1",
                    value: 40
                }, {
                    name: "Лаба 2",
                    value: 50
                }, {
                    name: "Лаба 146. Драйвер для видеокарты под Linux на JS.",
                    value: 146
                }]
            }, {
                name: "2 модуль",
                value: 15,
                children: [{
                    name: "Лаба 3",
                    value: 40
                }, {
                    name: "Лаба 4",
                    value: 50
                }, {
                    name: "Лаба 5",
                    value: 146
                }, {
                    name: "Лаба 6",
                    value: 40
                }, {
                    name: "Лаба 7",
                    value: 50
                }, {
                    name: "Лаба 8",
                    value: 146
                }]
            }, {
                name: "Тост 1",
                value: 45
            }]
        };

        var root = new TreeNode(r);

        var margin = {
                top: 20, bottom: 20, left: 50, right: 50,
                vertical: function () {
                    return this.top + this.bottom;
                },
                horizontal: function () {
                    return this.right + this.left;
                }
            },
            nodeRadius = 30,
            nodeOuterHeight = 2 * nodeRadius + 20, // 20 for padding between nodes
            initHeight = root.getExpandedNodesCount() * nodeOuterHeight, // needed for d3 tree coefficients
            initWidth = $(".module-system-view-tree").width() - margin.horizontal();

        var nodeId = 0,
            animDuration = 500;

        var tree = d3.layout.tree().size([initHeight, initWidth]);

        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        }); // it's for links

        var svg = d3.select(".module-system-view-tree").append("svg"),
            svg_g = svg.append("g")
                .attr("transform", "translate(" + margin.left + ",0)");

        self.editingNode = null;

        root._y = 0;
        root.children.forEach(function (c) {
            c.collapse();
        });
        updateNode(root);

        function updateNode(parent) {
            // Set new svg height
            var height = root.getExpandedNodesCount() * nodeOuterHeight + margin.vertical();
            var width = $(".module-system-view-tree").width() - margin.horizontal();
            svg.transition()
                .duration(animDuration)
                .attr("height", height + margin.vertical())
                .attr("width", width + margin.horizontal());

            var scaleHeight = d3.scale.linear().domain([0, initHeight]).range([0, height]);
            var scaleWidth = d3.scale.linear().domain([0, initWidth]).range([0, width]);

            if (!root._x) {
                root._x = height / 2;
                root._xScaled = scaleHeight(root._x);
                root._yScaled = scaleWidth(root._y);
            }

            // Compute the new tree layout
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize tree width
            var nodesIndent = width / 3; // hardcoded number of max depth
            nodes.forEach(function (d) {
                d.y = d.depth * nodesIndent;
                d.xScaled = scaleHeight(d.x);
                d.yScaled = scaleWidth(d.y);
            });

            // Update node elements
            var nodeElements = svg_g.selectAll("g.module-system-view-node")
                .data(nodes, function (d) {
                    if (!d.id) d.id = ++nodeId;
                    return d.id;
                });

            var nodeElementsEnter = nodeElements.enter().append("g")
                .attr("class", "module-system-view-node")
                .attr("transform", function () {
                    return "translate(" + parent._yScaled + "," + parent._xScaled + ")";
                })
                .on("dblclick", toggleNode)
                .on("click", toggleNodeEditMode);

            nodeElementsEnter.append("circle")
                .attr("r", 1e-6)
                .attr("class", function (d) {
                    return "module-system-view-node-circle" + (d.hasChildren() ? " module-system-view-node-with-children" : "");
                });

            nodeElementsEnter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "0.5em")
                .classed("module-system-view-node-text", true)
                .classed("no-selection", true)
                .style("fill-opacity", 1e-6)
                .text(function (d) {
                    var text = "";
                    if (d.parent) {
                        if (!d.parent.childrenTotal) d.parent.updateChildrenTotalValues();
                        text = (Math.round(d.value() / d.parent.childrenTotal * 1000) / 10).toFixed(1) + "%";
                    }
                    return text;
                });

            nodeElementsEnter.append("text")
                .attr("text-anchor", function (d) {
                    return d.hasChildren() ? "middle" : "start"
                })
                .attr("x", function (d) {
                    return d.hasChildren() ? 0 : nodeRadius + 5;
                })
                .attr("dy", function (d) {
                    return d.hasChildren() ? (-nodeRadius - 5) : "0.5em";
                })
                .classed("module-system-view-node-text", true)
                .classed("no-selection", true)
                .text(function (d) {
                    return d.name();
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position
            var nodeElementsUpdate = nodeElements.transition()
                .duration(animDuration)
                .attr("transform", function (d) {
                    return "translate(" + d.yScaled + "," + d.xScaled + ")"
                });

            nodeElementsUpdate.select("circle")
                .attr("r", nodeRadius);

            nodeElementsUpdate.selectAll("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position
            var nodeElementsExit = nodeElements.exit().transition()
                .duration(animDuration)
                .attr("transform", function () {
                    return "translate(" + parent.yScaled + "," + parent.xScaled + ")";
                })
                .remove();

            nodeElementsExit.select("circle")
                .attr("r", 1e-6);

            nodeElementsExit.selectAll("text")
                .style("fill-opacity", 1e-6);

            // Update links
            var linkElements = svg_g.selectAll("path.module-system-view-link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Insert links before circles
            linkElements.enter().insert("path", "g")
                .attr("class", "module-system-view-link")
                .attr("d", function () {
                    var o = {x: parent._xScaled, y: parent._yScaled};
                    return diagonal({source: o, target: o});
                });

            linkElements.transition()
                .duration(animDuration)
                .attr("d", function (d) {
                    var s = {x: d.source.xScaled, y: d.source.yScaled},
                        t = {x: d.target.xScaled, y: d.target.yScaled};
                    return diagonal({source: s, target: t});
                });

            linkElements.exit().transition()
                .duration(animDuration)
                .attr("d", function () {
                    var o = {x: parent.xScaled, y: parent.yScaled};
                    return diagonal({source: o, target: o});
                })
                .remove();

            var highlightNodePath = function (d, mouseover) {
                if (d) {
                    var node = nodeElements.filter(function (el) {
                        return d.id == el.id;
                    });
                    var link = linkElements.filter(function (lnk) {
                        return d == lnk.target;
                    });
                    if (link) link.classed("module-system-view-hover", mouseover);
                    if (node) node.select("circle").classed("module-system-view-hover", mouseover);
                    if (d.parent) highlightNodePath(d.parent, mouseover);
                }
            };

            var mouseenter = function (d) {
                highlightNodePath(d, true);
            };

            var mouseleave = function (d) {
                highlightNodePath(d, false);
            };

            nodeElements.on("mouseenter", mouseenter)
                .on("mouseleave", mouseleave);

            nodes.forEach(function (d) {
                d._x = d.x;
                d._y = d.y;
                d._xScaled = d.xScaled;
                d._yScaled = d.yScaled;
            });
        }

        function toggleNode(d) {
            d.toggle();
            updateNode(d);
        }

        function toggleNodeEditMode(d) {
            var editor = $(".module-system-view-editor");
            var editorVisible = self.editingNode == d && editor.is(":visible");

            var expandTreeView = function () {
                d3.select(".module-system-view-tree")
                    .classed("col-md-9", !editorVisible)
                    .classed("col-md-12", editorVisible);
            };

            if (editorVisible) {
                editor.hide();
                expandTreeView();
            } else {
                expandTreeView();
                editor.show();
            }
            updateNode(root);

            self.editingNode = d;
        }
    }

    ko.applyBindings(new ModuleSystemCreatorViewModel());
})(ko, jQuery, d3);