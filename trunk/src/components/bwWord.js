const nsIbwWord = Components.interfaces.nsIbwWord;
const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID("{b0615200-f68a-11dc-95ff-0800200c9a66}");
const CLASS_NAME = "Local Storage of Backword";
const CONTRACT_ID = "@backword.gneheix.com/Word;1";
const CC = Components.classes;
const CI = Components.interfaces;
const NODENAME_QUOTE = "quote";

function Word() {
};

Word.prototype = {
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

	getQuotes: function(){
		if (this._quotes == null){
			this._quotes = [];
			var children = this._element.getElementByTagName(NODENAME_QUOTE);
			for (var i = 0; i < children.length; i++) 
			{
				var quote = CC["@backword.gneheix.com/Quote;1"].createInstance(CI.nsIbwQuote);
				quote.element = children[i];
				this._quotes[i] = quote;
			};
		}
		return this._quotes;
	},
	addQuote: function(quote){
		this._element.appendChild(quote.element);
		this._quotes[this._quotes.length] = quote;
		return this._quotes.length;
	},
	removeQuote: function(quote){
		var index = this._quotes.indexOf(quote);
		if (index != -1){
			this._quotes.splice(index, 1);
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
		this._quotes = null;
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
var WordFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new Word()).QueryInterface(aIID);
  }
};

var WordModule = {
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
      return WordFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};
function NSGetModule(aCompMgr, aFileSpec) { return WordModule; }