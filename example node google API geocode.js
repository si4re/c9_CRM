const https = require('https');
var address = "Москва ул. Медиков 28";

var URL = "https://maps.google.com/maps/api/geocode/json?address=";
var key = "&key=AIzaSyA60pl7nin99-KeyAFHagTr3_ytn-fCndM";
var encodeURL = encodeURI('Россия' + address);


https.get(URL + encodeURL + key, (res) => {
    var body = '';
    var lat, lng;

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(body);

            if (response.status == 'ZERO_RESULTS') { // address not found

            } // end if ZERO_RESULTS

            if (response.status == 'OK') {
                console.log("lat " + response.results[0].geometry.location.lat);
                console.log("lng " + response.results[0].geometry.location.lng);
            } // end if OK
            else { console.log("error reading coordinates from Google API"); } // catch other errors


        } catch (e) {
            console.error(e.message);
        }

    });

}).on('error', (e) => { // catch error res.on(end)
    console.error(e);
});