// Get elements from the page
var tempInput = document.getElementById("temp");
var unitSelect = document.getElementById("unit");
var convertBtn = document.getElementById("convert");
var hint = document.getElementById("hint");
var message = document.getElementById("message");
var results = document.getElementById("results");
var mercury = document.getElementById("mercury");

// Conversion functions
function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32;
}

function fahrenheitToCelsius(f) {
  return (f - 32) * 5 / 9;
}

function celsiusToKelvin(c) {
  return c + 273.15;
}

function kelvinToCelsius(k) {
  return k - 273.15;
}

// Round to 2 decimal places
function round(num) {
  return Number(num.toFixed(2));
}

// Show an error under the input box
function showError(text) {
  hint.textContent = text;
  tempInput.classList.add("invalid");
  results.classList.add("empty");
}

// Clear the error
function clearError() {
  hint.textContent = "";
  tempInput.classList.remove("invalid");
}

// Check the input while the user is typing
tempInput.addEventListener("input", function () {
  var text = tempInput.value.trim();
  message.className = "message";

  // empty, or just started typing a minus or a dot
  if (text === "" || text === "-" || text === ".") {
    clearError();
  } else if (isNaN(text)) {
    showError("Please enter a valid number (example: 25 or -3.5)");
  } else {
    clearError();
  }
});

// Main function: runs when the user clicks Convert
function convert() {
  var text = tempInput.value.trim();
  var unit = unitSelect.value;

  message.className = "message";

  // 1. Check that the input is not empty
  if (text === "") {
    showError("Please enter a temperature value.");
    return;
  }

  // 2. Check that the input is a number
  if (isNaN(text)) {
    showError("Please enter a valid number (example: 25 or -3.5)");
    return;
  }

  clearError();
  var value = Number(text);

  // 3. Change the input to Celsius first
  var celsius;
  if (unit === "C") {
    celsius = value;
  } else if (unit === "F") {
    celsius = fahrenheitToCelsius(value);
  } else {
    celsius = kelvinToCelsius(value);
  }

  // 4. Absolute zero check (-273.15 C)
  if (round(celsius) < -273.15) {
    var lowest;
    if (unit === "C") {
      lowest = "-273.15 °C";
    } else if (unit === "F") {
      lowest = "-459.67 °F";
    } else {
      lowest = "0 K";
    }

    message.className = "message warn";
    message.textContent =
      "This temperature is below absolute zero, which is impossible. " +
      "The lowest possible value in this unit is " + lowest + ".";
    results.classList.add("empty");
    mercury.style.height = "0%";
    return;
  }

  // 5. Calculate all three units
  var c = round(celsius);
  var f = round(celsiusToFahrenheit(celsius));
  var k = round(celsiusToKelvin(celsius));

  // 6. Show the results with the correct unit labels
  document.getElementById("out-C").innerHTML = c + " <small>°C</small>";
  document.getElementById("out-F").innerHTML = f + " <small>°F</small>";
  document.getElementById("out-K").innerHTML = k + " <small>K</small>";

  // mark which one was the input
  document.getElementById("row-C").classList.remove("source");
  document.getElementById("row-F").classList.remove("source");
  document.getElementById("row-K").classList.remove("source");
  document.getElementById("row-" + unit).classList.add("source");

  results.classList.remove("empty");

  // 7. Move the thermometer (-50 C = empty, 150 C = full)
  var percent = (celsius + 50) / 200 * 100;
  if (percent < 0) {
    percent = 0;
  }
  if (percent > 100) {
    percent = 100;
  }
  mercury.style.height = percent + "%";
}

// Run convert when the button is clicked
convertBtn.addEventListener("click", convert);

// Also run it when the user presses Enter
tempInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    convert();
  }
});