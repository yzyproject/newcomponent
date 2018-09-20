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
      //拿到url携带的参数。
      fn.getUrlData();
      //请求权限接口，来进行权限操作
      fn.setPower();
      //处理初始的数据。
      fn.cacheData();
      //表单等组件的赋值操作
      fn.initHtml();
      //自行的事件绑定
      fn.eventList();
      //修改项目及公共配置
      // fn.editConfig();
  };
  //修改项目及配置
  fn["editConfig"] = function(){

  }
  // 设置权限
  fn["setPower"] = function(){
    console.log("请求权限接口与模板，进行权限操作");
  }
  //拿到url后携带的参数
  fn["getUrlData"] = function(){
    console.log("取出url上带的数据与登录人员信息，并将取出的数据 放入pageData中。");
  }
  //处理初始的数据
  fn["cacheData"] = function(){
    console.log("请求公共的数据接口或缓存数据，并将取出的数据 放入pageData中");
  };
  //表单等的赋值操作
  fn["initHtml"] = function(){
    console.log("用数据为表单赋值，下拉框，表格等组件也可在此处初始化");
    console.log(store.get("liuqianwen"));

    //根据url来获取模板
    TplHelper.getTplByUrl("power1.html",function(render){
      console.log(render({data:[1,2,3,4,5,6,6]}));
    });
    //根据str来获取模板
    TplHelper.getTplByStr("<div>fdfdfdfdf{{data}}</div>",function(render){
      console.log(render({data:"54544"}));
    });
    //根据url，将指定的模板渲染到制定的div中
    TplHelper.renderByUrl("power1.html",".btn-view",{data:[1,2,3,4,5,6,6]},function(){
    });

  }
  //自行的事件绑定
  fn["eventList"] = function(){
    console.log("自行的事件绑定。");
  }
  //bindcl 处理函数一
  fn["wing"] = function(triggerName){
      console.log("单击事件处理函数 is OK");
      Event.trigger(triggerName);
  }
  //订阅函数
  fn["console"] = function(params){
      console.log("订阅函数已监听");
  }
  //事件函数绑定位置
  EventHandler.addHandler("wing",fn["wing"]);
  //订阅函数绑定位置
  EventListenr.addListenr("console",fn["console"]);
  //模板的帮助函数示例
  TplHelper.helper('helptest',function (data,a,b,c) {
          console.log(data);
          console.log(a);
          console.log(b);
          console.log(c);
          return data;
  });
  return model;
})();
