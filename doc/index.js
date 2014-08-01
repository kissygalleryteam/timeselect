/**
 * @fileoverview 
 * @author 灵影<luntao.dlt@alibaba-inc.com>
 * @module timeselect
 **/
KISSY.add(function (S, Node, DOM, Event, Base) {
    var EMPTY = '';
    /**
     * 
     * @class Timeselect
     * @constructor
     * @extends Base
     */
    function Timeselect(comConfig) {
        var self = this;
        //调用父类构造函数
        Timeselect.superclass.constructor.call(self, comConfig);
        self._init(comConfig);

    }
    S.extend(Timeselect, Base, /** @lends Timeselect.prototype*/{
        //初始化数据（包括params,timeselect）
        init: function (config) {
            var self = this;
            if (config) {
                //大小，颜色，位置初始化
                //self._init(config.params);
                self._setTimeConf(config);
            }
        },
        //初始化
        _init: function (comConfig) {
            this.params = {
                hideTimeLine:false,
                startTime:8,
                endTime:20,
                width:300,
                bgColor:'#fff',
                selectedColor:'#b8ddfd',
                disableColor:'#aaa',
                progressColor:'#63a6f5'
            }
            comConfig = comConfig || {};
            S.mix(this.params, comConfig);
            this.render();

            var el = this.el;
            var tcEl = this.tcEl = DOM.get('.timecontent', el);
            this.listEl = DOM.query('li', tcEl);
            this.bindEvent();
            //this._setSelectedTime([1,2,3,4,5,6,7,8,9,10,11,12,13]);
            this._setSelectedTime([]);
            this.tempSelected = [];
            this.tempSelectedTime = [];
            this.allTimeObj = {};
            return this;
        },
        //渲染html
        render: function () {
            var self = this;
            if (!self.params.container) {
                return;
            }
            //var container = DOM.get('#' + self.params.id);
            var container = Node.all(self.params.container).getDOMNode();
            var html = '',i,temStr;
            var timeLineHide = self.params.hideTimeLine ? 'hide' : '';
            var fullWidth  =  self.params.hideTimeLine ? 'full-width' : '';
            html += '<div class="timepanel">' +
                        '<div class="timeline ' + timeLineHide + '">' +
                            '<ul>' ;
            var startTime = self.params.startTime;
            var endTime = self.params.endTime;
            for (i = startTime; i <= endTime; i++ ){
                html += '<li class="timeline-item' + ((i === endTime) ? ' lastone' : '') + '">' + (i < 10 ? '0'+i : i) + ':00</li>';
            }
            html += '</ul>' +
                     '</div>';
            html += '<div class="timecontent ' + fullWidth + '" style="background:' + self.params.bgColor + '">' +
                        '<ul>';
            var endTimeNum = (endTime - startTime + 1) * 4;
            for (i = 1; i <= endTimeNum; i++) {
                html += '<li class="timecontent-item' + ((i === endTimeNum) ? ' lastone' : '') + '" data-num="' + i + '">';
                temStr = '<div class="status"></div>';
                html += temStr + '</li>';
            }
            html += '</ul>'+
                    '</div>';
            this.el = DOM.create(html);
            if (self.params.width) {
                DOM.css(this.el, 'width', self.params.width + 'px');
            }
            DOM.append(this.el, container);
        },
        //绑定事件
        bindEvent: function () {
            var self = this;
            Event.on(DOM.query('li', self.tcEl), 'mousedown', function (e) {
                var target = e.currentTarget;
                self.startEl = target;
                if (self.isActived(target) && target.tagName === 'LI') {
                    self.mousedown = true;
                    //清空临时选择容器
                    self.clearTime();
                    if (DOM.hasClass(target, 'selected')) {
                        self.backtempSelectedTime(target);
                    } else {
                        self.drawtempSelectedTime(target);
                    }
                } else {
                    var num = DOM.attr(target, 'data-num');
                    self.fire('click', self._getTimeObjByNum(num));
                }
            });
            Event.on(self.tcEl, 'mouseover mouseout', function (e) {
                var target = e.target;
                if (self.mousedown && self.isActived(target)) {
                    if (e.type === 'mouseover') {
                        target.enterY = e.clientY;
                        if (DOM.hasClass(target, 'selected')) {
                            target.enterWidthClass = true;
                        } else {
                            self.drawtempSelectedTime(target);
                            self.enterY = e.clientY;
                            target.enterWidthClass = false;
                        }
                    } else {
                        e.leaveY = e.clientY;
                        if (Math.abs(e.leaveY - self.enterY) < 5) {
                            self.backtempSelectedTime(target);
                        }
                        if (target.enterWidthClass) {
                            self.backtempSelectedTime(target);
                        }
                        
                    }
                }
            });
            Event.on(self.tcEl, 'mouseup', function (e) {
                if (self.isActived(e.target) && e.target.tagName === 'LI') {
                    //重新整理数据
                    self.reData();
                    self.fire('select', self._getTempSelectedTime());
                    self.mousedown = false;
                }
                //self.saveTime();
                //self.clearTime();
            });

            self.eventListener();
        },
        //事件监听
        eventListener: function () {
            var self = this;
            //选择结束
            self.on('select', function (data) {
            });
            //点击时间选中区域
            self.on('click', function (data) {
            });
            //用户取消时间段
            self.on('cancle', function (data) {
            });
            //用户确定时间
            self.on('sure', function (data) {
            });
            //时间段内人数配置{num:11,percent:50}
            self.on('config', function (conf) {
               
            });
        },
        //绘制选中的时间区域
        drawtempSelectedTime: function (el) {
            var self = this;
            DOM.addClass(el, 'selected');
            self.tempSelected.push(el);
            self.tempSelectedTime.push(Number(DOM.attr(el, 'data-num')));
        },
        //选中区域回退
        backtempSelectedTime: function (el) {
            var self = this;
            DOM.removeClass(el, 'selected');
            var tempSelectedTime = self.tempSelectedTime;
            tempSelectedTime.splice(tempSelectedTime.indexOf(DOM.attr(el, 'data-num'), 1));
        },
        //整理数组，去重，补漏
        reData: function () {
            var self = this, newArr = [];
            var min = Math.min.apply(null, self.tempSelectedTime);
            var max = Math.max.apply(null, self.tempSelectedTime);
            var tempSelectedTime = self.tempSelectedTime = [];
            var val, listEl = self.listEl;
            S.each(listEl, function (el) {
                val = Number(DOM.attr(el, 'data-num'));
                if (val >= min && val <= max) {
                    tempSelectedTime.push(val);
                    if (!DOM.hasClass(el, 'selected') && self.isActived(el)) {
                        self.drawtempSelectedTime(el);
                    }
                }
            });
        },
        //是否活动可选
        isActived: function (el) {
            if (DOM.hasClass(el, 'unactived') || DOM.hasClass(el, 'disable')) {
                return false;
            } else  {
                return true;
            }
        },
        //保存时间选取
        saveTime: function () {
            var self = this;
            S.each(self.tempSelected, function (el) {
                self.setUnActived(el);
            });
            self.set('allSelectedTime', self.tempSelectedTime);
            //模拟
            //self._setProgress(self.tempSelectedTime, 100*Math.random());
            //self._setDisable(self.tempSelectedTime);
            self.tempSelected = [];
            self.tempSelectedTime = [];
        },
        //清除时间区域
        clearTime: function () {
            var self = this;
            S.each(self.tempSelected, function (el) {
                DOM.removeClass(el, 'selected');
            });
            self.tempSelected = [];
            self.tempSelectedTime = [];
        },
        //获取临时开始时间
        _getTempSelectedTime: function () {
            var self = this;
            var arr = self.tempSelectedTime;
            var min = Math.min.apply(null, arr);
            var max = Math.max.apply(null, arr);
            return {
                    minTime:self._numToTime(min,'min'),
                    maxTime:self._numToTime(max, 'max'),
                }
        },
        //设置为不活动状态
        setUnActived: function (el) {
            DOM.addClass(el, 'unactived');
        },
        //初始化预选中时间
        _setSelectedTime: function (arr) {
            var self = this;
            var listEl = self.listEl;
            var map  = listToMap(arr);
            S.each(listEl, function (el) {
                if (map[DOM.attr(el, 'data-num')]) {
                    //添加选中样式
                    DOM.addClass(el, 'selected');
                    //设置为不活动状态
                    self.setUnActived(el);
                    //设置进度-test
                }
            });
        }, 
        //用户配置时间段时，设置时间段百分比，是否不可用
        setTimeConf: function (conf) {
                var self = this;
                var linkArr = self._timeToArray(conf.minTime, conf.maxTime);
                self._setProgress(linkArr, conf.percent);
                self._setDisable(linkArr, conf.disable);
                self.setTimeData(conf);
        },
        //删除时间配置
        deleteTimeConf: function (arr) {
            var self = this;
            var map = listToMap(arr);
            S.each(self.listEl, function (el) {
                if (map[DOM.attr(el, 'data-num')]) {
                    DOM.removeClass(el, 'selected unactived disable');
                    var childrenEl = DOM.get('.status', el);
                    DOM.css(childrenEl, {
                        'z-index': -1,
                        'width': 0
                    });
                    DOM.remove('span', el);
                }
            });
        },
        //初始化组件时，设置该组件时间段百分比，是否可用
        _setTimeConf: function (conf) {
            var self = this, linkArr ;
            S.each(conf, function (obj) {
                linkArr = self._timeToArray(obj.minTime, obj.maxTime);
                self._setSelectedTime(linkArr);
                self._setProgress(linkArr, obj.percent);
                self._setDisable(linkArr, obj.disable);
                self._setAllSelectedTime(linkArr);
                self.setTimeData(obj);
                //测试
                //self.deleteTimeConf(linkArr);
            } );
        },
        //设置选中时间段内百分比
        _setProgress: function (arr, percent) {
            var self = this;
            var map = listToMap(arr);
            percent = percent ? percent : 0;
            S.each(self.listEl, function (el) {
                if (map[DOM.attr(el, 'data-num')]) {
                    var childrenEl = DOM.get('.status', el);
                    DOM.css(childrenEl, {
                        'z-index': 0,
                        'width': percent + '%'
                    });
                }
            });
        },
        //设置时间段不可再配置
        _setDisable: function (arr, disable) {
            var self = this;
            var map = listToMap(arr);
            S.each(self.listEl, function (el) {
                if (map[DOM.attr(el, 'data-num')]) {
                    if (disable === true) {
                        DOM.addClass(el, 'disable');
                    } else {
                        DOM.removeClass(el, 'disable');
                    }
                   
                }
            });
        },
        //添加日期提示
        _setTimeTip: function (obj) {
            var self = this;
            var min = obj.min;
            var max = obj.max;
            var plus = (max - min)/2;
            var str = obj.minTime + '--' + obj.maxTime;
            S.each(self.listEl, function (el) {
                if (DOM.attr(el, 'data-num') == min) {
                    var timeDom = DOM.create('<span class="time-tip">'+str+'</span>');
                    DOM.css(timeDom, 'top', (plus * 10) - 5 + 'px');
                    DOM.append(timeDom, el);
                }
            });
            
        },
        //num转化为时间
        _numToTime: function (num, type) {
            num = type === 'min' ? num -1 : num;
            var self = this;
            var startTime = self.params.startTime;
            var hour = Math.floor(num * 15 /60);
            var minute = num * 15 % 60;
            var time  = startTime + hour + (minute * 0.01);
            time = time = time<10 ? '0' + time : time + '';
            if (minute === 0) {
                time += ':00';
            } else {
                time = time.replace('.', ':');
                if (minute === 30) {
                    time += '0';
                }
            }
            return time;
        },
        //将时间解析为num
        _TimeToNum: function (time, type) {
            var self = this;
            var arr = time.split(':');
            var hour = Number(arr[0]);
            var minute = Number(arr[1]);
            var num;
            var startTime = self.params.startTime;
            if (type === 'min') {
                num = ((hour - startTime) * 60 + minute ) / 15 + 1;
            } else {
                num = ((hour - startTime) * 60 + minute ) / 15;
            }
            return num;
        },
        //startTime ,endTime to Array 
        _timeToArray: function (minTime, maxTime) {
            var self = this;
            var minNum = self._TimeToNum(minTime, 'min');
            var maxNum = self._TimeToNum(maxTime, 'max');
            var arr = [];
            for(var i = minNum; i <= maxNum; i++) {
                arr.push(i);
            }
            return arr;
        },
        //通过数字编号获取起始时间
        _getTimeObjByNum: function (num) {
            var self = this;
            var obj = self.allTimeObj[num];
            if (obj){
                return {
                    minTime: obj.minTime,
                    maxTime: obj.maxTime,
                    data: obj.data
                    }
                }
            },
        //设置时间段的data数据
        setTimeData: function (obj) {
            var self = this;
            var arr = self._timeToArray(obj.minTime, obj.maxTime);
            var allTimeObj = self.allTimeObj;
            S.each(arr, function (val) {
                if (allTimeObj[val]) {
                    allTimeObj[val].data = obj.data;
                }
            });
        },
        _setAllSelectedTime: function (arr) {
            var self = this;
                if (!self.allSelectedTime) {
                        self.allSelectedTime = [];
                    }
                   
                var newArr = [];
                newArr = arr.slice(0);
                self.allSelectedTime.push(newArr);
                S.each(arr, function (val) {
                   // self.allSelectedTime.push(val);
                });

                if (!self.allTimeObj) {
                    self.allTimeObj = {};
                }
                var min = Math.min.apply(null, arr);
                var max = Math.max.apply(null, arr);
                var obj = {
                    min:min,
                    max:max,
                    minTime:self._numToTime(min,'min'),
                    maxTime:self._numToTime(max, 'max'),
                    linkArr:newArr
                }

                S.each(arr, function (val) {
                   self.allTimeObj[val] = obj;
                });
                self._setTimeTip(obj);
        }

    }, {ATTRS : /** @lends Timeselect*/{
        'hideTimeLine': {
            getter: function () {
                return this.params.hideTimeLine;
            }
        },
        'width': {
            getter: function () {
                return this.params.width;
            }
        },
        'id': {
            getter: function () {
                return this.params.id;
            }
        },
        'bgColor': {
            getter: function () {
                return this.params.bgColor;
            }
        },
        'startTime': {
            getter: function () {
                return this.params.startTime
            }
        },
        'endTime': {
            getter: function () {
                
                return this.params.endTime



            }
        },
        'allSelectedTime': {
            setter: function (arr) {
                var self = this;
                if (!self.allSelectedTime) {
                        self.allSelectedTime = [];
                    }
                   
                var newArr = [];
                newArr = arr.slice(0);
                self.allSelectedTime.push(newArr);
                S.each(arr, function (val) {
                   // self.allSelectedTime.push(val);
                });

                if (!self.allTimeObj) {
                    self.allTimeObj = {};
                }
                var min = Math.min.apply(null, arr);
                var max = Math.max.apply(null, arr);
                var obj = {
                    min:min,
                    max:max,
                    minTime:self._numToTime(min,'min'),
                    maxTime:self._numToTime(max, 'max'),
                    linkArr:newArr
                }

                S.each(arr, function (val) {
                   self.allTimeObj[val] = obj;
                });
                //self.allTimeObj[min] = obj;

                self._setTimeTip(obj);

            },
            getter: function () {
                return this.allSelectedTime;
            }
        }
    }});
    //list转化为map
    function listToMap (arr) {
        var obj = {};
        S.each(arr, function (val) {
            if (!S.isObject(val)) {
                obj[val] = true;
            }
        });
        return obj;
    }

    S.augment(Timeselect, Event.Target);
    return Timeselect;
}, {requires:['node','dom', 'event', 'base', './index.css']});



