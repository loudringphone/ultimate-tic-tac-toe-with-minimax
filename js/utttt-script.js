let gloBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
let loBoards = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]
];

let comPlayer = 'O';
let humPlayer = 'X';

// returns list of the indexes of empty spots on the board
const emptyGloIndices = function(gloBoard) {
    return gloBoard.filter (s => s != 'X' && s != 'O' && s != 'D' && s != 'NA');
}
const emptyLoIndices = function(openBoards, loBoards) {
    const emptySpots = [];
    for (let i = 0; i < openBoards.length; i++) {
        if (Array.isArray(loBoards[openBoards[i]])) {
            emptySpots.push(loBoards[openBoards[i]].map((sq, index) => (sq !== 'X' && sq != 'O' ? index : null)).filter(index => index !== null));
        } else {
            emptySpots.push([]);
        }
    }
    return emptySpots;
}

// winning combinations using the board indices
const winning = function(board, player) {
    if (
        ((board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)) 
    ) {
        return true;
    } else {
        return false;
    }
}

const allXorO = function(board) {
    if (Array.isArray(board)) {
        return board.every((cell) => cell === 'X' || cell === 'O');
    }
  }

const minimax = function(mo, los, player, depth, alpha, beta, maxDepth) {
    let score = evalBoard(mo.gloIndex, los)
    if (depth == maxDepth) {
        return {score: score};
    }

    let gloBoardMinimax = [];
    for (let i = 0; i < 9; i++) {
        if (winning(los[i], comPlayer)){
            gloBoardMinimax[i] = 'O'
        }
        else if (winning(los[i], humPlayer)){
            gloBoardMinimax[i] = 'X'
        }
        else if (allXorO(los[i])) {
            gloBoardMinimax[i] = 'D'
        } else {
            gloBoardMinimax[i] = i
        }
    }

    if (winning(gloBoardMinimax, comPlayer)){
        return {score: score + depth};
    }
    else if (winning(gloBoardMinimax, humPlayer)){
        return {score: score - depth};
    }

    if (typeof gloBoardMinimax[mo.loIndex] === 'number' || gloBoardMinimax[mo.loIndex] === 'NA') {
        for (let j = 0; j < 9; j++) {
            if (typeof gloBoardMinimax[j] === 'number') {
                gloBoardMinimax[j] = 'NA'
            }
        }
    }
    
    if (gloBoardMinimax[mo.loIndex] === 'NA') {
        gloBoardMinimax[mo.loIndex] = mo.loIndex
    }
    let openBoardsMinimax = emptyGloIndices(gloBoardMinimax)
    if (openBoardsMinimax.length == 0) {
        return {score: score};
    }
    let emptySpotsInLoBoards = emptyLoIndices(openBoardsMinimax, los);

    if (player == humPlayer) {
        let maxVal = -Infinity;
        let bestMove
        for (let o = 0; o < openBoardsMinimax.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.gloIndex = openBoardsMinimax[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                los[move.gloIndex][move.loIndex] = 'X'
                let result = minimax(move, los, comPlayer, depth+1, alpha, beta, maxDepth)
                los[move.gloIndex][move.loIndex] = move.loIndex
                if (result.score > maxVal) {
                    maxVal = result.score
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score}
                }
                alpha = Math.max(alpha, maxVal);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return bestMove
    } else {
        let minVal = Infinity;
        let bestMove
        for (let o = 0; o < openBoardsMinimax.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.gloIndex = openBoardsMinimax[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                los[move.gloIndex][move.loIndex] = 'O'
                let result = minimax(move, los, humPlayer, depth+1, alpha, beta, maxDepth)
                los[move.gloIndex][move.loIndex] = move.loIndex
                if (result.score < minVal) {
                    minVal = result.score
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score}
                }
                beta = Math.min(beta, minVal);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return bestMove
    }
}

const evalBoard = function(current, los) {
    const allWinningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const positionScores = [0.3, 0.2, 0.3, 0.2, 0.4, 0.2, 0.3, 0.2, 0.3];
    const loBoardWeightings = [1.35, 1, 1.35, 1, 1.7, 1, 1.35, 1, 1.35];
    function rowScore(arr) {
        let oCount = 0;
        let xCount = 0;
        let numCount = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === 'O') {
            oCount++;
          }
          else if (arr[i] === 'X') {
            xCount++;
          }
          else {
            numCount++;
          }
        }
       
        if (oCount === 3) {
            return -12
        }
        if (oCount === 2 && numCount === 1) {
            return -6
        }
        if (xCount === 2 && numCount === 1) {
            return 6
        }
        if (xCount === 2 && oCount === 1) {
            return -9
        }
        if (xCount === 3) {
            return 12
        }
        if (oCount === 2 && xCount === 1) {
            return 9
        }
        else {
            return 0
        }
    }

    let score = 0
    let glo = [];
   
    for (let i = 0; i < 9; i++) {
        if (winning(los[i], comPlayer)){
            glo[i] = 'O'
            score = score - positionScores[i] * 150
        }
        else if (winning(los[i], humPlayer)){
            glo[i] = 'X'
            score = score + positionScores[i] * 150
        }
        else if (allXorO(los[i])) {
            glo[i] = 'D'
        } else {
            glo[i] = i
        }
    }

    if (winning(glo, comPlayer)){
        score = score - 50000
     }
       else if (winning(glo, humPlayer)){
        score = score + 50000 
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(los[i][j] == comPlayer) {
                if (i == current) {
                    score = score - positionScores[j] * 1.5 * loBoardWeightings[i]
                } else {
                    score = score - positionScores[j] * loBoardWeightings[i]
                }
            } else if (los[i][j] == humPlayer) {
                if (i == current) {
                    score = score + positionScores[j] * 1.5 * loBoardWeightings[i]
                } else {
                    score = score + positionScores[j] * loBoardWeightings[i]
                }
            }
        }

        let RawScores = new Set();
        for (let combo of allWinningCombos) {
            let loArr = [los[i][combo[0]], los[i][combo[1]], los[i][combo[2]]];
            let rowScoreVal = rowScore(loArr);
            if (!RawScores.has(rowScoreVal)) {
                if ((combo[0] === 0 && combo[1] === 4 && combo[2] === 8) || (combo[0] === 2 && combo[1] === 4 && combo[2] === 6)) {
                    if (rowScoreVal === 6 || rowScoreVal === -6) {
                        if (i === current) {
                            score += rowScoreVal * 1.2 * 1.5 * loBoardWeightings[i];
                        } else {
                            score += rowScoreVal * 1.2 * loBoardWeightings[i];
                        }
                    }
                } else {
                    if (i === current) {
                        score += rowScoreVal * 1.5 * loBoardWeightings[i];
                    } else {
                        score += rowScoreVal * loBoardWeightings[i];
                    }
                }
                RawScores.add(rowScoreVal);
            }
        }
    }
    
    let rawScores = new Set();
    for (let combo of allWinningCombos) {
        let gloArr = [glo[combo[0]], glo[combo[1]], glo[combo[2]]];
        let rowScoreVal = rowScore(gloArr);
        if (!rawScores.has(rowScoreVal)) {
            if ((combo[0] === 0 && combo[1] === 4 && combo[2] === 8) || (combo[0] === 2 && combo[1] === 4 && combo[2] === 6)) {
                if (rowScoreVal === 6 || rowScoreVal === -6) {
                    score += rowScoreVal * 1.2 * 150;
                }
            } else {
                score += rowScoreVal * 150;
            }
            rawScores.add(rowScoreVal);
        }
    }
    return score
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const AIplayer = function() {
    if (turn % 2 != 0) {
        let emptySpotsInLoBoards = emptyLoIndices(openBoards, loBoards);
        // let moves = []
        let minimumScore = Infinity;
        let bestMove
        for (let o = 0; o < openBoards.length; o++) {
            for (let i = 0; i < emptySpotsInLoBoards[o].length; i++) {
                let move = {}
                move.gloIndex = openBoards[o]
                move.loIndex = emptySpotsInLoBoards[o][i]
                loBoards[move.gloIndex][move.loIndex] = 'O'
                let result;
                if (isMobile) {
                    result = minimax(move, loBoards, humPlayer, 0, -Infinity, Infinity, 4)
                } else {
                    result = minimax(move, loBoards, humPlayer, 0, -Infinity, Infinity, 6)
                }
                loBoards[move.gloIndex][move.loIndex] = move.loIndex
                // moves.push(move)
                if (result.score < minimumScore) {
                    minimumScore = result.score;
                    bestMove = {gloIndex: move.gloIndex, loIndex: move.loIndex, score: result.score};
                }
            }
        }
        result.textContent = '\u00A0'
        let gloIndex = bestMove.gloIndex
        let loIndex = bestMove.loIndex
        loBoards[gloIndex][loIndex] = 'O'
        ttts[gloIndex].children[loIndex].textContent = 'O';
        ttts[gloIndex].children[loIndex].classList.add('markO')
        let lastMove = document.querySelector('#lastMove');;
        if (lastMove && lastMove.id != null) {
                lastMove.id = '';
        };
        ttts[gloIndex].children[loIndex].id = 'lastMove';
    
        cells.forEach(target =>
            target.classList.toggle('cell2'))

        let nextBoard = main.children[loIndex];
        cellChanges(nextBoard, gloIndex)
        gloBoardIndex(loIndex)
        
        turn++

        if (winning(gloBoard, comPlayer) || winning(gloBoard, humPlayer)){
            for (let i = 0; i < main.children.length; i++) {
                if (typeof gloBoard[i] == 'number') {
                    for (let j = 0; j < 9; j++) {
                        if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                            main.children[i].children[j].classList.add('cellNA');  
                        }
                    }
                }
            }
            if (winning(gloBoard, comPlayer)) {
                result.textContent = "Player O wins!"
            } else if (winning(gloBoard, humPlayer)){
                result.textContent = "Player X wins!"
            } 
        } else if (!gloBoard.some(item => typeof item === 'number')) {
            result.textContent = "Draw game!"
        }
    }
}

