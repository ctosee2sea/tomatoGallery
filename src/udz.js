
var newIdCount = 1;
function newId () {
	return "newId_"+(newIdCount++);
}



function __TOMATOOBJECT () {  // __tomato_class_generator하고 비슷한데 , getset 쪽을 분리했고.   set -> name("sean")   get -> name() 이렇게 변경
}
__TOMATOOBJECT.prototype = {
	standby:function (opt,D) {
		var opt = opt?opt:{};
		for (var key in D) {
			this[key] = this.getset(opt[key]!==undefined?opt[key]:D[key]);
		}
	},
	getset:function  (v) { //게터 세터 + private 변수
		var V = v;
		return function (v) {
			if (v!==undefined) V = v;
			else return V; 
		}
	},
	setVariable:function (key,V) {
		this[key]=V;
	},
	setOutlet:function () {
		if (!this.outlet ) return false;
		var _this = this;

		$.map(
			this.outlet(),
			function (m) {
				// console.log(m);
				if (_this[m[0]]()) _this[m[0]]().unbind(m[2]).bind(m[2],function (e) {
					_this[m[1]](e);
					// m[1]();
					// _this.call(m[1]);
				});
			}
		);
	},
	makeCallBack:function (total,callback) {
		var count=0;
		return function () {
			console.log("cs"+count);
			if (total-1==count++) callback();
		};
	},
	typeOfMatching :function (F,V) { //frame, Variable
		// F의 key와 V의 각 변수 종류를 매칭시킨 Object를 반환한다.
		// ex) __TYPEOF_MATCHING({"object":"option","function":"callback","string":"identity"},{"name":"sean","meta":{"age":"30","job":"programmer"},"go":function (A) {return A}})
		//  return {"option":{"age":"30","job":"programmer"},"callback":function (A) {return A},"identity":"sean"}


		//1. jqueryMap으로 V를 object->array로 변경
		//2. reduce로 typeof으로 매칭

		return $
			.map(V,function (v) {
				return [v]})
			.reduce(function (obj,v) {
				return obj[F[typeof(v)]]=v,obj;
			},
			{});
	}
}





function __tomatoGallery (opt) {
	var Id = newId();
	this.standby (opt,{
		"table":null,
		"img":null,
		"galleryId":Id,
		"mode":"desktop"
	});
	this.start();
}

__tomatoGallery.prototype = new __TOMATOOBJECT();
__tomatoGallery.prototype.start = function () {
	this.parse();
	this.generate();
	// if ($(window).width()<768) this.mode("mobile");
	// this.galleryId(newId());
	// var html = '<div class="tomatoGallery_compiled"><input type="button" value="<" class="tomatoGallery_btn_prev"><input type="button" value=">" class="tomatoGallery_btn_next"><ul class="tomatoGallery_visualUl"><li class="tomatoGallery_visualLi"><p class="tomatoGallery_visualP">사진 설명을 넣으세요</p><img src="/tomato/plugin/download/download.php?bId=4628&id=299&field=file&size=1000" alt="" class="tomatoGallery_visualImg">/li>/ul><ul class="tomatoGallery_thumbnailUl"><li class="tomatoGallery_thumbnailLi"><img src="/tomato/plugin/download/download.php?bId=4628&id=299&field=file&size=1000" alt="" class="tomatoGallery_thumbnailImg">/li>/ul>/div>';
	var _this = this;
	// var size = this.table().hasClass("small")?400:800;
	var size = this.table().parent().height();
	if (size>document.documentElement.clientWidth) size = document.documentElement.clientWidth*1.2;
	var tg = new __tg({
			"canvas":$("#"+this.galleryId()),
			"width":this.table().width(),
			"height":size,
			"img":$("#"+this.galleryId()).children(".tomatoGallery_visualUl"),
			"tab":$("#"+this.galleryId()).find(".tomatoGallery_thumbnailUl"),
			"enableZoom":(this.table().hasClass('noZoom')||this.mode()=='mobile'?false:true),
			"enableDrag":(this.table().hasClass('noDrag')||this.mode()=='mobile'?false:true),
			"if_prev":$("#"+this.galleryId()).children(".tomatoGallery_btn_prev"),
			"if_next":$("#"+this.galleryId()).children(".tomatoGallery_btn_next"),
			"if_download":$("#"+this.galleryId()).children(".tomatoGallery_tools").children(".btns").children("button.m3"), //다운로드 버튼
			"if_zoomIn":$("#"+this.galleryId()).children(".tomatoGallery_tools").children(".btns").children("button.m4"),  //확대 버튼
			"if_zoomOut":$("#"+this.galleryId()).children(".tomatoGallery_tools").children(".btns").children("button.m5"),  //축소 버튼
			"if_fullScreen":$("#"+this.galleryId()).children(".tomatoGallery_tools").children(".btns").children("button.m6"), //전체 화면 버튼
			"if_bigMode":$("#"+this.galleryId()).children(".tomatoGallery_tools").children(".btns").children("button.m7"), //전체 화면 버튼
			"if_close":$("#"+this.galleryId()).children(".tomatoGallery_btn_close"),
			"frameMode":(this.table().hasClass("frame")?true:false),
			"fullImg":(this.table().hasClass("fullImg")?true:false),
			"speed":50,
			"autoFlip":(this.table().hasClass("autoFlip")?(this.table().attr("data-flipSpeed")?this.table().attr("data-flipSpeed"):5000):false),
			})
}
__tomatoGallery.prototype.parse = function () {
	this.img(
		$.map(this.table().children("tbody").children("tr"),function (tr) {
			return [{
				"img":$(tr).children("td").find("img").attr("src"),
				"p":$(tr).children("th").text(),
				"archives":($(tr).children("td").find("img").hasClass("archives")?$(tr).children("td").find("img").parent().attr("href"):null),
				"thumbnail":($(tr).children("td").find("img").attr("data-thumbnail")?$(tr).children("td").find("img").attr("data-thumbnail"):null	)
			}];
		})
	);
}

