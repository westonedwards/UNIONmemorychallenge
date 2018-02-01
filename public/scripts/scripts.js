$(document).ready(() => {
    // Initialize variables
    let randomNumbers = [],
        dataHtml = '',
        cardId = '',
        memoryIndex = [],
        memoryMatches = 0,
        currentPlayer = 0,
        winningPlayer = '',
        winMessage = '',
        dataDisplay = $('#data-display'),
        modal = $('#completeModal'),
        closeButton = $('.close'),
        newGameButton = $('#new-game'),
        players = $('.player');

    // Game and player object setup
    let Game = {
        players: [
            {
                clickCount: 0
            },
            {
                clickCount: 0
            }
        ],
        gameCount: 1
    };

    // Create random number array and push new items to it
    let generateNumbers = (arr) => {
        for(var i = 0; i < 6; i++) {
            let randomNumber = Math.floor(Math.random() * 100);
            if(arr.indexOf(randomNumber) == -1) {
                arr.push(randomNumber);
                arr.push(randomNumber);
            }
            else {
                i--;
                continue;
            }
        }
        return arr;
    };

    // Randomize the array
    let randomizeArray = (array) => {
        array.sort((a, b) => {
            return 0.5 - Math.random();
        });
    };

    // Push results to browser
    let displayHtml = (arr) => {
        dataHtml += '<div class="row">';
        for(var j = 0; j < arr.length; j++) {
            if(j > 1 && j % 4 == 0) {
                dataHtml += '</div><div class="row"><div class="col-md-3 text-center"><div class="card-default"><div class="number-display" id="' + j + '">' + arr[j] + '</div></div></div>';
            }
            else {
                dataHtml += '<div class="col-md-3 text-center"><div class="card-default"><div class="number-display" id="' + j + '">' + arr[j] + '</div></div></div>';
            }
        }
        dataDisplay.hide().html(dataHtml).fadeIn(1500);
    };

    // Check for matches
    let checkForMatch = function(card) {
        memoryIndex.push(card);
        if(memoryIndex.length == 2) {
            if($('#' + memoryIndex[0]).text() == $('#' + memoryIndex[1]).text()) {
                memoryIndex = [];
                memoryMatches++;
                if(memoryMatches == (randomNumbers.length / 2)) {
                    if(Game.gameCount == 2) {
                        if(Game.players[0].clickCount > Game.players[1].clickCount) {
                            winningPlayer = 2;
                            winMessage = $('#game-complete-v1');
                        }
                        else if(Game.players[0].clickCount == Game.players[1].clickCount) {
                            winMessage = $('#game-complete-v2');
                        }
                        else {
                            winningPlayer = 1;
                            winMessage = $('#game-complete-v1');
                        }
                        $('#game-next').css('display', 'none');
                        winMessage.css('display', 'block');
                        $('#winning-player').html(winningPlayer);
                        modal.css('display', 'block');
                    }
                    else {
                        setTimeout(function() {
                            modal.css('display', 'block');
                        },500);
                        nextPlayer();
                    }
                }
            }
            else {
                // Reset cards on a delay
                setTimeout(function() {
                    resetCards(memoryIndex);
                }, 1000);
            }
        }
    };

    // Flips cards back over when there isn't a match
    let resetCards = function(cards) {
        for(var h = 0; h < cards.length; h++) {
            $('#' + cards[h]).css('display', 'none');
            $('#' + cards[h]).parent().css('background', '#000000 url("./public/images/union-logo.png") no-repeat center center');
            $('#' + cards[h]).parent().css('background-size', '75%');
            $('#' + cards[h]).parent().removeClass('rotate');
        }
        cardId = '';
        memoryIndex = [];
    };

    // Switch players when the first game ends
    let switchPlayer = () => {
        for(var k = 0; k < players.length; k++) {
            if($(players[k]).hasClass('player-active')) {
                $(players[k]).removeClass('player-active');
            }
            else {
                $(players[k]).addClass('player-active');
            }
        }
        if(currentPlayer == 0) {
            currentPlayer = 1;
        }
        else {
            currentPlayer = 0;
        }
    };

    // New game setup and reset
    let newGame = (reset) => {
        randomNumbers = [];
        dataHtml = '';
        cardId = '';
        memoryIndex = [];
        memoryMatches = 0;
        generateNumbers(randomNumbers);
        randomizeArray(randomNumbers);
        displayHtml(randomNumbers);
        if(reset == 1) {
            for(var l = 0; l < Game.players.length; l++) {
                Game.players[l].clickCount = 0;
                $('#player-' + [l]).html('');
            }
            if(Game.gameCount == 2) {
                winMessage.css('display', 'none');
                $('#game-next').css('display', 'block');
            }
            Game.gameCount = 1;
            currentPlayer = 0;
            $(players[1]).removeClass('player-active');
            $(players[0]).addClass('player-active');
        }
    };

    // Next player is ran when the first game ends
    let nextPlayer = () => {
        switchPlayer();
        Game.gameCount = 2;
        newGame();
    };

    // Click function when user clicks a card
    $(document).on('click', '.card-default', function() {
        cardId = $(this).children().attr('id');
        $(this).css('background-image', 'none');
        $(this).addClass('rotate');
        let number = $(this).children('.number-display');
        setTimeout(function() {
            number.css('display', 'block');
        },400); // need to set a timeout here
        Game.players[currentPlayer].clickCount++;
        $('#player-' + currentPlayer).html(Game.players[currentPlayer].clickCount);
        checkForMatch(cardId);
    });

    // Modal close
    closeButton.on('click', function(event) {
        event.preventDefault();
        modal.css('display', 'none');
    });

    // Manual new game button
    newGameButton.on('click', function() {
        newGame(1);
    });
});