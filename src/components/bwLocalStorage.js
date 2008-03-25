const nsIbwLocalStorage = Components.interfaces.nsIbwLocalStorage;
const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID("{6b99e600-f68a-11dc-95ff-0800200c9a66}");
const CLASS_NAME = "Local Storage of Backword";
const CONTRACT_ID = "@backword.gneheix.com/LocalStorage;1";
const CC = Components.classes;
const CI = Components.interfaces;
const ROOT = 'backword';
const VERSION = "0.1"
const ROOT_INIT = '<'+ROOT+' version="'+VERSION+'"></'+ROOT+'>';
const NODENAME_WORD = "word";
const NODENAME_QUOTE = "quote";

function LocalStorage() {
	this._uniConv = CC['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(CI.nsIScriptableUnicodeConverter);
	this._uniConv.charset = 'UTF-8';
	this._initFile();
	this._load();
};

LocalStorage.prototype = {
	_doc: null,
	_serializer: new XMLSerializer(),
	_parser: new DOMParser(),
	_words: [],
	
	newWord: function(){
		var word = CC["@backword.gneheix.com/Word;1"].createInstance(CI.nsIbwWord);
		word.element = this._doc.CreateElement(NODENAME_WORD);
		return word;
	},
	newQuote: function(){
		var quote = CC["@backword.gneheix.com/Quote;1"].createInstance(CI.nsIbwQuote);
		quote.element = this._doc.CreateElement(NODENAME_QUOTE);
		return quote;
	},
	getWords: function(){
		return this._words;
	},
	addWord: function(word){
		this._doc.appendChild(word.element);
		this._words[this._words.length] = word;
		return this._words.length;
	},
	removeWord: function(word){
		var index = this._words.indexOf(word);
		if (index != -1){
			this._words.splice(index, 1);
		}
		this._doc.removeChild(word.element);
		return this._words.length;
	},
	getCountWords: function(){
		return this._words.length;
	},
	save: function(){
		if (!this._file.exists()){
			this._createDic();
		}
		var foStream = CC["@mozilla.org/network/file-output-stream;1"]
               .createInstance(CI.nsIFileOutputStream);
		foStream.init(this._file, 0x02 | 0x08 | 0x20, 0664, 0);
		this._serializer.serializeToStream(this._doc, foStream, "UTF-8");
	},
	
	_createDic: function(){
		var parents = [];
		try {
			for (var parent = this._file.parent; parent; parent = parent.parent) {
				parents.push(parent);
				if (parent.path == "/")
					break;
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
	},
	_load: function(){
		if (this._file.exists()){
			var data  = new String();
			var fiStream = CC["@mozilla.org/network/file-input-stream;1"]
								.createInstance(CI.nsIFileInputStream);
			var siStream = CC["@mozilla.org/scriptableinputstream;1"]
								.createInstance(CI.nsIScriptableInputStream);
			fiStream.init(this._file, 1, 0, false);
			siStream.init(fiStream);
			data += siStream.read(-1);
			siStream.close();
			data = this._uniConv.ConvertToUnicode(data);
			
			this._doc = _parser.parseFromString(data, "text/xml");
		}
		if (this._doc == null || this._doc.documentElement.nodeName == "parsererror"){
			this._doc = _parser.parseFromString(ROOT_INIT, "text/xml");
		}
		var words = this._doc.getElementsByTagName(NODENAME_WORD);
		for(var index=0; index<words.length; index++) {
			var word = CC["@backword.gneheix.com/Word;1"].createInstance(CI.nsIbwWord);
			word.element = words[i];
			this._words[i] = word;
		}
	},
	_initFile: function(){
		var profileDir = CC["@mozilla.org/file/directory_service;1"].getService(CI.nsIProperties).get("ProfD", CI.nsIFile);
		_file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);
		_file.setRelativeDescriptor(profileDir, "backword/data.xml");
	},
	QueryInterface: function(aIID)
	{
		if (!aIID.equals(nsIbwLocalStorage) &&
		!aIID.equals(nsISupports)&& 
    	!aIID.equals(CI.nsIObserver))
		throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}
};
var LocalStorageFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new LocalStorage()).QueryInterface(aIID);
  }
};

var LocalStorageModule = {
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
      return LocalStorageFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};
function NSGetModule(aCompMgr, aFileSpec) { return LocalStorageModule; }