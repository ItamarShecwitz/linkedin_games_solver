const BOARD_SIZE = 6;
const SUN_NAME = "Sun";
const MOON_NAME = "Moon";

class Cell {
    constructor(sign, locked) {
        this.sign = sign;
        this.locked = locked;
    }

    lock_cell() {
        this.locked = true;
    }

    is_locked() {
        return this.locked;
    }
}


function getRawBoard(document) {
    return document.querySelector('.lotka-grid.gil__grid');
}

function createBoard(board_raw) {
    let cell;
    let svg;
    let title;
    let board = [];

    if (!board_raw) { return null; }
    for (let child of board_raw.children) {
        // if(cell = child.querySelector('.lotka-cell-content.lotka-cell-content--locked')){
        if(cell = child.querySelector('.lotka-cell-content')){
            if(svg = cell.querySelector('svg')){
                if(title = svg.querySelector('title')){
                    board[child.getAttribute('data-cell-idx')] = new Cell(title.textContent, true);
                    console.log(title.textContent + " in: " + child.getAttribute('data-cell-idx'));
                }
            }
        }
    }
    return board;
}

function checkBoardValidity(board){
    let row = 0;
    let column = 0;
}

function checkRowValidity(board, row){
    let sun_count = 0, moon_count = 0;

    for(let i = 0; i < BOARD_SIZE; i++){
        if(!board[row + i]) { return true; }
        if(board[row + i].sign == SUN_NAME){ sun_count++; }
        else if(board[row + i].sign == MOON_NAME){ moon_count++; }
        console.log("Checking for: " + i + " Sun: " + sun_count + " Moon: " + moon_count);
    }
    console.log(sun_count == moon_count == (BOARD_SIZE / 2));
    return (sun_count == (BOARD_SIZE / 2) && moon_count == (BOARD_SIZE / 2) ) ? true : false;
}

function checkColumnValidity(board, column){

}


const board_raw = getRawBoard(document);
// board.style.display = 'none';
let board = createBoard(board_raw);

if(checkRowValidity(board, 0)){console.log("Yay");} else {console.log("Nay");}

console.log(board[0]);
console.log(board[1]);
console.log(board[2]);
console.log(board[3]);
console.log(board[4]);
console.log(board[5]);
console.log(board[6]);
console.log(board[7]);
