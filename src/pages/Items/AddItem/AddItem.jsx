import Joi from 'joi';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandServices from '../../../services/brandServices';
import categoryServices from '../../../services/categoryServices';
import itemServices from '../../../services/itemServices';
import './AddItem.scss'

export default function AddItem() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadImages, setUploadImages] = useState({});
  const [gender, setGender] = useState("male");
  const [isAdult, setIsAdult] = useState(false);
  const [xsSize, setXsSize] = useState(false);
  const [sSize, setSSize] = useState(false);
  const [mSize, setMSize] = useState(false);
  const [lSize, setLSize] = useState(false);
  const [xlSize, setXLSize] = useState(false);
  const [xxlSize, setXXLSize] = useState(false);
  const [redColor, setRedColor] = useState(false);
  const [greenColor, setGreenColor] = useState(false);
  const [blueColor, setBlueColor] = useState(false);
  const [blackColor, setBlackColor] = useState(false);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [brandId, setBrandId] = useState('')

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    description: ""
  })

  const ref = useRef();
  const refs = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  const imagesUploader = (e) => {
    refs.current.click();
  };

  function getNewItemData(e) {
    let newItemData = { ...newItem }
    newItemData[e.target.name] = e.target.value
    setNewItem(newItemData)
  }

  async function getBrandByIdHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrandId(data.Data._id)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(1, 5000);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCategories(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function toggleSelectedCategoriesHandler(categoryId) {
    if (selectedCategories.includes(categoryId)) {
      let oldSelectedCategories = selectedCategories
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setSelectedCategories(newSelectedCategories)
    } else {
      setSelectedCategories((prev) => { return [...prev, categoryId] })
    }
  }

  function getFinalCategories() {
    let finalBrandCategories = []
    selectedCategories.forEach((selectedCategory) => {
      categories.filter(category => category._id === selectedCategory).map((category) => {
        finalBrandCategories.push(category._id)
      })
    })

    return finalBrandCategories
  }

  function addItemValidation(newItem) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required(),
      price: Joi.number().positive().required(),
      description: Joi.string().pattern(/^[a-zA-Z &_\-'"\\|,.\/]*$/).min(3).max(50).required()
    });
    return schema.validate(newItem, { abortEarly: false });
  }

  async function addItemHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addItemValidation(newItem);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let sizes = []
      if (xsSize) {
        sizes.push("XS")
      }
      if (sSize) {
        sizes.push("S")
      }
      if (mSize) {
        sizes.push("M")
      }
      if (lSize) {
        sizes.push("L")
      }
      if (xlSize) {
        sizes.push("XL")
      }
      if (xxlSize) {
        sizes.push("XXL")
      }

      let colors = []
      if (redColor) {
        colors.push("red")
      }
      if (greenColor) {
        colors.push("green")
      }
      if (blueColor) {
        colors.push("blue")
      }
      if (blackColor) {
        colors.push("black")
      }

      try {
        let itemData = {
          name: newItem.name,
          price: newItem.price,
          description: newItem.description,
          gender: gender,
          isAdult: isAdult,
          sizes: sizes,
          colors: colors,
          brandId: brandId,
          categoryList: getFinalCategories()
        }

        const { data } = await itemServices.addItem(itemData)
        if (data.success && data.message === "ItemAdded") {
          setLoading(false);
          let itemID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await itemServices.uploadItemCover(itemID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }

          // var imagesFormData = new FormData();
          // uploadImages.forEach((file, i) => {
          //   console.log("ok", uploadImages);
          //   imagesFormData.append(`images${i}`, file);
          // });

          // try {
          //   const { data } = await itemServices.uploadImagesItem(itemID, imagesFormData)
          //   console.log(data);
          //   setLoading(true)
          //   if (data.success && data.status === 200) {
          //     setLoading(false);
          //   }
          // } catch (error) {
          //   setLoading(false);
          //   setErrorMessage(error);
          // }
          navigate("/items");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response);
      }
    }
  };

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandByIdHandler()
  }, [])

  let categoriesOptions = categories.map((category) => {
    return ({
      name: category.name,
      id: category._id
    })
  })

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-item-page">
          <div className="add-item-card">
            <h3>Add Item</h3>
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
                Add Cover Image
              </label>
            </div>
            {/* <div className="main-image-label">
              {uploadImages.length > 0 && (
                <img
                  src={`https://html.sammy-codes.com/images/background.jpg`}
                  alt="imag-viewer"
                  className="uploaded-img"
                // onClick={() => {
                //   window.open(
                //     uploadImage ? URL.createObjectURL(uploadImage) : null
                //   );
                // }}
                />
              )}
              <input
                className="main-input-image"
                type="file"
                name="upload-img"
                ref={refs}
                onChange={(e) => {
                  setUploadImages(e.target.files);
                  console.log(e.target.files);
                }}
                multiple
              />
              <label
                className="main-label-image"
                onClick={imagesUploader}
                htmlFor="upload-img"
              >
                Add Cover Image
              </label>
            </div> */}
            <form onSubmit={addItemHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="text"
                name="name"
                id="name"
              />
              <label htmlFor="description">Description</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="text"
                name="description"
                id="description"
              />
              <label htmlFor="price">Price</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="number"
                name="price"
                id="price"
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-item-input">
                <input
                  onChange={(e) => { setGender(e.target.value) }}
                  value='male'
                  type="radio"
                  name="gender"
                  id="male"
                  defaultChecked
                />
                <input
                  onChange={(e) => { setGender(e.target.value) }}
                  value='female'
                  type="radio"
                  name="gender"
                  id="female"
                />
                <label htmlFor="male" className="option male">
                  <div className="dot"></div>
                  <span>Male</span>
                </label>
                <label htmlFor="female" className="option female">
                  <div className="dot"></div>
                  <span>Female</span>
                </label>
              </div>
              <div className="check add-item-input">
                <input type="checkbox" id="isAdult" onChange={(e) => { setIsAdult(e.target.checked) }} />
                <label htmlFor='isAdult'>For Adults</label>
              </div>
              <label htmlFor="">Avaliable Sizes</label>
              <div className="check">
                <input value='xs' type="checkbox" id="xs" onChange={(e) => { setXsSize(e.target.checked) }} />
                <label htmlFor='xs'>XS</label>
              </div>
              <div className="check">
                <input value='s' type="checkbox" id="s" onChange={(e) => { setSSize(e.target.checked) }} />
                <label htmlFor='s'>S</label>
              </div>
              <div className="check">
                <input value='m' type="checkbox" id="m" onChange={(e) => { setMSize(e.target.checked) }} />
                <label htmlFor='m'>M</label>
              </div>
              <div className="check">
                <input value='l' type="checkbox" id="l" onChange={(e) => { setLSize(e.target.checked) }} />
                <label htmlFor='l'>L</label>
              </div>
              <div className="check">
                <input value='xl' type="checkbox" id="xl" onChange={(e) => { setXLSize(e.target.checked) }} />
                <label htmlFor='xl'>XL</label>
              </div>
              <div className="check add-item-input">
                <input value='xxl' type="checkbox" id="xxl" onChange={(e) => { setXXLSize(e.target.checked) }} />
                <label htmlFor='xxl'>XXL</label>
              </div>

              <label htmlFor="">Avaliable Colors</label>
              <div className="check">
                <input value='red' type="checkbox" id="red" onChange={(e) => { setRedColor(e.target.checked) }} />
                <label htmlFor='red'><div className='red-color'></div></label>
              </div>
              <div className="check">
                <input value='green' type="checkbox" id="green" onChange={(e) => { setGreenColor(e.target.checked) }} />
                <label htmlFor='green'><div className='green-color'></div></label>
              </div>
              <div className="check">
                <input value='blue' type="checkbox" id="blue" onChange={(e) => { setBlueColor(e.target.checked) }} />
                <label htmlFor='blue'><div className='blue-color'></div></label>
              </div>
              <div className="check add-item-input">
                <input value='black' type="checkbox" id="black" onChange={(e) => { setBlackColor(e.target.checked) }} />
                <label htmlFor='black'><div className='black-color'></div></label>
              </div>

              <p className='select-categories'>Avaliable Categories</p>
              <Multiselect
                displayValue="name"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem.id)
                }}
                options={categoriesOptions}
                showCheckbox
              />
              <button className='add-item-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
