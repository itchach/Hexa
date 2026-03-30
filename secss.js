/* ==========================================
    GLOBAL VARIABLES
    These variables store calculator state
========================================== */

let display = "";     // Stores the current number shown on screen
let fnumber = "";     // Stores the first number
let snumber = "";     // Stores the second number
let operator = "";    // Stores the selected operator (+, -, *, /)
let result;         // Variable to store result


/* ==========================================
    INPUT HEX NUMBER FUNCTION
    Adds a hex digit to the display
========================================== */
function Num(num) {
    // Append to current input only
    display += num.toString(16).toUpperCase();

    if (operator) {
        // Show first number + operator + current input
        document.getElementById("display").innerText = fnumber + " " + operator + " " + display;
    } else {
        // Show first number being typed
        document.getElementById("display").innerText = display;
    }

    updateDisplay(document.getElementById("display").innerText);
}



/* ==========================================
    OPERATOR FUNCTIONS
    Store first number and chosen operator
========================================== */
function Add() {
    if (display === "" || operator !== "") return;

    fnumber = display;  // store the first number
    operator = "+";     // set operator
    display = "";       // clear display for second number input
    document.getElementById("display").innerText = fnumber + " " + operator;
}

function minum() {
    if (display === "" || operator !== "") return;

    fnumber = display;
    operator = "-";
    display = "";
    document.getElementById("display").innerText = fnumber + " " + operator;
}

function multi() {
    if (display === "" || operator !== "") return;

    fnumber = display;
    operator = "*";
    display = "";
    document.getElementById("display").innerText = fnumber + " " + operator;
}

function division() {
    if (display === "" || operator !== "") return;

    fnumber = display;
    operator = "/";
    display = "";
    document.getElementById("display").innerText = fnumber + " " + operator;
}



/* ==========================================
    EQUAL FUNCTION
    Performs the selected operation
========================================== */
function Ecual() {

    snumber = display;  // Save second number
    //error handling if the input is incomplete
    if (!fnumber || !snumber || !operator) {
        document.getElementById("display").innerText = "INCOMPLETE";
        display = "";
        return;
    }

    // all valid hex character
    const hexChars = "0123456789ABCDEF";
    //result storage
    let result = "";
    
    if (operator === "+") {
        // MANUAL HEX ADDITION
        //carry storage
        let carry = 0;
        //start from right most index
        let i = fnumber.length - 1; 
        let j = snumber.length - 1; 
                                
        //check each index if true
        while (i >= 0 || j >= 0 || carry > 0) {
            let digit1 = i >= 0 ? hexChars.indexOf(fnumber[i].toUpperCase()) : 0; //set the digit to the value in index
            let digit2 = j >= 0 ? hexChars.indexOf(snumber[j].toUpperCase()) : 0; 
            //addition per digit
            let sum = digit1 + digit2 + carry;
            //calculate carry
            carry = Math.floor(sum / 16);
            //calculate the remainder number
            let remainder = sum % 16;

            result = hexChars[remainder] + result;

            i--;
            j--;
        }
    }else if (operator === "-"){
        // ================= MANUAL HEX SUBTRACTION =================
        let borrow = 0;
        let i = fnumber.length - 1; 
        let j = snumber.length - 1; 

        // Check if second number > first number (negative not supported)
        let firstDec = parseInt(fnumber, 16);
        let secondDec = parseInt(snumber, 16);
        if (secondDec > firstDec) {
            document.getElementById("display").innerText = "negative num";
            display = "";
            return;
        }
        //calculation per digit
        while (i >= 0) {
            let digit1 = hexChars.indexOf(fnumber[i].toUpperCase()) - borrow;
            let digit2 = j >= 0 ? hexChars.indexOf(snumber[j].toUpperCase()) : 0;

            if (digit1 < digit2) {
                digit1 += 16;
                borrow = 1;
            } else {
                borrow = 0;
            }

            let diff = digit1 - digit2;
            result = hexChars[diff] + result;

            i--;
            j--;
        }

        // Remove leading zeros
        result = result.replace(/^0+/, "") || "0";

    }else if (operator === "*"){
        result = parseInt(fnumber, 16) * parseInt(snumber, 16);

    }else if(operator === "/"){
        result = parseInt(fnumber, 16) / parseInt(snumber, 16);
    }

    // Convert result back to hexadecimal
    display = result.toString(16).toUpperCase();

    // Show result
    document.getElementById("display").innerText = display;
    updateDisplay(display);
    
    // Convert result back to hexadecimal
display = result.toString(16).toUpperCase();

// Show result only
document.getElementById("display").innerText = display;
updateDisplay(display);

// Reset for next calculation
fnumber = "";
snumber = "";
operator = "";
    

}



