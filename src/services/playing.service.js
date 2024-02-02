
const {getAuthToken} = require('../apis/spotify');

const getCurrentlyPlaying = async (req, res) => {
    const {access_token} = await getAuthToken()

    const trackData = {
        playing: null,
        artist: null,
        track: null,
        album: null,
        releaseDate: null,
        url: null,
        imageUrl: null,
        type: null,
    };
    try {
        const currentlyPlaying = await (
        await fetch("https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      )
      const data = await currentlyPlaying.json()
      if (!data.item) {
        trackData.playing = false;
        res.status(200).json(trackData);
      }
      else if(data.currently_playing_type === "track") {
        trackData.playing = true;
        trackData.artist = data.item.artists.map(a => a.name).join(", ").slice(0, -2);
        trackData.track = data.item.name;
        trackData.album = data.item.album.name;
        trackData.releaseDate = data.item.album.release_date;
        trackData.imageUrl = data.item.album.images[0].url;
        trackData.url = data.item.external_urls.spotify;
      }
      else if (data.currently_playing_type === "episode") {
        trackData.playing = true;
        trackData.artist = data.item.show.name;
        trackData.track = data.item.name;
        trackData.url = data.item.show.external_urls.spotify;
        trackData.releaseDate = data.item.release_date;
        trackData.imageUrl = data.item.show.images[0].url;
      }
      trackData.type = data.currently_playing_type;

      res.status(200)
      .json(trackData)
    } 
      catch(err){ 
        console.log(err)
      }    
}

module.exports = {getCurrentlyPlaying};