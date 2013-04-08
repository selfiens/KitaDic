/*************************
 * KitaDic.js
 * Kita Dic
 *
 * Author: Kita (kitaru@gmail.com)
 *
 * ACKNOWLEDGEMENT
 * This extension has started as a fork of BackWord extension [www.gneheix.com]

 * LICENSE
 * This extension is provided under GPL license: See http://www.gnu.org/copyleft/gpl.html
 * In case of modifying or redistributing the source code (in any form)
 * 1) the original authors' name and their contacts should remain intact in the source code.
 * 2) the GPL license should remain intact.
 * 3) the modifier should explicitly specify the origin of the software in the source and public introduction.

 * HISTORY
   0.3.027  2010.05.25
            Fixed CTRL key detection in Firefox for Mac and Linux
            Removed play button of pronunciation audio file
   0.3.026  2009.12.22
            When you follow words inside the KitaDic window, the window location will not be changed.
   0.3.025  2009.12.16
            Removed setTimeout function to pass AddOn validator
            Removed non-essential sections in the definition
            Added DL, DD styles
            Adjusted window size
   0.3.024b 2009.12.11
            Changed Wiktionay parser
            Better style
            Added Google Dictionary Eng-Kor link
            Removed stem word guessing feature
   0.3.023b 2009.07.01
            Using CTRL is now default
            Fixed text color (which has been affected by the document CSS) 
            Added CSS injection functionality for more stable display
            Added handling 404-not-found error response from Wiktionary.org
            Word-type Preposition is displayed correctly
            Removed scroll event monitoring
            Changed font size
            Changed box shape to round-cornered
            Fixed persistant window bug when KitaDic is disabled
   0.3.022b Accepts new Wiktionary Error Message
   0.3.021b Specified license rule more explicitly, because of a dispute between TestPilot's WikiLook extension.
   0.3.020b Changed install.rdf to work under FF 3.0.*
   0.3.019b Added word level
   0.3.018b Added Status Icon for enabling/disabling KitaDic
                  Saves KitaDic enable/disable status in preference
             Does not react to the words in SELECT tag
                  Cancels definition fetching process when scroll event occurs
   0.3.017b Better style adjustment
            Set default delay to 2000ms
   0.3.016b Do not try to translate numbers
   0.3.015b Window location fixed
   0.3.014b Beta State
   0.3.013a Refactoried
             Implimented Ajax Request Abortion
                  Does not react to the words in TEXTAREA or INPUT tags
   0.3.012a Changed versioning scheme
   0.2.3.61127 Changed versioning scheme
               Fixed "empty string" query bug
   0.2.3.5 / 2006.11.20 Fixed word targeting
   0.2.3.4 / 2006.11.20 Fixed Link color
                        Added Unicode word
                  Changed Naver lookup from Eng-Eng to Eng-Kor / Kor-Eng
                  Changed Daum lookup from Eng-Eng to Eng-Kor / Kor-Eng
   0.2.3.3 / 2006.11.19 added Abstract pronoun, Determiner, Collective noun, Interjection types.
                        list display margin adjusted.
   0.2.3.2 / 2006.11.13 first public release

 * The source code of this Javascript file is available upon request. Please contact the author.

 * edit this source with tab space = 3
 *************************/



//////////////////////////////////////////////////////////////////////
// Dev mode?
//////////////////////////////////////////////////////////////////////

//var KD_devMode = true;
var KD_devMode = false;

//////////////////////////////////////////////////////////////////////
// Data
//////////////////////////////////////////////////////////////////////

// 100 most common words (tv and movies scripts) + 100 most common words (gutenberg) in Wiktionary
var KD_commonWord = ",about,after,all,am,and,any,an,are,as,at,a,back,be,because,been,being,but,by,can,come,could,did,do,first,for,from,get,going,good,got,go,great,had,has,have,having,here,her,hey,he,him,his,how,if,in,into,is,it,i,just,know,like,little,look,made,mean,man,may,men,me,more,mr,much,must,my,not,now,no,of,oh,okay,ok,one,on,or,other,our,out,over,really,right,said,say,see,she,should,something,some,so,such,tell,than,that,their,them,then,there,these,they,the,think,this,time,to,two,up,upon,us,very,want,was,well,were,we,what,when,which,who,why,will,with,would,yeah,yes,your,yours,you,zoo,";

// Wiktionary section names
var KD_Wiktionary_section_names = [
   "Pronounciation",
   "Abbreviation",
   "Abstract Noun",
   "Abstract Pronoun",
   "Adjective",
   "Adverb",
   "Cardinal Number",
   "Collective Noun",
   "Conjunction",
   "Determiner",
   "Interjection",
   "Initialism",
   "Intransitive Verb",
   "Noun",
   "Noun Form",
   "Participle",
   "Plural Noun",
   "Preposition",
   "Pronunciation",
   "Proper Noun",
   "Pronoun",
   "Transitive verb",
   "Verb",
   "Verb Form",
   "Verb Transitive",
   "Verb Intransitive"
];

/*
var KD_Wiktionary_section_names = [
   "Noun"
];
*/

