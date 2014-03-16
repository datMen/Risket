var Risk = {

    /**
     * Settings Object, holding application wide settings
     */
    Settings :{
        globalScale: 0.70,
        colors: {indep: 'white', yellow: '#ff0', black: 'black', green: 'green', blue: 'rgb(0, 184, 255)', red: 'rgb(204, 0, 0)', purple: 'purple', cyan: '#00ffe4'},
        dcolors: {yellow: '#ff0', black: 'black', green: '#004e00', blue: '#00004f', red: 'rgb(104, 0, 0)', purple: 'purple', cyan: '#00ffe4'},
        independentTerritories: 3,
        players: ['black', 'green', 'blue', 'red'],
        playersid: [],
        turnOf: 0,
        playerTroops: {},
        listTroops: {3: 35, 4: 10, 5: 25, 6: 20},
        game_phase: "recruitment",
        connect: true,
        attacker: "",
        defender: "",
        satt: 0,
        sdef: 0,
    },

    /**
     * Our main Territories object
     * It looks like:
     * Territories: {
     *     Alaska: {path: Object, color: String, name: 'Alaska', ...},
     *     ... 
     *  }
     */
     Territories: {Alaska: {color: 'white', armyNum: 10},},

    stage: null,
    mapLayer: null,
    topLayer:  null,
    backgroundLayer: null,

    init: function() {
        //Initiate our main Territories Object, it contains essential data about the territories current state
        Risk.setUpTerritoriesObj();

        //Initiate a Kinetic stage
        Risk.stage = new Kinetic.Stage({
            container: 'map',
            width: 1276,
            height: 750
        });

        Risk.mapLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.topLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.troopsLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.troopsLayer2 = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.drawBackgroundImg();
        Risk.drawTerritories();

        Risk.stage.add(Risk.backgroundLayer);
        Risk.stage.add(Risk.mapLayer);
        Risk.stage.add(Risk.topLayer);
        Risk.stage.add(Risk.troopsLayer);
        Risk.stage.add(Risk.troopsLayer2);

        Risk.mapLayer.draw();

        Risk.divideTerritories();
    },

    /**
     * Initiate the  Risk.Territories Object, this will contain essential informations about the territories 
     */
    setUpTerritoriesObj: function() {
        for(id in TerritoryNames) {

            var pathObject = new Kinetic.Path({
                data: TerritoryPathData[id].path,
                id: id //set a unique id --> path.attrs.id
            });

            //Using a sprite image for territory names
            //see: drawImage() -- https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Using_images , and see Kinetic.Image() docs for more
            var sprite = new Image();
            sprite.src = 'img/collect.gif';
            var territoryNameImg = new Kinetic.Image({
                image: sprite,
                x: FontDestinationCoords[id].x,
                y: FontDestinationCoords[id].y,
                width: FontSpriteCoords[id].sWidth, //'destiantion Width' 
                height: FontSpriteCoords[id].sHeight, //'destination Height'
                crop: [FontSpriteCoords[id].sx, FontSpriteCoords[id].sy, FontSpriteCoords[id].sWidth, FontSpriteCoords[id].sHeight]

            });

            var territoryArmy = new Kinetic.Text({
                    text: 0,
                });

            Risk.Territories[id] = {
                name: TerritoryNames[id],
                path: pathObject,
                nameImg: territoryNameImg,
                color: null,
                neighbours: Neighbours[id],
                armyNum: territoryArmy
            };
        }
        
    },

    drawBackgroundImg: function() {
        Risk.backgroundLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });
        var imgObj = new Image();
        imgObj.src = 'img/map_grey.jpg';
        
        var img = new Kinetic.Image({
            image: imgObj,
            //alpha: 0.8
        });
        Risk.backgroundLayer.add(img);
    },

    drawTerritories: function() {
        for (var t in Risk.Territories) {
            
            var path = Risk.Territories[t].path;
            var nameImg = Risk.Territories[t].nameImg;
            var group = new Kinetic.Group();

            //We have to set up a group for proper mouseover on territories and sprite name images 
            group.add(path);
            Risk.mapLayer.add(group);
        
            //Basic animations 
            //Wrap the 'path', 't' and 'group' variables inside a closure, and set up the mouseover / mouseout events for the demo
            //when you make a bigger application you should move this functionality out from here, and maybe put these 'actions' in a seperate function/'class'
            Risk.actions(path, t, group);
        }
    },

    divideTerritories: function() {

        fillRandomColors();
        addTroops();

        for(var id in Risk.Territories) {

            var color = Risk.Territories[id].color;
            
            var neighbours = Risk.Territories[id].neighbours;

            //a VERY simple algorithm to make the map more equal
            var similarNeighbours = 0;
            for(var i = 0; i < neighbours.length; i++) {

                var currNeighbour = neighbours[i];
                if (Risk.Territories[currNeighbour].color == color) {
                    similarNeighbours++;
                }
            }

            //how many similar neighbours we allow
            if (similarNeighbours > 2) {
                var newColor = getRandomColor();
                while (color == newColor) {
                    var newColor = getRandomColor();
                }
                Risk.Territories[id].color = Risk.Settings.colors['indep'];

                Risk.Territories[id].path.setFill(Risk.Settings.colors['indep']);
                Risk.Territories[id].path.setOpacity(0.5);
                $(".troops").filter("#"+Risk.Territories[id].path.attrs.id).css("background", Risk.Territories[id].color);
                $(".troops").filter("#"+Risk.Territories[id].path.attrs.id).css("border-color", "white");
                $(".troops_main a").filter("#"+Risk.Territories[id].path.attrs.id).css("color", "black");
            }
        }

        Risk.mapLayer.draw();

        function fillRandomColors() {
            for(var id in Risk.Territories) {
                var randcol = getRandomColor();
                var color = Risk.Settings.colors[randcol];
                var dcolor = Risk.Settings.dcolors[randcol];
                Risk.Territories[id].color = color;
                Risk.Territories[id].path.setFill(color);
                Risk.Territories[id].path.setOpacity(0.5);
            }
                
        }

        /**
         * Returns a color name like 'yellow'
         */
        function getRandomColor() {
            var colors = Risk.Settings.players;
            //Math.random() returns between [0, 1), so don't worry
            var randomNum = Math.floor(Math.random()*(colors.length));
            return colors[randomNum];
        }

        function addTroops() {
            defaultTroops = Risk.Settings.listTroops[Risk.Settings.players.length];
            for(var i in Risk.Settings.players) {
                Risk.Settings.playerTroops[Risk.Settings.colors[Risk.Settings.players[i]]] = defaultTroops;
                Risk.Settings.playersid.push(Risk.Settings.colors[Risk.Settings.players[i]]);
            }
            for(var id in Risk.Territories) {
                var playerTroops = Risk.Settings.playerTroops[Risk.Territories[id].color];
                // var randomTroops = Math.floor(Math.random()*(playerTroops/2));
                // Risk.Settings.playerTroops[Risk.Territories[id].color] -= randomTroops;
                Risk.Territories[id].armyNum.attrs.text = 3;
                $(".kineticjs-content").append("<div id='"+Risk.Territories[id].path.attrs.id+"' class='troops_main' style='left: "+ArmyjqPoints[id].x+"; top: "+ArmyjqPoints[id].y+"'><div id='"+Risk.Territories[id].path.attrs.id+"' class='troops' style='background:"+Risk.Territories[id].color+"; border-color: "+Risk.Territories[id].color+"'></div><a href='#' id='"+Risk.Territories[id].path.attrs.id+"'>"+Risk.Territories[id].armyNum.attrs.text+"</a></div>");
            }
            showsStartmessage();
                
        }
        function showsStartmessage() {
            if (Risk.Settings.turnOf === 0) {
                alertWindow(" turn started",  "url(img/arrow_right_gray.png");
                $( ".soldiers_num" ).html("+"+Risk.Settings.playerTroops[Risk.Settings.colors[Risk.Settings.players[Risk.Settings.turnOf]]]);
                $( ".soldiers" ).fadeIn( "slow" , 0, function() {});
                $( ".soldiers_num" ).fadeIn( "slow" , 0, function() {});
        }
                
        }
    },

    recruitTroops: function(id, troops) {
        // checkRemove(id, status);

        var territoryArmy = new Kinetic.Text({
            text: troops
        });
        Risk.Territories[id].armyNum.attrs.text = territoryArmy.attrs.text;
        $(".troops_main a").filter("#"+Risk.Territories[id].path.attrs.id).html(troops);
        $( ".soldiers_num" ).html("+"+(Risk.Settings.playerTroops[Risk.Settings.colors[Risk.Settings.players[Risk.Settings.turnOf]]] - 1));
        $( ".soldiers" ).fadeIn( "slow" , 0, function() {});
        $( ".soldiers_num" ).fadeIn( "slow" , 0, function() {});
    },

    actions: function(path, t, group) {
        group.on('mouseover', function(event) {
            event.preventDefault();
            path.setOpacity(0.3);
            group.moveTo(Risk.topLayer);
            Risk.topLayer.drawScene();
            $(".troops_main a").filter("#"+Risk.Territories[t].path.attrs.id).mouseover(function() {
                if (Risk.Settings.defender === "" && Risk.Settings.attacker === "") {
                    hoverEnemies(t);
                }
            });
        });

        group.on('mouseout', function(event) {
            event.preventDefault();
            path.setFill(Risk.Settings.colors[Risk.Territories[t].color]);
            path.setOpacity(0.4);
            group.moveTo(Risk.mapLayer);
            Risk.topLayer.draw();
            $(".troops_main a").filter("#"+Risk.Territories[t].path.attrs.id).mouseleave(function() {
                if (Risk.Settings.defender === "" && Risk.Settings.attacker === "") {
                    jsPlumb.detachEveryConnection();
                }
                $(".troops_main").filter("#"+Risk.Territories[t].path.attrs.id).animate({
                    width: 25,
                    height: 25,
                    left: (ArmyjqPoints[t].x),
                    top: (ArmyjqPoints[t].y)
                }, 100);
                $(".troops_main a").filter("#"+Risk.Territories[t].path.attrs.id).animate({
                    "line-height": "25px"
                }, 100);
            });
            Risk.Settings.connect = true;
        });

        group.on('click', function(event) {
            event.preventDefault();
            startTurn(t);
        });
    },
}

