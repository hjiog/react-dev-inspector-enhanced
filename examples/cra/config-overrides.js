const {
  launchEditorMiddleware,
  addLogMiddleware,
  ReactInspectorPlugin,
} = require('react-dev-inspector-enhanced/plugins/webpack');
const {
  override,
  overrideDevServer,
  addBabelPlugin,
  addWebpackPlugin,
} = require('customize-cra');

/**
 * origin config:
 *   https://github.com/facebook/create-react-app/blob/v5.0.1/packages/react-scripts/config/webpack.config.js
 *   https://github.com/facebook/create-react-app/blob/v5.0.1/packages/react-scripts/config/webpackDevServer.config.js
 *
 * customize-cra api code: https://github.com/arackaf/customize-cra
 */
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
      middlewares.unshift(addLogMiddleware);
      return middlewares;
    };

    return serverConfig;
  }),
};
