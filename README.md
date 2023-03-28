# autox-template-default

修改自

- <https://github.com/kkevsekk1/webpack-autojs>
- <https://github.com/molysama/auto.pro>

## 使用说明

### 安装

克隆本项目并，在本项目的根目录（与本文文件同一目录）下执行`npm install --registry=https://registry.npm.taobao.org`

### 配置

>更多信息请参考：<http://auto.moly.host/index.html#/>

默认以`src/index.js`文件为源码入口，其将被编译为`dist/app.js`。此`dist/app.js`既能以单脚本方式运行，也能以项目方式运行。
以下是一些可能用到的配置项：

- 项目主入口  
    `project.json -> main` 可以指定项目主入口，当使用`运行项目`指令，或以项目方式打包成 APK 时，将执行该文件。本模板默认使用`dist/app.js`为项目主入口。

- 源码入口和出口  
    入口默认为`src/index.js`，其将被编译为出口文件`dist/app.js`，可以在`webpack.config.js -> config -> entry`里进行配置，以默认模板为例，`app`就是出口文件名，`./src/index.js`就是入口路径。可以添加多个键值对来生成多个出口，但是只有第一个出口文件会自动上传到手机运行。

```javascript
// webpack.config.js
const config = {
    entry: {
        app: "./src/index.js",
        // custom1: './src/xxx.js'
        // custom2: './src/xxxx.js'
    }
```

- UI 模式  
    如果需要使用 UI 模式，需要在`webpack.config.js -> compilePlugin -> ui`数组里指定，文件名应与出口文件名一致。  
    如，上方示例的出口文件名为`app`，则在`ui`数组里填`app`即可将其设为 UI 模式。

- AES 加密  
    为了保证热更新的文件传输安全，常常需要使用 AES 加密源码，在`webpack.config.js -> compilePlugin`里设置`encode: {key: 16位密钥}`就会将出口文件以`AES/ECB/PKCS7padding`方式进行加密，解密时可参考以下代码

```javascript
var source = $crypto.decrypt(
    files.read("dist/app.js", "utf8"),
    new $crypto.Key(你的密钥),
    "AES/ECB/PKCS7padding",
    {
        input: "base64",
        output: "string",
    }
)
files.write("dist/main.js", source)
```

- 出口类型  
    默认使用`var`输出类型，此类型可直接以单脚本或项目主入口方式启动，但是无法被其他 JS 文件引用（也就是无法 require）。如果你希望出口文件能被引用，比如制作自己的通用模块，可以将`webpack.config.js -> output -> libraryTarget`设为`commonjs2`。

### 编译

- 开发模式  
    执行`npm run start` 会以开发模式进行编译，此模式将一直监听`src`目录下的文件修改，并即时生成新的编译文件，静态文件会直接复制到 `dist` 目录。
- 生产模式  
    执行`npm run build`会以生产模式进行编译，得到一份压缩、混淆处理后的编译文件，此模式不会对`src`进行修改监听。

### 运行

首先确保 vscode 安装了 [Auto.js-Autox.js-VSCodeExt](https://marketplace.visualstudio.com/items?itemName=aaroncheng.auto-js-vsce-fixed) 插件，然后按下 `Ctrl+Alt+P` ，输入 `autox`，选择"开启服务"，然后将手机端 autoX 链接到此电脑。  
在开发模式下，`src` 下文件发生变动后会自动根据webpack的配置自动编译，纯js\ts代码文件在webpack里配置部署类型为 `rerun`，可自动在手机端运行；若项目依赖非代码的静态文件，比如图片，则需要设置部署类型为 `deploy`，项目编译完成后会自动上传到手机，然后手动点击以项目方式运行。
生成模式下，可在`dist` 目录的 app.js 上右键"重新运行" 或者将整个dist 文件夹上传到手机以项目的方式运行。

## LICENSE

MIT.
