let today = new Date()
let todayString = today.toISOString().split('T')[0]
let cekDB = new Date("2021-04-05T01:59:58.000Z")
let ceDBString = cekDB.toISOString().split('T')[0]

  //2021-04-08T09:35:52.698Z >>>>> 2021-04-05T01:59:58.000Z

  console.log( todayString, '>>>>>',  ceDBString)

let todayYear = today.getFullYear()
let todayMonth = today.getMonth()
let todayDate = today.getDate()

let dbDate = cekDB.getDate()
let dbMonth = cekDB.getMonth()
let dbYear = cekDB.getFullYear()


console.log(`${todayYear}-${todayMonth}-${todayDate}`," >>>>>>today")
console.log(dbYear, dbMonth, dbDate, '>>>>>>>>>>DB')


let a = 'completed'
let b = a[0].toUpperCase() + a.slice(1)
console.log(b)