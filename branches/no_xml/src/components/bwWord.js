const nsIbwWord = Components.interfaces.nsIbwWord;
const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID("{b0615200-f68a-11dc-95ff-0800200c9a66}");
const CLASS_NAME = "Local Storage of Backword";
const CONTRACT_ID = "@backword.gneheix.com/word;1";
const CC = Components.classes;
const CI = Components.interfaces;
const NODENAME_QUOTE = "quote";

function BWWord() {
	this._uniConv = CC['@mozilla.org/intl/scriptableunicodeconverter'].getService(CI.nsIScriptableUnicodeConverter);
	this._uniConv.charset = 'UTF-8';
};

BWWord.prototype = {
	_element: null,
	_quotes: null,
	
	get id(){
		return this._getAttribute('id');
	},
	set id(aid){
		this._setAttribute('id', aid);
	},
	
	get paraphrase(){
		return this._getAttribute('paraphrase');
	},
	set paraphrase(aparaphrase){
		this._setAttribute('paraphrase', aparaphrase);
	},

	getQuotes: function(count){
		count.value = this._quotes.length;
		return this._quotes;
	},
	addQuote: function(quote){
		this._element.appendChild(quote.element);
		quote.id = this._quotes.length;
		this._quotes[this._quotes.length] = quote;
		return this._quotes.length;
	},
	removeQuote: function(quote){
		var index = this._quotes.indexOf(quote);
		if (index != -1){
			this._quotes.splice(index, 1);
			for(var index=index; index<this._quotes.length; index++) {
				this._quotes[index].id = index;
			}
		}
		this._element.removeChild(quote.element);
		return this._quotes.length;
	},
	getCountQuotes: function(){
		return this._quotes.length;
	},
	
	_getAttribute: function(name){
		try{
			return this._element.getAttribute(name);
		}catch(e){return null;}
	},
	_setAttribute: function(name, value){
		try{
			this._element.setAttribute(name, value);
		}catch(e){}
	},

	get element(){
		return this._element;
	},
	set element(aelement){
		this._element = aelement;
		this._quotes = [];
		var children = this._element.getElementsByTagName(NODENAME_QUOTE);
		for (var i = 0; i < children.length; i++) 
		{
			var quote = CC["@backword.gneheix.com/quote;1"].createInstance(CI.nsIbwQuote);
			quote.element = children[i];
			this._quotes[i] = quote;
			quote.id = i;
		};
	},
		
	QueryInterface: function(aIID)
	{
		if (!aIID.equals(nsIbwWord) &&
		!aIID.equals(nsISupports)&& 
    	!aIID.equals(CI.nsIObserver))
		throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}
};
var BWWordFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new BWWord()).QueryInterface(aIID);
  }
};

var BWWordModule = {
  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, 
        CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return BWWordFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};
function NSGetModule(aCompMgr, aFileSpec) { return BWWordModule; }