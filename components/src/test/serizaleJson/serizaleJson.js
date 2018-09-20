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
  var fn = {}, // 页面业务逻辑层的函数列表。
      pageData = {},//页面业务逻辑层数据源。
      model = {};  //向外抛出的model对象。
  //页面业务逻辑初始化
  model.init = function(){
      //表单等组件的赋值操作
      fn.initHtml();

  };
  //表单等的赋值操作
  fn["initHtml"] = function(){
    var data = Serialize.serializeObj($(".test"));
    console.log(data);
  }
  return model;
})();
