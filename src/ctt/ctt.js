import { GetServerList } from "../aux/utils.js";

export async function main(ns) {
    await findContracts(ns);
    //test(ns, "Find All Valid Math Expressions");
}

function test(ns, type){
    ns.codingcontract.createDummyContract(type);
    let contract = ns.ls("home", ".cct")[0];
    let data = ns.codingcontract.getData(contract, "home");

    const didSolve = solve(type, data, "home", contract, ns);
    let result = ns.codingcontract.attempt(didSolve, contract, "home");
    ns.tprint(result);

    if (result.length > 0){
        ns.tprint(`SUCCESS: ${type}, data: ${data}, result: ${didSolve}`);
    }
    else{
        ns.tprint(`FAIL: ${type}`);
        ns.rm(contract);
    }


}

async function findContracts(ns){
    const servers = GetServerList(ns);
    
    let found = 0;
	for (let server of servers) {
		let contracts = ns.ls(server);
		//let contracts = ns.ls(server, ".cct");
		for (let contract of contracts) {
			if (!contract.endsWith('.cct')) continue;
			found++;
			const type = ns.codingcontract.getContractType(contract, server);
			const data = ns.codingcontract.getData(contract, server);
            ns.tprint(type, data);
			const didSolve = solve(type, data, server, contract, ns);

			if (didSolve !== false){
				ns.tprint(`INFO: ` + didSolve);
                ns.tprint(ns.codingcontract.attempt(didSolve, contract, server));
            }
			else
				ns.tprint(`FAIL: ${server} - ${contract} - ${type} - ${didSolve || "FAILED!"}`);
		}
	}

	if (found > 0)
		ns.tprint(`Found ${found} contracts`);
}


function solve(type, data, server, contract, ns) {
    switch (type) {
        case "Find Largest Prime Factor":
            return findLargestPrimeFactor(data);
        case "Subarray with Maximum Sum":
            return subarrayWithMaximumSum(data);
        case "Total Ways to Sum":
            return totalWaysToSum(data);
        case "Total Ways to Sum II":
            return totalWaysToSumII(data);
        case "Spiralize Matrix":
            return spiralizeMatrix(data);
        case "Array Jumping Game":
            return arrayJumpingGame(data);
        case "Array Jumping Game II":
            return arrayJumpingGameII(data);
        case "Merge Overlapping Intervals":
            return mergeOverlappingIntervals(data);
        case "Generate IP Addresses":
            return generateIPAddresses(data);
        case "Algorithmic Stock Trader I":
            return algorithmicStockTraderI(data);
        case "Algorithmic Stock Trader II":
            return algorithmicStockTraderII(data);
        case "Algorithmic Stock Trader III":
            return algorithmicStockTraderIII(data);
        case "Algorithmic Stock Trader IV":
            return algorithmicStockTraderIV(data);
        case "Minimum Path Sum in a Triangle":
            return minimumPathSumInTriangle(data);
        case "Unique Paths in a Grid I":
            return uniquePathsInGridI(data);
        case "Unique Paths in a Grid II":
            return uniquePathsInGridII(data);
        case "Shortest Path in a Grid":
            return shortestPathInGrid(data);
        case "Sanitize Parentheses in Expression":
            return sanitizeParentheses(data);
        case "Find All Valid Math Expressions":
            return findAllValidMathExpressions(data);
        case "HammingCodes: Integer to Encoded Binary":
            return hammingCodesIntegerToBinary(data);
        case "HammingCodes: Encoded Binary to Integer":
            return hammingCodesBinaryToInteger(data);
        case "Proper 2-Coloring of a Graph":
            return proper2ColoringOfGraph(data);
        case "Compression I: RLE Compression":
            return rleCompression(data);
        case "Compression II: LZ Decompression":
            return lzDecompression(data);
        case "Compression III: LZ Compression":
            return lzCompression(data);
        case "Encryption I: Caesar Cipher":
            return caesarCipher(data);
        case "Encryption II: Vigenère Cipher":
            return vigenereCipher(data);
        case "Square Root":
            return squareRoot(data);
        default:
            return false;
    }
}

