require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.status(200).send('Hello World!')
})

const port = process.env.PORT || 3000
app.listen(port, () => 
  console.log(`Server is listening on port ${port}.`)
)