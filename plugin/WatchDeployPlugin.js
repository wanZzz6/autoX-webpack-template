const http = require('http');
const path = require('path');
class WatchDeployPlugin {
  constructor(options = {}) {
    this.options = options;
    this.changFile = undefined;
  }

  apply(compiler) {
    if (this.options.type == null || this.options.type === 'none') {
      console.error('未开启自动上传');
    }

    compiler.hooks.done.tap('WatchDeployPlugin', (stats) => {
      const outProjectPath = compiler.outputPath;
      const outFilePath = path.resolve(compiler.outputPath, Object.keys(compiler.options.entry)[0] + '.js');

      switch (this.options.type) {
        case 'deploy':
          this.sendCmd('save', '/' + outProjectPath);
          break;
        case 'rerun':
          this.sendCmd('rerun', '/' + outFilePath);
          break;
        default:
          console.error('重新编译后,不进行任何操作');
          break;
      }
    });
  }

  sendCmd(cmd, path) {
    console.error('执行命令：', cmd, path);
    path = encodeURI(path);
    const req = http.get('http://127.0.0.1:9317/exec?cmd=' + cmd + '&path=' + path, (res) => {
      res.setEncoding('utf8');
      res
        .on('data', (data) => {
          console.error('[Replay]', data);
        })
        .on('error', () => {
          console.error('返回数据错误');
        });
    });
    req.on('error', function (err) {
      console.error('watch模式，自动' + cmd + '失败,autox.js服务未启动');
      console.error('请使用 ctrl+shift+p 快捷键，启动auto.js服务');
    });
  }
}
module.exports = WatchDeployPlugin;
