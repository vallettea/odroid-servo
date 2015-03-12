"use strict";

require('es-env-polyfills');

var fs = require("fs"),
	path = require("path"),
	exec = require("child_process").exec;

var MIN_DUTY = 30;
var MAX_DUTY = 110;
var SYSFSPATH = "/sys/devices/platform/pwm-ctrl/";


var board = fs.readFileSync("/proc/cpuinfo").toString().split("\n").filter(function(line) {
	return line.indexOf("Hardware") == 0;
})[0].split(":")[1].trim();

if (board !== 'ODROIDC'){
	console.log("This board is not an Odroid-C1, problems might occur.");
}

function isNumber(number) {
	return !isNaN(parseInt(number, 10));
}

function noop() {}

function handleExecResponse(method, callback) {
	return function(err, stdout, stderr) {
		if (err) {
			console.error("Error when trying to", method);
			console.error(stderr);
			callback(err);
		} else {
			callback();
		}
	}
}

function fromPercent(percent) {
	return Math.floor(percent*(MAX_DUTY - MIN_DUTY)/100 + MIN_DUTY);
}


var servo = {

	init: function(callback) {

		// setup the env
		exec("modprobe pwm-meson npwm=2", handleExecResponse("init", function(err) {
			if (err) return (callback || noop)(err);
		}));
		exec("modprobe pwm-ctrl", handleExecResponse("init", function(err) {
			if (err) return (callback || noop)(err);
		}));

		servo.setFrequency(50);

	},

	setFrequency: function(freq, callback) {
		fs.writeFile(SYSFSPATH + "freq0", freq, (callback || noop));
	},

	setDuty: function(duty, callback) {
		fs.writeFile(SYSFSPATH + "duty0", duty, (callback || noop));
	},

	enable: function(callback) {
		fs.writeFile(SYSFSPATH + "enable0", 1, (callback || noop));
	},

	disable: function(callback) {
		fs.writeFile(SYSFSPATH + "enable0", 0, (callback || noop));
	},

	move: function(value, callback) {
		new Promise(function(resolve, reject){
			servo.enable();
			var rot = fromPercent(value);
			console.log(rot);
			servo.setDuty(rot);
			setTimeout(function(){ 
				servo.disable();
				resolve();
			 }, 1000);
		});
	},

	center: function(callback) {
		servo.move(50);
	},	

	readDuty: function(callback) {
		fs.readFile(SYSFSPATH + "duty0", "utf-8", function(err, data) {
			if (err) return (callback || noop)(err);
			return parseInt(data, 10)
		});
	},


};


module.exports = servo;
