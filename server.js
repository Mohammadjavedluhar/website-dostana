const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ADMIN_PASSWORD = 'dostana2026';
const ADMIN_TOKEN = 'dostana-admin-token-2026';

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

// Helper to read request body
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => { resolve(body); });
        req.on('error', (err) => { reject(err); });
    });
};

// Helper to send JSON responses
const sendJson = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

// Helper to check admin authorization
const isAdminAuthorized = (req) => {
    const authHeader = req.headers['authorization'];
    return authHeader === `Bearer ${ADMIN_TOKEN}`;
};

const server = http.createServer(async (req, res) => {
    // Decodes URL (to handle spaces/special characters) and removes query strings
    const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
    
    // --- API ROUTES ---
    
    // 1. Admin Login
    if (decodedUrl === '/api/login' && req.method === 'POST') {
        try {
            const body = await getRequestBody(req);
            const { username, password } = JSON.parse(body);
            if (username === 'admin' && password === ADMIN_PASSWORD) {
                return sendJson(res, 200, { success: true, token: ADMIN_TOKEN });
            } else {
                return sendJson(res, 401, { success: false, message: 'गलत यूजरनेम या पासवर्ड!' });
            }
        } catch (error) {
            return sendJson(res, 400, { success: false, message: 'अवैध अनुरोध!' });
        }
    }
    
    // 2. Products API
    if (decodedUrl === '/api/products') {
        const filePath = path.join(__dirname, 'data', 'products.json');
        
        if (req.method === 'GET') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return sendJson(res, 500, { error: 'Failed to read products' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
            return;
        }
        
        if (req.method === 'POST') {
            if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
            try {
                const body = await getRequestBody(req);
                const newProduct = JSON.parse(body);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    let products = [];
                    if (!err && data) products = JSON.parse(data);
                    products.push(newProduct);
                    fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) return sendJson(res, 500, { error: 'Failed to save product' });
                        sendJson(res, 201, { success: true, product: newProduct });
                    });
                });
            } catch (e) {
                sendJson(res, 400, { error: 'Invalid data' });
            }
            return;
        }
    }
    
    // PUT /api/products/:id and DELETE /api/products/:id
    if (decodedUrl.startsWith('/api/products/')) {
        const productId = decodedUrl.replace('/api/products/', '');
        const filePath = path.join(__dirname, 'data', 'products.json');
        
        if (req.method === 'PUT') {
            if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
            try {
                const body = await getRequestBody(req);
                const updatedProduct = JSON.parse(body);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) return sendJson(res, 500, { error: 'Failed to read products' });
                    let products = JSON.parse(data);
                    const index = products.findIndex(p => p.id === productId);
                    if (index === -1) return sendJson(res, 404, { error: 'Product not found' });
                    products[index] = { ...products[index], ...updatedProduct };
                    fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) return sendJson(res, 500, { error: 'Failed to update product' });
                        sendJson(res, 200, { success: true, product: products[index] });
                    });
                });
            } catch (e) {
                sendJson(res, 400, { error: 'Invalid data' });
            }
            return;
        }
        
        if (req.method === 'DELETE') {
            if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return sendJson(res, 500, { error: 'Failed to read products' });
                let products = JSON.parse(data);
                const filteredProducts = products.filter(p => p.id !== productId);
                if (products.length === filteredProducts.length) return sendJson(res, 404, { error: 'Product not found' });
                fs.writeFile(filePath, JSON.stringify(filteredProducts, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) return sendJson(res, 500, { error: 'Failed to delete product' });
                    sendJson(res, 200, { success: true });
                });
            });
            return;
        }
    }
    
    // 3. Gallery API
    if (decodedUrl === '/api/gallery') {
        const filePath = path.join(__dirname, 'data', 'gallery.json');
        
        if (req.method === 'GET') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return sendJson(res, 500, { error: 'Failed to read gallery' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
            return;
        }
        
        if (req.method === 'POST') {
            if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
            try {
                const body = await getRequestBody(req);
                const newGalleryItem = JSON.parse(body);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    let gallery = [];
                    if (!err && data) gallery = JSON.parse(data);
                    gallery.push(newGalleryItem);
                    fs.writeFile(filePath, JSON.stringify(gallery, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) return sendJson(res, 500, { error: 'Failed to save gallery item' });
                        sendJson(res, 201, { success: true, item: newGalleryItem });
                    });
                });
            } catch (e) {
                sendJson(res, 400, { error: 'Invalid data' });
            }
            return;
        }
    }
    
    if (decodedUrl.startsWith('/api/gallery/')) {
        const itemId = decodedUrl.replace('/api/gallery/', '');
        const filePath = path.join(__dirname, 'data', 'gallery.json');
        
        if (req.method === 'DELETE') {
            if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return sendJson(res, 500, { error: 'Failed to read gallery' });
                let gallery = JSON.parse(data);
                const filteredGallery = gallery.filter(g => g.id !== itemId);
                if (gallery.length === filteredGallery.length) return sendJson(res, 404, { error: 'Item not found' });
                fs.writeFile(filePath, JSON.stringify(filteredGallery, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) return sendJson(res, 500, { error: 'Failed to delete gallery item' });
                    sendJson(res, 200, { success: true });
                });
            });
            return;
        }
    }
    
    // 4. File Upload API (base64)
    if (decodedUrl === '/api/upload' && req.method === 'POST') {
        if (!isAdminAuthorized(req)) return sendJson(res, 401, { error: 'Unauthorized' });
        try {
            const body = await getRequestBody(req);
            const { fileName, fileData } = JSON.parse(body);
            const base64Data = fileData.split(';base64,').pop();
            const uploadDir = path.join(__dirname, 'images');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            
            const targetPath = path.join(uploadDir, fileName);
            fs.writeFile(targetPath, base64Data, { encoding: 'base64' }, (err) => {
                if (err) return sendJson(res, 500, { error: 'Failed to write file' });
                sendJson(res, 200, { success: true, filePath: `images/${fileName}` });
            });
        } catch (e) {
            sendJson(res, 400, { error: 'Invalid upload data' });
        }
        return;
    }
    
    // --- STATIC FILES SERVICE ---
    let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
    const ext = path.extname(filePath);
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
