const photos = {
    joc : ['images/Empty.bmp','images/One.bmp','images/Two.bmp','images/Three.bmp','images/Four.bmp','images/Five.bmp','images/Six.bmp', 'images/Flag.bmp','images/Bomb.bmp','images/WrongBomb.bmp','images/ExplodedBomb.bmp','images/Normal.bmp'],
    ceas: ['images/ceas/Zero.bmp','images/ceas/One.bmp','images/ceas/Two.bmp','images/ceas/Three.bmp','images/ceas/Four.bmp','images/ceas/Five.bmp','images/ceas/Six.bmp','images/ceas/Seven.bmp','images/ceas/Eight.bmp','images/ceas/Nine.bmp','images/ceas/Minus.bmp']
}

const items = {
    empty           : 0,
    steag           : 7,
    bomba           : 8,
    bomba_gresita   : 9,
    bomba_explodata : 10,
    minus           : 10,
    normal          : 11,
}

function _(elmnt){return document.getElementById(elmnt);}
function __(elmnt){return document.getElementsByClassName(elmnt);}
function ___(elmnt){return document.getElementsByTagName(elmnt);}

var game;
var M=[];
var gameOver=false;
var mouseDown = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class MineSweeper{
    
    constructor(nivel){

        var mutunache = 'normal';
        
        this.gameStarted=false;
        this.idTimer=null;
        
        switch (nivel){
            case 'incepator':
                _('id-div').style.backgroundImage = "url('images/backgroundB.bmp')";
                _('id-div').style.height = '314px';
                _('id-div').style.width = '252px';
                this.no_randuri = this.no_coloane= 9;
                this.no_bombe = this.no_flags = 10;
                this.no_cells = this.no_randuri * this.no_coloane-this.no_bombe;
                _('id-table').style.height = _('id-table').style.width = '216px';
                _('controls').style.width = '216px';
            break;
            case 'intermediar':
                _('id-div').style.backgroundImage = "url('images/backgroundI.bmp')";
                _('id-div').style.height = '482px';
                _('id-div').style.width = '420px';
                this.no_randuri = this.no_coloane= 16;
                this.no_bombe = this.no_flags = 40;
                this.no_cells = this.no_randuri * this.no_coloane-this.no_bombe;
                _('id-table').style.height = _('id-table').style.width = '384px';
                _('controls').style.width = '385px';
            break;
            case 'expert':
                _('id-div').style.backgroundImage = "url('images/backgroundE.bmp')";
                _('id-div').style.height = '481px';
                _('id-div').style.width = '756px';
                this.no_randuri = 16;
                this.no_coloane= 30;
                this.no_bombe = this.no_flags = 99;
                this.no_cells = this.no_randuri * this.no_coloane-this.no_bombe;
                _('id-table').style.height='384px';
                _('id-table').style.width='720px';
                _('controls').style.width = '721px';
            break;
        }
      
        if(!gameOver){
            this.CreareaTabelului();
        }
        gameOver = false;

        this.InitializareaMatricei();
        this.PuneBombe();
        this.PuneCifre();
        this.AfisareaMatrice();
        this.Contor();
    }

    CreareaTabelului(){
        var html = '';
        for(var i=1; i<=this.no_randuri; i++){   
            html+='<tr>';
            for(let j=1; j<=this.no_coloane; j++){
                html += `<td id=td-[${i}][${j}]></td>`;
            }
            html+='</tr>\n'
        }
        _('id-table').insertAdjacentHTML('beforeend',html);
    }

    InitializareaMatricei(){
        for(var i=0; i<=this.no_randuri+1; i++){
            M[i] = [];
            for(let j=0; j<=this.no_coloane+1; j++){
                M[i][j]={
                    toggled : false,
                    visible : false,
                    marked : false,
                    value : 0,
                }
            }
        }
    }

    PuneBombe(){
        for(var i=0; i<this.no_bombe; i++){
            var x = random(1,this.no_randuri);
            var y = random(1,this.no_coloane);
            if(x==0 || y==0)i--;
            else if(M[x][y].value==items.bomba)i--;
            else M[x][y].value=items.bomba;
        }
    }

    PuneCifre(){
        for(let i=1; i<=this.no_randuri; i++){
            for(let j=1; j<=this.no_coloane; j++){
                if(M[i][j].value!=items.bomba){
                    for(let k=i-1; k<=i+1; k++){
                        for(let l=j-1; l<=j+1; l++){
                            if(M[k][l].value==items.bomba){
                                M[i][j].value++;
                            }
                        }
                    }
                }
            }
        }
    }

    AfisareaMatrice(){

        //Aici se afiseaza(se face vizibil) un singur element 

        var id = '';
        var noVisibleCells=0;
        for(var i=1; i<=this.no_randuri; i++){
            for(var j=1; j<=this.no_coloane; j++){
                id = `td-[${i}][${j}]`;
                
                //Cazuri stegulete
                if(M[i][j].visible==false){
                    if(M[i][j].marked==true){
                        _(id).style.backgroundImage="url('images/Flag.bmp')"
                        //$('#myImage').attr('draggable', false);
                    }
                    if(M[i][j].marked==false){
                        _(id).style.backgroundImage="url('images/Normal.bmp')"
                    }
                }
                if(M[i][j].marked==false){
                    if(M[i][j].toggled==true &&  M[i][j].visible==false){                         
                        //Cazuri bombe
                        if(M[i][j].value==items.bomba){
                            //Am apasat pe bomba, ups...
                            M[i][j].toggled = false; // Deselectez bomba 
                            gameOver = true; // Jocul s-a terminat
                            clearInterval(this.idTimer); //Se opreste cronometru
                            _('id-mutunache').style.backgroundImage="url('images/DeadFace.bmp')";
                            _(id).style.backgroundImage="url('" + photos.joc[items.bomba_gresita] + "')";
                            M[i][j].value = items.bomba_gresita;//o fac bomba gresita ca sa nu intre in for urile urm cu items.bomba

                            //Descopera celelalte bombe 
                            for(var i=1; i<=this.no_randuri; i++){
                                for(var j=1; j<=this.no_coloane; j++){
                                    id = `td-[${i}][${j}]`;
                                    if(M[i][j].value==items.bomba) 
                                        _(id).style.backgroundImage="url('" + photos.joc[items.bomba_explodata] + "')";
                                }
                            }
                            break;
                        }
                        
                      
                        //Cazuri numere/empty
                        else{
                            if(M[i][j].value==items.empty){
                                //Cazul empty
                               this.AlgoritmVictor();
                            }else{
                                _(id).style.backgroundImage="url('" + photos.joc[M[i][j].value] + "')"; 
                            }
                        }
                        //
                        //Toggled vrea sa insemne celula selectata pe care tr sa o fac vizibila

                        //O fac vizibila pe cea selectata
                        M[i][j].visible=true;
                        //Dupa care o 'deselectez'...
                        M[i][j].toggled=false;

                        //Porneste timer ul 
                        if(game.gameStarted==false){
                            game.Timer();
                        }

                    }
                }
                if(M[i][j].visible){
                    noVisibleCells++;
                }
            }
        }
        // Ai castigat Wohoo!!
        if(this.no_bombe==0 && noVisibleCells==this.no_cells){
            gameOver = true;
            clearInterval(this.idTimer);
            _('id-mutunache').style.backgroundImage="url('images/CoolFace.bmp')";
        }
    }

    AlgoritmVictor(){
        var bVef= true;
        var noVisibleCells=0;
        while(bVef){
            bVef=false;
            for(var i=1; i<=this.no_randuri; i++){
                for(var j=1; j<=this.no_coloane; j++){
                    if(M[i][j].toggled==true){   
                        for(let k=i-1; k<=i+1; k++){
                            for(let l=j-1; l<=j+1; l++){
                                if(M[k][l].value==items.empty && !M[k][l].toggled && !M[k][l].marked){
                                    M[k][l].toggled=true;
                                    M[k][l].visible=true;
                                    bVef=true;
                                }
                                else if(M[k][l].value!=items.bomba && M[k][l].marked==false && M[k][l].visible==false){
                                    M[k][l].visible=true;
                                }
                            }
                        }
                    }
                }
            }
        }
        //Afisare : se afiseaza mai multe elemente 
        for(var i=0; i<=this.no_randuri+1; i++){
            for(var j=0; j<=this.no_coloane+1; j++){
                if((i>=1 && i<=this.no_randuri) && 
                    (j>=1 && j<=this.no_coloane)){
                    if(M[i][j].visible){
                        let id = `td-[${i}][${j}]`;
                        _(id).style.backgroundImage="url('" + photos.joc[M[i][j].value] + "')"; 
                        M[i][j].toggled=false;
                    }
                }
                else{
                    M[i][j].toggled = false;
                }
            }
        }
    }

    Timer(){
        var timer = 0;
        this.gameStarted=true;
      
        const image = new Image(209,35);
        image.src = 'images/figures.bmp'

        this.idTimer=setInterval(()=>{
            var cif = [0,0,0];
            var l = 1;                              //lungimea numarului

            timer++;
            cif[0] = timer % 10;                    //cifra unitatilor
            if(cif[1]!= Math.floor((timer/10)%10)){
                cif[1] = Math.floor((timer/10)%10); //cifra zecilor
                l = 2;                              //nr are 2 cifre
            }
            if(cif[2]!= Math.floor((timer/100))){
                cif[2] = Math.floor((timer/100));   //cifra sutelor
                l = 3;                              //nr are 3 cifre
            }


            //console.log('1 : ',cif[0],' ','2 : ',cif[1],' ','3 : ',cif[2])

            for(let i=1; i<=l; i++){
                ctx.drawImage(image,cif[i-1]*19,0,19,35,(3-i)*19,0,19,35);
            }
        
        }, 1000);
        

    }

    Contor(){
        var cif = [0,0,0];
        var copieFlags;

        //const image = new Image(209,35);
        //image.src = 'images/figures.bmp'
        //const imgb = new Image(19,35)
        //imgb.canvas.drawImage(image,0,0,19,35,0,0,2*19,35);

        copieFlags = Math.abs(this.no_flags);

        cif[0] = copieFlags % 10;                    
        cif[1] = Math.floor((copieFlags/10)%10);

        if(this.no_flags<0){
            if(cif[1]==0)cif[1]=items.minus;
            else cif[2]=items.minus;
        }        

        for(let i=0; i<3; i++){
            let id = `contor[${i+1}]`;
            _(id).style.backgroundImage="url('" + photos.ceas[cif[i]] + "')"; 
            //_(id).style.backgroundImage=imgb; 
            //console.log("url('" + photos.ceas[cif[i]] + "')");
            //_(id).style.background.canvas.drawImage(image,0,0,19,35,0,0,2*19,35);
        }
    }

    restart(){
        gameOver=true;
        clearInterval(this.idTimer);
        const image = new Image(209,35);
        image.src = 'images/figures.bmp'
        for(let i=1; i<=3; i++){
            ctx.drawImage(image,0,0,19,35,(3-i)*19,0,19,35);
        }
    }

}