/* ==========================================
    CLEAR DISPLAY FUNCTION
    Resets calculator to default state
========================================== */
function clearDisplay() {
    display = "";
    fnumber = "";
    snumber = "";
    operator = "";
    document.getElementById("display").innerText = "";
}



/* ==========================================
    UPDATE DISPLAY FUNCTION
    Dynamically adjusts font size based on length
========================================== */
function updateDisplay(snumber) {

    const displayEl = document.getElementById("display");
    displayEl.innerText = snumber;

    // Default font size
    let fontSize = 30; // in rem

    /* Shrink font if number is too long*/
    const maxChars = 8;
    if (snumber.length > maxChars) {
        fontSize = Math.max(0.8, 20 - (snumber.length - maxChars) * 0.3);
    }

    displayEl.style.fontSize = fontSize + "px";
}



/* ==========================================
    HEX TO BINARY CONVERSION
========================================== */
function binary() {

    const hexInput = document.getElementById("hexB");
    const binOutput = document.getElementById("binH");

    const hex = hexInput.value.trim().toUpperCase();

    // If empty input, clear output
    if (hex === "") {
        binOutput.value = "";
        return;
    }

    // Validate hexadecimal input (0–9, A–F only)
    if (!/^[0-9A-F]+$/.test(hex)) {
        binOutput.value = "HEX ONLY ALLOWS (0-9, A-F)";
        return;
    }

    // Convert hex to decimal, then decimal to binary
    const decimal = parseInt(hex, 16);
    binOutput.value = decimal.toString(2);
}



/* ==========================================
    TOGGLE HEX → BINARY SECTION
========================================== 
function conversion() {

    const hexBin = document.getElementById("hex_bin");
    const binHex = document.getElementById("bin_hex");

    if (hexBin.classList.contains("show")) {
        hexBin.classList.remove("show");
    } else {
        hexBin.classList.add("show");
        binHex.classList.remove("show");
    }
}



/* ==========================================
    TOGGLE BINARY → HEX SECTION
========================================== 
function conversiom() {

    const hexBin = document.getElementById("hex_bin");
    const binHex = document.getElementById("bin_hex");

    if (binHex.classList.contains("show")) {
        binHex.classList.remove("show");
    } else {
        binHex.classList.add("show");
        hexBin.classList.remove("show");
    }
}



/* ==========================================
    BINARY TO HEX CONVERSION
========================================== 
function binaryToHex() {

    const bin = document.getElementById("binInput").value.trim();
    const hexOutput = document.getElementById("hexOutput");

    // Validate binary input (only 0 and 1)
    if (!/^[01]+$/.test(bin)) {
        hexOutput.value = "Invalid Binary";
        return;
    }

    // Convert binary → decimal → hex
    const decimal = parseInt(bin, 2);
    hexOutput.value = decimal.toString(16).toUpperCase();
}*/

const bgbtn = document.querySelector('.bg_bg');

const Homepage = document.querySelector('.Homepage');

const background = [
    'drag.gif',
    'planet.gif',
    'red.gif',
    'river.gif',
    'a.gif'
    
];

    bgbtn.addEventListener('click', () => {
        const random = Math.floor(Math.random() * background.length);
        Homepage.style.backgroundImage = `url('${background[random]}')`;
    });	


    /* 
    
const total = Math.pow(2, n);
for (let i = total - 1; i >= 0; i--) {
    const env = {};
    vars.forEach((v, idx) => {
        env[v] = Boolean((i >> (n - 1 - idx)) & 1);
    });
    rows.push({ env, result: evaluate(tree, env) });
}
    

// OR v (strict operator)
if (s[i] === 'v') {
    tokens.push({ type: 'OR', val: 'v' });
    i++;
    continue;
}

*/