/* ===================================================================
// Author: gneheix<gneheix@gmail.com>
// WWW: http://www.gneheix.com
//
// NOTICE: All code, without some unautherized portions, 
// unless otherwise posted is licensed under the GPL.
// ===================================================================*/

/* ***** BEGIN LICENSE BLOCK *****
 * Version: GPL 2.0
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Backword, a Mozilla Firefox Extension.
 * The Initial Developer of the Original Code is Gneheix Il <gneheix@gmail.com>. 
 * Portions created by gneheix are Copyright (C) 2005-2006 gneheix. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL").
 *
 * ***** END LICENSE BLOCK ***** */


////////////////////////////////////////////////////////////////////////////
// start of dump function
// Functions are derived from GPL code originally by mozilla Inc:
// For the original source, see: http://www.koders.com/javascript/fidFEF1093F08C9BDE750ABD0ED1863319D8179449A.aspx
////////////////////////////////////////////////////////////////////////////
//const BW_debugOutput = true;
//const BW_debugOutput = true;
const BW_debugOutput = false;
function BW_ddump(text) {
    if (BW_debugOutput) {
        dump(text + "\n");
    }
}
function BW_ddumpCont(text) {
    if (BW_debugOutput) {
        dump(text);
    }
}
function BW_ddumpObject(obj, name, maxDepth, curDepth) {
    if (!BW_debugOutput) {
        return;
    }
    if (curDepth == undefined) {
        curDepth = 0;
    }
    if (maxDepth != undefined && curDepth > maxDepth) {
        return;
    }
    var i = 0;
    for (prop in obj) {
        i++;
        if (typeof (obj[prop]) == "object") {
            if (obj[prop] && obj[prop].length != undefined) {
                BW_ddump(name + "." + prop + "=[probably array, length " + obj[prop].length + "]");
            } else {
                BW_ddump(name + "." + prop + "=[" + typeof (obj[prop]) + "]");
            }
            BW_ddumpObject(obj[prop], name + "." + prop, maxDepth, curDepth + 1);
        } else {
            if (typeof (obj[prop]) == "function") {
                BW_ddump(name + "." + prop + "=[function]");
            } else {
                BW_ddump(name + "." + prop + "=" + obj[prop]);
            }
        }
    }
    if (!i) {
        BW_ddump(name + " is empty");
    }
}
function BW_dumpError(text) {
    dump(text + "\n");
}

////////////////////////////////////////////////////////////////////////////
// start of HTMLEncode function
// Functions are derived from MPL code originally by performancing Inc:
// For the original source, see: http://sourceforge.net/projects/streetlife
////////////////////////////////////////////////////////////////////////////
function BW_plainText(text_) {
    var text = BW_HTMLEncode(text_);
    text = text.replace(/\n/g, "<BR />");
    return text;
}
function BW_HTMLEncode(text) {
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/'/g, "&#146;");
    return text;
}
function BW_HTMLDecode(text) {
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&quot;/g, "\"");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&#146;/g, "'");
    text = text.replace(/<BR \/>/g, "\n");
    return text;
}
////////////////////////////////////////////////////////////////////////////
// start of own utility function
////////////////////////////////////////////////////////////////////////////
//Return the recent frame document object
function BW_getDoc() {
    return BW_LayoutOverlay._currentDoc;
}
function BW_getPage(){
	return BW_LayoutOverlay._currentWindow;
}
function BW_trim(string){
	return string.replace(/(^\s+)|(\s+$)/g, "");
}
function BW_isAWord(string){
	var i=0;
	for(; i<string.length; i++){
    	if (!BW_isLetter(string.substr(i, 1))) {
    		return false;
    	}
    }
    return true;
}
function BW_isLetter(string){
	var valid_chars = /\w/;
	return valid_chars.test(string);
}
function BW_makeShortString(src, key, len){
	if (src.length <= len)
		return src;
	if (key.length <= 0){
		return src.substr(0, len-3)+"...";
	}
	var cut = src.length - len;
	var keyIndex = src.indexOf(key);
	if (keyIndex > (len-3-key.length)/2){
		if (keyIndex < (len-6-key.length)/2+key.length){
			return "..."+src.substr(src.length-len+3, len-3);
		}
		return "..."+src.substr(keyIndex-(len-6-key.length)/2, len-6)+"...";
	}
	return src.substr(0, len-3)+"...";
}
function BW_getTop(div){
	return parseInt(div.style.top.substr(0, div.style.top.length-2))
}
function BW_getLeft(div){
	return parseInt(div.style.left.substr(0, div.style.left.length-2))
}
function BW_createElement(type, father){
	if (!father)
		father = BW_getDoc();
	var obj = father.createElement(type);
	return BW_setElementStyle(obj);
}
function BW_setElementStyle(obj){
    obj.style.fontSize = (BW_LayoutOverlay._size-4)+"px!important";
    obj.style.fontWeight = "normal!important";
    obj.style.fontStyle = "normal!important";
    obj.style.fontFamily = "verdana,sans-srif";
    obj.style.fontSizeAdjust = "none!important";
    obj.style.fontStretch = "normal!important";
    obj.style.fontVariant = "normal!important";
    obj.style.float = "none!important"; 
    obj.style.overflow = "hidden!important";
    obj.style.margin = "0px 0px 0px 0px!important";
    obj.style.padding = "0px 0px 0px 0px!important";
    obj.style.lineHeight = BW_LayoutOverlay._size+"px!important";
//    obj.style.verticalAlign = "middle!important";
    if (obj.tagName.toUpperCase() != "DIV")
	    obj.style.display = 'inline!important';
	if (obj.tagName.toUpperCase() == "IMG"){
	    obj.style.maxWidth = "15px";
    	obj.style.maxHeigth = "15px";
	}
	return obj;
}
function BW_defaultStyle(){
	var style = "font-size: "+(BW_LayoutOverlay._size-4)+"px!important;";
	style += "font-weight: normal!important;";
	style += "font-style: normal!important;"
	style += "font-family: verdana,sans-serif;";
	style += "font-size-adjust: none;";
	style += "font-variant: normal;";
	style += "font-stretch: normal;";
	style += "overflow: hidden!important;";
	style += "margin: 0px 0px 0px 0px!important;";
	style += "padding: 0px 0px 0px 0px!important;";
	style += "float: none;";
//	style += "vertical-align: middle!important;";
	style += "line-height: "+(BW_LayoutOverlay._size)+"px!important;";
	style += "display:inline!important;";
	return style;
}
////////////////////////////////////////////////////////////////////////////
// start of stemWord function
// Functions are derived from BCPL code originally by Andargor(http://www.andargor.com/):
// For the original source, see: http://www.tartarus.org/martin/PorterStemmer/
////////////////////////////////////////////////////////////////////////////

function BW_stemWord(w) {
	var c = "[^aeiou]";          // consonant
	var v = "[aeiouy]";          // vowel
	var C = c + "[^aeiouy]*";    // consonant sequence
	var V = v + "[aeiou]*";      // vowel sequence
	
	var mgr0 = "^(" + C + ")?" + V + C;               // [C]VC... is m>0
	var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";  // [C]VC[V] is m=1
	var mgr1 = "^(" + C + ")?" + V + C + V + C;       // [C]VCVC... is m>1
	var s_v   = "^(" + C + ")?" + v;                   // vowel in stem

	var stem;
	var suffix;
	var firstch;
	var origword = w;

	if (w.length < 3) { return w; }

   	var re;
   	var re2;
   	var re3;
   	var re4;

	// -s
   	re = /^(.+?)(ss|i|ch|sh|x|o|v)es$/;
   	re2 = /^(.+?)([^s])s$/;

	var plural = false;
   	if (re.test(w)) { w = w.replace(re,"$1$2"); plural=true;}
   	else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); plural=true;}
   	else{
		// -ed & -ing
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re2.test(w)) {	w = w + "e"; }
				else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
				else if (re4.test(w)) { w = w + "e"; }
			}
		}
   	}
   	if (w == origword)
   		return origword;
	// i to y & v to f
	re = /^(.+?)i$/;
	if (re.test(w)) {
		var fp = re.exec(w);
		stem = fp[1];
		w = stem + "y";
	}
	else if (plural){
		//v to f
		re = /^(.+?)v$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			w = stem + "f";
		}
	}
//	BW_ddump("stem word "+origword+":"+w);	
	return w;
}


////////////////////////////////////////////////////////////////////////////
// start of Layout function
////////////////////////////////////////////////////////////////////////////

