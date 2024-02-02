
const {getAuthToken} = require('../apis/spotify');

const getCurrentlyPlaying = async (req, res) => {
    try {
        const { access_token } = await getAuthToken();
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

        const currentlyPlaying = await fetch("https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
            });

        if (!currentlyPlaying.ok) {
            console.error(`Problem in fetching currently playing data. Status: ${currentlyPlaying.status}. Maybe it's not playing anything.`);
            res.status(200).json(trackData);
            return;
        }
        let data;
        try {
            data = await currentlyPlaying.json();
        } catch (jsonError) {
            console.error(`Problem in fetching currently playing data. Status: ${currentlyPlaying.status}. Maybe it's not playing anything.`);
            res.status(200).json(trackData);
            return;
        }

        if (!data || !data.item) {
            trackData.playing = false;
        } else if (data.currently_playing_type === "track") {
            trackData.playing = true;
            trackData.artist = data.item.artists.map(a => a.name).join(", ");
            trackData.track = data.item.name;
            trackData.album = data.item.album.name;
            trackData.releaseDate = data.item.album.release_date;
            trackData.imageUrl = data.item.album.images[0].url;
            trackData.url = data.item.external_urls.spotify;
        } else if (data.currently_playing_type === "episode") {
            trackData.playing = true;
            trackData.artist = data.item.show.name;
            trackData.track = data.item.name;
            trackData.url = data.item.show.external_urls.spotify;
            trackData.releaseDate = data.item.release_date;
            trackData.imageUrl = data.item.show.images[0].url;
        }

        trackData.type = data.currently_playing_type;

        res.status(200).json(trackData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {getCurrentlyPlaying};