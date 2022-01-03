var nodes = [], edges = [], iter = 0;

var replusion = {},  attraction = {}, spring = {}; 
var stopAnimation, textbox;

var MaxIterations = 750;
var displayRate = 25;

function main()
{
	 init();
	 loopAnimate();
}

function loopAnimate()
{
 	if(iter > MaxIterations)
 		return;
  	
  	iter++;
	if(iter % displayRate == 0)
 	draw();
	reposition();
	stopAnimation = requestAnimationFrame(loopAnimate);
}

function init()
{
	setCanvasDimensions();
  	addCollapsibles();
	//textbox = document.getElementById("textbox"); textbox.addEventListener("keydown", enterText, false);
	addInterfaceListeners();

	urlSearchParams = new URLSearchParams(window.location.search);
    params = Object.fromEntries(urlSearchParams.entries());
	// no params for now.
    if(params['url'])
    {
        fetchContent(0, params['url']); 
    }
}

replusion.alter = function(element)
{
	repulsion_constant = element.value;
	console.log("repel: "+repulsion_constant);
};
	
spring.alter = function(element)
{
	springLength = element.value;
	console.log("spring: "+springLength);
};

attraction.alter = function(element)
{
	attraction_constant = element.value;
	console.log("attrac: "+attraction_constant); 
};
