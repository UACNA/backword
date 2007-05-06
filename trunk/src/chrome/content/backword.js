
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
var BW_debugOutput = false;	
//var BW_debugOutput = true;
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
	text = text.replace(new RegExp(getLineBreak(), "g"), "<BR />");
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
	return backword._currentDoc;
}
function BW_getPage() {
	return backword._currentWindow;
}
function BW_trim(string) {
	return string.replace(/(^\s+)|(\s+$)/g, "");
}
function BW_isAWord(string) {
	var i = 0;
	for (; i < string.length; i++) {
		if (!BW_isLetter(string.substr(i, 1))) {
			return false;
		}
	}
	return true;
}
function BW_isNotReviewPage(){
	return BW_getDoc().getElementById('backwordreviewpage') == null;
}
function BW_isLetter(string) {
	var valid_chars = /\w/;
	return valid_chars.test(string);
}
function BW_parseWord(str, offset){
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
	var word = str.substring(start, end);
	if (!word)
		return null;
	BW_ddump("word:"+word);
	return word.toLowerCase();
}
function BW_getSelectionText(target){
	var select = BW_getPage().getSelection();
	var selectedRanges = new Array;
	for (var i = 0; i < select.rangeCount; i++) {
		selectedRanges[i] = select.getRangeAt(i);
	}
	select.removeAllRanges();
	var range = target.ownerDocument.createRange();
	range.selectNode(target);
	select.addRange(range);
	var selection = select.toString();
	select.removeAllRanges();
	for (var i = 0; i < selectedRanges.length; i++) {
		select.addRange(selectedRanges[i]);
	}
	return selection;
}
function BW_parseSentence(selection, textContent, offsetTC){
	var ReSp=/\s/g;
	var offsetSL = offsetTC;
	//if selection and textContent has differenct letters, use textContent
	if (selection.replace(ReSp, "") != textContent.replace(ReSp, "")){
		selection = textContent;
	}
	var spSL = [];
	var spTC = [];
	while (ReSp.exec(selection) != undefined) {
	  spSL[spSL.length] = ReSp.lastIndex;
	}
	while (ReSp.exec(textContent) != undefined) {
	  spTC[spTC.length] = ReSp.lastIndex;
	}
	
	function relatedOffset(ar, offset, ar2){
		var offset2 = offset;
		for (var i=0; i<ar.length; i++)
			if (ar[i] <= offset) offset2--;
		for (var i=0; i<ar2.length; i++)
			if (ar2[i] <= offset2) offset2++;
		return offset2;
	}

	offsetSL = relatedOffset(spTC, offsetTC, spSL);
	
	var s;
	var start = 0;
	var end = selection.length;
	function getStart(ch, ret){
		s = selection.lastIndexOf(ch, offsetSL);
		if (!ret) s += ch.length;
		while(!ret && s >= ch.length && selection.charAt(s) != " "){
			s = selection.lastIndexOf(ch, s-ch.length-1) + ch.length;
		}
		if (s > start) {
			start = s;
		}
	}
	function getEnd(ch, ret){
		s = selection.indexOf(ch, offsetSL);
		if (!ret) s += ch.length;
		while(!ret && s < selection.length && s >= ch.length && selection.charAt(s) != " "){
			s = selection.indexOf(ch, s+1) + ch.length;
		}
		if (s < end && s >= ch.length) {
			end = s;
		}
	}
	getStart(".");
	getStart("?");
	getStart("!");
	getStart("\n", true);
	getEnd(".");
	getEnd("?");
	getEnd("!");
	getEnd("\n", true);
	
	if (start < 0) {
		start = 0;
	}
	else{
		start = relatedOffset(spSL, start, spTC);
	}
	if (end <= 0) {
		end = textContent.length;
	}	
	else{
		end = relatedOffset(spSL, end, spTC);
	}
	return BW_plainText(BW_trim(textContent.substring(start, end)));
}
function BW_makeShortString(src, key, len) {
	if (src.length <= len) {
		return src;
	}
	if (key.length <= 0) {
		return src.substr(0, len - 3) + "...";
	}
	var cut = src.length - len;
	var keyIndex = src.indexOf(key);
	if (keyIndex > (len - 3 - key.length) / 2) {
		if (keyIndex < (len - 6 - key.length) / 2 + key.length) {
			return "..." + src.substr(src.length - len + 3, len - 3);
		}
		return "..." + src.substr(keyIndex - (len - 6 - key.length) / 2, len - 6) + "...";
	}
	return src.substr(0, len - 3) + "...";
}
function BW_getTop(div) {
	return parseInt(div.style.top.substr(0, div.style.top.length - 2));
}
function BW_getLeft(div) {
	return parseInt(div.style.left.substr(0, div.style.left.length - 2));
}
function BW_createElement(type, father) {
	if (!father) {
		father = BW_getDoc();
	}
	var obj = father.createElement(type);
	return BW_setElementStyle(obj);
}
function BW_setElementStyle(obj) {
	obj.style.fontSize = (backword._size - 4) + "px!important";
	obj.style.fontWeight = "normal!important";
	obj.style.fontStyle = "normal!important";
	obj.style.fontFamily = "tahoma,宋体,arial,verdana,sans-serif";
	obj.style.fontSizeAdjust = "none!important";
	obj.style.fontStretch = "normal!important";
	obj.style.fontVariant = "normal!important";
	obj.style["float"] = "none!important"; 
	obj.style.margin = "0px 0px 0px 0px!important";
	obj.style.padding = "0px 0px 0px 0px!important";
//	obj.style.wordWrap = "break-word";
	obj.style.border = "0px !important";
	obj.style.lineHeight = backword._size + "px!important";
//	obj.style.verticalAlign = "middle!important";
//	if (obj.tagName.toUpperCase() != "SPAN") {
//	}
	if (obj.tagName.toUpperCase() == "DIV") {
		obj.style.overflow = "hidden !important";
		obj.style.whiteSpace = "nowrap !important";
	}
	else{
		obj.style.display = "inline!important";
	}
	if (obj.tagName.toUpperCase() == "IMG") {
		obj.style.maxWidth = "15px";
		obj.style.maxHeigth = "15px";
	}
	return obj;
}
function BW_defaultStyle() {
	var style = "font-size: " + (backword._size - 4) + "px!important;";
	style += "font-weight: normal!important;";
	style += "font-style: normal!important;";
	style += "font-family: tahoma,宋体,arial,verdana,sans-serif";
	style += "font-size-adjust: none;";
	style += "font-variant: normal;";
	style += "font-stretch: normal;";
	style += "overflow: hidden!important;";
	style += "margin: 0px 0px 0px 0px!important;";
	style += "padding: 0px 0px 0px 0px!important;";
	style += "float: none;";
	style += "border: 0px!important;";
//	style += "vertical-align: middle!important;";
	style += "line-height: " + (backword._size) + "px!important;";
	style += "display: inline!important;";
	return style;
}
////////////////////////////////////////////////////////////////////////////
// start of stemWord function
// Functions are derived from BCPL code originally by Andargor(http://www.andargor.com/):
// For the original source, see: http://www.tartarus.org/martin/PorterStemmer/
////////////////////////////////////////////////////////////////////////////
function BW_stemWord(w) {
	var c = "[^aeiou]";		 // consonant
	var v = "[aeiouy]";		 // vowel
	var C = c + "[^aeiouy]*";	// consonant sequence
	var V = v + "[aeiou]*";	 // vowel sequence
	var mgr0 = "^(" + C + ")?" + V + C;				// [C]VC... is m>0
	var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$"; // [C]VC[V] is m=1
	var mgr1 = "^(" + C + ")?" + V + C + V + C;		// [C]VCVC... is m>1
	var s_v = "^(" + C + ")?" + v;					// vowel in stem
	var stem;
	var suffix;
	var firstch;
	var origword = w;
	if (w.length < 3) {
		return w;
	}
	var re;
	var re2;
	var re3;
	var re4;

	// -s
	re = /^(.+?)(ss|i|ch|sh|x|o|v)es$/;
	re2 = /^(.+?)([^s])s$/;
	var plural = false;
	if (re.test(w)) {
		w = w.replace(re, "$1$2");
		plural = true;
	} else {
		if (re2.test(w)) {
			w = w.replace(re2, "$1$2");
			plural = true;
		} else {
		// -ed & -ing
			re = /^(.+?)eed$/;
			re2 = /^(.+?)(ed|ing)$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				re = new RegExp(mgr0);
				if (re.test(fp[1])) {
					re = /.$/;
					w = w.replace(re, "");
				}
			} else {
				if (re2.test(w)) {
					var fp = re2.exec(w);
					stem = fp[1];
					re2 = new RegExp(s_v);
					if (re2.test(stem)) {
						w = stem;
						re2 = /(at|bl|iz)$/;
						re3 = new RegExp("([^aeiouylsz])\\1$");
						re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
						if (re2.test(w)) {
							w = w + "e";
						} else {
							if (re3.test(w)) {
								re = /.$/;
								w = w.replace(re, "");
							} else {
								if (re4.test(w)) {
									w = w + "e";
								}
							}
						}
					}
				}
			}
		}
	}
	if (w == origword) {
		return origword;
	}
	// i to y & v to f
	re = /^(.+?)i$/;
	if (re.test(w)) {
		var fp = re.exec(w);
		stem = fp[1];
		w = stem + "y";
	} else {
		if (plural) {
		//v to f
			re = /^(.+?)v$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				w = stem + "f";
			}
		}
	}
//	BW_ddump("stem word "+origword+":"+w);	
	return w;
}


