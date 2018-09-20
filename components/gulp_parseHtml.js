var through = require('through2');
var jsdom = require("node-jsdom");
var theJQuery = require("jquery");
// 插件级别函数 (处理文件)
function gulpParsing() {
  //为解析后的文件加上头尾
  var addOuterLayer = function (html) {
    var head = "<!DOCTYPE html>"+
                "<html lang='zh-CN'>";
    var tail = "</html>";
    return head+html+tail;

  }
  var date = (new Date()).getTime();
  c = 0; //为了让别的闭包访问到，所以要扔到全局变量中
  // 创建一个让每个文件通过的 stream 通道
  var stream = through.obj(function(file, enc, cb) {
    jsdom.env(
      file.contents.toString(),
      [],
      function (errors, window) {
        jQuery = $ = theJQuery(window);
        c=c+1;
        var parse = require("./dist/recvle.js");
        //解析自定义标签
        var path = file.path;  //当前解析的页面路径
        var pathIndex = 0;   //页面目录所在索引
        var i = 0;
        var str = "";
        var stylesPath = "_styles/style.min.css";
        path = path.split("/");
        pathIndex = path.indexOf("src") == -1 ? path.indexOf("views"):path.indexOf("src");
        for(i=0;i<path.length-pathIndex-1;i++){
          str = str +"../";
        }
        stylesPath = str+stylesPath;
        parse.startParse();
        //为所有script标签加上版本控制
        $("script").each(function(index,value){
          var $script = $(this);
          var src = $script.attr("src") || "";
          if(!src){
            return true;
          }
          var substr = "/_scripts/common/common.js";
          var substr2 = "/scripts/api/common-";
          var substr3 = "/_scripts/api/common-api.js";
          if(src.indexOf(substr2)>0){
            $script.remove();
            return true;
          }
          src = src.replace("scripts","_scripts");
          src = src+"?_=tydic_"+date;
          $script.attr("src",src);
          var a = 0;
          if(src.indexOf(substr)>0){
            $script.after('<script class="node-merge-js" src="'+src.replace(substr,substr3)+'"></script>');
            $('script[src="'+src.replace(substr,substr3)+'"]').each(function(index,value){
              (!$(this).hasClass("node-merge-js")) && $(this).remove();
            })
          }
        })
        //加入压缩后的css
        $('head').prepend('<link rel="stylesheet" href="'+stylesPath+'">');
        //为每个link标签加入版本控制
        $("link").each(function(index,value){
          var $link = $(this);
          var href = $link.attr("href") || "";
          if(!href){
            return true;
          }
          $link.attr("href",href+"?_=tydic_"+date);
        })
        var buffer = new Buffer(addOuterLayer($("html").html()));
        file.contents = buffer;
      }
    );
    cb(null,file);

  });

  return stream;
}

// 暴露（export）插件的主函数
module.exports = gulpParsing;