var KD_Injected_Styles = 
[
   "#KitaDic_overlay_layout           { position: absolute; font-size: 12px; line-height: 1.3; background-color: #FFFFBF; margin: 2px 2px 2px 2px; padding: 8px 13px 8px 13px; font-weight: normal; font-style: normal; font-family: arial,verdana; font-size-adjust: none; font-stretch: normal; font-variant: normal; float: none; overflow: hidden; z-index: 32716; display: none; color: #642800; -moz-border-radius: 10px; text-align: left; -moz-box-shadow:2px 2px 10px rgba(0, 0, 0, 0.9); max-width:480px;}",
   "#KitaDic_overlay_layout ul, #KitaDic_overlay_layout ol, #KitaDic_overlay_layout dl        { font-size: 12px; line-height: 1.3; color: #642800; list-style-type: disc!important; margin: 0 0 0 0; padding: 0 0 0 0; }",
   "#KitaDic_overlay_layout li, #KitaDic_overlay_layout dd        { font-size: 12px; color: #642800; line-height: 1.3; margin-left: 2em; }",
   "#KitaDic_overlay_layout p         { font-size: 12px; color: #642800; line-height: 1.3; margin-left: 0; }",
   "#KitaDic_overlay_layout .sister-project, #KitaDic_overlay_layout .infl-table, #KitaDic_overlay_layout .interProject { display:none; }",
   "#KitaDic_overlay_layout button    { display:none; }",
   "#KitaDic_overlay_layout a:link    { color: #0000E0; font-family: arial,verdana; border: none; text-decoration: underline; margin: 0px; padding: 0px; }",
   "#KitaDic_overlay_layout a:visited { color: #0000E0; font-family: arial,verdana; border: none; text-decoration: underline;  margin: 0px; padding: 0px; }",
   "#KitaDic_overlay_layout a:hover   { color: #0000E0; font-family: arial,verdana; background-color: #FFFFFF; border: none; text-decoration: underline;  margin: 0px; padding: 0px; }",
   "#KitaDic_overlay_layout a:active  { color: #0000E0; font-family: arial,verdana; background-color: #FFFFFF; border: none; text-decoration: underline;  margin: 0px; padding: 0px; }",
   "#KitaDic_overlay_layout a:link { cursor: pointer; }"
];

//////////////////////////////////////////////////////////////////////
// Core Object
//////////////////////////////////////////////////////////////////////

var KitaDic = function () {
   this._KD_initialized = false;
   this._KD_enabled = true;

   // Working document & word object
   this._currentDoc = null;
   this._currentWord = "";                // current word
   this._lastWord = "";                   // stores last fetched word

   // Event objects
   this._eventRangeParent = null;
   this._eventRangeOffset = null;
   this._eventTarget = null;
   this._event = null;
   this._eventClientX = null;
   this._eventClientY = null;
   this._lastPointerX = null;
   this._lastPointerY = null;
   this._wordX = null;
   this._wordY = null;


   // CTRL state variable
   this._invokerKeyStartTime = null;      // a tri-state variable for CTRL key press check
                                          // null: default (CTRL key is not pressed or released)
                                          // time stamp(integer): timestamp of the beginning moment of CTRL key is pressed
                                          // -1: CTRL key event has been triggered. Need to wait for releasing.

   this._wordMonTimer = null;             // internal word monitor timer object

   // DIV oobjects
   this._divId = "KitaDic_overlay_layout";
   this._div = null;
   
   // Internal state variables
   this._divIsDisplayed = false;   
   this._showDefinition = false;          // if this trigger value is 'false', definition window will not be displayed
   this._isRequestFetching = false;       // true when ajax request is on the way
   this._statusImageId = "KitaDic_StatusImage";

   // preference object
   this._pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
   // User Preferences
   this._pref_WordMonTimerDelay = 1500;   // wait for N miliseconds before automatic fetch (when NOT using CTRL key)
   this._pref_UseCtrlKey = true;          // whether use CTRL key
   this._pref_HideWhenMouseMove = false;  // hide definition when mouse moves
   this._pref_WindowOffsetX = 10;         
   this._pref_WindowOffsetY = 10;         
   this._pref_BlockBasicWords = true;     

   // Initializer   
   this.init();
};

// Ajax object
var KD_request = Object;


KitaDic.prototype.init = function() {
   KD_d("KitaDic.init:currently "+this._KD_initialized);
   if (this._KD_initialized === true) {
      return;
   }
   this._KD_initialized = true;
};


//////////////////////////////////////////////////////////////////////
// Global Raw Functions & Objects
//////////////////////////////////////////////////////////////////////

KD_d = function (str) { // dump
   if (KD_devMode)
   {
      var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
      consoleService.logStringMessage("KD: " + str);
      //Components.utils.reportError("init() called");
      //dump("KD:"+str+"\n"); 
   }
};

//////////////////////////////////////////////////////////////////////
// Event Handlers
//////////////////////////////////////////////////////////////////////

KitaDic.prototype.eventLoad = function(event) { KitaDic_Overlay.eventLoadImpl(event); }; // fires once on each browser window open
KitaDic.prototype.eventLoadImpl = function(event) {
   KD_d("KitaDic.eventLoad fired");
   // preferences need to be loaded on this event
   this.loadPref();
   this.updateStatusImage();
};

KitaDic.prototype.eventUnload = function(event) { KitaDic_Overlay.eventUnloadImpl(event); } ;// fires once on each browser window close
KitaDic.prototype.eventUnloadImpl = function(event) {
   // do nothing;
};

KitaDic.prototype.eventFocus = function(event) { KitaDic_Overlay.eventFocusImpl(event); };
KitaDic.prototype.eventFocusImpl = function(event) {
   // when document gets focus, remove everything
   this.clearAll();
};

KitaDic.prototype.eventBlur = function(event) { KitaDic_Overlay.eventBlurImpl(event); };
KitaDic.prototype.eventBlurImpl = function(event) {
   // when document gets blurred, remove everything
   this.clearAll();
};

KitaDic.prototype.eventClick = function(event) { KitaDic_Overlay.eventClickImpl(event); };
KitaDic.prototype.eventClickImpl = function(event) {
   KD_d("KitaDic.eventClick fired");
   if (!this._KD_enabled) { return; }

   var eventDoc = this.getDoc(event);  // fetches current document
                                       // gets null if the document is not a HTML document.
   if (eventDoc !== null)
   {
      this._currentDoc = eventDoc;
      KD_d("KitaDic.eventClick:_currentDoc=" + this._currentDoc);
   }

   // Check whether the click is made on "A" tag inside KitaDic window
   // to avoid "nullifying click" inside the KitaDic
   var isInKD_div = false;
   if (event.target.tagName == "A")
   {
      var p = event.target;
      var sentinel = 0;
      while (p.tagName != "HTML"  && isInKD_div === false)   {
         sentinel++;
         p = p.parentNode;
         KD_d("KitaDic.eventClick:climbing to parentNode.id="+p.id);
         if (p.id == this._divId) {
            KD_d("KitaDic.eventClick:KD_divId found");
            isInKD_div = true;
         }
         if(sentinel>20) {
            KD_d("KitaDic.eventClick:sentinel break. Probably, the click is more than 20 levels deep.");
            return;
         }
      }
   }
   if (isInKD_div === false)
   {
      KD_d("KitaDic.eventClick:not in KD_div, removing");
      this.clearAll();
   }
   //KD_devMode = false;

};

