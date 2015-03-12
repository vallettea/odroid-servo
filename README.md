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

servo.center(1); // center the servo 1 (50% postion)
servo.move(1, 0); // move servo 1 to extreme left to (0% position)
servo.move(1, 100); // move servo 1 to extreme right to (100% position)
servo.move(2, 30); // move servo 2 to 30%
```

Refs:
http://odroid.com/dokuwiki/doku.php?id=en:c1_hardware_pwm