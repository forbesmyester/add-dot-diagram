var evtSource = new EventSource("/evt");

evtSource.onmessage = function(evt) {
    if (evt.lastEventId.match(/^[^e].*/)) { return; }
    try {
        document.getElementById("diagram").innerHTML = Viz(
            JSON.parse(evt.data),
            "svg"
        );
    } catch (e) {
        /* eslint no-console: 0 */
        console.log("ERROR: ", e);
    }
};

$(document).ready(function() {
    $("#diagram").delegate('g [id]', 'click', function() {
        var id = $(this).attr('id');
        fetch('/dot-diagram-id-click/' + id)
            .then(function(resp) {
                return Promise.all([resp.ok, resp.json()]);
            })
            .then(function(data) {
                var ok = data[0],
                    json = data[1];

                if (!ok) {
                    return alert("Error getting data for element " + id);
                }
                alert(JSON.stringify(json, null, "    "));
            });
    });
});
