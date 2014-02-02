
$.fn.slm=function()
{
    var self=$(this);
    

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

    var t=getT(self);


    if (t.allpage)
    {
        self.css("position","fixed").css("left",0).css("top",0).css("right",0).css("bottom",0);
        $(window).on("resize",function(){propagate();});
    }   

    //ricerca funzione
    var fl={
        boxV:function()
        {
            var c,r,i,o;
            self.css("overflow","auto");
            c = self.children();
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
            var c,r,i,o;
            self.css("overflow","auto");
            c = self.children();
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
            var c,r,i,o;
            c = self.children().not(".tabheader");
			t.sel=isNaN(t.sel)?0:t.sel;
            //creazione header
            if (!self.children(".tabheader").length)
                $("<div/>").css({"position":"absolute","left":0,"top":0,"right":0,"overflow":"hidden"}).prependTo(self).addClass("tabheader");
            var header=self.children("div.tabheader").empty();
            for (i=0;i<c.size();i++)
            {
                var cc=$(c[i]);
				var pt=getT(cc);
				pt.title=(pt.title==undefined)?"tab "+i:pt.title;
                var s=$("<span/>").text(pt.title).appendTo(header).toggleClass("selected",i==t.sel);
				s.click((function(j){return function(){t.sel=j;setT(self,t);self.slm();}})(i));
            }            
            //adattamento children
            t.sel=isNaN(t.sel)?0:t.sel%c.size();
            var pt=t;
            var hs=header.outerHeight();
            for (i=0;i<c.size();i++)
            {
                var cc=$(c[i]);
                cc.css({"position":"absolute","left":0,"top":hs,"right":0,"bottom":0,"overflow":"auto"});
                cc.hide();
            }
            $(c[t.sel]).show();
            
            return false;
        },
		shift:function()
        {
            var c,r,i,o;
            c = self.children().not(".shift");
			t.sel=isNaN(t.sel)?0:t.sel;
            //creazione header
            if (!self.children(".shift").length)
			{
				var sn=$("<span/>").text("NEXT").css({"position":"absolute","right":0,"top":0,"overflow":"hidden"}).prependTo(self).addClass("shift");
				var sp=$("<span/>").text("PREV").css({"position":"absolute","left":0,"top":0,"overflow":"hidden"}).prependTo(self).addClass("shift");
				sp.click(function(){t.sel=(t.sel+c.size()-1)%c.size();setT(self,t);self.slm();});
				sn.click(function(){t.sel=(t.sel+c.size()+1)%c.size();setT(self,t);self.slm();});
			}
			self.children(".shift").css("top",self.innerHeight()/2);
            for (i=0;i<c.size();i++)
            {
				var cc=$(c[i]);
                cc.css({"position":"absolute","left":0,"top":0,"right":0,"bottom":0,"overflow":"auto"});
                cc.hide();
            }
            $(c[t.sel]).show();
            return false;
        },
		splitV:function()
        {
            var c,r,i,o;
            self.css("overflow","hidden");
            c = self.children().not(".splitter");
            r=self.innerHeight();
			t.sash=isNaN(t.sash)?self.height()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!self.children(".splitter").length)
            {
                var spl=$("<div/>").css({"position":"absolute","left":0,"right":0,"height":5,"overflow":"hidden","cursor":"row-resize"}).prependTo(self).addClass("splitter");
                var drag=-1;
			    spl.mousedown(function(e){ drag=e.pageY-t.sash;});
			    spl.mouseup(function(e){ drag=-1;});
				self.mouseup(function(e){ drag=-1;});
			    self.mousemove(function(e){if(drag>=0){t.sash=e.pageY-drag;setT(self,t);self.slm();}});
            }			
            var p0=$(c[0]);
			var p1=$(c[1]);
            
            
			p0.css({"position":"absolute","left":0,"top":0,"right":0,"height":t.sash});
			p1.css({"position":"absolute","left":0,"top":t.sash+5,"right":0,"bottom":0});
			self.children(".splitter").css("top",t.sash);
            return false;
        },
		splitH:function()
        {
            var c,r,i,o;
            self.css("overflow","hidden");
            c = self.children().not(".splitter");
            r=self.innerHeight();
			t.sash=isNaN(t.sash)?self.width()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!self.children(".splitter").length)
            {
                var spl=$("<div/>").css({"position":"absolute","top":0,"bottom":0,"width":5,"overflow":"hidden","cursor":"col-resize"}).prependTo(self).addClass("splitter");
                var drag=-1;
			    spl.mousedown(function(e){ drag=e.pageX-t.sash;});
			    spl.mouseup(function(e){ drag=-1;});
				self.mouseup(function(e){ drag=-1;});
			    self.mousemove(function(e){if(drag>=0){t.sash=e.pageX-drag;setT(self,t);self.slm();}});
            }			
            var p0=$(c[0]);
			var p1=$(c[1]);
            
            
			p0.css({"position":"absolute","top":0,"bottom":0,"left":0,"width":t.sash});
			p1.css({"position":"absolute","top":0,"left":t.sash+5,"bottom":0,"right":0});
			self.children(".splitter").css("left",t.sash);
            return false;
        }
    }[t.sz];


	var propagate=function()
	{
		if (fl)
			fl();
			
		if (self.css("position")=="static")
			self.css("position","relative");

		self.children().each($.fn.slm);
	};
	
	propagate();
	

    return this;
};