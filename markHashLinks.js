
/* mark link, todo: loop nav elements, for now it only works with one nav */
var links = null;
var getLinks = function(){
	if (links) return links;
	var els = document.querySelectorAll('a[href]');
	links = [];
	for (var i=0,el; el=els[i++];) {
		var matches = el.href.match(/#(.*)/);
		if (!matches) continue;
		var id = matches[1];
		if (!id) continue;
		var target = document.getElementById(id);
		if (!target) continue;
		links.push({
			a:el,
			target:target,
			id:id,
		});
	}
	setTimeout(function(){ links = null; },1000);
	return links;
};
var listen = function(e){
	var links = getLinks(), winner, i=0, link;
	while (link=links[i++]) {
		var pos = link.target.getBoundingClientRect();
		if (pos.top > 140) break; // first target below viewport
		winner = link;
	}
	winner && markLinksActivated(winner.id);
};

c1.dom.ready.then(listen);
addEventListener('scroll',listen);
addEventListener('resize',listen);

var latestWinner;
function markLinksActivated(id){
	if (latestWinner === id) return;
	latestWinner = id;
	var actives = document.querySelectorAll('.hashLinkActive');
	for (var i=0,item; item=actives[i++];) item.classList.remove('hashLinkActive');
	var links = getLinks();
	for (i=0; item=links[i++];) {
		item.id === id && item.a.classList.add('hashLinkActive');
	}
}

addEventListener('pushstate',function(e){
	markLinksActivated(location.hash)
});
addEventListener('cms.navigator-navigated',function(e){ // todo: make onpopstate-polyfill
	markLinksActivated(location.hash)
});
