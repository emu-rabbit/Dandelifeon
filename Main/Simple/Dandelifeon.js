const fs = require('fs');

var boardSize = 25;
var spawnProbability = 0.5;
var boardCenter = Math.ceil(boardSize / 2);
var recordBound = 12000;

function isValidSpawn(i, j){
	i ++;
	j ++;
	if(!((i >= boardCenter - 2 && i <= boardCenter + 2)&&(j >= boardCenter - 2 && j <= boardCenter + 2))){
		return true;
	}
	return false;
}

function boardGen(){
	var board = [];
	for(var i = 0; i <= boardSize-1; i ++){
		board.push([]);
		for(var j = 0; j <= boardSize-1; j ++){
			var cell;
			if(isValidSpawn(i, j) && Math.random() <= spawnProbability){
				cell = 1;
			}else{
				cell = 0;
			}
			board[i].push(cell);
		}
	}
	return board;
}

function printBoard(board, withAge){
	console.log(printBoardStr(board, withAge));
}

function printBoardStr(board, withAge){
	var str = '';
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			var word;
			if(board[i][j]){
				if(withAge){
					if(board[i][j] <= 9){
						word = board[i][j] + '  ';
					}else if(board[i][j] <= 99){
						word = board[i][j] + ' ';
					}else{
						word = board[i][j].toString();
					}
				}else{
					word = 'O  '
				}
			}else{
				word = '.  ';
			}
			str += word;
		}
		str += '\n';
	}
	return str;
}

function isLive(cell){
	return cell <= 0 ? false : true;
}

function countNeighbours(board, i, j){
	var count = 0;
	for(var ii = i - 1; ii <= i + 1; ii ++){
		for(var jj = j - 1; jj <= j + 1; jj ++){
			if(ii >= 0 && ii <= boardSize-1 && jj >= 0 && jj <= boardSize-1 && !(ii == i && jj == j)){
				if(isLive(board[ii][jj])){
					count ++;
				}
			}
		}
	}
	return count;
}

function findOldestNeighbour(board, i , j){
	var oldestAge = -1;
	for(var ii = i - 1; ii <= i + 1; ii ++){
		for(var jj = j - 1; jj <= j + 1; jj ++){
			if(ii >= 0 && ii <= boardSize-1 && jj >= 0 && jj <= boardSize-1 && !(ii == i && jj == j)){
				if(isLive(board[ii][jj]) && board[ii][jj] > oldestAge){
					oldestAge = board[ii][jj];
				}
			}
		}
	}
	return oldestAge;
}

function isEmpty(board){
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			if(board[i][j]) return false;
		}
	}
	return true;
}

function absorb(board){
	var mana = 0;
	for(var i = boardCenter - 2; i <= boardCenter; i ++){
		for(var j = boardCenter - 2; j <= boardCenter; j ++){
			if(!(i == boardCenter - 1 && j == boardCenter - 1)){
				if(board[i][j] > 0){
					mana += (board[i][j] > 101 ? 100 : board[i][j] - 1) * 60;
				}
			}
		}
	}
	return mana;
}

function runGame(board){
	var endGame = false;
	var age = 0;
	var mana;
	while(!endGame){
		age ++;
		var newBoard = [];
		for(var i = 0; i <= boardSize-1; i ++){
			newBoard.push([]);
			for(var j = 0; j <= boardSize-1; j ++){
				var cell;
				var numberOfNeighbours = countNeighbours(board, i, j);
				//console.log("i : " + i + ", j : " + j + ", n : " + numberOfNeighbours);
				if(isLive(board[i][j])){
					if(numberOfNeighbours == 2 || numberOfNeighbours == 3){
						cell = board[i][j] + 1;
					}else{
						cell = 0;
					}
				}else if(board[i][j] == 0){
					if(numberOfNeighbours == 3){
						cell = findOldestNeighbour(board, i , j) + 1;
					}else{
						cell = 0;
					}
				}
				newBoard[i].push(cell);
			}
		}
		board = newBoard;
		//console.log('--------------------------------------------------------------------------');
		//printBoard(board, true);
		mana = absorb(board);
		if(isEmpty(board) || mana != 0 || age > 100){
			endGame = true;
		}
	}
	return mana;
}

(function(){
	var currentBoard = boardGen();
	var currentBestBoard = currentBoard;
	var bestScore = -1;
	var iteration = 0;
	var saveFlag = false;
	while(true){
		var score = runGame(currentBoard);
		iteration ++;
		if(score > bestScore){
			bestScore = score;
			currentBestBoard = currentBoard;
			saveFlag = true;
		}
		console.clear();
		console.log("Iteration : " + iteration);
		console.log("Current The Best : " + bestScore);
		//printBoard(currentBestBoard, false);
		//console.log("Current Board : " + score);
		//printBoard(currentBoard, false);
		currentBoard = boardGen();
		if(bestScore >= recordBound && saveFlag){
			saveFlag = false;
			var fileName = __dirname + '/output/score-' + bestScore + '-' + Date.now() + '.txt';
			fs.writeFileSync(fileName, printBoardStr(currentBestBoard, false));
		}
	}
})();