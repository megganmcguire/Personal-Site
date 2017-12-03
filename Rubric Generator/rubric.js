/**
 * Created by Meggan McGuire on September 30, 2017.
 */

/* Setup; assumes input is received via html form ====================================================*/
function onload() {
    assignment = document.getElementById('assignment');
    student = document.getElementById('student');
    additional = document.getElementById('addcomments');
}

/* Setup functions that check selection and return appropriate value =================================*/

/*main check on which button is selected.  Loops through each button and returns the value of the active one
radio button group ensures selection is unique*/
function checkRadio(name) {
    for (var i = 1; i < 6; i++) {
        if (document.getElementById(name + i).checked){
            return document.getElementById(name + i).value;     //returns a string with the relevant comment
        }
    }
    return "";      //edge case if button group is skipped and none are active
}

//performs a similar check in order to apply class to the printable rubric
function applyClass(name) {
    for (var i = 1; i < 6; i++) {
        if (document.getElementById(name + i).checked){
            $('#'+name + "Alt" + i).parent().addClass('active');
        }
    }
    return "";
}

//special case for Misreading, as it only has 3 options
function specialcheckRadio(name) {
    for (var i = 1; i < 4; i++) {
        if (document.getElementById(name + i).checked){
            return document.getElementById(name + i).value;
        }
    }
    return "";
}

//special case for Misreading, as it only has 3 options
function specialapplyClass(name) {
    for (var i = 1; i < 4; i++) {
        if (document.getElementById(name + i).checked){
            $('#'+name + "Alt" + i).parent().addClass('active');
        }
    }
    return "";
}

/*Synthesis is an optional button for multi-source papers.  This checks if it is active and 
shows the associated div.  */
function synthToggle(){
    $('#synthAlt').collapse('toggle');
}

/*because the synthesis div affects printing format, this injects a page break if synthesis
is active*/
function checkSynth(){
    for (var i = 1; i < 6; i++) {
        if (document.getElementById('synthesis' + i).checked){
            $('#synth').addClass('page');
            $('#evi').addClass('top-marg');
            return;
        }
    }
    $('#sent').addClass('top-marg');
}

//main function that activates all of the pieces
function populate() {
    var assignment_text = assignment.value;
    var student_text = student.value;
    var additional_text = additional.value;
    
    /*the comments section is a string to which we will add all of the comment values from button selections.
    This creates a paragraph format, helping readability*/
    var comments = "";
    comments = comments.concat(specialcheckRadio("misreading"));
    comments = comments.concat(checkRadio("thesis"));
    comments = comments.concat(checkRadio("overorg"));
    comments = comments.concat(checkRadio("parorg"));
    comments = comments.concat(checkRadio("topicsent"));
    comments = comments.concat(checkRadio("analysis"));
    comments = comments.concat(checkRadio("synthesis"));
    comments = comments.concat(checkRadio("evidence"));
    comments = comments.concat(checkRadio("transitions"));
    comments = comments.concat(checkRadio("sentclar"));
    comments = comments.concat(checkRadio("spellproof"));

    comments = comments.concat(additional_text);

    //activate the buttons for the printable version for student view
    specialapplyClass("misreading");
    applyClass("thesis");
    applyClass("overorg");
    applyClass("parorg");
    applyClass("topicsent");
    applyClass("analysis");
    applyClass("synthesis");
    applyClass("evidence");
    applyClass("transitions");
    applyClass("sentclar");
    applyClass("spellproof");


    //place the above into the html environment
    $('#assignmentHome').append(assignment_text);
    $('#studentHome').append(student_text);
    $('#commentsHome').append(comments);

    checkSynth();

    $('#resultArea').collapse('toggle');
}


