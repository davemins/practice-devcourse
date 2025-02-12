let http = require('http');
let url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        let pathname = url.parse(request.url).pathname;
        let queryData = url.parse(request.url, true).query;
        console.log(queryData.productId); // 콘솔에서 productId 값을 확인


        route(pathname, handle, response, queryData.productId);
    }
    
    http.createServer(onRequest).listen(8888);
}

exports.start = start;