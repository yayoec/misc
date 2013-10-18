//Author Joe
//Email  yayoec@gmail.com
//Date   2013-10-18
var Pager = function(totalpage, nowpage){
	this.totalpage = totalpage;
	this.nowpage = nowpage;
}
Pager.prototype.init = function(){
	var htm = '<div class="flow-page" id="listPager"><p class="list-pager">';
	if (this.totalpage == 0) {
		htm += '<strong class="L_2"></strong><strong class="L_1"></strong>';
		htm += '<strong>1</strong>';
		htm += '<strong class="r_3"></strong><strong class="r_4"></strong>';
		htm += '</p></div>';
		return htm;
	}
	if(this.totalpage <= 5){
		if(this.nowpage == 1){
			htm += '<strong class="L_2"></strong><strong class="L_1"></strong>';
		}else{
			htm += '<a href="#" class="L_4"></a><a href="#" class="L_3"></a>'
		}
		for(i=0; i<this.totalpage; i++){
			if((i+1) == this.nowpage){
				htm += '<strong>'+ (i+1) +'</strong>';
			}else{
				htm += '<a href="#">'+ (i+1) +'</a>';
			}
		}
		if(this.nowpage >= this.totalpage){
			htm += '<strong class="r_3"></strong><strong class="r_4"></strong>';
		}else{
			htm += '<a href="#" class="r_1"></a><a href="#" class="r_2"></a>';
		}
		htm += '</p></div>';
	}else{
		if(this.nowpage == 1){
			htm += '<strong class="L_2"></strong><strong class="L_1"></strong>';
		}else{
			htm += '<a href="#" class="L_4"></a><a href="#" class="L_3"></a>'
		}
		if(this.nowpage >= 4){
			htm += '<a href="#">…</a>';
		}
		if((this.nowpage - 2 > 0) && (this.nowpage + 2 <= this.totalpage)){
			for(i = this.nowpage - 2; i <= this.nowpage + 2; i++){
				if(i == this.nowpage){
					htm += '<strong>'+ i +'</strong>';
				}else{
					htm += '<a href="#">'+ i +'</a>';
				}
			}
		}else{
			if(this.nowpage - 2 <= 0){
				for(i=1;i<6;i++){
					if(i == this.nowpage){
						htm += '<strong>'+ i +'</strong>';
					}else{
						htm += '<a href="#">'+ i +'</a>';
					}	
				}
			}else{
				for(i=this.totalpage - 4; i<=this.totalpage; i++){
					if(i == this.nowpage){
						htm += '<strong>'+ i +'</strong>';
					}else{
						htm += '<a href="#">'+ i +'</a>';
					}
				}

			}
		}
		if(this.nowpage + 2 < this.totalpage){
			htm += '<a href="#">…</a>';	
		}
		if(this.nowpage >= this.totalpage){
			htm += '<strong class="r_3"></strong><strong class="r_4"></strong>';
		}else{
			htm += '<a href="#" class="r_1"></a><a href="#" class="r_2"></a>';
		}
		htm += '</p></div>';
	}
	return htm;
}