function findLargestPrimeFactor(data) {
    return false;
}

function subarrayWithMaximumSum(arrayData) {
    let highestSubset = arrayData[0];

	for (let i = 0; i < arrayData.length; i++) {

		for (let j = i; j < arrayData.length; j++) {
			let tempSubset = 0;
			for (let k = i; k <= j; k++) {
				tempSubset += arrayData[k];
			}

			if (highestSubset < tempSubset) {
				highestSubset = tempSubset;
			}
		}
	}

	return highestSubset;
}

function totalWaysToSum(arrayData) {
    var ways = [];
	ways[0] = 1;

	for (var a = 1; a <= arrayData; a++) {
		ways[a] = 0;
	}

	for (var i = 1; i <= arrayData - 1; i++) {
		for (var j = i; j <= arrayData; j++) {
			ways[j] += ways[j - i];
		}
	}

	return ways[arrayData];
}

function totalWaysToSumII(input) {
    let n = input[0];
	let nums = input[1];
	let table = new Array(n + 1);
	for (let i = 0; i < n + 1; i++) {
		table[i] = 0;
	}
	table[0] = 1;

	for (let i of nums) {
		if (i > n) {
			continue;
		}
		for (let j = i; j <= n; j++) {
			table[j] += table[j - i];
		}
		console.log(table);
	}
	return table[n];
}

function spiralizeMatrix(data) {
    return false;
}

function arrayJumpingGame(data) {
    return false;
}

function arrayJumpingGameII(data) {
    return false;
}

function mergeOverlappingIntervals(data) {
    return false;
}

function generateIPAddresses(num) {
    num = num.toString();

	const length = num.length;

	const ips = [];

    const isValidIpSegment = segment => {
        if (segment[0] == "0" && segment != "0") return false;
        segment = Number(segment);
        if (segment < 0 || segment > 255) return false;
        return true;
    }

	for (let i = 1; i < length - 2; i++) {
		for (let j = i + 1; j < length - 1; j++) {
			for (let k = j + 1; k < length; k++) {
				const ip = [
					num.slice(0, i),
					num.slice(i, j),
					num.slice(j, k),
					num.slice(k, num.length)
				];
				let isValid = true;

				ip.forEach(seg => {
					isValid = isValid && isValidIpSegment(seg);
				});

				if (isValid) ips.push(ip.join("."));

			}

		}
	}

	return ips;

}

