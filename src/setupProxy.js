const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to our local Express server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // Add any custom headers if needed
        proxyReq.setHeader('Accept', 'application/json');
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ 
          error: 'Proxy error', 
          message: err.message,
          messages: [] 
        }));
      },
      // Log all proxy requests for debugging
      logLevel: 'debug'
    })
  );
  
  // Proxy requests to dhanamsit.com
  app.use(
    '/dhanamsit',
    createProxyMiddleware({
      target: 'https://dhanamsit.com',
      changeOrigin: true,
      pathRewrite: {
        '^/dhanamsit': '', // Remove /dhanamsit prefix
      },
      secure: false, // Accept self-signed certificates
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Accept', 'application/json');
        // Add any other headers required by dhanamsit.com
      },
      onError: (err, req, res) => {
        console.error('Dhanamsit proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ 
          error: 'Dhanamsit proxy error', 
          message: err.message
        }));
      },
      logLevel: 'debug'
    })
  );
};
