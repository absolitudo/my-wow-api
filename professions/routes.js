var router = require('express').Router()

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/professions.json')
})

router.get('/all', (req, res) => {
    res.sendFile(__dirname + '/allProfessions.json')
})

router.get('/alchemy', (req, res) => {
    res.sendFile(__dirname + '/alchemy.json')
})

router.get('/blacksmithing', (req, res) => {
    res.sendFile(__dirname + '/blacksmithing.json')
})

router.get('/enchanting', (req, res) => {
    res.sendFile(__dirname + '/enchanting.json')
})

router.get('/engineering', (req, res) => {
    res.sendFile(__dirname + '/engineering.json')
})

router.get('/inscription', (req, res) => {
    res.sendFile(__dirname + '/inscription.json')
})

router.get('/jewelcrafting', (req, res) => {
    res.sendFile(__dirname + '/jewelcrafting.json')
})

router.get('/leatherworking', (req, res) => {
    res.sendFile(__dirname + '/leatherworking.json')
})

router.get('/mining', (req, res) => {
    res.sendFile(__dirname + '/mining.json')
})

router.get('/tailoring', (req, res) => {
    res.sendFile(__dirname + '/tailoring.json')
})

module.exports = router