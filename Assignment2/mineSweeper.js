var mineImage = '<img src="prj02_suppl/bomb.png">';
var flagImage = '<img src="prj02_suppl/flag.png">';
var mine_hit;
var winner;

async function main() {
    const mainArr = await createArr();
    console.log(mainArr);
    document.getElementById("gameBoard").innerHTML = makeTableHTML(mainArr);
};

function createArr(){
    const url = 'https://veff213-minesweeper.herokuapp.com/api/v1/minesweeper';
    var rowLength = parseInt(document.getElementById('rows').value);
    var colLength = parseInt(document.getElementById('columns').value);
    if (rowLength < 10 || colLength < 10){
        rowLength = 10;
        colLength = 10;
    }
    mainArr = [];
    for (var i = 0; i < rowLength; i++){
        mainArr.push(Array(colLength).fill(' '));
    }
    return fetch(url, {method: 'POST',
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
            mainArr[MinePos[i][0]].splice(MinePos[i][1], 1, "X");
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
            result += "<td>"+myArray[i][j]+"</td>";
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
                if (myArray[i][j] != 'X'){
                    if (myArray[i][j+1] == "X"){
                        mineCount++;
                    }
                    if (myArray[i][j-1] == "X"){
                        mineCount++;
                    }
                    if (myArray[i+1] != null){
                        for (var x = j-1; x <= j+1; x++){
                            if (myArray[i+1][x] == 'X'){
                                mineCount++;
                            }
                        }
                    }
                    if (myArray[i-1] != null){
                        for (var x = j-1; x <= j+1; x++){
                            if (myArray[i-1][x] == 'X'){
                                mineCount++;
                            }
                        }
                    }
                    if (mineCount != 0){
                        myArray[i].splice(j, 1 , mineCount)
                    }
            }
            }
            console.log("myArray[" + i + "][" + j + "]: " + mineCount);
        }
    }
    return myArray;
}