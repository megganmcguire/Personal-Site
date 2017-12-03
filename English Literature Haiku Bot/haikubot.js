/**
 * Created by Meggan McGuire on October 13, 2017.
 */

//requires rita.js; import relegated to html environment

/* Setup; assumes input is received via html form ====================================================*/
function onload() {
    paragraph = document.getElementById('paragraph');
}

/*To create the haiku structure, within Markov generated sentences we will locate connected chunks of words that have 
the necessary number of syllables (i.e., we do not simply take words from random locations in the text).  
To do this we will act on an array of objects with "syllable:word" pairs and return start and end indices 
that sum to the num parameter (note: num is the desired syllable count)*/
function syllableCounter(num, array){
    var begin;
    var end;
    var count = 0;
    
    //we have two for loops.  This first loop governs the start index
    for (let i = 0; i<array.length; i++){
        count = Number(Object.keys(array[i])[0]);
        
        //edge case for a polysyllabic word that matches the desired syllable count
        if (count == num){
            begin = i;
            end = i;
            return [begin, end];
        }
        
        //second loop that will look for an appropriate end index, if it exists
        for (let j=i+1;j<array.length; j++ ){
            count += Number(Object.keys(array[j])[0]);
            if (count == num){
                begin = i;
                end = j;
                return [begin, end];
            }
            if (count > num){
                break;
            }
        }
    }
    return "none";     //while unlikely, we want to ensure that we return a string
}

//based on the start and end indices given by syllableCounter, produce the words associated
function sentenceGenerator(b, e, array) {
    var temp = "";
    for (let i = b; i <= e; i++) {
        temp += Object.values(array[i])[0] + " ";
    }
    array.splice(b, e-b+1);

    return temp;
}


/*a function to clean up all punctuation and numbers, for the generated sentences.
This is necessary for how we RiTa measures syllables, in our context*/
function cleanText(arg) {
    var temp = arg.replace(/[.,\/#!$%^&*;:?"“”{}\[\]=\-_`~()]/g," ");
    temp = temp.replace(/[’'‘]/g, "");
    temp = temp.replace(/[0-9]/g, "");
    return temp;
}

//the final result that will be pushed to the html environment
var haikuResult = "";


//main function that pulls the pieces together
function haikuGenerator(arg) {

    //establish the RiTa Markov environment
    var rm = new RiMarkov(6);
    rm.loadText(arg);

    //create our model text with 10 generated sentences, returns an array
    var model = rm.generateSentences(10);

    //convert array into a solid string
    var modelString = "";
    for (let j=0; j< model.length; j++ ) {
        modelString += model[j];
    }

    //standardize generated text
    var modelLower = modelString.toLowerCase();
    var modelCleaned = cleanText(modelLower);

    //now split the text to allow for looping through and measuring syllables on each word
    var modelSplit = modelCleaned.split(" ");
    var syllables = [];

    //this will populate the array with the syllable word pairs
    for (let i = 0; i < modelSplit.length; i++) {
        if (modelSplit[i] !== "") {
            var syl = RiTa.getSyllables(modelSplit[i]);
            var sylCount = syl.split("/").length;
            var obj = {};
            obj[sylCount] = modelSplit[i];
            syllables.push(obj);
        }
    }

    //the following generates the 3 lines of the haiku and passes them into haikuResult
    var beginEnd1 = syllableCounter(5, syllables);
    var line1 = sentenceGenerator(beginEnd1[0], beginEnd1[1], syllables);
    var beginEnd2 = syllableCounter(7, syllables);
    var line2 = sentenceGenerator(beginEnd2[0], beginEnd2[1], syllables);
    var beginEnd3 = syllableCounter(5, syllables);
    var line3 = sentenceGenerator(beginEnd3[0], beginEnd3[1], syllables);

    //final formatting for the html environment
    haikuResult = line1 + "<br>" + line2 + "<br>" + line3 + "<br>" + "<br>" ;
}

function populate() {
    var input = paragraph.value;
    haikuGenerator(input);

    $('#results').append(haikuResult);
}
