var dataView = require('./index.js');

var sendDataToDataView = dataView(5050);
sendDataToDataView('digraph xy { a -> b -> x -> y }');
setTimeout(function() {
    sendDataToDataView("digraph xy { a -> b -> x -> y\n b -> c }");
}, 5000);
