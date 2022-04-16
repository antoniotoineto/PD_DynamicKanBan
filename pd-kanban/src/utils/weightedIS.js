class Job
{
	constructor(start, finish, profit)
	{
		this.start = start
		this.finish = finish
		this.profit = profit
	}
}

function jobComparator(s1, s2){
	
	return s2.finish - s1.finish;
}

function latestNonConflict(arr, i){
	
	for(let j = i - 1; j >= 0; j--)
	{
		if(arr[j].finish <= arr[i - 1].start)
			return j
	}	
	return -1
}

function findMaxProfitRec(arr, n){
	
	if(n == 1)
		return arr[n - 1].profit

	let inclProf = arr[n - 1].profit
	let i = latestNonConflict(arr, n)
	
	if(i != -1)
		inclProf += findMaxProfitRec(arr, i + 1)

	let exclProf = findMaxProfitRec(arr, n - 1)
	return Math.max(inclProf, exclProf)
}

function findMaxProfit(arr, n){
	
	arr.sort(jobComparator)
	return findMaxProfitRec(arr, n)

}

let values = [ [1, 3, 20], [4, 5, 500], [4, 6, 150] ]
let arr = []
for(let i of values)
	arr.push(new Job(i[0], i[1], i[2]))
	
let n = arr.length
//console.log("The optimal profit is", findMaxProfit(arr, n))