window.addEventListener('load',()=>{
    var dificultate = localStorage.getItem('data');
    game = new MineSweeper(dificultate);
    

    _('id-table').addEventListener('mousedown',(e)=>{
        // console.log(e.target.id);
        let coord=determinare_coord(e.target.id);

        var x = coord.x;
        var y = coord.y;
        console.log("x: " + x, "   y: " + y);
        //console.log('mousedown');

        if(gameOver==false){
            //Pune Flag
            if(e.button==2 && !M[x][y].visible)
            {    
                if(M[x][y].marked){
                    M[x][y].marked=false; 
                    game.no_flags++;
                    if(M[x][y].value==items.bomba)
                        game.no_bombe++;
                }
                else {
                    M[x][y].marked=true;
                    game.no_flags--;
                    if(M[x][y].value==items.bomba)
                        game.no_bombe--;
                }
                //Afiseaza modif contorului
                game.Contor();

                //Afiseaza schimbarile din matrice
                game.AfisareaMatrice();
            }
            //Casuta selectata de mouse
            else if(!M[x][y].visible && !M[x][y].marked && !gameOver){
                let id = `td-[${x}][${y}]`;
                _(id).style.backgroundImage="url('" + photos.joc[items.empty] + "')";
                M[x][y].toggled=true; 
                mouseDown = true;
            }
        }

       //console.log('Out of mousedown');
    });

    _('id-table').addEventListener('mouseup',(e)=>{
        //console.log(e.target.id);
        let coord=determinare_coord(e.target.id);

        var x = coord.x;
        var y = coord.y;
        mouseDown = false;
        
        if(!gameOver){
            game.AfisareaMatrice();
        }
        //console.log('Out of mouseup');
    });


    _('id-table').addEventListener('mouseover',(e)=>{

        let coord=determinare_coord(e.target.id);

        var x = coord.x;
        var y = coord.y;
        var id= '';

        //mouseinthetableorout=true;
        //console.log("x: " + x, "   y: " + y);

        //console.log("mouseDown: " + mouseDown);

        if(mouseDown && !gameOver){
            for(let k=x-1; k<=x+1; k++){
                for(let l=y-1; l<=y+1; l++){
                    if(M[k][l].toggled){
                        id = `td-[${k}][${l}]`;
                        console.log('x: ',k,' ','y: ',l)
                        _(id).style.backgroundImage="url('" + photos.joc[items.normal] + "')"; 
                        M[k][l].toggled = false;   
                    }
                }
            }
            
            if(!M[x][y].visible && !M[x][y].marked){
                id = `td-[${x}][${y}]`;
                _(id).style.backgroundImage="url('" + photos.joc[items.empty] + "')";    
                M[x][y].toggled = true;
            }
         
        }
        //console.log('Out of mouseover');
    })

    _('id-table').addEventListener('mouseleave',(e)=>{
        //mouseDown=false;
        //console.log('mouseleave');
        //mouseinthetableorout=false;
       
        for(var i=1; i<=game.no_randuri; i++){
            for(var j=1; j<=game.no_coloane; j++){
                if(M[i][j].toggled){
                    //console.log('am gasito')
                    id = `td-[${i}][${j}]`;
                    _(id).style.backgroundImage="url('" + photos.joc[items.normal] + "')"; 
                    M[i][j].toggled = false;
                }
            }
        }
        //console.log('Out of mouselive');
    })


    //Dezactiveaza fereastra(meniul) cand apesi click dreapta
    _('id-table').addEventListener('contextmenu',(e)=>{
        //console.log('s-a activat contextmenu');
        e.preventDefault();
    });
    //Apas pe mutunache
    _('id-mutunache').addEventListener('mousedown',(e)=>{
        _('id-mutunache').style.backgroundImage="url('images/ClickedSmileFace.bmp')";
        game.mutunache='clicked';
    });
    //Revine la normal mutunache
    _('id-mutunache').addEventListener('mouseup',(e)=>{
        _('id-mutunache').style.backgroundImage="url('images/SmileFace.bmp')";
     
        game.restart(); 
        game = null;
        game=new MineSweeper(dificultate);
       
    });
    
    window.addEventListener('mouseup',()=>{
        if(game.mutunache=='clicked') _('id-mutunache').style.backgroundImage="url('images/SmileFace.bmp')";
        mouseDown=false;
        //console.log('winmouseup');
    })

    _('id-table').addEventListener('error', (event) => {
        console.log('s-a produs o eroare');
    });

    _('backToMenu').onclick = ()=>{
        window.location.href = 'MeniuMs.html';
    }

    // const image = new Image(209,35);
    //image.src = 'images/figures.bmp'
    //let id = 'cronometru[1]';

});


function determinare_coord(coord){

    var i = 4, new_x=0, new_y=0;
    while(coord[i]!=']'){
        if(coord[i]>='0' && coord[i]<='9'){
            new_x = new_x*10 + Number(coord[i]);
        }
        i++;
    }
    i=i+2;
    while(coord[i]!=']'){
        if(coord[i]>='0' && coord[i]<='9'){
            new_y = new_y*10 + Number(coord[i]);
        }
        i++;
    }
    return result={
        x: new_x,
        y: new_y,
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
