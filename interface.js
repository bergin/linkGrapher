var canvas;
var width, height, screenCentreX,  screenCentreY ;
var dotSize = 10, scaling = 1; 
var movingNode, myNode, deleting = false, labelling = false; 
var joiningList = [], joining = false;
var coll = document.getElementsByClassName("collapsible");   


// look for a node based on where the user clicked, using event & pageX / pageY

function stop()
{
	cancelAnimationFrame(stopAnimation);
}

function keyDown(event)
{
 	//console.log(event.code);
	if(event.code=="MetaLeft")
		joining = true; 

	if(event.code=="KeyD")
		deleting = true;	

	if(event.code=="KeyQ")
		labelling = true;		
}

function keyUp(event)
{
	if(event.code=="MetaLeft")
		joining = false; 
	if(event.code=="KeyD")
		deleting = false;	
	if(event.code=="KeyQ")
		labelling = false;				
}

function enterText(event)
{
	if(event.code === 'Enter') 
	{
		let test = parseInt(document.getElementById('textbox').getAttribute("node"));
		nodes[test].label = document.getElementById('textbox').value;
 
        document.getElementById('textbox').style.visibility = "hidden";  
		document.getElementById('textbox').value ="";
		draw();
    }
}

function labelNode(myNode)
{
	let input = document.getElementById('textbox'); 
 
	input.setAttribute("node", myNode.number);
	input.value = nodes.nodeLink.label;
	input.setAttribute("style", "visibility: visible; top: " +  
	(myNode.location.y + screenCentreY + 30 ).toFixed(0) + "px; left: " +
	(myNode.location.x + screenCentreX + 30).toFixed(0) + "px;"	);
	console.log("FOCUS");
	document.getElementById('textbox').focus();
}

function clickChildNode(event)

// click & Q = label a node
// 		& d = delete a node
//		& commmand  - joins with another click of a node
// 		& shift - expands
{
	let rect = canvas.getBoundingClientRect();
	let csrx = event.clientX - rect.left;
	let csry = event.clientY - rect.top;

	console.log(csrx + " " + csry);
	stop();  // the animation
  	myNode = findNode(csrx, csry); // now is the individual object itself rather than the index to the position in the nodes array

	if(myNode == "-1")
	{
		console.log("Node not found!");
		return;
	}	
	
	console.log("Node is: " + myNode.number);

	if(labelling)
	{
		labelNode(myNode);
		labelling = false;
		return;
	}

	if(deleting)
	{
		deleteNode(myNode);
		deleting = false;
		console.log(deleting);
		return;
	}

	if(joining)
	{
		joiningList.push(myNode.number); 
		nodes[myNode.number].color = "green";
		if(joiningList.length==2)    
		{
			if(!searchDeleteEdges(joiningList[0], joiningList[1]))	// if edge already exists - delete it
				connectTheNodes(joiningList[0], joiningList[1]);	// otherwise create it
	
			joiningList =[];
			loopAnimate();
		}		 
		return;
	}		

	if(event.shiftKey) // manually
	{		 
		//createChildNode(myNode.number, "");
		nodes[myNode.number].springLength *=2;
		
		fetchContent(myNode.number, nodes[myNode.number].nodeLink.url)			// needs a new link temporary array to find unqiue links

		iter=0;
		return;
	}	

	else 
	{
		
		movingNode = myNode;
	}
		
}	

function findNode(csrx, csry)
{
	let nodeScreenPosition, clickPosition = new Point(csrx, csry), sx, sy;
	 
	for(let node of nodes)
	{
		if(node.hidden=="false")
			continue;
		sx = node.location.x * scaling + screenCentreX;			// position of node on the screen
		sy = node.location.y * scaling + screenCentreY;
		nodeScreenPosition = new Point(sx, sy);
										 
		if(distance(nodeScreenPosition, clickPosition) <= dotSize)
			return node; 
	} 
	
	return -1;   // cant be found
}

function moveNode(event)
{ 
	if(movingNode)
	{ 	
		let csrx = event.pageX, csry = event.pageY;
		let sx = (csrx - screenCentreX) / scaling ;
		let sy = (csry - screenCentreY) / scaling;

		movingNode.location.changeLocation(sx, sy);

		reposition();
		draw();
		 if(movingNode.number>0)
			drawPath(movingNode, movingNode.nodeLink.path, "black", "beige",  edges[movingNode.number-1].source );
	}
}

function stopMovingNode(event)
{
	movingNode = 0;
	iter = 0;
	loopAnimate();
}
 
function rectangle(ctx, x, y, x1, y1, color)
{
	ctx.fillStyle= color; 
	ctx.fillRect(x,y,x1,y1);
	/*
	ctx.beginPath();
	ctx.rect(x,y,x1,y1);	
	
	ctx.fill();
	ctx.stroke();*/

}

