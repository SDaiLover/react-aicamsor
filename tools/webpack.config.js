module.exports = (distRoot, optimize) => ({
    mode: 'production',
    optimization: {
      minimize: !!optimize,
    },
    entry: './src/index.ts',
    output: {
      path: distRoot,
      filename: optimize ? 'sdailover.react-aicamsor.min.js' : 'sdailover.react-aicamsor.js',
      library: 'SDaiLoverReactAICamsor',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              envName: `dist-${optimize ? 'prod' : 'dev'}`,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
});