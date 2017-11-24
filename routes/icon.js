let router = require('express').Router()
let path = require('path')

router.get('/', (req, res) => {
    if(req.query.name) {
        res.sendFile(path.join(__dirname, '../icons/' + req.query.name))
    } else {
        res.end({
            err: 'You need to provide a query called name with an icon name, example: "/icon?name=inv_axe_11.png"'
        })
    }
})

module.exports = router