function algorithmicStockTraderI(data) {
    let arrayData = [1, data];

    let i, j, k;

	let maxTrades = arrayData[0];
	let stockPrices = arrayData[1];

	let tempStr = "[0";
	for (i = 0; i < stockPrices.length; i++) {
		tempStr += ",0";
	}
	tempStr += "]";
	let tempArr = "[" + tempStr;
	for (i = 0; i < maxTrades - 1; i++) {
		tempArr += "," + tempStr;
	}
	tempArr += "]";

	let highestProfit = JSON.parse(tempArr);

	for (i = 0; i < maxTrades; i++) {
		for (j = 0; j < stockPrices.length; j++) { // Buy / Start
			for (k = j; k < stockPrices.length; k++) { // Sell / End
				if (i > 0 && j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && j > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else if (j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else {
					highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
				}
			}
		}
	}
	return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

function algorithmicStockTraderII(data) {
    let arrayData = [Math.ceil(data.length / 2), data];

    let i, j, k;

	let maxTrades = arrayData[0];
	let stockPrices = arrayData[1];

	let tempStr = "[0";
	for (i = 0; i < stockPrices.length; i++) {
		tempStr += ",0";
	}
	tempStr += "]";
	let tempArr = "[" + tempStr;
	for (i = 0; i < maxTrades - 1; i++) {
		tempArr += "," + tempStr;
	}
	tempArr += "]";

	let highestProfit = JSON.parse(tempArr);

	for (i = 0; i < maxTrades; i++) {
		for (j = 0; j < stockPrices.length; j++) { // Buy / Start
			for (k = j; k < stockPrices.length; k++) { // Sell / End
				if (i > 0 && j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && j > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else if (j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else {
					highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
				}
			}
		}
	}
	return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

function algorithmicStockTraderIII(data) {
    let arrayData = [2, data];

    let i, j, k;

	let maxTrades = arrayData[0];
	let stockPrices = arrayData[1];

	let tempStr = "[0";
	for (i = 0; i < stockPrices.length; i++) {
		tempStr += ",0";
	}
	tempStr += "]";
	let tempArr = "[" + tempStr;
	for (i = 0; i < maxTrades - 1; i++) {
		tempArr += "," + tempStr;
	}
	tempArr += "]";

	let highestProfit = JSON.parse(tempArr);

	for (i = 0; i < maxTrades; i++) {
		for (j = 0; j < stockPrices.length; j++) { // Buy / Start
			for (k = j; k < stockPrices.length; k++) { // Sell / End
				if (i > 0 && j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && j > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else if (j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else {
					highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
				}
			}
		}
	}
	return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

function algorithmicStockTraderIV(data) {
    let arrayData = data;

    let i, j, k;

	let maxTrades = arrayData[0];
	let stockPrices = arrayData[1];

	let tempStr = "[0";
	for (i = 0; i < stockPrices.length; i++) {
		tempStr += ",0";
	}
	tempStr += "]";
	let tempArr = "[" + tempStr;
	for (i = 0; i < maxTrades - 1; i++) {
		tempArr += "," + tempStr;
	}
	tempArr += "]";

	let highestProfit = JSON.parse(tempArr);

	for (i = 0; i < maxTrades; i++) {
		for (j = 0; j < stockPrices.length; j++) { // Buy / Start
			for (k = j; k < stockPrices.length; k++) { // Sell / End
				if (i > 0 && j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && j > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
				} else if (i > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else if (j > 0 && k > 0) {
					highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
				} else {
					highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
				}
			}
		}
	}
	return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

function minimumPathSumInTriangle(data) {
    let triangle = data;
	let nextArray;
	let previousArray = triangle[0];

	for (let i = 1; i < triangle.length; i++) {
		nextArray = [];
		for (let j = 0; j < triangle[i].length; j++) {
			if (j == 0) {
				nextArray.push(previousArray[j] + triangle[i][j]);
			} else if (j == triangle[i].length - 1) {
				nextArray.push(previousArray[j - 1] + triangle[i][j]);
			} else {
				nextArray.push(Math.min(previousArray[j], previousArray[j - 1]) + triangle[i][j]);
			}

		}

		previousArray = nextArray;
	}

	return Math.min.apply(null, nextArray);
}

function uniquePathsInGridI(grid) {
    const rightMoves = grid[0] - 1;
	const downMoves = grid[1] - 1;

    const factorial = n => factorialDivision(n, 1);
    const factorialDivision = (n, d) => n == 0 || n == 1 || n == d ? 1 : factorialDivision(n - 1, d) * n;

	return Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)));
}

function uniquePathsInGridII(grid, ignoreFirst = false, ignoreLast = false) {
    const rightMoves = grid[0].length - 1;
	const downMoves = grid.length - 1;

    const factorial = n => factorialDivision(n, 1);
    const factorialDivision = (n, d) => n == 0 || n == 1 || n == d ? 1 : factorialDivision(n - 1, d) * n;

	let totalPossiblePaths = Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)));

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {

			if (grid[i][j] == 1 && (!ignoreFirst || (i != 0 || j != 0)) && (!ignoreLast || (i != grid.length - 1 || j != grid[i].length - 1))) {
				const newArray = [];
				for (let k = i; k < grid.length; k++) {
					newArray.push(grid[k].slice(j, grid[i].length));
				}

				let removedPaths = uniquePathsInGridII(newArray, true, ignoreLast);
				removedPaths *= uniquePathsI([i + 1, j + 1]);

				totalPossiblePaths -= removedPaths;
			}
		}

	}

	return totalPossiblePaths;
}

function shortestPathInGrid(data) {
    let H = data.length, W = data[0].length;
	let dist = Array.from(Array(H), () => Array(W).fill(Number.POSITIVE_INFINITY));
	dist[0][0] = 0;

	let queue = [[0, 0]];
	while (queue.length > 0) {
		let [i, j] = queue.shift();
		let d = dist[i][j];

		if (i > 0 && d + 1 < dist[i - 1][j] && data[i - 1][j] !== 1) { dist[i - 1][j] = d + 1; queue.push([i - 1, j]); }
		if (i < H - 1 && d + 1 < dist[i + 1][j] && data[i + 1][j] !== 1) { dist[i + 1][j] = d + 1; queue.push([i + 1, j]); }
		if (j > 0 && d + 1 < dist[i][j - 1] && data[i][j - 1] !== 1) { dist[i][j - 1] = d + 1; queue.push([i, j - 1]); }
		if (j < W - 1 && d + 1 < dist[i][j + 1] && data[i][j + 1] !== 1) { dist[i][j + 1] = d + 1; queue.push([i, j + 1]); }
	}

	let path = "";
	if (Number.isFinite(dist[H - 1][W - 1])) {
		let i = H - 1, j = W - 1;
		while (i !== 0 || j !== 0) {
			let d = dist[i][j];

			let new_i = 0, new_j = 0, dir = "";
			if (i > 0 && dist[i - 1][j] < d) { d = dist[i - 1][j]; new_i = i - 1; new_j = j; dir = "D"; }
			if (i < H - 1 && dist[i + 1][j] < d) { d = dist[i + 1][j]; new_i = i + 1; new_j = j; dir = "U"; }
			if (j > 0 && dist[i][j - 1] < d) { d = dist[i][j - 1]; new_i = i; new_j = j - 1; dir = "R"; }
			if (j < W - 1 && dist[i][j + 1] < d) { d = dist[i][j + 1]; new_i = i; new_j = j + 1; dir = "L"; }

			i = new_i; j = new_j;
			path = dir + path;
		}
	}

	return path;
}


function sanitizeParentheses(data) {
    var left = 0
	var right = 0
	var res = []
	for (var i = 0; i < data.length; ++i) {
		if (data[i] === '(') {
			++left
		} else if (data[i] === ')') {
			left > 0 ? --left : ++right
		}
	}

	function dfs(pair, index, left, right, s, solution, res) {
		if (s.length === index) {
			if (left === 0 && right === 0 && pair === 0) {
				for (var i = 0; i < res.length; i++) {
					if (res[i] === solution) {
						return
					}
				}
				res.push(solution)
			}
			return
		}
		if (s[index] === '(') {
			if (left > 0) {
				dfs(pair, index + 1, left - 1, right, s, solution, res)
			}
			dfs(pair + 1, index + 1, left, right, s, solution + s[index], res)
		} else if (s[index] === ')') {
			if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res)
			if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res)
		} else {
			dfs(pair, index + 1, left, right, s, solution + s[index], res)
		}
	}

	dfs(0, 0, left, right, data, '', res)
	return res
}

function findAllValidMathExpressions(arrayData) {
    let i, j, k;

	let operatorList = ["", "+", "-", "*"];
	let validExpressions = [];

	let tempPermutations = Math.pow(4, (arrayData[0].length - 1));

	for (i = 0; i < tempPermutations; i++) {

		if (!Boolean(i % 100000)) {
			//ns.tprint(i + "/" + tempPermutations + ", " + validExpressions.length + " found.");
			//await ns.sleep(10);
		}

		let arraySummands = [];
		let candidateExpression = arrayData[0].substr(0, 1);
		arraySummands[0] = parseInt(arrayData[0].substr(0, 1));

		for (j = 1; j < arrayData[0].length; j++) {
			candidateExpression += operatorList[(i >> ((j - 1) * 2)) % 4] + arrayData[0].substr(j, 1);

			let rollingOperator = operatorList[(i >> ((j - 1) * 2)) % 4];
			let rollingOperand = parseInt(arrayData[0].substr(j, 1));

			switch (rollingOperator) {
				case "":
					rollingOperand = rollingOperand * (arraySummands[arraySummands.length - 1] / Math.abs(arraySummands[arraySummands.length - 1]));
					arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * 10 + rollingOperand;
					break;
				case "+":
					arraySummands[arraySummands.length] = rollingOperand;
					break;
				case "-":
					arraySummands[arraySummands.length] = 0 - rollingOperand;
					break;
				case "*":
					while (j < arrayData[0].length - 1 && ((i >> (j * 2)) % 4) === 0) {
						j += 1;
						candidateExpression += arrayData[0].substr(j, 1);
						rollingOperand = rollingOperand * 10 + parseInt(arrayData[0].substr(j, 1));
					}
					arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * rollingOperand;
					break;
			}
		}

		let rollingTotal = arraySummands.reduce(function (a, b) { return a + b; });

		if (arrayData[1] === rollingTotal) {
			validExpressions[validExpressions.length] = candidateExpression;
		}
	}

	// Filter out expressions containing numbers with trailing zeros
	validExpressions = validExpressions.filter(expr => {
		// Split by operators to get individual numbers
		const numbers = expr.split(/[+\-*]/);
		// Check if any number has a leading zero (except for single 0)
		return !numbers.some(num => num.length > 1 && num[0] === '0');
	});

	return JSON.stringify(validExpressions);
}

function hammingCodesIntegerToBinary(data) {
    return false;
}

function hammingCodesBinaryToInteger(data) {
    return false;
}

function proper2ColoringOfGraph(data) {
    //Helper function to get neighbourhood of a vertex
	function neighbourhood(vertex) {
		const adjLeft = data[1].filter(([a, _]) => a == vertex).map(([_, b]) => b);
		const adjRight = data[1].filter(([_, b]) => b == vertex).map(([a, _]) => a);
		return adjLeft.concat(adjRight);
	}

	//Verify that there is no solution by attempting to create a proper 2-coloring.
	const coloring = Array(data[0]).fill(undefined);
	while (coloring.some((val) => val === undefined)) {
		//Color a vertex in the graph
		const initialVertex = coloring.findIndex((val) => val === undefined);
		coloring[initialVertex] = 0;
		const frontier = [initialVertex];

		//Propogate the coloring throughout the component containing v greedily
		while (frontier.length > 0) {
			const v = frontier.pop() || 0;
			const neighbors = neighbourhood(v);

			//For each vertex u adjacent to v
			for (const id in neighbors) {
				const u = neighbors[id];

				//Set the color of u to the opposite of v's color if it is new,
				//then add u to the frontier to continue the algorithm.
				if (coloring[u] === undefined) {
					if (coloring[v] === 0) coloring[u] = 1;
					else coloring[u] = 0;

					frontier.push(u);
				}

				//Assert u,v do not have the same color
				else if (coloring[u] === coloring[v]) {
					//If u,v do have the same color, no proper 2-coloring exists, meaning
					//the player was correct to say there is no proper 2-coloring of the graph.
					return "[]";
				}
			}
		}
	}
	return coloring;
}

function rleCompression(data) {
    let chars= Array.from(data);
	let answer= '';
	let current= undefined;
	let count= 0;
	while (chars.length > 0) {
		let char= chars.shift();
		switch (current) {
			case undefined:
				current= char;
				count= 1;
				break;
			case char:
				if (count == 9) {
					answer = `${answer}${count}${current}`;	
					count= 0;
				}
				count++;				
				break;
			default:
				answer = `${answer}${count}${current}`;
				current= char;
				count= 1;
				break;				
		}
	}
	answer = `${answer}${count}${current}`;
	return answer;
}

function lzDecompression(data) {
    let plain = "";

	for (let i = 0; i < data.length;) {
		const literal_length = data.charCodeAt(i) - 0x30;

		if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > data.length) {
			return null;
		}

		plain += data.substring(i + 1, i + 1 + literal_length);
		i += 1 + literal_length;

		if (i >= data.length) {
			break;
		}
		const backref_length = data.charCodeAt(i) - 0x30;

		if (backref_length < 0 || backref_length > 9) {
			return null;
		} else if (backref_length === 0) {
			++i;
		} else {
			if (i + 1 >= data.length) {
				return null;
			}

			const backref_offset = data.charCodeAt(i + 1) - 0x30;
			if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
				return null;
			}

			for (let j = 0; j < backref_length; ++j) {
				plain += plain[plain.length - backref_offset];
			}

			i += 2;
		}
	}

	return plain;
}

