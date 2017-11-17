
let http = require('http')

http.get('http://mop-shoot.tauri.hu/?spell=11479', function(res) {
    res.on('data', chunk => {
        console.log(chunk.toString())
    })
}).on('error', function(e) {
    console.log("Got error: " + e.message);
})

/*
let alchemy = require('./alchemy.json')
let length = 0
for(let item in alchemy) {
    console.log(alchemy[item])
    length += 1
}

console.log(length)
*/