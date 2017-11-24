const express = require('express')
const cors = require('cors')
let app = express()

/* Routes */
const professionRoutes = require('./routes/profession')
const iconRoutes = require('./routes/icon')
app.use('/professions', cors())
app.use('/professions', professionRoutes)
app.use('/icon', iconRoutes)

app.get('/', (req, res) => {
    res.send('A wow releated api.')
})
 
app.listen(process.env.PORT || 7777, () => console.log('server up'))