function lzCompression(plain) {
    let cur_state = Array.from(Array(10), () => Array(10).fill(null));
	let new_state = Array.from(Array(10), () => Array(10));

	function set(state, i, j, str) {
		const current = state[i][j];
		if (current == null || str.length < current.length) {
			state[i][j] = str;
		} else if (str.length === current.length && Math.random() < 0.5) {
			// if two strings are the same length, pick randomly so that
			// we generate more possible inputs to Compression II
			state[i][j] = str;
		}
	}

	// initial state is a literal of length 1
	cur_state[0][1] = "";

	for (let i = 1; i < plain.length; ++i) {
		for (const row of new_state) {
			row.fill(null);
		}
		const c = plain[i];

		// handle literals
		for (let length = 1; length <= 9; ++length) {
			const string = cur_state[0][length];
			if (string == null) {
				continue;
			}

			if (length < 9) {
				// extend current literal
				set(new_state, 0, length + 1, string);
			} else {
				// start new literal
				set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
			}

			for (let offset = 1; offset <= Math.min(9, i); ++offset) {
				if (plain[i - offset] === c) {
					// start new backreference
					set(new_state, offset, 1, string + String(length) + plain.substring(i - length, i));
				}
			}
		}

		// handle backreferences
		for (let offset = 1; offset <= 9; ++offset) {
			for (let length = 1; length <= 9; ++length) {
				const string = cur_state[offset][length];
				if (string == null) {
					continue;
				}

				if (plain[i - offset] === c) {
					if (length < 9) {
						// extend current backreference
						set(new_state, offset, length + 1, string);
					} else {
						// start new backreference
						set(new_state, offset, 1, string + "9" + String(offset) + "0");
					}
				}

				// start new literal
				set(new_state, 0, 1, string + String(length) + String(offset));

				// end current backreference and start new backreference
				for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
					if (plain[i - new_offset] === c) {
						set(new_state, new_offset, 1, string + String(length) + String(offset) + "0");
					}
				}
			}
		}

		const tmp_state = new_state;
		new_state = cur_state;
		cur_state = tmp_state;
	}

	let result = null;

	for (let len = 1; len <= 9; ++len) {
		let string = cur_state[0][len];
		if (string == null) {
			continue;
		}

		string += String(len) + plain.substring(plain.length - len, plain.length);
		if (result == null || string.length < result.length) {
			result = string;
		} else if (string.length == result.length && Math.random() < 0.5) {
			result = string;
		}
	}

	for (let offset = 1; offset <= 9; ++offset) {
		for (let len = 1; len <= 9; ++len) {
			let string = cur_state[offset][len];
			if (string == null) {
				continue;
			}

			string += String(len) + "" + String(offset);
			if (result == null || string.length < result.length) {
				result = string;
			} else if (string.length == result.length && Math.random() < 0.5) {
				result = string;
			}
		}
	}

	return result ?? "";
}

function caesarCipher(data) {
    return false;
}

function vigenereCipher(data) {
    return false;
}

function squareRoot(data) {
    return false;
}
