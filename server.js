require('dotenv').config() // load env variables
const express = require('express')
const morgan=require('morgan') // logger for our request
const methodOverride=require('method-override') //override post requrestfrom our ejs/forms
const mongoose=require('mongoose')//bring in mongoose, db connection and cool methods for CRUD to the datas
const { boolean } = require('webidl-conversions')
const PORT=process.env.PORT
const app = express()

// database connection
const DATABASE_URL=process.env.DATABASE_URL
const CONFIG={
    useNewUrlParser: true,
    useUnifiedTopology: true
}

//establish connection
mongoose.connect(DATABASE_URL, CONFIG)

//log connections events from mongoose
mongoose.connection
    .on('open',()=>{
        console.log('Mongoose connected')
    })
    .on('close',()=>{
        console.log('Mongoose disconnected')
    })
    .on('error',(error)=>{
        console.log('Mongoose error', error)
    })

// animals model
const {Schema, model} = mongoose // destructuring, grabbing model and Schema off mongoose variable

//make schema, cookie cutter
const animalsSchema=new Schema({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number
})

const Animals=model('Animals', animalsSchema)

// middlewares
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

//
app.get('/',(req, res)=>{
    res.send('Server doing what it should be doing')
})

app.get('/animals/seed', (req, res)=>{
    // define data we want to put in the database
    const startingAnimals = [
        {species: "Lion", extinct: false, location: "Africa, India", lifeExpectancy: 15},
        {species: "Tiger", extinct: false, location: "Asia", lifeExpectancy: 10},
        {species: "Elephant", extinct: false, location: "Africa, Asia", lifeExpectancy: 70},
        {species: "Dodo", extinct: true, location: "Africa", lifeExpectancy: 30},
        {species: "Mammoth", extinct: true, location: "Northern Eurasia, North America", lifeExpectancy: 60}
    ]
    // detele all animals
    Animals.deleteMany({}, (err, data)=>{ //{grab everything}
        // create new animals once old animals are deleted
        Animals.create(startingAnimals, (err, createdAnimals)=>{
            res.json(createdAnimals)
        })
    })
})

app.get('/animals', (req, res)=>{
    // get all aniamsl from mongo and send them back
    Animals.find({})
    .then((animals)=>{
        //res.json(animals)
        res.render('animals/index.ejs', {animals})
    })
})

app.get('/animals/new', (req, res)=>{
    res.render('animals/new.ejs')
})

app.post('/animals', (req, res)=>{
    req.body.extinct= req.body.extinct === 'on' ? true : false
    Animals.create(req.body, (err, createdAnimal)=>{
       
        res.redirect('/animals')
    })
})

app.get('/animals/:id/edit', (req, res)=>{
    const id=req.params.id
    Animals.findById(id, (err, foundAnimal)=>{
        //res.json(foundAnimal)
        res.render('animals/edit.ejs', { animal:foundAnimal }) //name foundAnimal to animal
    })
})

app.put('/animals/:id', (req, res)=>{
// id of the animal I want to update, req.body=whatever data in the form when I hit submit,in the call back function, update to the newest version
    req.body.extinct= req.body.extinct === 'on' ? true : false  
    Animals.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedAnimal)=>{
        res.redirect(  `/animals/${req.params.id}`)
    })
})


app.get('/animals/:id', (req, res)=>{
    // go and get animal from the database
   Animals.findById(req.params.id)
   //find the animal and send it to the edit.ejs to prepopulate the form
   .then((animal)=>{
    res.render('animals/show.ejs', {animal})
    })
})

app.delete('/animals/:id', (req, res)=>{
    // Animals.findByIdAndDelete(req.params.id, (err, deletedAnimal)=>{
    //     res.redirect('/animals')
    // })
    Animals.findByIdAndDelete(req.params.id)
    .then((deletedAnimal)=>{
        res.redirect('/animals')
    })
})

app.listen(PORT, ()=>{
    console.log(`express is listening on port: ${PORT}`)
})