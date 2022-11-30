require('dotenv').config() // load env variables
const express = require('express')
const morgan=require('morgan') // logger for our request
const methodOverride=require('method-override') //override post requrestfrom our ejs/forms
const PORT=process.env.PORT
//const Animals=require('./models/animal')
const animalsRouter=require('./controllers/animals')
const app = express()

// middlewares
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/animals',animalsRouter)

app.listen(PORT, ()=>{
    console.log(`express is listening on port: ${PORT}`)
})