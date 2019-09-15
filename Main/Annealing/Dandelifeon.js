const fs = require('fs');

var boardSize = 25;
var spawnProbability = 0.05;
var boardCenter = Math.ceil(boardSize / 2);

var startEnergy = 0.72;
var endEnergy = 0;
var kMax = 100000;
var startT = 100;
var coolDownRate = 0.9995;

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

function copyBoard(board){
	var copy = [];
	for(var i = 0; i <= boardSize-1; i ++){
		copy.push([]);
		for(var j = 0; j <= boardSize-1; j ++){
			copy[i].push(board[i][j]);
		}
	}
	return copy;
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

function boardCounter(board){
	var count = {live: 0, dead: 0};
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			if(isValidSpawn(i, j)){
				if(board[i][j])
					count.live ++;
				else
					count.dead ++;
			}
		}
	}
	return count;
}

function thOfBoard(board, mode, n){
	var pos = [];
	var count = -1;
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			if(isValidSpawn(i, j)){
				if((board[i][j] == 1 && mode == 'live') || (board[i][j] == 0 && mode == 'dead')){
					count ++;
				}
				if(count == n){
					pos.push(i);
					pos.push(j);
					return pos;
				}
			}
		}
	}
}

function newNeighbour(board){
	var newBoard = copyBoard(board);
	var count = boardCounter(newBoard);
	var n, ij;
	function run(command){
		if(command == "insert"){
			n = Math.floor(Math.random() * count.dead);
			ij = thOfBoard(newBoard, 'dead', n);
			newBoard[ij[0]][ij[1]] = 1;
		}else if(command == "delete"){
			n = Math.floor(Math.random() * count.live);
			ij = thOfBoard(newBoard, 'live', n);
			newBoard[ij[0]][ij[1]] = 0;
		}
	}
	if(count.live != 0 && count.dead != 0){
		if(Math.random() < 0.5){
			run('insert');
		}else{
			run('delete');
		}
	}else{
		if(count.live == 0){
			run('insert');
		}else{
			run('delete');
		}
	}
	
	return newBoard;
}

function coolDown(T){
	return T * coolDownRate;
}

function energy(score){
	return (36000 - score) / 36000;
}

function probability(E, newE, T){
	if(newE < E)
		return 1;
	return Math.exp((E - newE) / T);
}

(function(){
	while(true){
		var currentBoard = boardGen();
		var currentScore = runGame(currentBoard);
		var currentEnergy = energy(currentScore);

		while(currentEnergy > startEnergy){
			currentBoard = boardGen();
			currentScore = runGame(currentBoard);
			currentEnergy = energy(currentScore);
		}

		var bestBoard = currentBoard;
		var bestScore = currentScore;
		var bestEnergy = currentEnergy;

		var k = 1;
		var currentT = startT;

		while(k <= kMax && bestEnergy > endEnergy){

			var newBoard = newNeighbour(currentBoard);
			var newScore = runGame(newBoard);
			var newEnergy = energy(newScore);

			currentT = coolDown(currentT);

			if(probability(currentEnergy, newEnergy, currentT) > Math.random()){
				currentBoard = newBoard;
				currentScore = newScore;
				currentEnergy = newEnergy;
			}

			if(currentEnergy < bestEnergy){
				bestBoard = currentBoard;
				bestScore = currentScore;
				bestEnergy = currentEnergy;
			}

			console.clear();
			console.log("K : " + k + ", T : " + currentT);
			console.log("BS : " + bestScore + ", BE : " + bestEnergy);
			console.log("CS : " + currentScore + ", CE : " + currentEnergy);

			k ++;
		}

		printBoard(bestBoard, false);
		var fileName = __dirname + '/output/score-' + bestScore + '-' + Date.now() + '.txt';
		fs.writeFileSync(fileName, printBoardStr(bestBoard, false));
	}
})();