// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

var map;
function initMap() {
    getCurrentTabUrl((url) => {
    
        var ip = document.getElementById('ip');
        var country = document.getElementById('country');
        var city = document.getElementById('city');
        var timeZone = document.getElementById('timeZone');
        
        var xmlhttp = new XMLHttpRequest();
        var url2;
        if(url.startsWith("http") || url.startsWith("https")) {
          url2 = "https://freegeoip.net/json/"+extractHostname(url);
          printData();
        }
        else {
          var url = "https://api.ipify.org/?format=json";
          var xmlhttp2 = new XMLHttpRequest();
    
          xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
              var myArr = JSON.parse(xmlhttp2.responseText);
              url2 = "https://freegeoip.net/json/"+myArr.ip;
              printData();
            }
          };
          xmlhttp2.open("GET", url, true);
          xmlhttp2.send();
          
        }
    
        function myFunction(arr) {
          ip.innerHTML = arr.ip;
          country.innerHTML = arr.country_name;
          city.innerHTML = arr.city;
          timeZone.innerHTML = arr.time_zone;

          map = new google.maps.Map(document.getElementById('mapholder'), {
            center: {lat: arr.latitude, lng: arr.longitude},
            zoom: 8
          });
          var marker = new google.maps.Marker({
            position: {lat: arr.latitude, lng: arr.longitude},
            map: map
          });
        }
        
        function printData() {
          xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              var myArr = JSON.parse(xmlhttp.responseText);
              myFunction(myArr);
              }
           };
            xmlhttp.open("GET", url2, true);
            xmlhttp.send();
        }
      });
    
  
}


function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}
