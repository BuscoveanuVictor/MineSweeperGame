function _(elmnt){return document.getElementById(elmnt);}
function __(elmnt){return document.getElementsByClassName(elmnt);}
function ___(elmnt){return document.getElementsByTagName(elmnt);}

function DificultateaAleasa(nivel){

    window.location.href = 'MS.html';
    localStorage.removeItem('data');

    switch(nivel){
        case 'Beginner':
            localStorage.setItem('data','incepator');
        break;
        case 'Intermediate':
            localStorage.setItem('data','intermediar');
        break;
        case 'Expert':
            localStorage.setItem('data','expert');
        break;
    }
}