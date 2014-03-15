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
        playerTroops: {},
        listTroops: {3: 35, 4: 30, 5: 25, 6: 20},
        adding: true,
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
                $(".troops_main a").filter("#"+Risk.Territories[id].path.attrs.id).css("color", "black");
            }
        }

        Risk.mapLayer.draw();

        function addTroops() {
            defaultTroops = Risk.Settings.listTroops[Risk.Settings.players.length];
            for(var i in Risk.Settings.players) {
                Object.defineProperty(Risk.Settings.playerTroops, Risk.Settings.colors[Risk.Settings.players[i]], {value: defaultTroops});
            }
            for(var id in Risk.Territories) {
                var playerTroops = Risk.Settings.playerTroops[Risk.Territories[id].color];
                var randomTroops = Math.floor(Math.random()*(playerTroops/2));
                Risk.Settings.playerTroops[Risk.Territories[id].color] -= randomTroops;
                Risk.divideTroops(id, 0, false); // USING 0 UNTIL BETTER RANDOMTROOPS
            }
                
        }

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
    },

    divideTroops: function(id, troops, status) {
        checkRemove(id, status);

        var territoryArmy = new Kinetic.Text({
            text: troops,
            fill: '#fff',
            fontSize: 15,
            fontStyle: 'bold',
            fontFamily: 'Arial',
            x: ArmyPoints[id].x,
            y: ArmyPoints[id].y,
            align: 'center',
            id: Risk.Territories[id].color,
            name: Risk.Territories[id].path.attrs.id
        });
        var armyNum = Risk.Territories[id].armyNum;
        armyNum = territoryArmy;
        Risk.Territories[id].armyNum.attrs.text = territoryArmy.attrs.text;
        Risk.troopsLayer.add(armyNum);
        Risk.troopsLayer.draw();

        function checkRemove(id, remove) {
            if (remove == 1) {
                Risk.troopsLayer2.removeChildren();
                Risk.troopsLayer2.draw();
                for(var t in Risk.Territories) {
                    var territoryArmy = new Kinetic.Text({
                        text: Risk.Territories[t].armyNum.attrs.text,
                        fill: '#fff',
                        fontSize: 15,
                        fontStyle: 'bold',
                        fontFamily: 'Arial',
                        x: ArmyPoints[t].x,
                        y: ArmyPoints[t].y,
                        align: 'center',
                        id: Risk.Territories[t].color,
                        name: Risk.Territories[t].path.attrs.id
                    });
                    if (Risk.Territories[t] != Risk.Territories[id]) {
                        Risk.troopsLayer2.add(territoryArmy);
                    }
                }
                Risk.troopsLayer2.draw();
                Risk.troopsLayer.removeChildren();
                Risk.troopsLayer.draw();
            }
            else if (remove == 2) {
                Risk.troopsLayer.removeChildren();
                Risk.troopsLayer.draw();
                for(var t in Risk.Territories) {
                    var territoryArmy = new Kinetic.Text({
                        text: Risk.Territories[t].armyNum.attrs.text,
                        fill: '#fff',
                        fontSize: 15,
                        fontStyle: 'bold',
                        fontFamily: 'Arial',
                        x: ArmyPoints[t].x,
                        y: ArmyPoints[t].y,
                        align: 'center',
                        id: Risk.Territories[t].color,
                        name: Risk.Territories[t].path.attrs.id
                    });
                    if (Risk.Territories[t] != Risk.Territories[id]) {
                        Risk.troopsLayer.add(territoryArmy);
                    }
                }
                Risk.troopsLayer.draw();
                Risk.troopsLayer2.removeChildren();
                Risk.troopsLayer2.draw();
            }
        }
    },

    actions: function(path, t, group) {
        group.on('mouseover', function() {
            path.setOpacity(0.3);
            group.moveTo(Risk.topLayer);
            Risk.topLayer.drawScene();
        });

        group.on('mouseout', function() {
            path.setFill(Risk.Settings.colors[Risk.Territories[t].color]);
            path.setOpacity(0.4);
            group.moveTo(Risk.mapLayer);
            Risk.topLayer.draw();
        });

        group.on('click', function() {
            var status = Risk.Settings.status;
            var adding = Risk.Settings.adding;
            if (adding == true) {
                console.log(parseInt(""+Risk.Territories[t].armyNum.attrs.text, 10));
                Risk.divideTroops(t, parseInt(""+Risk.Territories[t].armyNum.attrs.text, 10)+1, status);
                if (Risk.Settings.playerTroops[Risk.Territories[id].color] == 0) {
                    Risk.Settings.adding = false;
                }
                Risk.Settings.playerTroops[Risk.Territories[id].color] -= 1;
            }
            else {
                Risk.divideTroops(t, 1, status);
            }
            if (status == 1) {
                Risk.Settings.status = 2;
            }
            else if (status == 2) {
                Risk.Settings.status = 1;
            }
            console.log(path.attrs.id);
            console.log(Risk.Territories[t].armyNum.attrs.text);
            location.hash = path.attrs.id;
        });
    }
}
