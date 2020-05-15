module.exports = {
    publicPath: "./",
    devServer: {
        port: 8080 // 端口号
    },
    lintOnSave: false, //关闭eslint警告
    css: {
        loaderOptions: {
            css: {
                // options here will be passed to css-loader
            },
            postcss: {
                // options here will be passed to postcss-loader
                plugins: [require('postcss-px2rem')({
                    remUnit: 192
                })]
            }
        }
    }
};
