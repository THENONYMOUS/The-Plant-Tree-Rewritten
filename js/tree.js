var layoutInfo = {
    startTab: "none",
    startNavTab: "stat",
	showTree: true,
    treeLayout: ""
}

addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})