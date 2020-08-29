'use strict';

const DEFAULT_MIN_DELAY = 200;

const LOG_DIV = document.getElementById("log");

// delay between keys in milliseconds
var min_delay = DEFAULT_MIN_DELAY;

// stores pressed keys and the time they were pressed
var kkeys = {};
var mkeys = {};

// returns name of the mouse button by it's index
function get_mouse_button_name(button) {
    switch (button) {
        case 0: return "Left Button";
        case 1: return "Middle Button";
        case 2: return "Right Button";
        default: return "Unknown Button";
    }
}

function the_thing(keycode, map, fn, ...args) {
    if (map[keycode] !== undefined) {
        var delay = Math.abs(Date.now() - map[keycode]);

        if (delay >= min_delay) {
            map[keycode] = Date.now();
            return;
        }

        fn(delay, ...args);
    } else
        map[keycode] = Date.now();
}

function tell(msg) {
    var p = document.createElement("p");
    p.textContent = msg;
    LOG_DIV.appendChild(p);

    // scroll to the bottom
    window.scrollTo(0, document.body.scrollHeight);
}

function clear_log() {
    // clear all elements in the log div
    LOG_DIV.querySelectorAll('*').forEach(n => n.remove());
}

function set_delay(btn) {
    var raw = prompt("Enter the minimum delay in milliseconds (default is " + DEFAULT_MIN_DELAY + ")", min_delay);

    // the user cancelled
    if (raw === null)
        return;

    var num = parseInt(raw);
    if (isNaN(num)) {
        alert("Invalid value, please enter an integer")
        return;
    }

    min_delay = num;
    btn.textContent = "Threshold = " + min_delay;
}


document.addEventListener('keyup', event => {
    if (event.repeat)
        return;

    the_thing(event.keyCode, kkeys, (delay, event) => {
        tell("doublepress of key \"" + event.key + "\" with delay of " + delay)
    }, event);
}, false);

document.addEventListener('mouseup', event => {
    the_thing(event.button, mkeys, (delay, event) => {
        tell("doublepress of mouse key \"" + get_mouse_button_name(event.button) + "\" with delay of " + delay);
    }, event);
}, false);

// disable context menu
document.addEventListener('contextmenu', event => {
    event.preventDefault();
    return false;
}, false)