function startTurn(t) {
    var game_phase = Risk.Settings.game_phase;
    if (game_phase == "recruitment") {
        var currentColor = Risk.Settings.playersid[Risk.Settings.turnOf];
        var currentPlayer = Risk.Settings.players[Risk.Settings.turnOf];
        var currentPlayerName = currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1);
        if (Risk.Territories[t].color == currentColor && Risk.Settings.playerTroops[Risk.Territories[t].color] > 0) {
            Risk.recruitTroops(t, parseInt(""+Risk.Territories[t].armyNum.attrs.text, 10)+1);
            Risk.Settings.playerTroops[Risk.Territories[t].color] -= 1;
            if (Risk.Settings.playerTroops[Risk.Territories[t].color] === 0) {
                if (Risk.Settings.turnOf < (Risk.Settings.players.length-1)) {
                    Risk.Settings.turnOf += 1;
                }
            }
        }
        if (Risk.Settings.turnOf == (Risk.Settings.players.length-1)) {
            alertWindow(" recruitment phase finished", "url(img/arrow_right_green.png");
        }
    }
    else if (game_phase == "attack") {
        var attacker = Risk.Settings.attacker;
        var defender = Risk.Settings.defender;

        if (attacker === "" && Risk.Territories[t].color == Risk.Settings.playersid[Risk.Settings.turnOf]) {
            Risk.Settings.attacker = Risk.Territories[t];
            Risk.Settings.satt = t;
        }
        else {
            if (defender === "" && (Risk.Territories[t].color != Risk.Settings.playersid[Risk.Settings.turnOf]) && (attacker !== "")) {
                Risk.Settings.defender = Risk.Territories[t];
                Risk.Settings.sdef = t;
                jsPlumb.detachEveryConnection();
                jsPlumb.Defaults.Container = $(".kineticjs-content");

                jsPlumb.connect({
                    source: Risk.Settings.attacker.path.attrs.id,
                    endpoint: "Blank",
                    endpointStyle: {fillStyle: "black"},
                    overlays : [["Arrow", { cssClass:"l1arrow", location:0.89, width:20,length:20 }] ],
                    target: Risk.Settings.defender.path.attrs.id,
                    anchor: "Center",
                    paintStyle: { strokeStyle: Risk.Settings.attacker.color, lineWidth: 3 },
                    connector: ["Straight", { minStubLength: 40}]
                });
                $(".attack_button").remove();
                $(".kineticjs-content").append("<div onclick='getWar("+Risk.Settings.attacker.armyNum.attrs.text+", "+Risk.Settings.defender.armyNum.attrs.text+", "+Risk.Settings.satt+", "+Risk.Settings.sdef+")' id='"+Risk.Settings.attacker.path.attrs.id+" "+Risk.Settings.defender.path.attrs.id+"' class='attack_button' style='left: "+(ArmyjqPoints[t].x)+"; top: "+(ArmyjqPoints[t].y+30)+"'><a href='#' class='attack_text'>ATTACK</a></div>");
            }
            else {
                Risk.Settings.attacker = "";
                Risk.Settings.defender = "";
                alertMessage("Select Attacker");
            }
        }
    }
}

