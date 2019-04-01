import React, { Component } from 'react';

class ImageUploader extends Component {

    render() {
        let images = this.props.images.map((image, i) => {
            console.log("mapping:", image.URL);
            return <img key={i} src={image.URL} alt={i} />;
        });

        return (
            <div className="display-images">
                {images}
            </div>
        );
    }
}

export default ImageUploader;
