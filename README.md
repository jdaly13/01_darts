01_darts
========

Dart scoring application

This application is meant to score '01' games in dart anywhere from 101 to 1001

Dependecies include a reset.css, jQuery 1.7 and above, colorbox.js (jquery modal plugin)

Compatible Browsers are recent versions of FF and Chrome (IE doesn't allow contenteditalbe attribute on table cells directly would need to amend)

working version (not always most up to date) http://dalydd.com/projects/dartboard_scoring/index.html

This application will keep the average score per dart and average score per round

Also when within a 3 dart out you'll notice a background image of a dart - click on it and a out chart will appear with the number you highlighted

you can use this as a jquery Plugin $().dartScore();

the function only takes one argument and that's an object with settings

firstStart: (jquery object) this is the first element that is scored in the game

e.g. "#first"

secondStart: (jquery object) this is the first element that is scored in the game

e.g. "#second"

secondStart: (jquery object) colorbox element setting to show score is invalid

e.g. "#warning"

To be continued...
