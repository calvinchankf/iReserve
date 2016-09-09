var request = require("request");
var notifier = require('node-notifier');

var stores = {
  'R499': 'Canton Road',
  'R409': 'Causeway Bay',
  'R485': 'Festival Walk',
  'R428': 'ifc mall',
  'R610': 'New Town Plaza'
}

var targets = {
  'MN4L2ZP/A': '5.5吋 亮黑色 256GB',
  'MN4D2ZP/A': '5.5吋 亮黑色 128GB'
};

function getAvailability(callback) {
  // web https://reserve-hk.apple.com/HK/en_HK/reserve/iPhone/availability
  request('https://reserve-hk.apple.com/HK/en_HK/reserve/iPhone/availability.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body) // Show the HTML for the Google homepage.
      if (body) {
        var today = new Date();
        var hour = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();
        console.log('availability at:'+hour+':'+min+':'+sec);
        var body = JSON.parse(body);
        for (var childOfRoot in body) {
          if (stores[childOfRoot] != undefined) {
            for (var key in targets) {
              var storage =  body[childOfRoot][key];
              if (storage == 'ALL') {
                notify(targets[key], stores[childOfRoot]);
                console.log(targets[key] + ' at ' + stores[childOfRoot]);
              }
            }
          }
        }
        callback();
      } else {
        console.log('fail get availability');
        callback();
      }
    }
  });
}

function notify(device, store) {
  var notifier = require('node-notifier');
  notifier.notify({
    'title': device,
    'message': store,
    'sound': 'Ping'
  });
}

function infinteLoop() {
  setTimeout(function(){
    getAvailability(function() {
      infinteLoop();
    });
  }, 3000);
}

// getAvailability();
infinteLoop();

notify('start', 'nothing');
