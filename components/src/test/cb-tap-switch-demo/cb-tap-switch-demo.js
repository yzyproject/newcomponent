/*
 * cb-tap-switch.js
 * author： niulei
 * Time: 2017.10.7
 * description: cb-tap-switch页面的业务逻辑js，存放此页面的业务逻辑。
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
  var fn = {}, // 页面业务逻辑层的函数列表。
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

  //成功渲染后的回调函数
  model.renderSuccess = function($dom){
    console.log("调用渲染成功函数",$dom)
  }
  //单击多选框时的回调函数，return true选中 return false 不选中
  model.onCheck = function(options,state,value,text){
    console.log("调用单击选项卡的回调函数",options,state,value,text);
    return !state;
  }
  //选择状态变更后的回调函数
  model.checkFn = function(options,state,value,text) {
    console.log("调用选项卡状态变更的回调函数",options,state,value,text);

  };

  return model;
})();
