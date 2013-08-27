/************************************************
 * 					JTemplate 					*
 * 					CMSPP.NET					*
 * 				   JTemplate.js					*
 *  	2012-8-31 15:48:42$	ZengOhm@gmail.com	*
 ************************************************/
var $JT = new function (){
	var _templateStore = false;
	var _dataList = null;
	var _scanTemplateName = 0;
	var _scanCode = '';
	var  _scanCodeIndex = 0;
	var _scanCodeChar = '';
	var _scanCodeLength = 0;
	var _scanCodeLine = 0;
	var _scanCodeCol = 0;
	var _codeConditionNested = 0;
	var _codeBlockNested = 0;
	/*
	 * 0	Free						-	When start
	 * 1	HTML Block					-	Start with 'First HTML Char' end with '<'
	 * 2	HTML to JTemplate border	-	When read '#' after '<'
	 * 3	JTemplate Block				-	Start with 'First JTemplate Char' end before '#'
	 * 4	JTemplate to HTML border	-	When read '#' and '>' after '#'
	 */
	var _codeState = 0;
	
	var init = function(){
		var html = document.getElementsByTagName('html')[0].innerHTML;
		var reg = new RegExp("<!--\\[([\\w]*?)\\[([^\b]*?)\\]\\]-->", 'g');
		var match = null;
		_templateStore = new Array();
		while (match = reg.exec(html)) {
			if (match[1].length == 0) 
				continue;
			if (_templateStore[match[1]]) 
				throw ('There are more than one templates named by ' + match[1]);
			_templateStore[match[1]] = match[2];
		}
	};

	var _run = function(){
		_scanCodeIndex = 0;
		_scanCodeLength = _scanCode.length;
		_scanCodeLine = 0;
		_scanCodeCol = 0;
		_codeState = 0;
		var rString = 'var codeString = "";';
		
		while(_readChar()){
			switch(_codeState)	{
				case 1:
					rString+= 'codeString += "' + _jsStringEncode(_readHTMLBlock()) + '";';
					break;
				case 3:
					rString+=_readJTemplate()+';';
					break;
			}
		}
		return eval(rString);
	};
	
	var _readJTemplate = function(){
	    if(_codeState==2)_readChar();
	    var rString = '';
		do{
		    if(_codeState==4)return _decodeVar(rString).replace(/echo/g,'codeString += ');
			rString += _scanCodeChar;
		}while(_readChar());
		throw ('JTemplate code should be end with "#>".');
	};
	
	var _readHTMLBlock = function(){
		if(_codeState==4)_readChar();
		var rString = '';
		var lastWord = '';
		do{
			if(lastWord=='<' && _scanCodeChar=='#')return rString; 
			rString+=lastWord;
			lastWord = _scanCodeChar;
		}while(_readChar());
		rString+=lastWord;
		return rString; 
	};
	
	var _jsStringEncode = function(str){
	    return str.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/ig,"\\\n").replace(/\r/ig,"");
	};
	
	var _readChar = function(){
		if(_scanCodeIndex<_scanCodeLength){
			var lastChar = _scanCodeChar;
			_scanCodeChar = _scanCode.substr(_scanCodeIndex,1);
			
			if(_codeState==0)
				_codeState = 1;
			else if(_codeState==1 && lastChar=='<' && _scanCodeChar=='#')
				_codeState = 2;
			else if(_codeState==2)
				_codeState = 3;
			else if(_codeState==3 && _scanCodeChar=='#')
				_codeState = 4;
			else if(_codeState==4 && lastChar=='>')
				_codeState = 1;
			
			if(_scanCodeChar == "\n"){
				_scanCodeLine++;
				_scanCodeCol=0;
			}
			else if(_scanCodeChar == "(")_codeConditionNested++;
			else if(_scanCodeChar == ")")_codeConditionNested--;
			else if(_scanCodeChar == "{")_codeBlockNested++;
			else if(_scanCodeChar == "}")_codeBlockNested--;
			_scanCodeIndex++;
			_scanCodeCol++;
			
			if(_codeBlockNested<0)
				_codeError('Code Block Nested Error');
			if(_codeConditionNested<0)
				_codeError('Code Condition Nested Error');			

			return true;
		}else{
			_scanCodeChar = '';
			return false;
		}
	};
	
	var _codeError = function (info){
		throw ('JTemplate Code Error in Template[' + _scanTemplateName + '] line ' + _scanCodeLine + ' char ' + _scanCodeCol + ': ' + info + '.');
	};

	var _decodeVar = function(varCode){
		return varCode.replace(/\$([a-zA-Z_]+[a-zA-Z_])*?/g,'_dataList.$1');
	};
	
	return function(templateName, dataList){
		if (!_templateStore) 
			init();
		_scanTemplateName = templateName;
		_scanCode = _templateStore[templateName];
		if(!_scanCode)
			throw('JTemplate cannot found Template named by ' + templateName);
		_dataList = dataList == null ? {} : dataList;
		return _run();
	};
};