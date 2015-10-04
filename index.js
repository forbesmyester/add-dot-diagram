var http = require('http'),
    finalhandler = require('finalhandler'),
    serveStatic = require('serve-static');

function getWriteSseData(id, data) {
    return ['id: ' + id, 'data: ' + JSON.stringify(data)].join("\n") + "\n\n";
}

module.exports = function addDotDiagramServer(port) {

    var t = 0,
        resses = [],
        serve = serveStatic('public', {'index': ['index.html']}),
        current;

    function eConnect(letter, data) {
        for (var i = 0, l = resses.length; i < l; i++) {
            if (resses[i] !== null) {
                resses[i].write(
                    getWriteSseData(letter + t, data)
                );
            }
        }
    }

    http.createServer(function(req, res) {

        if (req.url == '/evt') {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            res.write(getWriteSseData('initial', {}));

            setInterval(function() {
                eConnect('t-', '');
            }, 10000);

            console.log("C: ", current);
            var index = resses.push(res) - 1;

            if (current) {
                eConnect('e-', current );
            }

            req.on('end', function() {
                resses[index] = null;
            });

            return;
        }

        var done = finalhandler(req, res);
        serve(req, res, done);

    }).listen(port);

    return function postDotSrc(dotSrc) {
        eConnect('e-', dotSrc );
        current = dotSrc;
    };

};

