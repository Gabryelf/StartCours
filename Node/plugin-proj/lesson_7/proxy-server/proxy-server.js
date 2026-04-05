const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((clientReq, clientRes) => {
    console.log(`📨 ${clientReq.method} ${clientReq.url}`);
    
    let targetUrl = clientReq.url;
    
    // Убираем первый слеш
    if (targetUrl.startsWith('/')) {
        targetUrl = targetUrl.slice(1);
    }
    
    // Если нет протокола, добавляем http://
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'http://' + targetUrl;
    }
    
    console.log(`🎯 Target: ${targetUrl}`);
    
    const parsedUrl = new URL(targetUrl);
    const isHttps = parsedUrl.protocol === 'https:';
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: clientReq.method,
        headers: clientReq.headers
    };
    
    // Убираем заголовок proxy-connection
    delete options.headers['proxy-connection'];
    
    const protocol = isHttps ? https : http;
    
    const proxyReq = protocol.request(options, (proxyRes) => {
        console.log(`✅ Response: ${proxyRes.statusCode}`);
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
    });
    
    proxyReq.on('error', (err) => {
        console.error(`❌ Error: ${err.message}`);
        clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
        clientRes.end(`Proxy Error: ${err.message}\n\nTarget: ${targetUrl}`);
    });
    
    clientReq.pipe(proxyReq);
});

const PORT = 8080;
server.listen(PORT, '127.0.0.1', () => {
    console.log(`✅ Proxy server running on http://127.0.0.1:${PORT}`);
    console.log(`🌐 Test: http://127.0.0.1:${PORT}/https://httpbin.org/ip`);
});