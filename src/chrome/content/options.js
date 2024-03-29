var BW_options = new BW_Setting();

function BW_Setting(){
    this._pref =  Components.classes["@mozilla.org/preferences-service;1"]
		               .getService(Components.interfaces.nsIPrefBranch);
}

BW_Setting.prototype.init = function() {
	document.getElementById("translator").selectedItem = document.getElementById(this._pref.getCharPref("backword.translator"));
	if (this._pref.getCharPref("backword.translator").indexOf('google') == -1)
		document.getElementById("showphonetics").setAttribute('disabled', true);
//	document.getElementById(this._pref.getCharPref("backword.translator")).setAttribute("selected", "true");
	document.getElementById("searchweburl").setAttribute("value", this._pref.getCharPref("backword.searchweburl"));
	document.getElementById("usingapi").checked = this._pref.getBoolPref("backword.usingapi");
	document.getElementById("showpronunciation").checked = this._pref.getBoolPref("backword.showpronunciation");
	document.getElementById("showphonetics").checked = this._pref.getBoolPref("backword.showphonetics");
	document.getElementById("quotesentence").checked = this._pref.getBoolPref("backword.quotesentence");
	document.getElementById("ctrl").checked = this._pref.getBoolPref("backword.ctrl");
	document.getElementById("autoback").checked = this._pref.getBoolPref("backword.autoback");
	document.getElementById("usinglocalapi").checked = this._pref.getBoolPref("backword.usinglocalapi");
	document.getElementById("apiurl").setAttribute("value", this._pref.getCharPref("backword.apiurl"));
	document.getElementById("apiweburl").setAttribute("value", this._pref.getCharPref("backword.apiweburl"));
	document.getElementById("apiusername").setAttribute("value", this._pref.getCharPref("backword.apiusername"));
	document.getElementById("apipassword").setAttribute("value", this._pref.getCharPref("backword.apipassword"));
	document.getElementById("layoutsize").setAttribute("value", this._pref.getCharPref("backword.layout.size"));
	document.getElementById("layoutquotes").setAttribute("value", this._pref.getCharPref("backword.layout.quotes"));
	document.getElementById("layoutmouseout").setAttribute("value", this._pref.getCharPref("backword.layout.mouseout"));
	document.getElementById("layoutpopdelay").setAttribute("value", this._pref.getCharPref("backword.layout.popdelay"));
	this.usingApi(this._pref.getBoolPref("backword.usingapi"));
};

BW_Setting.prototype.save = function() {
	this._pref.setCharPref("backword.translator", document.getElementById("translator").value);
	this._pref.setCharPref("backword.searchweburl", document.getElementById("searchweburl").value);
	this._pref.setBoolPref("backword.usingapi", document.getElementById("usingapi").checked);
	this._pref.setBoolPref("backword.showpronunciation", document.getElementById("showpronunciation").checked);
	this._pref.setBoolPref("backword.showphonetics", document.getElementById("showphonetics").checked);
	this._pref.setBoolPref("backword.quotesentence", document.getElementById("quotesentence").checked);
	this._pref.setBoolPref("backword.ctrl", document.getElementById("ctrl").checked);
	this._pref.setBoolPref("backword.autoback", document.getElementById("autoback").checked);
	this._pref.setBoolPref("backword.usinglocalapi", document.getElementById("usinglocalapi").checked);
	this._pref.setCharPref("backword.apiurl", document.getElementById("apiurl").value);
	this._pref.setCharPref("backword.apiweburl", document.getElementById("apiweburl").value);
	this._pref.setCharPref("backword.apiusername", document.getElementById("apiusername").value);
	this._pref.setCharPref("backword.apipassword", document.getElementById("apipassword").value);
	var size = 16;
	var quotes = 5;
	var mouseout = 10;
	var popdelay = 500;
	try {
		size = parseInt(document.getElementById("layoutsize").value);
	} catch(e){}
	try {
		quotes = parseInt(document.getElementById("layoutquotes").value);
		if (quotes < 2)
			quotes = 2;
	} catch(e){}	
	try {
		mouseout = parseInt(document.getElementById("layoutmouseout").value);
		if (mouseout < 5)
			mouseout = 5;
	} catch(e){}	
	try {
		popdelay = parseInt(document.getElementById("layoutpopdelay").value);
		if (popdelay < 100)
			popdelay = 100;
	} catch(e){}	
	
	this._pref.setCharPref("backword.layout.size", size);
	this._pref.setCharPref("backword.layout.popdelay", popdelay);
	this._pref.setCharPref("backword.layout.quotes", quotes);
	this._pref.setCharPref("backword.layout.mouseout", mouseout);
	Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService).notifyObservers(null, 'bw_loadpref', '');
};
BW_Setting.prototype.openPage = function(pageUrl){
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

BW_Setting.prototype.usingApi = function(checked){
	document.getElementById("usinglocalapi").disabled = !checked;
	var localapi = document.getElementById("usinglocalapi").checked;
	var disabled = localapi || !checked;
	document.getElementById("apiurl").disabled = disabled;
	document.getElementById("apiweburl").disabled = disabled;
	document.getElementById("apiusername").disabled = disabled;
	document.getElementById("apipassword").disabled = disabled;
};
BW_Setting.prototype.usingLocalApi = function(checked){
	document.getElementById("apiurl").disabled = checked;
	document.getElementById("apiweburl").disabled = checked;
	document.getElementById("apiusername").disabled = checked;
	document.getElementById("apipassword").disabled = checked;
};