function hoverEnemies(t) {
    var game_phase = Risk.Settings.game_phase;
    $(".troops_main").filter("#"+Risk.Territories[t].path.attrs.id).animate({
        width: 35,
        height: 35,
        left: (ArmyjqPoints[t].x-7),
        top: (ArmyjqPoints[t].y-7)
    }, 50);
    $(".troops_main a").filter("#"+Risk.Territories[t].path.attrs.id).animate({
        "line-height": "35px"
    }, 50);
    if (game_phase == "attack") {
        var neighbours = Risk.Territories[t].neighbours;
        var connect = Risk.Settings.connect;
        if (connect) {
            if (Risk.Settings.playersid[Risk.Settings.turnOf] == Risk.Territories[t].color ) {
                for (var i in neighbours) {
                    if (Risk.Territories[t].color != Risk.Territories[neighbours[i]].color) {
                        jsPlumb.Defaults.Container = $(".kineticjs-content");

                        jsPlumb.connect({
                            source: Risk.Territories[t].path.attrs.id,
                            endpoint: "Blank",
                            endpointStyle: {fillStyle: "black"},
                            overlays : [["Arrow", { cssClass:"l1arrow", location:0.89, width:20,length:20 }] ],
                            target: Risk.Territories[neighbours[i]].path.attrs.id,
                            anchor: "Center",
                            paintStyle: { strokeStyle: Risk.Territories[t].color, lineWidth: 3 },
                            connector: ["StateMachine", { minStubLength: 40}]
                        });
   
                    }
                }
            }
        }
        Risk.Settings.connect = false;
    }
}

