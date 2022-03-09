import React from 'react';
import './app.css';

import { SearchResults } from '../searchResults/searchResults';
import { SearchBar } from '../searchBar/searchBar';
import { Playlist } from '../playlist/playlist';

import Spotify from '../../util/spotify';


class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = { 
      searchResults: [],

      playlistName: 'playlist1',

      playlistTracks: []
    };
  }

  search(searchedTerm) {
    console.log(searchedTerm);
    Spotify.search(searchedTerm).then(searchResults => {
       this.setState( {searchResults: searchResults} )
    })
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;

    if (!tracks.id.includes(track.id)) {
      tracks = tracks.push(track);
      this.setState( {playlistTracks: tracks} );
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;

    if (tracks.id.includes(track.id)) {
      tracks = tracks.filter(track);
      this.setState( {playlistTracks: tracks} );
    }
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name} );
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map( (track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [{
          name: 'name1', 
          artist: 'artist1', 
          album: 'album1', 
          id: 1,
        }]
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;