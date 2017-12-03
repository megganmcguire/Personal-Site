/**
 * Created by Meggan McGuire on October 13, 2017.
 */

//requires rita.js; import relegated to html environment

/* Setup; assumes input is received via html form ====================================================*/
function onload() {
    paragraph = document.getElementById('paragraph');
    resultsCount = document.getElementById('resultsCount')
}

/* Frequency Counter =================================================================================*/

//some quick formatting adjustments (recall stop words are common words, e.g., the)
var args = {
    ignoreCase: true,
    ignoreStopWords : true,
    ignorePunctuation: true
};

//global variable to which we will push results of the main function frequencyCounter
var countedList;

//our main function
function frequencyCounter(arg, count){
    var concordObj = RiTa.concordance(arg, args);  //this produces an object

    var concordArray = [];  //populate in order to sort

    //push to the the array
    for (var x in concordObj) {
        concordArray.push([x, concordObj[x]]);
    }

    //sort the array
    concordArray.sort(function(a, b) {
        return b[1] - a[1];
    });

    //only keep the first x results; count is based on user input from html
    if(concordArray.length >= count){
        concordArray = concordArray.slice(0, count);
    }

    //create a string that is in the desired format
    var concordString = "";
    for (let i = 0; i<concordArray.length; i++){
        concordString += concordArray[i][0] + " : " + concordArray[i][1] + "<br>";
    }

    countedList = concordString;
}


//take the above results and plug back into the associated html page
function populate() {
    var input = paragraph.value;
    var countInput = resultsCount.value;
    frequencyCounter(input, countInput);

    countedList = "<p>" + countedList + "</p>";

    $('#results').append(countedList);
}

//for the html's clear button
function clearDiv() {
    $('#results').empty();
    countedList = "";
    $('#paragraph').val("");
}


