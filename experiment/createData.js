const request = require('request')
const fs = require('fs')
const http = require('http')

/* Downloads icon */
const getIcon = (iconName) => {
    return new Promise((resolve, reject) => {
        request('http://mop-static.tauri.hu/images/icons/medium/' + iconName)
            .pipe(fs.createWriteStream('./icons/' + iconName))
            .on('close', resolve('Icon downloaded'))
    })
}

/* Check if a file already exists */
const doesFileExist = (path) => {
    try {
        fs.accessSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

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

/* Gets item quantity */
const getQuantityFromItemId = (id, data) => {
    let itemQuantityRegExp = new RegExp('createIcon\\(' + id + ', \\d+, \\d+\\)')
    let quantity = /\d+\)$/.exec(itemQuantityRegExp.exec(data)) ? +/\d+\)$/.exec(itemQuantityRegExp.exec(data))[0].replace(/\)/, '') : 1
    return quantity
}

/* Gets the tooltip of an item */
const getTooltip = (tooltipRegExp, name) => {
    return tooltipRegExp
        .split(/(<td>|<br[ /]?[ /]?>|<th>|<\/th>)/)
        .filter(string => !string.includes('Reagent') && !string.includes(name))
        .reduce((acc, curr) => {
            if(curr.includes('sec cast')) {
                acc.castTime = curr.replace(/<(.*?)>/g, '')
            } else if(curr.includes('Item Level')) {
                acc.itemLevel = +/\d+/.exec(curr.replace(/<(.*?)>/g, ''))[0]
            } else if(curr.includes('Requires')) {
                acc.requiredLevel = +/\d+/.exec(curr.replace(/<(.*?)>/g, ''))[0]
            } else if(curr.includes('Stack')) {
                acc.maxStack = +/\d+/.exec(curr.replace(/<(.*?)>/g, ''))[0]
            } else if(curr.includes('Sell Price:')) {
                
                let moneycopper = /<span class="moneycopper">\d+<\/span>/.exec(curr) ? +/\d+/.exec(/<span class="moneycopper">\d+<\/span>/.exec(curr)[0]) : 0
                let moneysilver = /<span class="moneysilver">\d+<\/span>/.exec(curr) ? +/\d+/.exec(/<span class="moneysilver">\d+<\/span>/.exec(curr)[0]) : 0
                let moneygold = /<span class="moneygold">\d+<\/span>/.exec(curr) ? +/\d+/.exec(/<span class="moneygold">\d+<\/span>/.exec(curr)[0]) : 0

                acc.vendorSellPrice = moneygold + (moneysilver / 100) + (moneycopper / 10000)
            } else {
                curr = curr.replace(/<(.*?)>/g, '')
                if(curr) {
                    acc.description.push(curr)
                }
            }
            return acc
        },{description: []})
}
/* Returns the information of an item from spell id */
const getReagentTooltip = async (ID, name) => {
    let data = await getData(ID, false)
    return new Promise((resolve, reject) => {
        let tooltipRegExp = /<table class="tooltip-table(.*)/.exec(data)[0]
        resolve(getTooltip(tooltipRegExp, name))
    })
}

/* Gets the information of the item */
const getItemInfo = async (ID, spell) => {
    let item = {}
    let data = await getData(ID, true)

    item.name = spell.name_enus
    item.iconName = spell.icon.toLocaleLowerCase()

    /* Get icon */
    if(!doesFileExist('./icons/' + item.iconName + '.png')) {
        getIcon(item.iconName + '.png')
    } 

    /* Get reguired profession level of the recipe */
    item.profReq = /Requires \w+ \(\d+\)/g.exec(data) ? +/\d+/.exec(/Requires \w+ \(\d+\)/g.exec(data))[0] : undefined

    /* Get the object of the item on the page to get more info from it */
    let itemObject = /_\[\d+\]={icon:'(.*?)',name_enus:'(.*?)'.quality:\d+}/.exec(data)[0]

    /* Get the item id */
    item.id = +/\d+/.exec(itemObject)[0]

    /* Get item quantity */
    item.quantity = getQuantityFromItemId(item.id, data)

    /* Get item quality */
    item.quality = +/\d+}$/.exec(itemObject)[0].replace('}', '')

    /* Get tooltip */
    let tooltipRegExp = /<table class="tooltip-t"(.*)/.exec(data)[0]
    item.tooltip = getTooltip(tooltipRegExp, item.name)
    
    /* Get reagents */
    let reagentsRegExp = /<table class="iconlist">([\s\S]+?|.*?)<\/table>/.exec(data)
    item.reagents = await Promise.all(
        reagentsRegExp[0]
            .split('<tr>')
            .filter(string => string.includes('item='))
            .map(async (reagent) => {
                let reagentName = />.(.*?)<\/a>/.exec(reagent)[0].replace(/(<(.*?)>|<|>)/g, '').trim()
                let reagentID = +/\d+/.exec(/<a href="\?item=\d+">/.exec(reagent)[0])[0]
                let reagentObjectRegExp = new RegExp('_\\[' + reagentID + '\\]' + '(.*?)};')
                reagentObjectRegExp = reagentObjectRegExp.exec(data)[0]
                let reagentIconName = /icon:'(.*?),/.exec(reagentObjectRegExp)[0].replace(/(icon:|'|,)/g, '').toLocaleLowerCase()
                let reagentQuantity = getQuantityFromItemId(reagentID, data)
                let reagentQuality = +/\d+/.exec(/quality:\d+/.exec(reagentObjectRegExp)[0])[0]
                if(!doesFileExist('./icons/' + reagentIconName + '.png')) {
                    await getIcon(reagentIconName + '.png')
                }

                return {
                    name: reagentName,
                    id: reagentID,
                    tooltip: await getReagentTooltip(reagentID, reagentName),
                    iconName: reagentIconName,
                    quality: reagentQuality,
                    quantity: reagentQuantity
                }
            })
        )
    return item
}

async function main() {
    

    let profession = require('./alchemy.json')
    let newProfession = {}
    for(let spellID in profession) {
        try {
            console.log(spellID, 'is processing')
            let item = await getItemInfo(spellID, profession[spellID])
            newProfession[item.name] = item
            console.log(spellID, item.name, 'is processed')
        } catch(e) {
            console.log(spellID, profession[spellID].name_enus, 'failed')
        }
    }
    
    fs.writeFile('new-enchanting.json', JSON.stringify(newProfession), (something) => {
        if(something) {
            console.log(something)
        } else {
            console.log('done')
        }
    })
}

main()
