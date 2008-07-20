var backword = new BW_Layout(false);
var api = new BW_LocalStorage();
var words=[];
api.observe = function(aSubject, aTopic, aData){
	if (aTopic == "bw_load_storage"){
		this.toReload = true;
	}
};
api.toReload = false;
var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
observerService.addObserver(api, "bw_load_storage", false);

var currentPage = 0;
var perPage = 10;
var listModel = "twocolumn";

function checkReload(){
	setTimeout(function(){checkReload()}, 1000, false);
	if (api.toReload){
		api.toReload = false;
		buildMatchPattern();
		showWords(currentPage);
	}
}

function pronuonce(word) {
	var pronunciationUrl = "http://www.dreye.com.cn/dict/audio/"+word.substr(0,1).toUpperCase()+"/"+word+".mp3";
	if (navigator.userAgent.toLowerCase().indexOf("windows")!=-1)
		$('pronunciation').innerHTML = "<embed id=\"mplay\" type=\"application/x-mplayer2\" src=\""+pronunciationUrl+"\" width=1 height=1 autostart=true loop=false volume=0></embed>";
	else
		$('pronunciation').innerHTML = "<embed id=\"mplay\" type=\"audio/mpeg\" src=\""+pronunciationUrl+"\" width=0 height=0 autostart=true loop=false volume=0></embed>";
}

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
		} else if (translator == "outlook"){
			this.dictionary = new BW_OutLookTranslate();
		} else {
			this.dictionary = new BW_DictcnTranslate(translator == "dictcn.tw");
		}
	}
}

var reviewPage = new BW_ReviewPage();

function doLoad(){
	buildMatchPattern();
    attachButtons();
	registerObserve();
	declarePageType();
	showWords();
	checkReload();
}

function showWords(page){
	words = api._localStorage.getWords({});
	if (typeof(page) == "undefined"){
		page = 0;
	}
	if (page < 0){
		page = 0
	}
	var total = Math.ceil(words.length/perPage);
	if (total > 0 && page > total-1){
		page = total-1;
	}
	currentPage = page;
	var panel = $('panel');
	var html = "";
	for (var i=words.length-1-page*perPage, j=0; i>=0&&j<perPage; i--, j++){
		html += formatWord(words[i]);
	}
	if (html.length == 0){
		html = "<div class='innerword' align=center><h3>How to use Backword</h3><p>Interface & Operations:<br/>" +
				"<a href='http://www.flickr.com/photos/gneheix/158641849/'>" +
				"http://www.flickr.com/photos/gneheix/158641849/</a>" +
				" (major layout)<br/><a href='http://www.flickr.com/photos/gneheix/194794084/'>" +
				"http://www.flickr.com/photos/gneheix/194794084/</a> (new features)<br/></p>" +
				"<p>Function Flash demo :<br/><a href='http://gneheix.googlepages.com/backwordflashdemo'>" +
				"http://gneheix.googlepages.com/backwordflashdemo</a> (中文版)<br/>" +
				"<a href='http://gneheix.googlepages.com/backwordflashdemo2'>" +
				"http://gneheix.googlepages.com/backwordflashdemo2</a> (in English)<br/>" +
				"</p>Operation Flash demo :<br/><a href='http://gneheix.googlepages.com/backwordflashdemo3'>" +
				"http://gneheix.googlepages.com/backwordflashdemo3</a> (中文版)<br/>" +
				"<a href='http://gneheix.googlepages.com/backwordflashdemo22'>" +
				"http://gneheix.googlepages.com/backwordflashdemo22</a> (in English)<br/></p></div>";
		document.getElementById('buttons').style.display='none';
	}
	panel.innerHTML = html;
    attachParaphrase(page);
    attachDeleteButton();
    showNavigator(page);
}

function showNavigator(page){
	var total = Math.ceil(words.length/perPage);
	if (total > 1){
		var html = "";
		if (currentPage > 0){
			html += "<a href='javascript:showWords("+(currentPage-1)+");'>&lt;Prev</a> ";
		}
		for (var i=1; i<=total; i++){
			if (currentPage == i -1){
				html += i+" ";	
			}
			else{
				html += "<a href='javascript:showWords("+(i-1)+");'>"+i+"</a> ";
			}
		}		
		if (currentPage < total - 1){
			html += "<a href='javascript:showWords("+(currentPage+1)+");'>Next&gt;</a>";
		}
		$('navigator').innerHTML=html;
		$('navigator').style.display = "";
	}
	else{
		$('navigator').style.display = "none";
	}
}

function declarePageType(){
	if (!document.getElementById('backwordreviewpage')){
		var s = document.createElement('span')
		s.id = 'backwordreviewpage';
		document.body.appendChild(s);
	}
}

