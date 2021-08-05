import path from 'path';

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        resolve: {
            alias : {
                "icons": path.resolve(__dirname, "node_modules/vue-material-design-icons"),
                '@': __dirname + '../..src/'
            },
            extensions: [
                ".vue"
            ]
        }
    }
}