function BW_Layout() {
    this.resetStatus();
    this.resetData();
    this._dictionary = new BW_GoogleTranslate();
    this._currentTranslator = "";
    this._rangeParent = null;
    this._rangeOffset = 0;
	this._api = null;
    this._cursorX = 0;
    this._cursorY = 0;
    this._divX = 0;
    this._divY = 0;
    this._windowOpened = 0;
    this._listQuotesLimit = 5;
    this._maxMouseOut = 10;
    this._apiCalling = false;
    this._apiError = false;
    this._apiErrorCount = 0;
    this._maxAPIErrorCount = 10;
    this._nameLayout = "BW_LayoutDiv";
    this._nameBackWord = "BW_backWordButton";
    this._nameParaphrase = "BW_paraphraseSpan";
    this._nameTranslate = "BW_translateSpan";
    this._nameQuotesDiv = "BW_showQuotesDiv";
    this._nameQuoteDetailDiv = "BW_showQuoteDetailDiv";
    this._nameOpenPage = "BW_openPageButton";
    this._nameShowQuotes = "BW_showQuotesButton";
    this._nameSearchWeb = "BW_searchWebButton";
    this._nameParaphraseWidth = "BW_paraWidthSpan";
    this._namePreviewDiv = "BW_previewDiv";
    this._namePreviewFrame = "BW_previewFrame";
    this._nameStatusImg = "BW_StatusImage";
    this._namePrefEnable = "backword.enable";
    this._namePrefVersion = "backword.version";
    this._namePrefTranslator = "backword.translator";
    this._namePrefSearchWebUrl = "backword.searchweburl";
    this._namePrefUsingAPI = "backword.usingapi";
    this._namePrefAPIUrl = "backword.apiurl";
    this._namePrefAPIWebUrl = "backword.apiweburl";
    this._namePrefAPIUsername = "backword.apiusername";
    this._namePrefAPIPassword = "backword.apipassword";
    this._namePrefLayoutSize = "backword.layout.size";
    this._namePrefLayoutQuotes = "backword.layout.quotes";
    this._namePrefLayoutMouseOut = "backword.layout.mouseout";
    this._namePrefLayoutPopDelay = "backword.layout.popdelay";
    this._namePrefLocalAPIPath = "backword.localapi.path";
    this._namePrefUsingLocalAPI = "backword.usinglocalapi";
    this._namePrefCurrentInstanceList = "backword.currentinstancelist";
    this._namePrefShowPronunciation = "backword.showpronunciation";
    this._stringBundle = null;
    this._currentElementBorder = null;
    this._lastParagraph = null;
    this._lastWindow = null;
    this._enabled = true;
    this._usingLocalAPI = true;
    this._showPronunciation = true;
    this._disableAPIByMulti = false;
   	this._timerShow = null;
   	this._timerStatus = null;
    this._version = null;
    this._tolang = "zh-CN";
    this._tw = false;
    this._size = 20;
    this._popDelay = 500;
    this._pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
};
BW_Layout.prototype.resetData = function(){
    this._currentWord = null;
    this._originalWord = null;
    this._untense = null;
    this._quotes = [];
    this._currentWordId = null;
    this._currentParagraph = null;
    this._translate = null;
    this._paraphrase = " ";
    this._toReset = false;
    this._loadingQuotes = false;
    this._editiongParaphrase = false;
    this._currentDoc = null;
    this._currentWindow = null;
    this._currentElement = null;
    if (this. _timerShow){
    	clearTimeout(this._timerShow);
    	this._timerShow = null;
    }
    if (this. _timerStatus){
    	clearTimeout(this._timerStatus);
    	this._timerStatus = null;
    }
};
BW_Layout.prototype.resetStatus = function () {
    this._mouseDown = false;
    this._showQuotesButton = false;
    this._showingQuotes = false;
    this._editingParaphrase = false;
    this._display = false;
    this._currentQuoteIndex = 0;
    this._showQuoteDetailLeft = false;
    this._currentCursorX = 0;
    this._currentCursorY = 0;
    this._currentQuoteId = null;
    this._maxInputLength = 0;
    this._visitingPreview = false;
};
BW_Layout.prototype.loadPref = function(){
	var translator = this._pref.getCharPref(this._namePrefTranslator);
	if (this._currentTranslator != translator){
		this._currentTranslator = translator;
		if (translator.substr(0, 6) == "google"){
			this._dictionary = new BW_GoogleTranslate();
			if (translator.length > 6){
				this._tolang = translator.substr(7);
			}
			else{
				this._tolang = "zh-CN";
				this._pref.setCharPref(this._namePrefTranslator, "google.zh-CN");
			}
		}
		else{
			this._dictionary = new BW_DictcnTranslate();
			this._tw = (translator == "dictcn.tw");
		}
	}
	
	this._usingAPI = this._pref.getBoolPref(this._namePrefUsingAPI);

	var usingLocalAPI = this._pref.getBoolPref(this._namePrefUsingLocalAPI);
	if (!BW_LayoutOverlay._api || usingLocalAPI != this._usingLocalAPI){
		this._usingLocalAPI = usingLocalAPI;
		if (usingLocalAPI){
			BW_LayoutOverlay._api = new BW_LocalAPI();
		}
		else{
			if (BW_LayoutOverlay._api){
				BW_LayoutOverlay._api.close();
			}
			BW_LayoutOverlay._api = new BW_API();
		}
	}
	
	var currentInstaceList = this._pref.getCharPref(this._namePrefCurrentInstanceList);
	var id = 0;
	var cil = [];
	if (currentInstaceList.length > 0){
		cil = currentInstaceList.split(',');
//		BW_ddumpObject(cil, "cil");
		if (cil.length > 0){
			try{
				id = parseInt(cil[cil.length-1]);
			}
			catch(e){
				id = 0;
			}
		}
	}

	if (this._id == null){
		this._id = id+1;
		cil.push(this._id.toString());
		this._pref.setCharPref(this._namePrefCurrentInstanceList, cil.join(','));
	}
	else if (this._usingLocalAPI){
		if (this._id == id && this._disableAPIByMulti){
			this._disableAPIByMulti = false;
			this._usingAPI = true;
		}
		else if (this._id < id){
			this._disableAPIByMulti = true;
			this._usingAPI = false;
		}
	}
	this._searchWebUrl = this._pref.getCharPref(this._namePrefSearchWebUrl);
	this._apiUrl = this._pref.getCharPref(this._namePrefAPIUrl);
	this._apiWebUrl = this._pref.getCharPref(this._namePrefAPIWebUrl);
	this._apiUsername = this._pref.getCharPref(this._namePrefAPIUsername);
	this._apiPassword = this._pref.getCharPref(this._namePrefAPIPassword);
	this._size = parseInt(this._pref.getCharPref(this._namePrefLayoutSize));
	this._enabled = this._pref.getBoolPref(this._namePrefEnable);
	this._showPronunciation = this._pref.getBoolPref(this._namePrefShowPronunciation);
	this._listQuotesLimit = parseInt(this._pref.getCharPref(this._namePrefLayoutQuotes));
	this._maxMouseOut = parseInt(this._pref.getCharPref(this._namePrefLayoutMouseOut));
	this._popDelay = parseInt(this._pref.getCharPref(this._namePrefLayoutPopDelay));
	this.updateStatusIcon();
};
BW_Layout.prototype.appendDiv = function () {
//    BW_ddump("enter BW_Layout.appendDiv()");
	var div = BW_getDoc().getElementById(this._nameLayout);
	if (!div){
	 	div = BW_createElement("DIV");
    	div.id = this._nameLayout;
	    div.style.position = "absolute";
	    div.style.left = "0px";
	    div.style.top = "-"+(this._size+2)+"px";
	    div.style.height = this._size+"px";
	    div.style.zIndex = "32716";
	    div.style.border = "1px solid #0043B3";
	    div.style.borderBottomStyle = "outset";
	    div.style.borderRightStyle = "outset";
	    div.style.display = "none";
	    div.style.color = "#002864!important";
	    div.style.backgroundColor = "#D5E6FF";
	    div.style.verticalAlign = "middle";
//	    div.setAttribute('valign', 'middle');
	    div.setAttribute('align', 'absmiddle');
	    BW_getDoc().body.appendChild(div);
	}
};
BW_Layout.prototype.getDiv = function(doc){
	if (!doc) doc = BW_getDoc();
	var div = doc.getElementById(this._nameLayout);
	if (div) return div;
	BW_LayoutOverlay.appendDiv();
	return doc.getElementById(this._nameLayout);
};
BW_Layout.prototype.getString = function(name){
	if (!this._stringBundle){
	    this._stringBundle = document.getElementById("backwordstrings");
	}
	return this._stringBundle.getString(name);
};
BW_Layout.prototype.updateLayout = function (){
    if (this._currentWord) {
        if (!this._display) {
	        this._display = true;
	        if (this._usingAPI){
	            this.backWordButton();
	            if (!this._usingLocalAPI){
		            this.openPageButton();
	            }
	        }
            this.searchWebButton();
            if (this._showPronunciation)
	            this.cibaFlash();
        	this.untenseSpan();
        	if (this._usingAPI){
	            this.paraphraseSpan();
	            var bar = BW_createElement("SPAN");
	            bar.innerHTML = "|";
	            bar.style.color = "#002864";
	            this.getDiv().appendChild(bar);
        	}
            this.translateSpan();
            this.getDiv().style.display = "";
            BW_getPage().addEventListener('scroll', this.doScroll, false);
            BW_getPage().addEventListener('blur', this.doBlur, false);
        }
        if (this._quotes.length > 0 && !this._showQuotesButton) {
        	this.showQuotesButton();
        }else if(this._quotes.length == 0 && this._showQuotesButton){
        	this.getDiv().removeChild(this.getDiv().firstChild);
        	this._showQuotesButton = false;
        }
        this.updatePosition();
    }
};
BW_Layout.prototype.maybeShowTooltip = function (tipElement) {
	if (this._toReset)
		this.resetData();
    var parent = this._rangeParent;
    var offset = this._rangeOffset;
    if (!parent)
        return;
    if (!this._enabled || (this._visitingPreview && tipElement.ownerDocument == BW_getDoc().getElementById(this._namePreviewFrame).contentDocument))
    	return;
	if (this._display){
		if (this._currentDoc == tipElement.ownerDocument)
			return;
		else
			this.hide(this._currentDoc);
	}
    	
    var word = this.getCurrentWord(parent, offset, tipElement);
    if (word){
		this._currentElement = tipElement;
		this.showTooltip(word);
    }
    return;
};
BW_Layout.prototype.showTooltip = function(word){
	var tipElement  = this._currentElement;
	try{
        this.loadPref();
		this._originalWord = this._currentWord = word;
		this._currentDoc = tipElement.ownerDocument;
		this._currentParagraph = BW_plainText(BW_trim(tipElement.textContent));
		this._currentWindow = this._currentDoc.defaultView;
    	this._currentCursorX = this._cursorX;
    	this._currentCursorY = this._cursorY;
    	this._untense = "";

		var select = BW_trim(BW_getPage().getSelection().toString()).toLowerCase();
		if (select.length > 3 && this._currentWord.indexOf(select) != -1){
			this._currentWord = select;
        	this._translate = this.getTranslate(this._currentWord);
		}
		else{
			this.untense();
        	this._translate = this.getTranslate(this._currentWord);
    		if (!this._translate && this._untense){
    			if (this._untense != "s"){
	        		this._currentWord += 'e';
	        		this._translate = this.getTranslate(this._currentWord);
    			}
    			else if (/f$/.test(this._currentWord)){
	        		this._currentWord += 'e';
	        		this._translate = this.getTranslate(this._currentWord);
					if (!this._translate){
						this._currentWord = this._originalWord.substr(0, this._originalWord.length-1);
		        		this._translate = this.getTranslate(this._currentWord);
					}
    			}
    			if (!this._translate){
    				this._currentWord = this._originalWord;
    				this._untense = null;
    				this._translate = this.getTranslate(this._currentWord);
    			}
        	}
		}
        if (this._translate || this._currentWord == select) {
	        this.updateLayout();
        }
        this._api.getWord(this._currentWord);
	}
	catch(e){
		BW_ddump(e);
	}
};
BW_Layout.prototype.untense = function(){
	this._currentWord = BW_stemWord(this._currentWord);
	if (this._currentWord == this._originalWord) return false;
	var reSuf = /(s|ed|ing)$/;
	var match = reSuf.exec(this._originalWord);
	this._untense = match[0];
	return true;
};
BW_Layout.prototype.hide = function(doc){
	try{
		if (!doc) doc = BW_getDoc();
		if (this._display)	doc.body.removeChild(doc.getElementById(this._nameLayout));
		else return;
		if (this._showingQuotes) doc.body.removeChild(doc.getElementById(this._nameQuotesDiv));
		var detail = doc.getElementById(this._nameQuoteDetailDiv);
		if (detail) doc.body.removeChild(detail);
		var preview = doc.getElementById(this._namePreviewDiv);
		if (preview) doc.body.removeChild(preview);
	}
	catch(e){
		BW_ddump(e);
	}
	this.resetStatus();
	this._toReset = true;
};
BW_Layout.prototype.doLoad = function (event) {BW_LayoutOverlay.doLoadImpl(event);}
BW_Layout.prototype.doLoadImpl = function (event) {
	this.loadPref();
	BW_ddump("load"+this._id);
    if ("nsIAdblockPlus" in Components.interfaces) //if Adblock Plus 0.7
    {
        var abp = Components.classes["@mozilla.org/adblockplus;1"].createInstance(Components.interfaces.nsIAdblockPlus);
        abp.updateExternalSubscription("Backword", "Backword [www.gneheix.com]", ["@@|http://www.iciba.com/resource/a/en/*.swf"], 1);
    }
    this.is_tbird = (navigator.userAgent.search(/Thunderbird\/\d+/) != -1);
    if (!this.is_tbird)
		gBrowser.addEventListener("load", this.doPageLoad, true);
	
    this._version = this._pref.getCharPref(this._namePrefVersion);
};
BW_Layout.prototype.doUnload = function(event){BW_LayoutOverlay.doUnloadImpl(event);}
BW_Layout.prototype.doUnloadImpl = function(event){
	BW_ddump("unload"+this._id);
	if (this._id != null){
		var currentInstaceList = this._pref.getCharPref(this._namePrefCurrentInstanceList);
		var cil = currentInstaceList.split(',');
		var id = 0;
		for (var i=0; i<cil.length; i++){
			try{
				id = parseInt(cil[i]);
				if (id == this._id){
					cil = cil.slice(0, i).concat(cil.slice(i+1));
					break;
				}
			}
			catch(e){}
		}
		this._pref.setCharPref(this._namePrefCurrentInstanceList, cil.join(','));
	}
};
BW_Layout.prototype.doMouseMove = function (event) {BW_LayoutOverlay.doMouseMoveImpl(event);}
BW_Layout.prototype.doMouseMoveImpl = function (event) {
    this.updateCursorPosition(event);
    if (this._display){
    	if (!this._mouseDown && this.isMouseOut()){
    		this.hide();
    	}
//    	else{
//    		BW_ddumpObject(this, "BW", 0);
//    	}
    }
    else if (this._enabled){
    	if (this._timerShow){
    		clearTimeout(this._timerShow);
    		this._timerShow = null;
    	}
	    if (this. _timerStatus){
	    	clearTimeout(this._timerStatus);
	    	BW_LayoutOverlay.updateStatusIcon();
	    	this._timerStatus = null;
	    }
    	var element = event.target;
		this._timerShow = setTimeout(function(element) {BW_LayoutOverlay.maybeShowTooltip(element);BW_LayoutOverlay.updateStatusIcon();}, this._popDelay, element);
		this._timerStatus =  setTimeout(function (){BW_LayoutOverlay.updateStatusIcon(true);},100);
	}
};
BW_Layout.prototype.doMouseDown = function (e) {BW_LayoutOverlay.doMouseDownImpl(e);}
BW_Layout.prototype.doMouseDownImpl = function (e) {
	this._mouseDown = true;
};
BW_Layout.prototype.doMouseUp = function (e) {BW_LayoutOverlay.doMouseUpImpl(e);}
BW_Layout.prototype.doMouseUpImpl = function (e) {
	this._mouseDown = false;
};
BW_Layout.prototype.doScroll = function () {BW_LayoutOverlay.doScrollImpl();}
BW_Layout.prototype.doScrollImpl = function () {
	if (this._display && !this._visitingPreview){
		this.hide();
	}
};
BW_Layout.prototype.doBlur = function(){BW_LayoutOverlay.doBlurImpl();}
BW_Layout.prototype.doBlurImpl = function(){
	if (this._display && !this._visitingPreview){
		this.hide();
	}
};
BW_Layout.prototype.doPageLoad = function(event){BW_LayoutOverlay.doPageLoadImpl(event);}
BW_Layout.prototype.doPageLoadImpl = function(event){
  	if (event.originalTarget instanceof HTMLDocument) {
      var doc = event.originalTarget;
		if (this.getBrowser(doc) == this._lastWindow){
			this.highlight(doc.defaultView, this._lastParagraph);
		}
  	}
  	if (this._version != this.getString("version")){
		if (!this._version){
			alert(this.getString("alert.firsttime"));
		}
		this._version = this.getString("version");
		this._pref.setCharPref(this._namePrefVersion, this._version);
  	}
};
BW_Layout.prototype.getBrowser = function(doc){  
	var win = doc && doc.defaultView;
	if(!win) {
		return null;
	}
	win = win.top;
	var browsers = gBrowser.browsers;
	var browser = null;
	for(var b = 0;b < browsers.length; ++ b) {
		if(browsers[b].contentWindow == win) {
			browser = browsers[b];
			break;
		}
	}
	return browser;
};
BW_Layout.prototype.isMouseOut = function(){
	if (this._visitingPreview) return false;
	var offset = 0;
    var width = this.getDiv().offsetWidth;
    var height = this.getDiv().offsetHeight;
    var divX = this._divX -  BW_getPage().pageXOffset;
    var divY = this._divY -  BW_getPage().pageYOffset;
    if (this._showingQuotes) height += BW_getDoc().getElementById(this._nameQuotesDiv).offsetHeight;
//	BW_ddump("pix:"+this._cursorX+","+this._cursorY+","+this._divX+","+this._divY+","+div.offsetWidth+","+div.offsetHeight);
	if (this._cursorX < divX) offset = divX - this._cursorX;
	else if (this._cursorX > divX + width) offset = this._cursorX - divX - width;
	if (offset > this._maxMouseOut) return true;
	if (this._cursorY < divY) offset = divY - this._cursorY;
	else if (this._cursorY > divY + height) offset = this._cursorY - divY - height;
	return offset > this._maxMouseOut;
};
BW_Layout.prototype.updateCursorPosition = function (event) {
    this._rangeParent = event.rangeParent;
    this._rangeOffset = event.rangeOffset;
    this._cursorX = event.clientX;
    this._cursorY = event.clientY;
//	if (this._currentDoc != null && this._currentDoc !=  event.target.ownerDocument)
//		this.hide(this._currentDoc);
//	this._currentDoc = event.target.ownerDocument;
//	this._currentWindow = this._currentDoc.contentWindow;
//ie    this._cursorX = event.clientX;
//ie    this._cursorY = event.clientY;
};
BW_Layout.prototype.updatePosition = function(){
	var left = this._currentCursorX + 5;
	var div = this.getDiv();
	var quotes = BW_getDoc().getElementById(this._nameQuotesDiv);
    var width = div.offsetWidth;
    var height = div.offsetHeight;
    if (this._showingQuotes) height += BW_getDoc().getElementById(this._nameQuotesDiv).offsetHeight-1;

	var innerWidth = BW_getPage().innerWidth;
	if (BW_getPage().scrollMaxY > 0) innerWidth -= 16;
	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) innerHeight -= 16;
	if (innerWidth - left < width){
		left = innerWidth - width;
		if (left < 0) left=0;
	}
