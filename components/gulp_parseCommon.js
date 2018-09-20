var through = require('through2');
// 插件级别函数 (处理文件)
function gulpParsing() {

  // 创建一个让每个文件通过的 stream 通道
  var stream = through.obj(function(file, enc, cb) {
    var jsContents = file.contents.toString();
    jsContents = jsContents.replace("LoadStyle.loadTheme(ParsingHelper.getTag());","");
    jsContents = jsContents.replace('LoadStyle.loadTheme("common");',"");
    jsContents = jsContents.replace("ParsingHelper.parsingTag();","");
    var buffer = new Buffer(jsContents);
    file.contents = buffer;
    cb(null,file);

  });

  return stream;
}

// 暴露（export）插件的主函数
module.exports = gulpParsing;
