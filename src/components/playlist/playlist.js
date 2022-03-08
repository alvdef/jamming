import React from "react";
import './playlist.css';
import { TrackList } from "../trackList/trackList";

export class Playlist extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value)
    }

    render() {
        return (
            <div className="Playlist">
            <input value={'New Playlist'} onChange={this.handleNameChange} />
            <TrackList 
                tracks={this.props.playlistTracks} 
                onRemove={this.props.onRemove}
            />
            <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}