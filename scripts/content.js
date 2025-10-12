const BOARD_SIZE = 6;
const SUN_NAME = "Sun";
const MOON_NAME = "Moon";
const EMPTY_NAME = "Empty";
const NUMBER_OF_DIRECTIONS = 4;
const ZERO = 0;

class Cell {
    constructor(sign, locked, index) {
        this.sign = sign;
        this.locked = locked;
        this.index = index;
        this.row =  Math.floor(index / BOARD_SIZE);
        this.column = index % BOARD_SIZE;
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
    let index;

    if (!board_raw) { return null; }
    for (let child of board_raw.children) {
        // if(cell = child.querySelector('.lotka-cell-content.lotka-cell-content--locked')){
        if(cell = child.querySelector('.lotka-cell-content')){
            if(svg = cell.querySelector('svg')){
                index = child.getAttribute('data-cell-idx');
                board[index] = new Cell(svg.getAttribute("aria-label"), true, index);
                console.log(svg.getAttribute("aria-label") + " in: " + child.getAttribute('data-cell-idx'));
            }
        }
    }
    return board;
}

// function checkBoardValidity(board){
//     let row = 0;
//     let column = 0;
// }

function checkRowValidity(board, row){
    let sun_count = 0, moon_count = 0;

    for(let i = 0; i < BOARD_SIZE; i++){
        switch(board[row + i].sign){
            case SUN_NAME:
                sun_count++;
                break;
            case MOON_NAME:
                moon_count++;
                break;
        }
    }

    return (sun_count <= (BOARD_SIZE / 2) && moon_count <= (BOARD_SIZE / 2));
}

function checkColumnValidity(board, column){
    let sun_count = 0, moon_count = 0;

    for(let i = 0; i < BOARD_SIZE; i++){
        switch(board[column + i*6].sign){
            case SUN_NAME:
                sun_count++;
                break;
            case MOON_NAME:
                moon_count++;
                break;
        }
    }

    return (sun_count <= (BOARD_SIZE / 2) && moon_count <= (BOARD_SIZE / 2));
}

function checkAdjacent(board, index){
    let sign = board[index].sign;
    let row = board[index].row;
    let column = board[index].column;

    if(sign == EMPTY_NAME) { return true; }

    if(column + 2 < BOARD_SIZE){ 
        if(board[index + 1].sign == sign && board[index + 2].sign == sign) { return false;}
    }
    if(column - 2 > ZERO){ 
        if(board[index - 1].sign == sign && board[index - 2].sign == sign) { return false;}
    }
    if(column + 1 < BOARD_SIZE && column - 1 > ZERO){ 
        if(board[index + 1].sign == sign && board[index - 1].sign == sign) { return false;}
    }

    if(row + 2 < BOARD_SIZE){ 
        if(board[index + 1 * BOARD_SIZE].sign == sign && board[index - 1 * BOARD_SIZE].sign == sign) { return false;}
    }
    if(row - 2 > ZERO){ 
        if(board[index + 1 * BOARD_SIZE].sign == sign && board[index + 2 * BOARD_SIZE].sign == sign) { return false;}
    }
    if(row + 1 < BOARD_SIZE && row - 1 > ZERO){ 
        if(board[index - 1 * BOARD_SIZE].sign == sign && board[index - 2 * BOARD_SIZE].sign == sign) { return false;}
    }

    return true;
}


const board_raw = getRawBoard(document);
// board.style.display = 'none';
let board = createBoard(board_raw);

if(checkRowValidity(board, 0)){console.log("Yay");} else {console.log("Nay");}
if(checkColumnValidity(board, 2)){console.log("Yay2");} else {console.log("Nay2");}
if(checkAdjacent(board, 21)){console.log("Yay3");} else {console.log("Nay3");}