////////////////////////////////////////////////////////////////////////////
// start of Layout function
////////////////////////////////////////////////////////////////////////////
function BW_Layout(observe) {
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
	this._namePrefAutoBack = "backword.autoback";
	this._namePrefCurrentInstanceList = "backword.currentinstancelist";
	this._namePrefShowPronunciation = "backword.showpronunciation";
	this._namePrefQuoteSentence = "backword.quotesentence";
	this._namePrefShowPhonetics = "backword.showphonetics";
	this._namePrefCtrl = "backword.ctrl";
	this._quoteSentence = true;
	this._stringBundle = null;
	this._currentElementBorder = null;
	this._lastParagraph = null;
	this._lastWindow = null;
	this._enable = true;
	this._usingLocalAPI = true;
	this._showPronunciation = true;
	this._disableAPIByMulti = false;
//	this._toParseWord = null;
	this._timerShow = null;
	this._timerStatus = null;
	this._version = null;
	this._autoBack = false;
	this._deletingQuote = false;
	this._ctrl = false;
	this._tolang = "zh-CN";
	this._tw = false;
	this._size = 20;
	this._popDelay = 500;
	this._showPhonetics = false;
	this._pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	if (typeof(observe) == "undefined" || observe){
		var observerService = Components.
		  classes["@mozilla.org/observer-service;1"].
		  getService(Components.interfaces.nsIObserverService);
		
		observerService.addObserver(this, "bw_loadpref", false);	
		observerService.addObserver(this, "bw_review_page_opened", false);	
	}
}
BW_Layout.prototype.observe = function(aSubject, aTopic, aData){
	if (aTopic == "bw_loadpref" && aSubject != this){
		this.loadPref();
	}
	if (aTopic == "bw_review_page_opened"){
		Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService)
			.notifyObservers(this, 'bw_dictionary_changed', this._currentTranslator);
	}
};
BW_Layout.prototype.QueryInterface = function(aIID){
  if (!aIID.equals(Components.interfaces.nsIObserver) &&
      !aIID.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
};
BW_Layout.prototype.notify = function(){
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService)
		.notifyObservers(this, 'bw_dictionary_changed', this._currentTranslator);
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).notifyObservers(this, 'bw_loadpref', '');
};
BW_Layout.prototype.resetData = function () {
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
	this._currentOffset = 0;
	this._deletingQuote = false;
	if (this._timerShow) {
		clearTimeout(this._timerShow);
		this._timerShow = null;
	}
	if (this._timerStatus) {
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
BW_Layout.prototype.loadPref = function () {
	var translator = this._pref.getCharPref(this._namePrefTranslator);
	if (this._currentTranslator != translator) {
		this._currentTranslator = translator;
		if (translator.substr(0, 6) == "google") {
			if (translator.length > 6) {
				this._tolang = translator.substr(7);
			} else {
				this._tolang = "zh-CN";
				this._pref.setCharPref(this._namePrefTranslator, "google.zh-CN");
			}
			this._dictionary = new BW_GoogleTranslate(this._tolang);
		} else {
			this._tw = (translator == "dictcn.tw");
			this._dictionary = new BW_DictcnTranslate(this._tw);
		}
	}
	this._usingAPI = this._pref.getBoolPref(this._namePrefUsingAPI);
	var usingLocalAPI = this._pref.getBoolPref(this._namePrefUsingLocalAPI);
	if (!this._api || usingLocalAPI != this._usingLocalAPI) {
		this._usingLocalAPI = usingLocalAPI;
		if (usingLocalAPI) {
			this._api = new BW_LocalAPI();
		} else {
			if (backword._api) {
				this._api.close();
			}
			this._api = new BW_API();
		}
	}
//	var currentInstaceList = this._pref.getCharPref(this._namePrefCurrentInstanceList);
//	var id = 0;
//	var cil = [];
//	if (currentInstaceList.length > 0) {
//		cil = currentInstaceList.split(",");
////		BW_ddumpObject(cil, "cil");
//		if (cil.length > 0) {
//			try {
//				id = parseInt(cil[cil.length - 1]);
//			}
//			catch (e) {
//				id = 0;
//			}
//		}
//	}
//	if (this._id == null) {
//		this._id = id + 1;
//		cil.push(this._id.toString());
//		this._pref.setCharPref(this._namePrefCurrentInstanceList, cil.join(","));
//	} else {
//		if (this._usingLocalAPI) {
//			if (this._id == id && this._disableAPIByMulti) {
//				this._disableAPIByMulti = false;
//				this._usingAPI = true;
//			} else {
//				if (this._id < id) {
//					this._disableAPIByMulti = true;
//					this._usingAPI = false;
//				}
//			}
//		}
//	}
	this._searchWebUrl = BW_trim(this._pref.getCharPref(this._namePrefSearchWebUrl)).replace(/\n\n+/g, '\n').split('\n');
	this._apiUrl = this._pref.getCharPref(this._namePrefAPIUrl);
	this._apiWebUrl = this._pref.getCharPref(this._namePrefAPIWebUrl);
	this._apiUsername = this._pref.getCharPref(this._namePrefAPIUsername);
	this._autoBack = this._pref.getBoolPref(this._namePrefAutoBack);
	this._apiPassword = this._pref.getCharPref(this._namePrefAPIPassword);
	this._size = parseInt(this._pref.getCharPref(this._namePrefLayoutSize));
	this._enable = this._pref.getBoolPref(this._namePrefEnable);
	this._showPronunciation = this._pref.getBoolPref(this._namePrefShowPronunciation);
	this._showPhonetics = this._pref.getBoolPref(this._namePrefShowPhonetics);
	this._quoteSentence = this._pref.getBoolPref(this._namePrefQuoteSentence);
	this._listQuotesLimit = parseInt(this._pref.getCharPref(this._namePrefLayoutQuotes));
	this._maxMouseOut = parseInt(this._pref.getCharPref(this._namePrefLayoutMouseOut));
	this._popDelay = parseInt(this._pref.getCharPref(this._namePrefLayoutPopDelay));
	this._ctrl = this._pref.getBoolPref(this._namePrefCtrl);
	this.updateStatusIcon();
};
BW_Layout.prototype.appendDiv = function () {
//	BW_ddump("enter BW_Layout.appendDiv()");
	var div = BW_getDoc().getElementById(this._nameLayout);
	if (!div) {
		div = BW_createElement("DIV");
		div.id = this._nameLayout;
		div.style.position = "absolute";
		div.style.left = "0px";
		div.style.top = "-" + (this._size + 2) + "px";
		div.style.height = this._size + "px";
		div.style.zIndex = "32716";
		div.style.border = "1px solid #0043B3";
		div.style.borderBottomStyle = "outset";
		div.style.borderRightStyle = "outset";
		div.style.display = "none";
		div.style.color = "#002864!important";
		div.style.backgroundColor = "#D5E6FF";
		div.style.verticalAlign = "middle";
//		div.setAttribute('valign', 'middle');
		div.setAttribute("align", "absmiddle");
		BW_getDoc().body.appendChild(div);
	}
};
BW_Layout.prototype.getDiv = function (doc) {
	if (!doc) {
		doc = BW_getDoc();
	}
	var div = doc.getElementById(this._nameLayout);
	if (div) {
		return div;
	}
	backword.appendDiv();
	return doc.getElementById(this._nameLayout);
};
BW_Layout.prototype.getString = function (name) {
	if (!this._stringBundle) {
		this._stringBundle = document.getElementById("backwordstrings");
	}
	return this._stringBundle.getString(name);
};
BW_Layout.prototype.updateLayout = function () {
	if (this._currentWord) {
		if (!this._display) {
			this._display = true;
			if (this._usingAPI) {
				this.backWordButton();
				this.openPageButton();
			}
			this.searchWebButton();
			if (this._showPronunciation && this._isHTML) {
				this.cibaFlash();
			}
			this.untenseSpan();
			if (this._usingAPI) {
				this.paraphraseSpan();
				var bar = BW_createElement("SPAN");
				bar.textContent = "|";
				bar.style.color = "#002864";
				this.getDiv().appendChild(bar);
			}
			this.translateSpan();
			this.getDiv().style.display = "";
			BW_getPage().addEventListener("scroll", this.doScroll, false);
			BW_getPage().addEventListener("blur", this.doBlur, false);
		}
		if (this._quotes.length > 0 && !this._showQuotesButton) {
			this.showQuotesButton();
		} else {
			if (this._quotes.length == 0 && this._showQuotesButton) {
				this.getDiv().removeChild(this.getDiv().firstChild);
				this._showQuotesButton = false;
			}
		}
		this.updatePosition();
	}
};
BW_Layout.prototype.maybeShowTooltip = function (tipElement) {
	if (this._toReset) {
		this.resetData();
	}
//	this._toParseWord = null;
	var rangeParent = this._rangeParent;
	var offset = this._rangeOffset;
	if (!rangeParent) {
		return;
	}
	if (!this._enable || (this._visitingPreview && tipElement.ownerDocument == BW_getDoc().getElementById(this._namePreviewFrame).contentDocument)) {
		return;
	}
	if (this._display) {
		if (this._currentDoc == tipElement.ownerDocument) {
			return;
		} else {
			this.hide(this._currentDoc);
		}
	}
	if (rangeParent.parentNode != tipElement) {
		return;
	}
	if (rangeParent.nodeType != Node.TEXT_NODE) {
		return;
	}
//	this.loadPref();
	this._currentParent = rangeParent;
	var container = rangeParent.parentNode;
	if (container) {
		var foundNode = false;
		for (var c = container.firstChild; c != null; c = c.nextSibling) {
			if (c == rangeParent) {
				foundNode = true;
				break;
			}
		}
		if (!foundNode) {
			return;
		}
	}
	this._currentDoc = tipElement.ownerDocument;
	this._isHTML = (this._currentDoc.contentType == "text/html");
	this._currentWindow = this._currentDoc.defaultView;
	this._currentElement = tipElement;
	this._currentOffset = offset;
	this._currentCursorX = this._cursorX;
	this._currentCursorY = this._cursorY;
	var word = this.getCurrentWord(rangeParent, offset, tipElement);
	if (word){
		this.showTooltip(word);
	}
	return;
};
BW_Layout.prototype.showTooltip = function (word) {
	var tipElement = this._currentElement;
	try {
		this._originalWord = this._currentWord = word;
		this._untense = "";
		var select = BW_trim(BW_getPage().getSelection().toString()).toLowerCase();
		if (select.length > 3 && this._currentWord.indexOf(select) != -1) {
			this._currentWord = select;
			this._translate = this.getTranslate(this._currentWord);
		} else {
			this.untense();
			this._translate = this.getTranslate(this._currentWord);
			if (!this._translate && this._untense) {
				if (this._untense != "s") {
					this._currentWord += "e";
					this._translate = this.getTranslate(this._currentWord);
				} else {
					if (/f$/.test(this._currentWord)) {
						this._currentWord += "e";
						this._translate = this.getTranslate(this._currentWord);
						if (!this._translate) {
							this._currentWord = this._originalWord.substr(0, this._originalWord.length - 1);
							this._translate = this.getTranslate(this._currentWord);
						}
					}
				}
				if (!this._translate) {
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
	catch (e) {
		BW_ddump(e);
	}
};
BW_Layout.prototype.untense = function () {
	this._currentWord = BW_stemWord(this._currentWord);
	if (this._currentWord == this._originalWord) {
		return false;
	}
	var reSuf = /(s|ed|ing)$/;
	var match = reSuf.exec(this._originalWord);
	this._untense = match[0];
	return true;
};
BW_Layout.prototype.hide = function (doc) {
	try {
		if (!doc) {
			doc = BW_getDoc();
		}
		if (this._display) {
			doc.body.removeChild(doc.getElementById(this._nameLayout));
		} else {
			return;
		}
		if (this._showingQuotes) {
			doc.body.removeChild(doc.getElementById(this._nameQuotesDiv));
		}
		var detail = doc.getElementById(this._nameQuoteDetailDiv);
		if (detail) {
			doc.body.removeChild(detail);
		}
		var preview = doc.getElementById(this._namePreviewDiv);
		if (preview) {
			doc.body.removeChild(preview);
		}
	}
	catch (e) {
		BW_ddump(e);
	}
	this.resetStatus();
	this._toReset = true;
};
BW_Layout.prototype.doLoad = function (event) {
	backword.doLoadImpl(event);
};
BW_Layout.prototype.doLoadImpl = function (event) {
	this.loadPref();
//	BW_ddump("load" + this._id);
	if ("nsIAdblockPlus" in Components.interfaces) { //if Adblock Plus 0.7
		var abp = Components.classes["@mozilla.org/adblockplus;1"].createInstance(Components.interfaces.nsIAdblockPlus);
		abp.updateExternalSubscription("Backword", "Backword [www.gneheix.com]", ["@@|http://www.iciba.com/resource/a/en/*.swf"], 1);
	}
	this.is_tbird = (navigator.userAgent.search(/Thunderbird\/\d+/) != -1);
	if (!this.is_tbird) {
		gBrowser.addEventListener("load", this.doPageLoad, true);
	}
	this._version = this._pref.getCharPref(this._namePrefVersion);
};
BW_Layout.prototype.doUnload = function (event) {
	backword.doUnloadImpl(event);
};
BW_Layout.prototype.doUnloadImpl = function (event) {
	if (this._api){
		this._api.close();
	}
  var observerService = Components.
    classes["@mozilla.org/observer-service;1"].
    getService(Components.interfaces.nsIObserverService);

  observerService.removeObserver(this, "bw_loadpref");	
//	BW_ddump("unload" + this._id);
//	if (this._id != null) {
//		var currentInstaceList = this._pref.getCharPref(this._namePrefCurrentInstanceList);
//		var cil = currentInstaceList.split(",");
//		var id = 0;
//		for (var i = 0; i < cil.length; i++) {
//			try {
//				id = parseInt(cil[i]);
//				if (id == this._id) {
//					cil.splice(i, 1);
////					cil = cil.slice(0, i).concat(cil.slice(i + 1));
//					break;
//				}
//			}
//			catch (e) {
//			}
//		}
//		this._pref.setCharPref(this._namePrefCurrentInstanceList, cil.join(","));
//	}
};
//BW_Layout.prototype.doKeyDown = function(event){
//	backword.doKeyDownImpl(event);
//};
//BW_Layout.prototype.doKeyDownImpl = function(event){
//	BW_ddump(event.keyCode);
//	if (event.keyCode == 17 && this._toParseWord !== null && !this._display){
//		this.maybeShowTooltip(this._toParseWord);
//	}
//};
BW_Layout.prototype.doMouseMove = function (event) {
	backword.doMouseMoveImpl(event);
};
BW_Layout.prototype.doMouseMoveImpl = function (event) {
	this.updateCursorPosition(event);
	if (this._display) {
		if (!this._mouseDown && this.isMouseOut()) {
			this.hide();
		}
//		else{
//			BW_ddumpObject(this, "BW", 0);
//		}
	} else {
		if (this._enable) {
			this.killTimer();
			var element = event.target;
			if (!this._mouseDown) {
				this._timerShow = setTimeout(function (element) {
//					backword._toParseWord = element;
					if (!backword._ctrl || event.ctrlKey){
						backword.maybeShowTooltip(element);
						backword.updateStatusIcon();
					}
				}, this._popDelay, element);
				this._timerStatus = setTimeout(function () {
					if (!backword._ctrl || event.ctrlKey){
						backword.updateStatusIcon(true);
					}
				}, 100);
			}
		}
	}
};
BW_Layout.prototype.killTimer = function(){
	if (this._timerShow) {
		clearTimeout(this._timerShow);
		this._timerShow = null;
	}
	if (this._timerStatus) {
		clearTimeout(this._timerStatus);
		backword.updateStatusIcon();
		this._timerStatus = null;
	}
}
BW_Layout.prototype.doMouseDown = function (e) {
	backword.doMouseDownImpl(e);
};
BW_Layout.prototype.doMouseDownImpl = function (e) {
	this._mouseDown = true;
};
BW_Layout.prototype.doMouseOut = function (e) {
	backword.doMouseOutImpl(e);
};
BW_Layout.prototype.doMouseOutImpl = function (e) {
	this.killTimer();
};
BW_Layout.prototype.doMouseUp = function (e) {
	backword.doMouseUpImpl(e);
};
BW_Layout.prototype.doMouseUpImpl = function (e) {
	this._mouseDown = false;
};
BW_Layout.prototype.doScroll = function () {
	backword.doScrollImpl();
};
BW_Layout.prototype.doScrollImpl = function () {
	this.killTimer();
	if (this._display && !this._visitingPreview) {
		this.hide();
	}
};
BW_Layout.prototype.doBlur = function () {
	backword.doBlurImpl();
};
BW_Layout.prototype.doBlurImpl = function () {
	this.killTimer();
	if (this._display && !this._visitingPreview) {
		this.hide();
	}
};
BW_Layout.prototype.doPageLoad = function (event) {
	backword.doPageLoadImpl(event);
};
BW_Layout.prototype.doPageLoadImpl = function (event) {
	if (event.originalTarget instanceof HTMLDocument) {
		var doc = event.originalTarget;
		if (this.getBrowser(doc) == this._lastWindow) {
			this.highlight(doc.defaultView, this._lastParagraph);
		}
	}
	if (this._version != this.getString("version")) {
		if (!this._version) {
			alert(this.getString("alert.firsttime"));
		}
		this._version = this.getString("version");
		this._pref.setCharPref(this._namePrefVersion, this._version);
	}
};
BW_Layout.prototype.getBrowser = function (doc) {
	var win = doc && doc.defaultView;
	if (!win) {
		return null;
	}
	win = win.top;
	var browsers = gBrowser.browsers;
	var browser = null;
	for (var b = 0; b < browsers.length; ++b) {
		if (browsers[b].contentWindow == win) {
			browser = browsers[b];
			break;
		}
	}
	return browser;
};
BW_Layout.prototype.isMouseOut = function () {
	if (this._visitingPreview) {
		return false;
	}
	var offset = 0;
	var width = this.getDiv().offsetWidth;
	var height = this.getDiv().offsetHeight;
	var divX = this._divX - BW_getPage().pageXOffset;
	var divY = this._divY - BW_getPage().pageYOffset;
	if (this._showingQuotes) {
		height += BW_getDoc().getElementById(this._nameQuotesDiv).offsetHeight;
	}
//	BW_ddump("pix:"+this._cursorX+","+this._cursorY+","+this._divX+","+this._divY+","+div.offsetWidth+","+div.offsetHeight);
	if (this._cursorX < divX) {
		offset = divX - this._cursorX;
	} else {
		if (this._cursorX > divX + width) {
			offset = this._cursorX - divX - width;
		}
	}
	if (offset > this._maxMouseOut) {
		return true;
	}
	if (this._cursorY < divY) {
		offset = divY - this._cursorY;
	} else {
		if (this._cursorY > divY + height) {
			offset = this._cursorY - divY - height;
		}
	}
	return offset > this._maxMouseOut;
};
BW_Layout.prototype.updateCursorPosition = function (event) {
	this._rangeParent = event.rangeParent;
	this._rangeOffset = event.rangeOffset;
	this._cursorX = event.clientX;
	this._cursorY = event.clientY;
//	if (this._currentDoc != null && this._currentDoc != event.target.ownerDocument)
//		this.hide(this._currentDoc);
//	this._currentDoc = event.target.ownerDocument;
//	this._currentWindow = this._currentDoc.contentWindow;
//ie	this._cursorX = event.clientX;
//ie	this._cursorY = event.clientY;
};
BW_Layout.prototype.updatePosition = function () {
	var left = this._currentCursorX + 5;
	var div = this.getDiv();
	var quotes = BW_getDoc().getElementById(this._nameQuotesDiv);
	var width = div.offsetWidth;
	var height = div.offsetHeight;
	if (this._showingQuotes) {
		height += BW_getDoc().getElementById(this._nameQuotesDiv).offsetHeight - 1;
	}
	var innerWidth = BW_getPage().innerWidth;
	if (BW_getPage().scrollMaxY > 0) {
		innerWidth -= 16;
	}
	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) {
		innerHeight -= 16;
	}
	if (innerWidth - left < width) {
		left = innerWidth - width;
		if (left < 0) {
			left = 0;
		}
	}
//	BW_ddump(innerWidth+","+left+","+width+","+BW_getPage().pageXOffset);
	left += BW_getPage().pageXOffset;
	this._divX = left;
	div.style.left = left + "px";
	if (quotes) {
		quotes.style.left = left + "px";
	}
	var top = this._currentCursorY + 5;
	if (innerHeight - top < height) {
		top = innerHeight - height;
		if (top < 0) {
			top = 0;
		}
	}
	top += BW_getPage().pageYOffset;
	this._divY = top;
	div.style.top = top + "px";
	if (quotes) {
		quotes.style.top = (top + this._size + 1) + "px";
	}
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
//ie	var left = this._cursorX + document.documentElement.scrollLeft + document.body.scrollLeft;
//ie	var top = this._cursorY + document.documentElement.scrollTop + document.body.scrollTop;
	top += 5;
	if (document.documentElement.scrollHeight - this._cursorY < 10) {
		top -= 16;
	}
	this.getDiv().style.top = top;
	if (document.documentElement.scrollWidth - this._cursorX < getlen(def) + 20) {
//ie		left = (document.documentElement.scrollWidth + document.documentElement.scrollLeft + document.body.scrollLeft - getlen(def) - 20) - 5;
	}
	this.getDiv().style.left = left;
};*/
BW_Layout.prototype.getCurrentWord = function (rangeParent, offset, target) {
	var str = rangeParent.textContent;
	var word = BW_parseWord(str, offset);
	if (!word)
		return null;

	if (this.isSelected() && word.indexOf(BW_trim(BW_getPage().getSelection().toString().toLowerCase())) == -1){
		this._currentParagraph = BW_plainText(BW_trim(BW_getPage().getSelection().toString()));
	}
	else {
		var goParent="a i b strong em span ";
		if (goParent.indexOf(target.tagName.toLowerCase()+" ") >= 0){
			var children = target.childNodes;
			for (var i=0; i<children.length; i++){
				if (children[i] == rangeParent)
					break;
				else{
					offset += children[i].textContent.length;
				}
			}
			rangeParent = target;
			BW_ddump(offset);
			target = target.parentNode;
		}
		var selection = BW_getSelectionText(target);
		var textContent = target.textContent;
		if (this._quoteSentence){
			var children = target.childNodes;
			var pre = 0;
			var offsetTC = 0;
			//sometimes this fails
			for (var i=0; i<children.length; i++){
				if (children[i] == rangeParent)
					break;
				else{
					offsetTC += children[i].textContent.length;
				}
			}
			offsetTC += offset;
			this._currentParagraph = BW_parseSentence(selection, textContent, offsetTC);
			if (!new RegExp(word).test(this._currentParagraph)){
				this._currentParagraph = BW_parseSentence(BW_getSelectionText(rangeParent), rangeParent.textContent, offset, word);
			}
		}
		else{
			this._currentParagraph = BW_plainText(BW_trim(textContent));
		}
		BW_ddump("_currentParagraph:"+this._currentParagraph);
	}
	return word;
};
BW_Layout.prototype.isSelected = function(){
	return BW_getPage().getSelection().rangeCount > 0
		&& BW_getPage().getSelection().getRangeAt(0).isPointInRange(this._currentParent, this._currentOffset);
}
BW_Layout.prototype.checkCurrentParagraph = function () {
	if (this._quotes.length == 0) {
		this._currentQuoteId = null;
		return false;
	}
	var para = this._currentParagraph;
//	BW_ddump("para:"+para);
	var url = BW_getDoc().URL;
	for (var i = 0; i < this._quotes.length; i++) {
//		BW_ddump("---{n"+this._quotes[i].paragraph+"n}---");
		if (this._quotes[i].paragraph == para && this._quotes[i].url == url) {
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
		if (pic.getAttribute("src") != "chrome://backword/skin/apiCalling.gif") {
			pic.setAttribute("src", "chrome://backword/skin/apiCalling.gif");
		}
	}
};
BW_Layout.prototype.apiReturn = function () {
	this._apiCalling = false;
	var pic = BW_getDoc().getElementById(this._nameOpenPage);
	if (pic) {
		pic.setAttribute("src", "chrome://backword/skin/openPage.gif");
	}
};
BW_Layout.prototype.apiError = function (reason) {
	this._apiError = true;
	this._apiErrorCount++;
	if (this._apiErrorCount > this._maxAPIErrorCount) {
		this.disableAPI();
	}
	this._apiErorrReason = reason;
	this.apiReturn();
};
BW_Layout.prototype.apiSuccess = function () {
	this._apiError = false;
	this._apiErrorCount = 0;
	this._apiErrorReason = null;
};
////////////////////////////////////////////////////////////////////////////
// start of element generator function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.showQuotesButton = function () {
	var button = BW_createElement("IMG");
	button.setAttribute("src", "chrome://backword/skin/showQuotesD.gif");
	button.setAttribute("align", "absmiddle");
	button.id = this._nameShowQuotes;
	button.style.cursor = "pointer";
	button.style.backgroundColor = "#D5E6FF";
	button.setAttribute("title", this.getString("tooltip.showquotes"));
	this.getDiv().insertBefore(button, this.getDiv().firstChild);
	this._showQuotesButton = true;
	button.addEventListener("mouseover", this.mouseOverShowQuotes, true);
};
BW_Layout.prototype.mouseOverShowQuotes = function () {
	this.setAttribute("src", "chrome://backword/skin/showQuotesL.gif");
	backword.showQuotes();
};
BW_Layout.prototype.backWordButton = function () {
	var button = BW_createElement("IMG");
	button.setAttribute("src", "chrome://backword/skin/backWordD.gif");
	button.setAttribute("align", "absmiddle");
	button.style.backgroundColor = "#D5E6FF";
	button.id = this._nameBackWord;
	button.style.cursor = "pointer";
	this.getDiv().appendChild(button);
	button.addEventListener("mouseover", function () {
		backword.mouseOverBackWord(this);
	}, true);
	button.addEventListener("mouseout", function () {
		backword.mouseOutBackword(this);
	}, true);
	button.addEventListener("click", function () {
		backword.clickBackWord(false);
	}, true);
	this._currentElementBorder = this._currentElement.style.border;
};
BW_Layout.prototype.mouseOverBackWord = function (button) {
	if (this._apiCalling) {
		button.setAttribute("src", "chrome://backword/skin/backWordW.gif");
		button.setAttribute("title", this.getString("tooltip.apicalling"));
	} else {
		if (this._apiError) {
			button.setAttribute("src", "chrome://backword/skin/backWordE.gif");
			button.setAttribute("title", this.getString("tooltip.apierror") + this._apiErorrReason);
		} else {
			if (this._currentQuoteId) {
				button.setAttribute("src", "chrome://backword/skin/backWordR.gif");
				this.highlightQuote();
				button.setAttribute("title", this.getString("tooltip.deletequote"));
			} else {
				if (this._currentWordId) {
					button.setAttribute("src", "chrome://backword/skin/backWordG.gif");
					this.highlightQuote();
					button.setAttribute("title", this.getString("tooltip.backquote"));
				} else {
					button.setAttribute("src", "chrome://backword/skin/backWordL.gif");
					this.highlightQuote();
					button.setAttribute("title", this.getString("tooltip.backword") + ":" + this._currentWord);
				}
			}
		}
	}
};
BW_Layout.prototype.highlightQuote = function () {
	if (!this.isSelected()) {
		if (this._quoteSentence) {
			if (this._currentParagraph == BW_trim(this._currentElement.textContent)){
				var select = BW_getPage().getSelection();
				select.removeAllRanges();
				var range = this._currentDoc.createRange();
				var element = this._currentElement;
				while(element.childNodes.length == 1){
					element = element.childNodes[0];
				}
				range.selectNode(element);
				select.addRange(range);
			}
			else
				this.highlight(BW_getPage(), this._currentParagraph, true);
			return;
		}
		this._currentElement.style.border = "1px dashed blue";
	}
};
BW_Layout.prototype.mouseOutBackword = function (button) {
	button.setAttribute("src", "chrome://backword/skin/backWordD.gif");
	this._currentElement.style.border = this._currentElementBorder;
};
BW_Layout.prototype.clickBackWord = function (isAutoBack) {
	if (this._apiCalling || this._apiError) {
		return;
	}
	this._currentElement.style.border = this._currentElementBorder;
	if (this._currentQuoteId) {
		if (!isAutoBack){
			this._deletingQuote = true;
			this._api.deleteQuote(this._currentWordId, this._currentQuoteId);
		}
	} else {
		if (this._currentWordId == null) {
			this._api.backWord(this._currentWord, this._paraphrase);
		} else {
			this._api.backQuote(this._currentWordId, BW_getDoc().URL, BW_getPage().top.document.title || BW_getDoc().URL, this._currentParagraph);
		}
	}
};
BW_Layout.prototype.openPageButton = function () {
	var button = BW_createElement("IMG");
	button.setAttribute("align", "absmiddle");
	button.style.cursor = "pointer";
	button.style.backgroundColor = "#D5E6FF";
	button.setAttribute("title", this.getString(backword._usingLocalAPI?"tooltip.openreviewpage":"tooltip.openpage"));
	if (this._apiCalling) {
		button.setAttribute("src", "chrome://backword/skin/apiCalling.gif");
	} else {
		button.setAttribute("src", "chrome://backword/skin/openPage.gif");
	}
	button.id = this._nameOpenPage;
	button.addEventListener("click", openPage, false);
	function openPage() {
		var url = backword._usingLocalAPI?"chrome://backword/content/review.html":backword._apiWebUrl;
		if (!backword.is_tbird) {
			gBrowser.selectedTab = gBrowser.addTab(url);
		} else {
			window.open(url);
		}
		backword.hide();
	}
	this.getDiv().appendChild(button);
};
BW_Layout.prototype.searchWebButton = function () {
	function openPage() {
		var index = parseInt(this.getAttribute("index"));
		if (!isNaN(index)){
			gBrowser.addTab(backword._searchWebUrl[index] + backword._currentWord);
		}
		backword.hide();
	}
	for (var i=0; i<this._searchWebUrl.length; i++){
		var button = BW_createElement("IMG");
		button.setAttribute("align", "absmiddle");
		button.style.cursor = "pointer";
		button.style.backgroundColor = "#D5E6FF";
		button.setAttribute("title", this.getString("tooltip.searchweb") + ": " + BW_makeShortString(this._searchWebUrl[i], "http", 25));
		button.setAttribute("src", "chrome://backword/skin/searchWeb.gif");
		button.setAttribute("index", i);
		button.addEventListener("click", openPage, false);
		this.getDiv().appendChild(button);
	}
};
BW_Layout.prototype.paraphraseSpan = function () {
	var span = BW_createElement("SPAN");
	span.id = this._nameParaphrase;
	span.style.color = "#002864";
	span.setAttribute("title", this.getString("tooltip.paraphrase"));
	span.textContent = this._paraphrase;
	this.getDiv().appendChild(span);
	this.initParaphrase(span);
};
BW_Layout.prototype.translate = function () {
};
BW_Layout.prototype.initParaphrase = function (span) {
	span.addEventListener("mouseover", this.mouseOverParaphrase, true);
	span.addEventListener("mouseout", this.mouseOutParaphrase, true);
	span.addEventListener("click", this.clickParaphrase, true);
};
BW_Layout.prototype.mouseOverParaphrase = function () {
	if (backword._apiError || backword._apiCalling) {
		return;
	}
	this.style.backgroundColor = "#9DC2FF";
	this.style.border = "1px solid #0043B3";
};
BW_Layout.prototype.mouseOutParaphrase = function () {
	this.style.backgroundColor = "transparent";
	this.style.border = "none";
};
BW_Layout.prototype.clickParaphrase = function () {
	if (backword._apiError || backword._apiCalling) {
		return;
	}
	this.removeEventListener("click", backword.clickParaphrase, true);
	this.removeEventListener("mouseover", backword.mouseOverParaphrase, true);
	this.style.backgroundColor = "transparent";
	this.style.border = "none";
	var titleWidth = this.offsetWidth;
	if (titleWidth > backword.maxLengthInput()) {
		titleWidth = backword.maxLengthInput();
	}
	var input = BW_getDoc().createElement("INPUT");
//	obj.style.verticalAlign = "middle!important";
	input.setAttribute("type", "text");
	input.setAttribute("maxlength", "80");
	input.setAttribute("value", backword._paraphrase);
	input.style.width = titleWidth + "px";
	input.style.height = (backword._size - 2) + "px";
	input.style.color = "#002864";
	input.style.border = "1px solid #0048C1";
	input.style.backgroundColor = "#ECF3FF";
	BW_setElementStyle(input);
	input.setAttribute("title", backword.getString("tooltip.enterparaphrase"));
	this.textContent = "";
	this.appendChild(input);
	var div = BW_createElement("DIV");
	div.style.overflow = "hidden";
	div.style.width = "0px";
	div.style.height = "0px";
	var span = BW_createElement("SPAN");
	span.textContent = backword._paraphrase;
	span.id = backword._nameParaphraseWidth;
	div.appendChild(span);
	BW_getDoc().body.appendChild(div);
	backword._editingParaphrase = true;
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
	}
	function onInput(e) {
		var span = BW_getDoc().getElementById(backword._nameParaphraseWidth);
		span.textContent = this.value;
		var len = span.offsetWidth;
		var max = backword.maxLengthInput();
		if (len + 5 < max) {
			this.style.width = len + 5 + "px";
		} else {
			this.style.width = max + "px";
		}
	}
	function onblur(e) {
		this.value = BW_trim(this.value);
		if (this.value == "") {
			this.value = " ";
		}
		if (this.value != backword._paraphrase && !backword._apiCalling && !backword._apiError) {
			backword._paraphrase = this.value;
			backword._api.backWord(backword._currentWord, this.value);
		}
		backword.initParaphrase(this.parentNode);
		this.parentNode.textContent = this.value;
		backword._editingParaphrase = false;
	}
};
BW_Layout.prototype.maxLengthInput = function () {
	if (this._maxInputLength == 0) {
		var innerWidth = BW_getPage().innerWidth;
		if (BW_getPage().scrollMaxY > 0) {
			innerWidth -= 16;
		}
		//ignore pageOffsetX here because firefox 1.5 has a bug of calculate auto width of div
		this._maxInputLength = innerWidth - (BW_getLeft(this.getDiv()) + BW_getDoc().getElementById(this._nameParaphrase).offsetLeft + 250);
		if (this._maxInputLength < 50) {
			this._maxInputLength = 50;
		}
	}
	return this._maxInputLength;
};
BW_Layout.prototype.translateSpan = function () {
	var span = BW_createElement("SPAN");
	span.id = this._nameTranslate;
	span.style.color = "#002864";
	if (this._untense && this._translate.indexOf(this._currentWord) != 0) {
		var bSpan =  BW_createElement("SPAN");
//		bSpan.style.fontWeight = "bold";
//		bSpan.setAttribute("title", this.getString("tooltip.untense"));
		bSpan.textContent = this._currentWord+": ";
		span.appendChild(bSpan);
	}
	var trans = BW_createElement("SPAN");
	trans.innerHTML = this._translate;
	span.appendChild(trans);
	this.getDiv().appendChild(span);
};
BW_Layout.prototype.showQuotes = function () {
	if (this._showingQuotes) {
		return;
	}
	this._showingQuotes = true;
	var div = BW_getDoc().getElementById(this._nameQuotesDiv);
	if (!div) {
		div = BW_createElement("DIV");
		div.style.backgroundColor = "#e5f0ff";
		div.style.position = "absolute";
		div.style.display = "block!important";
		div.style.left = this.getDiv().style.left;
		div.style.top = (BW_getTop(this.getDiv()) + this._size + 1) + "px";
		var divWidth = this.getDiv().clientWidth;
		this._showQuoteDetailLeft = divWidth < 400;
		if (!this._showQuoteDetailLeft) divWidth -= 198;
		div.style.width = divWidth + "px";
		div.style.zIndex = "32714";
		div.style.border = "1px solid #517abf";
		div.style.lineHeight = this._size + "px!important";
//		div.style.overflow = "hidden!important";
		div.setAttribute("align", "left");
		div.id = this._nameQuotesDiv;
		BW_getDoc().body.appendChild(div);
	}
	while (div.hasChildNodes()) {
		div.removeChild(div.firstChild);
	}
	var i = 0;
	//if the buttons shown
	for (; i < this._quotes.length && i < this._listQuotesLimit; i++) {
		div.appendChild(this.showQuote(i));
	}
	if (this._quotes.length > this._listQuotesLimit) {
		div.lastChild.firstChild.setAttribute("src", "chrome://backword/skin/quoteItemN.gif");
		div.lastChild.firstChild.setAttribute("title", this.getString("tooltip.nextquote"));
		div.lastChild.firstChild.addEventListener("click", this.showNextQuote, false);
	}
	this.updateQuotesSize(i);
};
BW_Layout.prototype.hideQuotes = function () {
	if (!this._showingQuotes) {
		return;
	}
	this._showingQuotes = false;
	var div = BW_getDoc().getElementById(this._nameQuotesDiv);
	if (div) {
		BW_getDoc().body.removeChild(div);
	}
	div = BW_getDoc().getElementById(this._nameQuoteDetailDiv);
	if (div) {
		BW_getDoc().body.removeChild(div);
	}
};
BW_Layout.prototype.updateQuotesSize = function (itemCount) {
	var height = itemCount * this._size;
	BW_getDoc().getElementById(this._nameQuotesDiv).style.height = height + "px";
	this.updatePosition();
};
BW_Layout.prototype.showQuote = function (index) {
	if (this._quotes.length <= index) {
		return null;
	}
	var quote = this._quotes[index];
	var div = BW_createElement("DIV");
	div.style.height = this._size + "px";
	div.style.color = "#002864";
//	div.style.overflow = "hidden";
	var img = BW_createElement("IMG");
	if (index % 2 == 0) {
		img.setAttribute("src", "chrome://backword/skin/quoteItemB.gif");
		div.style.backgroundColor = "#e5f0ff";
	} else {
		div.style.backgroundColor = "#f4ffe5";
		img.setAttribute("src", "chrome://backword/skin/quoteItemG.gif");
	}
	img.style.verticalAlign = "top";
	img.style.backgroundColor = "";
	div.appendChild(img);
	var span = BW_createElement("SPAN");
	span.style.cursor = "pointer";
	span.addEventListener("click", clickQuote, false);
	span.addEventListener("mouseover", mouseOverQuote, false);
	span.addEventListener("mouseout", mouseOutQuote, false);
	function clickQuote(e) {
		window.content.status = null;
		if (e.ctrlKey && !backword.is_tbird) {
			var quote = backword._quotes[parseInt(this.id)];
			backword._lastParagraph = quote.paragraph;
			gBrowser.selectedTab = gBrowser.addTab(quote.url);
			backword._lastWindow = gBrowser.getBrowserForTab(gBrowser.selectedTab);
			BW_LayutOverlay._lastWindow.addEventListener("load", function () {
				backword.highlight(this, backword._lastParagraph);
			}, false);
			backword.hide();
		} else {
			backword.showPreview(parseInt(this.id));
		}
	}
	function mouseOverQuote() {
		var url = backword._quotes[parseInt(this.id)].url;
		if (url == BW_getDoc().URL)
			window.content.status = backword.getString("statusbar.highlight");
		else
			window.content.status = backword.getString("statusbar.openpage") + backword._quotes[parseInt(this.id)].url;
	}
	function mouseOutQuote() {
		window.content.status = null;
	}
	function mouseOverDiv(){
		var detail = BW_getDoc().getElementById(backword._nameQuoteDetailDiv);
		if (!detail) {
			detail = BW_createElement("div");
			detail.id = backword._nameQuoteDetailDiv;
			detail.style.position = "absolute";
			detail.style.width = "197px";
			detail.style.zIndex = "32715";
			detail.style.border = "1px solid #517abf";
			detail.style.display = "block";
			detail.style.color = "#002864";
			detail.style.overflow = "visible !important";
			detail.style.whiteSpace = "normal !important";
			detail.style.wordBreak = "break-all";
			detail.style.wordWrap = "break-word";
			detail.style.backgroundColor = "#f1f7ff";
			detail.setAttribute("align", "left");
			BW_getDoc().body.appendChild(detail);
		}
		backword.showQuoteDetail(backword._quotes[parseInt(this.id)].paragraph, backword._currentWord);
		backword.updateQuoteDetail();
	}
	var quotesDiv = BW_getDoc().getElementById(this._nameQuotesDiv);
	if (quote.title.length > 0) {
		span.textContent = quote.title;
		span.setAttribute("title", quote.title);
	} else {
		span.textContent = quote.paragraph;
		span.setAttribute("title", quote.paragraph);
	}
	span.style.textDecoration = "underline";
	div.appendChild(span);
	span.id = div.id = index;
	div.addEventListener("mouseover", mouseOverDiv, false);
	return div;
};
BW_Layout.prototype.openPage = function(pageUrl){
	var windowService = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var currentWindow = windowService.getMostRecentWindow("navigator:browser");
	if (currentWindow) {
		try {
		  currentWindow.delayedOpenTab(pageUrl);
		} catch(e) { currentWindow.loadURI(pageUrl); }
	}
	else
		window.open(pageUrl);
};
BW_Layout.prototype.showNextQuote = function () {
	if (backword._currentQuoteIndex < backword._quotes.length - backword._listQuotesLimit) {
		backword._currentQuoteIndex++;
		var quotes = BW_getDoc().getElementById(backword._nameQuotesDiv);
		quotes.removeChild(quotes.firstChild);
		quotes.lastChild.firstChild.setAttribute("src", "chrome://backword/skin/quoteItem" + ((parseInt(quotes.lastChild.id) % 2 == 0) ? "B" : "G") + ".gif");
		quotes.lastChild.firstChild.setAttribute("title", "");
		quotes.firstChild.firstChild.setAttribute("src", "chrome://backword/skin/quoteItemP.gif");
		quotes.firstChild.firstChild.setAttribute("title", backword.getString("tooltip.prevquote"));
		quotes.firstChild.firstChild.addEventListener("click", backword.showPrevQuote, false);
		var quoteNew = backword.showQuote(backword._currentQuoteIndex + backword._listQuotesLimit - 1);
		if (backword._currentQuoteIndex < backword._quotes.length - backword._listQuotesLimit) {
			quoteNew.firstChild.setAttribute("src", "chrome://backword/skin/quoteItemN.gif");
			quoteNew.firstChild.setAttribute("title", backword.getString("tooltip.nextquote"));
			quoteNew.firstChild.addEventListener("click", backword.showNextQuote, false);
		}
		quotes.appendChild(quoteNew);
	}
};
BW_Layout.prototype.showPrevQuote = function () {
	if (backword._currentQuoteIndex > 0) {
		backword._currentQuoteIndex--;
		var quotes = BW_getDoc().getElementById(backword._nameQuotesDiv);
		quotes.removeChild(quotes.lastChild);
		quotes.firstChild.firstChild.setAttribute("src", "chrome://backword/skin/quoteItem" + ((parseInt(quotes.firstChild.id) % 2 == 0) ? "B" : "G") + ".gif");
		quotes.firstChild.firstChild.setAttribute("title", "");
		quotes.lastChild.firstChild.setAttribute("src", "chrome://backword/skin/quoteItemN.gif");
		quotes.lastChild.firstChild.setAttribute("title", backword.getString("tooltip.nextquote"));
		quotes.lastChild.firstChild.addEventListener("click", backword.showNextQuote, false);
		var quoteNew = backword.showQuote(backword._currentQuoteIndex);
		if (backword._currentQuoteIndex > 0) {
			quoteNew.firstChild.setAttribute("src", "chrome://backword/skin/quoteItemP.gif");
			quoteNew.firstChild.setAttribute("title", backword.getString("tooltip.prevquote"));
			quoteNew.firstChild.addEventListener("click", backword.showPrevQuote, false);
		}
		quotes.insertBefore(quoteNew, quotes.firstChild);
	}
};
BW_Layout.prototype.showQuoteDetail = function (para, keyword) {
	var detail = BW_getDoc().getElementById(backword._nameQuoteDetailDiv);
	detail.textContent = "";
	var re;
	if (/f$/.test(keyword)){
		re = keyword.replace(/f$/, "") + "[fv](s|es|ies|d|ed|ied|ing){0,2}";
	}
	else{
		if (/[^aieouy]$/.test(keyword)) {
			re = keyword + "{1,2}(s|es|ies|d|ed|ied|ing){0,2}";
		} else {
			if (/[ey]$/.test(keyword)) {
				re = keyword + "?(s|es|ies|d|ed|ied|ing){0,2}";
			} else {
				re = keyword + "(s|es|ies|d|ed|ied|ing){0,2}";
			}
		}
	}
	para = BW_HTMLDecode(para);
	var paras = para.split("\n");
	var Reg = new RegExp(re, "gi");
	var arr = [];
	for (var i=0; i<paras.length; i++){
		if (i>0) detail.appendChild(BW_getDoc().createElement("BR"));
		para = paras[i];
		var start = 0;
		while((arr = Reg.exec(para)) != undefined){
			var hl = BW_createElement("SPAN");
			hl.style.background = "#ffb483";
			var wd = arr[0];
			hl.textContent = wd;
			detail.appendChild(BW_getDoc().createTextNode(para.substring(start, Reg.lastIndex - wd.length)));
			start = Reg.lastIndex;
			detail.appendChild(hl);
		}
		detail.appendChild(BW_getDoc().createTextNode(para.substring(start, para.length)));
	}
};
BW_Layout.prototype.updateQuoteDetail = function () {
	var list = BW_getDoc().getElementById(this._nameQuotesDiv);
	var div = BW_getDoc().getElementById(this._nameQuoteDetailDiv);
	var height = div.offsetHeight;
	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) {
		innerHeight -= 16;
	}
	var top = BW_getTop(this.getDiv()) - BW_getPage().pageYOffset;
	if (!this._showQuoteDetailLeft) {
		top += this._size + 1;
	}
	if (innerHeight - top < height) {
		div.style.zIndex = "32717";
		top = innerHeight - height;
		if (top < 0) {
			top = 0;
		}
	} else {
		div.style.zIndex = "32715";
	}
	top += BW_getPage().pageYOffset;
	div.style.top = top + "px";
	var left = BW_getLeft(list) + list.offsetWidth - 1 - BW_getPage().pageXOffset;
	if (this._showQuoteDetailLeft) {
		var innerWidth = BW_getPage().innerWidth;
		if (BW_getPage().scrollMaxY > 0) {
			innerWidth -= 16;
		}
		if (innerWidth - left < 199) {
			div.style.zIndex = "32717";
			left = left - list.offsetWidth - 197;
			if (left < 0) {
				left = 0;
			}
		}
	}
	left += BW_getPage().pageXOffset;
	div.style.left = left + "px";
};
BW_Layout.prototype.getTranslate = function (word) {
	return this._dictionary.getTranslate(word);
};
BW_Layout.prototype.cibaFlash = function () {
	var word = this._currentWord;
	var span = BW_createElement("span");
	span.style.marginTop = "2px!important";
	span.setAttribute("title", this.getString("tooltip.pronounce"));
	var flash = "http://www.iciba.com/resource/a/en/" + word.substr(0, 1) + "/" + word + ".swf";
	var html = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" width=\"10\" height=\"12\">";
	html += "<param name=\"movie\" value=\"" + flash + "\" /><param name=\"quality\" value=\"high\" /><param name=\"bgcolor\" value=\"#D5E6FF\" />";
	html += "<embed src=\"" + flash + "\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" bgcolor=\"#D5E6FF\" width=\"10\" height=\"12\"></embed></object>";
	span.innerHTML = html;
	this.getDiv().appendChild(span);
};
BW_Layout.prototype.untenseSpan = function () {
	if (!this._untense) {
		return;
	}
	this._selectedRanges = new Array;
	var select = BW_getPage().getSelection();
	for (var i = 0; i < select.rangeCount; i++) {
		this._selectedRanges[i] = select.getRangeAt(i);
	}
	if (this._untense != "s" && new RegExp("[^aeiouy]$").test(this._currentWord) && !(new RegExp("([^aeiouylsz])\\1(ed|ing)$").test(this._originalWord))) {
		var spanE = BW_createElement("SPAN");
		spanE.style.color = "#308040";
		spanE.style.cursor = "pointer";
		spanE.textContent = "-e";
		spanE.setAttribute("title", this.getString("tooltip.appende"));
		spanE.addEventListener("mouseover", mouseover, false);
		spanE.addEventListener("mouseout", mouseout, false);
		spanE.addEventListener("click", click, false);
		spanE.id = "e";
		this.getDiv().appendChild(spanE);
	}
	var span = BW_createElement("SPAN");
	span.style.color = "#308040";
	span.style.cursor = "pointer";
	span.textContent = "-" + this._untense;
	span.setAttribute("title", this.getString("tooltip.originalword"));
	span.addEventListener("mouseover", mouseover, false);
	span.addEventListener("mouseout", mouseout, false);
	span.addEventListener("click", click, false);
	span.id = this._untense;
	this.getDiv().appendChild(span);
	function mouseover(e) {
		this.stylecolor = "#803040";
		this.textContent = "+" + this.id;
	}
	function mouseout(e) {
		this.style.color = "#308040";
		this.textContent = "-" + this.id;
	}
	function click(e) {
		var div = backword.getDiv();
		var child = div.firstChild;
		while (child.nextSibling) {
			if (child == this) {
				div.removeChild(this);
				if (this.id == "e") {
					backword._currentWord += "e";
				} else {
					backword._currentWord = backword._originalWord;
				}
				break;
			} else {
				child = child.nextSibling;
			}
		}
		var word = backword._currentWord;
		var original = backword._originalWord;
		var X = backword._currentCursorX;
		var Y = backword._currentCursorY;
		var doc = backword._currentDoc;
		var win = backword._currentWindow;
		var para = backword._currentParagraph;
		var element = backword._currentElement;
		var offset = backword._currentOffset;
		var untense = backword._untense;
		backword.hide();
		backword.resetData();
//		backword.resetStatus();
		backword._currentWord = word;
		backword._originalWord = original;
		backword._currentCursorX = X;
		backword._currentCursorY = Y;
		backword._currentDoc = doc;
		backword._currentParagraph = para;
		backword._currentWindow = win;
		backword._currentElement = element;
		backword._currentOffset = offset;
		if (this.id == "e") {
			backword._untense = untense;
		}
		backword._translate = backword.getTranslate(backword._currentWord);
		if (backword._selectedRanges) {
			var select = BW_getPage().getSelection();
			for (var i = 0; i < backword._selectedRanges.length; i++) {
				select.addRange(backword._selectedRanges[i]);
			}
			if (this.id != "e") {
				backword._selectedRanges = null;
			}
		}
		backword.updateLayout();
		backword._api.getWord(backword._currentWord);
	}
	var bar = BW_createElement("SPAN");
	bar.textContent = "|";
	bar.style.color = "#002864";
	this.getDiv().appendChild(bar);
};
BW_Layout.prototype.showPreview = function (index) {
	if (BW_getDoc().URL == this._quotes[index].url) {
		this.highlight(BW_getPage(), this._quotes[index].paragraph);
		return;
	}
	var div = BW_getDoc().getElementById(this._namePreviewDiv);
	var frame = BW_getDoc().getElementById(this._namePreviewFrame);
	if (!div) {
		div = BW_createElement("DIV");
		div.id = this._namePreviewDiv;
		div.style.position = "absolute";
		div.style.zIndex = "32718";
		div.style.display = "none";
		div.style.border = "1px solid #0043B3";
		frame = BW_getDoc().createElement("IFRAME");
		frame.id = this._namePreviewFrame;
		frame.setAttribute("index", index);
		frame.style.overflow = "auto";
		frame.style.background = "white";
		frame.style.border = "0px";
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
BW_Layout.prototype.updatePreviewPosition = function (div) {
	var innerWidth = BW_getPage().innerWidth;
	if (BW_getPage().scrollMaxY > 0) {
		innerWidth -= 16;
	}
	var innerHeight = BW_getPage().innerHeight;
	if (BW_getPage().scrollMaxX > 0) {
		innerHeight -= 16;
	}
	var width = innerWidth / 2;
	var height = innerHeight / 2;
	div.style.width = width + "px";
	div.style.height = height + "px";
	if (this._cursorX >= width) {
		div.style.left = BW_getPage().pageXOffset + "px";
		div.style.width = this._cursorX + "px";
	} else {
		div.style.left = BW_getPage().pageXOffset + this._cursorX - 2 + "px";
		div.style.width = (innerWidth - this._cursorX) + "px";
	}
	if (this._cursorY >= height) {
		div.style.top = BW_getPage().pageYOffset + "px";
		div.style.height = this._cursorY + "px";
	} else {
		div.style.top = BW_getPage().pageYOffset + this._cursorY - 2 + "px";
		div.style.height = (innerHeight - this._cursorY) + "px";
	}
	div.style.display = "";
};
BW_Layout.prototype.loadPreview = function () {
	backword.highlight(this.contentWindow, backword._quotes[parseInt(this.getAttribute("index"))].paragraph);
};
BW_Layout.prototype.mouseOverPreview = function () {
	backword._visitingPreview = true;
};
BW_Layout.prototype.mouseOutPreview = function () {
	backword._visitingPreview = false;
};
BW_Layout.prototype.highlight = function (wnd, para, currentPage) {
	if (!wnd) {
		return false;
	}
	if (!currentPage){
		for (var i = 0; wnd.frames && i < wnd.frames.length; i++) {
			if (this.highlight(wnd.frames[i], para, currentPage))
				return true;
		}
	}
	var body = wnd.document.body;
	if (body == null) {
		return false;
	}
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
	var finder = Components.classes["@mozilla.org/embedcomp/rangefind;1"].createInstance().QueryInterface(Components.interfaces.nsIFind);
	finder.caseSensitive = false;
	if (!(retRange = finder.Find(para, searchRange, startPt, endPt))) {
		var paras = para.split("\n");
		retRange = finder.Find(paras[0], searchRange, startPt, endPt);
	}
	if (!retRange) return false;
	if (currentPage){
		var firstRange = retRange;
		while(retRange && !retRange.isPointInRange(this._currentParent, this._currentOffset)){
			retRange.collapse(false);
			retRange = finder.Find(para, searchRange, retRange, endPt);
		}
		if (!retRange) retRange = firstRange;
	}
	wnd.focus();
	var select = wnd.getSelection();
	select.removeAllRanges();
	select.addRange(retRange);
	if (!currentPage) {
		var node = retRange.startContainer;
		while (!node.scrollIntoView) {
			node = node.parentNode;
		}
		node.scrollIntoView(true);
	}
	return true;
};
////////////////////////////////////////////////////////////////////////////
// start of api callback function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.callbackGetWord = function (theObject) {
	if (theObject != null && theObject.id) {
		this._currentWordId = theObject.id;
		if (theObject.paraphrase && theObject.paraphrase.length > 0) {
			this._paraphrase = theObject.paraphrase;
		}
		if (this._display) {
			if (this._currentWordId != "" && !this._editParaphrase) {
				var span = BW_getDoc().getElementById(this._nameParaphrase);
				span.textContent = this._paraphrase;
			}
		}
		this.updateLayout();
		this._api.getQuotes(this._currentWordId);
		this._loadingQuotes = true;
	}
	else if (this._autoBack && this._display && BW_isNotReviewPage()){
		this.clickBackWord(true);
	}
};
BW_Layout.prototype.callbackGetQuotes = function (theObject) {
	this._loadingQuotes = false;
	this._quotes = theObject;
	if (this._showingQuotes) {
		this.hideQuotes();
		if (this._quotes.length > 0) {
			this.showQuotes();
		}
	}
	this.checkCurrentParagraph();
	this.updateLayout();
	if (this._autoBack && !this._deletingQuote && BW_isNotReviewPage()){
		this.clickBackWord(true);
	}
	this._deletingQuote = false;
};
BW_Layout.prototype.callbackBackWord = function (theObject) {
	if (this._currentWordId == null && this._paraphrase == " ") {
		this._currentWordId = theObject;
		this._api.backQuote(this._currentWordId, BW_getDoc().URL, BW_getPage().top.document.title || BW_getDoc().URL, this._currentParagraph);
	} else {
		this._currentWordId = theObject;
	}
};
BW_Layout.prototype.callbackModifyQuotes = function (theObject) {
	if (theObject) {
		this._api.getQuotes(backword._currentWordId);
	}
};
////////////////////////////////////////////////////////////////////////////
// start of firefox ui function
////////////////////////////////////////////////////////////////////////////
BW_Layout.prototype.clickStatus = function (e) {
	if (e.button == 1 && !this.is_tbird) { //middle click
		if (this._enable && this._usingAPI && !this._usingLocalAPI) {
			gBrowser.selectedTab = gBrowser.addTab(this._apiWebUrl);
		} else {
			gBrowser.selectedTab = gBrowser.addTab("http://groups.google.com/group/backword");
		}
	} else {
		if (e.button == 0) { //left click
			this._enable = !this._enable;
			this._pref.setBoolPref(this._namePrefEnable, this._enable);
			if (this._display) {
				this.hide();
			}
			this.updateStatusIcon();
			this.notify();
		}
	}
};
BW_Layout.prototype.updatePref = function (id, value, isChar){
	if (isChar){
		this._pref.setCharPref(id, value);
	}
	else{
		this._pref.setBoolPref(id, value);
	}
	this.loadPref();
	this.notify();
};
BW_Layout.prototype.popupMenu= function (menu) {
//	this.loadPref();
  var elements = {};
  var list = menu.getElementsByTagName("menuitem");
  for (var i = 0; i < list.length; i++)
    elements[list[i].id] = list[i];
	elements['bw-status-usingapi'].setAttribute('checked', this._usingAPI);
	elements['bw-status-usinglocalapi'].setAttribute('checked', this._usingLocalAPI);
	elements['bw-status-showpronunciation'].setAttribute('checked', this._showPronunciation);
	elements['bw-status-quotesentence'].setAttribute('checked', this._quoteSentence);
	elements['bw-status-ctrl'].setAttribute('checked', this._ctrl);
	elements['bw-status-autoback'].setAttribute('checked', this._autoBack);
	elements['bw-status-enable'].setAttribute('checked', this._enable);
	return true;
};
BW_Layout.prototype.popupDictionaryMenu= function (menu) {
  var elements = {};
  var list = menu.getElementsByTagName("menuitem");
  for (var i = 0; i < list.length; i++){
  	list[i].setAttribute('checked', false);
    elements[list[i].id] = list[i];
  }
	var translator = this._pref.getCharPref(this._namePrefTranslator);
	elements[translator].setAttribute('checked', true);
	return true;
};
BW_Layout.prototype.popupPagesMenu= function (menu) {
	var elements = {};
	var list = menu.getElementsByTagName("menuitem");
	for (var i = 0; i < list.length; i++){
		list[i].setAttribute('checked', false);
		elements[list[i].id] = list[i];
	}
	elements['page.api'].setAttribute('hidden', (!this._usingAPI || this._usingLocalAPI));
	elements['page.review'].setAttribute('hidden', (!this._usingAPI || !this._usingLocalAPI));
	return true;
};
BW_Layout.prototype.openOptions= function () {
  var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                                 .getService(Components.interfaces.nsIWindowMediator);
  var dlg = windowMediator.getMostRecentWindow("backword:settings");
  if (dlg){
  	dlg.focus();
  }
  else{
	  var browser = windowMediator.getMostRecentWindow("navigator:browser");
	  browser.openDialog("chrome://backword/content/options.xul", "_blank", "chrome,centerscreen");
  }
};
BW_Layout.prototype.updateStatusIcon = function (trans) {
	var img = document.getElementById(this._nameStatusImg);
	if (trans) {
		if (this._usingAPI) {
			img.src = "chrome://backword/skin/backWordTransG.gif";
		} else {
			img.src = "chrome://backword/skin/backWordTransR.gif";
		}
	} else {
		if (this._enable) {
			if (this._usingAPI) {
				img.src = "chrome://backword/skin/backWordG.gif";
			} else {
				img.src = "chrome://backword/skin/backWordL.gif";
			}
			img.setAttribute("tooltiptext", this.getString("status.tooltip.enabled"));
		} else {
			img.src = "chrome://backword/skin/backWordD.gif";
			img.setAttribute("tooltiptext", this.getString("status.tooltip.disabled"));
		}
	}
};
BW_Layout.prototype.disable = function () {
	this._enable = false;
	this._pref.setBoolPref(this._namePrefEnable, this._enable);
	this.updateStatusIcon();
};
BW_Layout.prototype.disableAPI = function () {
	this._usingAPI = false;
	this._pref.setBoolPref(this._namePrefUsingAPI, this._usingAPI);
	this.updateStatusIcon();
};
////////////////////////////////////////////////////////////////////////////
// start of google autotranslation function
// all using of this part functions are not autherized
////////////////////////////////////////////////////////////////////////////
function BW_GoogleTranslate(tolang) {
	this._tolang = tolang;
	this._GTAvaliable = (Components.classes["@google.com/autotranslate;1"] != null);
	if (this._GTAvaliable) {
		var dirsvc = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
		this.dictFileLocation = dirsvc.get("ProfD", Components.interfaces.nsIFile);
		this.dictFileLocation.append("GoogleToolbarData");
		if (!this.dictFileLocation.exists()) {
			this.dictFileLocation.create(1, parseInt("0700", 8));
		}
		this.dictFileTmpLocation = this.dictFileLocation.clone();
		this.dictFileLocation.append("dict.dat");
		this.dictFileTmpLocation.append("dict.tmp");
		this.dictFileDownloads = 0;
		if (this.dictFileTmpLocation.exists()) {
			try {
				this.dictFileTmpLocation.remove(false);
			}
			catch (e) {
			}
		}
		this.dictFileDownloading = false;
		this.dictFileReady = this.dictFileLocation.exists();
	}
}
BW_GoogleTranslate.prototype.getTranslate = function(text){
	var response  = this._getTranslate(text);
	if (response.length > 0 && backword._showPhonetics){
		response = BW_dict_cn.getTranslate(text).replace(/(^\/[^\/]*\/).*/, "$1") + response;
	}
	return response;
}
BW_GoogleTranslate.prototype._getTranslate = function (text) {
	var response = "";
	try {
		var tolang = this._tolang;
		var host = "www.google.cn";
		var lang = "en|" + tolang;
		if (this._GTAvaliable) {
			try {
				if (this.dictFileReady) {
					var xpcomobj = Components.classes["@google.com/autotranslate;1"];
					var autotrans = xpcomobj.createInstance(Components.interfaces.GTBIAutoTranslate);
					var langpair = "en2" + tolang;
					var translation = autotrans.getTranslation(text, langpair);
					if (translation) {
						return translation;
					} else {
						if (autotrans.getTranslation("test", langpair) == null) {
							this.downloadToLangDict(tolang);
						} else {
							return "";
						}
					}
				} else {
					this.downloadToLangDict(tolang);
				}
			}
			catch (e) {
			}
		}
		var url = BW_DictionaryUrl(host, text, lang, tolang);
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		if (request.status == 200) {
			if (/^zh/.test(tolang)) {
				response = request.responseText.replace(/ /g, "");
			} else {
				response = request.responseText;
			}
		}
	}
	catch (e) {
		BW_ddump(e);
		backword.disable();
		return "";
	}
	return response;
};
BW_GoogleTranslate.prototype.deleteDictFile = function () {
	this.dictFileReady = false;
	try {
		this.dictFileTmpLocation.remove(false);
	}
	catch (e) {
	}
	try {
		this.dictFileLocation.remove(false);
	}
	catch (e) {
	}
};
BW_GoogleTranslate.prototype.downloadToLangDict = function (to_lang) {
	if (this.dictFileDownloading) {
		return;
	}
	this.dictFileDownloading = true;
	this.deleteDictFile();
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var downloader = Components.classes["@mozilla.org/network/downloader;1"].createInstance(Components.interfaces.nsIDownloader);
	var url = "http://google.com/tools/toolbar/intl/" + to_lang + "/googledict.dat";
	var channel = ios.newChannel(url, null, null);
	var observer = new DictFileDownloadObserver(this);
	downloader.init(observer, this.dictFileTmpLocation);
	channel.asyncOpen(downloader, null);
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
	this.translator = translator;
}
DictFileDownloadObserver.prototype = {onDownloadComplete:function (downloader, request, ctxt, status, result) {
	this.translator.dictFileDownloading = false;
	this.translator.dictFileDownloads++;
	var failure = null;
	if (!Components.isSuccessCode(status)) {
		failure = "unable to download dict file!";
	} else {
		if (!this.translator.dictFileTmpLocation.exists()) {
			failure = "new dict file not found!";
		} else {
			if (this.translator.dictFileLocation.exists()) {
				failure = "unable to remove old dict file!";
			}
		}
	}
	if (failure == null) {
		try {
			this.translator.dictFileTmpLocation.copyTo(null, this.translator.dictFileLocation.leafName);
		}
		catch (e) {
		}
		if (this.translator.dictFileLocation.exists() && this.translator.dictFileLocation.isReadable()) {
			this.translator.dictFileReady = true;
		} else {
			this.translator.dictFileReady = false;
		}
	} else {
		this.translator.dictFileReady = false;
	}
}};
////////////////////////////////////////////////////////////////////////////
// start of dict.cn autotranslation function
// unautherized, originally published by Austiny as a maxthon plugin named dict.cn:
// http://forum.maxthon.com/index.php?showtopic=33167
////////////////////////////////////////////////////////////////////////////
function BW_DictcnTranslate(tw) {
	this._tw = tw;
}
BW_DictcnTranslate.prototype.getTranslate = function (text) {
	var response = "";
	try {
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
			for (var i = 0; i < children.length(); i++) {
				var child = children[i];
				if (child.name().toString() == "pron") {
					var pron = child.text().toString();
					response = "/" + pron + "/ ";
				} else {
					if (child.name().toString() == "def") {
						var def = child.text().toString();
						if (def != "Not Found") {
							def = def.replace(/[\n ]/, "");
							response += def;
						}
					}
				}
			}
		}
	}
	catch (e) {
		BW_ddump(e);
		backword.disable();
		return "";
	}
	if (this._tw) {
		return BW_Simp_to_Trad(response);
	} else {
		return response;
	}
};
var BW_dict_cn = new BW_DictcnTranslate();
// originally published by passerby. Thanks passerby!
function BW_Simp_to_Trad(strIn) {
	var zhmap = TongWen.s_2_t;
	strIn = strIn.replace(/[^\x00-\xFF]/g, function (s) {
		return ((s in zhmap) ? zhmap[s] : s);
	});
	return strIn;
}
////////////////////////////////////////////////////////////////////////////
// start of local api function
////////////////////////////////////////////////////////////////////////////
var dirService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
unicodeConverter.charset = "UTF-8";
var lineBreak = null;
function getLineBreak() {
	if (lineBreak == null) {
	// HACKHACK: Gecko doesn't expose NS_LINEBREAK, try to determine
	// plattform's line breaks by reading prefs.js
		lineBreak = "\n";
		try {
			var prefFile = dirService.get("PrefF", Components.interfaces.nsIFile);
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(prefFile, 1, 292, 0);
			var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			scriptableStream.init(inputStream);
			var data = scriptableStream.read(1024);
			scriptableStream.close();
			if (/(\r\n?|\n\r?)/.test(data)) {
				lineBreak = RegExp.$1;
			}
		}
		catch (e) {
		}
	}
	return lineBreak;
}
function getLineBreakLen() {
	if (lineBreak == null) {
		return getLineBreak().length;
	}
	return lineBreak.length;
}
var verWords = "1.0";
var verQuotes = "1.0";
function BW_word(val) {
	this.error = false;
	this.id = "";
	this.paraphrase = "";
	this.quotes = [];
	this.init = function (val) {
		if (!val) {
			this.error = true;
			return;
		}
		try {
			val = unicodeConverter.ConvertToUnicode(val);
			var contents = val.split("\t");
			if (contents.length < 2) {
				this.error = true;
				return;
			}
			this.id = contents[0];
			this.paraphrase = contents[1];
		}
		catch (e) {
			this.error = true;
			return;
		}
	};
	this.init(val);
	this.toString = function () {
		var contents = new Array(this.id, this.paraphrase);
		return unicodeConverter.ConvertFromUnicode(contents.join("\t"));
	};
	this.addQuote = function (quote, localAPI) {
		for (var i = 0; i < this.quotes.length; i++) {
			localAPI._refQuotes[this.quotes[i].idxRef]._idxQuote++;
		}
		this.quotes.unshift(quote);
	};
}
function BW_quote(val, id) {
	this.error = false;
	this.word = "";
	this.paragraph = "";
	this.url = "";
	this.title = "";
	this.id = id;
	this.idxRef = -1;
	this.init = function (val) {
		if (val == null || this.id == null) {
			this.error = true;
			return;
		}
		try {
			val = unicodeConverter.ConvertToUnicode(val);
			var contents = val.split("\t");
			if (contents.length < 4) {
				this.error = true;
				return;
			}
			this.word = contents[0];
			this.url = contents[1];
			this.title = contents[2];
			this.paragraph = contents[3];
		}
		catch (e) {
			this.error = true;
			return;
		}
	};
	this.init(val);
	this.toString = function () {
		var contents = new Array(this.word, this.url, this.title, this.paragraph);
		return unicodeConverter.ConvertFromUnicode(contents.join("\t"));
	};
}
function BW_refQuote(idxWord, idxQuote) {
	this._idxWord = idxWord;
	this._idxQuote = idxQuote;
}
function BW_refWord(word, idxWord) {
	this._word = word;
	this._idxWord = idxWord;
}
function BW_strCompare(str1, str2) {
	if (str1 > str2) {
		return 1;
	}
	if (str2 > str1) {
		return -1;
	}
	return 0;
}
function BW_fill(str, len) {
	if (str.length >= len) {
		return str.substr(0, len);
	} else {
		return str + BW_space(len - str.length);
	}
}
function BW_space(len) {
	var str = "																															 ";
	while (str.length < len) {
		str = str + str;
	}
	return str.substr(0, len);
}
function BW_LocalAPI(path) {
	if (path){
		this._path = path;
	}
	else{
		this._path = backword._pref.getCharPref(backword._namePrefLocalAPIPath);
	}
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
	if (!this._errWrite) {
		if (this._errReadWords) {
			this.writeLineWords(verWords, 0);
		}
		if (this._errReadQuotes) {
			this.writeLineQuotes(verQuotes, 0);
		}
	}
  var observerService = Components.
    classes["@mozilla.org/observer-service;1"].
    getService(Components.interfaces.nsIObserverService);

  observerService.addObserver(this, "bw_load_storage", false);	
}
BW_LocalAPI.prototype.observe = function(aSubject, aTopic, aData){
	if (aTopic == "bw_load_storage" && aSubject != this){
		this.load();
	}
};
BW_LocalAPI.prototype.QueryInterface = function(aIID){
  if (!aIID.equals(Components.interfaces.nsIObserver) &&
      !aIID.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
};
BW_LocalAPI.prototype.notify = function(){
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).notifyObservers(this, 'bw_load_storage', '');
};
BW_LocalAPI.prototype.getWord = function (wrd) {
	backword.callbackGetWord(this.findWord(wrd));
};
BW_LocalAPI.prototype.backWord = function (wrd, paraphrase) {
	var idxWord = this.findWordIdx(wrd);
	paraphrase = BW_trim(paraphrase);
	var word = null;
	if (idxWord >= 0) {
		word = this._words[idxWord];
		word.paraphrase = paraphrase;
		this.saveWords();
	} else {
		word = new BW_word();
		word.id = wrd;
		word.paraphrase = paraphrase;
		word.error = false;
		var idxWord = this._words.push(word) - 1;
		var refWord = new BW_refWord(word.id, idxWord);
		this._refWords.push(refWord);
		this._refWords.sort(this.sortWord);
		this.appendWord(word);
	}
	backword.callbackBackWord(word.id);
};
BW_LocalAPI.prototype.backQuote = function (wrd, url, title, paragraph) {
	var idxWord = this.findWordIdx(wrd);
	if (idxWord >= 0) {
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
		quote.idxRef = this._refQuotes.push(refQuote) - 1;
		this.appendQuote(quote);
		backword.callbackModifyQuotes(word);
	}
};
BW_LocalAPI.prototype.getQuotes = function (wrd) {
	var word = this.findWord(wrd);
	if (word) {
		backword.callbackGetQuotes(word.quotes);
	}
};
BW_LocalAPI.prototype.deleteWord = function (wrd) {
	var idxRefWord = this.findWordRefIdx(wrd);
	if (idxRefWord >= 0) {
		var idxWord = this._refWords[idxRefWord]._idxWord;
		var word = this._words[idxWord];
		for(var index=word.quotes.length-1; index>=0; index--) {
			this._deleteQuote(word, word.quotes[index], index);
		}
		this._words.splice(idxWord, 1);
//		this._words = this._words.slice(0, idxWord).concat(this._words.slice(idxWord + 1));
		this._refWords.splice(idxRefWord, 1);
//		this._refWords = this._refWords.slice(0, idxRefWord).concat(this._refWords.slice(idxRefWord + 1));
		this.saveWords();
	}
};
BW_LocalAPI.prototype.deleteQuote = function (wrd, id, callback) {
	if (typeof(callback) == "undefined"){
		callback = true;
	}
	var word = this.findWord(wrd);
	if (word) {
		var a = 0, b = word.quotes.length - 1;
		var h;
		var quote = null;
		while (a <= b) {
			h = parseInt((a + b) / 2);
			var m = word.quotes[h].id - id;
			if (m == 0) {
				quote = word.quotes[h];
				break;
			} else {
				if (m < 0) {
					b = h - 1;
				} else {
					a = h + 1;
				}
			}
		}
		if (quote) {
			this._deleteQuote(word, quote, h);
			if (callback)
				backword.callbackModifyQuotes(word);
		}
	}
};
BW_LocalAPI.prototype._deleteQuote = function (word, quote, h){
	var index = quote.idxRef;
	var offsetDecrease = quote.toString().length + 1;
	for (var i = h + 1; i < word.quotes.length; i++) {
		this._refQuotes[word.quotes[i].idxRef]._idxQuote--;
	}
	for (var i = index + 1; i < this._refQuotes.length; i++) {
		var q = this._words[this._refQuotes[i]._idxWord].quotes[this._refQuotes[i]._idxQuote];
		q.idxRef--;
	}
	word.quotes.splice(h, 1);
//			word.quotes = word.quotes.slice(0, h).concat(word.quotes.slice(h + 1));
	this._refQuotes.splice(index, 1);
//			this._refQuotes = this._refQuotes.slice(0, index).concat(this._refQuotes.slice(index + 1));
	this.saveQuotes();
};
BW_LocalAPI.prototype.getEndOffset = function (stream) {
	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
	seek.seek(2, 0);
	return seek.tell();
};
BW_LocalAPI.prototype.close = function () {
	try {
		this._outWords.close();
		this._outWords = null;
	}
	catch (e) {
	}
	try {
		this._outQuotes.close();
		this._outQuotes = null;
	}
	catch (e) {
	}
  var observerService = Components.
    classes["@mozilla.org/observer-service;1"].
    getService(Components.interfaces.nsIObserverService);

  observerService.removeObserver(this, "bw_load_storage");
};
BW_LocalAPI.prototype.init = function () {
	this._outWords = this.getOutputStream(this.getFile(this._path + "words"));
	this._outQuotes = this.getOutputStream(this.getFile(this._path + "quotes"));
	if (this._outWords == null || this._outQuotes == null) {
		this._errWrite = true;
		this.close();
	}
};
BW_LocalAPI.prototype.load = function (path) {
	if (!path) {
		path = this._path;
	}
	this.loadWords(this.getInputStream(this.getFile(path + "words")));
	this.loadQuotes(this.getInputStream(this.getFile(path + "quotes")));
};
BW_LocalAPI.prototype.sortWord = function (a, b) {
	return BW_strCompare(a._word, b._word);
};
BW_LocalAPI.prototype.loadWords = function (stream) {
	this._words = [];
	this._refWords = [];
	if (stream) {
		var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
		seek.seek(0, 0);
		stream = seek.QueryInterface(Components.interfaces.nsILineInputStream);
		var line = {value:null};
	 	//read version info
		if (!stream.readLine(line)) {
			BW_ddump("read words version error");
			this._errReadWords = true;
			return;
		}
		this._verWords = line.value;
		while (stream.readLine(line)) {
			var val = line.value;
			if (val != null) {
				var word = new BW_word(val);
				if (!word.error) {
					var idxWord = this._words.push(word) - 1;
					var refWord = new BW_refWord(word.id, idxWord);
					this._refWords.push(refWord);
				} else {
					this._errWordsData = true;
				}
			}
		}
		this._refWords.sort(this.sortWord);
	} else {
		BW_ddump("read words error");
		this._errReadWords = true;
	}
};
BW_LocalAPI.prototype.loadQuotes = function (stream) {
	this._refQuotes = [];
	if (stream) {
//	 	stream = stream.QueryInterface(Components.interfaces.nsILineInputStream);
		var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
		seek.seek(0, 0);
		var line = {value:null};
		stream = seek.QueryInterface(Components.interfaces.nsILineInputStream);
	 	//read version info
		if (!stream.readLine(line)) {
			BW_ddump("read quotes version error");
			this._errReadQuotes = true;
			return;
		}
		this._verQuotes = line.value;
		while (stream.readLine(line)) {
			var val = line.value;
			if (val != null && val.length > 0) {
				var quote = new BW_quote(val, this._lastQuoteId++);
				if (!quote.error) {
					var idxWord = this.findWordIdx(quote.word);
					if (idxWord >= 0) {
						var word = this._words[idxWord];
						word.addQuote(quote, this);
						var refQuote = new BW_refQuote(idxWord, 0);
						quote.idxRef = this._refQuotes.push(refQuote) - 1;
					}
				} else {
					this._errQuotesData = true;
				}
			}
		}
	} else {
		BW_ddump("read quotes error");
		this._errReadQuotes = true;
	}
};
BW_LocalAPI.prototype.saveWords = function () {
	var buf = [];
	buf.push(this._verWords);
	for (var i = 0; i < this._words.length; i++) {
		buf.push(this._words[i].toString());
	}
	buf = buf.join(getLineBreak()) + getLineBreak();
	var seek = this._outWords.QueryInterface(Components.interfaces.nsISeekableStream);
	seek.seek(0, 0);
	seek.setEOF();
	this._outWords.write(buf, buf.length);
	this.notify();
};
BW_LocalAPI.prototype.saveQuotes = function () {
	var buf = [];
	buf.push(this._verQuotes);
	for (var i = 0; i < this._refQuotes.length; i++) {
		buf.push(this._words[this._refQuotes[i]._idxWord].quotes[this._refQuotes[i]._idxQuote].toString());
	}
	buf = buf.join(getLineBreak()) + getLineBreak();
	var seek = this._outQuotes.QueryInterface(Components.interfaces.nsISeekableStream);
	seek.seek(0, 0);
	seek.setEOF();
	this._outQuotes.write(buf, buf.length);
	this.notify();
};
BW_LocalAPI.prototype.appendWord = function (word) {
	var buf = word.toString() + getLineBreak();
	this._outWords.write(buf, buf.length);
	this.notify();
};
BW_LocalAPI.prototype.appendQuote = function (quote) {
	var buf = quote.toString() + getLineBreak();
	this._outQuotes.write(buf, buf.length);
	this.notify();
};
BW_LocalAPI.prototype.writeLineWords = function (str, offset) {
	try {
		this.writeLine(str, offset, this._outWords);
	}
	catch (e) {
		ddump(e);
	}
};
BW_LocalAPI.prototype.writeLineQuotes = function (str, offset) {
	try {
		this.writeLine(str, offset, this._outQuotes);
	}
	catch (e) {
		ddump(e);
	}
};
BW_LocalAPI.prototype.writeLine = function (str, offset, stream) {
	var seek = stream.QueryInterface(Components.interfaces.nsISeekableStream);
	if (offset) {
		seek.seek(0, offset);
	} else {
		seek.seek(2, 0);
	}
	seek.setEOF();
	str = unicodeConverter.ConvertFromUnicode(str + getLineBreak());
	stream = seek.QueryInterface(Components.interfaces.nsIFileOutputStream);
	stream.write(str, str.length);
};
BW_LocalAPI.prototype.findWord = function (word) {
	var idx = this.findWordIdx(word);
	if (idx >= 0) {
		return this._words[idx];
	} else {
		return null;
	}
};
BW_LocalAPI.prototype.findWordRefIdx = function (word) {
	var a = 0, b = this._refWords.length - 1;
	var h = 0;
	while (a <= b) {
		h = parseInt((a + b) / 2);
		var m = BW_strCompare(this._refWords[h]._word, word);
		if (m == 0) {
			return h;
		} else {
			if (m > 0) {
				b = h - 1;
			} else {
				a = h + 1;
			}
		}
	}
	return -1;
};
BW_LocalAPI.prototype.findWordIdx = function (word) {
	var idx = this.findWordRefIdx(word);
	if (idx >= 0) {
		return this._refWords[idx]._idxWord;
	} else {
		return -1;
	}
};
BW_LocalAPI.prototype.getInputStream = function (file) {
	var stream = null;
	if (file) {
		stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		try {
			stream.init(file, 1, 292, 0);
		}
		catch (e) {
			stream = null;
		}
	}
	return stream;
};
BW_LocalAPI.prototype.getOutputStream = function (file) {
	try {
		file.normalize();
	}
	catch (e) {
	}
	if (!file.exists()) {
		// Try to create the file's directory recursively
		var parents = [];
		try {
			for (var parent = file.parent; parent; parent = parent.parent) {
				parents.push(parent);
	
			// Hack for MacOS: parent for / is /../ :-/
				if (parent.path == "/") {
					break;
				}
			}
		}
		catch (e) {
		}
		for (i = parents.length - 1; i >= 0; i--) {
			try {
				parents[i].create(parents[i].DIRECTORY_TYPE, 493);
			}
			catch (e) {
			}
		}
	}
	var stream = null;
	if (file) {
		stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
//	 try {
		stream.init(file, 2 | 8 | 16 | 64, 420, 0);
//	 }
//	 catch (e) {
//		stream = null;
//	 }
	}
//	BW_ddump(stream);
	return stream;
};
BW_LocalAPI.prototype.getFile = function (path) {
	try {
	 // Assume a relative path first
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(path);
		return file;
	}
	catch (e) {
	}
	try {
	 // Try relative path now
		var profileDir = dirService.get("ProfD", Components.interfaces.nsIFile);
		file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.setRelativeDescriptor(profileDir, path);
		return file;
	}
	catch (e) {
	}
	return null;
};
////////////////////////////////////////////////////////////////////////////
// start of api definition function
////////////////////////////////////////////////////////////////////////////
//This Function is derived from GPL code originally by Flock Inc:
function BW_API() {
	this.getWord = function (aWord) {
		var argArray = [backword._apiUrl, backword._apiUsername, backword._apiPassword, aWord];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.getWord(argArray), "getWord", backword._currentWord);
	};
	this.backWord = function (aWord, aParaphrase) {
		var Word = {"word":aWord, "paraphrase":aParaphrase};
		var argArray = [backword._apiUrl, backword._apiUsername, backword._apiPassword, Word];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.backWord(argArray), "backWord", backword._currentWord);
	};
	this.backQuote = function (aWordid, aUrl, aTitle, aParagraph) {
		if (aParagraph.length <= backword._currentWord.length) {
			return;
		}
		var Quote = {"url":aUrl, "title":aTitle, "paragraph":aParagraph};
		var argArray = [backword._apiUrl, aWordid, backword._apiUsername, backword._apiPassword, Quote];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.backQuote(argArray), "backQuote", backword._currentWord);
	};
	this.deleteWord = function (aWordid) {
		var argArray = [backword._apiUrl, aWordid, backword._apiUsername, backword._apiPassword];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.deleteWord(argArray), "deleteWord", backword._currentWord);
	};
	this.deleteQuote = function (aWordid, aQuoteid) {
		var argArray = [backword._apiUrl, aQuoteid, backword._apiUsername, backword._apiPassword];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.deleteQuote(argArray), "deleteQuote", backword._currentWord);
	};
	this.getQuotes = function (aWordid) {
		var argArray = [backword._apiUrl, aWordid, backword._apiUsername, backword._apiPassword];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.getQuotes(argArray), "getQuotes", backword._currentWord);
	};
	this.getWords = function (numberofwords, offset) {
		if (numberofwords == null) {
			numberofwords = 50;
		}
		if (offset == null) {
			offset = 0;
		}
		var argArray = [backword._apiUrl, backword._apiUsername, backword._apiPassword, numberofwords, offset];
		BW_XMLCall.sendCommand(backword._apiUrl, BW_APICalls.getWords(argArray), "getWords", backword._currentWord);
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
	if (backword._usingAPI) {
		gMakeXMLCall(theURL, theXMLString, theAction, additionalInfo);
	}
};
BW_XMLCall.replaceText = function (inString, oldText, newText) {
	return (inString.split(oldText).join(newText));
};
/*Had to bring out here, as a wierd bug in Firefox 1.0.6 won't let it be called from within,
unless synchronous, I need to file the bug!*/
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
function gMakeXMLCall(theURL, message, theAction, additionalInfo) {
//	BW_ddump(message);
//	BW_ddump(theURL);
	backword.apiCall();
	try {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", theURL, true);
		xmlhttp.onreadystatechange = function () {
			try {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) { //We actually want to catch bad pages
						backword.apiSuccess();
						BW_XMLCall.processData(xmlhttp.responseText, theAction, additionalInfo);
					}
				}
			}
			catch (e) {
				BW_ddump(e);
				backword.apiError(e.name);
				return;
			}
		};
		xmlhttp.setRequestHeader("Content-Type", "text/xml");
		xmlhttp.send(message);
		xmlhttp.overrideMimeType("text/xml");
	}
	catch (e) {
//		BW_ddump(e);
		backword.apiError(e.name);
		return;
	}
}
var bfXMLRPC = new Object();
//Function is derived from GPL code originally by performancing Inc:
//For more informationm See: http://www.performancing.com/
bfXMLRPC.makeXML = function (method, myParams) {
	var str = "<methodCall>";
//	var xml = <methodCall></methodCall>;
	str += "<methodName>" + method + "</methodName>";
//	xml.methodName = method;
		//i->0 is the URL
		//dump("n makeXML Params: " + myParams)
	str += "<params>";
	for (var i = 1; i < myParams.length; i++) {
//		xml.params.param += <param> <value> { bfXMLRPC.convertToXML(myParams[i]) }</value> </param>;
		str += "<param><value>" + bfXMLRPC.convertToXML(myParams[i]).toXMLString() + "</value></param>";
	}
	str += "</params></methodCall>";
//	BW_ddump(str);
		//"<?xml version="1.0"?>"
//		BW_ddump("XML:n " + xml.toXMLString());
		//var theBlogCharType = gbackwordUtil.getCharType();
	var theBlogCharType = "UTF-8";
	return "<?xml version=\"1.0\" encoding=\"" + theBlogCharType + "\" ?>" + str;
//	return "<?xml version="1.0" encoding="" + theBlogCharType + "" ?>" + xml.toXMLString();
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
//			BW_ddump("x:"+x);
//			BW_ddump("value:"+myParams[x]);
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
		BW_ddump("error parsing XML");
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
		alert(backword.getString("alert.apierror"));
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
//	BW_ddump(theXML);
//	BW_ddump(theAction + ":");
	BW_ddumpObject(theObject, "theObject", 3);
	if (theObject.faultString) {
		backword.apiError(theObject.faultString);
		return;
	}
	if (additionalInfo != backword._currentWord) {
		BW_ddump("outdated api return!");
		return;
	} else {
		backword.apiReturn();
	}
	if (theAction == "getWord") {
		backword.callbackGetWord(theObject);
	} else {
		if (theAction == "backWord") {
			backword.callbackBackWord(theObject);
		} else {
			if (theAction == "backQuote" || theAction == "deleteQuote") {
				backword.callbackModifyQuotes(theObject);
			} else {
				if (theAction == "getQuotes") {
					backword.callbackGetQuotes(theObject);
				}
			}
		}
	}
};

