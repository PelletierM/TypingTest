const path = require('path')

module.exports = {
    entry: './app_package/static/ts/index.ts',
    resolve: {
        extensions: ['.ts', '.types.ts', '.js']
    },
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'app_package/static/ts')]
            }
        ]
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'app_package/static/gen')
    }
}