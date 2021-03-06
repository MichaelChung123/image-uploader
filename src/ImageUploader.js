import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class ImageUploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      file: null
    }
  }

  submitFile = (event) => {

    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    axios.post(`/test-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      window.alert("File Uploaded!");
      this.props.getUrls();
    }).catch(error => {
      console.log(error);
    });

  }

  handleFileUpload = (event) => {
    this.setState({ file: event.target.files });
  }


  render() {
    return (
      <div className="uploader">
        <form onSubmit={this.submitFile}>
          <input type="file" label='upload file' onChange={this.handleFileUpload} />
          <button type='submit'>Upload</button>
        </form>
      </div>
    );
  }
}

export default ImageUploader;
