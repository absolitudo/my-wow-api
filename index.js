var express = require('express')
var app = express()

/* Routes */
var professionRoutes = require('./professions/routes')

app.use('/professions', professionRoutes)

app.get('/', (req, res) => {
    res.send('This is my own api server for some wow stuff because i could\'nt find anything that would provide me the data that i need' )
})
 
app.listen(process.env.PORT || 3000, () => console.log('server up'))