//---------------------------------- Above is the minimax and evaluation board------------------------------------------------------------//

const main = document.querySelector('.main-content');
const ttts = document.querySelectorAll('.TTT');
const cells = document.querySelectorAll('.cell');
let cell2s = document.querySelectorAll('.cell2');
let cellNAs = document.querySelectorAll('cellNA');
let markXs = document.querySelectorAll('.markX');
let markOs = document.querySelectorAll('.markO');
let turn = 0;
let gloIndex;
let loIndex;
const result = document.querySelector('#result');


const gloBoardIndex = function(nextBoardIndex) {
    for (let i = 0; i < 9; i++) {
        if (winning(loBoards[i], comPlayer)){
            gloBoard[i] = 'O'
        }
        else if (winning(loBoards[i], humPlayer)){
            gloBoard[i] = 'X'
        }
        else if (allXorO(loBoards[i])) {
            gloBoard[i] = 'D'
        } else if (typeof gloBoard[i] == 'number') {
            gloBoard[i] = 'NA'
        }
    }
    if (gloBoard[nextBoardIndex] !== 'NA') {
        for (let i = 0; i < 9; i++) {
            if (gloBoard[i] == 'NA') {
                gloBoard[i] = i
            }
        }
    } else {
        gloBoard[nextBoardIndex] = nextBoardIndex
    }
}
let openBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let lastBoards = [...openBoards]
const cellChanges = function (nextBoard, index) {
    for (let i = 0; i < main.children.length; i++) {
        markXs = document.querySelectorAll('markX');
        markOs = document.querySelectorAll('markO');
        if (main.children[i] != nextBoard && (!main.children[i].firstElementChild.classList.contains('cellW') && !main.children[i].firstElementChild.classList.contains('cell2W'))) {
            for (let j = 0; j < 9; j++) {
                if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                    main.children[i].children[j].classList.add('cellNA');  
                }
            }   
        } else {
            for (let j = 0; j < 9; j++) {
                main.children[i].children[j].classList.remove('cellNA');
            }  
        }
    }
    if (winning(loBoards[index], humPlayer)){
        gloBoard[index] = 'X';
        for (let i = 0; i < 9; i++) {
            ttts[index].children[i].classList.add('cellW')
            ttts[index].children[i].classList.remove('cellNA')
        }
    }
    if (winning(loBoards[index], comPlayer)){
        gloBoard[index] = 'O';
        for (let i = 0; i < 9; i++) {
            ttts[index].children[i].classList.add('cell2W')
            ttts[index].children[i].classList.remove('cellNA')
        }
    }
    if (nextBoard.firstElementChild.classList.contains('cellW') || nextBoard.firstElementChild.classList.contains('cell2W') || allXorO(nextBoard)) {
        cellNAs = document.querySelectorAll('.cellNA');
        for (let cellNA of cellNAs) {
            cellNA.classList.remove('cellNA')
        }
    }
}