KitaDic.prototype.eventKeyDown = function(event) { KitaDic_Overlay.eventKeyDownImpl(event); };
KitaDic.prototype.eventKeyDownImpl = function(event) 
{
   if (!this._KD_enabled) { return; }

   KD_d("KitaDic.eventKeyDownImpl fired");
   KD_d("KitaDic.eventKeyDownImpl, event.ctrlKey=" + event.ctrlKey);
   if(this._pref_UseCtrlKey && event.ctrlKey && !this._isRequestFetching && this._invokerKeyStartTime != -1)
   {
      KD_d("KitaDic.eventKeyDownImpl, key capture condition passed");
      KD_d("KitaDic.eventKeyDownImpl, eventXY:" + this._eventClientX + " " + this._eventClientY);
      KD_d("KitaDic.eventKeyDownImpl, this._invokerKeyStartTime=" + this._invokerKeyStartTime);
      var Now = new Date();
      if (this._invokerKeyStartTime === null && this._wordMonTimer === null)
      {
	     if (/Macintosh|Linux/.test(navigator.userAgent))
         // for platforms that CONTROL keys do NOT fire repeatedly (read: Mac)
         {
	        KD_d("KitaDic.eventKeyDownImpl, Using timer code path");
	        var monitorFunction = { notify: function(){ KitaDic_Overlay.MouseMoveMon();} };
	        this._wordMonTimer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	        this._wordMonTimer.initWithCallback(
	           monitorFunction,
	           this._pref_WordMonTimerDelay,
	           Components.interfaces.nsITimer.TYPE_ONE_SHOT
	        );
         }
         else
         // windows
         {
	        KD_d("KitaDic.eventKeyDownImpl, Using key-repeator code path");
            this._invokerKeyStartTime = Now.getTime();
            KD_d("KitaDic.eventKeyDownImpl, this._invokerKeyStartTime newly assigned");
         }
      }
      else
      {
         KD_d("KitaDic.eventKeyDownImpl, Pressing duration: " + (Now.getTime() - this._invokerKeyStartTime));
         if (Now.getTime() - this._invokerKeyStartTime > 1000)
         {
            this._invokerKeyStartTime = -1;
            this.MouseMoveMon();
         }
      }
   }
};

KitaDic.prototype.eventKeyUp = function(event) { KitaDic_Overlay.eventKeyUpImpl(event); };
KitaDic.prototype.eventKeyUpImpl = function(event) 
{
   if (!this._KD_enabled) { return; }

   KD_d("KitaDic.eventKeyUp");
   this._invokerKeyStartTime = null;
   KD_d("KitaDic.eventKeyUp, typeof this._wordMonTimer=" + (typeof this._wordMonTimer));
   if ( typeof this._wordMonTimer == "object")
   {
      this._wordMonTimer.cancel();
      this._wordMonTimer = null;
      KD_d("KitaDic.eventKeyUp, timer object cancelled");
   };
};

KitaDic.prototype.eventMouseMove = function(event) { KitaDic_Overlay.eventMouseMoveImpl(event); };
KitaDic.prototype.eventMouseMoveImpl = function(event) 
{
   if (!this._KD_enabled) { return; }
   if (this._pref_HideWhenMouseMove || this._isRequestFetching) 
   {
      this.clearAll();
   } else {
      this.clearWordMonTimer();
      this.clearRequest();
   }

   var eventDoc = this.getDoc(event);
   if (eventDoc !== null)
   {
      if (this._currentDoc != eventDoc)
      {
         this._currentDoc = eventDoc;
         KD_d("KitaDic.eventMouseMoveImpl:currentDoc="+this._currentDoc);
      }
   }

   this._eventTarget = event.target;
   if (this._eventTarget.tagName != "TEXTAREA" || this._eventTarget.tagName != "INPUT"  || this._eventTarget.tagName != "SELECT") 
   {
      this._eventRangeParent = event.rangeParent;
      this._eventRangeOffset = event.rangeOffset;
      this._eventClientX = event.clientX;
      this._eventClientY = event.clientY;
      if(!this._pref_UseCtrlKey)
      {
         KD_d("KitaDic.eventMouseMoveImpl::setTimeout");
         var monitorFunction = { notify: function(){ KitaDic_Overlay.MouseMoveMon();} };
         this._wordMonTimer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
         this._wordMonTimer.initWithCallback(
            monitorFunction,
            this._pref_WordMonTimerDelay,
            Components.interfaces.nsITimer.TYPE_ONE_SHOT
         );
      }
      else
      {
         this._invokerKeyStartTime = null;
      }
   }

   /*
   // testing chinese
   //var targetDoc = event.originalTarget.ownerDocument;
   var targetDoc = KD_currentDoc;
   var rng = targetDoc.createRange();
   var rng2 = targetDoc.createRange();
   rng.selectNodeContents(event.rangeParent);
   rng2.selectNode(event.rangeParent);
   var string = rng.toString()||rng2.toString();
   var word = string.getWordAt(event.rangeOffset);
   var word2 = string.getWordAt2(event.rangeOffset);
   //KD_d(string + " /// " + word + " /// " + word2);
   KD_showDefinition = true;
   if(!KD_attachDiv()) return;
   KD_div.style.left = KD_clientX+10+"px";
   KD_div.style.top = KD_clientY+10+"px";
   KD_div.innerHTML = "<br>" + word + "<br>" +word2;
   KD_showDiv();
   */
   
};

