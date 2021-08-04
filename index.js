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

// senior: generate a random ordering for the energy identifiers
function energy_ids(){
    let values = ["yellow", "yellow", "blue", "blue", "green", "green"];
    let colors = [];
    [1,2,3,4,5].forEach(_i => {
        let tmp = rand_int(0, values.length-1);
        colors.push(values[tmp]);
        values.splice(tmp,1);
    });

    let positions = [1,2,3,4,5,6];
    let no_id = rand_int(1,6);
    positions.splice(no_id-1, 1);

    let result = [];
    [0,1,2,3,4].forEach(i => {
        result.push({position: positions[i], color: colors[i]});
    });
    result.push({position:no_id, color:"none"});
    return result;
}

// randomize the senior board
function randomize_senior(){
    let image = document.querySelector("#field-image").contentDocument;

    // randomize the weather
    const weather_options = [
        {name:"solar", color:"yellow"},
        {name:"wind", color:"green"},
        {name:"water", color:"blue"},
    ];
    let weather = weather_options[rand_int(0,2)];
    image.querySelectorAll("#weather-wind rect,#weather-solar rect,#weather-water rect").forEach(elem => elem.style.fill = "none");
    image.querySelector(`#weather-${weather.name} rect`).style.fill = weather.color;

    // randomize the energy identifiers
    let randomized_energy_ids = energy_ids();
    randomized_energy_ids.forEach(tmp => {
        image.querySelector(`#energy-${tmp.position} rect`).style.fill = tmp.color;
    });
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

// initialiize the page for the senior layout
function init_sr(){
    // write to the global variable
    board = "senior";

    // set the blank SVG
    document.querySelector("#field-image").data = "senior_blank.svg";

    // populate the options area
    document.querySelector("#board-options").innerHTML = `<p><em>None for this field!</em></p>`;
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
        init_sr();
    };

    // callback to randomize the field
    document.querySelector("#randomize-btn").onclick = () => {
        if (board = "elem"){
            randomize_elem();
        }
        else if (board == "senior"){
            randomize_senior();
        }
    };

    init_elem();
});