function dot(ctx, x, y, color, size) 
{
	 
	ctx.beginPath();
	ctx.arc(x, y, size, 0, Math.PI*2);
	ctx.fillStyle = color; 
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'white';
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawLine(ctx, x, y, x1, y1, color, thickness)
{
	ctx.lineWidth = thickness;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x1,y1);
	ctx.closePath();
	ctx.stroke();
}

function draw() 
{ 
	var text, maxText = 16, source = 0, size;
	var foreground = "black", background = "white";
	//canvas = document.getElementById("canvas");
	let sx, sy, s, t, tx, ty, metrics;
	if (canvas.getContext) 
	{
		let ctx = canvas.getContext("2d");

		//dot(canvas.getContext("2d"), screenCentreX, screenCentreY, "yellow");

		ctx.font = "12px Arial";
  		ctx.clearRect(0, 0, width, height);

		for(let n=0; n < edges.length; n++)
		{
			s = edges[n].source, t = edges[n].target;
			sx = (nodes[s].location.x) * scaling + screenCentreX;
			sy = (nodes[s].location.y) * scaling + screenCentreY;

			tx = (nodes[t].location.x) * scaling + screenCentreX;
			ty = (nodes[t].location.y) * scaling + screenCentreY;
			 
			drawLine(ctx, sx, sy, tx, ty, "grey", 3);
		}

		for(let node of nodes)
		{
			if(node.visibility == "false")
				continue;
			sx = (node.location.x) * scaling + screenCentreX;
			sy = (node.location.y) * scaling + screenCentreY;

			if(node.totalPageLinks  < 10) 
				size = 8;
			if(node.totalPageLinks> 9 )
				size = 12;
			if(node.totalPageLinks> 99 )
				size = 16;	
			if(node.totalPageLinks> 999 )
				size = 20;	
	 
			dot(ctx, sx, sy, node.color, size);
			
			text = node.nodeLink.path;

			if(text)
			{
				if(text.length>maxText)
					text = text.substr(-maxText	);	
				if(node.number > 0)
					source = edges[node.number-1].source;
				drawPath(node, text, foreground, background, source);
		
			}
			if(node.totalPageLinks>0)
				drawTotalLinks(ctx, sx, sy, node);	
 
		}
	}
}

function drawTotalLinks(ctx, sx, sy, node)
{
	var offset;
	if(node.totalPageLinks  < 10) 
		offset = 4;
	if(node.totalPageLinks> 9 )
		offset = 6;
	if(node.totalPageLinks> 99 )
		offset = 10;	
	if(node.totalPageLinks> 999 )
		offset = 16;	
	sx = (node.location.x) * scaling + screenCentreX;
	sy = (node.location.y) * scaling + screenCentreY;
	ctx.fillStyle = "white";
	//ctx.font = "8px Arial";
	var text = node.totalPageLinks.toString();
	ctx.fillText(text, sx-offset , sy+4 );
} 

function drawPath(node, text, foreground, background, sourceNode)
{
	let ctx = canvas.getContext("2d");
	let right = true;
	sx = (node.location.x) * scaling + screenCentreX;
	sy = (node.location.y) * scaling + screenCentreY;
 	
	if(text)
	{ 
		metrics = ctx.measureText(text);
		ctx.fillStyle = foreground;
		if(node.location.x >= nodes[sourceNode].location.x)
			right = true;
		else
			right = false;	
		
		if(!right )
		{

			rectangle(ctx, sx -metrics.width, sy -10, metrics.width+2  , -14, background );
			ctx.fillStyle = foreground;
			ctx.fillText(text, sx - metrics.width , sy -12 );
		
		}
		else
		{
			
			 rectangle(ctx, sx , sy -10, metrics.width+2  , -14 , background );
			 ctx.fillStyle = foreground;
			ctx.fillText(text, sx , sy -12 );
		}
	
	}

}

function addCollapsibles()
{
    for (let i = 0; i < coll.length; i++) 
    {
        coll[i].addEventListener("click", function  () 
        {    
            this.classList.toggle("active");
            let content = this.nextElementSibling;

            if (content.style.display === "block") 
                content.style.display = "none";
            else 
                content.style.display = "block";
  
        });
    }
} 

function setCanvasDimensions()
{
	canvas = document.getElementById("canvas");
//	width = canvas.getBoundingClientRect().width;
//	height = canvas.getBoundingClientRect().height;
	width = 2050, height = 1250;
 	screenCentreX = width / 2, screenCentreY = height / 2;
	canvas.width = width;
	canvas.height = height;	
	canvas.style.width = width;
	canvas.style.height = height;
}
 
function addInterfaceListeners()
{
	canvas.addEventListener("mousedown", clickChildNode, false);
	canvas.addEventListener("mousemove", moveNode, false);
	canvas.addEventListener("mouseup", stopMovingNode, false);
	window.addEventListener("keydown", keyDown, false);
	window.addEventListener("keyup", keyUp, false);
	window.addEventListener('resize', function(event) {
		setCanvasDimensions();
		console.log(width +  ' ' + height);
	}, true);
}