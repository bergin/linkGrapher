var centre = new Point(0, 0); 

function randomisePositions()
{
	for(let node of nodes)
	{
		node.location.x=randomMinMax(-200,200);
		node.location.y=randomMinMax(-200,200);
	}

	draw();
	reposition();
	loopAnimate();
}

function createChildNode(sourceNode, nodeLink)
 { 
	 
	let point;
	if(sourceNode==-1)
		point = new Point(0, 0);

	else
	{
 		point = new Point (randomMinMax(-50, 50), randomMinMax(-50, 50) );
		point.alterPosition(nodes[sourceNode]); 				// alter new point based on where its source is
	}	

	nodes.push(new Node(nodes.length, point, new Vector(0,0), nodeLink, "true"));	// is a child node
	
	if(sourceNode>=0)
		edges.push(new Edge(sourceNode, nodes.length -1 ));
 
	return ;
}

function deleteNode(node)
{
	// nodes.splice(node, 1);  - this means the edges will have to be updated with a new sources & targets!
	node.visibility = "false";
	a = edges.length;
	while (a--)
	{
		if( (edges[a].source == node.number || edges[a].target == node.number))
		{
			console.log("edge: " + edges[a].source + "-" + edges[a].target +" deleted");
			edges.splice(a, 1);			 
		}
	}
}

function searchDeleteEdges(u,v)
{
	for(a=0;a<edges.length;a++)
	{
		if( (edges[a].source == u && edges[a].target == v) || (edges[a].source == v && edges[a].target == u))
		{
			edges.splice(a, 1);
			console.log("edge " + u + "-" + v +" deleted");
			return true;
		}
	}
	return false;	
}

function connectTheNodes(n1, n2)
{
	edges.push(new Edge(n1, n2));
}

function createStartNode(inputAddress)
{
	createChildNode(-1, inputAddress);		// the start nodes parent is a non-existent "-1"
}

function createSampleNetwork()
{ 
	let min = -200, max = 200;

	
	nodes[0] = new Node(0, new Point (0,0), new Vector(0,0), "Fruit");	
	nodes[1] = new Node(1, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Berried");
	nodes[2] = new Node(2, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Citrus");
	nodes[3] = new Node(3, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Raspberry");
	nodes[4] = new Node(4, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Strawberry");
	nodes[5] = new Node(5, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Orange");
	nodes[6] = new Node(6, new Point (randomMinMax(min, max), randomMinMax(min, max)), new Vector(0,0), "Lemon");
 
	edges[0] = new Edge(0,1);
	edges[1] = new Edge(0,2);
	edges[2] = new Edge(1,3);
	edges[3] = new Edge(1,4);
	edges[4] = new Edge(2,5);
	edges[5] = new Edge(2,6);
 
}
 