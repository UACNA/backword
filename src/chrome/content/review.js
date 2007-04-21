var backword = new BW_Layout();
backword._api = new BW_LocalAPI('backword/');

function doLoad(){
	var panel = document.getElementById('panel');
	var html = "";
	var words = backword._api._words;
	for (var i=0; i<words.length; i++){
		html += formatWord(words[i]);
	}
	panel.innerHTML = html;
}

function formatWord(word){
	var html = '<div id="word-'+word.id+'" class="word"><span class="wordid">'+
		word.id+'</span><span class="wordparaphrase">'+word.paraphrase+'<span>';
	for (var i=0; i<word.quotes.length; i++){
		html += formatQuote(word.quotes[i]);
	}
	html+='</div>';
	return html;
}

function formatQuote(quote){
	var html = '<div id="quote-'+quote.id+'" class="quote"><a href="'+quote.url+'" class="quoteurl"><span class="quotetitle">'+
		quote.title+'</span></a><span class="quoteparagraph">'+quote.paragraph+'<span></div>';
	return html;
}


