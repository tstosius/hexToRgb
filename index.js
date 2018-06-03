function convertHex(hex) {
    hex = hex.replace("#", "");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = "rgb(" + r + "," + g + "," + b + ")";
    return result;
}

function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1); // remove #
    color = parseInt(color, 16); // convert to integer
    color = 0x00ff00 ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
}

function convert() {
    var colorArray = [];
    var colorString = "";
    var inputList = document.getElementsByClassName("hexInput");
    for (var i = 0; i < inputList.length; i++) {
        if (inputList[i].value !== "") {
            // colorArray.push(convertHex("#"+inputList[i].value));
            colorString += convertHex("#" + inputList[i].value) + ";";
        }
    }
    document.getElementById("result").innerHTML = colorString;
    console.log(colorString);
}

function createNewInput(color) {
    console.log("Create new input");
    var inputList = document.getElementById("inputList");
    var newListElement = document.createElement("li");
    newListElement.classList = "inputListItem";

    var newInputElement = document.createElement("input");
    newInputElement.setAttribute("type", "text");
    newInputElement.setAttribute("onChange", "updateBackgroundColor(event)");
    newInputElement.classList = "hexInput";
    if (color) {
        newInputElement.value = color;
        newInputElement.style.background = "#" + color;
    }

    var deleteInputButton = document.createElement("button");
    deleteInputButton.innerText = "X";
    deleteInputButton.setAttribute("onClick", "removeInputElement(event)");

    newListElement.appendChild(newInputElement);
    newListElement.appendChild(deleteInputButton);
    inputList.appendChild(newListElement);
}

function removeInputElement(mouseEventInfo) {
    var inputList = document.getElementById("inputList");
    inputList.removeChild(mouseEventInfo.srcElement.parentElement);
    
}

function updateBackgroundColor(event) {
    var newBackgroundColor = "#" + event.srcElement.value;
    event.srcElement.style.background = newBackgroundColor;
}

function initColors() {
    var defaultColorList = [
        "#DA291C",
        "#2B303A",
        "#92DCE5",
        "#EEE5E9",
        "#7C7C7C"
    ];

    var inputElements = document.getElementsByClassName("hexInput");
    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].style.background = defaultColorList[i];
    }
}

function saveColors() {
    var currentColors = [];
    var currentInputs = document.getElementsByClassName("hexInput");
    for (var i = 0; i < currentInputs.length; i++) {
        currentColors.push(currentInputs[i].value);
    }
    window.localStorage.setItem("colors", currentColors);
}

function restoreColors() {
    var storedColors = window.localStorage.getItem("colors");
    if (storedColors !== "" && storedColors !== null) {
        var storedColors = storedColors.split(",");
        console.log(storedColors);
        if (storedColors.length > 0) {
            for (var i = 0; i < storedColors.length; i++) {
                createNewInput(storedColors[i]);
            }
        }
    }
}

restoreColors();