__tomatoGallery.prototype.generate=function () {
	this.table().after((this.table().hasClass('noTools')?'':'<div class="tomatoGallery_tools"><div class="btns"><button class="m3" type="button" id="if_down">다운로드</button><span class="m3">다운로드</span><button class="m4" type="button" id="if_zoomIn">확대</button><span class="m4">확대</span><button class="m5" type="button" id="if_zoomOut">축소</button><span class="m5">축소</span><button class="m6" type="button" id="if_fullScreen">전체 화면</button><span class="m6">전체 화면</span>'+(this.table().hasClass('bigMode')?'<button class="m7" type="button" id="if_bigMode">큰 화면</button>':'')+'</div></div>')+'<div class="tomatoGallery_compiled" id="'+this.galleryId()+'">'+(this.img().length>1?'<input type="button" value="<" class="tomatoGallery_btn_prev"><input type="button" value=">" class="tomatoGallery_btn_next">':'')+'<input type="button" class="tomatoGallery_btn_close" value="X"><ul class="tomatoGallery_visualUl"></ul>'+($(window).width()<1024?'<div class="thumbnailPack">':'')+'<ul class="tomatoGallery_thumbnailUl"></ul>'+($(window).width()<1024?'</div>':'')+'</div>');
	var _this = this;
	$.map(this.img(),function (img) {
		// console.log(img);
		$("#"+_this.galleryId()).children(".tomatoGallery_visualUl").append('<li class="tomatoGallery_visualLi">'+(img.p.length?'<p class="tomatoGallery_visualP">'+img.p+(img.archives?'<a href="'+img.archives+'" class="openArchives">[Archives]</a>':'')+'</p>':'')+'<img src="'+img.img+'" alt="" class="tomatoGallery_visualImg imgFixTG"></li>');
		// console.log(img.img);
		var src = img.img;
		// console.log(src);
		$("#"+_this.galleryId()).find(".tomatoGallery_thumbnailUl").append('<li class="tomatoGallery_thumbnailLi"><img src="'+(img.thumbnail?img.thumbnail:src)+'" alt="" class="tomatoGallery_thumbnailImg"></li>');
	});

	if (this.img().length>1) { //1보다 클 때는 맨 처음과 마지막을 버퍼로 사용하여, 마지막 페이지 혹은 첫 페이지에서 자연스럽게 다시 반대로 오게함
		var first = $("#"+_this.galleryId()).children(".tomatoGallery_visualUl").children("li.tomatoGallery_visualLi:first-child");
		var last = $("#"+_this.galleryId()).children(".tomatoGallery_visualUl").children("li.tomatoGallery_visualLi:last-child");
		$(first).before($(last).clone().addClass("clone"));
		$(last).after($(first).clone().addClass("clone"));
	}
}


