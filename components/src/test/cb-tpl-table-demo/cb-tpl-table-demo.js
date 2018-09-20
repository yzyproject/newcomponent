/*
 * cb-tpl-table-demo.js
 * author： niulei
 * Time: 2017.8.7
 * description: 模板表格的测试用例，示例用例
 */
$(function(){
  page.init(); // 页面业务逻辑初始化。
});
var page = (function(){
  var fn = {}, // 页面业务逻辑层的函数列表。
      pageData = {},//页面业务逻辑层数据源。
      model = {};  //向外抛出的model对象。
  //页面业务逻辑初始化
  model.init = function(){

      fn.initHtml();

  };

  //表单等的赋值操作
  fn["initHtml"] = function(){

    //为表格加载数据
    CbTplTable.loadTable($(".dongjingfeng"),{params:{"one":"one"}});
    //为表格合并的表格加载数据
    // CbTplTable.loadTable($(".xiaomiao"),{params:{"two":"one"}});
  }
  fn["wing"] = function(triggerName){
      Event.trigger(triggerName);
  }
  //订阅函数
  fn["getData"] = function(params){
      console.log($(this));
      var data = CbTplTable.getAllTableData($(this));
      console.log(data);
  }
  fn["updatecell"] = function(params){
    CbTplTable.updateCell($(this),0,"one",34567);
      var obj = {};
      var data = CbTplTable.getAllTableData($(this));
      obj["data"]={};
      obj["data"]["rows"] = data;
    CbTplTable.loadTable($(this),obj);
  }
  //事件函数绑定位置
  EventHandler.addHandler("wing",fn["wing"]);
  //订阅函数绑定位置
  EventListenr.addListenr("getData",fn["getData"]);
  EventListenr.addListenr("updatecell",fn["updatecell"]);


  return model;
})();
