/*!build time : 2014-07-14 4:49:14 PM*/
KISSY.add("gallery/timeselect/1.0/index",function(a,b,c,d,e){function f(a){var b=this;f.superclass.constructor.call(b,a),b._init(a)}function g(b){var c={};return a.each(b,function(b){a.isObject(b)||(c[b]=!0)}),c}return a.extend(f,e,{init:function(a){var b=this;a&&b._setTimeConf(a)},_init:function(b){this.params={hideTimeLine:!1,startTime:8,endTime:20,width:300,bgColor:"#fff",selectedColor:"#b8ddfd",disableColor:"#aaa",progressColor:"#63a6f5"},b=b||{},a.mix(this.params,b),this.render();var d=this.el,e=this.tcEl=c.get(".timecontent",d);return this.listEl=c.query("li",e),this.bindEvent(),this._setSelectedTime([]),this.tempSelected=[],this.tempSelectedTime=[],this.allTimeObj={},this},render:function(){var a=this;if(a.params.container){var d,e,f=b.all(a.params.container).getDOMNode(),g="",h=a.params.hideTimeLine?"hide":"",i=a.params.hideTimeLine?"full-width":"";g+='<div class="timepanel"><div class="timeline '+h+'"><ul>';var j=a.params.startTime,k=a.params.endTime;for(d=j;k>=d;d++)g+='<li class="timeline-item'+(d===k?" lastone":"")+'">'+(10>d?"0"+d:d)+":00</li>";g+="</ul></div>",g+='<div class="timecontent '+i+'" style="background:'+a.params.bgColor+'"><ul>';var l=4*(k-j+1);for(d=1;l>=d;d++)g+='<li class="timecontent-item'+(d===l?" lastone":"")+'" data-num="'+d+'">',e='<div class="status"></div>',g+=e+"</li>";g+="</ul></div>",this.el=c.create(g),a.params.width&&c.css(this.el,"width",a.params.width+"px"),c.append(this.el,f)}},bindEvent:function(){var a=this;d.on(c.query("li",a.tcEl),"mousedown",function(b){var d=b.currentTarget;if(a.startEl=d,a.isActived(d)&&"LI"===d.tagName)a.mousedown=!0,a.clearTime(),c.hasClass(d,"selected")?a.backtempSelectedTime(d):a.drawtempSelectedTime(d);else{var e=c.attr(d,"data-num");a.fire("click",a._getTimeObjByNum(e))}}),d.on(a.tcEl,"mouseover mouseout",function(b){var d=b.target;a.mousedown&&a.isActived(d)&&("mouseover"===b.type?(d.enterY=b.clientY,c.hasClass(d,"selected")?d.enterWidthClass=!0:(a.drawtempSelectedTime(d),a.enterY=b.clientY,d.enterWidthClass=!1)):(b.leaveY=b.clientY,Math.abs(b.leaveY-a.enterY)<5&&a.backtempSelectedTime(d),d.enterWidthClass&&a.backtempSelectedTime(d)))}),d.on(a.tcEl,"mouseup",function(b){a.isActived(b.target)&&"LI"===b.target.tagName&&(a.reData(),a.fire("select",a._getTempSelectedTime()),a.mousedown=!1)}),a.eventListener()},eventListener:function(){var a=this;a.on("select",function(){}),a.on("click",function(a){}),a.on("cancle",function(){this.clearTime()}),a.on("sure",function(){this.saveTime()}),a.on("config",function(){})},drawtempSelectedTime:function(a){var b=this;c.addClass(a,"selected"),b.tempSelected.push(a),b.tempSelectedTime.push(Number(c.attr(a,"data-num")))},backtempSelectedTime:function(a){var b=this;c.removeClass(a,"selected");var d=b.tempSelectedTime;d.splice(d.indexOf(c.attr(a,"data-num"),1))},reData:function(){var b,d=this,e=Math.min.apply(null,d.tempSelectedTime),f=Math.max.apply(null,d.tempSelectedTime),g=d.tempSelectedTime=[],h=d.listEl;a.each(h,function(a){b=Number(c.attr(a,"data-num")),b>=e&&f>=b&&(g.push(b),!c.hasClass(a,"selected")&&d.isActived(a)&&d.drawtempSelectedTime(a))})},isActived:function(a){return c.hasClass(a,"unactived")||c.hasClass(a,"disable")?!1:!0},saveTime:function(){var b=this;a.each(b.tempSelected,function(a){b.setUnActived(a)}),b.set("allSelectedTime",b.tempSelectedTime),b.tempSelected=[],b.tempSelectedTime=[]},clearTime:function(){var b=this;a.each(b.tempSelected,function(a){c.removeClass(a,"selected")}),b.tempSelected=[],b.tempSelectedTime=[]},_getTempSelectedTime:function(){var a=this,b=a.tempSelectedTime,c=Math.min.apply(null,b),d=Math.max.apply(null,b);return{minTime:a._numToTime(c,"min"),maxTime:a._numToTime(d,"max")}},setUnActived:function(a){c.addClass(a,"unactived")},_setSelectedTime:function(b){var d=this,e=d.listEl,f=g(b);a.each(e,function(a){f[c.attr(a,"data-num")]&&(c.addClass(a,"selected"),d.setUnActived(a))})},setTimeConf:function(a){var b=this,c=b._timeToArray(a.minTime,a.maxTime);b._setProgress(c,a.percent),b._setDisable(c,a.disable),b.setTimeData(a)},deleteTimeConf:function(b){var d=this,e=g(b);a.each(d.listEl,function(a){if(e[c.attr(a,"data-num")]){c.removeClass(a,"selected unactived disable");var b=c.get(".status",a);c.css(b,{"z-index":-1,width:0}),c.remove("span",a)}})},_setTimeConf:function(b){var c,d=this;a.each(b,function(a){c=d._timeToArray(a.minTime,a.maxTime),d._setSelectedTime(c),d._setProgress(c,a.percent),d._setDisable(c,a.disable),d._setAllSelectedTime(c),d.setTimeData(a)})},_setProgress:function(b,d){var e=this,f=g(b);d=d?d:0,a.each(e.listEl,function(a){if(f[c.attr(a,"data-num")]){var b=c.get(".status",a);c.css(b,{"z-index":0,width:d+"%"})}})},_setDisable:function(b,d){var e=this,f=g(b);a.each(e.listEl,function(a){f[c.attr(a,"data-num")]&&(d===!0?c.addClass(a,"disable"):c.removeClass(a,"disable"))})},_setTimeTip:function(b){var d=this,e=b.min,f=b.max,g=(f-e)/2,h=b.minTime+"--"+b.maxTime;a.each(d.listEl,function(a){if(c.attr(a,"data-num")==e){var b=c.create('<span class="time-tip">'+h+"</span>");c.css(b,"top",10*g-5+"px"),c.append(b,a)}})},_numToTime:function(a,b){a="min"===b?a-1:a;var c=this,d=c.params.startTime,e=Math.floor(15*a/60),f=15*a%60,g=d+e+.01*f;return g=g=10>g?"0"+g:g+"",0===f?g+=":00":(g=g.replace(".",":"),30===f&&(g+="0")),g},_TimeToNum:function(a,b){var c,d=this,e=a.split(":"),f=Number(e[0]),g=Number(e[1]),h=d.params.startTime;return c="min"===b?(60*(f-h)+g)/15+1:(60*(f-h)+g)/15},_timeToArray:function(a,b){for(var c=this,d=c._TimeToNum(a,"min"),e=c._TimeToNum(b,"max"),f=[],g=d;e>=g;g++)f.push(g);return f},_getTimeObjByNum:function(a){var b=this,c=b.allTimeObj[a];return c?{minTime:c.minTime,maxTime:c.maxTime,data:c.data}:void 0},setTimeData:function(b){var c=this,d=c._timeToArray(b.minTime,b.maxTime),e=c.allTimeObj;a.each(d,function(a){e[a]&&(e[a].data=b.data)})},_setAllSelectedTime:function(b){var c=this;c.allSelectedTime||(c.allSelectedTime=[]);var d=[];d=b.slice(0),c.allSelectedTime.push(d),a.each(b,function(){}),c.allTimeObj||(c.allTimeObj={});var e=Math.min.apply(null,b),f=Math.max.apply(null,b),g={min:e,max:f,minTime:c._numToTime(e,"min"),maxTime:c._numToTime(f,"max"),linkArr:d};a.each(b,function(a){c.allTimeObj[a]=g}),c._setTimeTip(g)}},{ATTRS:{hideTimeLine:{getter:function(){return this.params.hideTimeLine}},width:{getter:function(){return this.params.width}},id:{getter:function(){return this.params.id}},bgColor:{getter:function(){return this.params.bgColor}},startTime:{getter:function(){return this.params.startTime}},endTime:{getter:function(){return this.params.endTime}},allSelectedTime:{setter:function(b){var c=this;c.allSelectedTime||(c.allSelectedTime=[]);var d=[];d=b.slice(0),c.allSelectedTime.push(d),a.each(b,function(){}),c.allTimeObj||(c.allTimeObj={});var e=Math.min.apply(null,b),f=Math.max.apply(null,b),g={min:e,max:f,minTime:c._numToTime(e,"min"),maxTime:c._numToTime(f,"max"),linkArr:d};a.each(b,function(a){c.allTimeObj[a]=g}),c._setTimeTip(g)},getter:function(){return this.allSelectedTime}}}}),a.augment(f,d.Target),f},{requires:["node","dom","event","base","./index.css"]});