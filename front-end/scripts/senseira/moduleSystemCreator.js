var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function (ko, $) {
    'use strict'

    function ModuleSystemCreatorViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }

        var root = {
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
                name: "Тост 1",
                value: 45
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
                }]
            }]
        };

        var margin = {
                top: 20, bottom: 20, left: 50, right: 50,
                vertical: function () { return this.top + this.bottom; },
                horizontal: function () { return this.right + this.left; }},
            nodeOuterHeight = 100,
            initHeight = getExpandedNodesCount(root) * nodeOuterHeight, // needed for d3 tree coefficients
            initWidth = $(".module-system-view-tree").width() - margin.right - margin.left,
            viewerWidth = initWidth;

        var nodeId = 0,
            animDuration = 750;

        var tree = d3.layout.tree().size([initHeight, initWidth]);

        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        }); // it's for links

        var svg = d3.select(".module-system-view-tree").append("svg")
            .attr("width", initWidth + margin.horizontal()),
            svg_g = svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)");

        root._y = 0;
        root.children.forEach(collapseNode);
        updateNode(root);

        function updateNode(parent) {
            // Set new svg height
            var height = getExpandedNodesCount(root) * nodeOuterHeight + margin.vertical();
            svg.transition()
                .duration(animDuration)
                .attr("height", height);

            var scaleHeight = d3.scale.linear().domain([0, initHeight]).range([0, height]);

            if (!root._x) {
                root._x = height / 2;
                root._xScaled = scaleHeight(root._x);
            }

            // Compute the new tree layout
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize tree width
            var nodesIndent = viewerWidth / 3;
            nodes.forEach(function (d) {
                d.y = d.depth * nodesIndent;
                d.xScaled = scaleHeight(d.x);
            });

            // Update node elements
            var nodeElements = svg_g.selectAll("g.module-system-view-node")
                .data(nodes, function (d) {
                   return d.id || (d.id = ++nodeId);
                });

            var nodeElementsEnter = nodeElements.enter().append("g")
                .attr("class", "module-system-view-node")
                .attr("transform", function (d) { return "translate(" + parent._y + "," + parent._xScaled + ")"; })
                .on("click", toggleNode);

            nodeElementsEnter.append("circle")
                .attr("r", 1e-6)
                .attr("class", function (d) { return "module-system-view-node-circle" + (d.children || d._children ? " module-system-view-node-with-children" : ""); });

            nodeElementsEnter.append("text")
                .attr("x", -20)
                .attr("dy", "0.5em")
                .attr("class", "module-system-view-node-text")
                .style("fill-opacity", 1e-6)
                .text(function (d) {
                    var text = "";
                    if (d.parent) {
                        if (!d.parent.childrenTotal) updateChildrenTotalValues(d.parent);
                        text = (Math.round(d.value / d.parent.childrenTotal * 1000) / 10).toFixed(1) + "%";
                    }
                    return text;
                });

            // Transition nodes to their new position
            var nodeElementsUpdate = nodeElements.transition()
                .duration(animDuration)
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.xScaled + ")"});

            nodeElementsUpdate.select("circle")
                .attr("r", 40);

            nodeElementsUpdate.selectAll("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position
            var nodeElementsExit = nodeElements.exit().transition()
                .duration(animDuration)
                .attr("transform", function(d) { return "translate(" + parent.y + "," + parent.xScaled + ")"; })
                .remove();

            nodeElementsExit.select("circle")
                .attr("r", 1e-6);

            nodeElementsExit.selectAll("text")
                .style("fill-opacity", 1e-6);

            // Update links
            var linkElements = svg_g.selectAll("path.module-system-view-link")
                .data(links, function (d) { return d.target.id; });

            // Insert links before circles
            linkElements.enter().insert("path", "g")
                .attr("class", "module-system-view-link")
                .attr("d", function (d) {
                    var o = {x: parent._xScaled, y: parent._y};
                    return diagonal({source: o, target: o});
                });

            linkElements.transition()
                .duration(animDuration)
                .attr("d", function(d) {
                    var s = {x: d.source.xScaled, y: d.source.y},
                        t = {x: d.target.xScaled, y: d.target.y};
                    return diagonal({source: s, target: t});
                });

            linkElements.exit().transition()
                .duration(animDuration)
                .attr("d", function (d) {
                    var o = {x: parent.xScaled, y: parent.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            nodes.forEach(function (d) {
                d._x = d.x;
                d._y = d.y;
                d._xScaled = d.xScaled;
            });
        }

        function getExpandedNodesCount(d) {
            var count = 0;
            if (d.children) {
                d.children.forEach(function (d) {
                    count += getExpandedNodesCount(d);
                });
            } else {
                count = 1;
            }
            return count;
        }

        function collapseNode(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapseNode);
                d.children = null;
            }
        }

        function toggleNode(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            updateNode(d);
        }

        function updateChildrenTotalValues(d) {
            var total = 0;
            if (d.children) {
                d.children.forEach(function (child) {
                    total += (child.value || 0);
                    updateChildrenTotalValues(child);
                });
            }
            d.childrenTotal = total;
        }
    }

    ko.applyBindings(new ModuleSystemCreatorViewModel());
})(ko, jQuery, d3);