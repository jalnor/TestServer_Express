const express = require('express')
const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')
const braintreeRoute = require('./routes/braintreeRoute')

const port = 8383

const app = express()

app.use(express.json())
app.use(braintreeRoute)
app.use(userRoute)
app.use(bodyParser.json())


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

