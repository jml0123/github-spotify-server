require("dotenv").config();
require("isomorphic-unfetch");
const {REDIRECT_URI}= require("../config")
const scopes = [
    "user-library-read",
    "user-library-read",
    "user-read-currently-playing"
];

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;


const permissions = "&scope=" + encodeURIComponent(scopes.join(" "))

async function getAuthToken() {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const refreshToken = process.env.REFRESH_TOKEN;
        const accessToken = await (
                await fetch(
                    `https://accounts.spotify.com/api/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`,
                    {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded ",
                    },
                    method: "POST",
                    }
                )).json()
        return accessToken
}

function visitPagePrompt() {
    console.log("Please visit");
    console.log(
    "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        clientId +
        (scopes ? permissions : "") +
        "&redirect_uri=" +
        encodeURIComponent(REDIRECT_URI)
    );
}

async function getRefreshToken(){

    const { code } = req.query;

    if (!code) {
      return res.status(401).send("Not Authorized");
    }
  
    const data = await (
      await fetch(
        `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${encodeURIComponent(
          code
        )}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&client_id=${clientId}&client_secret=${clientSecret}`,
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded ",
          },
          method: "POST",
        }
      )
    ).text();
    console.log(data);
  
    return res.send("Authorized, please check console");

}

module.exports = {getAuthToken, visitPagePrompt, getRefreshToken};