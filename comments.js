// Create a web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');
var comments = [];

var server = http.createServer(function(req, res) {
    // Get the file path
    var pathname = url.parse(req.url).pathname;
    // Get the file extension
    var extname = path.extname(pathname);
    // Get the file path
    var filePath = path.join(__dirname, pathname);
    // Get the file content type
    var contentType = getContentType(extname);

    if (pathname === '/submit') {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            var comment = qs.parse(data).comment;
            comments.push(comment);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        });

        return;
    }

    if (pathname === '/getComments') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(comments));
        return;
    }

    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
            res.end('<h1>404 Not Found</h1>');
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(data);
        }
    });
});

server.listen(3000, function() {
        console.log('Server is running at http://localhost:3000');
    });