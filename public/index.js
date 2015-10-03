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