function registerObserve(){
	var observerService = Components.
	  classes["@mozilla.org/observer-service;1"].
	  getService(Components.interfaces.nsIObserverService);
	observerService.addObserver(reviewPage, "bw_dictionary_changed", false);	
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).notifyObservers(window, 'bw_review_page_opened', '');
}
var regHighLights = {};
var regLinks = {};
function buildMatchPattern(){
	for (var i=words.length-1; i>=0; i--){
		var word = words[i];
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
		regHighLights[word.id] = new RegExp(re, "gi");
		regLinks[word.id] = new RegExp("([^a-z])"+re+"(?!<\\/span>|[a-z])", "gi");
	}
}

function formatWord(word){
	var html = '<a name="word-'+word.id+'"><div id="word-'+word.id+'" class="word '+listModel+'"><div class="innerword"><img src="chrome://backword/skin/backWordED.gif" class="delete" id="todelete-word-'+word.id
	+'"/><img src="chrome://backword/skin/backWordOK.gif" class="delete" style="display:none;" id="delete-word-'+word.id+'"/><span class="wordid" id="'+word.id+'">'+
		word.id+'</span><span class="wordparaphrase" id="paraphrase-'+word.id+'">'+word.paraphrase+'</span><span class="wordparaphrase" id="translation-'+word.id+'"></span>';
	for (var i=0; i<word.getQuotes({}).length; i++){
		html += formatQuote(word.getQuotes({})[i], word);
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
    var html = quote.paragraph.replace(regHighLights[word.id],  "<span class='theword'>$1</span>");
	for (var i=words.length-1; i>=0; i--){
		html = html.replace(regLinks[words[i].id], "$1<a href='javascript:displayWord(\""+words[i].id+"\","+(Math.ceil((words.length-i)/perPage)-1)+");' class='innerlink'>$2</a>");
	}
	return html;
}
function displayWord(word, page){
	if (page != currentPage){
		showWords(page);
	}
	$('word-'+word).scrollIntoView(true);
	$('word-'+word).firstChild.className = "innerWord hightlighted";
	setTimeout(function(){$('word-'+word).firstChild.className = "innerWord";}, 5000, false);
}
function attachButtons(){
	$('HideTrans').onclick = function(){
		for (i=words.length-1-currentPage*perPage, j=0; i>=0&&j<perPage; i--, j++){
		    $('translation-'+words[i].id).innerHTML = "";
		}
	}
	$('ShowTrans').onclick = function(){
		for (i=words.length-1-currentPage*perPage, j=0; i>=0&&j<perPage; i--, j++){
		    $('translation-'+words[i].id).innerHTML = "|" + reviewPage.dictionary.getTranslate(words[i].id);
		}
	}
	$('OneColumn').onclick = function(){
		for (i=words.length-1-currentPage*perPage, j=0; i>=0&&j<perPage; i--, j++){
		    $('word-'+words[i].id).className = "word onecolumn";
		}
	    listModel = "onecolumn";
	}
	$('TwoColumn').onclick = function(){
		for (i=words.length-1-currentPage*perPage, j=0; i>=0&&j<perPage; i--, j++){
		    $('word-'+words[i].id).className = "word twocolumn";
		}
	    listModel = "twocolumn";
	}
	$('ThreeColumn').onclick = function(){
		for (i=words.length-1-currentPage*perPage, j=0; i>=0&&j<perPage; i--, j++){
		    $('word-'+words[i].id).className = "word threecolumn";
		}
	    listModel = "threecolumn";
	}
	$('Ten').onclick = function(){
		perPage = 10;
		showWords();
	}
	$('TwentyFive').onclick = function(){
		perPage = 25;
		showWords();
	}
	$('Fifty').onclick = function(){
		perPage = 50;
		showWords();
	}
	$('Hundred').onclick = function(){
		perPage = 100;
		showWords();
	}
}

function attachParaphrase(page){
	for (var i=words.length-1-page*perPage, j=0; i>=0&&j<perPage; i--, j++){
	    var el = $(words[i].id);
	    el.onmouseover = function(){
		    $('translation-'+this.id).innerHTML = "|" + reviewPage.dictionary.getTranslate(this.id);
	    }
	    el.onmouseout = function(){
		    $('translation-'+this.id).innerHTML = "";
	    }
	    el.onclick = function(){
	    	pronuonce(this.id);
	    }
	}
}

function attachDeleteButton(){
	var imgs = document.getElementsByTagName("img");
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
				showWords(currentPage);
			}
		}
	}
}

function $(id){
	return document.getElementById(id);
}


