var express = require('express')
var app = express()

/* Routes */
var professionRoutes = require('./professions/routes')

app.use('/professions', professionRoutes)

app.get('/', (req, res) => {
    res.send('home?')
})
 
app.listen(process.env.PORT || 3000, () => console.log('server up'))