function finishTurn() {
    var game_phase = Risk.Settings.game_phase;
    if (game_phase == "recruitment") {
        alertWindow(" recruitment phase started", "url(img/arrow_right_gray.png");
    }
    else if (game_phase == "attack") {
        alertWindow(" attack phase started", "url(img/arrow_right_gray.png");
    }
    else if (game_phase == "regroup") {
        alertWindow(" regroup phase started", "url(img/arrow_right_gray.png");
    }
    $( ".soldiers_num" ).html("+"+Risk.Settings.playerTroops[Risk.Settings.colors[Risk.Settings.players[Risk.Settings.turnOf]]]);
    $( ".soldiers" ).fadeIn( "slow" , 0, function() {});
    $( ".soldiers_num" ).fadeIn( "slow" , 0, function() {});
}

function alertWindow(message, background) {
    $( ".alert_window" ).stop();
    var currentColor = Risk.Settings.playersid[Risk.Settings.turnOf];
    var currentPlayer = Risk.Settings.players[Risk.Settings.turnOf];
    var currentPlayerName = currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1);
    $(".alert_window p").html("<span class='player' style='color: white'>"+currentPlayerName+"</span> " + message);
    $( ".alert_window" ).fadeIn( "slow" , 0, function() {});
    $(".next_action").css("background", background);
    setTimeout(function(){ $( ".alert_window" ).fadeOut( "slow" , function() {}); }, 3000);
}

function alertMessage(message) {
    $( ".alert_window" ).stop();
    $(".alert_window p").html(message);
    $( ".alert_window" ).fadeIn( "slow" , 0, function() {});
    setTimeout(function(){ $( ".alert_window" ).fadeOut( "slow" , function() {}); }, 3000);
}

