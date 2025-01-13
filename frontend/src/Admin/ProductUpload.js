import React, { useState } from 'react';
import axios from 'axios';
import './ProductUpload.css';

const CategorySelect = ({ value, onChange }) => (
  <div className="styled-animated-input">
    <label>Categories</label>
    <select name="categories" value={value} onChange={onChange}>
      <option value="">Select Category</option>
      <option value="girls">Girls</option>
      <option value="boys">Boys</option>
    </select>
  </div>
);



const CheckboxGroup = ({ name, options, selectedValues, onChange }) => (
  <div className="styled-animated-checkbox" style={{display:'flex',backgroundColor:''}}>
    <label>{name}</label>
    {options.map(option => (
      <label key={option.value} className="styled-checkbox-label">
        <input
          type="checkbox"
          name={name}
          value={option.value}
          checked={selectedValues.includes(option.value)}
          onChange={onChange}
        />
        {option.label}
      </label>
    ))}
  </div>
);



const FileInput = ({ name, image, onChange }) => (
  <div className="styled-file-input-container" style={{display:'',backgroundColor:''}}>
    <button
      className="styled-custom-file-button"
      onClick={() => document.getElementById(name).click()}
      style={{display:'flex',backgroundColor:'red'}}
    >
      {name}
    </button>
    <input
      type="file"
      name={name}
      id={name}
      accept="image/*"
      onChange={onChange}
      style={{ display: 'none' }}
    />
    {image && <img src={image} alt={name} className="styled-image-preview" />}
  </div>
);


const ProductUpload = () => {
  const [formData, setFormData] = useState({
    front: null,
    back: null,
    f3: null,
    f4: null,
    categories: '',
    description: '',
    minitext1: '',
    minitext2: '',
    minitext3: '',
    minitext4: '',
    minitext5: '',
    minitext6: '',

    title: '',
    price: '',
    sizes: [],
    colors: [],
    quantity: '',
    discount: '',
  });

  const [selectedImages, setSelectedImages] = useState({
    front: null,
    back: null,
    f3: null,
    f4: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevState) => {
        const newValues = checked
          ? [...prevState[name], value]
          : prevState[name].filter((item) => item !== value);

        return {
          ...prevState,
          [name]: newValues,
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setSelectedImages((prevState) => ({
        ...prevState,
        [name]: URL.createObjectURL(file),
      }));
      setFormData({
        ...formData,
        [name]: file,
      });
    }
  };

  const isFormComplete = () => {
    return (
      formData.title &&
      formData.description &&
      formData.minitext1 &&
      formData.minitext2 &&
      formData.minitext3 &&
      formData.minitext4 &&
      formData.minitext5 &&
      formData.minitext6 &&

      formData.price &&
      formData.categories &&
      formData.sizes.length > 0 &&
      formData.colors.length > 0 &&
      formData.quantity &&
      !isNaN(formData.discount) &&
      selectedImages.front &&
      selectedImages.back &&
      selectedImages.f3 &&
      selectedImages.f4
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormComplete()) {
      console.log('Please complete all fields and select all images before submitting.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(value => data.append(`${key}[]`, value));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/api/products', data);
      alert('Product uploaded successfully:', response.data);
      setFormData({
        front: null,
        back: null,
        f3: null,
        f4: null,
        categories: '',
        description: '',
        minitext1: '',
        minitext2: '',
        minitext3: '',
        minitext4: '',
        minitext5: '',
        minitext6: '',
        title: '',
        price: '',
        sizes: [],
        colors: [],
        quantity: '',
        discount: '',
      });
      setSelectedImages({
        front: null,
        back: null,
        f3: null,
        f4: null,
      });
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (
    <div className="styled-product-uploader styled-animated-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="styled-animated-input">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

















        <div className="styled-animated-input">
          <label>Detail Description </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="styled-animated-input">
          <label>Mini-Description 1: </label>
          <textarea
            name="minitext1"
            value={formData.minitext1}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        
        <div className="styled-animated-input">
          <label>Mini-Description 2:</label>
          <textarea
            name="minitext2"
            value={formData.minitext2}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        <div className="styled-animated-input">
          <label>Mini-Description 3:</label>
          <textarea
            name="minitext3"
            value={formData.minitext3}
            onChange={handleChange}
            required
          ></textarea>
        </div>



        <div className="styled-animated-input">
          <label>Mini-Description 4:</label>
          <textarea
            name="minitext4"
            value={formData.minitext4}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        <div className="styled-animated-input">
          <label>Mini-Description 5:</label>
          <textarea
            name="minitext5"
            value={formData.minitext5}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        <div className="styled-animated-input">
          <label>Mini-Description 6:</label>
          <textarea
            name="minitext6"
            value={formData.minitext6}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        
















        <div className="styled-animated-input">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <CategorySelect
          value={formData.categories}
          onChange={handleChange}
        />

        <CheckboxGroup
          name="sizes"
          options={[
            { value: 'S', label: 'S' },
            { value: 'M', label: 'M' },
            { value: 'L', label: 'L' },
            { value: 'XL', label: 'XL' },
          ]}
          selectedValues={formData.sizes}
          onChange={handleChange}
        />

        <CheckboxGroup
          name="colors"
          options={[
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
          ]}
          selectedValues={formData.colors}
          onChange={handleChange}
        />

        <div className="styled-animated-input">
          <label>Quantity</label>
          <select
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          >
            <option value="">Select Quantity</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="styled-animated-input">
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>
        <br /><br />

          <label> Select Four Images one By one </label><br /><br />
        <div className="bottomimages" style={{display:'flex'}}>
        <FileInput
          name="front"
          image={selectedImages.front}
          onChange={handleImageChange}
        />
        <FileInput
          name="back"
          image={selectedImages.back}
          onChange={handleImageChange}
        />

        <FileInput
          name="f3"
          image={selectedImages.f3}
          onChange={handleImageChange}
        />
        
        <FileInput
          name="f4"
          image={selectedImages.f4}
          onChange={handleImageChange}
        />
        </div>

        {isFormComplete() && (
          <button type="submit" className="styled-submit-button">Submit</button>
        )}
      </form>
    </div>
  );
};

export default ProductUpload;
