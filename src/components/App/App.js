import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

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
            playlistName: 'New Playlist',
            playlistTracks: [],
        }
    }

    // Add Track to user's playlist
    addTrack(track) {
        if (this.state.playlistTracks.every(playlistTrack => playlistTrack.id !== track.id)) {
            let searchResults = this.state.searchResults.filter((searchTrack) => {
                return searchTrack.id != track.id;
            });

            let newPlaylistTracks = this.state.playlistTracks.concat(track);
            this.setState({ playlistTracks: newPlaylistTracks, searchResults });
        }
    }

    // Remove selected track from user's playlist
    removeTrack(track) {

        let newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);            
        this.setState({playlistTracks: newPlaylistTracks});
    }

    // Update user's playlist name
    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    // Save the user's playlist
    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({
          searchResults: []
        });
        this.updatePlaylistName('New Playlist');
        console.log('Save Playlist done. Array Info:')
        console.info(trackURIs);

    }

    search(term) {
        Spotify.search(term).then(searchResults => {
        		let filteredResults = this.filterSearchResults(searchResults);
            this.setState({searchResults: filteredResults});
        });  

        console.log('Search done. Line 108 App.js');
    }
    
    filterSearchResults(searchResults) {
      // Filter the user's search results
      return searchResults.filter((searchTrack) => {
            // Check playlistTracks for any matching id
            return !this.state.playlistTracks.some((playlistTrack) => {
                return searchTrack.id === playlistTrack.id;
            });
        });
	}

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search} />
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        <Playlist 
                            playlistName={this.state.playlistName} 
                            playlistTracks={this.state.playlistTracks}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;