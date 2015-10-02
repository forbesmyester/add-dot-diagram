var dataView = require('./index.js');

var sendDataToDataView = dataView(5050);
sendDataToDataView('digraph x { a -> b -> x -> y }');
