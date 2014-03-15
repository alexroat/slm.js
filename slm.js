(function($) {
$.fn.slm=function(options)
{
    var self=$(this);


    //installa i css di default
    if (options=="installCSS")
    {

		var css=".tabheader {background-color:white; border-bottom:1px solid black;padding:2px}"
		+".tabheader div { background: linear-gradient(#DDDDFF, #EEEEFF);border: 1px solid grey;margin: 1px;padding: 1px;cursor: default;font-family: sans-serif; font-size: medium; text-align: left; color: black;}"
		+".tabheader div.selected{ background: linear-gradient(#73A5C7, #7878EC);color: white;}"
		+".splitter {background-color: rgb(196, 196, 196);}"
		+".shift {z-index:1000;background: linear-gradient(#DDDDFF, #EEEEFF);border: 1px solid grey;margin: 1px;padding: 1px;cursor: default;font-family: sans-serif; font-size: medium; text-align: left; color: black;}"
		+".accheader{background: linear-gradient(#DDDDFF, #EEEEFF);border: 1px solid grey;margin: 1px;padding: 1px;cursor: default;font-family: sans-serif; font-size: medium; text-align: left; color: black;}"
		+".accheader.selected{ background: linear-gradient(#73A5C7, #7878EC);color: white;}"
		+".menu{ background-color:grey;}"
		+".menu>*{ background-color:lightgrey;}"
		+"ul.menu{ padding:0px;margin:0px;background-color:lightgrey;}"
		+"ul.menu>li{list-style-type: none;cursor: default;background: linear-gradient(#DDDDFF, #EEEEFF);border: 1px solid grey;margin: 0px;padding: 1px; color: black;}"
		+"ul.menu>li:hover{background: linear-gradient(#73A5C7, #7878EC);color: white;}"
		+"ul.menubar>li{display:inline-block;}";
	
		var style = document.createElement('style');
		style.setAttribute("type", "text/css");
		if (style.styleSheet) {   // for IE
			style.styleSheet.cssText = css;
		} else {                // others
			var textnode = document.createTextNode(css);
			style.appendChild(textnode);
		}
		var h = document.getElementsByTagName('head')[0];
		h.appendChild(style);
    }

    function getT(s)
    {
        try
        {
            return eval("[{"+s.attr("layout")+"}][0]");
        }
        catch (ex)
        {
            return {};
        }
    }

    function setT(s,t)
    {
        var ts=JSON.stringify(t);
        ts=ts.substr(1,ts.length-2);
        s.attr("layout",ts);
    }

	
	function invalidate(s)
	{
		var t=getT(s);
		t.ok=0;
		setT(s,t);
		s.slm();
	}
	
	
    var t=getT(self);
	
	
	
	
	
    //crea gestione resize su target
	var rsz = function(target)
	{
		var d;
		var fmousemove=function(e){
			var t=getT(target);
			var dx=e.pageX-d.ex;
			var dy=e.pageY-d.ey;
			if (d.edge.right)
				t.w=d.w+dx;
			if (d.edge.bottom)
				t.h=d.h+dy;
			if (d.edge.left)
			{
				t.w=d.w-dx;
				t.x=d.x+dx;
			}
			if (d.edge.top)
			{
				t.h=d.h-dy;
				t.y=d.y+dy;
			}
			setT(target,t);
			target.slm();
			window.event.returnValue = false;
		};
		var fmouseup=function(e){
			$(document).unbind("mouseup",fmouseup);
			$(document).unbind("mousemove",fmousemove);
		};
		var fmousedown=function(e){
			//calcolo edge resize
			var x = e.pageX - target[0].offsetLeft;
			var y = e.pageY - target[0].offsetTop;
			var w = target.outerWidth();
			var h = target.outerHeight();
			var q=4;
			var l={left:x<q,top:y<q,right:w-x<q,bottom:h-y<q};
			if (l.left||l.top||l.right||l.bottom)
			{
				d=getT(target);
				d.ex=e.pageX;
				d.ey=e.pageY;
				d.edge=l;
				$(document).bind("mousemove",fmousemove);
				$(document).bind("mouseup",fmouseup);
			}
		};
		target.bind("mousedown",fmousedown);
	};
	



    //funzioni di geomerty handling
	var c;
    var flsz={
        absolute:function()
        {
            self.css({overflow:'hidden'});
            if (!t.ok)
            {
                t.x=isNaN(t.x)?0:t.x;
                t.y=isNaN(t.x)?0:t.y;
                t.w=isNaN(t.x)?0:t.w;
                t.h=isNaN(t.x)?0:t.h;
                self.css({"position":'absolute',"left":t.x,"top":t.y,"width":t.w,"height":t.h});
                t.ok=1;
                setT(self,t);
            }
        },
        fullpage:function()
        {
            self.css({overflow:'hidden'});
            if (!t.ok)
            {
                //vincola il contenitore alla finestra e aggancia gli eventi di resize
                self.css({"position":"fixed","left":0,"top":0,"right":0,"bottom":0,"width":"","height":""});
                $(window).on("resize",propagate);
                //figli: il dialog accetta un solo figlio e lo massimizza
                c.hide();
                $(c[0]).css({"position":"absolute","left":0,"top":0,"right":0,"bottom":0}).show();
                t.ok=1;
                setT(self,t);
            }
        },
        dialog:function()
        {
            self.css({overflow:'hidden'});
			t.x=isNaN(t.x)?100:t.x;
			t.y=isNaN(t.y)?100:t.y;
			t.w=isNaN(t.w)?100:t.w;
			t.h=isNaN(t.h)?100:t.h;
			self.addClass("slmdialog").css({"position":"fixed","top":t.y,"left":t.x,"width":t.w,"height":t.h,"background":"white", "border":"2px solid grey"});
            if (!t.ok)
            {
				//barra del dialog
                var m=10;
                var hdlg=$("<div/>",{"class":"slmignore"}).css({"left":0,"top":0,"right":0}).text("dialog").prependTo(self);
				//gestione chiusura
				var hh=hdlg.innerHeight();
                $("<div/>").css({"position":"absolute","right":0,"top":0,"width":hh,"height":hh,"background":"rgb(230, 102, 102)","text-align":"center","cursor":"default"}).appendTo(hdlg).text("×").click(function(){self.remove();});
                //gestione spostamento
                var drag;
		        hdlg.mousedown(function(e){ t=getT(self);drag=[e.pageX-t.x,e.pageY-t.y];});
			    $(document).mouseup(function(e){ drag=null;});
		        $(document).mousemove(function(e){if(drag){t.x=e.pageX-drag[0];t.y=e.pageY-drag[1];setT(self,t);self.css("left",t.x).css("top",t.y);window.event.returnValue = false;}});
                //figli: il dialog accetta un solo figlio e lo massimizza
                c.hide();
                $(c[0]).css({"position":"absolute","left":0,"top":hdlg.outerHeight(),"right":0,"bottom":0}).show();
				t.ok=1;
                setT(self,t);
				rsz(self);//crea gestione resize
            }
        },
        boxV:function()
        {
            self.css({overflow:'hidden'});
            var r,i,o;
            r=self.innerHeight();
            var ta=[];
            var tp=0;
            //calcolo
            for (i=0;i<c.size();i++)
            {
                var cc=$(c[i]);
                var t=getT(cc);    
                t.p=isNaN(t.p)?0:t.p;
                t.h=isNaN(t.h)?cc.outerHeight():t.h;
                if (t.ex)
                {
                   t.x=0;
                   t.w=self.innerWidth();
                }
                r-=t.h;
                tp+=t.p;
                ta.push(t)
            }
            for (i=0,o=0;i<c.size();i++)
            {
                var cc=$(c[i]);
                var t=ta[i];
                if (tp)
                    t.h+=r*t.p/tp;
                t.y=o;
                o+=t.h;
                cc.css({"position":"absolute","left":t.x,"top":t.y,"width":t.w,"height":t.h});
            }
        },
        boxH:function()
        {
            self.css({overflow:'hidden'});
            var r,i,o;
            r=self.innerWidth();
            var ta=[];
            var tp=0;
            //calcolo
            for (i=0;i<c.size();i++)
            {
                var cc=$(c[i]);
                var t=getT(cc);    
                t.p=isNaN(t.p)?0:t.p;
                t.w=isNaN(t.w)?cc.outerWidth():t.w;
                if (t.ex)
                {
                   t.y=0;
                   t.h=self.innerHeight();
                }
                r-=t.w;
                tp+=t.p;
                ta.push(t)
            }
            for (i=0,o=0;i<c.size();i++)
            {
                var cc=$(c[i]);
                var t=ta[i];
                if (tp)
                    t.w+=r*t.p/tp;
                t.x=o;
                o+=t.w;
                cc.css({"position":"absolute","left":t.x,"top":t.y,"width":t.w,"height":t.h});
            }
        },
        tab:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.sel=isNaN(t.sel)?0:t.sel;
            var isv=(t.o=='w' || t.o=='e');
            //creazione header
            if (!t.ok)
            {
                self.children(".slmignore").remove();
                var header=$("<div/>",{"class":"slmignore tabheader"}).css({"position":"absolute","left":0,"top":0,"right":0,"overflow":"hidden"}).prependTo(self);
                for (i=0;i<c.size();i++)
                {
                    var cc=$(c[i]);
				    var pt=getT(cc);
				    pt.title=(pt.title==undefined)?"tab "+i:pt.title;
                    var s=$("<div/>").text(pt.title).appendTo(header).toggleClass("selected",i==t.sel);
                    s.css({"display":isv?"block":"inline-block"});
				    s.click((function(j){return function(){t.sel=j;setT(self,t);header.children().removeClass("selected");$(this).addClass("selected");self.slm();}})(i));
                }
                t.ok=1;
                setT(self,t);
            }       
            //adattamento children
            t.sel=isNaN(t.sel)?0:t.sel%c.size();
            var hs=self.children(".tabheader").outerHeight(true);
            c.hide();
            $(c[t.sel]).css({"position":"absolute","left":0,"top":hs,"right":0,"bottom":0}).show();
            
            return false;
        },
        accordion:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.sel=isNaN(t.sel)?0:t.sel;
            if (!t.ok)
            {
                //creazione header accordion
                self.children(".accheader").remove();
                for (i=0;i<c.size();i++)
                {
                    var cc=$(c[i]);
				    var ct=getT(cc);
				    ct.title=(ct.title==undefined)?"acc "+i:ct.title;
                    var s=$("<div/>",{"class":"slmignore accheader"})
                    .text(ct.title)
                    .insertBefore(cc)
				    .click((function(j){return function(){t.sel=j;setT(self,t);self.slm();}})(i));
                }
                t.ok=1;
                setT(self,t);
            }
            //ricalcolo spazio
            var ac=self.children(".accheader");
            var r=self.innerHeight();
            for (i=0;i<ac.size();i++)
                r-=$(ac[i]).toggleClass("selected",i==t.sel).outerHeight(true);
            //adattamento children
            c.hide();
            t.sel=isNaN(t.sel)?0:t.sel%c.size();
            $(c[t.sel]).show().css({left:0,right:0,height:r},{queue: false });
            return false;
        },
		shift:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.sel=isNaN(t.sel)?0:t.sel;
            //creazione header
            if (!t.ok)
			{
                self.children(".slmignore").remove();
				var sn=$("<span/>",{"class":"slmignore shift"}).text("NEXT").css({"position":"absolute","right":0,"top":0,"overflow":"hidden"}).prependTo(self);
				var sp=$("<span/>",{"class":"slmignore shift"}).text("PREV").css({"position":"absolute","left":0,"top":0,"overflow":"hidden"}).prependTo(self);
				sp.click(function(){t.sel=(t.sel+c.size()-1)%c.size();setT(self,t);self.slm();});
				sn.click(function(){t.sel=(t.sel+c.size()+1)%c.size();setT(self,t);self.slm();});
                t.ok=1;
                setT(self,t);
			}
			self.children(".shift").css("top",self.innerHeight()/2);                
			//attivazione figlio selezionato
            c.hide();
            $(c[t.sel]).css({"position":"absolute","left":0,"top":0,"right":0,"bottom":0}).show();
            return false;
        },
		splitV:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.sash=isNaN(t.sash)?self.height()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!t.ok)
            {
                var spl=$("<div/>",{"class":"slmignore splitter"}).css({"position":"absolute","left":0,"right":0,"height":5,"overflow":"hidden","cursor":"row-resize"}).prependTo(self);
                var drag=-1;
			    spl.bind("mousedown touchstart",function(e){ drag=e.pageY-t.sash;e.preventDefault();});
				self.bind("mouseup touchend",function(e){ drag=-1;window.event.returnValue = true;e.preventDefault();});
			    self.bind("mousemove touchmove",function(e){if(drag>=0){t.sash=e.pageY-drag;setT(self,t);self.slm();window.event.returnValue = false;}e.preventDefault();});
                t.ok=1;
                setT(self,t);
            }
            //adattamento children	
            var p0=$(c[0]);
			var p1=$(c[1]);
			p0.css({"position":"absolute","left":0,"top":0,"right":0,"height":t.sash});
			p1.css({"position":"absolute","left":0,"top":t.sash+5,"right":0,"bottom":0});
			self.children(".splitter").css("top",t.sash);
            return false;
        },
		splitH:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.sash=isNaN(t.sash)?self.width()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!t.ok)
            {
                var spl=$("<div/>",{"class":"slmignore splitter"}).css({"position":"absolute","top":0,"bottom":0,"width":5,"overflow":"hidden","cursor":"col-resize"}).prependTo(self);
                var drag=-1;
			    spl.bind("mousedown touchstart",function(e){ t=getT(self);drag=e.pageX-t.sash;e.preventDefault();});
				self.bind("mouseup touchend",function(e){ drag=-1;e.preventDefault();});
			    self.bind("mousemove touchmove",function(e){if(drag>=0){t.sash=e.pageX-drag;setT(self,t);self.slm();window.event.returnValue = false;}e.preventDefault();});
                t.ok=1;
                setT(self,t);
            }			
            var p0=$(c[0]);
			var p1=$(c[1]);
			p0.css({"position":"absolute","top":0,"bottom":0,"left":0,"width":t.sash});
			p1.css({"position":"absolute","top":0,"left":t.sash+5,"bottom":0,"right":0});
			self.children(".splitter").css("left",t.sash);
            return false;
        },
        snap:function()
        {
            self.css({overflow:'hidden'});
            var i,o;
			t.snap=isNaN(t.snap)?32:t.snap;
			setT(self,t);
            var w=self.width();
            var ox=t.snap;
            var oy=t.snap;
            var maxch=0;
			var rowcnt=0;
            for (i=0;i<c.size();i++)
            {
                var cc=$(c[i]);
			    var ct=getT(cc);
			    var cw=(isNaN(ct.sx)?1:ct.sx)*t.snap;
                var ch=(isNaN(ct.sy)?1:ct.sy)*t.snap;
                if (ox+cw>w && rowcnt>0)
                {
                    ox=t.snap;
                    oy+=maxch+t.snap;
					maxch=0;
                }
				cc.css({top:oy,left:ox,width:cw,height:ch,position:'absolute'});            
				rowcnt++;
				ox+=cw+t.snap;
				maxch=ch>maxch?ch:maxch;//stride
            }
			return false;
        },
		menu:function()
        {
            var i,o;
			t.bar=!!t.bar;//indica se il menu è a barra
			self.css({overflow:"initial"});
            if (!t.ok)
            {
				var fshow=function(bar){return function(){
				    var c = $(this);
				    c.children().css({position:'absolute','z-index':100,top:bar?c.outerHeight()-1:0,left:bar?0:c.outerWidth()-1}).show();
                    };
				};
				self.addClass("menu");
				if (t.bar)
					self.addClass("menubar");
				c.hover(fshow(t.bar),function(){$(this).children().hide();});
				t.ok=1;
				setT(self,t);
				c.children().hide().each($.fn.slm);
				self.parent().each($.fn.slm);
            }
			
            return false;
        },
        flap:function()
        {
		
			//var sps = 30;//spessore flap
		
            self.css({overflow:'hidden',position:'absolute'});
            var i,o;
            //creazione header
            if (!t.ok)
            {
				self.addClass("exclude");
				invalidate(self.parent());
			

                var isv=(t.o=='w' || t.o=='e');

			
                self.children(".slmignore").remove();
                var header=$("<div/>",{"class":"slmignore tabheader"}).css({"position":"absolute","overflow":"hidden"}).prependTo(self);
                for (i=0;i<c.size();i++)
                {
                    var cc=$(c[i]);
				    var pt=getT(cc);
				    pt.title=(pt.title==undefined)?"tab "+i:pt.title;
                    var s=$("<div/>").text(pt.title).appendTo(header);
                    s.css({"display":isv?"block":"inline-block"});
				    s.click((function(j){return function(){header.children().removeClass("selected");if (t.sel==j){t.sel=undefined;}else{t.sel=j;$(this).addClass("selected");}setT(self,t);self.slm();}})(i));
					if (cc.css("overflow")=="visible")
						cc.css("overflow","auto");
                }
				switch(t.o)
				{
					case 'n':
						self.css({top:0,left:0,right:0,bottom:'auto',width:'auto',height:t.h});
						header.css({bottom:0,left:0,right:0});
						break;
					case 's':
						self.css({bottom:0,left:0,right:0,top:'auto',width:'auto',height:t.h});
						header.css({top:0,left:0,right:0});
						break;				
					case 'w':
						self.css({top:0,bottom:0,left:0,right:'auto',height:'auto',width:t.w});
						header.css({top:0,bottom:0,right:0});
						break;
					case 'e':
						self.css({top:0,bottom:0,right:0,left:'auto',height:'auto',width:t.w});
						header.css({top:0,bottom:0,left:0});
						break;
				}
				
                t.ok=1;
                setT(self,t);
            }

			
			var header = self.children(".tabheader");
			
			var hs=header.outerHeight(true);
			var ws=header.outerWidth(true);
			var opened= (t.sel!=undefined);
			c.css({position:'absolute'});
			switch(t.o)
			{
				case 'n':
					c.css({top:0,left:0,right:0,bottom:hs});
					self.css({height:(opened?t.h:hs)});
					break;
				case 's':
					c.css({bottom:0,left:0,right:0,top:hs});
					self.css({height:(opened?t.h:hs)});
					break;				
				case 'w':
					c.css({top:0,bottom:0,left:0,right:ws});
					self.css({width:(opened?t.w:ws)});
					break;
				case 'e':
					c.css({top:0,bottom:0,right:0,left:ws});
					self.css({width:(opened?t.w:ws)});
					break;
			}
			c.hide();
			if (t.sel!=undefined)
				$(c[t.sel]).show();
			
            
            return false;

        }
    }[t.sz];


	var propagate=function()
	{
	
		if (self.css("position")=="static")
			self.css("position","relative");



		var ttc = self.children(":not(.slmignore)");
        c=ttc.filter(":not(.exclude)").css({height:"",width:""});

		if (flsz)
		    flsz();
		
        ttc.filter(":visible").each($.fn.slm);


	};
	
	//propagate();//propagate event to the children
	//Alternative trick for performance: 	if not already scheduled, schedule the propagation when idle, otherwise skip
	/*if (!self[0].__pro)
	{
		self[0].__pro=1;
		setTimeout(function(){propagate();delete self[0].__pro;},0);
	}*/
	
	
	setTimeout(propagate,0);
	

    return this;
}


})(jQuery);