KitaDic.prototype.eventScroll = function(event) { KitaDic_Overlay.eventScrollImpl(event); };
KitaDic.prototype.eventScrollImpl = function(event) {
   if (!this._KD_enabled) { return; }
   if (this._pref_HideWhenMouseMove || this._isRequestFetching) {
      this.clearAll();
   }
};

KitaDic.prototype.eventClickStatus = function(event) { KitaDic_Overlay.eventClickStatusImpl(event); };
KitaDic.prototype.eventClickStatusImpl = function(event) {
   KD_d("KitaDic.eventClickStatusImpl::KD_clickStatus clicked");
   if (event.button === 0){ //left click
      this._KD_enabled = !this._KD_enabled;
      
      // when turned off
      if (!this._KD_enabled) {
         this.clearAll();
      }
      this._pref.setBoolPref("extensions.kitadic.enabled", this._KD_enabled);
      this.updateStatusImage();
   }
};

//////////////////////////////////////////////////////////////////////
// Core Functions
//////////////////////////////////////////////////////////////////////

KitaDic.prototype.updateStatusImage = function() {
   KD_d("KitaDic.updateStatusImage::KD_updateStatusImage: KD_enabled? " + this._KD_enabled);
   var img =  document.getElementById(this._statusImageId);
   if (this._KD_enabled) {
      img.src = "chrome://kitadic/skin/kita_on.gif";
   } else {
      img.src = "chrome://kitadic/skin/kita_off.gif";
   }
};

KitaDic.prototype.loadPref = function() {
   //this._pref.getCharPref
   //this._pref.setCharPref
   //this._pref.getBoolPref
   //this._pref.setBoolPref
   
   try
   {
      this._pref_WordMonTimerDelay = parseInt(this._pref.getCharPref("extensions.kitadic.wordmondelay"), 10);
   }
   catch (e) 
   {  
      this._pref_WordMonTimerDelay = 1500;
      this._pref.setCharPref("extensions.kitadic.wordmondelay",this._pref_WordMonTimerDelay);
   }

   try
   { 
      this._KD_enabled = this._pref.getBoolPref("extensions.kitadic.enabled");
   } 
   catch (e) 
   { 
      this._KD_enabled = true;
      this._pref.setBoolPref("extensions.kitadic.enabled",true);
   }

   try
   { 
      this._pref_UseCtrlKey = this._pref.getBoolPref("extensions.kitadic.usectrlkey");
   } 
   catch (e) 
   { 
      this._pref_UseCtrlKey = true;
      this._pref.setBoolPref("extensions.kitadic.usectrlkey", this._pref_UseCtrlKey);
   }

   KD_d("loadPref::" + this._pref_WordMonTimerDelay);
};

KitaDic.prototype.clearAll = function() { // get ready for new state
   this.clearWordMonTimer();
   this.clearRequest();
   this.clearDisplay();
   this._currentDoc = null;
   this._currentWord = null;
};

KitaDic.prototype.clearWordMonTimer = function() {
   if (this._wordMonTimer !== null) {
      clearTimeout(this._wordMonTimer);
      this._wordMonTimer = null;
   }
};

KitaDic.prototype.clearDisplay = function() {
   this.removeDiv();
   this._showDefinition = false;
};

KitaDic.prototype.clearRequest = function () {
   if (this._isRequestFetching) {
      this._isRequestFetching = false;
   }
   if (KD_request !== null) {
      try {
         KD_request.abort();  
      }
      catch (e) {
      }
      KD_request = null;
   }
};

KitaDic.prototype.getDoc = function(event) 
{
   //KD_d("KitaDic.getDoc, event=" + event);
   var etod = event.target.ownerDocument;
   //KD_d("KitaDic.getDoc, event.target.ownerDocument="+etod);
   //if (String(etod).indexOf("[object XPCNativeWrapper [object HTMLDocument]]") != -1)
   if (String(etod).indexOf("[object HTMLDocument]") != -1)
   {
      // stylesheet injection
      var x = etod.styleSheets[0];
      if (typeof x != 'undefined')
      {
         // By comparing the last cssText of current document stylesheets[0] and KD_Injected_Styles 
         // check whether style is already injected
         if (x.cssRules[x.cssRules.length-1].cssText != KD_Injected_Styles[KD_Injected_Styles.length-1])
         {
            KD_d("KitaDic.getDoc:Injecting Style...");
            KD_d(x.cssRules[x.cssRules.length-1].cssText);
            for (var style_index = 0; style_index < KD_Injected_Styles.length ; style_index++)
            {
               x.insertRule(KD_Injected_Styles[style_index],x.cssRules.length);
            }
         }

         return etod;
      }
   }
   else
   {
      return null;
   }
};

