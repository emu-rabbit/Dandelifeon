const fs = require('fs');

var boardSize = 25;
var spawnProbability = 0.5;
var boardCenter = Math.ceil(boardSize / 2);

var group = [];
var initialGroupSize = 10;
var scoreBound = 12000;
var endScore = 36000;
var kMax = 50000;
var tryCrossoverTimes = 1;
var tryMutationTimes = 1;
var crossoverProbability = 0.6;
var mutationProbability = 0.1;
var chunkSwapNumber = 3;
var chunkSize = 4;

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

function totoalScore(){
	var total = 0;
	for(var b in group){
		total += group[b].score;
	}
	return total;
}

function sameBoard(a, b){
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			if(a[i][j] != b[i][j]) return false;
		}
	}
	return true;
}

function doCrossover(){
	var childs = [];
	var parent = [];
	var total = totoalScore();
	while(childs.length < 2){
		var ai = 0, bi = 0;
		while(ai == bi || group[ai].score == group[bi].score){
			for(var i = 1; i <= 2; i ++){
				var r = Math.floor(Math.random() * total);
				var t = 0;
				for(var j = group.length-1; j >= 0; j --){
					t += group[j].score;
					if(t >= r){
						if(i == 1){
							ai = j;
						}else{
							bi = j;
						}
						break;
					}
				}
			}
		}
		var a = group[ai].board;
		var b = group[bi].board;
		var newA = copyBoard(a);
		var newB = copyBoard(b);
		for(var i = 1; i <= chunkSwapNumber; i ++){
			var iOffset = Math.floor(Math.random() * (boardSize - chunkSize));
			var jOffset = Math.floor(Math.random() * (boardSize - chunkSize));

			iOffset ++;
			jOffset ++;
			while((iOffset >= boardCenter - 2 && iOffset <= boardCenter + 2)&&(jOffset >= boardCenter - 2 && jOffset <= boardCenter + 2)){
				iOffset = Math.floor(Math.random() * (boardSize - chunkSize));
				jOffset = Math.floor(Math.random() * (boardSize - chunkSize));
				iOffset ++;
				jOffset ++;
			}
			iOffset --;
			jOffset --;
			
			for(var ci = iOffset; ci <= iOffset + chunkSize - 1; ci ++){
				for(var cj = jOffset; cj <= jOffset + chunkSize - 1; cj ++){
					newA[ci][cj] = b[ci][cj];
					newB[ci][cj] = a[ci][cj];
				}
			}
			
		}
		var scoreA = runGame(newA);
		var scoreB = runGame(newB);
		if(scoreA >= scoreBound || scoreB >= scoreBound){
			if(scoreA >= scoreBound)
				childs.push({score : scoreA, board : newA});
			if(scoreB >= scoreBound)
				childs.push({score : scoreB, board : newB});
			parent.push(ai);
			parent.push(bi);
		}
	}
	for(var i = 1; i <= 2; i ++)
		group.splice(parent[Math.floor(Math.random() * parent.length)], 1);
	for(var i = 0; i <= childs.length-1; i ++)
		group.push(childs[i]);
}

function doMutation(){
	var currentScore = 0;
	var i;
	var newBoard;
	var newScore;
	while(currentScore < scoreBound){
		i = Math.floor(Math.random() * group.length);
		newBoard = newNeighbour(group[i].board);
		newScore = runGame(newBoard);
		currentScore = newScore;
	}
	group.push({score : newScore, board : newBoard});
	group.splice(i, 1);
}

function tossProbability(score){
	if(score < scoreBound){
		return 1;
	}else{
		return ((36000 - score) / 36000) / 1000;
	}
}

(function(){
	//initial
	while(true){
		group = [];
		while(group.length < initialGroupSize){
			var board = boardGen();
			var score = runGame(board);
			if(score >= scoreBound){
				group.push({score : score, board : board});
				console.clear();
				console.log('Generating Group : ' + group.length + '/' + initialGroupSize);
			}
		}

		group.sort(function(a, b){return (b.score - a.score);});
		var currentBestScore = group[0].score;
		var currentBestBoard = group[0].board;
		
		var k = 1;
		while(group[0].score < endScore && k <= kMax){
			//Crossover
			for(var i = 1; i <= tryCrossoverTimes; i ++){
				if(Math.random() < crossoverProbability){
					doCrossover();
				}
			}
			//Mutation
			for(var i = 1; i <= tryMutationTimes; i ++){
				if(Math.random() < mutationProbability){
					doMutation();
				}
			}
			//Select
			group.sort(function(a, b){return (b.score - a.score);});
			for(var i = 1; i <= group.length-1; i ++){
				if(Math.random() < tossProbability(group[i].score) && group.length > 2){
					group.splice(i, 1);
					i --;
				}
			}

			if(group[0].score > currentBestScore){
				currentBestScore = group[0].score;
				currentBestBoard = group[0].board;
			}

			console.clear();
			console.log('Iteration : ' + k + ', GroupSize : ' + group.length);
			console.log('GroupBestScore : ' + group[0].score + ', GroupWorstScore : ' + group[group.length-1].score);
			console.log('currentBestScore : ' + currentBestScore);

			if(group[0].score == group[group.length-1].score) break;

			k ++;
		}

		printBoard(currentBestBoard);

		var fileName = __dirname + '/output/score-' + currentBestScore + '-' + Date.now() + '.txt';
		fs.writeFileSync(fileName, printBoardStr(currentBestBoard, false));
	}
})();