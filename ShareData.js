/**
 *持久性数据 状态保持 cookie替代
 */
function  PObject(name, defaults, onload) {
	if (!name) {
		//if no name was specified, use the last component of the URL
		name = window.location.pathname;
		var pos = name.lastIndexOf("/");
		if (pos != -1) {
			name = name.substring(pos+1);
		}
	}
	this.$name = name;
	//just delegate to a private, implementation-defined $init() method.
	this.$init(name, defaults, onload);
}

PObject.prototype.save = function  (lifetimeInDays) {
	var s = "";
	for (var name in this) {
		if (name.charAt(0) == "$") {
			continue;
		}
		var value = this(name);
		var type = typeof value;
		//skip properties whose type is object or function 
		if (type == "object" || type == "function") {
			continue;
		}
		if (s.length > 0) {
			s += "&";//separate properties with &
		}
		s += name + ':'+ encodeURLComponent(value);
	}
	//then delegate to a private implementation-defined method to actually save that serialize string.
	this.$save(s, lifetimeInDays);
}
PObject.prototype.forget = function  () {
	//first , delete the serializable properties of this object using the same property-selection criteria as the save() method.
	for (var name in this) {
		if (name.charAt(0) == '$') {
			continue;
		}
		var value = this[name];
		var type = typeof value;
		if (type == 'functon' || type == 'object') {
			continue;
		}
		delete this[name];
	}
	// then erase and expire any previously saved data by savint the empty string and setting its lifetime to 0.
	this.$save("",0);
}

//parse the string s into name/value pairs and set them as properties of this. if the string is null or empty, copy properties from 
//defaults instead, this private utility method is used by the implementations of $init() below.
PObject.prototype.$parse = function  (s, defaults) {
	if (!s) {
		if (defaults) {
			for (var name in defaults) {
				this[name] = defaults[name];
			}
			return;
		}
	}
	var pros =s.split('&');
	for (var i=0; i<props.length; i++) {
		var p = props[i];
		var a = p.split(':');
		this[a[0]] = decodeURIComponent(a[1]);
	}
}

/**
 *the implementation-speciific portion of the module is below.
 *for each implementation, we define an $init() method that loads
 *persistent data and a $save() method that saves it.
 */
 var isIE = navigator.appName == "Microsoft Internet Explorer";
 var hasFlash7 = false;
 if (!isIE && navigator.plugins) {//if we use the netscape plugin architecture
	 var flashplayer = navigator.plugins["Shockwave Flash"];
	 if (flashplayer) {//if we've got a flash plugin
		 //extract the version number
		 var flashversion = flashplayer.description;
		 var flashversion = flashversion.substring(flashversion.search("\\d"));
		 if (parseInt(flashversion) >= 7) {
			 hasFlash7 = true;
		 }
	 }
 }

 if (isIE) {
	 //if we're in IE the PObject() constructor delegates to this initialization function 
	 PObject.prototype.$init = function  (name, defaults, onload) {
		 //create a hidden element with the userdata behavior to persist data
		 var div = document.createElement("div");
		 this.$div = div;
		 div.id = "PObject" + name;
		 div.style.display = "none";
		 div.style.behavior = "url('#default#userData')";
		 document.body.appendChild(div);
		 div.load(name);
		 var data = div.getAttribute("data");
		 this.$parse(data, defaults);
		 if (onload) {
			 var pobj = this;
			 setTimeout(function() {
				 onload(pobj, name);
			 }, 0);
		 }
	 }
	 //persist the current state of the persistent object
	 PObject.prototype.$save = function  (s, lifetimeInDays) {
		 if (lifetimeInDays) {
			 var now = (new Date()).getTime();
			 var expires = now + lifetimeInDays*24*60*60*1000;
			 this.$div.expires = (new Date(expires)).toUTCString();
		 }
		 this.$div.setAttribute("data", s);
		 this.$div.save(this.$name);
	 }
 }else if (hasFlash7) {
	 PObject.prototype.$init = function  (name, defaults, onload) {
		 var moviename = "PObject_" + name;
		 var url = "PObject.swf?name=" + name; //url to the movie file
		 //when the flash player has started up and has our data ready, it notifies us with an FSCommand. We must define a handler that is called when that happens.
		 var pobj = this;
		 window[moviename + "_DoFSCommond"] = function  (command, args) {
			 var data = pobj.$flash.GetVariable("data");
			 pobj.$parse(data, defaults);
			 if (onload) {
				 onload(pobj, name);
			 }
		 }
		 var movie  = createElement("embed");
		 movie.setAttribute("id", moviename);
		 movie.setAttribute("name", moviename);
		 movie.setAttribute("type", "application/x-shockwave-flash");
		 movie.setAttribute("src", url);
		 movie.setAttribute("width", 1);
		 movie.setAttribute("height", 1);
		 movie.setAttribute("style", "position:absolute;left:0px;top:0px;");
		 document.body.appendChild(movie);
		 this.$flash = movie;
	 }
	 Pobject.prototype.$save = function  (s, lifetimeInDays) {
		 this.$flash.SetVariable("data", s);
	 }
 }else {//use cookie
	 PObject.prototype.$init = function  (name, defaults, onload) {
		 var allcookies = document.cookie;
		 var data = null;
		 var start = allcookies.indexOf(name + '=');
		 if (start != -1) {
			 start += name.length + 1 ;
			 var end = allcookies.indexOf(';', start);
			 if (end==-1) {
				 end = allcookies.length;
				 data = allcookies.substring(start,end);
			 }
		 }
		 this.$parse(data, defaults);
		 if (onload) {
			 var pobj = this;
			 setTimeout(function  () {
				 onload(pobj,name);
			 },0);
		 }
	 }
	 PObject.prototype.$save = function  (s, lifetimeInDays) {
		 var cookie = this.$name + '=' +s;
		 if (lifetimeInDays != null) {
			 cookie += "; max-age=" + (lifetimeInDays*24*60*60);
		 }
		 document.cookie = cookie;
	 }
 }

 //基于flash实现的完整actionscipt
 //基于flash的持久性实现依赖于一个名为PObject.swf的flash电影，这个电影只不过是一个编译过的actionscript文件

 class PObject {
	static function main () {
		var version = getVersion();
		version = parseInt(version.substring(version.lastIndexOf(" ")));
		if (isNaN(version) || version < 7) {
			return;
		}
		_root.so = ShareObject.getLocal(_root.name);
		_root.data = _root.so.data.data;
		_root.watch("data", function  (propName, oldValue, newValue) {
			_root.so.data.data = newValue;
			_root.so.flush();
		});
		fscommand("init");
	}
 }