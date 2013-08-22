01_darts
========

Dart scoring application

This application is meant to score '01' games in dart anywhere from 101 to 1001

3 main files are index.html, style.css, scripts.js 

Dependecies include reset.css, jQuery 1.7 and above, colorbox.js (jquery modal plugin), and of course html in index.html	

Compatible Browsers are recent versions of FF and Chrome (IE doesn't allow contenteditalbe attribute on table cells directly would need to amend)

working version (not always most up to date) http://dalydd.com/projects/dartboard_scoring/index.html

This application will keep the average score per dart and average score per round

Also when within a 3 dart out you'll notice a background image of a dart - click on it and a out chart will appear with the number you highlighted

you can use this as a jquery Plugin $().dartScore();

the function only takes one argument and that's an object with the following settings

firstStart: (jquery object) this is the first html element that is scored in the game

e.g./default "#first"

secondStart: (jquery object) this is the first html element that is scored in the game

e.g./default "#second"

secondStart: (jquery object) colorbox html element setting to show score is invalid

e.g./default "#warning"

NEED TO FINISH BELOW OPTIONS

colorboxWidth:

colorboxHeight:

colorboxOpacity:

gameOverPopUp: 

inline:

gameOver:

onLoad:

whichGame:

whichPlayer:

yourTeam:

firstShooter:

secondShooter:

newGameButton:

perDartElementFirst:

To be continued...
