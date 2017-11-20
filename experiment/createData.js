
let http = require('http')

let alchemy = {}

var spellID = 28587

const getItemID = (itemName) => {
    return new Promise((resolve, reject) => {
        // get the id of the item somehow to be able to get information
    })
}

/* Returns the html of the requested webpage */
const getData = (ID, isSpell) => {
    return new Promise((resolve, reject) => {
        http.get('http://mop-shoot.tauri.hu/?' + (isSpell ? 'spell' : item) + '=' + ID, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                chunk = chunk.toString()
                data += chunk
            })
        
            res.on('end', (something) => {
                resolve(data)
            })
        })
    })
}
/* Returns the information of an item from spell id */
async function getItemInfoFromItemID(ID) {
    let item = {}
    let data = await getData(ID, false)
}

/* Returns the information of an item from spell id */
async function getItemInfoFromSpellID(ID) {
    let item = {}
    let data = await getData(ID, true)
    console.log(data)
    /* Get reguired profession level of the recipe */
    item.profReq = +/\d+/.exec(/Requires \w+ \(\d+\)/g.exec(data))[0]

    /* Get the name of the item or recipe */
    let nameRegExp = /<h1>[\w ']+<\/h1>/g.exec(data)[0]
    item.name = nameRegExp.replace(/<(.*?)>/g, '')

    /* Get the ID of the item */
    let itemIDRegExp = new RegExp('<a href="\\?item=\\d+">' + item.name,'g')
    itemIDRegExp = /\d+/.exec(itemIDRegExp.exec(data))[0]
    item.id = +itemIDRegExp

    /* Get item quantity */
    let itemQuantityRegExp = new RegExp('createIcon\\(' + item.id + ', \\d+, \\d+\\)')
    item.quantity = /\d+\)$/.exec(itemQuantityRegExp.exec(data))[0]
    item.quantity = +item.quantity.replace(/\)/, '')
    
    /* Get iconName */
    let itemObjectRegExp = new RegExp('_\\[' + item.id + '\\](.+?)}')
    let iconNameRegExp = /icon:(.*?),/.exec(itemObjectRegExp.exec(data)[0])[0]
    item.icon = iconNameRegExp.replace(/icon:/, '')

    /* Get item quality */
    let itemQualityRegExp = /quality:\d+/.exec(itemObjectRegExp.exec(data)[0])
    item.quality = +/\d+/.exec(itemQualityRegExp[0])[0]
    
    /* Get tooltip */
    let tooltipRegExp = /<table class="tooltip-t"(.*)/.exec(data)[0]
    item.tooltip = tooltipRegExp
        .split(/(<td>|<br[ /]?[ /]?>)/)
        .map(string => string
            .replace(/<(.*?)>/g, '')
            .trim()
        )
        .filter(string => string !== '' && !string.includes('Reagents'))
    
    /* Get reagents */
    let reagentsRegExp = /Reagents:(.*?)<br>/.exec(data)
    item.reagents = reagentsRegExp[0]
        .replace(/(Reagents: |<(.*?)>|\(|\))/g, '')
        .split(',')
        .map(reagent => {
            let reagentName = reagent.replace(/\d+/g, '').trim()
            let reagentIDRegExp = new RegExp('item=\\d+">' + reagentName)
            let reagentID = +/\d+/.exec(reagentIDRegExp.exec(data)[0])[0]
            return {
                name: reagentName,
                id: reagentID,
                quantity: /\d+/.exec(reagent) ? +/\d+/.exec(reagent)[0] : 1
            }
        })
    return item
}

async function main() {
    console.log(await getItemInfoFromSpellID(spellID, true))
}

main()

/*
let alchemy = require('./alchemy.json')
let length = 0
for(let item in alchemy) {
    console.log(alchemy[item])
    length += 1
}

console.log(length)
*/