require('dotenv').config();

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const {NODE_ENV} = require("./config")
const {getRefreshToken, visitPagePrompt} = require('./apis/spotify');
const { getCurrentlyPlaying } = require('./services/playing.service');
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
  return await getCurrentlyPlaying(req, res);
})

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === "Production") {
        response = {error: {message: "Something went Wrong."}}
    }
    else {
        console.error(error);
        response = { message : error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;
