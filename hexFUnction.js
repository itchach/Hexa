let display = "";
let fnumber ="";
let snumber ="";
let equal = "";
let operator = "";

function sNumber(num){
    display += num.toString(16).toUpperCase();
    document.getElementById("display").innerText = display;
    updateDisplay(display);
}

function Add() {
    fnumber = display;
    operator = "+";
    display = "";
    document.getElementById("display").innerText = "";
    updateDisplay(display);
}

function minum(){
    fnumber = display;
    operator = "-"
    display = "";
    document.getElementById("display").innerText = "";
    updateDisplay(display);
}

function multi(){
    fnumber = display;
    operator = "*"
    display = "";
    document.getElementById("display").innerText = "";
    updateDisplay(display);
}

function division(){
    fnumber = display;
    operator = "/";
    display = "";
    document.getElementById("display").innerText = "";
    updateDisplay(display);
}

function Ecual() {
    snumber = display;
    let result;

    if(operator === "+"){
            result = parseInt(fnumber, 16) + parseInt(snumber, 16);
    }else if (operator === "-"){
            result = parseInt(fnumber, 16) - parseInt(snumber, 16);
    }else if (operator === "*"){
        result = parseInt(fnumber, 16) * parseInt(snumber, 16); 
    }else if(operator === "/"){
        result = parseInt(fnumber, 16) / parseInt(snumber, 16);

    }
    display = result.toString(16).toUpperCase();
    document.getElementById("display").innerText = display;
    updateDisplay(display);
}




function clearDisplay() {
    display = "";
    fnumber = "";
    snumber = "";
    operator = "";
    document.getElementById("display").innerText = "";
}


function updateDisplay(snumber) {
    const displayEl = document.getElementById("display");
    displayEl.innerText = snumber;

    // Base font size (for small numbers)
    let fontSize = 2; // in rem

    // Reduce font size proportionally if number gets too long
    const maxChars = 8; // number of characters before shrinking starts
    if (snumber.length > maxChars) {
        fontSize = Math.max(0.8, 2 - (snumber.length - maxChars) * 0.1);
    }

    displayEl.style.fontSize = fontSize + "rem";
}



function binary() {
    const hexInput = document.getElementById("hexB");
    const binOutput = document.getElementById("binH");
    const hex = hexInput.value.trim().toUpperCase();

    // empty input
    if (hex === "") {
        binOutput.value = "";
        return;
    }

    // ❗ allow ONLY HEX characters (0–9, A–F)
    if (!/^[0-9A-F]+$/.test(hex)) {
        binOutput.value = "Invalid HEX";
        return;
    }

    const decimal = parseInt(hex, 16);
    binOutput.value = decimal.toString(2);
}


function conversion() {
    const hexBin = document.getElementById("hex_bin");
    const binHex = document.getElementById("bin_hex");

    if (hexBin.classList.contains("show")) {
        // if already visible → hide it
        hexBin.classList.remove("show");
    } else {
        // show this, hide the other
        hexBin.classList.add("show");
        binHex.classList.remove("show");
    }
}

function conversiom() {
    const hexBin = document.getElementById("hex_bin");
    const binHex = document.getElementById("bin_hex");

    if (binHex.classList.contains("show")) {
        // if already visible → hide it
        binHex.classList.remove("show");
    } else {
        // show this, hide the other
        binHex.classList.add("show");
        hexBin.classList.remove("show");
    }
}



function binaryToHex() {
    const bin = document.getElementById("binInput").value.trim();
    const hexOutput = document.getElementById("hexOutput");

    if (!/^[01]+$/.test(bin)) {
        hexOutput.value = "Invalid Binary";
        return;
    }

    const decimal = parseInt(bin, 2);
    hexOutput.value = decimal.toString(16).toUpperCase();
}


