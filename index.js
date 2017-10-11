var express = require('express')
var app = express()
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/professions/alchemy.json')
})
 
app.listen(process.env.PORT || 3000, () => console.log('server up'))