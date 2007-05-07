var backword = new BW_Layout(false);
var api = new BW_LocalAPI('backword/');
api.observe = function(aSubject, aTopic, aData){
	if (aTopic == "bw_load_storage" && aSubject != this){
		location.reload();
	}
};
var words = api._words;

function BW_ReviewPage(dict){
	this.dictionary = null;
	this.currentTranslator = "";
	this.backword = backword;
}

BW_ReviewPage.prototype.observe = function(aSubject, aTopic, aData){
	if (aTopic == "bw_dictionary_changed"){
		this.setDictionary(aData);
	}
};

BW_ReviewPage.prototype.QueryInterface = function(aIID){
  if (!aIID.equals(Components.interfaces.nsIObserver) &&
      !aIID.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
};

BW_ReviewPage.prototype.setDictionary = function(translator){
	if (this.currentTranslator != translator) {
		this.currentTranslator = translator;
		if (translator.substr(0, 6) == "google") {
			this.dictionary = new BW_GoogleTranslate(translator.substr(7));
		} else {
			this.dictionary = new BW_DictcnTranslate(translator == "dictcn.tw");
		}
	}
}

var page = new BW_ReviewPage();

function doLoad(){
	var panel = $('panel');
	var html = "";
	buildMatchPattern();
	for (var i=words.length-1; i>=0; i--){
		html += formatWord(words[i]);
	}
	panel.innerHTML = html;
	attachEvent();
	registerObserve();
	var s = document.createElement('span')
	s.id = 'backwordreviewpage';
	document.body.appendChild(s);
}

function registerObserve(){
	var observerService = Components.
	  classes["@mozilla.org/observer-service;1"].
	  getService(Components.interfaces.nsIObserverService);
	observerService.addObserver(page, "bw_dictionary_changed", false);	
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).notifyObservers(window, 'bw_review_page_opened', '');
}

function buildMatchPattern(){
	for (var i=words.length-1; i>=0; i--){
		var word = words[i];
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
		word.regHighLight = new RegExp(re, "gi");
		word.regLink = new RegExp("([^a-z])"+re+"(?!<\\/span>|[a-z])", "gi");
	}
}

function formatWord(word){
	var html = '<a name="word-'+word.id+'"><div id="word-'+word.id+'" class="word twocolumn"><div class="innerword"><img src="chrome://backword/skin/backWordED.gif" class="delete" id="todelete-word-'+word.id
	+'"/><img src="chrome://backword/skin/backWordOK.gif" class="delete" style="display:none;" id="delete-word-'+word.id+'"/><span class="wordid" id="'+word.id+'">'+
		word.id+'</span><span class="wordparaphrase" id="paraphrase-'+word.id+'">'+word.paraphrase+'</span><span class="wordparaphrase" id="translation-'+word.id+'"></span>';
	for (var i=0; i<word.quotes.length; i++){
		html += formatQuote(word.quotes[i], word);
	}
	html+='</div></div></a>';
	return html;
}

function formatQuote(quote, word){
	var html = '<div id="quote-'+quote.id+'" class="quote"><img src="chrome://backword/skin/backWordED.gif" class="delete" id="todelete-quote-'+word.id+'-'+quote.id
	+'"/><img src="chrome://backword/skin/backWordOK.gif" class="delete" style="display:none;" id="delete-quote-'+word.id+'-'+quote.id+'"/>&raquo;<a href="'+quote.url+'" class="quoteurl"><span class="quotetitle">'+
		quote.title+'</span></a><div class="quoteparagraph">'+formatQuoteParagraph(quote,word)+'</div></div>';
	return html;
}

function formatQuoteParagraph(quote, word){
    var html = quote.paragraph.replace(word.regHighLight,  "<span class='theword'>$1</span>");
	for (var i=words.length-1; i>=0; i--){
		html = html.replace(words[i].regLink, "$1<a href='#word-"+words[i].id+"' class='innerlink'>$2</a>");
	}
	return html;
}

function attachEvent(){
    attachParaphrase();
    attachDeleteButton();
    attachButtons();
}
function attachButtons(){
	$('HideTrans').onclick = function(){
		for (var i=words.length-1; i>=0; i--){
		    $('translation-'+words[i].id).innerHTML = "";
		}
	}
	$('ShowTrans').onclick = function(){
		for (var i=words.length-1; i>=0; i--){
		    $('translation-'+words[i].id).innerHTML = "|" + page.dictionary.getTranslate(words[i].id);
		}
	}
	$('OneColumn').onclick = function(){
		for (var i=words.length-1; i>=0; i--){
		    $('word-'+words[i].id).className = "word onecolumn";
		}
	}
	$('TwoColumn').onclick = function(){
		for (var i=words.length-1; i>=0; i--){
		    $('word-'+words[i].id).className = "word twocolumn";
		}
	}
	$('ThreeColumn').onclick = function(){
		for (var i=words.length-1; i>=0; i--){
		    $('word-'+words[i].id).className = "word threecolumn";
		}
	}
}

function attachParaphrase(){
	for (var i=words.length-1; i>=0; i--){
	    var el = $(words[i].id);
	    el.onmouseover = function(){
		    $('translation-'+this.id).innerHTML = "|" + page.dictionary.getTranslate(this.id);
	    }
	    el.onmouseout = function(){
		    $('translation-'+this.id).innerHTML = "";
	    }
	}
}

function attachDeleteButton(){
	imgs = document.getElementsByTagName("img");
	for(var index=0; index<imgs.length; index++) {
		var img = imgs[index];
		if (img.id.indexOf('todelete') == 0){
			img.onmouseover = function(){
				this.src="chrome://backword/skin/backWordE.gif";
			}
			img.onmouseout = function(){
				if ($(this.id.substr(2)).style.display == "none")
					this.src="chrome://backword/skin/backWordED.gif";
			}
			img.onclick = function(){
				var r = $(this.id.substr(2));
				r.style.display = (r.style.display == "")?"none":"";
			}
		}
		else if(img.id.indexOf('delete') ==  0){
			img.onclick = function(){
				if (this.id.substr(7, 4) == "word"){
					api.deleteWord(this.id.substr(12));
				}
				else{
					var id = this.id.substr(13);
					var i = id.indexOf('-');
					api.deleteQuote(id.substring(0, i), id.substring(i+1, id.length), false);
				}
			}
		}
	}
}

function $(id){
	return document.getElementById(id);
}