KitaDic.prototype.MouseMoveMon = function() { // Mouse Movement Monitor
   if (!this._KD_enabled) { return; }

   KD_d("KitaDic.MouseMoveMon");
   KD_d("KitaDic.MouseMoveMon:_currentDoc.title="+this._currentDoc.title);

   this.clearRequest();

   if (KD_devMode && false)   {
      KD_d("KitaDic.MouseMoveMon:this._eventRangeParent="+this._eventRangeParent);
      KD_d("KitaDic.MouseMoveMon:this._eventRangeOffset="+this._eventRangeOffset);
      KD_d("KitaDic.MouseMoveMon:this._eventTarget="+this._eventTarget);
   }

   this._currentWord = this.getCurrentWord(this._eventRangeParent,this._eventRangeOffset,this._eventTarget);
   if (this._currentWord === null || this._currentWord.length < 2) { return; }
   this._currentWord = this.trim(this._currentWord);

   // Basic word filter?
   if (this._pref_BlockBasicWords) {
      if (KD_commonWord.indexOf(","+this._currentWord+",") != -1) {
         KD_d("KitaDic.MouseMoveMon:" + this._currentWord + " is a common word(filtered).");
         this._showDefinition = true;
         if(!this.attachDiv()) { return; }
         this._div.style.left = this.getNewWindowX() + "px";
         this._div.style.top = this.getNewWindowY() + "px";
         this._div.innerHTML = "('" + this._currentWord + "' is a basic word)";
         this.showDiv();
         return;
      }
   }

   // Valid word?
   if ( this._currentWord !== null && this.isWord(this._currentWord) && this._currentWord.length > 1) {
      KD_d("KitaDic.MouseMoveMon:\n\n\n\nWord:" + this._currentWord + ", is it a word?:" + this.isWord(this._currentWord) );
      this._lastWord = this._currentWord;
      this._showDefinition = true;
      if (this._divIsDisplayed)
      {
         // do nothing or move?
         KD_d("left:" + this._div.style.left);
         KD_d("width:" + this._div.style.width);
         KD_d("top:" + this._div.style.top);
         KD_d("height:" + this._div.style.height);
         /*
         if (this._div.style.left )
         {
         }
         */
      }
      else
      {
         if(!this.attachDiv()) { return; }
         this._div.style.left = this.getNewWindowX()+"px";
         this._div.style.top = this.getNewWindowY()+"px";
      }
      this._div.innerHTML = "(looking up <b>"+ this._currentWord +"</b> from Wiktionary.org ...)";
      this.showDiv();
      this._isRequestFetching = true;
      this.requestFetchWord(this._currentWord);
   }
};

KitaDic.prototype.getNewWindowX = function () {
   KD_d("KitaDic.getNewWindowX, _currentDoc.width="+this._currentDoc.width);
   KD_d("KitaDic.getNewWindowX, _eventClientX="+this._eventClientX);
   KD_d("KitaDic.getNewWindowX, _pref_WindowOffsetX="+this._pref_WindowOffsetX);
   if (this._eventClientX + 530  + this._pref_WindowOffsetX > this._currentDoc.width ) {
      return (this._currentDoc.width >= 530) ? (this._currentDoc.width - 530) : 0;
   }
   else {
      return this._eventClientX + this._pref_WindowOffsetX;
   }
};

KitaDic.prototype.getNewWindowY = function () {
   KD_d("KitaDic.getNewWindowY, _eventClientY="+this._eventClientY);
   return this._eventClientY + this._currentDoc.documentElement.scrollTop + this._currentDoc.body.scrollTop + this._pref_WindowOffsetY;
};

KitaDic.prototype.showDiv = function () {
   KD_d("KitaDic.showDiv");
   if (this._div !== null && this._showDefinition === true) {
      this._div.style.display="block";
      this._divIsDisplayed = true;
   }
};

KitaDic.prototype.hideDiv = function() {
   KD_d("KitaDic.hideDiv");
   if (this._div !== null) {
      this._div.style.display="none";
   }
   this._divIsDisplayed = false;
};

KitaDic.prototype.attachDiv = function() {
   this.removeDiv();
   if (this._showDefinition === false) {
      KD_d("KitaDic.attachDiv:KD_showDefinition=false, return false.");
      return false;
   }
   var div;
   try {
      div=this._currentDoc.createElement("DIV");   
   } catch (e) {
      KD_d("KitaDic.attachDiv:KD_currentDoc is not a document");
      return false;
   }
   div.id = this._divId;

   this._currentDoc.body.appendChild(div);
   this._div = this._currentDoc.getElementById(this._divId);
   this._div.className = "KitaDic_overlay_class";
   KD_d("KD_attachDiv:KD_div=" +this._div);
   return true;
};

KitaDic.prototype.removeDiv = function() {
   if (this._div !== null) {
      try {
         KD_d("KitaDic.removeDiv:removing by KD_div");
         this._currentDoc.body.removeChild(KD_div);
      }
      catch (err) {
         KD_d("KitaDic.removeDiv:Error caught");
      }
      this._divIsDisplayed = false;
      this._div = null;
   }

   try {
      if (this._currentDoc.getElementById(this._divId) !== null) {
         var t=this._currentDoc.getElementById(this._divId).parentNode;
         KD_d("KitaDic.removeDiv:removing by getElementById");
         t.removeChild(this._currentDoc.getElementById(this._divId));
         this._currentDoc.removeChild(this._divId);
      }
   }
   catch (err) {
      KD_d("KitaDic.removeDiv:Error caught");
   }
   this._divIsDisplayed = false;
   this._div = null;
};












////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////




KitaDic.prototype.parseWiktionaryResponse = function( html ) {
   // find the beginning of English
   p = html.search(/<h2>.*?<span.*?id="English">English<\/span><\/h2>/);
   if (p == -1) { return false; }
   html = html.substr(p);
   html = html.substr(html.search(/<\/h2>/) + 5);  // remove ~~~</h2>

   // find the end of English part
   p = html.search(/(<h2>|<div class="printfooter">)/i);
   html = html.substr(0, p);

   // section splitter
   sec_parts = html.split(/<h[3-5]>/);
   KD_d('sections: ' + sec_parts.length);
   sec_header_pattern = /<span.+?>([^<]+)<\/span><\/h[2-4]>/;
   out = '';
   for( var sec in sec_parts)
   {
      // find section name
      part_name = sec_parts[sec].match(sec_header_pattern);
      // couldn't find
      if ( part_name === null ) { continue; }

      // test whether acceptable section name
      valid = false;
      KD_d('section name: ' + part_name[1]);
      for( var KD_sec_name_index in KD_Wiktionary_section_names)
      {
         if (part_name[1] == KD_Wiktionary_section_names[KD_sec_name_index])
         {
            valid = true;
            break;
         }
      }
      if (valid)
      {
         out += "<strong style='font-size:14px; margin-top:8px;display:block;'>" + part_name[1] + "</strong>";
         u = sec_parts[sec];
         //KD_d('section text 1: ' + u);
         u = u.substr(u.search(/<\/h[3-5]>/) + 5);
         //KD_d('section text 2: ' + u);
         // remove tables
         /*
         sentinel = 0;
         while ( (ti = u.indexOf("<table")) > 0)
         {
            if (sentinel++ > 100)
            {
               break;
            }
            ts = u.indexOf("<table");
            te = u.indexOf("</table>", ts) + 8;
            u = u.substr(0, ts) + u.substr(te);
         }
         */
         //KD_d('section text 3: ' + u);
         u = u.replace(" href=\""," target=\"_blank\" href=\"http://en.wiktionary.org", "gi");
         out += u;
      }
      else
      {
         //console.log('invalid ' + part_name[1]);
      }
   }
   return out;
};

