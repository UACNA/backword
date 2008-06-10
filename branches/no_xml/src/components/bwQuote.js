const nsIbwQuote = Components.interfaces.nsIbwQuote;
const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID("{a97ddcb0-f68a-11dc-95ff-0800200c9a66}");
const CLASS_NAME = "Local Storage of Backword";
const CONTRACT_ID = "@backword.gneheix.com/quote;1";
const CC = Components.classes;
const CI = Components.interfaces;

function BWQuote() {
	this._uniConv = CC['@mozilla.org/intl/scriptableunicodeconverter'].getService(CI.nsIScriptableUnicodeConverter);
	this._uniConv.charset = 'UTF-8';	
};

BWQuote.prototype = {
	_element: null,
	_id:null,
	
	get id(){
		return this._id;
	},
	set id(aId){
		this._id = aId;
	},
	get word(){
		return this._getAttribute('word');
	},
	set word(aword){
		this._setAttribute('word', aword);
	},
	
	get url(){
		return this._getAttribute('url');
	},
	set url(aurl){
		this._setAttribute('url', aurl);
	},
	
	get title(){
		return this._getAttribute('title');
	},
	set title(atitle){
		dump(atitle);
		this._setAttribute('title', atitle);
	},
	
	get paragraph(){
		return this._getAttribute('paragraph');
	},
	set paragraph(aparagraph){
		this._setAttribute('paragraph', aparagraph);
	},
	
	get element(){
		return this._element;
	},
	set element(aElement){
		this._element = aElement;
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
	
	QueryInterface: function(aIID)
	{
		if (!aIID.equals(nsIbwQuote) &&
		!aIID.equals(nsISupports)&& 
    	!aIID.equals(CI.nsIObserver))
		throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}
};
var BWQuoteFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new BWQuote()).QueryInterface(aIID);
  }
};

var BWQuoteModule = {
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
      return BWQuoteFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};
function NSGetModule(aCompMgr, aFileSpec) { return BWQuoteModule; }