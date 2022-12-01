const express=require('express') //bring this in so we can make our router
const Animals=require('../models/animal')

//create router variable to attach routes
const router=express.Router() // router will have all the routes attached to it

// actual routes below


router.get('/seed', (req, res)=>{
   
})

router.get('/', (req, res)=>{
    // get all aniamsl from mongo and send them back
    Animals.find({})
    .then((animals)=>{
        //res.json(animals)
        res.render('animals/index.ejs', {animals})
    })
})

router.get('/new', (req, res)=>{
    res.render('animals/new.ejs')
})

router.post('/', (req, res)=>{
    req.body.extinct= req.body.extinct === 'on' ? true : false
    Animals.create(req.body, (err, createdAnimal)=>{
       
        res.redirect('/animals')
    })
})

router.get('/:id/edit', (req, res)=>{
    const id=req.params.id
    Animals.findById(id, (err, foundAnimal)=>{
        //res.json(foundAnimal)
        res.render('animals/edit.ejs', { animal:foundAnimal }) //name foundAnimal to animal
    })
})

router.put('/:id', (req, res)=>{
// id of the animal I want to update, req.body=whatever data in the form when I hit submit,in the call back function, update to the newest version
    req.body.extinct= req.body.extinct === 'on' ? true : false  
    Animals.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedAnimal)=>{
        res.redirect(`/animals/${req.params.id}`)
    })
})

router.get('/:id', (req, res)=>{
    // go and get animal from the database
   Animals.findById(req.params.id)
   //find the animal and send it to the edit.ejs to prepopulate the form
   .then((animal)=>{
    res.render('animals/show.ejs', {animal})
    })
})

router.delete('/:id', (req, res)=>{
    // Animals.findByIdAndDelete(req.params.id, (err, deletedAnimal)=>{
    //     res.redirect('/animals')
    // })
    Animals.findByIdAndDelete(req.params.id)
    .then((deletedAnimal)=>{
        res.redirect('/animals')
    })
})

// export this router to use in other files
module.exports=router