KitaDic.prototype.responseFetch = function (response) {
   this._isRequestFetching = false;
   var defFound = false;
   var tStem;
   if (
      response.indexOf("Wiktionary does not yet have an entry for") == -1 && 
      response.indexOf("No page with this exact title exists; trying to find similar titles.") == -1 && 
      response.indexOf("There were no results matching the query.") == -1
      )
   {
      var outText = this.parseWiktionaryResponse(response);

      if ( outText !== false )
      {
         outText = this.wiktionarySetStyle(outText);
         if (!this._divIsDisplayed)
         {
            if(!this.attachDiv()) { return; }
            this._div.style.left = this.getNewWindowX() + "px";
            this._div.style.top =this.getNewWindowY() + "px";
         }
         tStem = this.guessStemWord(this._currentWord);
         KD_d("responseFetch:tStem="+tStem);
         if (tStem == this._currentWord) {
            tStem = "";
         } else {
            tStem = "stem: " + tStem + " ?,";
         }
         this._div.innerHTML = 
            "<div style='margin-bottom:4px;'><b><a target='_blank' style='font-size:13pt;' href='http://en.wiktionary.org/wiki/"+ this._currentWord +
            "' >"+this._currentWord+"</a></b> " +
            " &nbsp;&nbsp;(" + tStem +
            " also in " +
            " <a target='_blank' href='http://www.wikipedia.org/wiki/"+this._currentWord+"'>Wikipedia</a>, " +
            " Google <a target='_blank' href='http://www.google.com/dictionary?langpair=en|en&q="+this._currentWord+"'>Eng</a> " +
            " <a target='_blank' href='http://www.google.com/dictionary?langpair=en|ko&q="+this._currentWord+"'>Kor</a>, " +
            " <a target='_blank' href='http://www.answers.com/"+this._currentWord+"'>Answers</a>, " +
            " <a target='_blank' href='http://endic.naver.com/search.nhn?query="+this._currentWord+"'>Naver</a>, " +
            " <a target='_blank' href='http://engdic.daum.net/dicen/search_result_total.do?q="+this._currentWord+"'>Daum</a>" +
            " )</div>" +
            "<div>" +
            outText +
            "</div>" +
            "<div style='float:right;'>(retrieved from <a target=_blank href=http://www.wiktionary.org>wiktionary.org</a>)</div>";
         this.showDiv();
      }
      else 
      {
         // unable to parse the content
         KD_d("KD_fetchWord:fetched but unable to parse");
         if(!this.attachDiv()) { return; }
         this._div.style.left = this.getNewWindowX() + "px";
         this._div.style.top = this.getNewWindowY() + "px";
         this._div.innerHTML = "No English definition of <a target='_blank' style=\"color:"+this._linkColor+";\" href='http://www.wiktionary.org/wiki/"+this._currentWord+"'>"+this._currentWord+"</a> in <a target=_blank href=http://www.wiktionary.org>wiktionary.org</a>";
         this.showDiv();
      }
   } 
   else
   {
      // definition not found
      KD_d("KD_fetchWord:fetched but no definition");
      if(!this.attachDiv()) { return; }
      this._div.style.left = this.getNewWindowX()+"px";
      this._div.style.top =  this.getNewWindowY()+"px";
      tStem = this.guessStemWord(this._currentWord);
      if (tStem == this._currentWord)
      {
         tStem = "";
      } 
      else
      {
         tStem = "* " + tStem + "?<br/>";
      }
      this._div.innerHTML =
         "* No definition for <b><a target='_blank' href='http://en.wiktionary.org/wiki/"+this._currentWord+"'>" +
         this._currentWord+"</a></b> was found in <a target=_blank href=http://www.wiktionary.org>wiktionary.org</a>.<br/><br/>" +
         tStem +
         " (links for " + this._currentWord + " in:" +
         " <a target='_blank' href='http://www.wikipedia.org/wiki/"+this._currentWord+"'>Wikipedia</a>, " +
         " Google <a target='_blank' href='http://www.google.com/dictionary?langpair=en|en&q="+this._currentWord+"'>Eng</a> " +
         " <a target='_blank' href='http://www.google.com/dictionary?langpair=en|ko&q="+this._currentWord+"'>Kor</a>, " +
         " <a target='_blank' href='http://www.answers.com/"+this._currentWord+"'>Answers</a>, " +
         " <a target='_blank' href='http://endic.naver.com/search.nhn?query="+this._currentWord+"'>Naver</a>, " +
         " <a target='_blank' href='http://engdic.daum.net/dicen/search_result_total.do?q="+this._currentWord+"'>Daum</a>" +
         " )";
      this.showDiv();
   }
};

