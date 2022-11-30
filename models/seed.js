require('dotenv').config()
const mongoose=require('./connection')
const Animals=require('./animal')

mongoose.connection.on('open', ()=>{
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
            console.log(createdAnimals)
        })
    })
})