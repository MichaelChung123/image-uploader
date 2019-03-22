import React, { Component } from 'react';
import './App.css';

class ImageUploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null
    }
  }

  fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
    // this.setState({
    //   selectedFile: event.target.files[0]
    // });
  }

  fileUploadHandler = () => {

  }

  render() {
    return (
      <div className="uploader">
        <input type="file" onChange={this.fileSelectedHandler} />
        <button onClick={this.fileUploadHandler}>Upload</button>
      </div>
    );
  }
}

export default ImageUploader;
