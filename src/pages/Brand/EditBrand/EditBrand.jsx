import Joi from 'joi'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandServices from '../../../services/brandServices'
import './EditBrand.scss'

export default function EditBrand() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [brandId, setBrandId] = useState('')

  const [oldBrand, setOldBrand] = useState({
    name: "",
    email: "",
    phone: []
  })

  const [newBrand, setNewBrand] = useState({
    name: "",
    email: "",
    phone: ""
  })

  function checkUpdatedFields(newData, oldData) {
    let finalEditiedData = {}

    Object.keys(oldData).forEach((oldDataKey) => {
      if (oldData[oldDataKey] !== newData[oldDataKey]) {
        finalEditiedData = { ...finalEditiedData, [oldDataKey]: newData[oldDataKey] }
      }
    })
    return finalEditiedData
  }

  async function getBrandByIdHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
        })
        setNewBrand({
          name: data?.Data?.name,
          email: data?.Data?.email,
          phone: data?.Data?.phone,
        })
        setUploadImage(data?.Data?.image)
        setBrandId(data.Data._id)

      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewBrandData(e) {
    let newBrandData = { ...newBrand }
    newBrandData[e.target.name] = e.target.value
    setNewBrand(newBrandData)
  }

  function editBrandValidation(newBrand) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.any()
    });
    return schema.validate(newBrand, { abortEarly: false });
  }

  async function editBrandHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editBrandValidation(newBrand);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newBrand, oldBrand)).forEach((key) => {
        if (key === "phone") {
          editedData = {
            ...editedData,
            phone: [newBrand["phone"]]
          }
        } else {
          editedData = {
            ...editedData,
            [key]: newBrand[key]
          }
        }
      })

      try {
        const { data } = await brandServices.updateProfileBrand(editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object"
              && await brandServices.uploadImageBrand(brandId, formData)

            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate(`/brand`);
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response);
      }
    }
  };

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  useEffect(() => {
    getBrandByIdHandler()
  }, [])

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-brand-page">
          <div className="edit-brand-card">
            <h3>Edit Brand</h3>
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
                  src={typeof uploadImage === "object" ?
                    URL.createObjectURL(uploadImage) :
                    (`https://graduation-project-23.s3.amazonaws.com/${uploadImage}`)}
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
            <form onSubmit={editBrandHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
                value={newBrand.name}
              />
              <label htmlFor="name">Email</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="email"
                name="email"
                id="email"
                value={newBrand.email}
              />
              <label htmlFor="name">Phone</label>
              <input
                onChange={getNewBrandData}
                className='form-control add-brand-input'
                type="number"
                name="phone"
                id="phone"
                value={newBrand.phone}
              />
              <button className='add-brand-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Brand"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
