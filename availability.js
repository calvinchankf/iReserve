var request = require("request");
var notifier = require('node-notifier');

var stores = {
  'R499': 'Canton Road',
  'R409': 'Causeway Bay',
  'R485': 'Festival Walk',
  'R428': 'ifc mall'
}

var targets = {
  // 'MKU82ZP/A': '6s+ gold 64',
  'MKU92ZP/A': '6s+ pink 64',
  // 'MKUF2ZP/A': '6s+ gold 128',
  'MKUG2ZP/A': '6s+ pink 128'
};

function getAvailability(callback) {
  request('https://reserve.cdn-apple.com/HK/zh_HK/reserve/iPhone/availability.json', function (error, response, body) {
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
