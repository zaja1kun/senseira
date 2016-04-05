var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function (ko, $) {
    'use strict';

    // node is specifically structured object, which has name, value and, optionally, children
    function TreeNode(node) {
        var self = this;
        self._name = (node && node.name) || "";
        self._value = (node && node.value) || 0;
        self._description = (node && node.description) || "";
        self.children = []; // cannot be observableArray, because has to be populated by d3 tree
        self._children = null;
        self.childrenTotal = 0;
        self.parent = null;

        // values for editing
        self.name = ko.observable(self._name);
        self.value = ko.observable(self._value);
        self.description = ko.observable(self._description);

        self.submitChanges = function () {
            self._name = self.name();
            var value = parseFloat(self.value());
            self._description = self.description();
            if ((self._value != value) && self.parent) {
                self._value = value;
                self.parent.updateChildrenTotalValues();
            }
        };

        self.discardChanges = function () {
            self.name(self._name);
            self.value(self._value);
            self.description(self._description);
        };

        // tree functions
        self.getChildren = function () {
            return self.children || self._children || (self.children = []);
        };

        self.hasChildren = function () {
            return self.getChildren().length > 0;
        };

        self.expanded = function () {
            return self.children && self.children.length > 0;
        };

        self.updateChildrenTotalValues = function () {
            var total = 0;
            self.getChildren().forEach(function (child) {
                total += child._value;
                child.updateChildrenTotalValues();
            });
            self.childrenTotal = total;
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

        self.remove = function () {
            if (self.parent) {
                var contArray = self.parent.getChildren();
                contArray.splice(contArray.indexOf(self), 1);
                self.parent.updateChildrenTotalValues();
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

        self.expand = function () {
            if (self._children) {
                self.children = self._children;
                self._children = null;
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

        if (node && node.children) {
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

        self.editingNode = ko.observable();
        self.nodeWithContext = null;

        d3.json("moduleSystemTemplate.json", function (error, r) {
            if (error) return;

            var root = new TreeNode(r);

            var nodeConf = {
                padding: 10,
                radius: 30,
                outerHeight: function () {
                    return (this.padding + this.radius) * 2;
                }
            };

            var contextConf = {
                padding: 5,
                radius: 10,
                offsetAngle: Math.PI / 6,
                distance: function () {
                    return this.radius + this.padding + nodeConf.radius;
                },
                diameter: function () {
                    return this.radius * 2;
                }
            };

            var marginConf = {
                top: 20, bottom: 20, left: 50, right: 50,
                vertical: function () {
                    return this.top + this.bottom;
                },
                horizontal: function () {
                    return this.right + this.left;
                }
            };

            var initHeight = root.getExpandedNodesCount() * nodeConf.outerHeight(), // needed for d3 tree coefficients
                initWidth = $(".module-system-view-tree").width() - marginConf.horizontal();

            var nodeId = 0,
                animDuration = 500;

            var tree = d3.layout.tree().size([initHeight, initWidth]);

            var diagonal = d3.svg.diagonal().projection(function (d) {
                return [d.y, d.x];
            }); // it's for links

            var svg = d3.select(".module-system-view-tree").append("svg"),
                svg_g = svg.append("g")
                    .attr("transform", "translate(" + marginConf.left + ",0)");

            root._y = 0;
            root.children.forEach(function (c) {
                c.collapse();
            });

            function updateNode(parent) {
                // Set new svg height
                var height = root.getExpandedNodesCount() * nodeConf.outerHeight() + marginConf.vertical();
                var width = $(".module-system-view-tree").width() - marginConf.horizontal();
                svg.transition()
                    .duration(animDuration)
                    .attr("height", height + marginConf.vertical())
                    .attr("width", width + marginConf.horizontal());

                var scaleHeight = d3.scale.linear().domain([0, initHeight]).range([0, height]);
                var scaleWidth = d3.scale.linear().domain([0, initWidth]).range([0, width]);

                if (!root._x) {
                    root._x = height / 2;
                    root._xScaled = scaleHeight(root._x);
                    root._yScaled = scaleWidth(root._y);
                }

                // Compute the new tree layout
                var nodes = tree.nodes(root),
                    links = tree.links(nodes);

                // Normalize tree width
                var nodesIndent = width / 3; // hardcoded number of max depth
                nodes.forEach(function (d) {
                    d.y = d.depth * nodesIndent;
                    d.xScaled = scaleHeight(d.x);
                    d.yScaled = scaleWidth(d.y);
                });

                // Update node elements
                var nodeElements = svg_g.selectAll("g.d3tree-node")
                    .data(nodes, function (d) {
                        if (!d.id) d.id = ++nodeId;
                        return d.id;
                    });

                var nodeElementsEnter = nodeElements.enter().insert("g", "g")
                    .attr("class", "d3tree-node")
                    .attr("transform", function () {
                        return "translate(" + parent._yScaled + "," + parent._xScaled + ")";
                    })
                    .on("contextmenu", openContextMenu);

                nodeElementsEnter.append("circle")
                    .attr("r", 1e-6)
                    .classed("d3tree-node-circle", true);
                nodeElements.selectAll("circle")
                    .classed("d3tree-node-with-children", function (d) {
                        return d.hasChildren();
                    });

                nodeElementsEnter.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", "7px")
                    .classed("d3tree-node-text d3tree-node-value", true)
                    .classed("no-selection", true)
                    .style("fill-opacity", 1e-6);

                nodeElements.selectAll(".d3tree-node-value")
                    .text(function (d) {
                        var text = "";
                        if (d.parent) {
                            if (!d.parent.childrenTotal) d.parent.updateChildrenTotalValues();
                            text = (d.parent.childrenTotal ? (Math.round(d._value / d.parent.childrenTotal * 1000) / 10) : 0).toFixed(1) + "%";
                        }
                        return text;
                    });

                nodeElementsEnter.append("text")
                    .classed("d3tree-node-text d3tree-node-name", true)
                    .classed("no-selection", true)
                    .style("fill-opacity", 1e-6);

                nodeElements.selectAll(".d3tree-node-name")
                    .attr("text-anchor", function (d) {
                        return d.hasChildren() ? "middle" : "start"
                    })
                    .attr("x", function (d) {
                        return d.hasChildren() ? 0 : nodeConf.radius + 5;
                    })
                    .attr("dy", function (d) {
                        return (d.hasChildren() ? (-nodeConf.radius - 5) : 7) + "px";
                    })
                    .text(function (d) {
                        return d._name;
                    })
                    .call(wrapText, nodesIndent);

                // Transition nodes to their new position
                var nodeElementsUpdate = nodeElements.transition()
                    .duration(animDuration)
                    .attr("transform", function (d) {
                        return "translate(" + d.yScaled + "," + d.xScaled + ")"
                    });

                nodeElementsUpdate.select("circle")
                    .attr("r", nodeConf.radius);

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
                var linkElements = svg_g.selectAll("path.d3tree-link")
                    .data(links, function (d) {
                        return d.target.id;
                    });

                // Insert links before circles
                linkElements.enter().insert("path", "g")
                    .attr("class", "d3tree-link")
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

                var highlightNodePath = function (d, highlightType, show) {
                    if (d) {
                        var node = nodeElements.filter(function (el) {
                            return d.id == el.id;
                        });
                        var link = linkElements.filter(function (lnk) {
                            return d == lnk.target;
                        });
                        switch (highlightType) {
                            case 'hover':
                                if (link) link.classed("d3tree-hover", show);
                                if (node) node.select("circle").classed("d3tree-hover", show);
                                break;
                            case 'select':
                                if (link) link.classed("d3tree-selected", show);
                                if (node) node.select("circle").classed("d3tree-selected", show);
                                break;
                            default:
                                break;
                        }
                        if (d.parent) highlightNodePath(d.parent, highlightType, show);
                    }
                };

                var mouseenter = function (d) {
                    highlightNodePath(d, 'hover', true);
                };

                var mouseleave = function (d) {
                    highlightNodePath(d, 'hover', false);
                };

                var mouseclick = function (d) {
                    var hideSelection = self.editingNode() == d && $(".module-system-view-editor").is(":visible");
                    d3.selectAll(".d3tree-selected").classed("d3tree-selected", false);
                    if (!hideSelection) highlightNodePath(d, 'select', true);
                    toggleNodeEditMode(d);
                };

                nodeElements.on("mouseenter", mouseenter)
                    .on("mouseleave", mouseleave)
                    .on("click", mouseclick);

                closeContextMenu();

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

            function closeContextMenu() {
                var container = d3.selectAll(".d3tree-node-context");
                if (!container.empty()) {
                    var options = container.selectAll(".d3tree-node-context-option");
                    if (options.empty() || !self.nodeWithContext) {
                        container.remove();
                    } else {
                        var y = self.nodeWithContext && self.nodeWithContext.yScaled,
                            x = self.nodeWithContext && self.nodeWithContext.xScaled;
                        container.transition()
                            .duration(animDuration)
                            .attr("transform", function () {
                                return "translate(" + y + "," + x + ")";
                            });
                        options.transition()
                            .duration(animDuration)
                            .attr("transform", "translate(0,0)")
                            .each("end", function () {
                                d3.select(this.parentNode).remove();
                            });
                        options.selectAll(".glyphicon")
                            .transition()
                            .duration(animDuration)
                            .style("font-size", "0px");
                        self.nodeWithContext = null;
                    }
                }
            }

            function openContextMenu(d) {
                if (d) {
                    if (self.nodeWithContext != d) {
                        closeContextMenu();
                        var contextContainer = svg_g.insert("g", "g")
                            .classed("d3tree-node-context", true)
                            .attr("transform", function () {
                                return "translate(" + d.yScaled + "," + d.xScaled + ")";
                            });

                        var createOption = function (i, className, callback) {
                            var option = contextContainer.append("g")
                                .classed("d3tree-node-context-option", true)
                                .attr("transform", "translate(0,0)")
                                .on("click", function () { callback(d); });

                            var circle = option.append("circle")
                                .attr("r", contextConf.radius)
                                .classed("d3tree-node-context-option-circle", true);

                            var span = option.append("svg:foreignObject")
                                .attr("width", contextConf.diameter())
                                .attr("height", contextConf.diameter())
                                .attr("x", -contextConf.radius + "px")
                                .attr("y", -contextConf.radius + "px")
                                .append("xhtml:span")
                                .classed(className, true)
                                .style("font-size", "0px");

                            option.transition()
                                .duration(animDuration)
                                .attr("transform", function () {
                                    var optAngle = i * contextConf.offsetAngle,
                                        optX = contextConf.distance() * Math.cos(optAngle),
                                        optY = contextConf.distance() * Math.sin(optAngle);
                                    return "translate(" + optX + "," + optY + ")";
                                });

                            var hover = function (d, mouseover) {
                                var font_size = parseInt(span.style("font-size")) + (mouseover ? 2 : -2);
                                span.style("font-size", font_size + "px");
                            };

                            span.on("mouseenter", function (d) {
                                    hover(d, true);
                                })
                                .on("mouseleave", function (d) {
                                    hover(d, false);
                                })
                                .transition()
                                .duration(animDuration)
                                .style("font-size", (contextConf.radius * 2) + "px");
                            return option;
                        };

                        if (d.depth < 2) createOption(-1, "glyphicon glyphicon-plus-sign", addNode);
                        if (d.hasChildren()) {
                            if (d.expanded()) createOption(0, "glyphicon glyphicon-chevron-left", toggleNode);
                            else createOption(0, "glyphicon glyphicon-chevron-right", toggleNode);
                        }
                        if (d.parent) createOption(1, "glyphicon glyphicon-minus-sign", removeNode);
                        self.nodeWithContext = d;
                    } else {
                        closeContextMenu();
                    }
                    d3.event.preventDefault();
                }
            }

            function removeNode(d) {
                if (d) {
                    bootbox.dialog({
                        title: "Вы уверены?",
                        message: Senseira.constants.TreeNodeRemovalAlertMessage,
                        buttons: {
                            remove: {
                                label: "Продолжить",
                                className: "btn-danger",
                                callback: function () {
                                    closeContextMenu();
                                    d.remove();
                                    updateNode(d.parent);
                                }
                            },
                            cancel: {
                                label: "Отменить",
                                className: "btn-default"
                            }
                        }
                    });

                }
            }

            function addNode(d) {
                if (d) {
                    d.expand();
                    d.addChildren(new TreeNode());
                    updateNode(d);
                }
            }

            function showEditor(show) {
                var editor = $(".module-system-view-editor");
                var hiddenRight = -editor.width();
                editor.css("top", "50px")
                    .css("right", (show ? hiddenRight : editor.right) + "px");
                editor.show();
                editor.animate({
                    "right": (show ? $("#moduleSystemCreator").offset().left : hiddenRight) + "px"
                }, animDuration, function () {
                    if (!show) editor.hide();
                });
                updateNode(root);
            }

            function toggleNodeEditMode(d) {
                var editor = $(".module-system-view-editor");
                var editorVisible = editor.is(":visible");
                var nodeClickedTwice = self.editingNode() == d;
                var hideEditor = editorVisible && nodeClickedTwice;

                d3.select(".module-system-view-tree")
                    .classed("col-md-9", !(hideEditor))
                    .classed("col-md-12", hideEditor);

                if (!editorVisible) {
                    showEditor(true);
                } else if (nodeClickedTwice) {
                    showEditor(false);
                }

                self.editingNode(d);
            }

            self.submitNodeChanges = function (node) {
                if (node) {
                    node.submitChanges();
                    if (node.parent) {
                        updateNode(node.parent);
                    }
                }
            };

            function wrapText(text, width) {
                text.each(function () {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineHeight = 14, // px
                        x = text.attr("x"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", x).attr("dy", dy + "px").classed("no-selection", true);
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", x).attr("dy", lineHeight + "px").text(word).classed("no-selection", true);
                        }
                    }
                });
            }

            function resize() {
                var editor = $(".module-system-view-editor");
                editor.width($("#moduleSystemCreator").width() / 4);
                showEditor(editor.is(":visible"));
            }

            d3.select(window).on("resize", resize);
            svg.on("mouseleave", closeContextMenu);
            resize();
        });
    }

    ko.applyBindings(new ModuleSystemCreatorViewModel());
})(ko, jQuery, d3);