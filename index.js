var express = require('express'),
    path = require('path');

/* eslint no-console: 0 */

function getWriteSseData(id, data) {
    return ['id: ' + id, 'data: ' + JSON.stringify(data)].join("\n") + "\n\n";
}

module.exports = function addDotDiagramServer(port) {

    var app = express();

    var t = 0,
        resses = [],
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

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/evt', function(req, res) {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        res.write(getWriteSseData('initial', {}));

        setInterval(function() {
            eConnect('t-', '');
        }, 10000);

        var index = resses.push(res) - 1;

        if (current) {
            eConnect('e-', current );
        }

        req.on('end', function() {
            resses[index] = null;
        });

        return;
    });

    app.listen(port, function() {
        console.log("Add Dot Diagram / Visualize Listening on port " + port);
    });

    function postDotSrc(dotSrc) {
        eConnect('e-', dotSrc );
        current = dotSrc;
    }

    postDotSrc.app = app;

    return postDotSrc;

};