for (let cell of cells) {
    cell.addEventListener('click', function() {
        if (cell.className === 'markX' || cell.className === 'markO') {
            return;
        }
        lastMove = document.querySelector('#lastMove');;
            try {if (lastMove.id != null) {
                lastMove.id = '';
            }}catch{};
            cell.id = 'lastMove';

        let targetBoard = cell.parentElement;
        for (let i = 0; i < main.children.length; i++) {
            if (main.children[i] === targetBoard) {
                gloIndex = i;
            } 
        }
        for (let i = 0; i < targetBoard.children.length; i++) {
            if (targetBoard.children[i] === cell) {
                loIndex = i;
            }
        }

        turn++

        if (turn % 2 != 0) {
            loBoards[gloIndex][loIndex] = 'X';
            cell.textContent = 'X';
            cell.classList.add('markX')
            cells.forEach(target =>
                target.classList.toggle('cell2'))
        }
        else {
            loBoards[gloIndex][loIndex] = 'O'
            cell.textContent = 'O';
            cell.classList.add('markO')
            cells.forEach(target =>
                target.classList.toggle('cell2'))
        }
        let nextBoard = main.children[loIndex];
        
        cellChanges(nextBoard, gloIndex)
        gloBoardIndex(loIndex)

        lastBoards = [...openBoards]
        if (turn % 2 != 0) {
            console.log(humPlayer, evalBoard(lastBoards, loBoards))
        } else {
            console.log(comPlayer, evalBoard(lastBoards, loBoards))
        }
        openBoards = emptyGloIndices(gloBoard)

        if (winning(gloBoard, comPlayer) || winning(gloBoard, humPlayer)){
            for (let i = 0; i < main.children.length; i++) {
                if (typeof gloBoard[i] == 'number') {
                    for (let j = 0; j < 9; j++) {
                        if (!main.children[i].children[j].classList.contains('markX') && !main.children[i].children[j].classList.contains('markO')) {
                            main.children[i].children[j].classList.add('cellNA');  
                        }
                    }
                }
            }
            if (winning(gloBoard, comPlayer)) {
                result.textContent = "Player O wins!"
            } else if (winning(gloBoard, humPlayer)){
                result.textContent = "Player X wins!"
            }
        } else if (!gloBoard.some(item => typeof item === 'number')) {
            result.textContent = "Draw game!"
        } else {
            result.textContent = 'Minimax analyzing moves..'
            setTimeout(() => {
                AIplayer() 
            }, 0);
        }
    })
    
};

const rulesBtn = document.querySelector('#rules-btn')
const rules = document.querySelector('#rules')
const rulesClose = document.querySelector('#rules-close')
rulesBtn.addEventListener('click', function() {
    rules.style.display = "flex"
    rulesClose.style.display = "flex"
})
rulesClose.addEventListener('click', function() {
    rules.style.display = "none"
    rulesClose.style.display = "none"
})

const restartBtn = document.querySelector('#restart-btn')
restartBtn.addEventListener('click', function() {
    result.textContent = '\u00A0'
    gloBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    loBoards = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], 
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    turn = 0
    let lastMove = document.querySelector('#lastMove');;
    if (lastMove && lastMove.id != null) {
        lastMove.id = '';
    };
    const cells = main.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.classList.remove('markX', 'markO', 'cellNA', 'cellW', 'cell2W');
        cell.textContent = ''
    });
})

