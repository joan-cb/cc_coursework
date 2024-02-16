const express = require("express")
const router = express.Router()
const Film = require('../models/Film')
const verifyToken = require("../verifyToken")
const { filmValidation } = require("../validations/validation")

router.get("/", verifyToken, async(req,res)=>{
// router.get("/", async(req,res)=>{    
    try{
    const films = await Film.find();
    res.send(films);
    }catch(err){
        res.status(400).send({message:err});
    }
})


router.get("/film_name", async(req,res)=>{
        const film_name = req.body.film_name
        console.log(film_name)
        try{
            const returnedFilm = await Film.findOne({film_name:film_name})
            res.send(returnedFilm)
        }catch{
            res.send("some error occurred")
        }

    })


router.get("/film_year", async(req,res)=>{
        const film_year = req.body.film_year
        console.log(film_year)
        try{
            const returnedFilm = await Film.find({film_year:film_year})
            res.send(returnedFilm)
        }catch{
            res.send("some error occurred")
        }

    })

router.post('/add', async(req,res)=>{
    const {error} = filmValidation(req.body)
    if(error){
    return res.send({message:error["details"][0]["message"]})
    }
    const film = new Film({
        film_name:req.body.film_name,
        film_type:req.body.film_type,
        film_year:req.body.film_year,
        film_link:req.body.film_link,
        })   
        try{
            const savedFilm = await film.save()
            res.send(savedFilm)
        }
        catch(err){
            res.status(400).send({message:error})
        }
    
    
})





module.exports = router
