var repulsion_constant =  500;
var attraction_constant = 0.1;
var springLength = 100;
 
function reposition()
{
	let repellingForce, attractingForce;

	for(let a=0; a < nodes.length; a++)
	{
		if(nodes[a].visibility == "false")
			continue;

		for(let b=a+1; b < nodes.length; b++) 
		{
			if(nodes[b].visibility == "false")
				continue;
			repellingForce = replusionForce (nodes[a], nodes[b]);	 
			nodes[a].sumVectors(repellingForce, "add");
			nodes[b].sumVectors(repellingForce, "minus");
		}
	}

	for(let a=0; a < edges.length; a++)
	{
		let s = edges[a].source, t = edges[a].target;
		attractingForce = attractionForce(nodes[s], nodes[t]);
		nodes[s].sumVectors(attractingForce, "add");
		nodes[t].sumVectors(attractingForce, "minus");
	}

	for(let node of nodes) 
	{
		if(node.visibility == "false")
			continue;
		node.newPosition(node.velocity); 
		node.velocity.reset();
	}
}

function replusionForce(a, b)
{
	let d = Math.max(1, distance (a.location, b.location));
	let norm = new Point (0,0);
	let force = repulsion_constant / Math.pow(d, 2)  ;
	norm.x = (a.location.x - b.location.x) / d;
	norm.y = (a.location.y - b.location.y) / d;
	let fx =  force * norm.x, fy = force * norm.y ;

	return new Vector(fx, fy);
}

function attractionForce(a, b)
{
	let d = Math.max(1, distance (a.location, b.location));
	let norm = new Point (0,0);																
	let force = -attraction_constant * Math.max(0, d - b.springLength) ; 
	norm.x = (a.location.x - b.location.x) / d;
	norm.y = (a.location.y - b.location.y) / d;	
	let fx =  force * norm.x, fy = force * norm.y ;
	return new Vector(fx, fy);
}

function distance(a, b)
{
	let x = a.x - b.x;
	let y = a.y - b.y;
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
 

