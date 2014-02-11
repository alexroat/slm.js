$.fn.slm=function(layout)
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

    //gestione resize
	var rsz = function(target)
	{
		var edge=[false,false,false,false];
		var d;
		var fmousemove=function(e){  };
		var fmouseup=function(e){  };
		var fmousedown=function(e){   };
		target.bind("mousedown",fmousedown);
	
	}
	
	
    //ricerca funzione
	var c;
    var fl={
        fullpage:function()
        {
            if (!t.ok)
            {
                //vincolail contenitore alla finestra e aggancia gli eventi di resize
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
                $("<div/>").css({"position":"absolute","right":0,"top":0,"width":hh,"height":hh,"background":"red","text-align":"center","cursor":"default"}).appendTo(hdlg).text("×").click(function(){self.remove();});
                //gestione spostamento
                var drag;
		        hdlg.mousedown(function(e){ drag=[e.pageX-t.x,e.pageY-t.y];});
			    $(document).mouseup(function(e){ drag=null;});
		        $(document).mousemove(function(e){if(drag){t.x=e.pageX-drag[0];t.y=e.pageY-drag[1];self.css("left",t.x).css("top",t.y);window.event.returnValue = false;}});
                //figli: il dialog accetta un solo figlio e lo massimizza
                c.hide();
                $(c[0]).css({"position":"absolute","left":0,"top":hdlg.outerHeight(),"right":0,"bottom":0}).show();
				t.ok=1;
                setT(self,t);
            }
        },
        boxV:function()
        {
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
            var i,o;
			t.sel=isNaN(t.sel)?0:t.sel;
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
                    var s=$("<span/>").text(pt.title).appendTo(header).toggleClass("selected",i==t.sel);
				    s.click((function(j){return function(){t.sel=j;setT(self,t);header.children().removeClass("selected");$(this).addClass("selected");self.slm();}})(i));
                }
                t.ok=1;
                setT(self,t);
            }       
            //adattamento children
            t.sel=isNaN(t.sel)?0:t.sel%c.size();
            var hs=self.children(".tabheader").outerHeight();
            c.hide();
            $(c[t.sel]).css({"position":"absolute","left":0,"top":hs,"right":0,"bottom":0}).show();
            
            return false;
        },
        accordion:function()
        {
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
                r-=$(ac[i]).toggleClass("selected",i==t.sel).outerHeight();
            //adattamento children
            c.hide();
            t.sel=isNaN(t.sel)?0:t.sel%c.size();
            $(c[t.sel]).show().css({left:0,right:0,height:r});
            return false;
        },
		shift:function()
        {
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
            var i,o;
			t.sash=isNaN(t.sash)?self.height()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!t.ok)
            {
                var spl=$("<div/>",{"class":"slmignore splitter"}).css({"position":"absolute","left":0,"right":0,"height":5,"overflow":"hidden","cursor":"row-resize"}).prependTo(self);
                var drag=-1;
			    spl.mousedown(function(e){ drag=e.pageY-t.sash;});
				self.mouseup(function(e){ drag=-1;window.event.returnValue = true;});
			    self.mousemove(function(e){if(drag>=0){t.sash=e.pageY-drag;setT(self,t);self.slm();window.event.returnValue = false;}});
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
            var i,o;
			t.sash=isNaN(t.sash)?self.width()/2:t.sash;
			setT(self,t);
            //creazione splitter
            if (!t.ok)
            {
                var spl=$("<div/>",{"class":"slmignore splitter"}).css({"position":"absolute","top":0,"bottom":0,"width":5,"overflow":"hidden","cursor":"col-resize"}).prependTo(self);
                var drag=-1;
			    spl.mousedown(function(e){ drag=e.pageX-t.sash;});
				self.mouseup(function(e){ drag=-1;});
			    self.mousemove(function(e){if(drag>=0){t.sash=e.pageX-drag;setT(self,t);self.slm();window.event.returnValue = false;}});
                t.ok=1;
                setT(self,t);
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
	
		if (self.css("position")=="static")
			self.css("position","relative");


	
		if (fl)
		{
			self.css("overflow","hidden");
			c = self.children(":not(.slmignore)").css({height:"",width:""});
			fl();
			self.children().each($.fn.slm);
		}
		

	};
	
	propagate();
	

    return this;
};

