/*
 * cb-tpl-checkbox-demo.js
 * author： niulei
 * Time: 2017.9.24
 * description: cb-tpl-checkbox-demo页面的业务逻辑js，存放此页面的业务逻辑。
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

  //数据加载前的数据处理函数，return false时停止数据请求
  model.beforeLoad = function(options,data){
      console.log("调用beforeLoad",options,data);
      return data;
  }
  //数据加载成功后的处理函数 return false时停止渲染
  model.loadSuccess = function(options,returnData){
    console.log("调用loadSuccess",options,returnData);
    return returnData;
  }
  //成功渲染后的回调函数
  model.renderSuccess = function($dom){
    console.log("调用渲染成功函数",$dom)
  }
  //单击多选框时的回调函数，return true选中 return false 不选中
  model.onCheck = function(options,state,value,text){
    console.log("调用单击多选框的回调函数",options,state,value,text);
    return !state;
  }
  //选择状态变更后的回调函数
  model.checkFn = function(options,state,value,text) {
    console.log("调用多选框状态变更的回调函数",options,state,value,text);

  };
  //按钮单击事件加载多选框数据
  fn.triggerFn = function(triggerName){
    Event.trigger(triggerName,{"one":"one"});
  };
  //多选框的订阅回调函数
  fn.loadtheData = function(params){
    CbTplCheckBox.loadCheckBox($(this),{params:params});
  }
  //通过传入data来加载多选框数据
  fn.loadtheData2 = function(params) {
    CbTplCheckBox.loadCheckBox($(this),{data:{outputParamList:[
      {
        "text1":"类型1",
        "value1":"01",
        "disabled":true,
        "description":"disabled 这个字段为true时，多选框禁止点击"
      },
      {
        "text1":"类型二er",
        "value1":"02",
        "isChecked":true,
        "description":"isChecked 这个字段为true时，此选项默认选中"

      },
      {
        "text1":"类型三",
        "value1":"03"
      }
    ]}});
  }
  //追加数据
  fn.appendtheData = function(params){
    CbTplCheckBox.appendCheckBox($(this),{params:params});
  }
  //重新加载数据
  fn.reLoadFn = function(params){
    CbTplCheckBox.reLoadCheckBox($(this));
  }
  //选中所有的多选框
  fn.checkAll = function(params){
    CbTplCheckBox.checkAll($(this));
  }
  //取消所有选中框的选中状态
  fn.unCheckAll = function(params){
    CbTplCheckBox.unCheckAll($(this));
  }
  //事件函数绑定位置
  EventHandler.addHandler("triggerFn",fn["triggerFn"]);
  //订阅函数绑定位置
  EventListenr.addListenr("loadtheData",fn["loadtheData"]);
  EventListenr.addListenr("loadtheData2",fn["loadtheData2"]);
  EventListenr.addListenr("appendtheData",fn["appendtheData"]);
  EventListenr.addListenr("reLoadFn",fn["reLoadFn"]);
  EventListenr.addListenr("checkAll",fn["checkAll"]);
  EventListenr.addListenr("unCheckAll",fn["unCheckAll"]);
  return model;
})();
