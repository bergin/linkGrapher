 // to be filled with NodeLink objects
var linkColons = ["tel:", "fax:", "sms:", "mailto:", "javascript", "ts3server:", 
"wtai:", "market:", "geopoint:", "im:", " msnim:", "ymsgr:", "gtalk:", "sip:", "whatsapp:"];

function onlyUnique(value, index, self) 
{
    return self.indexOf(value) === index;
}

function findPageInfo(html, address)
{ 
    var theLinks = [], tempLinks =[];
    let parser = new DOMParser();
	const url = new URL(address);
 	let hostDomain = "https://" + url.hostname ;
    let linkText="", isThere = false;

    // parse the html
    try
    {
        var xmlDoc = parser.parseFromString(html,"text/html");
    }
    catch (error)
    {
        console.log("no html!");
        return "no html!"
    }

    // remove scripts & style from contents
    let scripts = [...xmlDoc.getElementsByTagName('script'), ...xmlDoc.getElementsByTagName('style'), ...xmlDoc.getElementsByTagName('noscript')];
    scripts.forEach(stuff => stuff.remove());

    // acquire links, title, meta info & the body content
    var links = [...xmlDoc.getElementsByTagName("a")];
    var theTitle = [...xmlDoc.getElementsByTagName("title")];
    var pageTitle = theTitle[0].innerHTML;

    allOfIt = xmlDoc.body.innerHTML;

    if(!pageTitle)
        pageTitle = "(no title given)";
    //console.log(metaDescription); 

    theLinks = acquireLinks(links, hostDomain);     // an [] of unique nodeLinks   for the site. 

    for(let link of theLinks)
       linkText += link.href;    

    document.getElementById("links").innerHTML = "Links: " + theLinks.length;       
    document.getElementById("pagelinks").innerHTML = linkText;  
    document.getElementById("title").innerHTML = pageTitle; 
    //document.getElementById("content").innerHTML = allOfIt  ; 

    for (let link of theLinks) 	
    {
        isThere = false;
 
        for(let temp of tempLinks)
        {
            if(link.path === temp.path)
            {
                isThere = true;
                break;
            }
        }
            
        if(!isThere)
            tempLinks.push(link);
    }		

    theLinks = tempLinks;
 
    return theLinks;
    //document.getElementById("contentLegend").innerHTML   = "Words: " +  allOfIt.match('/(\w+)/g').length;
}

// greater sophiscation now: returns pathname, url & href link via new "NodeLink" class
// however, support for relative links is still rudimentary
function acquireLinks(links, hostDomain)
{
    let linkCollection = [], myLinks = []; 
    let uniqueLinks, linkColonFound;
    let browserTool  = "http://localhost/linkGraph/linkGraph.html?url=";
    let href, fullURL;

    for (let link of links) { 
        if(typeof link.attributes.href !== "undefined")
            myLinks.push( link.attributes.href.textContent);
    }

    uniqueLinks = myLinks.filter(onlyUnique).sort(); // see call back function - onlyUnique
  




    for (let unique of uniqueLinks) 
    {
        linkColonFound = false;
        for (let colon of linkColons) 
            if(unique.substr(0, colon.length) == colon)
            {
                linkColonFound = true;
                break;
            }
                
        if(linkColonFound)
            continue;

        if(unique.charAt(0) == "#")
            continue;       // ignore anchors

        if(unique.substr( 0, 4) == "http")
        {  
            href =  "<li><a href='" + browserTool + unique + "'>" + unique + "</a></li>"
            linkCollection.push(new NodeLink((new URL(unique)).pathname, unique, href)); 
            continue;
        }    

        if(unique.charAt(0) == "/" && unique.charAt(1) == "/")
        {
            href = "<li><a href='" + browserTool + 'https:' + unique + "'>" + unique + "</a></li>";
            fullURL = 'https:' + unique;
            linkCollection.push(new NodeLink((new URL(fullURL)).pathname, fullURL, href)); 
            continue;
        }
            
        if(unique.charAt(0) == "/")
        {
            href = "<li><a href='" + browserTool + hostDomain + unique + "'>" + unique+ "</a></li>";
            fullURL = hostDomain + unique;
            linkCollection.push(new NodeLink((new URL(fullURL)).pathname, fullURL, href));
        }
            
        else
        {
            href = "<li><a href='" + browserTool + hostDomain + "/" + unique+ "'>" + unique + "</a></li>"
            fullURL = hostDomain + "/" + unique;
            linkCollection.push(new NodeLink((new URL(fullURL)).pathname, fullURL, href));
            // this wont work for folders and link with no / at front, alas.
        }            
    }

    return linkCollection;
}

