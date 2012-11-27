/**
 *一些常用的js代码
 */
Browser={
	ie:/msie/.test(window.navigator.userAgent.toLowerCase()),
	moz:/gecko/.test(window.navigator.userAgent.toLowerCase()),
	opera:/opera/.test(window.navigator.userAgent.toLowerCase()),
	safari:/safari/.test(window.navigator.userAgent.toLowerCase()),
	ie6:/msie 6/.test((window.navigator.userAgent).toLowerCase())
};
//动态加载js
JsLoader={
	load:function(sUrl,charset,fCallback){
		var _script=document.createElement('script');
		_script.setAttribute('charset',charset);
		_script.setAttribute('type','text/javascript');
		_script.setAttribute('src',sUrl);
		document.getElementsByTagName('head')[0].appendChild(_script);
		if(Browser.ie){
			_script.onreadystatechange=function(){
				if(this.readyState=='loaded'||this.readyState=='complete'){
					setTimeout(function(){try{fCallback();}catch(e){}}, 50);
				}
			};
		}else if(Browser.moz){
			_script.onload=function(){
				setTimeout(function(){try{fCallback();}catch(e){}}, 50);
			};
		}else{
			setTimeout(function(){try{fCallback();}catch(e){}}, 50);
		}
	}
};
//cookie设置读取函数
var setCookie = function(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";path=/;domain=xunlei.com;expires="+exdate.toGMTString());
}
var getCookie = function(name){
	try{
		var str = (document.cookie.match(new RegExp("(^"+name+"| "+name+")=([^;]*)"))==null)?"":decodeURIComponent(RegExp.$2);
		return str;	
	}catch(e){
		return null;
	}
}

/**
 *跨域提交代码 需要一个代理proxyForm.html页面置于提交数据域
 *代理html页跟数据处理后台页需在同一个域
 *代理页面跟 提交发起页面document.domain需要设置成一致
 *不在同一个子域的页面不能发起ajax跨域提交
 *代理页面内部需要有ajax代码
 */
var CrossDomain = new Object();
CrossDomain = {
	Onload : false,
	getDoc : function () {
		return document.getElementById('iframe_proxy').contentWindow; //iframe的id
	},
	KKPOST : function  (url, params, func) {
		if (!this.Onload) return false;
	    return this.getDoc().pxlAjax(url, params, func).post();
	},
	KKGET  : function(url, params, func){
		if (!this.Onload) return false;
		return this.getDoc().pxlAjax(url, params, func).get();
	},
	iframeOnload : function() {
		this.Onload = true;
	}
}
/**
 *事件兼容对象
 */
Util = {
	//判断一个元素是是另一个元素的子元素 可用于mouseover事件多次触发修复 阻止冒泡也可行
	 eleContains : function (parentNode, childNode) {
		if (parentNode.contains) {
			return parentNode != childNode && parentNode.contains(childNode);
		} else {
			return !!(parentNode.compareDocumentPosition(childNode) & 16);
		}
	 },	 
	
	//事件
	addHandler : function (ele, type, handler) {
		if (ele.addEventListener) {
			ele.addEventListener(type, handler, false);
		}else if(ele.attachEvent){
			ele.attachEvent('on'+type, handler);
		}else {
			ele['on'+type] = handler;
		}
	},
	removeHandler : function (ele, type, handler) {
		if (ele.removeEventListener) {
			ele.removeEventListener(type, handler, false);
		}else if (ele.detachEvent) {
			ele.detachEvent('on'+type, handler);
		}else{
			ele['on'+type] = null;
		}
	},
	getEvent : function (e) {
		return e || window.event;
	},
	getTarget : function (event) {
		return event.target || event.srcElement;
	},
	preventDefault : function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		}else {
			event.returnValue = false;
		}
	},
	stopPropagation : function (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		}else {
			event.cancelBubble = true;
		}
	},
	getRelatedTarget : function (event) {
		if (event.relatedTarget) {
			return event.relatedTarget;
		}else if (event.toElement) {
			return event.toElement;
		}else if (event.fromElement) {
			return event.fromElement;
		}else {
			return null;
		}
	},
	getButton : function (event) {
		if (document.implementation.hasFeature("MouseEvents", "2.0")) {
			return event.button;
		}else {
			switch (event.button) {
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
				
			
			}
		}
	},
	//可以获得焦点的元素才可以触发keypress 可编辑区域可触发textInput事件 字符编码
	getCharCode : function (event) {
		if (typeof event.charCode == 'number') {
			return event.charCode;
		}else {
			return event.keyCode;
		}
	},
	//禁用鼠标右键的默认上下文事件
	//Util.addHandler(document,'contextmenu',function(e){});
	//页面卸载事件 beforeunload事件 所有浏览器都支持
	//mousewheel 鼠标滚动事件

	//剪切板事件 opera不支持
	getClipboardText : function (event) {
		var clipBoardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData('text');
	},
	setClipboardText : function (event, value) {
		if (event.clipboardData) {
			return event.clipboardData.setData('text/plain', value);
		}else if (window.clipboardData) {
			return window.clipboardData.setData('text', value);
		}
	},
	getCurrentStyle:function(obj, prop){     
        if (obj.currentStyle) {    
            return obj.currentStyle[prop];     
        } else if(window.getComputedStyle) {        
            return document.defaultView.getComputedStyle (obj,null)[prop];
        }
        return null;   
    }
}
//自定义事件
function EventTarget(){
    this.handlers = {};    
}

