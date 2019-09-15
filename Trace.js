const fs = require('fs');

var board = [
	[1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1],
	[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
	[0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
	[0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0],
	[0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
	[0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
	[0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0],
	[1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
	[1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
	[1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0],
	[1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
	[0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
	[0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
	[1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1]
];

var fileName = __dirname + '/trace/' + Date.now() + '.txt';
var boardSize = 25;
var boardCenter = Math.ceil(boardSize / 2);

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
		fs.appendFileSync(fileName, '-\n');
		fs.appendFileSync(fileName, printBoardStr(board, true));
		mana = absorb(board);
		//fs.appendFileSync(fileName, 'Mana:' + mana + '\n');
		if(isEmpty(board) || mana != 0 || age > 100){
			endGame = true;
		}
	}
	return mana;
}

(function(){
	fs.appendFileSync(fileName, printBoardStr(board, true));
	var mana = runGame(board);
	fs.appendFileSync(fileName, "Mana:" + mana + '\n');

	fs.renameSync(fileName, __dirname + '/trace/score-' + mana + '-' + Date.now() + '.txt');
})()