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
            }]
        };

        var margin = {
                top: 20, bottom: 20, left: 50, right: 50,
                vertical: function () { return this.top + this.bottom; },
                horizontal: function () { return this.right + this.left; }},
            nodeOuterHeight = 50,
            maxHeight = getExpandedNodesCount(root) * nodeOuterHeight, // needed for d3 tree coefficients
            initWidth = $(".module-system-tree").width() - margin.right - margin.left,
            viewerWidth = initWidth;

        var scale = d3.scale.linear().domain([0, initWidth]);

        var nodeId = 0,
            animDuration = 750;

        var tree = d3.layout.tree().size([maxHeight, scale(initWidth)]);

        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        }); // it's for links

        var svg = d3.select(".module-system-tree").append("svg")
            .attr("width", initWidth + margin.horizontal()),
            svg_g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root._x = 0;
        root._y = 0;
        root.children.forEach(collapseNode);
        updateNode(root);

        function updateNode(parent) {
            // Set new svg height
            var height = getExpandedNodesCount(root) * nodeOuterHeight + margin.vertical();
            svg.attr("height", height);
            root._x = height / 2;

            // Compute the new tree layout
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize tree width
            var nodesIndent = viewerWidth / 4;
            nodes.forEach(function (d) {
                d.y = d.depth * nodesIndent;
            });

            // Update node elements
            var nodeElements = svg_g.selectAll("g.module-system-node")
                .data(nodes, function (d) {
                   return d.id || (d.id = ++nodeId);
                });

            var nodeEnter = nodeElements.enter().append("g")
                .attr("class", "module-system-node")
                .attr("transform", function (d) { return "translate(" + parent._y + "," + parent._x + ")"; })
                .on("click", toggleNode);

            nodeEnter.append("circle")
                .attr("r", 20)
                .style("fill", "#f00000");
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
    }

    ko.applyBindings(new ModuleSystemCreatorViewModel());
})(ko, jQuery, d3);