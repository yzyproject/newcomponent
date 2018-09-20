/*
 * ValidateRules 1.0.0
 * author： niulei
 * Time: 2017.4.14
 * description:  将校验列表抽出 便于维护
 */

 var ValidateRules = (function () {
   //拥有校验的元素
   var tagNameList = ['input[type="text"]','input[type="password"]','input[type="radio"]','input[type="checkbox"]',"textarea","select"];
   // 校验时的事件类型
   var eventName = "focus keyup  blur change";
   // 固化的 校验正则表达式
   var regExpList = {
       //正则表达式列表
       number: "^[0-9]*$",
       lowerLetter: "^[a-z]*$",
       tel:"^([1-9][0-9]{10}||\s)$",
       email:"^([a-zA-Z0-9_\\-]{1,}@[a-zA-Z0-9_\\-]{1,}\\.[a-zA-Z0-9_\\-.]{1,}||\s)$",
       userPassword:"^((?=.*[a-zA-Z])(?=.*\\d).{8,30}||\s)$",
       userName:"^([0-9a-zA-Z]{1}[0-9a-zA-Z\\_]{3,29}||\s)$",
       chinese:"^([\u4e00-\u9fa5]{1}[0-9\u4e00-\u9fa5]*||\s)$",
       letter:"^([a-zA-Z]{1}[0-9a-zA-Z\\_]{3,29}||\s)$",
       jdbcUrl:"(:\/\/)+[A-Za-z0-9]+\\.[A-Za-z0-9]+[\/=\\?%\\-&_~`@[\\]\\':+!]*([^<>\\\"\\\"])*$"
   };
   //固化的校验规则校验函数 $dom为具体的校验元素 ， regTip 为校验提示
   var checkList = {
       //必输项校验
       required: function ($dom, regTip) {
           //是否为必输项
           var str = $.trim($dom.val());
           var result=true;
           var regTip= regTip === "default" ? "" : regTip;
           if (!str) {
             result=false;
           }
           return [result , regTip];
       },
       //正整数校验
       init: function ($dom, regTip) {
           var str = $.trim($dom.val());
           var regTip= regTip === "default" ? "请输入正整数" : regTip;
           var regExp = new RegExp("^[0-9]*$");
           var result = regExp.test(str);
           return [result , regTip];

       },
       equal: function ($dom,regTip) {
           var str = $.trim($dom.val());
           var options = $dom.parent('div').data('options');
           var equalValue = $('div[cid = "'+options.equalCid+'"]').find('input').val();
           var regTip= regTip === "default" ? "密码不一致，请重新输入" : regTip;
           var result=false;
           if(str === equalValue){
               result = true;
           }
           return [result , regTip];
       },
       //邮箱校验
       mail: function () {

       }
   };

   //获得规则校验函数。
   var getCheckHandler = function(hanlderName) {
     return checkList[hanlderName] || false ;
   };

   //获得校验规则表达式
   var getCheckRegExp = function(regExpName) {
     return regExpList[regExpName] || false ;
   };

   // 获得可校验的元素
   var getTagName = function() {
     return tagNameList || [] ;
   };

   // 获得校验的事件类型
   var getEventName = function() {
      return eventName || false ;
   };

   //增加校验函数
   var addCheckHandler = function(handlerName, handler) {
     if(handler && typeof handler === "function") {
       checkList[handlerName] = handler;
     }
   }

   //增加校验正则表达式
   var addCheckRegExp = function(regExpName, regExp) {
     if(regExp && typeof regExp === "string") {
       regExpList[regExpName] = regExp;
     }
   }

   return {
     addCheckRegExp:addCheckRegExp,
     addCheckHandler:addCheckHandler,
     getEventName:getEventName,
     getTagName:getTagName,
     getCheckRegExp:getCheckRegExp,
     getCheckHandler:getCheckHandler

   }


 })();
