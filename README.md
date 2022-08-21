# react-dev-inspector-enhanced

魔改 [react-dev-inspector](https://github.com/zthxxx/react-dev-inspector) 项目，支持通过点击页面添加高阶组件


## 使用

> 目前仅支持 webpack 插件

1. 配置 babel 插件
```js
const {
  override,
  addBabelPlugin,
} = require('customize-cra');

module.exports = {
  webpack: override(
    /** react-dev-inspector - babel config */
    addBabelPlugin([
      // https://github.com/zthxxx/react-dev-inspector#inspector-babel-plugin-options
      'react-dev-inspector-enhanced/plugins/babel',
      {
        excludes: [],
      },
    ]),
  ),
};

```
2. 开发环境配置 devServer 插件
```js
const {
  launchEditorMiddleware,
  ReactInspectorPlugin,
} = require('react-dev-inspector-enhanced/plugins/webpack');
const {
  override,
  overrideDevServer,
  addWebpackPlugin,
} = require('customize-cra');

module.exports = {
  webpack: override(
    /**
     * react-dev-inspector - dev server config
     * for create-react-app@^4 + webpack-dev-server@^3
     */
    addWebpackPlugin(new ReactInspectorPlugin()),
  ),

  /**
   * react-dev-inspector - dev server config
   * for create-react-app@^5 + webpack-dev-server@^4.7
   */
  devServer: overrideDevServer(serverConfig => {
    // https://webpack.js.org/configuration/dev-server/#devserversetupmiddlewares
    serverConfig.setupMiddlewares = middlewares => {
      middlewares.unshift(launchEditorMiddleware);
      return middlewares;
    };

    return serverConfig;
  }),
};

```
3. 组件上使用

```tsx
import { Inspector } from 'react-dev-inspector-enhanced';

export const HomePage = () => {
  return (
    <Inspector
      HOC={{
        name: 'Log',
        importCode: `import { Log } from './components/Log';`,
      }}
      keys={{
        gotoEditor: ['shift', 'command', 's'],
        addHOC: ['command', 'shift', 'l'],
      }}>
      <div>
        <div>
          test
        </div>
      </div>
    </Inspector>
  );
};

export default HomePage;

```


> 具体配置参考 https://github.com/hjiog/react-dev-inspector-enhanced/blob/main/examples/cra/config-overrides.js