function getWar(atacante, defensor, idatt, iddef) {
    idatt = $(".attack_button").attr('id').split(" ")[0];
    iddef = $(".attack_button").attr('id').split(" ")[1];
    if (defensor > 1 && atacante > 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceWar(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    else if (defensor == 1 && atacante > 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceDoubleWarAtt(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    else if (defensor > 1 && atacante == 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceWar(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    else if (defensor == 1 && atacante == 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceDoubleWarAtt(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    else if (defensor == 1 && atacante == 2) {
        att = [Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceSingleWar(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    else if (defensor > 1 && atacante == 2) {
        att = [Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceDoubleWarDef(att, defensa, idatt, iddef);
        setTimeout(function () {
            if (defensor > 0) {
                getWar(Risk.Territories[idatt].armyNum.attrs.text, Risk.Territories[iddef].armyNum.attrs.text, idatt, iddef);
            }
        }, 10);
    }
    setWar(idatt, iddef);
    if (defensor === 0 || atacante == 1) {
        finishWar(idatt, iddef);
    }
}

function faceWar(ataque, defensa, idatt, iddef) {
    max_att = Math.max.apply( Math, ataque );
    min_att = Math.min.apply( Math, ataque );
    max_def = Math.max.apply( Math, defensa );
    min_def = Math.min.apply( Math, defensa );
    if (max_att > max_def) {
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else if (max_att < max_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
    }
    else if (max_att == max_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    if (min_att > min_def) {
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else if (min_att < min_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
    }
    else if (min_att == min_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    setWar(idatt, iddef);
}
function faceSingleWar(ataque, defensa, idatt, iddef) {
    if (ataque > defensa) {
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else if (ataque < defensa) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
    }
    else if (ataque == defensa) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else {
        console.log("error");
    }
    setWar(idatt, iddef);
}
function faceDoubleWarAtt(ataque, defensa, idatt, iddef) {
    max_att = Math.max.apply( Math, ataque );
    if (max_att > defensa) {
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else if (max_att < defensa) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
    }
    else if (max_att == defensa) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else {
        console.log("error");
    }
    setWar(idatt, iddef);
}
function faceDoubleWarDef(ataque, defensa, idatt, iddef) {
    max_def = Math.max.apply( Math, defensa );
    if (ataque > max_def) {
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else if (ataque < max_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
    }
    else if (ataque == max_def) {
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        Risk.Territories[iddef].armyNum.attrs.text -= 1;
    }
    else {
        console.log("error");
    }
    setWar(idatt, iddef);
}

function setWar(idatt, iddef) {
    // Remove me !
}

function finishWar(idatt, iddef) {
    $(".troops_main").filter("#"+idatt).animate({
        left: (ArmyjqPoints[iddef].x),
        top: (ArmyjqPoints[iddef].y)
    }, 100);
    $(".troops_main").filter("#"+idatt).animate({
        left: (ArmyjqPoints[idatt].x),
        top: (ArmyjqPoints[idatt].y)
    }, 200);
    $(".attack_button").remove();
    $(".troops_main a").filter("#"+idatt).html(Risk.Territories[idatt].armyNum.attrs.text);
    if (Risk.Territories[iddef].armyNum.attrs.text === 0) {
        Risk.Territories[iddef].color = Risk.Territories[idatt].color;
        Risk.Territories[idatt].path.setFill(Risk.Territories[idatt].color);
        Risk.Territories[idatt].path.setOpacity(0.5);
        $(".troops").filter("#"+Risk.Territories[iddef].path.attrs.id).css("background", Risk.Territories[idatt].color);
        $(".troops").filter("#"+Risk.Territories[iddef].path.attrs.id).css("border-color", Risk.Territories[idatt].color);
        $(".troops_main a").filter("#"+Risk.Territories[iddef].path.attrs.id).css("color", "white");
        Risk.Territories[idatt].armyNum.attrs.text -= 1;
        $(".troops_main a").filter("#"+iddef).html(1);
        reDraw();
    }
    else {
        $(".troops_main a").filter("#"+iddef).html(Risk.Territories[iddef].armyNum.attrs.text);
    }
    $(".troops_main a").filter("#"+idatt).html(Risk.Territories[idatt].armyNum.attrs.text);
    Risk.Settings.attacker = "";
    Risk.Settings.defender = "";
    jsPlumb.detachEveryConnection();
    Risk.Settings.connect = true;
}

$( document ).ready(function() {
    $(".alert_window").hide();
    $(".soldiers").hide();
    $(".soldiers_num").hide();
});


function reDraw() {
    for(var id in Risk.Territories) {
        var color = Risk.Territories[id].color;
        Risk.Territories[id].path.setFill(color);
        $(".troops").filter("#"+Risk.Territories[id].path.attrs.id).css("background", Risk.Territories[id].color);
    }
    Risk.mapLayer.drawScene();
}

$(function() {
    $(".next_action").click(function() {
        if ($(".next_action").css("background").match("_green") !== null) {
            if ($(".next_action").css("background").match("_green")[0] == "_green") {
                finishTurn();
                if (Risk.Settings.turnOf == (Risk.Settings.players.length-1)) {
                    Risk.Settings.game_phase = "attack";
                    Risk.Settings.turnOf = 0;
                    alertMessage("Attack phase started");
                }
            finishTurn();
            }
        }
});
});
