import React, { Component } from 'react';
import ImageUploader from './ImageUploader';
import DisplayImages from './DisplayImages';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      greeting: '',
      images: [],
      imagesLoaded: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
      .then(response => response.json())
      .then(state => this.setState(state));
  }

  componentDidMount() {
    axios.get('/getUrls')
      .then(res => {
        const imagesArray = res.data;
        this.setState( {
          images: imagesArray,
          imagesLoaded: true
        });
      });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}

          <p>Amazon S3 Uploaded Images</p>
          {!this.state.imagesLoaded && <p>Loading Images...</p>}
          {this.state.imagesLoaded && <DisplayImages images={this.state.images} />}
          <ImageUploader />

          {/* <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
      </div>
    );
  }
}

export default App;