var __tg =function (opt) {
	this.next = this.moveF(1,this);
	this.prev = this.moveF(-1,this);
	this.zoomIn = this.zoomF(1,this);
	this.zoomOut = this.zoomF(-1,this);
	// console.log(opt.enableZoom);

	this.standby(opt,
	{
		"canvas":null,
		"img":null,
		"tab":null,
		"zoomUnit":30, //몇 %씩 증가 (가로 기준)
		"enableZoom":true,
		"enableDrag":true,
		"if_prev":null,
		"if_next":null,
		"if_download":null, //다운로드 버튼
		"if_zoomIn":null,  //확대 버튼
		"if_zoomOut":null,  //축소 버튼
		"if_fullScreen":null, //전체 화면 버튼
		"if_close":null,//전체 화면 취소 버튼
		"if_bigMode":null,  //큰 화면 버튼
		"width":1000,
		"minWidth":100,
		"height":600,
		"owidth":1000,
		"oheight":600,
		"index":1,
		"frameMode":false,
		"fullImg":false,
		"speed":50,
		"autoFlip":false,
		"fullScreenStatus":false,
		"tracks":[],
		"outlet":[
			["canvas","hover","mouseover"],
			["canvas","unhover","mouseout"],
			["canvas","hoverToggle","click"],
			["img","fullScreen","dblclick"],
			["canvas","hoverToggleStart","touchstart"],
			["canvas","hoverToggleEnd","touchend"],
			["canvas","pinchCheck","touchmove"],
			["if_prev","prev","click"],
			["if_next","next","click"],
			["tab","tabStop","mouseout"],
			["tab","tabPosition","mouseover"],
			["if_download","download","click"],
			["if_zoomIn","zoomIn","click"],
			["if_zoomOut","zoomOut","click"],
			["if_fullScreen","fullScreen","click"],
			["if_close","fullScreen","click"],
			["if_bigMode","bigMode","click"]
		]
	});
	// alert(this.enableZoom());

	this.start();	
}
__tg.prototype = new __TOMATOOBJECT();

__tg.prototype.start = function () {
	// alert(this.minWidth());
	if (this.canvas().parent().width()<this.width()) this.width(this.canvas().parent().width());
	this.canvas().height(this.height());
	var _this =this;
	this.owidth(this.width());
	this.oheight(this.height());
	this.img().children().width(this.width());
	// console.log("cal width");
	// console.log(this.img().children().length);
	// console.log(this.canvas().width());
	// console.log("owidth"+this.owidth());
	this.img().width(this.img().children().length*this.canvas().width());	
	// $.map(this.tab().children(),function (c) {return [c]}).reduce(function (c,left) {
	// 	$(c).css("left",left);
	// 	return left+$(c).width();
	// },0)
	this.setOutlet();
	// this.load(1);
	this.img().find("img").addClass("imgFixTG");
	this.imgFix(this.img().find("img.imgFixTG"),(this.fullImg()?"full":"fix"));

	if (this.if_next()) this.if_next().css("top",(this.height()-this.if_next().height())/2);
	if (this.if_prev()) this.if_prev().css("top",(this.height()-this.if_next().height())/2);

	if (this.enableDrag()) {
		this.img().find("img").draggable({
			start:function (e,u) {
			},
			stop:function (e,u) {
				_this.reposition(u.helper);
			}
		}).draggableTouch().bind("dragend",function () {_this.reposition(this)});;
		// console.log("draggableTouch");

	} else {
		this.img().find("img").swipe({
			swipe:function (e,d) {
				if (d=="left") _this.next();
				if (d=="right") _this.prev();
			}
		});
	}


    if (this.enableZoom()) this.canvas().bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta /120 > 0) {
        	_this.setZoom(1);
        }
        else{
        	_this.setZoom(-1);
        }
    	return false;
    });



	if (!this.frameMode()) {
		this.tab().width(this.tab().children().length*108);
		this.tab().find("img").addClass("imgFixTG");
		this.tab().children().each(function (n) {
			$(this).click(function () {_this.load(n+1)})
		})
		this.imgFix(this.tab().find("img.imgFixTG"),"fix");
	} else {
		this.tab().remove();
		this.canvas().find("input").remove();
	}
	if (this.autoFlip()) setInterval(this.next,this.autoFlip());

	$("body").keyup(function (e) {
		if ($("input").add("textarea").is(":focus")) return false;
		// console.log(e.keyCode);
		if (e.keyCode==37) _this.prev(); //left
		if (e.keyCode==39) _this.next(); //right

		if (e.keyCode==27&&_this.fullScreenStatus()) {
			_this.fullScreen();
		} //right

		// if (e.keyCode==38) _this.fullScreen(); //up
		// if (e.keyCode==40) _this.fullScreen(); //down
		if (e.keyCode==13) _this.fullScreen(); //enter

		if (e.keyCode==189) _this.zoomOut(); //=,+
		if (e.keyCode==187) _this.zoomIn(); // - _
		if (e.keyCode==109) _this.zoomOut(); //=,+
		if (e.keyCode==107) _this.zoomIn(); // - _
		return false;
	})
	this.load(1);
	this.imgReposition();
}

