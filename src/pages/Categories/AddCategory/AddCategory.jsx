import Joi from 'joi';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import categoryServices from '../../../services/categoryServices';
import './AddCategory.scss'

export default function AddCategory() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: ""
  })

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  function getNewCategoryData(e) {
    let newCategoryData = { ...newCategory }
    newCategoryData[e.target.name] = e.target.value
    setNewCategory(newCategoryData)
  }

  function addCategoryValidation(newCategory) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required()
    });
    return schema.validate(newCategory, { abortEarly: false });
  }

  async function addCategoryHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addCategoryValidation(newCategory);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        let categoryData = {
          name: newCategory.name
        }
        const { data } = await categoryServices.addCategory(categoryData)
        if (data.success && data.message === "categoryAdded") {
          setLoading(false);
          let categoryID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await categoryServices.uploadImageCategory(categoryID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/categories");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-category-page">
          <div className="add-category-card">
            <h3>Add Category</h3>
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
            }
            {
              errorList.map((err, index) => {
                return (
                  <div key={index} className="alert alert-danger myalert">
                    {err.message}
                  </div>
                )
              })
            }
            <div className="main-image-label">
              {uploadImage && (
                <img
                  src={uploadImage ? URL.createObjectURL(uploadImage) : null}
                  alt="imag-viewer"
                  className="uploaded-img"
                  onClick={() => {
                    window.open(
                      uploadImage ? URL.createObjectURL(uploadImage) : null
                    );
                  }}
                />
              )}
              <input
                className="main-input-image"
                type="file"
                name="upload-img"
                ref={ref}
                onChange={(e) => {
                  setUploadImage(e.target.files[0]);
                }}
              />
              <label
                className="main-label-image"
                onClick={imageUploader}
                htmlFor="upload-img"
              >
                Add Image
              </label>
            </div>

            <form onSubmit={addCategoryHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCategoryData}
                className='form-control add-category-input'
                type="text"
                name="name"
                id="name"
              />
              <button className='add-category-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
