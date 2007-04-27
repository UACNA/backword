var backword = new BW_Layout();
backword._api = new BW_LocalAPI('backword/');

function doLoad(){
	var panel = document.getElementById('panel');
	var html = "";
	var words = backword._api._words;
	for (var i=words.length-1; i>=0; i--){
		html += formatWord(words[i]);
	}
	for (var i=words.length-1; i>=0; i--){
		var re = new RegExp("(>[^<]*[^A-Za-z])"+words[i].re.replace(/\?/,"")+"(?!(<\\/span>|[A-Za-z]))", "gi");
		html = html.replace(re, "$1<a href='#word-"+words[i].id+"' class='innerlink'>$2</a>");
	}
	panel.innerHTML = html;
}

function getReForWord(word){
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
	word.re = re;
	return re;
}

function formatWord(word){
	var Reg = new RegExp(getReForWord(word), "gi");
	var html = '<a name="word-'+word.id+'"/><div id="word-'+word.id+'" class="word"><span class="wordid">'+
		word.id+'</span><span class="wordparaphrase">'+word.paraphrase+'<span>';
	for (var i=0; i<word.quotes.length; i++){
		html += formatQuote(word.quotes[i], Reg);
	}
	html+='</div>';
	return html;
}

function formatQuote(quote, Reg){
	var html = '<div id="quote-'+quote.id+'" class="quote">&raquo;<a href="'+quote.url+'" class="quoteurl"><span class="quotetitle">'+
		quote.title+'</span></a><div class="quoteparagraph">'+quote.paragraph.replace(Reg, "<span class='theword'>$1</span>")+'</div></div>';
	return html;
}