KitaDic.prototype.requestFetchWord = function (word) {
   var defFound = false;
   KD_d("requestFetchWord:word=" + word);

   try   {
      KD_request = new XMLHttpRequest();
      if (KD_request.readyState !== 0) {
         KD_d("CRITICAL: request aborted in KD_fetchWord");
         return;
      }
      var url="http://en.wiktionary.org/wiki/"+ word;
      KD_request.open("GET", url, true);
      KD_request.send(null);
   }
   catch (e)   {
      KD_d("CRITICAL: request object creation failed in KD_fetchWord");
      return;
   }

   KD_request.onreadystatechange = function() {
      if (KD_request.readyState == 4) {
         if (KD_request.status==200) {
            KitaDic_Overlay.responseFetch(KD_request.responseText);
         }
         else {
            KD_d("CRITICAL: request status is " + KD_request.status + " (not 200) in KD_fetchWord\n" + KD_request.responseText);
            KitaDic_Overlay.responseFetch("Wiktionary does not yet have an entry for");
         }
      }
   };
};

KitaDic.prototype.wiktionaryGetSection = function (sourceText,sectionName) {
   // Convert to lowercase to find pattern position.
   // Discard lowercase needle and hay later.
   var sNameLower = sectionName.replace(" ","_","ig").toLowerCase();
   var patternLower = "<p><a name=\"" + sNameLower + "\" id=\"" + sNameLower + "\"></a></p>";
   var sourceLower = sourceText.toLowerCase();
   var headPos = sourceLower.indexOf(patternLower);
   if ( headPos != -1 ) {
      var u = sourceText.substring(headPos+patternLower.length);
      u = this.cutHead_preserve("<ol>", u);
      u = this.cutTail2_preserve("</ol>", u);
      u = u.replace(" href=\""," target=\"_blank\" href=\"http://en.wiktionary.org", "gi");
      KD_d("wiktionaryGetSection:r="+u);
      return u;
   }
   KD_d("wiktionaryGetSection: *not found*");
   return false;
};

KitaDic.prototype.wiktionarySetStyle = function (stxt) {
   KD_d("wiktionarySetStyle:Before\n"+stxt);
   return stxt;
};

//////////////////////////////////////////////////////////////////////
// Utility Functions
//////////////////////////////////////////////////////////////////////

