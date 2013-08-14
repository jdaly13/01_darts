
(function (w,d) {
	 $.fn.dartScore = function(options) {
	// we declare our GAME properties here before we give them values in our script
		w.GAME = GAME = {};
		GAME.start_value = null;
		GAME.first_player_value = null;
		GAME.second_player_value = null;
		GAME.darts_thrown = null;
		GAME.extra_row = null;
		GAME.mainPlayer = null;
		GAME.who_won = null;
		GAME.dartsThrownFirst = 3;
		GAME.dartsThrownSecond = 3;
		// common strings we use to determine first or second player
		GAME.first = "first";
		GAME.second = "second";
		
		GAME.events = {}; //seperate html logic from function logic

		GAME.defaults = {
			firstStart: '#start',
			secondStart: '#second_start',
			notValidPopUp: '#warning',
			colorboxWidth: '360px',
			colorboxHeight: '500px',
			colorboxOpacity: .75,
			gameOverPopUp: '#game_over',
			dartsThrownColumn: 'td.dark_border',
			inline:true,
			gameOver:"#game_over",
			onLoad: function () { $('#cboxClose').hide(); },
			whichGame: "#which_game",
			yourTeam: "Daly's",
			whichPlayer: "#which_player",
			firstShooter: "#left h1 span",
			secondShooter: "#right h1 span",
			newGameButton: "#new_game",
			perDartElementFirst: "#left > div.per_dart > h3 span"
		}
		
		GAME.settings = $.extend({}, GAME.defaults, options);
		// here we filter out what was entered by user for score
		GAME.checkValue = function (num, score, dartsThrown, firstOrSecond) {  
			if ((isNaN(num) || num == '' || num > 180 || num > score) && num !==0) {
					$.colorbox({
						inline:GAME.settings.inline, 
						href:GAME.settings.notValidPopUp,
						width:GAME.settings.colorboxWidth,
						height:GAME.settings.colorboxHeight,
						opacity:GAME.settings.colorboxOpacity
					});
					
				return false		
				} 
			
			if (num == score) {
				GAME.darts_thrown = dartsThrown;
				GAME.who_won = firstOrSecond;
				$.colorbox({
					inline:GAME.settings.inline, 
					href:GAME.settings.gameOverPopUp,
					width:GAME.settings.colorboxWidth,
					height:GAME.settings.colorboxHeight,
					opacity:GAME.settings.colorboxOpacity,
					overlayClose: false,
					onLoad: function () {
						$('#cboxClose').hide();
					}	
				});
				return true
			} 
		} // end of checkValue function

		GAME.checkForZeroValue = function (obj) {
			var dartsthrown = (obj.first === true) ? 'dartsThrownFirst' : 'dartsThrownSecond';		
			if (obj.playerVal === obj.gameStartValue) {
				obj.donotUpdate = true;
				GAME[dartsthrown] = 0;
			} else {
				if (obj.firstElement.text() != 0) {
					GAME[dartsthrown] = parseInt(obj.thisEle.siblings(GAME.settings.dartsThrownColumn).text());
				} else {
					GAME[dartsthrown] = GAME[dartsthrown] + 3;
				}
				obj.donotUpdate = false;
			}
			return obj.donotUpdate;
		}

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
					currentScore = gameStartValue - currentScore;
					obj.perRound = parseInt(currentScore / (dartsThrown / 3));
					obj.perDart = Math.round(parseInt(currentScore / dartsThrown));
					return obj;
					
		} // end of calculateAverageScore


		GAME.events.initialOverlay = function () {
			$('#myForm #block p').next('label').text(GAME.settings.yourTeam).next('input').val(GAME.settings.yourTeam);
			$('#myForm #block').next('div').children('label').text(GAME.settings.yourTeam + ' player');
			$('#myForm a').on('click', function (e) { // initial overlay form
				var valueOfUnchecked;
				var which_game = $(GAME.settings.whichGame).val(); // select box to choose value of 01 game e.g. 301
				var which_player = $(GAME.settings.whichPlayer).val(); // The main player's name	
				if (which_player == '') { // some form validation to make sure box isn't empty
					$(GAME.settings.whichPlayer).prev().prev().html("<span style='font-weight:bold'>please write in a player name!</span>");
					return false;
				}
				$('#middle table td.to_go').text(which_game); // show game value within table
				GAME.start_value = parseInt(which_game); // make the start value a property of the main OBJECT
				which_player = GAME.settings.yourTeam + " Shooter: " + which_player;  //append which Player value to yourTeam's shooter
				var valueOfTheCheckedRadio = $('[name=who_goes]:checked').val(); // checked value to see who goes first radio button
				if (valueOfTheCheckedRadio === GAME.settings.yourTeam) {
					GAME.mainPlayer = "first";
					$('#left h2 span').text(which_player).parent().removeClass('hide');
					valueOfUnchecked = "Away"
				} else {
					GAME.mainPlayer = "second";
					$('#right h2 span').text(which_player).parent().removeClass('hide');
					valueOfUnchecked = GAME.settings.yourTeam
				}
				
				$(GAME.settings.firstShooter).text(valueOfTheCheckedRadio);
				$(GAME.settings.secondShooter).text(valueOfUnchecked);
				
				$.colorbox.close();
				e.preventDefault();

			})
		};

		// the first box is highlighted as user cue - we remove color on click focus 
		GAME.events.firstClick = function () {
			$(GAME.settings.firstStart).on('focus', function () {
				$(this).css('background-color', 'white');
			});
		};


		// clear out board for each new game start - client side approach
		GAME.events.newGAME = function () {
			$(GAME.settings.newGameButton).on("click", function () {
				window.location.reload(true);
			});
		};


		//left side scoring or first player
		GAME.events.firstPersonScoring = function () {
			$('table').on('keydown', 'td.one', function (event) {
				var $this = $(this);
				var donotUpdate = null;
				if (event.keyCode == 9 || event.keyCode == 13 ) {
					var start_value = parseInt($.trim($this.text()));
					$this.text(start_value);
					if (event.currentTarget.id === 'start' && start_value == 0) {
						GAME.first_player_value = GAME.start_value;
						GAME.dartsThrownFirst = 0;
						var value_tosubtract = GAME.first_player_value;
						var first_player_value = value_tosubtract;
					} else if (event.currentTarget.id === "start"  && start_value !== 0) {
						GAME.first_player_value = GAME.start_value - start_value;
						GAME.dartsThrownFirst = 3;
						var value_tosubtract = GAME.first_player_value;
						var first_player_value = value_tosubtract;
					} else {
						var value_tosubtract = GAME.first_player_value;
						var first_player_value = value_tosubtract - start_value;
					}
					
					var returnedValue = GAME.checkValue(start_value, value_tosubtract, GAME.dartsThrownFirst, GAME.first);
					if (returnedValue == false) {
						$this.text('');
						event.preventDefault();
						return false;
					}
					
					donotUpdate = GAME.checkForZeroValue({
						playerVal:first_player_value, 
						gameStartValue:GAME.start_value,
						firstElement:$(GAME.settings.firstStart),
						thisEle: $this,
						donotUpdate:null,
						first:true
					});
				
					if (donotUpdate === false) {
						var objReturned = GAME.calculateAverageScore(first_player_value, GAME.dartsThrownFirst, GAME.start_value, start_value );
						GAME.avgPerDart = objReturned.perDart
						GAME.avgPerRound = objReturned.perRound
						var perDartelement = $('#left > div.per_dart > h3 span');
						var perRoundelement = $('#left > div.per_round > h3 span');
						perDartelement.text(GAME.avgPerDart);
						perRoundelement.text(GAME.avgPerRound);					
					}
						
						var cheatSheetObj = GAME.outEligible(first_player_value);
						$this.next().text(first_player_value).addClass(cheatSheetObj.out).next().next().attr('contenteditable', true);
						GAME.first_player_value = first_player_value
				}
			});
		};

		//right side scoring whose second scoring
		GAME.events.SecondPlayerScoring = function () {
			$('table').on('keydown', 'td.three', function (event) {
				var donotUpdate = null;
				var $this = $(this);
				// we append this table row after a certain amount
				var table_row = $("<tr class='inserted'><td class='one' contenteditable='true'></td><td class='two'></td><td class='dark_border'><span></span></td><td class='three last'></td><td class='four'> </td></tr>");
				if (event.keyCode == 9 || event.keyCode == 13 ) {
					var start_value = parseInt($.trim($this.text()));
					$this.text(start_value);
					if (event.currentTarget.id === 'second_start' && start_value == 0) {
						GAME.second_player_value = GAME.start_value;
						GAME.dartsThrownSecond = 0;
						var value_tosubtract = GAME.second_player_value;
						var second_player_value = value_tosubtract;						
					} else if (event.currentTarget.id === "second_start"  && start_value !== 0) {
						GAME.second_player_value = GAME.start_value - start_value;
						GAME.dartsThrownSecond = 3;
						var value_tosubtract = GAME.second_player_value;
						var second_player_value = value_tosubtract;
					} else {
						var value_tosubtract = GAME.second_player_value;
						var second_player_value = value_tosubtract - start_value;
					}

					var returnedValue = GAME.checkValue(start_value, value_tosubtract, GAME.dartsThrownSecond, GAME.second);
					if (returnedValue == false) {
						$this.text('');
						event.preventDefault();
						return false;
					}
					donotUpdate = GAME.checkForZeroValue({
						playerVal:second_player_value, 
						gameStartValue:GAME.start_value,
						firstElement:$(GAME.settings.secondStart),
						thisEle: $this,
						donotUpdate:null,
						first:false
					});
					var darts_next_round = parseInt($this.siblings('td.dark_border').text()) + 3;
					
				
					if (donotUpdate === false) {
						var objReturned = GAME.calculateAverageScore(second_player_value, GAME.dartsThrownSecond, GAME.start_value);
						GAME.avgPerDartSecond = objReturned.perDart
						GAME.avgPerRoundSecond  = objReturned.perRound
						var perDartelement = $('#right > div.per_dart > h3 span');
						var perRoundelement = $('#right > div.per_round > h3 span');
						perDartelement.text(GAME.avgPerDartSecond);
						perRoundelement.text(GAME.avgPerRoundSecond);
					}
					var cheatSheetObj = GAME.outEligible(second_player_value);
					$this.next().text(second_player_value).addClass(cheatSheetObj.out);
					GAME.second_player_value = second_player_value;
					//here we determine if it's the last row of the table if so we append it
					if ($this.closest("tr").is(":last-child")) {
						table_row.find('td.dark_border').text(darts_next_round).end().appendTo('#middle table');
					} else {
						$this.parent().next().children('.one').attr('contenteditable', true);
					}
				}
			});
		};

		/* GAME OVER OVERLAY EVENT */
		GAME.events.finishGAME = function () {
			$('#game_over').on('click', 'a.block', function (event) {
					var which_dart = $(this).attr('data-val');
					var howMany = GAME.who_won === GAME.first ? GAME.dartsThrownFirst : GAME.dartsThrownSecond;
					console.log(howMany);
					GAME.darts_thrown = howMany - which_dart;
					var nextDiv = $(this).parent().hide().next();
					nextDiv.removeClass('hide');
					if (GAME.who_won != GAME.mainPlayer) {
						var winner = "AWAY"
						nextDiv.children('h3').find('span').text(winner).end().siblings('h4, h5').hide();
					} else {
						var objReturned = GAME.calculateAverageScore(0, GAME.darts_thrown, GAME.start_value);
						GAME.avgPerDart = objReturned.perDart
						GAME.avgPerRound = objReturned.perRound
						var winner = GAME.settings.yourTeam;
						nextDiv.find('h3 span').text(winner).parent().next().find('span').text(GAME.avgPerDart);
						var div = (GAME.mainPlayer === GAME.first) ? "#left" : "#right"
						var perDartelement = $(div + ' > div.per_dart > h3 span');
						var perRoundelement = $(div + ' > div.per_round > h3 span');
						perDartelement.text(GAME.avgPerDart);
						perRoundelement.text(GAME.avgPerRound);
					}
					
					$('#done').click(function() {
						$.colorbox.close();
					});		
			});
		};


		/* ONCE WE ADD Eligible class to td cell for out chart we trigger an onclick event for the chart */
		GAME.events.outChart = function () {
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
		};
		
		// function for outTable to add classes to each value - me being lazy and being a programmer
		GAME.events.lazyTable = function () {
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
		};

		// end of GAME.events




		GAME.init = function () {
			$.colorbox({
					inline:true, 
					href:"#myForm",
					width:GAME.settings.colorboxWidth,
					height:GAME.settings.colorboxHeight,
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
			}); 
			GAME.events.lazyTable();
			GAME.events.initialOverlay();
			GAME.events.firstClick();
			GAME.events.firstPersonScoring ();
			GAME.events.SecondPlayerScoring ();
			GAME.events.outChart();
			GAME.events.finishGAME ();
			GAME.events.newGAME();
		}

		

		GAME.init();
	  
	 
	}
}(window, document));

$().dartScore({colorboxWidth:'400px'});



