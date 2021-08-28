// 该服务为 vercel serve跨域处理
const {
    createProxyMiddleware
} = require('http-proxy-middleware')

function req(proxyReq, req, res) {
    // 将本地请求的头信息复制一遍给代理。
    // 包含cookie信息，这样就能用登录后的cookie请求相关资源
    Object.keys(req.headers).forEach(function(key) {
            proxyReq.setHeader(key, req.headers[key])
        })
        // 代理的host 设置成被代理服务的，解决跨域访问
    proxyReq.setHeader('Host', host)
}

function res(proxyRes, req, res) {
    // 将服务器返回的头信息，复制一遍给本地请求的响应。
    // 这样就能实现 执行完登录后，本地的返回请求中也有相关cookie，从而实现登录功能代理。
    Object.keys(proxyRes.headers).forEach(function(key) {
        res.append(key, proxyRes.headers[key])
    })
}

module.exports = (req, res) => {
        let target = 'https://vjudge.net/'
            // 创建代理对象并转发请求
        createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: {},
            onProxyReq: req,
            onProxyRes: res
        })(req, res)
    }
    /*
    {
      "rewrites": [
        {
          "source": "/backend/(.*)",
          "destination": "/api/proxy"
        }
      ]
    }


    {
    "version": 2,
    "routes": [
        { "src": "/(.*)", "dest": "https://vjudge.net/$1" }
    ]
}
    */