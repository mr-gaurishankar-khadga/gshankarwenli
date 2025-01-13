import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);


  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/images');
      setUploadedImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 6) {
      alert('You can only upload up to 6 images');
      return;
    }
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('images', file);
    });

    try {
      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchImages(); 
      setSelectedFiles([]); 
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  

  return (
    <div className="upload-container">
      <input
        type="file"
        id="file-input"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-input" className="file-label">
        Select Slide Image
      </label>

      <div className="preview-container">
        {Array.from(selectedFiles).map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="preview-image"
          />
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
        className={`upload-button ${selectedFiles.length === 0 ? 'disabled' : ''}`}
      >
        {selectedFiles.length === 0 
          ? 'Select 5 to 6 Images'
          : `Upload ${selectedFiles.length} ${selectedFiles.length > 1 ? 'Images' : 'Image'}`}
      </button>

      <div className="gallery">
        {uploadedImages.map((slide, index) => (
          slide.images.map((image, idx) => (
            <img
              key={idx}
              src={`http://localhost:8000${image}`}
              alt={`Slide ${index}-${idx}`}
              className="gallery-image"
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
