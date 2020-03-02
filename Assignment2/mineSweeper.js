function main(){
    mainArr = []
    mainArr = createArr();
    // console.log(mainArr);
    document.getElementById("gameBoard").innerHTML = makeTableHTML(mainArr);;
};

function createArr(){
    const Http = new XMLHttpRequest();
    const url = 'https://veff213-minesweeper.herokuapp.com/api/v1/minesweeper';
    Http.open('POST', url)
    Http.send();
    numOfArr = document.getElementById('rows').value;
    lenOfArr = document.getElementById('columns').value;
    if (numOfArr < 10 || lenOfArr < 10){
        numOfArr = 10;
        lenOfArr = 10;
    }
    mainArr = [];
    
    for (var i = 0; i < numOfArr;){
        smallArr = []
        for (var j = 0; j < lenOfArr;){
            smallArr.push('O')
            j++;
        }
        mainArr.push(smallArr);
        i++;
    }
    Http.onreadystatechange = (e) => {
        value = Http.responseText;
        Obj = JSON.parse(value);
        var MinePos = Obj.board.minePositions
        for (i = 0; i < numOfArr;){
            mainArr[MinePos[i][0]].splice(MinePos[i][1], 1, "X");
            i++;
        };
    };
    return mainArr
}

function makeTableHTML(myArray) {
    var result = "<table border=1>";
    console.log(myArray)
    for(var i=0; i<numOfArr;) {
        result += "<tr>";
        console.log(myArray[i])
        for(var j=0; j<lenOfArr;){
            result += "<td>"+myArray[i][j]+"</td>";
            j++;
        }
        result += "</tr>";
        i++
    }
    result += "</table>";

    return result;
    // for (var i = 0; i < numOfArr;) {
    //     console.log("Array nr" + i + ": " + myArray[i])
    // }
    // console.log(myArray)
    // for (var i = 0; i < numOfArr; i++){
    //     console.log("Nr " + i + ": " + myArray[i])
    // }
}