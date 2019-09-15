const fs = require('fs');

var inputFilename = __dirname + '/Main/Genetic/output/score-18000-1568320373446.txt';
var outputFilname = __dirname + '/temp.txt';

var boardSize = 25;

fs.readFile(inputFilename, 'utf8', (err, data) => {
	if (err) throw err;

	console.log('Before:');
	console.log(data);

	var str = "[\n\t[";
	var colCount = 0;
	var rowCount = 0;

	for(var i = 0; i <= data.length-1; i ++){
		var c = data[i];
		if(c == '.' || c == 'O'){
			str += (c == '.' ? '0' : '1');
			colCount ++;
			if(colCount == boardSize){
				rowCount ++;
				str += "]";
				if(rowCount == boardSize){
					str += '\n]';
				}else{
					str += ',\n\t[';
				}
				colCount = 0;
			}else{
				str += ", ";
			}
		}
	}

/*
	data = data.split('.').join('0,');
	data = data.split('O').join('1,');
	data = data.split('\n').join('],\n[');
*/

	console.log('After:');
	console.log(str);

	fs.writeFileSync(outputFilname, str);
});

