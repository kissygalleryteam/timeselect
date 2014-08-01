## 综述

Timeselect是一个时间段选择控件，通过Timeselect可以非常方便通过`拖拽`选择时间段。

* 版本：2.0.0
* 作者：灵影
* demo：[http://kg.kissyui.com/timeselect/2.0.0/demo/index.html](http://kg.kissyui.com/timeselect/2.0.0/demo/index.html)

## 初始化组件
		
    S.use('kg/timeselect/2.0.0/index', function (S, Timeselect) {
         var timeselect = new Timeselect({
               container:"#content",
         		hideTimeline:false, //不隐藏时间线
         		width:200, //宽度为：200px
         		startTime:8, //开始时间：8点
         		endTime:20  //结束时间：20点
         });
    })
	
	

## API说明

### 配置参数
`container`: 父容器，类型：string/HTMLElement/NodeList

`hideTimeline`:是否隐藏时间线，类型：boolean,default:false

`width`:组件宽度，类型：number,default:300

`startTime`:开始时间，类型：number(整数), default:8，范围：0-24

`entTime`:结束时间，类型：number(整数), default:20，范围：0-24
#### 方法
`init(arr)`:初始化时间段选择，参数为数组，数组元素为object:

* minTime: 时间段开始时间，格式：“13:15”
* maxTime: 时间段结束时间，格式同上
* disable: 可选，该时间段是否禁用，default:false
* percent: 可选，可以设置该段时间的进度，类型:数字，范围：0-2.0.0

js代码
		
      S.use('kg/timeselect/2.0.0/index', function (S, Timeselect) {
         var timeselect = new Timeselect();
         	  timeselect.init([
         	  	{
         	  		minTime:'08:00',
         	  		maxTime:'12:00'
         	  	},{
         	  		minTime:'13:00',
         	  		maxTime:'15:00'
         	  	}
         	  ]);
      })
    
    
`saveTime()`:保存当前选取的时间段

`clearTime()`:清除当前选取的时间段

### 事件
`select`:选择时间段完成时触发，callback传参为object：

* minTime:时间段开始时间
* maxTime:时间段结束时间

`click`:点击所选择的时间段触发,callback传参如上。

