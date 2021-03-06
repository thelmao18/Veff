var mineImage = '<img src="prj02_suppl/bomb.png">';
var flagImage = '<img src="prj02_suppl/flag.png">';
var mine_hit;
var won = false;
var lost = false;
var revealed = 0;
var remaining = mines;

async function main() {
    const mainArr = await createArr();
    console.log(mainArr);
    document.getElementById("gameBoard").innerHTML = makeTableHTML(mainArr);
};

function RevealArray(myArray){
    var x=false;
    var reveal=[];
    for(var i=0; i<myArray.rowLength; i++){
        reveal.push(Array(myArray.colLength).fill(x))
    }
};

function click(event){
    // Breyta xxx fylkinu þannig að stak i,j er orðið true
    var source = event.target;
    id = source.id;

    if (event.)
    window.addEventListener('click', function (e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
    })
};

function createArr(){
    const url = 'https://veff213-minesweeper.herokuapp.com/api/v1/minesweeper';
    var rowLength = parseInt(document.getElementById('rows').value);
    var colLength = parseInt(document.getElementById('columns').value);
    var mines = parseInt(document.getElementById('mines').value);
    if (rowLength < 10 || colLength < 10 || mines < 10){
        rowLength = 10;
        colLength = 10;
        mines = 10;
    } 
    const body = {
        rows: (rowLength > 10 ? rowLength : 10), 
        cols:(colLength> 10 ? colLength : 10), 
        mines: (mines > 10 ? mines : 10)
    };
    mainArr = [];
    for (var i = 0; i < rowLength; i++){
        mainArr.push(Array(colLength).fill(' '));
    }
    return fetch(url, {method: 'POST', 
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
      },})
    .then((response) => {
        if(response.status >=200 && response.status < 300) {
            return response.json();
        } else {
            console.warn('Error in post request');
        }

    }).then(jsonValue => {
        var MinePos = jsonValue.board.minePositions
        for (i = 0; i < MinePos.length; i++){
            mainArr[MinePos[i][0]].splice(MinePos[i][1], 1, src="prj02_suppl/bomb.png");
        };
        mainArr = detectMines(mainArr)
        return mainArr;
    });
    
}

function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            // if xxx[i][j]==true
            if (myArray[i][j] == "prj02_suppl/bomb.png"){
                result += "<td style='background-color:red;'><img src='" + myArray[i][j] + "'></img></td>"
            }else{
                result += "<td>"+myArray[i][j]+"</td>";
            }
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

function detectMines(myArray){
    for (let i = 0; i < myArray.length; i++){
        for (var j = 0; j < myArray[i].length; j++){
            mineCount = 0
            if (myArray[i][j+1] || myArray[i][j-1] != null){
                if (myArray[i][j] != 'prj02_suppl/bomb.png'){
                    if (myArray[i][j+1] == "prj02_suppl/bomb.png"){
                        mineCount++;
                    }
                    if (myArray[i][j-1] == "prj02_suppl/bomb.png"){
                        mineCount++;
                    }
                    if (myArray[i+1] != null){
                        for (var x = j-1; x <= j+1; x++){
                            if (myArray[i+1][x] == 'prj02_suppl/bomb.png'){
                                mineCount++;
                            }
                        }
                    }
                    if (myArray[i-1] != null){
                        for (var x = j-1; x <= j+1; x++){
                            if (myArray[i-1][x] == 'prj02_suppl/bomb.png'){
                                mineCount++;
                            }
                        }
                    }
                    if (mineCount != 0){
                        myArray[i].splice(j, 1 , mineCount)
                    }
            }
            }
        }
    }
    return myArray;
}

function displayWin() {
    won = true;

}

function displayLoss() {
    if (lost) return;
    lost = true;

}