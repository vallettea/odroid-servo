# odroid-servo

A very dummy lib to run servos on odroid-c1.

### Prerequisits

```
sudo apt-get update && sudo apt-get install fix-w1-blacklist
```

### Usage

Connect servo 1 on pin 33 and servo 2 on pin 19.

```javascript
var servo = require("./odroid-servo");

servo.init();
servo.readDuty(function(value){console.log(value)})

servo.center(); // center the servo (50% postion)
servo.move(0); // move extreme left to (0% position)
servo.move(100); // move extreme right to (100% position)
servo.move(30);
```

Refs:
http://odroid.com/dokuwiki/doku.php?id=en:c1_hardware_pwm