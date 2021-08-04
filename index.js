function test(){
    let image = document.querySelector("#field-image").contentDocument;

    let b1 = image.querySelector("#bulb-1 rect");
    b1.style.stroke = "red";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#field-elem").onclick = () => {
        document.querySelector("#field-image").data = "elementary_blank.svg";
    };

    document.querySelector("#field-jr").onclick = () => {
        document.querySelector("#field-image").data = "junior_blank.svg";
    };

    document.querySelector("#field-sr").onclick = () => {
        document.querySelector("#field-image").data = "senior_blank.svg";
    };
});