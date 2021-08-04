// global to keep track of the board to be randomized (elem, junior, or senior)
var board;

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

// junior: generate a random ordering of waiting cars in the lane
function lane_seq(){
    let values = ["red", "red", "blue", "blue", "green", "green"];
    let result = [];
    [1,2,3,4,5,6].forEach(_i => {
        let tmp = rand_int(0, values.length-1);
        result.push(values[tmp]);
        values.splice(tmp,1);
    });
    return result;
}

// junior: generate locations for the two pillars
function pillar_locs(){
    let barriers = [];
    let empty = [];
    [1,2,3].forEach(i => {
        let tmp = rand_int(0,1);
        barriers.push(`${i}${tmp==0?"a":"b"}`);
        empty.push(`${i}${tmp==0?"b":"a"}`);
    });
    return {"populated":barriers, "empty":empty};
}

// removes from a1 any items that are also in a2
function array_sub(a1, a2){
    let result = a1;
    a2.forEach(elem => {
        if (result.includes(elem)){
            result.splice(result.indexOf(elem), 1);
        }
    });
    return result;
}

// junior: generate locations for the two barriers
function barrier_locs(){
    let available_spaces = ["r1", "r2", "r3", "r4", "g1", "g2", "g3", "g4", "b1", "b2", "b3", "b4"];

    // get the space names with parked cars and remove them from the list – they can't have barriers in front of them
    let occupied_spaces = [
        document.querySelector("#red-parked-car").value,
        document.querySelector("#blue-parked-car").value,
        document.querySelector("#green-parked-car").value
    ];
    available_spaces = array_sub(available_spaces, occupied_spaces);

    // console.log(available_spaces);

    // choose a location for the first barrier (any available space)
    let loc1_id = rand_int(0, available_spaces.length-1);
    let loc1 = available_spaces[loc1_id];
    available_spaces.splice(loc1_id, 1);

    // now we can eliminate some additional spaces - both barriers can't be in the same row or in front of the same color space
    switch (loc1[0]){ // same color 
        case "r":
            available_spaces = array_sub(available_spaces, ["r1", "r2", "r3", "r4"]);
        break;
        case "g":
            available_spaces = array_sub(available_spaces, ["g1", "g2", "g3", "g4"]);
        break;
        case "b":
            available_spaces = array_sub(available_spaces, ["b1", "b2", "b3", "b4"]);
        break;
    }

    switch (loc1){ // same row
        case "r1":
        case "r2":
        case "g1":
        case "b1":
            available_spaces = array_sub(available_spaces, ["r1", "r2", "g1", "b1"]);
        break;
        case "g2":
        case "r3":
        case "g3":
        case "b2":
            available_spaces = array_sub(available_spaces, ["g2", "r3", "g3", "b2"]);
        break;
        case "b3":
        case "b4":
        case "r4":
        case "g4":
            available_spaces = array_sub(available_spaces, ["b3", "b4", "r4", "g4"]);
        break;
    }

    // console.log(available_spaces);
    // now available_spaces contains only the spaces that the second barrier could legally be in
    let loc2 = available_spaces[rand_int(0, available_spaces.length-1)];

    return [loc1, loc2];
}

// junior: clear all the barriers
function clear_all_barriers(){
    let image = document.querySelector("#field-image").contentDocument;
    const locs = ["r1", "r2", "r3", "r4", "g1", "g2", "g3", "g4", "b1", "b2", "b3", "b4"];
    locs.forEach(loc => {
        image.querySelector(`#barrier-${loc} rect`).setAttribute("fill", "none");
    });
}

// randomize the junior board
function randomize_junior(){
    let image = document.querySelector("#field-image").contentDocument;

    // randomize the waiting cars in the lane
    let lane_order = lane_seq();
    lane_order.forEach((color, i) => {
        image.querySelector(`#lane-${i+1} rect`).style.fill = color;
    });

    // randomize the pillars
    let pillars = pillar_locs();
    pillars.populated.forEach(id => {
        image.querySelector(`#pillar-${id} rect`).style.fill = "white";
    });
    pillars.empty.forEach(id => {
        image.querySelector(`#pillar-${id} rect`).style.fill = "none";
    });

    // randomize the barriers
    clear_all_barriers();
    let barriers = barrier_locs();
    barriers.forEach(loc => {
        image.querySelector(`#barrier-${loc} rect`).setAttribute("fill", "url('#barrier')");
    });
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

// junior: update the fills of the parking areas
function update_parking(){
    let image = document.querySelector("#field-image").contentDocument;
    // clear all existing fills
    const names = ["g1", "g2", "g3", "g4", "b1", "b2", "b3", "b4"];
    names.forEach(name => {
        image.querySelector(`#parking-${name} rect`).setAttribute("fill", "none");
    });

    // get values from the dropdowns & fill as appropriate
    let occupied_spaces = [
        {color: "red-parked", space: document.querySelector("#red-parked-car").value},
        {color: "blue-parked", space: document.querySelector("#blue-parked-car").value},
        {color: "green-parked", space: document.querySelector("#green-parked-car").value},
    ];
    occupied_spaces.forEach(car => {
        image.querySelector(`#parking-${car.space} rect`).setAttribute("fill", `url('#${car.color}')`);
    });
}

// initialize the page for the junior layout
function init_jr(){
    // write to the global variable
    board = "junior";

    // set the blank SVG
    document.querySelector("#field-image").data = "junior_blank.svg";

    // populate the options area, including callbacks
    document.querySelector("#board-options").innerHTML = `<div class="input-group mb-3">
            <span class="input-group-text">Red Parked Car: </span>
            <select class="form-select" id="red-parked-car">
                <option selected>Choose...</option>
                <option value="g1">Top row, green</option>
                <option value="b1">Top row, blue</option>
                <option value="g2">Middle row, left green</option>
                <option value="g3">Middle row, right green</option>
                <option value="b2">Middle row, blue</option>
                <option value="b3">Bottom row, left blue</option>
                <option value="b4">Bottom row, right blue</option>
                <option value="g4">Bottom row, green</option>
            </select>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Blue Parked Car: </span>
            <select class="form-select" id="blue-parked-car">
                <option selected>Choose...</option>
                <option value="b1">Top row, blue</option>
                <option value="b2">Middle row, blue</option>
                <option value="b3">Bottom row, left blue</option>
                <option value="b4">Bottom row, right blue</option>
            </select>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Green Parked Car: </span>
            <select class="form-select" id="green-parked-car">
                <option selected>Choose...</option>
                <option value="g1">Top row, green</option>
                <option value="g2">Middle row, left green</option>
                <option value="g3">Middle row, right green</option>
                <option value="g4">Bottom row, green</option>
            </select>
        </div>`
    document.querySelector("#red-parked-car").onchange = update_parking;
    document.querySelector("#green-parked-car").onchange = update_parking;
    document.querySelector("#blue-parked-car").onchange = update_parking;
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
        init_jr();
    };
    document.querySelector("#field-sr").onclick = () => {
        init_sr();
    };

    // callback to randomize the field
    document.querySelector("#randomize-btn").onclick = () => {
        if (board == "elem"){
            randomize_elem();
        }
        else if (board == "junior"){
            randomize_junior();
        }
        else if (board == "senior"){
            randomize_senior();
        }
    };

    init_elem();
});