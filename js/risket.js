var first = false;
function getWar() {
    if (first) {
        $( ".batallon_att" ).finish();
        $( ".batallon_def" ).finish();
        $( ".batallon_att" ).animate({
            left: 0
        }, 50);
        $( ".batallon_def" ).animate({
            right: 0
        }, 50);
    }
    atacante = parseInt($( ".batallon_att .troops" ).html());
    defensor = parseInt($( ".batallon_def .troops" ).html());
    first = true;
    if (defensor > 1 && atacante > 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceWar(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    else if (defensor == 1 && atacante > 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceDoubleWarAtt(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    else if (defensor > 1 && atacante == 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceWar(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    else if (defensor == 1 && atacante == 3) {
        att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceDoubleWarAtt(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    else if (defensor == 1 && atacante == 2) {
        att = [Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1)];
        faceSingleWar(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    else if (defensor > 1 && atacante == 2) {
        att = [Math.floor(Math.random()*6+1)];
        defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
        faceDoubleWarDef(att, defensa);
        setTimeout(function () {
            if (defensor > 0) {
                getWar();
            }
        }, 10);
    }
    setWar(atacante, defensor);
    if (defensor == 0 || atacante == 1) {
        finishWar(atacante, defensor);
    }
}

function faceWar(ataque, defensa) {
    max_att = Math.max.apply( Math, ataque );
    min_att = Math.min.apply( Math, ataque );
    max_def = Math.max.apply( Math, defensa );
    min_def = Math.min.apply( Math, defensa );
    if (max_att > max_def) {
        defensor -= 1;
    }
    else if (max_att < max_def) {
        atacante -= 1;
    }
    else if (max_att == max_def) {
        atacante -= 1;
        defensor -= 1;
    }
    if (min_att > min_def) {
        defensor -= 1;
    }
    else if (min_att < min_def) {
        atacante -= 1;
    }
    else if (min_att == min_def) {
        atacante -= 1;
        defensor -= 1;
    }
    setWar(atacante, defensor);
}
function faceSingleWar(ataque, defensa) {
    if (ataque > defensa) {
        defensor -= 1;
    }
    else if (ataque < defensa) {
        atacante -= 1;
    }
    else if (ataque == defensa) {
        atacante -= 1;
        defensor -= 1;
    }
    else {
        console.log("error");
    }
    setWar(atacante, defensor);
}
function faceDoubleWarAtt(ataque, defensa) {
    max_att = Math.max.apply( Math, ataque );
    if (max_att > defensa) {
        defensor -= 1;
    }
    else if (max_att < defensa) {
        atacante -= 1;
    }
    else if (max_att == defensa) {
        atacante -= 1;
        defensor -= 1;
    }
    else {
        console.log("error");
    }
    setWar(atacante, defensor);
}
function faceDoubleWarDef(ataque, defensa) {
    max_def = Math.max.apply( Math, defensa );
    if (ataque > max_def) {
        defensor -= 1;
    }
    else if (ataque < max_def) {
        atacante -= 1;
    }
    else if (ataque == max_def) {
        atacante -= 1;
        defensor -= 1;
    }
    else {
        console.log("error");
    }
    setWar(atacante, defensor);
}

function setWar(atacante, defensor) {
    $( ".batallon_att" ).animate({
        left: 140,
        borderBottomLeftRadius: 10
    }, 50, function() {
        $( ".batallon_att .troops" ).text(atacante).fadeIn();
    });
    $( ".batallon_def" ).animate({
        right: 140,
        borderTopRightRadius: 10
    }, 50, function() {
        $( ".batallon_def .troops" ).text(defensor).fadeIn();
    });
}

function finishWar(atacante, defensor) {
    $( ".batallon_att" ).animate({
        left: 0,
        borderBottomLeftRadius: 100
    }, 500);
    $( ".batallon_def" ).animate({
        right: 0,
        borderTopRightRadius: 100
    }, 500, function() {
        if (defensor == 0 && atacante > 1) {
            $( ".batallon_def" ).finish();
            $( ".batallon_def .troops" ).animate({
            'color': 'gray'
            },500);
            $( ".batallon_def" ).animate({
            'backgroundColor': 'rgb(213, 213, 213)',
            'border-color': 'rgb(122, 122, 122)'
            },500);
            $( ".defensa" ).animate({
                'backgroundColor': 'rgb(173, 173, 173)',
                'border-color': 'rgb(122, 122, 122)'
            },500);
    }
    });
}

$(function() {
    $("#defensor").keyup(function() {
        $( ".batallon_def .troops" ).text($( this ).val());
        if (first) {
            $( ".batallon_def" ).finish();
            $( ".batallon_def .troops" ).animate({
            'color': 'green'
            },500);
            $( ".batallon_def" ).animate({
            'backgroundColor': 'rgb(142, 255, 142)',
            'border-color': 'rgb(0, 71, 0)'
            },500);
            $( ".defensa" ).animate({
                'backgroundColor': 'green',
                'border-color': 'rgb(0, 71, 0)'
            },500);
        }
    });
    $("#atacante").keyup(function() {
        $( ".batallon_att .troops" ).text($( this ).val());
    });
    $(".input").keypress(function(e) {
    if(e.which == 13) {
        getWar();
    }
});
});