__tg.prototype.hoverToggleStart = function () {
	if (this.enableDrag()) this.img().find("img").draggableTouch();
	// if (e.originalEvent.touches.length==2) {
	// 	this.img().find("img").draggableTouch("disable");
	// } else if (e.originalEvent.touches.length==1) {
	// 	this.img().find("img").draggableTouch();
	// }
	// alert ("start");

	var d = new Date();
	this.TT = d.getTime();
	// this.canvas().toggleClass("hover");
}
__tg.prototype.hoverToggleEnd = function () {
	var d = new Date();
	if (d.getTime()-this.TT<100)
	this.canvas().toggleClass("hover");
	if (this.enableDrag()) this.img().find("img").draggableTouch();
	this.tracks([]);
}
__tg.prototype.bigMode = function () {
	// console.log("bigMode");
	this.canvas().width(this.width());
	// this.img().children().width(this.width());

	this.canvas().toggleClass("big");
	this.if_bigMode().toggleClass("m8").toggleClass("m7");
	var _this = this;
	this.start();

	setTimeout(function () {_this.load(_this.index()-1)},100);
}
__tg.prototype.pinchCheck = function (e) {
	var _this = this;
	// alert(e.originalEvent.touches.length)
	if (e.originalEvent.touches.length==2) {
		this.img().find("img").draggableTouch("disable");
		var pin = Math.sqrt(Math.pow(e.originalEvent.touches[1].pageX-e.originalEvent.touches[0].pageX,2)+Math.pow(e.originalEvent.touches[1].pageY-e.originalEvent.touches[0].pageY,2));
		this.tracks().push(pin);

		var gap = this.tracks()[this.tracks().length-2]-pin;
		gap*=-3;
		// alert(this.tracks()[this.tracks().length-2]);
		if (!gap) return false;
		// alert("ok");
		// alert(gap);

		var contents = _this.img().children("li.tomatoGallery_visualLi:nth-child("+_this.index()+")").children("img.tomatoGallery_visualImg");
		// console.log(contents);
		var unit=contents.width()+gap;
		// alert(unit);
		var p = contents.position();
		var newWidth = contents.width()+gap;
		var newHeight = contents.height()+(gap*contents.height()/contents.width());
		var newLeft = p.left-gap/2;
		var newTop = p.top-(gap*contents.height()/contents.width()/2);

		if (newWidth<this.minWidth()) {
			newWidth = this.minWidth();
			newHeight = contents.height()*this.minWidth()/contents.width();
			newLeft = p.left;
			newTop = p.top;
		}

		contents
			.width(newWidth)
			.height(newHeight)
			.css("left",newLeft)
			.css("top",newTop);
		this.reposition(contents);
		return false;
		// alert(unit);
		contents.animate({
			width:"+="+unit,
			height:"+="+(unit*contents.height()/contents.width()),
			left:"-="+unit/2,
			top:"-="+(unit*contents.height()/contents.width())/2
		},100,function () {_this.reposition(contents)});

	}
}
__tg.prototype.hoverToggle = function () {
	// this.canvas().toggleClass("hover");
}
__tg.prototype.hover = function () {
	this.canvas().addClass("hover");
}
__tg.prototype.unhover = function () {
	console.log("unhover");
	this.canvas().removeClass("hover");
	this.hoverToggleEnd();
}
__tg.prototype.imgFix=function () {// ( object || opt[fix,full] || packet,callback )
	var ARGS = this.typeOfMatching({"object":"A","string":"opt"},arguments);
	var _this =this;
	// console.log("imgFix start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	// console.log("tgimgFix");
	// console.log("fix "+ARGS.opt);

	var B = $.map(ARGS.A,function (img) {
		var w = $(img).width();
		var h = $(img).height();
		if (!w||!h) return $(img);
		// console.log("W:"+w+",H:"+h);

		var mw = $(img).parent().width();
		var mh = $(img).parent().height();
		// console.log("mw:"+mw+",mh:"+mh);
		if (ARGS.opt=="fix") {
			// console.log("fix");
			if (w/h>mw/mh) { //if (w/h<mw/mh) { //주석 : 화면 채우기 :: 
				$(img).width(mw).css("top",(mw*h/w-mh)/-2).css("left",0);
			} else {
				$(img).height(mh).css("left",(mh*w/h-mw)/-2).css("top",0); 
			}
			if (!($(img).width()>mw||$(img).height()>mh)) $(img).removeClass("imgFixTG");
			else return $(img);
		} else {
			// console.log("nofix");
			if (w/h<mw/mh) { //if (w/h<mw/mh) { //주석 : 화면 채우기
				$(img).width(mw);//.css("margin-top",(mw*h/w-mh)/-2);
			} else {
				$(img).height(mh);//.css("margin-left",(mh*w/h-mw)/-2); 
			}
			if (!($(img).width()<mw||$(img).height()<mh)) $(img).removeClass("imgFixTG");
			else return $(img);
		}
	})
	// console.log(B.length);
	if (B.length) setTimeout(function () {_this.imgFix(B,ARGS.opt)},100);
}
__tg.prototype.imgReposition=function () {
	// console.log("imgReposition");
	var img = this.img().children("li.tomatoGallery_visualLi:nth-child("+(this.index()+1)+")").children("img.tomatoGallery_visualImg");
	var opt = (this.fullImg()?"full":"fix");
	$(img).width('auto');
	$(img).height('auto');

	var w = $(img).width();
	var h = $(img).height();
	// console.log("W:"+w+",H:"+h);

	var mw = $(img).parent().width();
	var mh = $(img).parent().height()-74;
	// console.log("mw:"+mw+",mh:"+mh);
	// console.log(opt);

	if (opt=="fix") {
		// console.log("opt=fix");

		if (w/h>mw/mh) { //if (w/h<mw/mh) { //주석 : 화면 채우기 :: 
			$(img).width(mw).css("top",(mw*h/w-mh)/-2).css("left",0);
			// console.log("가로가큼");
		} else {
			$(img).height(mh-(this.fullScreenStatus()?70:0)).css("left",(mh*w/h-mw)/-2).css("top",0); 
			// console.log("세로가 큼");
		}
		if (!($(img).width()>mw||$(img).height()>mh)) $(img).removeClass("imgFixTG");
	} else {
		if (w/h<mw/mh) { //if (w/h<mw/mh) { //주석 : 화면 채우기
			$(img).width(mw);//.css("margin-top",(mw*h/w-mh)/-2);
		} else {
			$(img).height(mh);//.css("margin-left",(mh*w/h-mw)/-2); 
		}
		if (!($(img).width()<mw||$(img).height()<mh)) $(img).removeClass("imgFixTG");
	}
}
__tg.prototype.moveF = function (direction,_this) {
	return function () {_this.load(_this.index()+direction)};
}

