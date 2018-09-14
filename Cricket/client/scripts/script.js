var players = [];

function addPlayers() {
    var total = players.length;
    var leftPlayers = players.slice(0,total/2);
    var rightPlayers = players.slice(total/2,total);
    addPlayersInDivId("left",leftPlayers);
    addPlayersInDivId("right",rightPlayers);
}

function addPlayersInDivId(id,players) {
    var left = document.getElementById(id);
    //var childHtml = '<div class="playerBox draggable" draggable="true" id="playerId"> <label class="playerName">Player Name</label> <img src="client/assets/bot.png"> <label class="playerId">Player Number</label> </div>';
    var childHtml = '<div class="playerBox draggable" draggable="true" id="playerId"> <label class="playerName">Player Name</label> <img src="client/assets/bot.png"> </div>';
    for (var i = 0; i < players.length; i++) {
        var playerName = players[i].name;
        var playerId = players[i].id;
        var dynamicChildHtml = childHtml.replace("playerId",playerId).replace("Player Name",playerName).replace("Player Number",playerId);
        left.innerHTML = left.innerHTML + dynamicChildHtml;
    };
}

function placePlayers(players) {
    players.forEach(function(player) {
        $( "#"+player.id ).offset(player.offset);
    });    
}

function addPlayer(event) {
    var playerName = prompt("Please enter player name", "Player Name","Player Number");
    // var playerNumber = prompt("Please enter player Number", "Player Number");
    var playerNumber = '';
    if (playerName != null && playerName != "Player Name" && playerNumber != null && playerNumber != "Player Number") {
        var player = {
            "id": playerNumber,
            "name": playerName,
            "offset": {
                "top": "100",
                "left": "10"
            }
        }
        players.push(player);
        addPlayersInDivId("left",[player]);
        $( ".draggable" ).draggable({
            drag: savePosition
        });
        $( ".draggable" ).dblclick(removePlayer);
    }
}

function removePlayer(event) {
    if (players.length <= 1) {
        return;
    }
    if (confirm("Are you confirm!") == true) {
        var id = this.id;
        var player = players.filter(function(player) {
            return id == player.id;
        })[0];
        players.splice(players.indexOf(player),1);
        $(this).remove();
    }
}

function savePlayers () {
    var data = { 
        "players":players
    };
    $.post( "../Cricket/server/data/data.json", data, function( data ) {
        console.log(data);
  });
}

function savePosition(event) {
    var offset = $(this).offset();
    console.log(offset.top + ',' + offset.left);
    var id = this.id;
    var player = players.filter(function(player) {
        return id == player.id;
    })[0].offset = offset;
}

$.getJSON( "../Cricket/server/data/data.json", function( data ) {
    //log
  players = data.players;
  addPlayers();
  // placePlayers(players);
  $( ".draggable" ).draggable({
    drag: savePosition
    });
  $( ".draggable" ).dblclick(removePlayer);
});