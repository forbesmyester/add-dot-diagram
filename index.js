var http = require('http'),
    finalhandler = require('finalhandler'),
    serveStatic = require('serve-static');

function getWriteSseData(id, data) {
    return ['id: ' + id, 'data: ' + JSON.stringify(data)].join("\n") + "\n\n";
}

module.exports = function addDotDiagramServer(port) {

    var t = 0,
        myRes,
        serve = serveStatic('public', {'index': ['index.html']}),
        current;

    function eConnect(letter, data) {
        if (myRes) {
            return myRes.write(getWriteSseData(letter + t, data));
        }
        current = data;
    }

    http.createServer(function(req, res) {

        myRes = res;

        if (req.url == '/evt') {
            myRes.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            myRes.write(getWriteSseData('initial', {}));

            setInterval(function() {
                eConnect('t-', '');
            }, 10000);

            if (current) {
                eConnect('e-', current);
            }

            return;
        }

        var done = finalhandler(req, myRes);
        serve(req, myRes, done);

    }).listen(port);

    return function postDotSrc(dotSrc) {
        eConnect('e-', dotSrc );
        current = dotSrc;
    };

};
