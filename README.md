# Add Cool Dot Visualizations to your Projects...

Like so...

    var dataView = require('./index.js');

    var sendDataToDataView = dataView(5050); // Listen on port 5050
    sendDataToDataView('digraph x { a -> b -> x -> y }'); // Send a diagram!

