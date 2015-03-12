"use strict";

require('es-env-polyfills');

var fs = require("fs"),
	path = require("path"),
	exec = require("child_process").exec;

var MIN_DUTY = 30;
var MAX_DUTY = 110;
var SYSFSPATH = "/sys/devices/platform/pwm-ctrl/";


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

		servo.setFrequency(1, 50);
		servo.setFrequency(2, 50);

	},

	setFrequency: function(servoNumber, freq, callback) {
		fs.writeFile(SYSFSPATH + "freq" + String(servoNumber - 1), freq, (callback || noop));
	},

	setDuty: function(servoNumber, duty, callback) {
		fs.writeFile(SYSFSPATH + "duty" + String(servoNumber - 1), duty, (callback || noop));
	},

	enable: function(servoNumber, callback) {
		fs.writeFile(SYSFSPATH + "enable" + String(servoNumber - 1), 1, (callback || noop));
	},

	disable: function(servoNumber, callback) {
		fs.writeFile(SYSFSPATH + "enable" + String(servoNumber - 1), 0, (callback || noop));
	},

	move: function(servoNumber, value, raw, callback) {
		new Promise(function(resolve, reject){
			servo.enable(servoNumber, callback);
			var rot = raw ? value : fromPercent(value);
			servo.setDuty(servoNumber, rot, callback);
			setTimeout(function(){ 
				servo.disable(servoNumber, callback);
				resolve();
			 }, 1000);
		});
	},

	center: function(servoNumber, callback) {
		servo.move(servoNumber, 50, callback);
	},	

	readDuty: function(servoNumber, callback) {
		fs.readFile(SYSFSPATH + "duty" + String(servoNumber - 1), "utf-8", function(err, data) {
			if (err) return (callback || noop)(err);
			return parseInt(data, 10)
		});
	},


};


module.exports = servo;
