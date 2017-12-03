var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);


//Collect tweets and write to a JSON file
T.get('search/tweets', { q: 'someQueryTerm since:2017-12-01', count: 499 }, function(err, data, response) {
    //extract status from the data result; this is an array of objects
    var tweets = data.statuses;
    
    var result = "";

    //loop through and extract the text property from each status
    for (var i=0; i<tweets.length; i++){
        result += tweets[i].text;
    }
    
    //write to a JSON file
    var fs = require('fs');
    var json = JSON.stringify(result, null, 2);
    json = json.replace(/[.,-\/#!$%^&*;":{}\\=\-_`~()@+?><\[\]+]/g, '');
    json= json.replace(/\s{2,}/g, ' ');
    fs.writeFile("collected.json", json);
});