//	BW_ddump(innerWidth+","+left+","+width+","+BW_getPage().pageXOffset);
	left += BW_getPage().pageXOffset;
	this._divX = left;
	div.style.left = left+"px";
	if (quotes) quotes.style.left = left+"px";
	var top = this._currentCursorY + 5;
	if (innerHeight - top < height){
		top = innerHeight - height;
		if (top < 0) top = 0;
	}
	top += BW_getPage().pageYOffset;
	this._divY = top;
	div.style.top = top + "px";
	if (quotes) quotes.style.top = (top+this._size+1)+"px";
};
/*
BW_Layout.prototype.updateSize = function(){
	var width = 38;
	var height = 16;
	if (this._showQuotesButton) width += 15;
	width += getLen(this._paraphrase+"|"+this._translate);
//	this.getDiv().style.width = width+"px";
//	this.getDiv().style.width = (40+BW_getDoc().getElementById(this._nameParaphrase).clientWidth+BW_getDoc().getElementById(this._nameTranslate).clientWidth)+"px";
}*/
/*ie only
BW_Layout.prototype.updatePosition = function () {
//ie    var left = this._cursorX + document.documentElement.scrollLeft + document.body.scrollLeft;
//ie    var top = this._cursorY + document.documentElement.scrollTop + document.body.scrollTop;
    top += 5;
    if (document.documentElement.scrollHeight - this._cursorY < 10) {
        top -= 16;
    }
    this.getDiv().style.top = top;
    if (document.documentElement.scrollWidth - this._cursorX < getlen(def) + 20) {
//ie        left = (document.documentElement.scrollWidth + document.documentElement.scrollLeft + document.body.scrollLeft - getlen(def) - 20) - 5;
    }
    this.getDiv().style.left = left;
};*/
BW_Layout.prototype.getCurrentWord = function (parent, offset, target) {
    if (parent.parentNode != target) {
        return null;
    }
    if (parent.nodeType != Node.TEXT_NODE) {
        return null;
    }
    var container = parent.parentNode;
    if (container) {
        var foundNode = false;
        for (var c = container.firstChild; c != null; c = c.nextSibling) {
            if (c == parent) {
                foundNode = true;
                break;
            }
        }
        if (!foundNode) {
            return null;
        }
    }
    var range = parent.ownerDocument.createRange();
    range.selectNode(parent);
    var str = range.toString();
//    BW_ddump("range in getCurrentWord:" + str);
    if (offset < 0 || offset >= str.length) {
        return null;
    }
    var start = offset;
    var end = offset + 1;
    var valid_chars = /\w/;
    if (!valid_chars.test(str.substring(start, start + 1))) {
        return null;
    }
    while (start > 0) {
        if (valid_chars.test(str.substring(start - 1, start))) {
            start--;
        } else {
            break;
        }
    }
    while (end < str.length) {
        if (valid_chars.test(str.substring(end, end + 1))) {
            end++;
        } else {
            break;
        }
    }
    var text = str.substring(start, end);
//    BW_ddump("Current word:" + text);
    return text.toLowerCase();
};
BW_Layout.prototype.getParagraph = function(){
	var selectText = BW_plainText(BW_trim(BW_getPage().getSelection().toString()));
	if (selectText.length > 0 && !BW_isAWord(selectText) && selectText.toLowerCase().indexOf(this._originalWord) >= 0)
		return selectText;
	return this._currentParagraph;
};
BW_Layout.prototype.checkCurrentParagraph = function(){
	if (this._quotes.length == 0){
		this._currentQuoteId = null;
		return false;
	}
	var para = this.getParagraph();
//	BW_ddump("---{\n"+para+"\n}---");
	var url = BW_getPage().top.document.URL;
	for (var i=0; i<this._quotes.length; i++){
//		BW_ddump("---{\n"+this._quotes[i].paragraph+"\n}---");
		if (this._quotes[i].paragraph == para && this._quotes[i].url == url){
			this._currentQuoteId = this._quotes[i].id;
			return true;
		}
	}
	this._currentQuoteId = null;
	return false;
};
BW_Layout.prototype.apiCall = function () {
    this._apiCalling = true;
    var pic = BW_getDoc().getElementById(this._nameOpenPage);
    if (pic) {
    	if (pic.getAttribute('src') != "chrome://backword/skin/apiCalling.gif")
        	pic.setAttribute('src', "chrome://backword/skin/apiCalling.gif");
    }
};
BW_Layout.prototype.apiReturn = function () {
	this._apiCalling = false;
    var pic = BW_getDoc().getElementById(this._nameOpenPage);
    if (pic) {
        pic.setAttribute('src', "chrome://backword/skin/openPage.gif");
    }
};
BW_Layout.prototype.apiError = function (reason){
	this._apiError = true;
	this._apiErrorCount++;
	if (this._apiErrorCount > this._maxAPIErrorCount)
		this.disableAPI();
	this._apiErorrReason = reason;
	this.apiReturn();
};
BW_Layout.prototype.apiSuccess = function(){
	this._apiError = false;
	this._apiErrorCount = 0;
	this._apiErrorReason = null;
};
////////////////////////////////////////////////////////////////////////////
// start of element generator function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.showQuotesButton = function () {
    var button = BW_createElement("IMG");
    button.setAttribute('src', "chrome://backword/skin/showQuotesD.gif");
    button.setAttribute('align', "absmiddle");
    button.id = this._nameShowQuotes;
    button.style.cursor = "pointer";
	button.style.border = "0px!important";
	button.style.backgroundColor = "#D5E6FF";
	button.setAttribute('title', this.getString("tooltip.showquotes"));
    this.getDiv().insertBefore(button, this.getDiv().firstChild);
    this._showQuotesButton = true;
    button.addEventListener('mouseover', this.mouseOverShowQuotes, true);
};
BW_Layout.prototype.mouseOverShowQuotes = function(){
    this.setAttribute('src', "chrome://backword/skin/showQuotesL.gif");
    BW_LayoutOverlay.showQuotes();
};
BW_Layout.prototype.backWordButton = function () {
    var button = BW_createElement("IMG");
    button.setAttribute('src', "chrome://backword/skin/backWordD.gif");
    button.setAttribute('align', "absmiddle");
	button.style.border = "0px!important";
	button.style.backgroundColor = "#D5E6FF";
    button.id = this._nameBackWord;
    button.style.cursor = "pointer";
    this.getDiv().appendChild(button);
	button.addEventListener('mouseover', this.mouseOverBackWord, true);
	button.addEventListener('mouseout', this.mouseOutBackword, true);
	button.addEventListener('click', this.clickBackWord, true);
	this._currentElementBorder = this._currentElement.style.border;
};
BW_Layout.prototype.mouseOverBackWord = function(){
	if (BW_LayoutOverlay._apiCalling){
		this.setAttribute('src', "chrome://backword/skin/backWordW.gif");	
		this.setAttribute('title',BW_LayoutOverlay.getString("tooltip.apicalling"));
	}
	else if (BW_LayoutOverlay._apiError){
		this.setAttribute('src', "chrome://backword/skin/backWordE.gif");	
		this.setAttribute('title',BW_LayoutOverlay.getString("tooltip.apierror")+BW_LayoutOverlay._apiErorrReason);
	}
	else if (BW_LayoutOverlay._currentQuoteId){
		this.setAttribute('src', "chrome://backword/skin/backWordR.gif");
		if (BW_LayoutOverlay.getParagraph() == BW_LayoutOverlay._currentParagraph)
			BW_LayoutOverlay._currentElement.style.border = "1px dashed blue";
		this.setAttribute('title',BW_LayoutOverlay.getString("tooltip.deletequote"));
	}
	else if (BW_LayoutOverlay._currentWordId){
		this.setAttribute('src', "chrome://backword/skin/backWordG.gif");
		if (BW_LayoutOverlay.getParagraph() == BW_LayoutOverlay._currentParagraph)
			BW_LayoutOverlay._currentElement.style.border = "1px dashed blue";
		this.setAttribute('title',BW_LayoutOverlay.getString("tooltip.backquote"));
	}
	else{
		this.setAttribute('src', "chrome://backword/skin/backWordL.gif");
		if (BW_LayoutOverlay.getParagraph() == BW_LayoutOverlay._currentParagraph)
			BW_LayoutOverlay._currentElement.style.border = "1px dashed blue";
		this.setAttribute('title',BW_LayoutOverlay.getString("tooltip.backword")+":"+BW_LayoutOverlay._currentWord);
	}
};
BW_Layout.prototype.mouseOutBackword = function(){
	this.setAttribute('src', "chrome://backword/skin/backWordD.gif");
	BW_LayoutOverlay._currentElement.style.border = BW_LayoutOverlay._currentElementBorder;
};
BW_Layout.prototype.clickBackWord = function(){
	if (BW_LayoutOverlay._apiCalling || BW_LayoutOverlay._apiError) return;
	BW_LayoutOverlay._currentElement.style.border = BW_LayoutOverlay._currentElementBorder;
	if (BW_LayoutOverlay._currentQuoteId){
		BW_LayoutOverlay._api.deleteQuote(BW_LayoutOverlay._currentWordId, BW_LayoutOverlay._currentQuoteId);
	}
    else if (BW_LayoutOverlay._currentWordId == null) {
        BW_LayoutOverlay._api.backWord(BW_LayoutOverlay._currentWord, BW_LayoutOverlay._paraphrase);
    } else {
        BW_LayoutOverlay._api.backQuote(BW_LayoutOverlay._currentWordId, BW_getPage().top.document.URL, BW_getPage().top.document.title, BW_LayoutOverlay.getParagraph());
    }
};
BW_Layout.prototype.openPageButton = function () {
    var button = BW_createElement("IMG");
    button.setAttribute('align', "absmiddle");
    button.style.cursor = "pointer";
	button.style.border = "0px!important";
	button.style.backgroundColor = "#D5E6FF";
	button.setAttribute("title", this.getString("tooltip.openpage"));
    if (this._apiCalling) {
        button.setAttribute("src", "chrome://backword/skin/apiCalling.gif");
    } else {
        button.setAttribute('src', "chrome://backword/skin/openPage.gif");
    }
    button.id = this._nameOpenPage;
    button.addEventListener('click', openPage, false);
    function openPage(){
    	if (!BW_LayoutOverlay.is_tbird)
	    	gBrowser.selectedTab = gBrowser.addTab(BW_LayoutOverlay._apiWebUrl);
	    else{
			window.open(BW_LayoutOverlay._apiWebUrl);	    	
	    }
		BW_LayoutOverlay.hide();
    }
    this.getDiv().appendChild(button);
};
BW_Layout.prototype.searchWebButton = function(){
    var button = BW_createElement("IMG");
    button.setAttribute('align', "absmiddle");    
    button.style.cursor = "pointer";
	button.style.border = "0px!important";
	button.style.backgroundColor = "#D5E6FF";
	button.setAttribute("title", this.getString("tooltip.searchweb"));
    button.setAttribute('src', "chrome://backword/skin/searchWeb.gif");
    button.id = this._nameSearchWeb;
    button.addEventListener('click', openPage, false);
    function openPage(){
    	gBrowser.addTab(BW_LayoutOverlay._searchWebUrl+BW_LayoutOverlay._currentWord);
		BW_LayoutOverlay.hide();
    }
    this.getDiv().appendChild(button);
};
BW_Layout.prototype.paraphraseSpan = function () {
    var span = BW_createElement("SPAN");
    span.id = this._nameParaphrase;
    span.style.color = "#002864";
    span.setAttribute("title", this.getString("tooltip.paraphrase"));
    span.innerHTML = BW_HTMLEncode(this._paraphrase);
    this.getDiv().appendChild(span);
    this.initParaphrase(span);
};
BW_Layout.prototype.translate = function(){
	if (this._untense)
		return "<span style='color:#002864; "+BW_defaultStyle().replace("font-weight: normal", "font-weight: bold")+"' title='"+this.getString("tooltip.untense")+"'>"+this._currentWord+"</span>:"+this._translate;
	else
		return this._translate;
};
BW_Layout.prototype.initParaphrase = function (span) {
	span.addEventListener('mouseover', this.mouseOverParaphrase, true);
	span.addEventListener('mouseout', this.mouseOutParaphrase, true);
	span.addEventListener('click', this.clickParaphrase, true);
};
BW_Layout.prototype.mouseOverParaphrase = function(){
	if (BW_LayoutOverlay._apiError || BW_LayoutOverlay._apiCalling) return;
    this.style.backgroundColor = "#9DC2FF";
    this.style.border = "1px solid #0043B3";
};
BW_Layout.prototype.mouseOutParaphrase = function(){
    this.style.backgroundColor = "transparent";
    this.style.border = "none";
};
BW_Layout.prototype.clickParaphrase = function(){
	if (BW_LayoutOverlay._apiError || BW_LayoutOverlay._apiCalling) return;
    this.removeEventListener('click', BW_LayoutOverlay.clickParaphrase, true);
    this.removeEventListener('mouseover', BW_LayoutOverlay.mouseOverParaphrase, true);
    this.style.backgroundColor = "transparent";
    this.style.border = "none";
    var titleWidth = this.offsetWidth;
    if (titleWidth > BW_LayoutOverlay.maxLengthInput()) titleWidth = BW_LayoutOverlay.maxLengthInput();
    var input = BW_getDoc().createElement('INPUT');
//    obj.style.verticalAlign = "middle!important";
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '80');
    input.setAttribute('value', BW_LayoutOverlay._paraphrase);
    input.style.width = titleWidth+"px";
	input.style.height = (BW_LayoutOverlay._size-2)+"px";
	input.style.color = "#002864";
	input.style.border = "1px solid #0048C1";
	input.style.backgroundColor = "#ECF3FF";
    BW_setElementStyle(input);
	
	input.setAttribute('title', BW_LayoutOverlay.getString("tooltip.enterparaphrase"));
    this.innerHTML = '';
    this.appendChild(input);
    var div = BW_createElement('DIV');
    div.style.overflow = "hidden";
    div.style.width = "0px";
    div.style.height = "0px";
    var span = BW_createElement('SPAN');
	span.innerHTML = "<nobr>"+BW_LayoutOverlay._paraphrase+"</nobr>";
	span.id = BW_LayoutOverlay._nameParaphraseWidth;
	div.appendChild(span);
	BW_getDoc().body.appendChild(div);
	
    BW_LayoutOverlay._editingParaphrase = true;
    input.focus();
    input.select();
    input.addEventListener("keydown", onEnterDown, false);
    input.addEventListener("input", onInput, false);
    input.addEventListener("blur", onblur, false);
