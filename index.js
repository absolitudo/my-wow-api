var express = require('express')
var cors = require('cors')
var app = express()

/* Routes */
var professionRoutes = require('./professions/routes')
app.use('/professions', cors())
app.use('/professions', professionRoutes)

app.get('/', (req, res) => {
    res.send('A wow releated api.')
})
 
app.listen(process.env.PORT || 7777, () => console.log('server up'))