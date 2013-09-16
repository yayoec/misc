function cover_bg () {
	var cover_dom = document.getElementById('__cover__bg');
	if(!cover_dom){
		if (/msie/.test(window.navigator.userAgent.toLowerCase())) {
			var div = document.createElement('div');
			var cstyle = 'width:100%;height: 100%;_position:absolute;position: fixed;left: 0;top: 0;z-index: 10;';
				cstyle += 'background-color: #000;opacity: 0.4;filter:alpha(opacity=40);over-flow:hidden';
			div.id = '__cover__bg';
			div.style.setAttribute('cssText', cstyle);
			document.body.appendChild(div);			
		}else{
			var div = document.createElement('div');
			var cstyle = 'width:100%;height: 100%;_position:absolute;position: fixed;left: 0;top: 0;z-index: 10;';
				cstyle += 'background-color: #000;opacity: 0.4;filter:alpha(opacity=40);over-flow:hidden';
			div.id = '__cover__bg';
			div.setAttribute('style', cstyle);
			document.body.appendChild(div);
		}
	}else {
		document.getElementById('__cover__bg').style.display = 'block';
	}
}

function hide_bg () {
	var cover_dom = document.getElementById('__cover__bg');
	try{
		cover_dom.style.display = 'none';
	}catch(e){
		alert(e);
	}
}