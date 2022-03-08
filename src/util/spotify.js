
let accessToken = false;
// REMOVE
const clientID = '';
const redirectURI = 'http://localhost:3000/';

const Spotify = {

    getAccessToken() {   
        if (accessToken) {
            return accessToken
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // this clears the parameters
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        }
        else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        return fetch(
            `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, 
            { headers: {
                Authorization: `Bearer ${accessToken}`
            }}
        ).then(response => {
            return response.json;
        }).then(jsonResponse => {
            if (!jsonResponse.tracks){   
                return [];
            }
            else {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            }
        })
    },

    savePlaylist(playlistName, trackListURIs) {
        // checks if there is value in both arguments
        if(!playlistName || !trackListURIs) {
            return;
        }
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId = undefined;

        return fetch(
            `https://api.spotify.com/v1/me`,
            {headers: headers}
        ).then(response => response.json)
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify( {playlistName: playlistName} ),
                }
            ).then(response => response.json)
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(
                    `/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uris: trackListURIs})
                    }
                )
            })
        })
    }   

}

export default Spotify;