//		inputElm.attactEvent('onkeydown',onEnterDown);
    function onEnterDown(e) {
        if (e.keyCode == 13) {
            this.blur();
        }
    };
    function onInput(e) {
    	var span = BW_getDoc().getElementById(BW_LayoutOverlay._nameParaphraseWidth);
    	span.innerHTML = "<nobr>"+BW_HTMLEncode(this.value)+"</nobr>";
		var len = span.offsetWidth;
		var max = BW_LayoutOverlay.maxLengthInput();
		if (len+5 < max)
	        this.style.width = len + 5 + "px";
	    else
	        this.style.width = max + "px";
    };
    function onblur(e) {
    	this.value = BW_trim(this.value);
    	if (this.value == "") this.value = " ";
        if (this.value != BW_LayoutOverlay._paraphrase && !BW_LayoutOverlay._apiCalling && !BW_LayoutOverlay._apiError) {
            BW_LayoutOverlay._paraphrase = this.value;
            BW_LayoutOverlay._api.backWord(BW_LayoutOverlay._currentWord, this.value);
        }
        var value = BW_HTMLEncode(this.value);
        BW_LayoutOverlay.initParaphrase(this.parentNode);
        this.parentNode.innerHTML = value;
        BW_LayoutOverlay._editingParaphrase = false;
    };
};
BW_Layout.prototype.maxLengthInput = function(){
	if (this._maxInputLength == 0){
		var innerWidth = BW_getPage().innerWidth;
		if (BW_getPage().scrollMaxY > 0) innerWidth -= 16;
		//ignore pageOffsetX here because firefox 1.5 has a bug of calculate auto width of div
		this._maxInputLength = innerWidth - (BW_getLeft(this.getDiv())+BW_getDoc().getElementById(this._nameParaphrase).offsetLeft+250);
		if (this._maxInputLength < 50) this._maxInputLength = 50;
	}
	return this._maxInputLength;
};
BW_Layout.prototype.translateSpan = function () {
    var span = BW_createElement("SPAN");
    span.id = this._nameTranslate;
    span.style.color = "#002864";
    span.innerHTML = this.translate();
	this.getDiv().appendChild(span);
};
BW_Layout.prototype.showQuotes = function () {
	if (this._showingQuotes) return;
    this._showingQuotes = true;
    var div = BW_getDoc().getElementById(this._nameQuotesDiv);
    if (!div) {
        div = BW_createElement("DIV");
	    div.style.backgroundColor = "#e5f0ff";
	    div.style.position = "absolute";
	    div.style.display = "block!important";
	    div.style.left = this.getDiv().style.left;
	    div.style.top = (BW_getTop(this.getDiv())+this._size+1)+"px";
	    var divWidth = this.getDiv().clientWidth;
	    if (divWidth > 400){
		    div.style.width= divWidth-198+"px";
		    this._showQuoteDetailLeft = false;
	    }
		else{
			div.style.width= divWidth+"px";
		    this._showQuoteDetailLeft = true;
		}
	    div.style.zIndex = "32714";
	    div.style.border = "1px solid #517abf";
	    div.style.lineHeight = this._size+"px!important";
	    div.style.overflow = "hidden!important";
	    div.setAttribute('align', 'left');
        div.id = this._nameQuotesDiv;
        BW_getDoc().body.appendChild(div);
    }
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
    var i=0;
	//if the buttons shown
    for (; i < this._quotes.length && i < this._listQuotesLimit; i++) {
        div.appendChild(this.showQuote(i));
    }
    if (this._quotes.length > this._listQuotesLimit){
    	div.lastChild.firstChild.setAttribute('src', "chrome://backword/skin/quoteItemN.gif");
    	div.lastChild.firstChild.setAttribute('title', this.getString("tooltip.nextquote"));
    	div.lastChild.firstChild.addEventListener('click', this.showNextQuote, false);
    }
    this.updateQuotesSize(i);
};
BW_Layout.prototype.hideQuotes = function(){
	if (!this._showingQuotes) return;
	this._showingQuotes = false;
    var div = BW_getDoc().getElementById(this._nameQuotesDiv);
    if (div) BW_getDoc().body.removeChild(div);
    div = BW_getDoc().getElementById(this._nameQuoteDetailDiv);
    if (div) BW_getDoc().body.removeChild(div);
};
BW_Layout.prototype.updateQuotesSize = function(itemCount){
	var height = itemCount*this._size;
	BW_getDoc().getElementById(this._nameQuotesDiv).style.height = height+"px";
	this.updatePosition();
};
BW_Layout.prototype.showQuote = function (index) {
	if (this._quotes.length <= index)
		return null;
	var quote = this._quotes[index];
    var div = BW_createElement("DIV");
    div.style.height = this._size+"px";
    div.style.color = "#002864";
    var img = BW_createElement("IMG");
    if (index%2 == 0){
    	img.setAttribute('src', "chrome://backword/skin/quoteItemB.gif");
    	div.style.backgroundColor = "#e5f0ff";
    }
    else{
    	div.style.backgroundColor = "#f4ffe5";
    	img.setAttribute('src', "chrome://backword/skin/quoteItemG.gif");
    }
	img.style.verticalAlign = 'top';
	img.style.padding = "0px!important";
	img.style.border = "0px!important";
	img.style.margin = "0px!important";
	img.style.backgroundColor = "";
    div.appendChild(img);
    var span = BW_createElement("SPAN");
    span.style.cursor = "pointer";
	span.addEventListener('click', clickQuote, false);
	span.addEventListener('mouseover', mouseOverQuote, false);
	span.addEventListener('mouseout', mouseOutQuote, false);
	span.id = index;
	function clickQuote(e){
		window.content.status = null;
		if (e.ctrlKey &&  !BW_LayoutOverlay.is_tbird){
			var quote = BW_LayoutOverlay._quotes[parseInt(this.id)];
			BW_LayoutOverlay._lastParagraph = quote.paragraph;
			gBrowser.selectedTab = gBrowser.addTab(quote.url);
			BW_LayoutOverlay._lastWindow = gBrowser.getBrowserForTab(gBrowser.selectedTab);
			BW_LayutOverlay._lastWindow.addEventListener("load", function(){BW_ddump("load");BW_LayoutOverlay.highlight(this, BW_LayoutOverlay._lastParagraph);}, false);
			BW_LayoutOverlay.hide();
		}
		else{
			BW_LayoutOverlay.showPreview(parseInt(this.id));
		}
	}
	function mouseOverQuote(){
		if (gBrowser)
			window.content.status = BW_LayoutOverlay.getString("statusbar.openpage") +  BW_LayoutOverlay._quotes[parseInt(this.id)].url;
		else
			window.content.status = BW_LayoutOverlay._quotes[parseInt(this.id)].url;
	}
	function mouseOutQuote(){
		window.content.status = null;
	}
    var quotesDiv = BW_getDoc().getElementById(this._nameQuotesDiv);
    if (quote.title.length > 0){
    	span.innerHTML = "<u>" + quote.title + "</u>";
    	span.setAttribute("title", quote.title);
    }
    else{
    	span.innerHTML = "<u>" + quote.paragraph+ "</u>";
    	span.setAttribute("title", quote.paragraph);
    }
    div.appendChild(span);
	div.addEventListener('mouseover', mouseOver, false);
	div.id = index;
	function mouseOver(e){
		var detail = BW_getDoc().getElementById(BW_LayoutOverlay._nameQuoteDetailDiv);
		if (!detail){
			detail = BW_createElement('div');
			detail.id = BW_LayoutOverlay._nameQuoteDetailDiv;
		    detail.style.position = "absolute";
		    detail.style.width= "197px";
		    detail.style.zIndex = "32715";
		    detail.style.border = "1px solid #517abf";
		    detail.style.display = "block";
		    detail.style.color = "#002864";
		    detail.style.backgroundColor = "#f1f7ff";
		    detail.setAttribute('align', 'left');
		    BW_getDoc().body.appendChild(detail);
		}
		detail.innerHTML = BW_LayoutOverlay.showQuoteDetail(BW_LayoutOverlay._quotes[parseInt(this.id)].paragraph, BW_LayoutOverlay._currentWord);
		BW_LayoutOverlay.updateQuoteDetail();
	}
    return div;
};
BW_Layout.prototype.showNextQuote = function(){
    if (BW_LayoutOverlay._currentQuoteIndex < BW_LayoutOverlay._quotes.length - BW_LayoutOverlay._listQuotesLimit) {
        BW_LayoutOverlay._currentQuoteIndex++;
        var quotes = BW_getDoc().getElementById(BW_LayoutOverlay._nameQuotesDiv);
        quotes.removeChild(quotes.firstChild);
        quotes.lastChild.firstChild.setAttribute('src', "chrome://backword/skin/quoteItem"+((parseInt(quotes.lastChild.id)%2==0)?"B":"G")+".gif");
        quotes.lastChild.firstChild.setAttribute('title', "");
        quotes.firstChild.firstChild.setAttribute('src', "chrome://backword/skin/quoteItemP.gif");
        quotes.firstChild.firstChild.setAttribute('title', BW_LayoutOverlay.getString("tooltip.prevquote"));
        quotes.firstChild.firstChild.addEventListener('click', BW_LayoutOverlay.showPrevQuote, false);
        var quoteNew = BW_LayoutOverlay.showQuote(BW_LayoutOverlay._currentQuoteIndex + BW_LayoutOverlay._listQuotesLimit -1);
        if (BW_LayoutOverlay._currentQuoteIndex < BW_LayoutOverlay._quotes.length - BW_LayoutOverlay._listQuotesLimit){
	        quoteNew.firstChild.setAttribute('src', "chrome://backword/skin/quoteItemN.gif");
	        quoteNew.firstChild.setAttribute('title', BW_LayoutOverlay.getString("tooltip.nextquote"));
	        quoteNew.firstChild.addEventListener('click', BW_LayoutOverlay.showNextQuote, false);
        }
        quotes.appendChild(quoteNew);
    }
};
BW_Layout.prototype.showPrevQuote = function(){
    if (BW_LayoutOverlay._currentQuoteIndex > 0) {
	    BW_LayoutOverlay._currentQuoteIndex--;
	    var quotes = BW_getDoc().getElementById(BW_LayoutOverlay._nameQuotesDiv);
	    quotes.removeChild(quotes.lastChild);
        quotes.firstChild.firstChild.setAttribute('src', "chrome://backword/skin/quoteItem"+((parseInt(quotes.firstChild.id)%2==0)?"B":"G")+".gif");
        quotes.firstChild.firstChild.setAttribute('title', "");
	    quotes.lastChild.firstChild.setAttribute('src', "chrome://backword/skin/quoteItemN.gif");
        quotes.lastChild.firstChild.setAttribute('title', BW_LayoutOverlay.getString("tooltip.nextquote"));
	    quotes.lastChild.firstChild.addEventListener('click', BW_LayoutOverlay.showNextQuote, false);
	    var quoteNew = BW_LayoutOverlay.showQuote(BW_LayoutOverlay._currentQuoteIndex);
        if (BW_LayoutOverlay._currentQuoteIndex > 0){
	        quoteNew.firstChild.setAttribute('src', "chrome://backword/skin/quoteItemP.gif");
	        quoteNew.firstChild.setAttribute('title', BW_LayoutOverlay.getString("tooltip.prevquote"));
	        quoteNew.firstChild.addEventListener('click', BW_LayoutOverlay.showPrevQuote, false);
        }
	    quotes.insertBefore(quoteNew, quotes.firstChild);
    }
};
BW_Layout.prototype.showQuoteDetail = function(para, keyword){
	var re;
	if (new RegExp("[^aieouy]$").test(keyword)){
		re = keyword+"{1,2}(s|es|ies|d|ed|ied|ing){0,2}";
	}
	else if (new RegExp("[ey]$").test(keyword)){
		re = keyword+"?(s|es|ies|d|ed|ied|ing){0,2}";
	}
	else{
		re = keyword+"(s|es|ies|d|ed|ied|ing){0,2}";
	}
//	BW_ddump(re);
	return para.replace(new RegExp(re, "gi"), function($){return "<span style='background: #ffb483;"+BW_defaultStyle()+"'>"+$+"</span>"});
};
BW_Layout.prototype.updateQuoteDetail = function(){
	var list = BW_getDoc().getElementById(this._nameQuotesDiv);
	var div = BW_getDoc().getElementById(this._nameQuoteDetailDiv);
    var height = div.offsetHeight;

	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) innerHeight -= 16;
	
	var top = BW_getTop(this.getDiv())-BW_getPage().pageYOffset;
	if (!this._showQuoteDetailLeft) top += this._size+1;
	if (innerHeight - top < height){
		div.style.zIndex = "32717";
		top = innerHeight - height;
		if (top < 0) top = 0;
	}
	else{
		div.style.zIndex = "32715";
	}
	top += BW_getPage().pageYOffset;
	div.style.top = top + "px";
	
	var left = BW_getLeft(list)+list.offsetWidth-1-BW_getPage().pageXOffset;
	if (this._showQuoteDetailLeft){
		var innerWidth = BW_getPage().innerWidth;
		if (BW_getPage().scrollMaxY > 0) innerWidth -= 16;
		if (innerWidth - left < 199){
			div.style.zIndex = "32717";
			left = left - list.offsetWidth - 197;
			if (left < 0) left = 0;
		}
	}
	left += BW_getPage().pageXOffset;
	div.style.left = left+"px";
};
BW_Layout.prototype.getTranslate = function(word){
	return this._dictionary.getTranslate(word);
};
BW_Layout.prototype.cibaFlash = function(){
	var word = this._currentWord;
	var span = BW_createElement('span');
	span.style.marginTop = "2px!important";
	span.setAttribute('title', this.getString("tooltip.pronounce"));
	var flash = 'http://www.iciba.com/resource/a/en/'+word.substr(0, 1)+'/'+word+'.swf';
	var html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="10" height="12">';
  	html += '<param name="movie" value="'+flash+'" /><param name="quality" value="high" /><param name="bgcolor" value="#D5E6FF" />';
	html += '<embed src="'+flash+'" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"  bgcolor="#D5E6FF"  width="10" height="12"></embed></object>';
	span.innerHTML = html;
	this.getDiv().appendChild(span);
};
BW_Layout.prototype.untenseSpan = function(){
	if (!this._untense)return;
	this._selectedRanges = new Array;
	var select = BW_getPage().getSelection();
	for (var i=0; i<select.rangeCount; i++){
		this._selectedRanges[i] = select.getRangeAt(i);
	}
	if (this._untense != "s" && new RegExp("[^aeiouy]$").test(this._currentWord)
			&& !(new RegExp("([^aeiouylsz])\\1(ed|ing)$").test(this._originalWord))){
		var spanE = BW_createElement("SPAN");
		spanE.style.color = '#308040';
		spanE.style.cursor = 'pointer';
		spanE.innerHTML = '-e';
		spanE.setAttribute('title', this.getString("tooltip.appende"));
		spanE.addEventListener('mouseover', mouseover, false);
		spanE.addEventListener('mouseout', mouseout, false);
		spanE.addEventListener('click', click, false);
		spanE.id = "e";
		this.getDiv().appendChild(spanE);
	}
	var span = BW_createElement("SPAN");
	span.style.color = '#308040';
	span.style.cursor = 'pointer';
	span.innerHTML = '-'+this._untense;
	span.setAttribute('title', this.getString("tooltip.originalword"));
	span.addEventListener('mouseover', mouseover, false);
	span.addEventListener('mouseout', mouseout, false);
	span.addEventListener('click', click, false);
	span.id = this._untense;
	this.getDiv().appendChild(span);
	function mouseover(e){
		this.stylecolor = '#803040';
		this.innerHTML = '+' + this.id;
	};
	function mouseout(e){
		this.style.color = '#308040';
		this.innerHTML = '-' + this.id;
	};
	function click(e){
		var div = BW_LayoutOverlay.getDiv();
		var child = div.firstChild;
		while(child.nextSibling){
			if (child == this){
				div.removeChild(this);
				if (this.id == "e")
					BW_LayoutOverlay._currentWord += "e";
				else
					BW_LayoutOverlay._currentWord = BW_LayoutOverlay._originalWord;
				break;
			}
			else
				child = child.nextSibling;
		}
		var word = BW_LayoutOverlay._currentWord;
		var original = BW_LayoutOverlay._originalWord;
    	var X = BW_LayoutOverlay._currentCursorX;
    	var Y = BW_LayoutOverlay._currentCursorY;
    	var doc = BW_LayoutOverlay._currentDoc;
    	var win = BW_LayoutOverlay._currentWindow;
    	var para = BW_LayoutOverlay._currentParagraph;
    	var element = BW_LayoutOverlay._currentElement;
    	var untense = BW_LayoutOverlay._untense;
		BW_LayoutOverlay.hide();
		BW_LayoutOverlay.resetData();
//		BW_LayoutOverlay.resetStatus();
		BW_LayoutOverlay._currentWord = word;
		BW_LayoutOverlay._originalWord = original;
		BW_LayoutOverlay._currentCursorX = X;
		BW_LayoutOverlay._currentCursorY = Y;
		BW_LayoutOverlay._currentDoc = doc;
    	BW_LayoutOverlay._currentParagraph = para;
		BW_LayoutOverlay._currentWindow = win;
		BW_LayoutOverlay._currentElement = element;
		if (this.id == "e")
			BW_LayoutOverlay._untense = untense;
		BW_LayoutOverlay._translate = BW_LayoutOverlay.getTranslate(BW_LayoutOverlay._currentWord);
		if (BW_LayoutOverlay._selectedRanges){
			var select = BW_getPage().getSelection();
			for (var i=0; i<BW_LayoutOverlay._selectedRanges.length; i++){
				select.addRange(BW_LayoutOverlay._selectedRanges[i]);
			}
			if (this.id != "e")
				BW_LayoutOverlay._selectedRanges = null;
		}
		BW_LayoutOverlay.updateLayout();
		BW_LayoutOverlay._api.getWord(BW_LayoutOverlay._currentWord);
	};
	
    var bar = BW_createElement("SPAN");
    bar.innerHTML = "|";
    bar.style.color = "#002864";
    this.getDiv().appendChild(bar);
};
BW_Layout.prototype.showPreview = function(index){
	if (BW_getPage().top.document.URL == this._quotes[index].url){
		this.highlight(BW_getPage(), this._quotes[index].paragraph);
		return;
	}
	var div = BW_getDoc().getElementById(this._namePreviewDiv);
	var frame = BW_getDoc().getElementById(this._namePreviewFrame);
	if (!div){
		div = BW_createElement("DIV");
		div.id = this._namePreviewDiv;
		div.style.position = "absolute";
		div.style.zIndex = "32718";
		div.style.display = "none";
		div.style.border = "0px";
		frame = BW_getDoc().createElement("IFRAME");
		frame.id = this._namePreviewFrame;
		frame.setAttribute("index", index);
		frame.style.overflow = "auto";
		frame.style.border = "1px solid black";
		frame.style.background = "white";
		frame.style.width = "100%";
		frame.style.height = "100%";
		div.appendChild(frame);	
		BW_getDoc().body.appendChild(div);
		frame.addEventListener("load", this.loadPreview, false);
		div.addEventListener("mouseover", this.mouseOverPreview, false);
		div.addEventListener("mouseout", this.mouseOutPreview, false);
	}
	this._visitingPreview = true;
	this.updatePreviewPosition(div);
	frame.setAttribute("src", this._quotes[index].url);
};
BW_Layout.prototype.updatePreviewPosition = function(div){
	var innerWidth = BW_getPage().innerWidth;
	if (BW_getPage().scrollMaxY > 0) innerWidth -= 16;
	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) innerHeight -= 16;
	var width = innerWidth/2;
	var height = innerHeight/2;
	div.style.width = width+ "px";
	div.style.height = height + "px";
	if (this._cursorX >= width){
		div.style.left = BW_getPage().pageXOffset+"px";
		div.style.width = this._cursorX+"px";
	}
	else{
		div.style.left = BW_getPage().pageXOffset+this._cursorX -2 + "px";
		div.style.width = (innerWidth-this._cursorX)+"px";
	}
	if (this._cursorY >= height){
		div.style.top = BW_getPage().pageYOffset+"px";
		div.style.height = this._cursorY+"px";
	}
	else{
		div.style.top = BW_getPage().pageYOffset+this._cursorY -2 + "px";
		div.style.height = (innerHeight-this._cursorY)+"px";
	}
	div.style.display="";
};
BW_Layout.prototype.loadPreview = function(){
	BW_LayoutOverlay.highlight(this.contentWindow, BW_LayoutOverlay._quotes[parseInt(this.getAttribute("index"))].paragraph);
};
BW_Layout.prototype.mouseOverPreview = function(){
	BW_LayoutOverlay._visitingPreview = true;
};
BW_Layout.prototype.mouseOutPreview = function(){
	BW_LayoutOverlay._visitingPreview = false;
};
BW_Layout.prototype.highlight = function(wnd, para){
	if (!wnd) return;
	for (var i = 0; wnd.frames && i < wnd.frames.length; i++) {
    	this.highlight(wnd.frames[i], para);
  	}
  	var body = wnd.document.body;
	if (body == null)
		return;
	para = BW_HTMLDecode(para);
  	var doc = wnd.document;
  
  	var count = body.childNodes.length;
  	var searchRange = doc.createRange();
  	var startPt = doc.createRange();
  	var endPt = doc.createRange();

  	searchRange.setStart(body, 0);
  	searchRange.setEnd(body, count);

  	startPt.setStart(body, 0);
  	startPt.setEnd(body, 0);
  	endPt.setStart(body, count);
  	endPt.setEnd(body, count);
  	var retRange = null;
  	var finder = Components.classes["@mozilla.org/embedcomp/rangefind;1"].createInstance()
                         .QueryInterface(Components.interfaces.nsIFind);
  	finder.caseSensitive = false;
  	if ((retRange = finder.Find(para, searchRange, startPt, endPt))) {
	  	wnd.focus();
  		var select = wnd.getSelection();
  		select.removeAllRanges();
  		select.addRange(retRange);
		var node = retRange.startContainer;
		while(!node.scrollIntoView){
			node = node.parentNode;
		}
  		node.scrollIntoView(true);
  	}
  	else {
  		var paras = para.split("\n");
	  	if ((retRange = finder.Find(paras[0], searchRange, startPt, endPt))) {
		  	wnd.focus();
	  		var select = wnd.getSelection();
	  		select.removeAllRanges();
	  		select.addRange(retRange);
			var node = retRange.startContainer;
			while(!node.scrollIntoView){
				node = node.parentNode;
			}
	  		node.scrollIntoView(true);
	  	}
  	}
};
////////////////////////////////////////////////////////////////////////////
// start of api callback function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.callbackGetWord = function(theObject){
   if (theObject.id) {
        this._currentWordId = theObject.id;
        if (theObject.paraphrase && theObject.paraphrase.length>0) this._paraphrase = theObject.paraphrase;
        if (this._display) {
            if (this._currentWordId != "" && !this._editParaphrase) {
                var span = BW_getDoc().getElementById(this._nameParaphrase);
                span.innerHTML = this._paraphrase;
            }
        }
        this.updateLayout();
        this._api.getQuotes(this._currentWordId);
        this._loadingQuotes = true;
    }
};
BW_Layout.prototype.callbackGetQuotes = function(theObject){
	this._loadingQuotes = false;
    this._quotes = theObject;
    if (this._showingQuotes){
        this.hideQuotes();
        if (this._quotes.length > 0)
        	this.showQuotes();
    }
    this.checkCurrentParagraph();
    this.updateLayout();
};
BW_Layout.prototype.callbackBackWord = function(theObject){
	if (this._currentWordId == null && this._paraphrase == " "){
		this._currentWordId = theObject;
		this._api.backQuote(this._currentWordId, BW_getPage().top.document.URL, BW_getPage().top.document.title, this.getParagraph());
	}
	else{
		this._currentWordId = theObject;
	}
};
BW_Layout.prototype.callbackModifyQuotes = function(theObject){
	if (theObject)
	   	this._api.getQuotes(BW_LayoutOverlay._currentWordId);	
};
////////////////////////////////////////////////////////////////////////////
// start of firefox ui function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.clickStatus = function(e){
	if (e.button == 1 &&  !this.is_tbird){ //middle click
		if (this._enabled && this._usingAPI)
			gBrowser.selectedTab = gBrowser.addTab(this._apiWebUrl);		
		else
			gBrowser.selectedTab = gBrowser.addTab("http://groups.google.com/group/backword");		
	}
	else if (e.button == 0){ //left click
		this._enabled = !this._enabled;
		this._pref.setBoolPref(this._namePrefEnable, this._enabled);
		if (this._display) this.hide();
		this.updateStatusIcon();
	}
	else { //right click
		this._usingAPI = !this._usingAPI;
		if (this._usingAPI){
			if (this._usingLocalAPI && this._disableAPIByMulti){
				alert(this.getString("alert.multiwindow"));
				this._usingAPI = false;
				return;
			}
		}
		this._pref.setBoolPref(this._namePrefUsingAPI, this._usingAPI);
		this.updateStatusIcon();
	}
};
BW_Layout.prototype.updateStatusIcon = function(trans){
	var img =  document.getElementById(this._nameStatusImg);
	if (trans){
		if (this._usingAPI){
			img.src = "chrome://backword/skin/backWordTransG.gif";
		}
		else{
			img.src = "chrome://backword/skin/backWordTransR.gif";
		}
	}
	else if (this._enabled){
		if (this._usingAPI){
			img.src = "chrome://backword/skin/backWordG.gif";
		}
		else{
			img.src = "chrome://backword/skin/backWordL.gif";
		}
		img.setAttribute("tooltiptext", this.getString("status.tooltip.enabled"));
	}
	else{
		img.src = "chrome://backword/skin/backWordD.gif";
		img.setAttribute("tooltiptext", this.getString("status.tooltip.disabled"));
	}
};
BW_Layout.prototype.disable = function(){
	this._enabled = false;
	this._pref.setBoolPref(this._namePrefEnable, this._enabled);
	this.updateStatusIcon();
};
BW_Layout.prototype.disableAPI = function(){
	this._usingAPI = false;
	this._pref.setBoolPref(this._namePrefUsingAPI, this._usingAPI);
	this.updateStatusIcon();
};
////////////////////////////////////////////////////////////////////////////
// start of pref utility function
////////////////////////////////////////////////////////////////////////////
var BW_PrefHandler = 
{
	isExists : function (prefName, type)
	{
		type = (type == null) ? "char" : type;
		if (type == "char")
		{
			if (BW_LayoutOverlay._pref.getPrefType(prefName) == BW_LayoutOverlay._pref.PREF_STRING && jsUtils.trimWhitespace(BW_LayoutOverlay._pref.getCharPref(prefName).toString()) != "")
				return true;
			else
				return false;
		}
		else if (type == "bool")
		{
			try
			{
				var tempValue = BW_LayoutOverlay._pref.getBoolPref(prefName);
			}
			catch (ex)
			{
				return false;
			}
			return true;
		}
	}, 
	getPref : function (prefName, type)
	{
		type = (type == null) ? "char" : type;
		if (type == "char")
		{
			return BW_LayoutOverlay._pref.getCharPref(prefName).toString();
		}
		else if (type == "bool")
		{
			return BW_LayoutOverlay._pref.getBoolPref(prefName);
		}
	},
	setPref : function (prefName, value, type)
	{
		type = (type == null) ? "char" : type;
		if (type == "char")
		{
			BW_LayoutOverlay._pref.setCharPref(prefName, value);
		}
		else if (type == "bool")
		{
			BW_LayoutOverlay._pref.setBoolPref(prefName, value);
		}
	},
	setPrefIfNotExists : function (prefName, value, type)
	{
		type = (type == null) ? "char" : type;
		if (type == "char")
		{
			if (BW_LayoutOverlay._pref.getPrefType(prefName) != BW_LayoutOverlay._pref.PREF_STRING || (BW_LayoutOverlay._pref.getPrefType(prefName) == BW_LayoutOverlay._pref.PREF_STRING && jsUtils.trimWhitespace(BW_LayoutOverlay._pref.getCharPref(prefName).toString()) == ""))
			{
				   BW_LayoutOverlay._pref.setCharPref(prefName, value);
			}

		}
		else if (type == "bool")
		{
			try
			{
				var boolValue = BW_LayoutOverlay._pref.getBoolPref(prefName);
			}
			catch (ex)
			{
				BW_LayoutOverlay._pref.setBoolPref(prefName, value);
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////
// start of google autotranslation function
// all using of this part functions are not autherized
////////////////////////////////////////////////////////////////////////////
function BW_GoogleTranslate() {
    this._GTAvaliable = (Components.classes["@google.com/autotranslate;1"] != null);
    if (this._GTAvaliable){
	  	var dirsvc = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
	  	this.dictFileLocation = dirsvc.get("ProfD", Components.interfaces.nsIFile);
	  	this.dictFileLocation.append("GoogleToolbarData");
	  	if( ! this.dictFileLocation.exists()) {
	    	this.dictFileLocation.create(1, parseInt("0700", 8))}
	  	this.dictFileTmpLocation = this.dictFileLocation.clone();
	  	this.dictFileLocation.append("dict.dat");
	  	this.dictFileTmpLocation.append("dict.tmp");
	  	this.dictFileDownloads = 0;
	  	if(this.dictFileTmpLocation.exists()) {
	    	try {
	      		this.dictFileTmpLocation.remove(false)}
		    catch(e) {}
	  	}
	  	this.dictFileDownloading = false;
	  	this.dictFileReady = this.dictFileLocation.exists();
	}
}
BW_GoogleTranslate.prototype.getTranslate = function (text) {
    var response = "";
    try{
    	var tolang = BW_LayoutOverlay._tolang;
	    var host = "www.google.cn";
	    var lang = "en|" + tolang;
		if(this._GTAvaliable) {
			try{
				if (this.dictFileReady){
				    var xpcomobj = Components.classes["@google.com/autotranslate;1"];
				    var autotrans = xpcomobj.createInstance(Components.interfaces.GTBIAutoTranslate);
				    var langpair = "en2" + tolang;
				    var translation = autotrans.getTranslation(text, langpair);
				    if(translation) {
						return translation;
					}
				    else {
				    	if (autotrans.getTranslation("test", langpair) == null){
							this.downloadToLangDict(tolang);
				    	}
				    	else{
							return"";
				    	}
					}
				}
				else{
					this.downloadToLangDict(tolang);
				}
			}
			catch(e){}
		}
	    var url = BW_DictionaryUrl(host, text, lang, tolang);
	    var request = new XMLHttpRequest();
	    request.open("GET", url, false);
	    request.send(null);
	    if (request.status == 200) {
	    	if (/^zh/.test(tolang))
		        response = request.responseText.replace(/ /g, "");
		    else
		        response = request.responseText;
	    }
    }
    catch(e){
    	BW_ddump(e);
    	BW_LayoutOverlay.disable();
    	return "";
    }
    return response;
};
BW_GoogleTranslate.prototype.deleteDictFile = function() {
  this.dictFileReady = false;
  try {
    this.dictFileTmpLocation.remove(false)}
  catch(e) {
  }
  try {
    this.dictFileLocation.remove(false)}
  catch(e) {
  }
};
BW_GoogleTranslate.prototype.downloadToLangDict = function(to_lang) {
	  if(this.dictFileDownloading)return;
	  this.dictFileDownloading = true;
	  this.deleteDictFile();
	  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	  var downloader = Components.classes["@mozilla.org/network/downloader;1"].createInstance(Components.interfaces.nsIDownloader);
	  var url = "http://google.com/tools/toolbar/intl/" + to_lang + "/googledict.dat";
	  var channel = ios.newChannel(url, null, null);
	  var observer = new DictFileDownloadObserver(this);
	  downloader.init(observer, this.dictFileTmpLocation);
	  channel.asyncOpen(downloader, null)
};
function BW_ComposeUrl(prefix, host, restrict, searchStringTerms) {
    var parts = [];
    parts.push("http://");
    parts.push(prefix);
    parts.push(host.substr(3));
    parts.push("/");
    parts.push(restrict);
    parts.push("?");
    parts.push(searchStringTerms.join("&"));
    return parts.join("");
}
function BW_DictionaryUrl(host, text, lang, hl) {
    var queryParts = [];
    queryParts.push("sourceid=navclient-ff");
    queryParts.push("ie=UTF-8");
    queryParts.push("oe=UTF-8");
    queryParts.push("text=" + text);
    queryParts.push("langpair=" + lang);
    queryParts.push("hl=" + hl);
    queryParts.push("sig=8" + GPR_awesomeHash(text));
    return BW_ComposeUrl("www", host, "tbproxy/dictionary", queryParts);
}
var GPR_HASH_SEED = "Mining PageRank is AGAINST GOOGLE'S TERMS OF SERVICE. Yes, I'm talking to you, scammer.";
function GPR_awesomeHash(value) {
    var kindOfThingAnIdiotWouldHaveOnHisLuggage = 16909125;
    for (var i = 0; i < value.length; i++) {
        kindOfThingAnIdiotWouldHaveOnHisLuggage ^= GPR_HASH_SEED.charCodeAt(i % GPR_HASH_SEED.length) ^ value.charCodeAt(i);
        kindOfThingAnIdiotWouldHaveOnHisLuggage = kindOfThingAnIdiotWouldHaveOnHisLuggage >>> 23 | kindOfThingAnIdiotWouldHaveOnHisLuggage << 9;
    }
    return GPR_hexEncodeU32(kindOfThingAnIdiotWouldHaveOnHisLuggage);
}
function GPR_hexEncodeU32(num) {
    var result = GPR_toHex8(num >>> 24);
    result += GPR_toHex8(num >>> 16 & 255);
    result += GPR_toHex8(num >>> 8 & 255);
    return result + GPR_toHex8(num & 255);
}
function GPR_toHex8(num) {
    return (num < 16 ? "0" : "") + num.toString(16);
}
function DictFileDownloadObserver(translator) {
  this.translator = translator}

DictFileDownloadObserver.prototype = {onDownloadComplete:function(downloader, request, ctxt, status, result) {
  this.translator.dictFileDownloading = false;
  this.translator.dictFileDownloads ++ ;
  var failure = null;
  if( ! Components.isSuccessCode(status)) {
    failure = "unable to download dict file!"}
  else if( ! this.translator.dictFileTmpLocation.exists()) {
    failure = "new dict file not found!"}
  else if(this.translator.dictFileLocation.exists()) {
    failure = "unable to remove old dict file!"}
  if(failure == null) {
    try {
      this.translator.dictFileTmpLocation.copyTo(null, this.translator.dictFileLocation.leafName)}
    catch(e) {
    }
    if(this.translator.dictFileLocation.exists() && this.translator.dictFileLocation.isReadable()) {
      this.translator.dictFileReady = true}
    else {
      this.translator.dictFileReady = false}
  }
  else {
    this.translator.dictFileReady = false}
}

};
////////////////////////////////////////////////////////////////////////////
// start of dict.cn autotranslation function
// unautherized, originally published by Austiny as a maxthon plugin named dict.cn:
// see : http://forum.maxthon.com/index.php?showtopic=33167
////////////////////////////////////////////////////////////////////////////
function BW_DictcnTranslate() {
}
BW_DictcnTranslate.prototype.getTranslate = function (text) {
    var response = "";
    try{
	    var request = new XMLHttpRequest();
	    request.open("GET", "http://dict.cn/ws.php?q=" + text, false);
	    request.send(null);
	    var response = "";
	    if (request.status == 200) {
	    	text = request.responseText.replace(/&(?!(amp;))/g, "&amp;");
		    var re = /(\<\?\xml[0-9A-Za-z\D]*\?\>)/;
		    text = text.replace(re, "");
	        var dict = new XML(text);
	        var children = dict.children();
			for (var i=0; i<children.length(); i++){
				var child = children[i];
				if (child.name().toString() == "pron"){
					var pron = child.text().toString();
					response = '/'+ pron +'/  '+ response;
				}
				else if (child.name().toString() == "def"){
					var def= child.text().toString();
					if (def != "Not Found"){
						def = def.replace(/[\n ]/, "");
				        response += def;
					}
				}
			}
	    }
    }
    catch(e){
    	BW_ddump(e);
    	BW_LayoutOverlay.disable();
    	return "";
    }
    if (BW_LayoutOverlay._tw){
	    return BW_Simp_to_Trad(response);
    }
    else {
	    return response;
    }
};

// originally published by passerby. Thanks passerby!
function BW_Simp_to_Trad(strIn){
	var zhmap = TongWen.s_2_t;	
	
	strIn = strIn.replace(/[^\x00-\xFF]/g,  function(s){
				return ((s in zhmap)? zhmap[s]: s);
	});
	
	return 	strIn;
}
////////////////////////////////////////////////////////////////////////////
// start of local api function
////////////////////////////////////////////////////////////////////////////
var dirService = Components.classes["@mozilla.org/file/directory_service;1"]
	.getService(Components.interfaces.nsIProperties);
var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                                 .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
unicodeConverter.charset = "UTF-8";
var lineBreak = null;
function getLineBreak() {
  if (lineBreak == null) {
    // HACKHACK: Gecko doesn't expose NS_LINEBREAK, try to determine
    // plattform's line breaks by reading prefs.js
    lineBreak = "\n";
    try {
      var prefFile = dirService.get("PrefF", Components.interfaces.nsIFile);
      var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                                  .createInstance(Components.interfaces.nsIFileInputStream);
      inputStream.init(prefFile, 0x01, 0444, 0);

      var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
                                        .createInstance(Components.interfaces.nsIScriptableInputStream);
      scriptableStream.init(inputStream);
      var data = scriptableStream.read(1024);
      scriptableStream.close();

      if (/(\r\n?|\n\r?)/.test(data))
        lineBreak = RegExp.$1;
    } catch (e) {}
  }
  return lineBreak;
}
function getLineBreakLen(){
	if (lineBreak == null){
		return getLineBreak().length;
	}
	return lineBreak.length;
}
const verWords = "1.0";
const verQuotes = "1.0";
function BW_word(val){
	this.error = false;
	this.id = "";
	this.paraphrase = "";
	this.quotes = [];
	this.init = function(val){
		if (!val){
			this.error = true;
			return;
		}
		try{
	      	val = unicodeConverter.ConvertToUnicode(val);
			var contents = val.split("\x09");
			if (contents.length < 2){
				this.error = true;
				return;
			}
			this.id = contents[0];
			this.paraphrase = contents[1];
		}
		catch(e){
			this.error = true;
			return;
		}
	};
	this.init(val);
	this.toString = function(){
		var contents = new Array(this.id, this.paraphrase);
		return unicodeConverter.ConvertFromUnicode(contents.join("\x09"));
	}
	this.addQuote = function(quote, localAPI){
		for (var i=0; i<this.quotes.length; i++){
			localAPI._refQuotes[this.quotes[i].idxRef]._idxQuote++;
		}
		this.quotes.unshift(quote);
	}
}
function BW_quote(val, id){
	this.error = false;
	this.word = "";
	this.paragraph = "";
	this.url = "";
	this.title = "";
	this.id = id;
	this.idxRef = -1;
	this.init = function(val){
		if (val == null || this.id == null){
			this.error = true;
			return;
		}
		try{
	      	val = unicodeConverter.ConvertToUnicode(val);
			var contents = val.split("\x09");
			if (contents.length < 4){
				this.error = true;
				return;
			}
			this.word = contents[0];
			this.url = contents[1];
			this.title = contents[2];
			this.paragraph = contents[3];
		}
		catch(e){
			this.error = true;
			return;
		}
	};
	this.init(val);
	this.toString = function(){
		var contents = new Array(this.word , this.url , this.title , this.paragraph);
		return unicodeConverter.ConvertFromUnicode(contents.join("\x09"));
	}
}
function BW_refQuote(idxWord, idxQuote){
	this._idxWord = idxWord;
	this._idxQuote = idxQuote;
}
function BW_refWord(word, idxWord){
	this._word = word;
	this._idxWord = idxWord;
}
function BW_strCompare(str1, str2){
	if (str1 > str2) return 1;
	if (str2 > str1) return -1;
	return 0;
}
function BW_fill(str, len){
	if (str.length >= len){
		return str.substr(0, len);
	}
	else{
		return str + BW_space(len - str.length);
	}
}
function BW_space(len){
	var str = "                                                                                                                             ";
	while (str.length < len){
		str = str + str;
	}
	return str.substr(0, len);
}
function BW_LocalAPI(){
	this._path = BW_LayoutOverlay._pref.getCharPref(BW_LayoutOverlay._namePrefLocalAPIPath);
	this._lastQuoteId = 1;
	this._errReadWords = false;
	this._errReadQuotes = false;
	this._errWordsData = false;
	this._errQuotesData = false;
	this._outWords = null;
	this._outQuotes = null;
	this._verWords = "";
	this._verQuotes = "";
	this.load();
	this._errWrite = false;
	this.init();
	if (!this._errWrite){
		if (this._errReadWords){
			this.writeLineWords(verWords, 0);
		}
		if (this._errReadQuotes){
			this.writeLineQuotes(verQuotes, 0);
		}
	}
}
BW_LocalAPI.prototype.getWord = function(wrd){
	var word = this.findWord(wrd);
	if (word){
		BW_LayoutOverlay.callbackGetWord(word);
	}
};
BW_LocalAPI.prototype.backWord = function(wrd, paraphrase){
	var idxWord = this.findWordIdx(wrd);
	paraphrase = BW_trim(paraphrase);
	var word = null;
	if (idxWord >= 0){
		word = this._words[idxWord];
		word.paraphrase = paraphrase;
		this.saveWords();
	}
	else{
		word = new BW_word();
		word.id = wrd;
		word.paraphrase = paraphrase;
		word.error = false;
		var idxWord = this._words.push(word)-1;
		var refWord = new BW_refWord(word.id, idxWord);
		this._refWords.push(refWord);
		this._refWords.sort(this.sortWord);
		this.appendWord(word);
	}
	BW_LayoutOverlay.callbackBackWord(word.id);
};
BW_LocalAPI.prototype.backQuote = function(wrd, url, title, paragraph){
	var idxWord = this.findWordIdx(wrd);
	if (idxWord >= 0){
		var word = this._words[idxWord];
		var quote = new BW_quote();
		quote.error = false;
		quote.word = wrd;
		quote.url = url;
		quote.title = title;
		quote.paragraph = paragraph;
		quote.id = this._lastQuoteId++;
		word.addQuote(quote, this);
		var refQuote = new BW_refQuote(idxWord, 0);
		quote.idxRef = this._refQuotes.push(refQuote)-1;
		this.appendQuote(quote);
		BW_LayoutOverlay.callbackModifyQuotes(word);
	}
};
BW_LocalAPI.prototype.getQuotes = function(wrd){
	var word = this.findWord(wrd);
	if (word){
		BW_LayoutOverlay.callbackGetQuotes(word.quotes);
	}	
};
BW_LocalAPI.prototype.deleteWord = function(wrd){
	var idxRefWord = this.findWordRefIdx(wrd);
	if (idxRefWord >= 0){
		var idxWord = this._refWords[idxRefWord]._idxWord;
		var word = this._words[idxWord];
		this._words = this._words.slice(0, idxWord).concat(this._words.slice(idxWord+1));
		this._refWords = this._refWords.slice(0, idxRefWord).concat(this._refWords.slice(idxRefWord+1));
		this.saveWords();
	}
};
BW_LocalAPI.prototype.deleteQuote = function(wrd, id){
	var word = this.findWord(wrd);
	if (word){
	    var a=0, b=word.quotes.length-1;
	    var h;
	    var quote = null;
	    while (a <= b){
	        h = parseInt((a+b)/2);
	        var m = word.quotes[h].id - id;
	        if (m == 0){
				quote = word.quotes[h];
				break;
	        }
	        else if (m < 0){
	            b = h-1;
	        }
	        else{
	            a = h+1;
	        }
	    }
	    if (quote){
		    var index = quote.idxRef;
		    var offsetDecrease = quote.toString().length+1;
	    	for (var i=h+1; i<word.quotes.length; i++){
	    		this._refQuotes[word.quotes[i].idxRef]._idxQuote--;
	    	}
	    	for (var i=index+1; i<this._refQuotes.length; i++){
	    		var q = this._words[this._refQuotes[i]._idxWord].quotes[this._refQuotes[i]._idxQuote];
	    		q.idxRef--;
	    	}
		    word.quotes = word.quotes.slice(0, h).concat(word.quotes.slice(h+1));
		    this._refQuotes = this._refQuotes.slice(0, index).concat(this._refQuotes.slice(index+1))
			this.saveQuotes();
			BW_LayoutOverlay.callbackModifyQuotes(word);
	    }
	}
};
BW_LocalAPI.prototype.getEndOffset = function(stream){
	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
	seek.seek(2, 0);
	return seek.tell();
};
BW_LocalAPI.prototype.close = function(){
	BW_ddump("close");
	try{
		this._outWords.close();
		this._outWords = null;
	}
	catch(e){}
	try{
		this._outQuotes.close();
		this._outQuotes = null;
	}
	catch(e){}
};
BW_LocalAPI.prototype.init = function(){
	this._outWords = this.getOutputStream(this.getFile(this._path+"words"));
	this._outQuotes = this.getOutputStream(this.getFile(this._path+"quotes"));
	if (this._outWords == null || this._outQuotes == null){
		this._errWrite = true;
		this.close();
	}
};
BW_LocalAPI.prototype.load = function(path){
	if (!path){
		path = this._path;
	}
	this.loadWords(this.getInputStream(this.getFile(path+"words")));
	this.loadQuotes(this.getInputStream(this.getFile(path+"quotes")));
};
BW_LocalAPI.prototype.sortWord = function(a ,b){
	return BW_strCompare(a._word,  b._word);
};
BW_LocalAPI.prototype.loadWords = function(stream){
	this._words = [];
	this._refWords = [];
	if (stream){
      	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
      	seek.seek(0, 0);
      	stream = seek.QueryInterface(Components.interfaces.nsILineInputStream);
     	var line = {value: null};
     	//read version info
     	if (!stream.readLine(line)){
     		BW_ddump("read words version error");
     		this._errReadWords = true;
     		return;
     	}
     	this._verWords = line.value;
    	while (stream.readLine(line)) {
        	var val = line.value;
        	if (val != null){
	        	var word = new BW_word(val);
	        	if (!word.error){
	        		var idxWord = this._words.push(word)-1;
	        		var refWord = new BW_refWord(word.id, idxWord);
	        		this._refWords.push(refWord);
	         	}
	         	else{
	         		this._errWordsData = true;
	         	}
        	}
   		}
		this._refWords.sort(this.sortWord);
	}
	else{
 		BW_ddump("read words  error");
		this._errReadWords = true;
	}
};
BW_LocalAPI.prototype.loadQuotes = function(stream){
	this._refQuotes = [];
	if (stream){
//      	stream = stream.QueryInterface(Components.interfaces.nsILineInputStream);
      	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
      	seek.seek(0, 0);
     	var line = {value: null};
     	stream = seek.QueryInterface(Components.interfaces.nsILineInputStream);
     	//read version info
     	if (!stream.readLine(line)){
     		BW_ddump("read quotes version error");
     		this._errReadQuotes = true;
     		return;
     	}
     	this._verQuotes = line.value;
     	while (stream.readLine(line)) {
        	var val = line.value;
        	if (val != null && val.length > 0){
	        	var quote = new BW_quote(val, this._lastQuoteId++);
	        	if (!quote.error){
	        		var idxWord = this.findWordIdx(quote.word);
	        		if (idxWord >= 0){
	        			var word = this._words[idxWord];
	        			word.addQuote(quote, this);
	        			var refQuote = new BW_refQuote(idxWord, 0);
	        			quote.idxRef = this._refQuotes.push(refQuote)-1;
	        		}
	        	}
	        	else{
	        		this._errQuotesData = true;
	        	}
        	}
    	}
	}
	else{
 		BW_ddump("read quotes  error");
		this._errReadQuotes = true;
	}
};
BW_LocalAPI.prototype.saveWords = function(){
	var buf = [];
	buf.push(this._verWords);
	for (var i=0; i<this._words.length; i++){
		buf.push(this._words[i].toString());
	}
    buf = buf.join(getLineBreak()) + getLineBreak();
    var seek = this._outWords.QueryInterface(Components.interfaces.nsISeekableStream);
  	seek.seek(0, 0);
	seek.setEOF();
 	this._outWords.write(buf, buf.length);
};
BW_LocalAPI.prototype.saveQuotes = function(){
	var buf = [];
	buf.push(this._verQuotes);
	for (var i=0; i<this._refQuotes.length; i++){
		buf.push(this._words[this._refQuotes[i]._idxWord].quotes[this._refQuotes[i]._idxQuote].toString());
	}
    buf = buf.join(getLineBreak()) + getLineBreak();
    var seek = this._outQuotes.QueryInterface(Components.interfaces.nsISeekableStream);
  	seek.seek(0, 0);
	seek.setEOF();
 	this._outQuotes.write(buf, buf.length);
};
BW_LocalAPI.prototype.appendWord = function(word){
	var buf = word.toString() +getLineBreak();
	this._outWords.write(buf, buf.length);
};
BW_LocalAPI.prototype.appendQuote = function(quote){
	var buf = quote.toString() +getLineBreak();
	this._outQuotes.write(buf, buf.length);
};
BW_LocalAPI.prototype.writeLineWords = function(str, offset){
	BW_ddump("write word ("+offset+"):"+str);
	try{
		this.writeLine(str, offset, this._outWords);
	}
	catch(e){
		ddump(e);
	}
};
BW_LocalAPI.prototype.writeLineQuotes = function(str, offset){
	BW_ddump("write quote ("+offset+"):"+str);
	try{
		this.writeLine(str, offset, this._outQuotes);
	}
	catch(e){
		ddump(e);
	}
};
BW_LocalAPI.prototype.writeLine = function(str, offset, stream){
	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
	if (offset){
		seek.seek(0, offset);
	}
	else{
		seek.seek(2, 0);
	}
	seek.setEOF();
	str = unicodeConverter.ConvertFromUnicode(str + getLineBreak());
	stream = seek.QueryInterface(Components.interfaces.nsIFileOutputStream);
	stream.write(str, str.length);
};
BW_LocalAPI.prototype.findWord = function(word){
	var idx = this.findWordIdx(word);
	if (idx >= 0)
		return this._words[idx];
	else
	    return null;
};
BW_LocalAPI.prototype.findWordRefIdx = function(word){
    var a=0, b=this._refWords.length-1;
    var h = 0;
    while (a <= b){
        h =parseInt((a+b)/2);
        var m = BW_strCompare(this._refWords[h]._word, word);
        if (m == 0)
            return h;
        else if (m > 0){
            b = h-1;
        }
        else{
            a = h+1;
        }
    }
    return -1;
};
BW_LocalAPI.prototype.findWordIdx = function(word){
	var idx = this.findWordRefIdx(word);
	if (idx >= 0){
		return this._refWords[idx]._idxWord;
	}
	else
		return -1;
};
BW_LocalAPI.prototype.getInputStream = function(file){
    var stream = null;
    if (file) {
      stream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                         .createInstance(Components.interfaces.nsIFileInputStream);
      try {
        stream.init(file, 0x01, 0444, 0);
      }
      catch (e) {
        stream = null;
      }
    }
    return stream;
};
BW_LocalAPI.prototype.getOutputStream = function(file){
    try {
      file.normalize();
    }
    catch (e) {}
	if (!file.exists()){
	    // Try to create the file's directory recursively
	    var parents = [];
	    try {
	      for (var parent = file.parent; parent; parent = parent.parent) {
	        parents.push(parent);
	
	        // Hack for MacOS: parent for / is /../ :-/
	        if (parent.path == "/")
	          break;
	      }
	    } catch (e) {}
	    
	    for (i = parents.length - 1; i >= 0; i--) {
	      try {
	        parents[i].create(parents[i].DIRECTORY_TYPE, 0755);
	      } catch (e) {}
	    }
	}
	
    var stream = null;
    if (file) {
      stream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                            .createInstance(Components.interfaces.nsIFileOutputStream);
//      try {
		stream.init(file, 0x02 | 0x08 | 0x10 | 0x40, 0644, 0);
//      }
//      catch (e) {
//        stream = null;
//      }
    }
    BW_ddump(stream);
    return stream;
};
BW_LocalAPI.prototype.getFile = function(path) {
    try {
      // Assume a relative path first
      var file = Components.classes["@mozilla.org/file/local;1"]
                           .createInstance(Components.interfaces.nsILocalFile);
      file.initWithPath(path);
      return file;
    } catch (e) {}

    try {
      // Try relative path now
      var profileDir = dirService.get("ProfD", Components.interfaces.nsIFile);
      file = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
      file.setRelativeDescriptor(profileDir, path);
      return file;
    } catch (e) {}
	
    return null;
};
////////////////////////////////////////////////////////////////////////////
// start of api definition function
////////////////////////////////////////////////////////////////////////////
//This Function is derived from GPL code originally by Flock Inc:
function BW_API() {
    this.getWord = function (aWord) {
        var argArray = [BW_LayoutOverlay._apiUrl, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword, aWord];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.getWord(argArray), "getWord", BW_LayoutOverlay._currentWord);
    };
    this.backWord = function (aWord, aParaphrase) {
        var Word = 
        {
        	'word': aWord, 
        	'paraphrase': aParaphrase
        };
        var argArray = [BW_LayoutOverlay._apiUrl, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword, Word];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.backWord(argArray), "backWord", BW_LayoutOverlay._currentWord);
    };
    this.backQuote = function (aWordid, aUrl, aTitle, aParagraph) {
    	if (aParagraph.length <= BW_LayoutOverlay._currentWord.length)
    		return;
        var Quote = 
        {
        	'url': aUrl,
        	'title': aTitle,
        	'paragraph': aParagraph
        };
        var argArray = [BW_LayoutOverlay._apiUrl, aWordid, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword, Quote];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.backQuote(argArray), "backQuote", BW_LayoutOverlay._currentWord);
    };
    this.deleteWord = function (aWordid) {
        var argArray = [BW_LayoutOverlay._apiUrl, aWordid, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.deleteWord(argArray), "deleteWord", BW_LayoutOverlay._currentWord);
    };
    this.deleteQuote = function (aWordid, aQuoteid) {
        var argArray = [BW_LayoutOverlay._apiUrl, aQuoteid, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.deleteQuote(argArray), "deleteQuote", BW_LayoutOverlay._currentWord);
    };
    this.getQuotes = function (aWordid) {
        var argArray = [BW_LayoutOverlay._apiUrl, aWordid, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.getQuotes(argArray), "getQuotes", BW_LayoutOverlay._currentWord);
    };
    this.getWords = function (numberofwords, offset) {
    	if (numberofwords == null)
    		numberofwords = 50;
    	if (offset == null)
    		offset = 0;
        var argArray = [BW_LayoutOverlay._apiUrl, BW_LayoutOverlay._apiUsername, BW_LayoutOverlay._apiPassword, numberofwords, offset];
        BW_XMLCall.sendCommand(BW_LayoutOverlay._apiUrl, BW_APICalls.getWords(argArray), "getWords", BW_LayoutOverlay._currentWord);
    };
}
var BW_APICalls = new Object();
BW_APICalls = {getWord:function (myParams) {
    return bfXMLRPC.makeXML("bw.getWord", myParams);
}, backQuote:function (myParams) {
    return bfXMLRPC.makeXML("bw.backQuote", myParams);
}, getQuotes:function (myParams) {
    return bfXMLRPC.makeXML("bw.getQuotes", myParams);
}, backWord:function (myParams) {
    return bfXMLRPC.makeXML("bw.backWord", myParams);
}, getWords:function (myParams) {
    return bfXMLRPC.makeXML("bw.getWords", myParams);
}, deleteQuote:function (myParams) {
    return bfXMLRPC.makeXML("bw.deleteQuote", myParams);
}, deleteWord:function (myParams) {
    return bfXMLRPC.makeXML("bw.deleteWord", myParams);
}};


////////////////////////////////////////////////////////////////////////////
// start of api caller function
////////////////////////////////////////////////////////////////////////////
var BW_XMLCall = new Object();

//Send XMLRPC Command
BW_XMLCall.sendCommand = function (theURL, theXMLString, theAction, additionalInfo) { //Both arguments have to be strings
    if (BW_LayoutOverlay._usingAPI)
    	gMakeXMLCall(theURL, theXMLString, theAction, additionalInfo);
};
BW_XMLCall.replaceText = function (inString, oldText, newText) {
    return (inString.split(oldText).join(newText));
};
/*Had to bring out here, as a wierd bug in Firefox 1.0.6 won't let it be called from within,
unless synchronous, I need to file the bug!*/
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
function gMakeXMLCall(theURL, message, theAction, additionalInfo) {
//    BW_ddump(message);
//    BW_ddump(theURL);
    BW_LayoutOverlay.apiCall();
    try {
    	var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", theURL, true);
	    xmlhttp.onreadystatechange = function () {
	    	try{
		        if (xmlhttp.readyState == 4) {
		            if (xmlhttp.status == 200) { //We actually want to catch bad pages
				        BW_LayoutOverlay.apiSuccess();
		                BW_XMLCall.processData(xmlhttp.responseText, theAction, additionalInfo);
		            }
		        }
		    }
		    catch (e) {
		        BW_ddump(e);
		        BW_LayoutOverlay.apiError(e.name);
		        return;
		    }
	    };
	    xmlhttp.setRequestHeader("Content-Type", "text/xml");
	    xmlhttp.send(message);
	    xmlhttp.overrideMimeType("text/xml");
    }
    catch (e) {
        BW_ddump(e);
        BW_LayoutOverlay.apiError(e.name);
        return;
    }
}
var bfXMLRPC = new Object();
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
bfXMLRPC.makeXML = function (method, myParams) {
	var str = "<methodCall>";
//    var xml = <methodCall></methodCall>;
	str += "<methodName>" + method+ "</methodName>";
//    xml.methodName = method;
        //i->0 is the URL
        //dump("n makeXML Params: " + myParams)
    str += "<params>";
    for (var i = 1; i < myParams.length; i++) {
//        xml.params.param += <param> <value> { bfXMLRPC.convertToXML(myParams[i]) }</value> </param>;
        str += "<param><value>" + bfXMLRPC.convertToXML(myParams[i]).toXMLString() + "</value></param>";
    }
    str += "</params></methodCall>";
    BW_ddump(str);
        //"<?xml version="1.0"?>"
//        BW_ddump("XML:n " + xml.toXMLString());
        //var theBlogCharType = gbackwordUtil.getCharType();
    var theBlogCharType = "UTF-8";
    return "<?xml version=\"1.0\" encoding=\"" + theBlogCharType + "\" ?>" + str;
//    return "<?xml version=\"1.0\" encoding=\"" + theBlogCharType + "\" ?>" + xml.toXMLString();
};
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
bfXMLRPC.convertToXML = function (myParams) {
    //gPFFTempObject = myParams;
    var paramType = myParams.constructor.name;
    var paramTemp = null;
    switch (paramType) {
      case "Number"://12, 12.12, etc.
        if (myParams == parseInt(myParams)) {
            paramTemp = "<int>" + myParams + "</int>";
        } else {
            paramTemp = "<double>" + myParams + "</double>";
        }
        break;
      case "String"://"Some String", etc.
        if (myParams.toString() == "bool1") {
            paramTemp = "<boolean>1</boolean>";
        } else {
            if (myParams.toString() == "bool0") {
                paramTemp = "<boolean>0</boolean>";
            } else {
                paramTemp = "<string><![CDATA[" + myParams + "]]></string>";
            }
        }
        break;
      case "Boolean"://0,1, true, false
        paramTemp = "<boolean>" + myParams + "</boolean>";
        break;
      case "Date": //Date Object: var date = new Date();
        var theDate = bfXMLRPC.iso8601Format(myParams).toString();
        var theErrorString = "NaNNaNNaNTNaN:NaN:NaN";
        if (theDate != theErrorString) {
            paramTemp = "<dateTime.iso8601>" + theDate + "</dateTime.iso8601>";
        } else {
            paramTemp = "<dateTime.iso8601></dateTime.iso8601>";
        }
        break;
      case "Array": //Array Object
        var tempVal = "<array><data>";
        //for(var i=0;i<myParams.length;++i)
        for (var i = 0; i < myParams.length; i++) {
            //dump("n i: " + i + "n")
            tempVal += "<value>" + bfXMLRPC.convertToXML(myParams[i]) + "</value>";
        }
        tempVal += "</data></array>";
        paramTemp = tempVal;
        break;
      case "Object": //Array Object
        var tempVal = "<struct>";
        //for(var i=0;i<myParams.length;++i)
        for (x in myParams) {
//        	BW_ddump("x:"+x);
//        	BW_ddump("value:"+myParams[x]);
            if (myParams[x].constructor.name == "String") {
                tempVal += "<member><name>" + x + "</name>" + "<value><string><![CDATA[" + bfXMLRPC.convertToXML(myParams[x]) + "]]></string></value>" + "</member>";
            } else {
                if (myParams[x].constructor.name == "Date") {
                    var theDate = bfXMLRPC.iso8601Format(myParams[x]).toString();
                    var theErrorString = "NaNNaNNaNTNaN:NaN:NaN";
                    if (theDate != theErrorString) {
                        tempVal += "<member><name>" + x + "</name>" + "<value>" + "<dateTime.iso8601>" + theDate + "</dateTime.iso8601>" + "</value>" + "</member>";
                    } else {
                        tempVal += "<member><name>" + x + "</name>" + "<value>" + "<dateTime.iso8601></dateTime.iso8601>" + "</value>" + "</member>";
                    }
                } else {
                    if (myParams[x].constructor.name == "Number") {
                        if (myParams[x] == parseInt(myParams[x])) {
                            tempVal += "<member><name>" + x + "</name>" + "<value>" + "<int>" + bfXMLRPC.convertToXML(myParams[x]) + "</int>" + "</value>" + "</member>";
                        } else {
                            tempVal += "<member><name>" + x + "</name>" + "<value>" + "<double>" + bfXMLRPC.convertToXML(myParams[x]) + "</double>" + "</value>" + "</member>";
                        }
                    } else {
                        tempVal += "<member><name>" + x + "</name>" + "<value>" + bfXMLRPC.convertToXML(myParams[x]) + "</value>" + "</member>";
                    }
                }
            }
            //dump('Current tempVal: ' + tempVal + 'n');
        }
        tempVal += "</struct>";
        paramTemp = tempVal;
        break;
      default:
        paramTemp = "<![CDATA[" + myParams + "]]>";
        break;
    }
        
    //var paramObject = new XML("<string>" + myParams +"</string>");
    var paramObject = new XML(paramTemp);
    return paramObject;
}; 

//XMLToObject is derived from GPL code originally by Flock Inc:
//For the original source, see: http://cvs-mirror.flock.com/index.cgi/mozilla/browser/components/flock/xmlrpc/content/xmlrpchelper.js?rev=1.1&content-type=text/vnd.viewcvs-markup
bfXMLRPC.XMLToObject = function (xml) {
    try {
        if (xml.nodeKind()) {
            //foo
        }
    }
    catch (e) {
        //foo
        xml = new XML(xml);
    }
    //gPFFTempObject = xml;
    if (xml.nodeKind() == "text") {
            // the default type in string
        return xml.toString();
    }
    switch (xml.name().toString()) {
      case "int":
      case "i4":
        return parseInt(xml.text());
      case "boolean":
        return (parseInt(xml.text()) == 1);
      case "string":
        return (xml.text().toString());
      case "double":
        return parseFloat(xml.text());
      case "dateTime.iso8601":
        var val = xml.text().toString();
            //MSN Spaces hack for dates that look like: 2006-01-26T07:24:20Z
        val = val.replace(/\-/gi, "");
        val = val.replace(/\z/gi, "");
            //end MSN hack
        var dateutc = Date.UTC(val.slice(0, 4), val.slice(4, 6) - 1, val.slice(6, 8), val.slice(9, 11), val.slice(12, 14), val.slice(15));
            //alert('Date Val: ' + val + " RealDate: "+ new Date(dateutc));
        return new Date(dateutc);
      case "array":
        var arr = new Array();
        for (var i = 0; i < xml.data.value.length(); i++) {
            arr.push(bfXMLRPC.XMLToObject(xml.data.value[i].children()[0]));
        }
        return arr;
      case "struct":
        var struct = new Object();
        for (var i = 0; i < xml.member.length(); i++) {
            struct[xml.member[i].name.text()] = bfXMLRPC.XMLToObject(xml.member[i].value.children()[0]);
        }
        return struct;
      default:
            BW_ddump('error parsing XML');
        return null;
    }
};

//Function is derived from GPL code originally by Flock Inc:
//For more informationm See:
bfXMLRPC.iso8601Format = function (date) {
    var datetime = date.getUTCFullYear();
    var month = String(date.getUTCMonth() + 1);
    datetime += (month.length == 1 ? "0" + month : month);
    var day = date.getUTCDate();
    datetime += (day < 10 ? "0" + day : day);
    datetime += "T";
    var hour = date.getUTCHours();
    datetime += (hour < 10 ? "0" + hour : hour) + ":";
    var minutes = date.getUTCMinutes();
    datetime += (minutes < 10 ? "0" + minutes : minutes) + ":";
    var seconds = date.getUTCSeconds();
    datetime += (seconds < 10 ? "0" + seconds : seconds);
    return datetime;
};
  
////////////////////////////////////////////////////////////////////////////
// start of api process function
////////////////////////////////////////////////////////////////////////////
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
BW_XMLCall.processData = function (theXML, theAction, additionalInfo) {
    var ourParsedResponse = null;

    var re = /(\<\?\xml[0-9A-Za-z\D]*\?\>)/;
    var newstr = theXML.replace(re, "");
    var e4xXMLObject = new XML(newstr);
    if (e4xXMLObject.name() != "methodResponse" || !(e4xXMLObject.params.param.value.length() == 1 || e4xXMLObject.fault.value.struct.length() == 1)) {
        alert(BW_LayoutOverlay.getString("alert.apierror"));
    }
    if (e4xXMLObject.params.param.value.length() == 1) {
        ourParsedResponse = bfXMLRPC.XMLToObject(e4xXMLObject.params.param.value.children()[0]);
    }
    if (e4xXMLObject.fault.children().length() > 0) {
        ourParsedResponse = bfXMLRPC.XMLToObject(e4xXMLObject.fault.value.children()[0]);
    }
    this.lastResponseDataObject = ourParsedResponse;
    try {
        this.processReturnData(this.lastResponseDataObject, theAction, additionalInfo, newstr); //for all other calls
    }
    catch (e) {
        BW_ddump(e);
    }
};
BW_XMLCall.processReturnData = function (theObject, theAction, additionalInfo, theXML) {
    BW_ddump(theXML);
    BW_ddump(theAction + ":");
    BW_ddumpObject(theObject, "theObject", 3);
	if (theObject.faultString){
		BW_LayoutOverlay.apiError(theObject.faultString);
		return;
	}
	
    if (additionalInfo != BW_LayoutOverlay._currentWord) {
    	BW_ddump("outdated api return!");
        return;
    }
    else {
    	BW_LayoutOverlay.apiReturn();
    }
    
    if (theAction == "getWord") {
        BW_LayoutOverlay.callbackGetWord(theObject);
    } else {
        if (theAction == "backWord") {
			BW_LayoutOverlay.callbackBackWord(theObject);
        } else {
            if (theAction == "backQuote" || theAction == "deleteQuote") {
            	BW_LayoutOverlay.callbackModifyQuotes(theObject);
            } else {
                if (theAction == "getQuotes") {
                    BW_LayoutOverlay.callbackGetQuotes(theObject);
                }
            }
        }
    }
};
