var router = require('express').Router()

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/professions.json')
})

router.get('/alchemy', (req, res) => {
    res.sendFile(__dirname + '/alchemy.json')
})

router.get('/blacksmithing', (req, res) => {
    res.sendFile(__dirname + '/blacksmithing.json')
})


module.exports = router