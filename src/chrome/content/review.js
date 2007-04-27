var backword = new BW_Layout();
backword._api = new BW_LocalAPI('backword/');

function doLoad(){
	var panel = document.getElementById('panel');
	var html = "";
	var words = backword._api._words;
	for (var i=words.length-1; i>=0; i--){
		html += formatWord(words[i]);
	}
	panel.innerHTML = html;
}

function formatWord(word){
	var re;
	if (/f$/.test(word.id)){
		re = "("+word.id.replace(/f$/, "") + "[fv](s|es|ies|d|ed|ied|ing){0,2})";
	}
	else{
		if (/[^aieouy]$/.test(word.id)) {
			re = "("+word.id + "{1,2}(s|es|ies|d|ed|ied|ing){0,2})";
		} else {
			if (/[ey]$/.test(word.id)) {
				re = "("+word.id + "?(s|es|ies|d|ed|ied|ing){0,2})";
			} else {
				re = "("+word.id + "(s|es|ies|d|ed|ied|ing){0,2})";
			}
		}
	}
	var Reg = new RegExp(re, "gi");

	var html = '<div id="word-'+word.id+'" class="word"><span class="wordid">'+
		word.id+'</span><span class="wordparaphrase">'+word.paraphrase+'<span>';
	for (var i=0; i<word.quotes.length; i++){
		html += formatQuote(word.quotes[i], Reg);
	}
	html+='</div>';
	return html;
}

function formatQuote(quote, Reg){
	var html = '<div id="quote-'+quote.id+'" class="quote">&raquo;<a href="'+quote.url+'" class="quoteurl"><span class="quotetitle">'+
		quote.title+'</span></a><div class="quoteparagraph">'+quote.paragraph.replace(Reg, "<u>$1</u>")+'</div></div>';
	return html;
}

