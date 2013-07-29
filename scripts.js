
(function (w,d) {
// we declare our GAME properties here before we give them values in our script
w.GAME = GAME = {}
GAME.start_value = null;
GAME.first_player_value = null;
GAME.second_player_value = null;
GAME.darts_thrown = null;
GAME.extra_row = null;
GAME.daly = null;
GAME.who_won = null;
GAME.dartsThrownFirst = 0;
GAME.dartsThrownSecond = 0;

// common strings we use to determine first or second player
GAME.first = "first";
GAME.second = "second";

// here we filter out what was entered by user for score
GAME.checkValue = function (num, score, dartsThrown, firstOrSecond) {  
		if ((isNaN(num) || num == '' || num > 180 || num > score) && num !==0) {
				$.colorbox({
						inline:true, 
						href:"#warning",
						width:"360px",
						height:"300px",
						opacity:.75,
						onComplete: function () {
						
						}	
				});
				
			return false		
		} 
	
	if (num == score) {
		GAME.darts_thrown = dartsThrown;
		GAME.who_won = firstOrSecond;
		$.colorbox({
			inline:true, 
			href:"#game_over",
			width:"360px",
			height:"500px",
			opacity:.75,
			overlayClose: false,
			onLoad: function () {
				$('#cboxClose').hide();
			},
			onComplete: function () {
			
			}	
		});
		return true
	} 


} // end of checkValue function


GAME.outEligible = function (num) {
	if ((num < 171) && (num > 39)) {	
			return {
				number:num,
				out:"eligible"
			}
	} else {
			return {
				number:num,
				out:"not_eligible"
			}
	}
}


GAME.calculateAverageScore = function (currentScore, dartsThrown, gameStartValue, startValue) {
			var obj = {}
		
			//if (startValue == 0) {
					currentScore = gameStartValue - currentScore;
					console.log(currentScore);
			//}			
			obj.perRound = parseInt(currentScore / (dartsThrown / 3));
			obj.perDart = Math.round(parseInt(currentScore / dartsThrown));
			return obj;
			
} // end of calculateAverageScore

GAME.updateAverageScore = function (perDart, perRound) {
	
	if (arguments[1] == undefined && GAME.daly == GAME.first) {
		perRound = $('#left > div.per_round > h3 span').text();	
	}
	
	if (arguments[1] == undefined && GAME.daly == GAME.second) {
		perRound = $('#right > div.per_round > h3 span').text();	
	}
		
	if (arguments[2] == "secondPlayer") { //second player
		var perDartelement = $('#right > div.per_dart > h3 span');
		var perRoundelement = $('#right > div.per_round > h3 span');
	} else {  //first player
		var perDartelement = $('#left > div.per_dart > h3 span');
		var perRoundelement = $('#left > div.per_round > h3 span');
	}
	
	
	perDartelement.text(perDart);
	perRoundelement.text(perRound);
} 


GAME.events = {};

GAME.events.initialOverlay = (function () {
	$('#myForm a').on('click', function (e) { // initial overlay form
		var valueOfUnchecked;
		var which_game = $('#which_game').val(); // select box to choose value of 01 game e.g. 301
		var which_player = $('#which_player').val(); // The Daly's player name	
		if (which_player == '') { // some form validation to make sure box isn't empty
			$('#which_player').prev().prev().html("<span style='font-weight:bold'>please write in a player name!</span>");
			return false;
		}
		$('#middle table td.to_go').text(which_game); // show game value within table
		GAME.start_value = parseInt(which_game); // make the start value a property of the main OBJECT
		which_player = "Daly's Shooter: " + which_player;  //append which Player value to add Daly's shooter
		var valueOfTheCheckedRadio = $('[name=who_goes]:checked').val(); // checked value to see who goes first
		if (valueOfTheCheckedRadio === "Daly's") {
			GAME.daly = "first";
			$('#left h2 span').text(which_player).parent().removeClass('hide');
			valueOfUnchecked = "Away"
		} else {
			GAME.daly = "second";
			$('#right h2 span').text(which_player).parent().removeClass('hide');
			valueOfUnchecked = "Daly"
		}
		
		$('#left h1 span').text(valueOfTheCheckedRadio);
		$('#right h1 span').text(valueOfUnchecked);
		
		$.colorbox.close();
		e.preventDefault();

	})
}())

// the first box is highlighted as user cue - we remove color on click focus whatevs
GAME.events.firstClick = (function () {
	$('#start').on('focus', function () {
		$(this).css('background-color', 'white');
	});
}())


// temporary hopefully to clear out board for each new game start
GAME.events.newGAME = (function () {
	$('#new_game').on("click", function () {
		window.location.reload(true);
	});
}())
// first score
GAME.events.firstScore = (function () {
	$('#start').on('keydown', function (event) {
		var $this = $(this);
		if (event.keyCode == 9 || event.keyCode == 13 ) { // enter or tab keys
			var start_value = parseInt($.trim($this.text())); // we get value of whatever is entered no need to parse integer
			$this.text(start_value);
			GAME.darts_thrown = 3;
			if (start_value === 0) { 			
				GAME.first_player_value = GAME.start_value
			} else {
				var returnedValue = GAME.checkValue(start_value, GAME.start_value, GAME.darts_thrown, GAME.first);
				if (returnedValue == false) {
					$this.text('');
					event.preventDefault();				
					return false;
				} 
				GAME.first_player_value = GAME.start_value - start_value; //subtract the new score
				var objReturned = GAME.calculateAverageScore(GAME.first_player_value, GAME.darts_thrown, GAME.start_value);
				GAME.avgPerDart = objReturned.perDart
				GAME.avgPerRound = objReturned.perRound
				GAME.updateAverageScore(GAME.avgPerDart, GAME.avgPerRound);			
			}
			
			var cheatSheetObj = GAME.outEligible(GAME.first_player_value);
			$this.next().text(GAME.first_player_value).addClass(cheatSheetObj.out); //place new score in points to go box
		}
	});
}()) 

//second score
GAME.events.secondScore = (function () {
	$('#second_start').on('keydown', function (event) {
		var $this = $(this);
		if (event.keyCode == 9 || event.keyCode == 13 ) {
			var start_value = parseInt($.trim($this.text()));
			$this.text(start_value);
			GAME.second_player_value = GAME.start_value - start_value;		
			if (start_value != 0) {
				var returnedValue = GAME.checkValue(start_value, GAME.start_value, GAME.darts_thrown, GAME.second );
				if (returnedValue == false) {
					$this.text('');
					event.preventDefault();
					return false;
				}
				var objReturned = GAME.calculateAverageScore(GAME.second_player_value, GAME.darts_thrown, GAME.start_value);
				GAME.avgPerDartSecond = objReturned.perDart
				GAME.avgPerRoundSecond = objReturned.perRound
				GAME.updateAverageScore(GAME.avgPerDartSecond, GAME.avgPerRoundSecond, 'secondPlayer');
			}
			$this.parent().next().children('.one').attr('contenteditable', true);
			
			var cheatSheetObj = GAME.outEligible(GAME.second_player_value);
			$this.next().text(GAME.second_player_value).addClass(cheatSheetObj.out);
		}
	});
}())

//left side scoring or first player
GAME.events.firstPersonScoring = (function () {
	$('table').on('keydown', 'td.one', function (event) {
		var $this = $(this);
		var donotUpdate = null;
		if (event.keyCode == 9 || event.keyCode == 13 ) {
			var start_value = parseInt($.trim($this.text()));
			$this.text(start_value);
			var value_tosubtract = parseInt($this.parent().prev().children('td.two').text()); // probably change this later to be less "hard coded"
			//var value_tosubtract = GAME.first_player_value
			var first_player_value = value_tosubtract - start_value;
			GAME.first_player_value = GAME.first_player_value - start_value;
			if (first_player_value === GAME.start_value) {
				donotUpdate = true;
				GAME.dartsThrownFirst = 0;
			} else {
				if ($('#start').text() != 0) {
					GAME.dartsThrownFirst = parseInt($this.siblings('td.dark_border').text());
				} else {
					GAME.dartsThrownFirst = GAME.dartsThrownFirst + 3;
				}
				donotUpdate = false;
			}
				
				var returnedValue = GAME.checkValue(start_value, value_tosubtract, GAME.dartsThrownFirst, GAME.first);
				if (returnedValue == false) {
					$this.text('');
					event.preventDefault();
					return false;
				}
				
				if (donotUpdate === false) {
					var objReturned = GAME.calculateAverageScore(first_player_value, GAME.dartsThrownFirst, GAME.start_value, start_value );
					GAME.avgPerDart = objReturned.perDart
					GAME.avgPerRound = objReturned.perRound
					GAME.updateAverageScore(GAME.avgPerDart, GAME.avgPerRound);			
				}
				
				var cheatSheetObj = GAME.outEligible(first_player_value);
				$this.next().text(first_player_value).addClass(cheatSheetObj.out).next().next().attr('contenteditable', true);
			
		}
	});
}())

//right side scoring whose second scoring
GAME.events.SecondPlayerScoring = (function () {
	$('table').on('keydown', 'td.three', function (event) {
		var donotUpdate = null;
		var $this = $(this);
		var subtracted_value;
		var table_row = $("<tr class='inserted'><td class='one' contenteditable='true'></td><td class='two'></td><td class='dark_border'><span></span></td><td class='three last'></td><td class='four'> </td></tr>");
		if (event.keyCode == 9 || event.keyCode == 13 ) {
			var previous_row = $this.parent().prev();
			var start_value = parseInt($.trim($this.text()));
			$this.text(start_value);
			var value_tosubtract = parseInt(previous_row.children('td.four').text());
			var second_player_value = value_tosubtract - start_value;
			if (second_player_value === GAME.start_value) {
				donotUpdate = true;
				GAME.dartsThrownSecond = 3;
			} else {	
				if ($('#second_start').text() != 0) {
					GAME.dartsThrownSecond = parseInt($this.siblings('td.dark_border').text())
				} else {
					GAME.dartsThrownSecond = GAME.dartsThrownSecond + 3;
				}
				donotUpdate = false;
			}
			var darts_next_round = parseInt($this.siblings('td.dark_border').text()) + 3;
			var returnedValue = GAME.checkValue(start_value, value_tosubtract, GAME.dartsThrownSecond, GAME.second);
			if (returnedValue == false) {
				$this.text('');
				event.preventDefault();
				return false;
			}
		
			if (donotUpdate === false) {
				var objReturned = GAME.calculateAverageScore(second_player_value, GAME.dartsThrownSecond, GAME.start_value);
				GAME.avgPerDartSecond = objReturned.perDart
				GAME.avgPerRoundSecond  = objReturned.perRound
				GAME.updateAverageScore(GAME.avgPerDartSecond, GAME.avgPerRoundSecond, 'secondPlayer');
			}
			var cheatSheetObj = GAME.outEligible(second_player_value);
			$this.next().text(second_player_value).addClass(cheatSheetObj.out);
			
			//here we determine if it's the last row of the table if so we append it
			if ($this.closest("tr").is(":last-child")) {
				table_row.find('td.dark_border').text(darts_next_round).end().appendTo('#middle table');
			} else {
				$this.parent().next().children('.one').attr('contenteditable', true);
			}
		}
	});
}());

/* GAME OVER OVERLAY EVENT */
GAME.events.finishGAME = (function () {
	$('#game_over').on('click', 'a.block', function (event) {
			var which_dart = $(this).attr('data-val');
			var oldValue = GAME.darts_thrown;
			GAME.darts_thrown = GAME.darts_thrown - which_dart;
			var nextDiv = $(this).parent().hide().next();
			nextDiv.removeClass('hide');
			if (GAME.who_won != GAME.daly) {
				var winner = "AWAY"
				nextDiv.children('h3').find('span').text(winner).end().siblings('h4, h5').hide();
			} else {
				var averageScoreObj = GAME.calculateAverageScore(0, GAME.darts_thrown, GAME.start_value, true);
				var winner = "Daly's Pub";
				nextDiv.find('h3 span').text(winner).parent().next().find('span').text(averageScoreObj.perDart);
				GAME.updateAverageScore(averageScoreObj.perDart);
			}
			
			$('#done').click(function() {
				$.colorbox.close();
			});		
	});
}())


/* ONCE WE ADD Eligible class to td cell for out chart we trigger an onclick event for the chart */
GAME.events.outChart = (function () {
	$('table').on('click', 'td.eligible', function (event) {
		var cellValue = $(this).text();
		var callColorbox = function (textValue) {
			var match = "v" + textValue;
			$.colorbox({
				inline:true, 
				href:"#outTable",
				width:"90%",
				opacity:.75,	
				onLoad: function () {			
					$('#outTable').find('td.' + match).css('backgroundColor', 'green');
				},
				onClosed: function () {
					$('#outTable').find('td.' + match).removeAttr('style');
				}	
			}); 
		
		}(cellValue)
	});
}());

// end of GAME.events

// function for outTable to add classes to each value - me being lazy and being a programmer
// this function is called on PAGE load wrapped in anonymous function
(function () {
	  var theTable = document.getElementById('outTable');
	  var rowLength = theTable.firstElementChild.rows.length

		for(i=0; i <rowLength; i++) {
			var tr = theTable.firstElementChild.rows[i];
			var tdLength = tr.children.length
			for(j=0; j<tdLength; j++) {
			   var num = parseInt(tr.children[j].innerHTML)
			   tr.children[j].className = "v" + num
			}
		}
		
		// call overlay on Page Load
		$.colorbox({
			inline:true, 
			href:"#myForm",
			width:"360px",
			height:"500px",
			opacity:.75,
			overlayClose: false,
			onLoad: function () {
				$('#cboxClose').hide();
			},
			onClosed: function () {
				var which_player = $('#which_player').val();
				if (which_player == '') {
					return false;
				}
			}	
		}); // this is called on page load first introductory box
})();




}(window, document));

