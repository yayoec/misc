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