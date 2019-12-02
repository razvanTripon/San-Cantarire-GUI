// {
//     "/api": {
//         "target": "http://localhost:3000",
//         "secure": false,
// 		"timeout": 0,
// 		"compress": false,
// 		"logLevel": "debug",
// 		"changeOrigin": true
//     }
// }

const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/log",
        ],
        target: "http://localhost:3000",
        secure: false,
        timeout:0,
        compress:true,
        changeOrigin:true
    }
]

module.exports = PROXY_CONFIG;