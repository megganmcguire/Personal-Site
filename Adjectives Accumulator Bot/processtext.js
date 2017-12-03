
var fs = require('fs');
var rita = require('rita');
var emojiStrip = require('emoji-strip');
var text;

//assumes collect.js has produced the JSON file we analyze here
fs.readFile('collected.json', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    text = data;

    //the function that performs the necessary text analysis
    processFile();
});

//our main text analysis function
function processFile() {
    //our initial array to store manipulated data
    var bigArray = [];
    
    //create our RiTa string while stripping emojis; returns an object
    var rs = rita.RiString(emojiStrip(text));
    
    //extract text from the rs object
    var inputText = rs.text();
    
    //create an array of each individual word
    var wordsArray = inputText.split(" "); 

    // Creates an array of the chosen words according to a chosen part of speech (adj. here)
    function posGenerator(num) {
        var word = wordsArray[num];     //num is the index of the for loop on line 52
        
        // skips empty entries because RiTa cannot process empty strings
        if (word == '') {
            console.log("exception");
        } else {
            var ritaWord = rita.RiString(word);     //in order to identify part of speech, create form RiTa recognizes
            var wordPOS = ritaWord.pos();           //get the part of speech
            
            //we are limiting our results only to adjective forms, as per the PENN-tag set regular
            if (wordPOS[0] === "jj" || wordPOS[0] === 'jjs' || wordPOS[0] === 'jjr' ) {
                //push adjectives into bigArray, POS tag not necessary as we have limited types to just adj.
                bigArray.push(word.toLowerCase());
            }
        }
    }
    
    // Loop through all words in wordsArray and collect just those chosen in the function posGenerator
    for (var i = 0; i<wordsArray.length; i++) {
        posGenerator(i);
    }

    bigArray.sort(); // alphabetize so that instances of the same word are next to each other

    // Create two arrays; one has the individual instances of the words and one holds the count for each instance
    function counter() {
        var words = [];
        var count = [];
        var prev;

        for (let i = 0; i<bigArray.length;i++){
            if (bigArray[i] !== prev){
                words.push(bigArray[i]);
                count.push(1);
            } else {
                count[count.length -1]++;
            }
            prev = bigArray[i];
        }
        return [words, count];
    }

    //calling this function takes bigArray into a form with count information
    var counted = counter();

    // Now merge the two arrays in counted into an object so that words and their counts are associated
    var countedObj = {};
    for (let i=0; i<counted[0].length;i++){
        countedObj[counted[0][i]] = counted[1][i];
    }

    // Change the object back into an array for sorting purposes
    var finalArr=[];
    for (var x in countedObj){
        finalArr.push([x,countedObj[x]]);
    }

    // Now order the entries according to the word count.
    finalArr.sort(function(a, b){
        return b[1]-a[1];
        }
    );

    //output to the CLI
   console.log(finalArr);
}

