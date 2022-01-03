var urlSearchParams, params, inputAddress;
var siteLinks = [];

function d(query)
{
	console.log(query);
}

function getAddressContentFromForm(event)
{
    event.preventDefault();
    inputAddress = document.getElementById("address").value;
    fetchContent(0, inputAddress); // alters divs 
	loopAnimate();
}


async function fetchContent(nodeNumber, inputAddress)
{
	var nodeLinks =[], theLinks =[], totalPageLinks = 0;
    try {
       //const address = "https://glacial-forest-71083.herokuapp.com/"+inputAddress;
	   const address = "http://localhost/PYScripts/getHTML.py?url=" + inputAddress;
 
        (async () => {

        let res = await fetch(address);
        
        if(res.status=='404')
        { 
            console.log("404");
            return "404"
        }
		
		data = await res.text();
					
		if(data)
		{	
			var isThere=false;
																// the Links & a nodeLinks
			theLinks = findPageInfo(data, inputAddress);		// creates an [] of nodeLinks (path, link, li href)
		 
			if(siteLinks.length==0)
			{
				siteLinks = theLinks;
				nodeLinks = theLinks;
				totalPageLinks = nodeLinks.length;
			}
			
			else			// search for preexisting links. nodeLinks should only be new ones
			{
				for (let link of theLinks) 	
				{
					isThere = false;
		 
					for(let siteLink of siteLinks)
					{
						if(link.path === siteLink.path)
						{
							isThere = true;
							break;
						}
					}
						
					if(!isThere)
						nodeLinks.push(link);
				}		

				totalPageLinks = nodeLinks.length;

				// add to only new nodelinks to the sitelinks
				siteLinks = siteLinks.concat(nodeLinks); 
			}

			d (totalPageLinks);
	
			// trim down the connections i.e. only show first 20
			if(nodeLinks.length>20) 
				nodeLinks = nodeLinks.slice(0, 20);

			// create child nodes  
			if(nodes.length==0)
				createStartNode(inputAddress);

			for(let link of nodeLinks)   // create a child node for each link in theLinks  -- do nodeLinks instead of theLinks
				createChildNode(nodeNumber, link); 		// node contains a NodeLink object

			// update nodes link number
			nodes[nodeNumber].totalPageLinks = totalPageLinks;	
}
        })();

    } catch (error) {
        console.log('Error:' + error);
    }
}

async function uploadNodesEdges(json)
{
	var file = new File([json], "foo.txt", {
		type: "text/plain",
	  });

    var data = new FormData(); 
    data.append('file', file, "json.txt");

    fetch('upload.php', {
    method: 'POST',
    body: data
    })  
}

function saveNetwork()
{
	let jsonNodes = JSON.stringify(nodes);
	let jsonEdges = JSON.stringify(edges);
	var myjson = '{"nodes":' + jsonNodes + ', "edges":'+ jsonEdges +'}';
	let myObject = JSON.stringify(myjson);
	uploadNodesEdges(myObject);
	console.log(nodes.length + " nodes & " + edges.length + " edges saved.");
}

async function loadNetwork()
{
    const response = await fetch('dump/json.txt');

    var data = await response.json(); 
    if (response) 
    { 
        let str = JSON.parse(data);
        populateNodeEdgeArray(str) 
    } 
}

function populateNodeEdgeArray(json)
{
	nodes = [], edges = [];
 
	let edge, node;
	for (let i = 0; i < json.nodes.length; i++)
	{
		node = json.nodes[i];  
		nodes.push(new Node(node.number, new Point (node.location.x, node.location.y), 
			new Vector(node.velocity.i, node.velocity.j), node.label, node.visibility ));
	}

	for (let i = 0; i < json.edges.length; i++)
	{
		edge = json.edges[i]; 
		edges.push(new Edge(edge.source, edge.target));
	}

	console.log(nodes.length + " nodes & " + edges.length + " edges loaded.");
}

