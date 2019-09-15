const fs = require('fs');

var inputFileName = 'score-24000-1568172581808';

var inputPathName = __dirname + '/Simple/output/' + inputFileName + '.txt';
var outputPathName = __dirname + '/Copys/' + inputFileName;

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

function copyLeft(board){
	var newBoard = copyBoard(board);
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = boardCenter; j <= boardSize-1; j ++){
			newBoard[i][j] = board[i][boardSize - 1 - j];
		}
	}
	return newBoard;
}

function copyRight(board){
	var newBoard = copyBoard(board);
	for(var i = 0; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardCenter-2; j ++){
			newBoard[i][j] = board[i][boardSize - 1 - j];
		}
	}
	return newBoard;
}

function copyTop(board){
	var newBoard = copyBoard(board);
	for(var i = boardCenter; i <= boardSize-1; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			newBoard[i][j] = board[boardSize - 1 - i][j];
		}
	}
	return newBoard;
}

function copyBottom(board){
	var newBoard = copyBoard(board);
	for(var i = 0; i <= boardCenter-2; i ++){
		for(var j = 0; j <= boardSize-1; j ++){
			newBoard[i][j] = board[boardSize - 1 - i][j];
		}
	}
	return newBoard;
}

fs.readFile(inputPathName, 'utf8', (err, data) => {
	if (err) throw err;

	var board = [];

	var colCount = 0;
	var rowCount = 0;

	for(var i = 0; i <= data.length-1; i ++){
		var c = data[i];
		board.push([]);
		if(c == '.' || c == 'O'){
			colCount ++;
			board[rowCount].push(c == '.' ? 0 : 1);
			if(colCount == boardSize){
				rowCount ++;
				if(rowCount != boardSize){
					board.push([]);
				}
				colCount = 0;
			}
		}
	}

	console.log('Origin:');
	printBoard(board);

	var newBoard;
	newBoard = copyLeft(board);
	console.log('Left:');
	printBoard(newBoard);
	fs.writeFileSync(outputPathName + '-Left.txt', printBoardStr(newBoard));

	newBoard = copyRight(board);
	console.log('Right:');
	printBoard(newBoard);
	fs.writeFileSync(outputPathName + '-Right.txt', printBoardStr(newBoard));

	newBoard = copyTop(board);
	console.log('Top:');
	printBoard(newBoard);
	fs.writeFileSync(outputPathName + '-Top.txt', printBoardStr(newBoard));

	newBoard = copyBottom(board);
	console.log('Bottom:');
	printBoard(newBoard);
	fs.writeFileSync(outputPathName + '-Bottom.txt', printBoardStr(newBoard));
});

