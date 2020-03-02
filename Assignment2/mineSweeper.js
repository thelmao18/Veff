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
        mainArr.push(Array(colLength).fill('O'));
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