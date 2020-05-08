// Create Grid

var grid = document.getElementById("grid")

var blobs = [];
var posHistRow = [];
var posHistCol = [];
var foodLoc = [];
var backLoc = []


function getRandomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(
    resolve => setTimeout(resolve, ms));
}

function isArrayInArray(arr, item){
    var item_as_string = JSON.stringify(item);

    var contains = arr.some(function(ele){
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}


// first loop create row
for (let i = 0; i < 20; i++) {

    var row = document.createElement("tr");
    row.setAttribute("id", "row-" + i);
    grid.appendChild(row);

    for (let j = 0; j < 38; j++) {
        // create cell
        var cell = document.createElement("td");
        cell.setAttribute("id", "cell-" + i + "-" + j);
        document.getElementById("row-" + i).appendChild(cell)
    }
}

function moveBlob(last=false) {
    // move the blob
    for (let i = 0; i < blobs.length; i++) {

        if (blobs[i]["status"] != "replicate") {
            var cell = document.getElementById("cell-" + blobs[i]["row"] + "-" + blobs[i]["col"]);
            cell.setAttribute("style", "background-color:white");

            try {
                if (document.getElementById("cell-" + blobs[i]["row"] + "-" + (blobs[i]["col"] - 1)).getAttribute("style") == "background-color:green") {

                    document.getElementById("cell-" + blobs[i]["row"] + "-" + (blobs[i]["col"] - 1)).setAttribute("style", "background-color:blue");
                    blobs[i]["col"] = blobs[i]["col"] - 1;

                } else if (document.getElementById("cell-" + blobs[i]["row"] + "-" + (blobs[i]["col"] + 1)).getAttribute("style") == "background-color:green") {
                    document.getElementById("cell-" + blobs[i]["row"] + "-" + (blobs[i]["col"] + 1)).setAttribute("style", "background-color:blue");
                    blobs[i]["col"] = blobs[i]["col"] + 1;
                } else {
                    document.getElementById("cell-" + (blobs[i]["row"] - 1) + "-" + blobs[i]["col"]).setAttribute("style", "background-color:blue");
                    blobs[i]["row"] = blobs[i]["row"] - 1;
                }
            } catch (err) {
                document.getElementById("cell-" + (blobs[i]["row"] - 1) + "-" + blobs[i]["col"]).setAttribute("style", "background-color:blue");
                blobs[i]["row"] = blobs[i]["row"] - 1;
            }
        }

        if ((isArrayInArray(foodLoc, [blobs[i]["row"], blobs[i]["col"]]) && blobs[i]["status"] == "eat")) {
            blobs[i]["status"] = "replicate";
            var col = getRandomIntBetween(0, 37);
            while (backLoc.includes(col)) {
                var col = getRandomIntBetween(0, 37);
            }
            backLoc.push(col);
            var cell = document.getElementById("cell-" + blobs[i]["row"] + "-" + blobs[i]["col"]);
            cell.setAttribute("style", "background-color:white");
            document.getElementById("cell-" + 19 + "-" + col).setAttribute("style", "background-color:blue");
            blobs[i]["col"] = col;
        }

        if (isArrayInArray(foodLoc, [blobs[i]["row"], blobs[i]["col"]]) && blobs[i]["status"] == "pending") {
            blobs[i]["status"] = "eat";
        }

        if (blobs[i]["status"] == "eat" && last == true) {
            var col = getRandomIntBetween(0, 37);
            while (backLoc.includes(col)) {
                var col = getRandomIntBetween(0, 37);
            }
            backLoc.push(col);
            var cell = document.getElementById("cell-" + blobs[i]["row"] + "-" + blobs[i]["col"]);
            cell.setAttribute("style", "background-color:white");
            document.getElementById("cell-" + 19 + "-" + col).setAttribute("style", "background-color:blue");
            blobs[i]["col"] = col;
        }
    }
}

// generate food
function generateFood(num) {

    for (let i = 0; i < num; i++) {

        var col = getRandomIntBetween(0, 37);
        var row = getRandomIntBetween(0, 19);

        while (posHistRow.includes(row) || posHistCol.includes(col)) {
            var col = getRandomIntBetween(0, 37)
            var row = getRandomIntBetween(0, 19)
        }

        var cell = document.getElementById("cell-" + row + "-" + col);
        cell.setAttribute("style", "background-color:green");

        posHistRow.push(row);
        posHistCol.push(col);
        foodLoc.push([row, col]);
    }
}

function check() {
    var newBlobs = [];
    for (let i = 0; i < blobs.length; i++) {
        if (blobs[i]["status"] != "pending") {
            newBlobs.push({"row": 19, "col": blobs[i]["col"], "status": "pending"});
        } else if (blobs[i]["status"] == "replicate") {
            var col = getRandomIntBetween(0, 36)
            newBlobs.push({"row": 19, "col": col, "status": "pending"});
            var cell = document.getElementById("cell-" + 19 + "-" + col);
            cell.setAttribute("style", "background-color:green");
        } else {
            var cell = document.getElementById("cell-" + blobs[i]["row"] + "-" + blobs[i]["col"]);
            cell.setAttribute("style", "background-color:white");
        }
    }
    blobs = newBlobs;
    console.log(blobs);
}

async function callMoveBlob() {
    for (let i = 0; i < 15; i++) {
        await sleep(2000);
        if (i != 14) {
            moveBlob();
        } else {
            moveBlob(last=true);
        }
    }
    await sleep(2000);
    check();
    await sleep(2000);
    callMoveBlob();
}

function start() {

    var posHist = [];

    // generate 5 blob at random pos in last row (19)

    for (let i = 0; i < 5; i++) {
        var pos = getRandomIntBetween(0, 37);
        // check for existing, make sure don't duplicate
        while (posHist.includes(pos)) {
            var pos = getRandomIntBetween(0, 37)
        }
        var cell = document.getElementById("cell-19-" + pos);
        cell.setAttribute("style", "background-color: blue");
        posHist.push(pos);

        blobs.push({"row": 19, "col": pos, "status": "pending"});
    }

    // generate foods
    generateFood(20);
    callMoveBlob();

}


start()
console.log("hi")

