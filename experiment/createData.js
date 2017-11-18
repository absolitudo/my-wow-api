
let http = require('http')

let alchemy = {}

http.get('http://mop-shoot.tauri.hu/?spell=114773', function(res) {
    res.on('data', chunk => {
        chunk = chunk.toString()

        /* get reguired profession level of the recipe */
        let levelRegExp = /\d+/.exec(/Requires \w+ \(\d+\)/g.exec(chunk))
        levelRegExp && console.log(+levelRegExp[0])



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