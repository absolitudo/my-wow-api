
let http = require('http')

let alchemy = {}

let spellID = 114773

http.get('http://mop-shoot.tauri.hu/?spell=' + spellID, function(res) {

    

    let data = ''

    res.on('data', chunk => {
        chunk = chunk.toString()
        data += chunk

        


    })

    res.on('end', (something) => {

        let level
        let name
        let itemID
        let itemQuantity
        let iconName
        let itemQuality
        let reagents

        /* Get reguired profession level of the recipe */
        level = +/\d+/.exec(/Requires \w+ \(\d+\)/g.exec(data))[0]

        /* Get the name of the item or recipe */
        let nameRegExp = /<h1>[\w ']+<\/h1>/g.exec(data)[0]
        name = nameRegExp.replace(/<(.*?)>/g, '')

        /* Get the ID of the item */
        let itemIDRegExp = new RegExp('<a href="\\?item=\\d+">' + name,'g')
        itemIDRegExp = /\d+/.exec(itemIDRegExp.exec(data))[0]
        itemID = +itemIDRegExp

        /* Get item quantity */
        let itemQuantityRegExp = new RegExp('createIcon\\(' + itemID + ', \\d+, \\d+\\)')
        itemQuantity = /\d+\)$/.exec(itemQuantityRegExp.exec(data))[0]
        itemQuantity = +itemQuantity.replace(/\)/, '')
        
        /* Get iconName */
        let itemObjectRegExp = new RegExp('_\\[' + itemID + '\\](.+?)}')
        let iconNameRegExp = /icon:(.*?),/.exec(itemObjectRegExp.exec(data)[0])[0]
        iconName = iconNameRegExp.replace(/icon:/, '')

        /* Get item quality */
        let itemQualityRegExp = /quality:\d+/.exec(itemObjectRegExp.exec(data)[0])
        itemQuality = +/\d+/.exec(itemQualityRegExp[0])[0]
        
        /* Get reagents */
        let reagentsRegExp = /Reagents:(.*?)<br>/.exec(data)
        reagents = reagentsRegExp[0]
            .replace(/(Reagents: |<(.*?)>|\(|\))/g, '')
            .split(',')
            .map(reagent => {
                return {
                    name: reagent.replace(/\d+/g).trim(),
                    quantity: /\d+/.exec(reagent) ? +/\d+/.exec(reagent)[0] : 1
                }
            })
        console.log(level, name, itemID, itemQuantity, iconName, itemQuality, reagents)
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