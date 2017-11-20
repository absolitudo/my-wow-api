
let http = require('http')

let alchemy = {}

var spellID = 28587

/* Returns the html of the requested webpage */
const getData = (ID, isSpell) => {
    return new Promise((resolve, reject) => {
        http.get('http://mop-shoot.tauri.hu/?' + (isSpell ? 'spell' : 'item') + '=' + ID, (res) => {
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
const getItemInfoFromItemID = async (ID, name) => {
    let data = await getData(ID, false)
    return new Promise((resolve, reject) => {
        let tooltipRegExp = /tooltip-table(.*)/.exec(data)[0]
        resolve(
            tooltipRegExp
                .split(/(<td>|<br[ /]?[ /]?>)/)
                .map(string => string
                    .replace(/<(.*?)>/g, '')
                    .trim()
                )
                .filter(string => string !== '' && !string.includes('tooltip') && !string.includes(name))
        )
    })
}

/* Returns the information of an item from spell id */
const getItemInfoFromSpellID = async (ID) => {
    let item = {}
    let data = await getData(ID, true)
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
    item.reagents = await Promise.all(reagentsRegExp[0]
        .replace(/(Reagents: |<(.*?)>|\(|\))/g, '')
        .split(',')
        .map(async (reagent) => {
            let reagentName = reagent.replace(/\d+/g, '').trim()
            let reagentIDRegExp = new RegExp('item=\\d+">' + reagentName)
            let reagentID = +/\d+/.exec(reagentIDRegExp.exec(data)[0])[0]
            return {
                name: reagentName,
                id: reagentID,
                tooltip: await getItemInfoFromItemID(reagentID, reagentName),
                quantity: /\d+/.exec(reagent) ? +/\d+/.exec(reagent)[0] : 1
            }
        }))
    return item
}

async function main() {
    let item = await getItemInfoFromSpellID(spellID, true)
    item.reagents.map(reagent => console.log(reagent.tooltip))
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