EventTarget.prototype = {
    constructor: EventTarget,

    addHandler: function(type, handler){
        if (typeof this.handlers[type] == "undefined"){
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    },
    
    fire: function(event){
        if (!event.target){
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array){
            var handlers = this.handlers[event.type];
            for (var i=0, len=handlers.length; i < len; i++){
                handlers[i](event);
            }
        }            
    },

    removeHandler: function(type, handler){
        if (this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            for (var i=0, len=handlers.length; i < len; i++){
                if (handlers[i] === handler){
                    break;
                }
            }
            
            handlers.splice(i, 1);
        }            
    }
};
//拖拽代码
var DragDrop = function(){        
	var dragdrop = new EventTarget();
	var dragging = null;
	var diffX = 0;
	var diffY = 0;

	function handleEvent(event){

		//get event and target
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);            

		//determine the type of event
		switch(event.type){
			case "mousedown":
				if (target.className.indexOf("draggable") > -1){
					dragging = target;
					diffX = event.clientX - target.offsetLeft;
					diffY = event.clientY - target.offsetTop;
					dragdrop.fire({type:"dragstart", target: dragging, x: event.clientX, y: event.clientY});
				}                     
				break;
				
			case "mousemove":
				if (dragging !== null){
				
					//get event
					event = EventUtil.getEvent(event);
					
					//assign location
					dragging.style.left = (event.clientX - diffX) + "px";
					dragging.style.top = (event.clientY - diffY) + "px";   

					//fire custom event
					dragdrop.fire({type:"drag", target: dragging, x: event.clientX, y: event.clientY});
				}                    
				break;
				
			case "mouseup":
				dragdrop.fire({type:"dragend", target: dragging, x: event.clientX, y: event.clientY});
				dragging = null;
				break;
		}
	};

	//public interface
	dragdrop.enable = function(){
			EventUtil.addHandler(document, "mousedown", handleEvent);
			EventUtil.addHandler(document, "mousemove", handleEvent);
			EventUtil.addHandler(document, "mouseup", handleEvent);
	};
		
	dragdrop.disable = function(){
			EventUtil.removeHandler(document, "mousedown", handleEvent);
			EventUtil.removeHandler(document, "mousemove", handleEvent);
			EventUtil.removeHandler(document, "mouseup", handleEvent);
	};

	return dragdrop;
}();
//拖拽示例
/*
DragDrop.enable();				
DragDrop.addHandler("dragstart", function(event){
	var status = document.getElementById("status");
	status.innerHTML = "Started dragging " + event.target.id;
});
DragDrop.addHandler("drag", function(event){
	var status = document.getElementById("status");
	status.innerHTML += "<br />Dragged " + event.target.id + " to (" + event.x + "," + event.y + ")";
});
DragDrop.addHandler("dragend", function(event){
	var status = document.getElementById("status");
	status.innerHTML += "<br />Dropped " + event.target.id + " at (" + event.x + "," + event.y + ")";
});
*/