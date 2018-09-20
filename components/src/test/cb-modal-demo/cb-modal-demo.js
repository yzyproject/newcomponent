/*
 * test1.js
 * author： niulei
 * Time: 2017.8.7
 * description: test1页面的业务逻辑js，存放此页面的业务逻辑。
 */
$(function(){
  console.log("进入页面JS");
  // $(document).on("click",".自个儿定义",function(event){
  //   var _this = $(this),
  //       type = _this.data("fn-type");
  //   page[type] ? page[type](_this) : console.error("未找到对应的按钮处理函数");
  // })
  page.init(); // 页面业务逻辑初始化。
});
var page = (function(){
  var fn = {},
  // 页面业务逻辑层的函数列表。
      pageData = {},//页面业务逻辑层数据源。
      model = {};  //向外抛出的model对象。
  //页面业务逻辑初始化
  model.init = function(){
      //表单等组件的赋值操作
      fn.initHtml();

  };

  //表单等的赋值操作
  fn.initHtml = function(){

  }
  fn.wing = function(triggerName){
    Event.trigger(triggerName);
  };
  model.endFn = function(options){
    console.log("小狗汪汪叫叫，模态框销毁回调函数触发");
  }
  model.cancelFn = function(options){
    console.log("模态框右上角关闭按钮的函数被触发");
    return false; //关闭模态框
  }
  model.successFn = function(options){
    console.log("小猫喵喵叫，模态框成功加载后的回调函数执行");
    return true;//关闭模态框
  }
  model.yesFn = function(options){
    console.log("模态框确定按钮回调函数触发,return true时关闭模态框 return false时不关闭模态框");
    return true;
  }
  model.btn2 = function(options){
    console.log("模态框第取消按钮回调函数触发");
    return false;
  }

  // //事件函数绑定位置
  EventHandler.addHandler("wing",fn["wing"]);
  // //订阅函数绑定位置
  // EventListenr.addListenr("console",fn["console"]);

  return model;
})();
