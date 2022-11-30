const mongoose=require('./connection')
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

module.exports=Animals