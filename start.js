
// 整个项目的入口 启动文件

require('babel-core/register')({
    'presets':[
        'stage-3',
        'latest-node'
    ]
})

require('babel-polyfill')

require('./server')