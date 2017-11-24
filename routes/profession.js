let router = require('express').Router()
let path = require('path')
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/allProfessions.json'))
})

router.get('/all', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/allProfessions.json'))
})

router.get('/alchemy', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/alchemy.json'))
})

router.get('/blacksmithing', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/blacksmithing.json'))
})

router.get('/enchanting', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/enchanting.json'))
})

router.get('/engineering', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/engineering.json'))
})

router.get('/inscription', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/inscription.json'))
})

router.get('/jewelcrafting', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/jewelcrafting.json'))
})

router.get('/leatherworking', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/leatherworking.json'))
})

router.get('/mining', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/mining.json'))
})

router.get('/tailoring', (req, res) => {
    res.sendFile(path.join(__dirname, '../professions/tailoring.json'))
})

module.exports = router