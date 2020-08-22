require('dotenv').config();

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const {NODE_ENV} = require("./config")
const {getAuthToken, getRefreshToken, visitPagePrompt} = require('./apis/spotify');
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

visitPagePrompt();

app.get("/", async (req, res) => {
    getRefreshToken()
});

app.get("/currently-playing", async(req, res)=> {
    const trackData = {
        artist: "",
        track: "",
        url: ""
    };
    const {access_token} = await getAuthToken()
    console.log({access_token})
    try {
        const currentlyPlaying = await (
        await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      )
      const data = await currentlyPlaying.json()
      trackData.artist = data.item.album.artists[0].name
      trackData.track = data.item.name
      trackData.url = data.item.href
      res.status(200)
      .json(trackData)
    } 
      catch(err){ 
        console.log(err)
      }    
})

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === "Production") {
        response = {error: {message: "Server error."}}
    }
    else {
        console.error(error);
        response = { message : error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app