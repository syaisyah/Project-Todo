let today = new Date()
// const todayString = today.toISOString().split('T')[0]
// console.log(todayString)
console.log(today,'before')

let a = today

a.date= a.getDate() + 4
let getYear =  a.getFullYear()
let getMonth = a.getMonth()

console.log(a, 'after')


