class Task
{
	constructor(start, finish, value)
	{
		this.start = start
		this.finish = finish
		this.value = value
	}
}

function jobComparator(s1, s2){
	
	return s2.finish - s1.finish;
}

function latestNonConflict(arr, j){
	
    if(j==0){
        console.log('null')
        return null
    }

	for(let i = j; i > 0; i--) // acho que o problema ta nesse for aqui
	{
		if(arr[i].start >= arr[j - 1].finish)
            console.log('Task nao conflitante de ',i,'eh ',j-1)
			return j-1
	}	
	return -1
}

let values = [ [1, 2, 20], [3, 4, 500], [5, 6, 150], [7, 8, 34], [9, 10, 35] ]
let arr = []
for(let i of values)
	arr.push(new Task(i[0], i[1], i[2]))

console.log('Not ordered:',arr)

arr.sort(jobComparator);
arr.reverse();
console.log('Ordered:',arr);

let arrayNaoConf = []
for(let j = 0; j < arr.length; j++){
    console.log(j)
    arrayNaoConf.push(latestNonConflict(arr, j))
    
}

// agora falta fazer o array M[] do video

console.log(arrayNaoConf)
