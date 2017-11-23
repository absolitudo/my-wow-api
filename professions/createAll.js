let alchemy = require('./alchemy.json')
let blacksmithing = require('./blacksmithing.json')
let enchanting = require('./enchanting.json')
let engineering = require('./engineering.json')
let inscription = require('./inscription.json')
let jewelcrafting = require('./jewelcrafting.json')
let leatherworking = require('./leatherworking.json')
let mining = require('./mining.json')
let tailoring = require('./tailoring.json')

let fs = require('fs')

let all = {
    alchemy,
    blacksmithing,
    enchanting,
    engineering,
    inscription,
    jewelcrafting,
    leatherworking,
    mining,
    tailoring
}

fs.writeFile('all.json', JSON.stringify(all), (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log('done')
    }
})