__tg.prototype.zoomF = function (direction,_this) {
	return function () {
		var contents = _this.img().children("li.tomatoGallery_visualLi:nth-child("+_this.index()+")").children("img.tomatoGallery_visualImg");
		// console.log(contents);
		var unit=contents.width()*_this.zoomUnit()/100*direction;
		contents.animate({
			width:"+="+unit,
			height:"+="+(unit*contents.height()/contents.width()),
			left:"-="+unit/2,
			top:"-="+(unit*contents.height()/contents.width())/2
		},100,function () {_this.reposition(contents)});
	}
}

__tg.prototype.setZoom=function (direction) {

	var contents = this.img().children("li.tomatoGallery_visualLi:nth-child("+(this.img().children("li.tomatoGallery_visualLi").length>1?this.index()+1:1)+")").children("img.tomatoGallery_visualImg");
	if (contents.width()==0) {
		// console.log("wheel cancel");
		return false;	
	}
	var unit=contents.width()*(this.zoomUnit()/5)/100*direction;
	var p = contents.position();
	var newWidth = contents.width()+unit;
	var newHeight = contents.height()+(unit*contents.height()/contents.width());
	var newLeft = p.left-unit/2;
	var newTop = p.top-(unit*contents.height()/contents.width())/2;
	console.log(newWidth);
	contents.css("width",newWidth)
	.css("height",newHeight)
	.css("left",newLeft)
	.css("top",newTop);
	this.reposition(contents);
	contents.removeClass("zoom");
}
__tg.prototype.repositionStd = function (target) {
	this.img().children("li.tomatoGallery_visualLi:nth-child("+this.index()+")").children("img.tomatoGallery_visualImg").css("left",(this.canvas().width()-this.img().find("img").width())/2);
}
__tg.prototype.reposition = function (target) { 
	// console.log("reposition");
	var gap = 20;
	var _this = this;
	var p = $(target).position();
	// alert(p);
	// console.log("reposition"+this.contents.width());
	 // [left||top,limitNumber, 비교 조건 1(<) -1(>)] 
	 // 
	$.map(
		[
			["left",$(target).width()*-1+gap,1],
			["left",$(this.canvas()).width()*1-gap,-1],
			["top",$(target).height()*-1+gap,1],
			["top",$(this.canvas()).height()*1-gap,-1]
		],
		function (m) {
			//이미지가 상자 밖으로 나갔을 때 안으로 데려옴  
			if ((p[m[0]]-m[1])*m[2]<0) $(target).animate(m[0]=="left"?{left:m[1]}:{top:m[1]},200);
		}
	);

	// 90도 단위로 +-10도는 90 단위로 snap
	// console.log(Math.round(this.angle/90)*90)
	if (Math.abs(this.angle%90)<10||90-Math.abs(this.angle%90)<10) this.rotate(Math.round(this.angle/90)*90);
}
__tg.prototype.load = function (no,repositionReject) { //no = 1~this.img().children().length

	var _this = this;
	var width = $(this.canvas()).width();
	if (no>this.tab().children().length) { //끝에서 1번으로 갈 때
		this.index(1);
		var goal = -(_this.tab().children().length+1)*width;
		this.img().css("margin-left",goal);

		var resolveAnimation = function () {
			console.log("try noAnimation end");

			if (_this.img().css("margin-left")!=goal) {
				_this.canvas().removeClass("noAnimation");
				console.log("noAnimation ended");
			} else {
				resolveAnimation();
			}
		}
		setTimeout(function () {
			_this.canvas().addClass("noAnimation");
			_this.img().css("margin-left",-(_this.index())*width);
			resolveAnimation();
			_this.imgReposition();
		},400);

	} else if (no<1) { //1번에서 끝으로 갈 때
		this.index(this.tab().children().length);
		this.img().css("margin-left",0);
		var resolveAnimation = function () {
			// console.log("try noAnimation end");

			if (_this.img().css("margin-left")!=0) {
				_this.canvas().removeClass("noAnimation");
				console.log("noAnimation ended");
			} else {
				resolveAnimation();
			}
		}
		setTimeout(function () {
			_this.canvas().addClass("noAnimation");
			_this.img().css("margin-left",-(_this.tab().children().length)*width);
			resolveAnimation();
		},400);

	} else if (this.tab().children().length==1) {
		this.index(no);
		this.img().css("margin-left",0);
	} else {
		this.index(no);
		this.img().css("margin-left",-(this.index())*width);
	}
	// console.log(this.index());
	// this.img().css("margin-left",-(this.index()-1+(this.img().children().length>1?1:0))*$(this.canvas()).width());

	this.tab().children().removeClass("selected");
	console.log(this.tab());
	console.log(this.index());
	var tabLeft = $(this.tab().children()[this.index()-1]).offset().left-this.canvas().offset().left;
	// console.log(tabLeft);
	if (tabLeft<0) this.tab().css("margin-left",this.tab().css("margin-left").replace("px","")-tabLeft);
	if (tabLeft>this.width()-108) this.tab().css("margin-left",this.tab().css("margin-left").replace("px","")-(tabLeft-width+108));
	$(this.tab().children()[this.index()-1]).addClass("selected");
	this.imgReposition();
	// if (!repositionReject) this.reposition(this.img().children("li.tomatoGallery_visualLi:nth-child("+this.index()+")").children("img.tomatoGallery_visualImg"));
}
__tg.prototype.download = function () {
	// console.log(this.contents.attr('src'));
	var imgNo = (this.tab().children().length==1?1:this.index()+1);
	window.open(this.img().children("li.tomatoGallery_visualLi:nth-child("+imgNo+")").children("img.tomatoGallery_visualImg").attr('src').replace("attachment","download"),"download");
}
__tg.prototype.fullScreen=function () {
	if (!this.if_fullScreen().length) return false;
	this.canvas().addClass("noAnimation");
	// console.log("thisNumber"+this.index());
	// console.log("owidth"+this.owidth());
	if (!this.fullScreenStatus()) {
		$("body").addClass("modal");
		this.canvas().addClass("fullScreen");
		this.width(document.documentElement.clientWidth);
		this.height('100%');
		this.fullScreenStatus(true);
		this.tab().css("margin-left",0);
		// this.load(this.index());
	} else {
		$("body").removeClass("modal");
		this.canvas().removeClass("fullScreen");
		this.width(this.owidth());
		this.height(this.oheight());
		this.fullScreenStatus(false);
		this.tab().css("margin-left",0);
		// this.load(this.index());
	}
	// console.log(this.fullScreenStatus());


	this.canvas().width(this.width());
	this.canvas().height(this.height());

	var _this =this;
	this.img().children().width(this.width());
	this.img().width(this.img().children().length*this.width());	
	// $.map(this.tab().children(),function (c) {return [c]}).reduce(function (c,left) {
	// 	$(c).css("left",left);
	// 	return left+$(c).width();
	// },0)
	this.img().find("img").addClass("imgFixTG").attr("style","");
	this.imgFix(this.img().find("img.imgFixTG"),(this.fullImg()?"full":"fix"));

	//좌우 버튼 원위치
	if (this.if_next()) this.if_next().css("top",(this.canvas().height()-this.if_next().height())/2);
	if (this.if_prev()) this.if_prev().css("top",(this.canvas().height()-this.if_next().height())/2);



	if (!this.frameMode()) {
		console.log("not framemode ");
		this.tab().width(this.tab().children().length*108);
		// this.tab().find("img").addClass("imgFix");
		// this.tab().children().each(function (n) {
		// 	$(this).click(function () {_this.load(n+1)})
		// })
		// this.imgFix(this.tab().find("img.imgFix"),"fix");
	} else {
		console.log("framemode ");

		this.tab().remove();
		this.canvas().find("input").remove();
	}

	this.load(this.index());
	var _this =this;
	setTimeout(function () {
		_this.canvas().removeClass("noAnimation");
	},10)

}
__tg.prototype.tabPosition = function (e) {
	if (this.tab().width()<this.canvas().width()) return false;
	var x = e.clientX-this.canvas().offset().left;
	var _this = this;
	if (x<this.width()*0.2) this.setVariable("timer",setInterval(function () {_this.tabReposition(1)},100));
	if (x>this.width()*0.8) this.setVariable("timer",setInterval(function () {_this.tabReposition(-1)},100));
}
__tg.prototype.tabReposition = function (direction) {
	var newML = this.tab().css("margin-left").replace("px","")*1+direction*this.speed();
	if (newML>0) newML = 0;
	if (newML<-this.tab().width()+this.width()) newML = -this.tab().width()+this.width();
	this.tab().css("margin-left",newML);
}
__tg.prototype.tabStop = function (e) {
	clearInterval(this.timer);
}

