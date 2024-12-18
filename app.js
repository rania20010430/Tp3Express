const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

const persons = require('./persons.json')
const cities = require('./cities.json')
app.use(express.json())

app.get('/persons/name/:name', (req, res)=>{
    const name = req.params.name
    const resultname= persons.filter((person)=> person.name === name);

    if(resultname.length == 0){
        res.status(404).send({message: 'not found'})
    } else{
        res.status(200).send(resultname)
    }
})

app.post('/persons', (req, res)=>{
    const newperson ={
        id: persons.length +1,
        name: req.body.name,
        cities: req.body.cities || [], 
    }
    persons.push(newperson);

    res.status(200).send(newperson);
})

app.put('/persons/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const nperson = req.body.name;
   // const person = persons.find((p) => p.i)
   const person=persons.findIndex(p=>p.id==id)
   persons[person]={iq}

})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});