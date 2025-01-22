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


    //new 
    brand_name:'',
    hsn_code:'',
    sku:'',
    weight1:'',


    //second
      length : '',
      width2: '',
      height: '',
      unit: '',

      //third
      stock_quantity:'',
      low_stock_threshold:'',



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

      //new
      formData.brand_name &&
      formData.hsn_code &&
      formData.sku &&
      formData.weight1 &&
      //end



      //second
      formData.length &&
      formData.width2 &&
      formData.unit &&
      formData.height &&

      //third
      formData.stock_quantity &&
      formData.low_stock_threshold &&




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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/products`, data);

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

        brand_name:'',
        hsn_code:'',
        sku:'',
        weight1:'',


        //second
          length:'',
          width2:'',
          height:'',
          unit:'',


        //third
        stock_quantity:'',
        low_stock_threshold:'',
  


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



          {/* from here new filed */}

          <div className="styled-animated-input">
            <label>SKU</label>
            <textarea
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            ></textarea>
          </div>



          
          
          <div className="styled-animated-input">
            <label>WEIGHT1</label>
            <textarea
              name="weight1"
              value={formData.weight1}
              onChange={handleChange}
              required
            ></textarea>
          </div>




          
          <div className="styled-animated-input">
            <label>HSN-CODE</label>
            <textarea
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
              required
            ></textarea>
          </div>




          
          <div className="styled-animated-input">
            <label>BrandName </label>
            <textarea
              name="brand_name"
              value={formData.brand_name}
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



        
      
        <div className="styled-animated-input">
          <label>Dimension</label>
          <label>length</label>
          <input
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            required
          />
        </div>

        <div className="styled-animated-input">
          <label>width of product </label>
          <input
            type="number"
            name="width2"
            value={formData.width2}
            onChange={handleChange}
            required
          />
        </div>


        <div className="styled-animated-input">
          <label>height</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />

          <label>unit</label>
          <input
            type="number"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />














          <label>stock_quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />

          <label>low_stock_threshold</label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            required
          />





          <label>Package Dimensions Length</label>
          <input
            type="number"
            name="package_dimensionslength"
            value={formData.package_dimensionslength}
            onChange={handleChange}
            required
          />

          <label>Package Dimensions Height</label>
          <input
            type="number"
            name="package_dimensionsheight"
            value={formData.package_dimensionsheight}
            onChange={handleChange}
            required
          />

          <label>Package Dimensions Width</label>
          <input
            type="number"
            name="package_dimensionswidth"
            value={formData.package_dimensionswidth}
            onChange={handleChange}
            required
          />

          <label>Shipping Mode</label>
          <input
            type="text"
            name="shipping_mode"
            value={formData.shipping_mode}
            onChange={handleChange}
            required
          />

          <label>Origin Pincode</label>
          <input
            type="text"
            name="origin_pincode"
            value={formData.origin_pincode}
            onChange={handleChange}
            required
          />

          <label>Pickup Location</label>
          <input
            type="text"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            required
          />

          <label>GST Percentage</label>
          <input
            type="number"
            name="gst_percentage"
            value={formData.gst_percentage}
            onChange={handleChange}
            required
          />

          <label>Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
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