KitaDic.prototype.getWordAt = function(offset)
{
   var len = this.length;
   if(offset < 0 || offset >= len)
   {
      return null;
   }

   var single_char = this.charAt(offset);
   //KD_d(single_char);
   //var ma = single_char.search(/[\u4E00-\u9FA5]/);
   var ma = single_char.search(/[\uAC00-\uD7A3]/);
   if(ma != -1)
   {
      return single_char;
   }

   var s = offset;
   var f = offset + 1;

   while(s >= 0)
   {
      single_char = this.charAt(s);
      ma = single_char.search(/[\w'\-]/);
      if(ma == -1)
      {
         break;
      }
      s --;
   }
   s ++;

   while(f < len)
   {
      single_char = this.charAt(f);
      ma = single_char.search(/[\w'\-]/);
      if(ma == -1)
      {
         break;
      }
      f ++;
   }

   var result = this.substring(s, f);
   if(result !='')
   {
      return result;
   }
   else
   {
      return null;
   }
};

KitaDic.prototype.getWordAt2 = function(parent, offset, target)
{
   try   {
      if (parent.parentNode != target) {
         return null;
      }
   }
   catch (e) {
      return null;
   }
   if (parent.nodeType != Node.TEXT_NODE) 
   {
      return null;
   }

   var len = this.length;
   if(offset < 0 || offset >= len)
   {
      return null;
   }

   var s = offset;
   var f = offset + 1;

   var start;
   var end;
   var terminator = "``~!@#$%^&*()_-+=|\\[{]}'\";:/?.>,<— ";

   while(s >= 0)
   {
      single_char = this.charAt(s);
      if (terminator.indexOf(single_char) > 0)
      {
         break;
      }
      s --;
   }
   s ++;
   start = s;

   while(f < len)
   {
      single_char = this.charAt(f);
      if (terminator.indexOf(single_char) > 0)
      {
         break;
      }
      f ++;
   }
   end = f;

   var result = this.substring(start, end);
   if(result !='')
   {
      return result;
   }
   else
   {
      return null;
   }
};

KitaDic.prototype.dumpObject = function(obj, name, maxDepth, curDepth) {
   if (curDepth === undefined) 
   {
      curDepth = 0;
   }
   if (maxDepth !== undefined && curDepth > maxDepth) 
   {
      return;
   }
   var i = 0;
   for (var prop in obj) 
   {
      if (typeof (obj[prop]) == "object") 
      {
         i++;
         if (obj[prop] && obj[prop].length !== undefined) 
         {
            KD_d(name + "." + prop + "=[probably array, length " + obj[prop].length + "]");
         }
         else
         {
            KD_d(name + "." + prop + "=[" + typeof (obj[prop]) + "]");
         }
         this.dumpObject(obj[prop], name + "." + prop, maxDepth, curDepth + 1);
      }
      else 
      {
         i++;
         if (typeof (obj[prop]) == "function") 
         {
            KD_d(name + "." + prop + "=[function]");
         } 
         else
         {
            KD_d(name + "." + prop + "=" + obj[prop]);
         }
      }
   }
   if (i === 0) 
   {
      KD_d(name + " is empty");
   }
};


KitaDic.prototype.guessStemWord = function (oldWord) {
   return oldWord;
};

// word-end replacer
KitaDic.prototype.correctWordEnd = function(sword, sfrom, sto) {
   if (sword.substr(sword.length-sfrom.length) == sfrom) {
      return sword.substr(0,sword.length-sfrom.length) + sto;
   } else {
      return sword;
   }
};

// Derived & Modified from BackWord
KitaDic.prototype.getCurrentWord = function(parent, offset, target) {
   try   {
      if (parent.parentNode != target) {
         return null;
      }
   }
   catch (e) {
      return null;
   }
   if (parent.nodeType != Node.TEXT_NODE) {
         return null;
   }
   var container = parent.parentNode;
   if (container) {
         var foundNode = false;
         for (var c = container.firstChild; c !== null; c = c.nextSibling) {
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
   KD_d("getCurrentWord="+text);
   return text.toLowerCase();
};

// Derived & Modified from BackWord
KitaDic.prototype.getCurrentWordAny = function(parent, offset, target) {
   try   {
      if (parent.parentNode != target) {
         return null;
      }
   }
   catch (e) {
      return null;
   }
   if (parent.nodeType != Node.TEXT_NODE) {
         return null;
   }
   //KD_d("KD_getCurrentWord:parent.nodeType="+parent.nodeType);
   //KD_d("KD_getCurrentWord:parent.tagName="+parent.tagName);

   var container = parent.parentNode;
   if (container) {
         var foundNode = false;
         for (var c = container.firstChild; c !== null; c = c.nextSibling) {
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
   return text.toLowerCase();
};

KitaDic.prototype.plainText = function(text_) {
    var text = KD_HTMLEncode(text_);
    text = text.replace(/\n/g, "<BR />");
    return text;
};

KitaDic.prototype.HTMLEncode = function(text) {
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/'/g, "&#146;");
    return text;
};

KitaDic.prototype.HTMLDecode = function(text) {
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&quot;/g, "\"");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&#146;/g, "'");
    text = text.replace(/<BR \/>/g, "\n");
    return text;
};

KitaDic.prototype.isWord = function(str){
   KD_d("word="+str);
   var i=0;
   for(; i<str.length; i++){
      if (!this.isAlphabet(str.substr(i, 1))) {
         return false;
      }
   }
   return true;
};

KitaDic.prototype.isAlphabet = function(str){
   //KD_d("char="+str);
   var valid_chars = /[a-zA-Z]/;
   return valid_chars.test(str);
};

KitaDic.prototype.isAlphaNumeric = function(str){
   var valid_chars = /\w/;
   return valid_chars.test(str);
};

KitaDic.prototype.getTop = function(div){
   return parseInt(div.style.top.substr(0, div.style.top.length-2), 10);
};

KitaDic.prototype.getLeft = function(div){
   return parseInt(div.style.left.substr(0, div.style.left.length-2), 10);
};

KitaDic.prototype.stripHTML = function(oldString) {
   var newString = "";
   var inTag = false;
   for(var i = 0; i < oldString.length; i++) {
      if(oldString.charAt(i) == '<')
      {
         inTag = true;
      }
      if(oldString.charAt(i) == '>') 
      {
         inTag = false;
         i++;
      }
      if(!inTag) 
      {
         newString += oldString.charAt(i);
      }
   }
   return newString;
};

KitaDic.prototype.stripTags = function(oldString) {
   return oldString.replace(/(<([^>]+)>)/ig,"");
};

// cut head
/*
 ex) strPattern = "cd"
     oldString  = "abcdefg"
     result:      "efg"
*/
KitaDic.prototype.cutHead = function(strPattern, oldString) {
   //KD_d("cutHead " + strPattern);
   //KD_d(oldString);
   i = oldString.indexOf(strPattern);
   if (i==-1) {
      return null;
   } else {
      return oldString.substring(i+strPattern.length);
   }
};

// preserve the strPattern at the beginning
/*
 ex) strPattern = "cd"
     oldString  = "abcdefg"
     result:      "cdefg"
*/
KitaDic.prototype.cutHead_preserve = function(strPattern, oldString) {
   //KD_d("cutHead " + strPattern);
   //KD_d(oldString);
   i = oldString.indexOf(strPattern);
   if (i==-1) {
      return null;
   } else {
      return oldString.substring(i);
   }
};

// cut, search from last
/*
 ex) strPattern = "cd"
     oldString  = "abcdefg_abcdefg"
                             ^"cd"
     result: "abcdefg_ab"
*/
KitaDic.prototype.cutTail = function(strPattern, oldString) {
   //KD_d("cutTail " + strPattern);
   i = oldString.lastIndexOf(strPattern);
   if (i==-1) {
      return null;
   } else {
      return oldString.substring(0, i);
   }
};

// cut, search from beginning
/*
 ex) strPattern = "cd"
     oldString  = "abcdefg_abcdefg"
                     ^"cd"
    result: "ab"
*/
KitaDic.prototype.cutTail2 = function(strPattern, oldString) {
   //KD_d("cutTail " + strPattern );
   i = oldString.indexOf(strPattern);
   if (i==-1) {
      return null;
   } else {
      return oldString.substring(0, i);
   }
};

// cut, search from beginning, preserve strPattern
/*
 ex) strPattern = "cd"
     oldString  = "abcdefg_abcdefg"
                     ^"cd"
     result: "abcd"
*/
KitaDic.prototype.cutTail2_preserve = function(strPattern, oldString) {
   //KD_d("cutTail " + strPattern );
   i = oldString.indexOf(strPattern);
   if (i==-1) {
      return null;
   } else {
      return oldString.substring(0, i + strPattern.length);
   }
};

KitaDic.prototype.trim = function(str){
   if (KD_devMode && true) {
      KD_d("trim:" + str);
      KD_d("trimed:" + this.ltrim(this.rtrim(str)));
   }
   return this.ltrim(this.rtrim(str));
};

KitaDic.prototype.rtrim = function(str){
   var v_length = str.length;
   if(v_length < 0) {
      return "";
   }
   var w_space = String.fromCharCode(32);
   var strTemp = "";
   var iTemp = v_length -1;
   while(iTemp > -1) {
      if(str.charAt(iTemp) == w_space) {
         // do nothing
      }
      else
      {  strTemp = str.substring(0,iTemp +1);
         break;
      }
      iTemp = iTemp-1;
   }
   return strTemp;
};

KitaDic.prototype.ltrim = function(str){
   var w_space = String.fromCharCode(32);
   var v_length = str.length;
   if(v_length < 1){
      return "";
   }
   var strTemp = "";
   var iTemp = 0;
   while(iTemp < v_length){
      if(str.charAt(iTemp) == w_space){
         //do nothing
      }
      else{
         strTemp = str.substring(iTemp,v_length);
         break;
      }
      iTemp = iTemp + 1;
   }
   return strTemp;
};
