const BOARD_SIZE = 6;
const SUN_NAME = "Sun";
const MOON_NAME = "Moon";
const EMPTY_NAME = "Empty";
const CROSS_NAME = "Cross";
const EQUAL_NAME = "Equal";
const NUMBER_OF_DIRECTIONS = 4;
const ZERO = 0;
const SIGNS_OPTIONS = [SUN_NAME, MOON_NAME];

class Cell {
    constructor(sign, locked, index) {
        this.sign = sign;
        this.locked = locked;
        this.index = index;
        this.row =  Math.floor(index / BOARD_SIZE);
        this.column = index % BOARD_SIZE;
        this.action = [];
    }

    lock_cell() {
        this.locked = true;
    }

    is_locked() {
        return this.locked;
    }
}

function getRawBoard(document) {
    let board_raw = document.querySelector('.lotka-grid');

    // If incognito.
    if(board_raw == null){
        const iframe = document.querySelector('.game-launch-page__iframe');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        board_raw = iframeDoc.querySelector('.lotka-grid');
    }

    return board_raw;
}

function createBoard(board_raw) {
    let cell;
    let svg;
    let board = [];
    let index;
    let sign;
    let locked;

    if (!board_raw) { return null; }
    for (let child of board_raw.children) {
        // if(cell = child.querySelector('.lotka-cell-content.lotka-cell-content--locked')){
        if(cell = child.querySelector('.lotka-cell-content')){
            if(svg = cell.querySelector('svg')){
                index = parseInt(child.getAttribute('data-cell-idx'));
                sign = svg.getAttribute("aria-label");
                locked = (sign == EMPTY_NAME ? false : true)
                board[index] = new Cell(sign, locked, index);
            }
        }

    }
    return board;
}

function set_action(board_raw, board){
    let action;
    let action_neighbor;

    if (!board_raw) { return null; }
    for (let child of board_raw.children) {
        if(edge = child.querySelector('.lotka-cell-edge')){
            if(svg = edge.querySelector('svg')){
                action = svg.getAttribute("aria-label");
                index = parseInt(child.getAttribute('data-cell-idx'));
                board[index].action_neighbor = -1;
                if(edge.classList.contains('lotka-cell-edge--right')){
                    action_neighbor = index + 1;
                    
                } else if(edge.classList.contains('lotka-cell-edge--down')){
                    action_neighbor = index + BOARD_SIZE;
                }                
                board[index].action.push([action, action_neighbor]);
                board[action_neighbor].action.push([action, index]);
            } 
        }
    }   
}

function checkRowValidity(board, row){
    let sun_count = 0, moon_count = 0;

    for(let i = 0; i < BOARD_SIZE; i++){

        switch(board[row * BOARD_SIZE + i].sign){
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
        switch(board[column + i*BOARD_SIZE].sign){
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
        if(board[index + 1 * BOARD_SIZE].sign == sign && board[index + 2 * BOARD_SIZE].sign == sign) { return false;}
    }
    if(row - 2 > ZERO){ 
        if(board[index - 1 * BOARD_SIZE].sign == sign && board[index - 2 * BOARD_SIZE].sign == sign) { return false;}
    }
    if(row + 1 < BOARD_SIZE && row - 1 > ZERO){ 
        if(board[index + 1 * BOARD_SIZE].sign == sign && board[index - 1 * BOARD_SIZE].sign == sign) { return false;}
    }

    return true;
}

function checkAction(board, index){
    if(!board[index].action) {return true;}
    let action;
    let action_neighbor;
    for (let act of board[index].action){
        action = act[0];
        action_neighbor = act[1];
        if(board[index].sign == EMPTY_NAME || board[action_neighbor].sign == EMPTY_NAME) {continue;}

        if(action == CROSS_NAME){
            if (board[index].sign == board[action_neighbor].sign) {return false;}
        }
        if(action == EQUAL_NAME){
            if (board[index].sign != board[action_neighbor].sign) {return false;}
        }
    }

    return true;
}

function checkCellValidity(board, index){
    return (checkRowValidity(board, board[index].row) && checkColumnValidity(board, board[index].column) && checkAdjacent(board, index) && checkAction(board, index));
}

function backtracking(board, index = 0){
    if(index >= BOARD_SIZE * BOARD_SIZE){
        return board;
    }

    if(board[index].locked){
        return backtracking(board, index + 1);
    }

    for (let sign of SIGNS_OPTIONS){
        board[index].sign = sign;

        if(checkCellValidity(board, index)){
            let new_board = backtracking(board, index + 1);
            if (new_board) return new_board;
        }

        board[index].sign = EMPTY_NAME;
    }
    
    return null;

}

function dispatchClick(el) {
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    const up = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    el.dispatchEvent(down);
    el.dispatchEvent(up);
}

function play_board(board_raw, board){
    for (let child of board_raw.children) {
        if(cell = child.querySelector('.lotka-cell-content')){
            index = parseInt(child.getAttribute('data-cell-idx'));
            if(board[index].sign == SUN_NAME){
                dispatchClick(cell);
            } else if(board[index].sign == MOON_NAME){
                dispatchClick(cell);
                dispatchClick(cell);
            }
        }
    }  
}

function solve(){

    let board_raw = getRawBoard(document);

    let board = createBoard(board_raw);
    console.log("Board:")
    console.log(board);

    set_action(board_raw, board);

    new_board = backtracking(board, 0, SUN_NAME);
    if (new_board == null){new_board = backtracking(board, 0, MOON_NAME);}
    console.log("Solution:")
    console.log(new_board);

    play_board(board_raw, board);
}