var LOCAL_STORAGE_KEY = "hextorgb_colorstore";
var OUTPUT_LIST_ID = "outputlist";
var TEXT_ANCHOR_ID = "textAnchor";
var LIST_ITEM_CLASS = "colorListItem";
var INNER_ITEM_CLASS = "input-group-prepend";
var FORM_ITEM_CLASS = "input-no-border";


/**
 * Store function like converting hex to rgb etc
 * @constructor
 */
var Helper = function () {
    this.regex = /#(?:[A-Za-z0-9]{6})/m;
};
Helper.prototype.isHexValue = function (hex_value) {
    return this.regex.exec(hex_value);
};
Helper.prototype.convertToRGBString = function (hex_value) {
    hex_value = hex_value.replace("#", "");
    var r = parseInt(hex_value.substring(0, 2), 16);
    var g = parseInt(hex_value.substring(2, 4), 16);
    var b = parseInt(hex_value.substring(4, 6), 16);
    return "rgb(" + r + "," + g + "," + b + ");";
};
Helper.prototype.invertHexColor = function (hex_color) {
    var color = hex_color;
    color = color.replace("#", "");
    color = parseInt(color, 16); // convert to integer
    color = 0x00ff00 ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
};
Helper.prototype.appendListitem = function (hex_text) {
    var list = document.getElementById(OUTPUT_LIST_ID);
    if (!list) {
        return;
    }

    // Create outer wrapper for all group element
    var listWrapper = document.createElement("li");
    listWrapper.setAttribute("class", LIST_ITEM_CLASS);
    listWrapper.setAttribute("id", hex_text);

    // Create prepend wrapper
    var prependWrapper = document.createElement("div");
    prependWrapper.setAttribute("class", INNER_ITEM_CLASS);

    var btn = document.createElement("img");
    btn.setAttribute("class", "btn");
    btn.addEventListener("click", function () {
        document.getElementById(hex_text).remove();
        window.colorstore.colors = window.colorstore.colors.filter(function (value) { return value !== hex_text })
    });

    btn.setAttribute("src", 'trash.svg');
    prependWrapper.appendChild(btn);


    var listItem = document.createElement("input");

    listItem.setAttribute("class", FORM_ITEM_CLASS);
    listItem.setAttribute("style", "background-color: " + hex_text);

    listWrapper.appendChild(prependWrapper);
    listWrapper.appendChild(listItem);
    list.appendChild(listWrapper);
};
Helper.prototype.clearColorList = function() {
    document.querySelectorAll(".colorListItem").forEach(listitem => listitem.remove())
}


/**
 * Handle store and restore of color data
 * @constructor
 */
var ColorStore = function () {
    this.helper = new Helper();
    this.colors = [];
};
ColorStore.prototype.initializeColors = function () {
    this.colors = [
        "#FF0000",
        "#00FF00",
        "#0000FF"
    ];
    this.colors.forEach(function (value) {
        this.helper.appendListitem(value);
    });
};
ColorStore.prototype.saveColor = function (hex_colorCode) {
    var shouldStore = true;

    if (!this.colors.includes(hex_colorCode)) {
        this.colors.push(hex_colorCode);
        helper.appendListitem(hex_colorCode);
    }
};
ColorStore.prototype.storeColor = function () {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, this.colors);
};

ColorStore.prototype.restoreColors = function () {
    this.colors = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!this.colors || this.colors.length === 0) {
        this.initializeColors();
        return this.colors;
    }

    this.colors = this.colors.split(",");
    this.colors.forEach(function (value) {
        this.helper.appendListitem(value);
    });
    return this.colors;
};


// Globally needed or they are overridden everytime an input occures
var helper = new Helper();
var colorstore = new ColorStore();

/**
 * Runs when the user fill the input field
 * @param input The value of the input field
 */
function handleColorInputUpdate(input) {

    document.querySelector("#hexValueInput").value = "";

    if(input.indexOf("https://coolors.co/") === 0){
        let inputSplit = input.split(/([a-f0-9]{6})/g).filter((val) => val !== "-" && val !== "" && val !== "https://coolors.co/");
        inputSplit = inputSplit.map( val => "#" + val)
        inputSplit = inputSplit.filter( val => helper.isHexValue(val))
        inputSplit.forEach(val => colorstore.saveColor(val))
        return;
    }

    if (input.indexOf("#") < 0) {
        input = "#" + input;
    }

    if (!helper.isHexValue(input)) {
        return;
    }
    colorstore.saveColor(input);

}

function restoreColors() {
    this.helper.clearColorList();
    colorstore.restoreColors();
}

function convertToRgbString() {
    var string_rgbValues = "";
    colorstore.colors.forEach(function (value) {
        string_rgbValues += helper.convertToRGBString(value);
    });
    document.getElementById(TEXT_ANCHOR_ID).innerHTML = "<p>"+string_rgbValues+"</p>";
}

function saveColors() {
    colorstore.storeColor();
}

function clearAllColors() {
    this.helper.clearColorList();
    colorstore.colors = [];
}

