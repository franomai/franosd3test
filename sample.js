var workflowInfo = JSON.parse(workflows);
console.log(workflowInfo);

// Create a new directed graph
var g = new dagreD3.graphlib.Graph({compound: true}).setGraph({});

// States and transitions
for (var key in workflowInfo) {
  var thisWorkflow = workflowInfo[key].states;
  g.setNode(key, { label: key, clusterLabelPos: 'top', style: 'fill: #d3d3d3' });
  for (var state in thisWorkflow) {
    // Automatically label each of the nodes
    g.setNode(key + '_' + state, { label: state, style: thisWorkflow[state].colour, shape: thisWorkflow[state].final ? "ellipse" : thisWorkflow[state].initial ? "circle" : "rect" });
    g.setParent(key + '_' + state, key);
  }

  for (var stateNodes in thisWorkflow) {
    for (var action in thisWorkflow[stateNodes].actions) {
      for (var i = 0; i < thisWorkflow[stateNodes].actions[action].length; i++) {
        g.setEdge(key + '_' + stateNodes, key + '_' + thisWorkflow[stateNodes].actions[action][i], { label: action });
      }
    }
  }
}

// Set some general styles
g.nodes().forEach(function (v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
});

/*
// Add some custom colors based on state
g.node('CLOSED').style = 'fill: #f77';
g.node('ESTAB').style = 'fill: #7f7';
*/

var svg = d3.select('svg');
var inner = svg.select('g');

// Set up zoom support
var zoom = d3.zoom().on('zoom', function () {
  inner.attr('transform', d3.event.transform);
});
svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var initialScale = 0.75;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr('width') - g.graph().width * initialScale) / 2, 20).scale(initialScale));

svg.attr('height', g.graph().height * 2 + 40);
