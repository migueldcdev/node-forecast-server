const express = require ('express')
const fs = require('fs')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const endForecastTime = require('./modules/time')

const params = "waveHeight,wavePeriod,waveDirection,windDirection,windSpeed,swellHeight,swellPeriod,swellDirection,waterTemperature"

//lat 43.5620 lng -7.1854

//makes an api call returning the data in JSON format
const getData = async(data) => {       

    const lat = data.ltd
    const lng = data.lng   

    const result = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&end=${endForecastTime.unixTimestamp}`, { 
        headers: { 'Authorization': process.env.API_KEY }
            }).then((response) => response.json()).then((jsonData) => {
                return jsonData
            });    

    return result    
}

//gets the url params and calls the getData function, then saves the data in a JSON(mongodb?)
app.get('/data/:ltd/:lng/:param/', async (req,res) => {    
   
    data = {
    'ltd': req.params.ltd,    
    'lng': req.params.lng,
    'param': req.params.param
   }

   response = await getData(data)

   stringfiedResponse = JSON.stringify(response)

   fs.writeFile('./response.json',stringfiedResponse,'utf8', (err) => {
    if(err) {
        console.error("An error occured while writing JSON object to local file")
        return console.log(err)
    } 
    res.send("JSON file saved")
   })   

})

//serves the data
app.get('/data', (req,res) => {
    fs.readFile('./response.json', (err,json) => {
        if(err) {
            return console.log("An error occured while reading file")
        }

        data = JSON.parse(json)

        res.json(data)
    })
})


app.listen(3000, () => {
    console.log('Api running on http://localhost:3000')
})