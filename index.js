// global to keep track of the board to be randomized (elem, junior, or senior)
var board = "elem";

// returns a random integer from min to max (inclusive)
function rand_int(min, max){
    return Math.floor(min + (Math.random()*(max+1)));
}

// Elememtary: choose 3 random locations to be populated with broken bulbs
function bulb_seq(){
    let values = ["1", "2", "3", "4", "5", "6"];
    let result = [];
    [1,2,3].forEach(_i => {
        let tmp = rand_int(0, values.length-1);
        result.push(values[tmp]);
        values.splice(tmp,1);
    });
    return {"red":result.sort(), "yellow":values.sort()};
}

// randomize the elementary board
function randomize_elem(){
    let image = document.querySelector("#field-image").contentDocument;
    
    // randomize the lightbulbs
    let bulbs = bulb_seq();
    bulbs.red.forEach(n => {
        image.querySelector(`#bulb-${n} rect`).style.fill = "red";
    });
    bulbs.yellow.forEach(n => {
        image.querySelector(`#bulb-${n} rect`).style.fill = "yellow";
    });

    // randomize the sun
    let sun = rand_int(0,1);
    if (sun == 0){ //top
        image.querySelector("#sun-top rect").style.fill = "yellow";
        image.querySelector("#sun-bottom rect").style.fill = "none";
    }
    else{ //bottom
        image.querySelector("#sun-top rect").style.fill = "none";
        image.querySelector("#sun-bottom rect").style.fill = "yellow";
    }
}

// initialize the page for the elementary layout
function init_elem(){
    // write to the global variable
    board = "elem";

    // set the blank SVG
    document.querySelector("#field-image").data = "elementary_blank.svg";

    // populate the options area, including callbacks
    document.querySelector("#board-options").innerHTML = `<div class="btn-group w-100 mb-3" role="group">
        <span class="input-group-text">Barriers: </span>
        <input type="radio" class="btn-check" name="elem-barrier" id="elem-barrier-top">
        <label class="btn btn-outline-primary" for="elem-barrier-top">Top</label>

        <input type="radio" class="btn-check" name="elem-barrier" id="elem-barrier-bottom">
        <label class="btn btn-outline-primary" for="elem-barrier-bottom">Bottom</label>
        </div>`;
    document.querySelector("#elem-barrier-top").onclick = () => {
        let image = document.querySelector("#field-image").contentDocument;
        image.querySelector("#barrier-top rect").style.fill = "blue";
        image.querySelector("#barrier-bottom rect").style.fill = "none";
    };
    document.querySelector("#elem-barrier-bottom").onclick = () => {
        let image = document.querySelector("#field-image").contentDocument;
        image.querySelector("#barrier-top rect").style.fill = "none";
        image.querySelector("#barrier-bottom rect").style.fill = "blue";
    };
}


document.addEventListener("DOMContentLoaded", () => {
    // callbacks to change between the fields
    document.querySelector("#field-elem").onclick = () => {
        init_elem();
    };
    document.querySelector("#field-jr").onclick = () => {
        board = "junior";
        document.querySelector("#field-image").data = "junior_blank.svg";
    };
    document.querySelector("#field-sr").onclick = () => {
        board = "senior";
        document.querySelector("#field-image").data = "senior_blank.svg";
    };

    // callback to randomize the field
    document.querySelector("#randomize-btn").onclick = () => {
        if (board = "elem"){
            randomize_elem();
        }
    };

    init_elem();
});