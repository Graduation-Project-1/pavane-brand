import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandServices from '../../../services/brandServices';
import categoryServices from '../../../services/categoryServices';
import itemServices from '../../../services/itemServices';
import toastPopup from '../../../helpers/toastPopup';
import ImagesUpload from '../../../components/ImagesUpload/ImagesUpload';
import './AddItem.scss'

export default function AddItem() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadCover, setUploadCover] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);
  const [gender, setGender] = useState("male");
  const [isAdult, setIsAdult] = useState(false);
  const [redColor, setRedColor] = useState(false);
  const [greenColor, setGreenColor] = useState(false);
  const [blueColor, setBlueColor] = useState(false);
  const [blackColor, setBlackColor] = useState(false);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [brandId, setBrandId] = useState('')

  let sizesArr = ["XS", "S", "M", "L", "XL", "XXL"]

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    description: "",
    discountRate: ""
  })

  function getNewItemData(e) {
    let newItemData = { ...newItem }
    newItemData[e.target.name] = e.target.value
    setNewItem(newItemData)
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(1, 5000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategories(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
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
      categories.filter(category => category?._id === selectedCategory).map((category) => {
        finalBrandCategories.push(category?._id)
      })
    })

    return finalBrandCategories
  }

  let categoriesOptions = categories?.map((category) => {
    return ({
      name: category?.name,
      id: category?._id
    })
  })

  function toggleSelectedSizesHandler(size) {
    if (selectedSizes.includes(size)) {
      let oldSelectedSizes = selectedSizes
      let newSelectedSizes = oldSelectedSizes.filter((singleSize) => { return singleSize !== size?.name })
      setSelectedSizes(newSelectedSizes)
    } else {
      setSelectedSizes((prev) => { return [...prev, size?.name] })
    }
  }

  function getFinalSizes() {
    let finalSizes = []
    selectedSizes.forEach((selectedSize) => {
      sizesArr.filter(size => size === selectedSize).map((size) => {
        finalSizes.push(size)
      })
    })

    return finalSizes
  }

  let sizesOptions = sizesArr?.map((size) => {
    return ({
      name: size
    })
  })

  async function getBrandHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrand();
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setBrandId(data?.Data?._id)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function addItemHandler(e) {
    e.preventDefault();
    setLoading(true);

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
        name: newItem?.name,
        price: newItem?.price,
        description: newItem?.description,
        gender: gender,
        isAdult: isAdult,
        discountRate: newItem?.discountRate,
        sizes: getFinalSizes(),
        colors: colors,
        brandId: brandId,
        categoryList: getFinalCategories()
      }

      const { data } = await itemServices.addItem(itemData)
      if (data?.success && data?.message === "ItemAdded") {
        setLoading(false);
        let itemID = data?.Data?._id
        var formData = new FormData();
        formData.append("images", uploadCover);
        setLoading(true)
        try {
          const { data } = await itemServices.uploadItemCover(itemID, formData)
          setLoading(true)
          if (data?.success && data?.status === 200) {
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          setErrorMessage(error);
        }
        var imagesFormData = new FormData();
        uploadImages.forEach((image) => {
          imagesFormData.append('images', image.file);
        });
        setLoading(true)
        try {
          const { data } = await itemServices.uploadItemImages(itemID, imagesFormData)
          setLoading(true)
          if (data?.success && data?.status === 200) {
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          setErrorMessage(error);
        }
        navigate("/items");
        toastPopup.success("Item added successfully")
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response);
    }
  };

  const ref = useRef();
  const coverUploader = (e) => {
    ref.current.click();
  };

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandHandler()
  }, [])

  return <>
    <div>
      <button className='back-edit' onClick={() => { navigate(`/items`) }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
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
            <div className="main-cover-label">
              {uploadCover && (
                <img
                  src={uploadCover ? URL.createObjectURL(uploadCover) : null}
                  alt="imag-viewer"
                  className="uploaded-img"
                  onClick={() => {
                    window.open(
                      uploadCover ? URL.createObjectURL(uploadCover) : null
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
                  setUploadCover(e.target.files[0]);
                }}
              />
              <label
                className="main-label-image"
                onClick={coverUploader}
                htmlFor="upload-img"
              >
                Add Cover Image
              </label>
            </div>

            <ImagesUpload
              label='item images'
              type="upload"
              uploadedImagesList={uploadImages}
              setUploadedImagesList={setUploadImages}
            />

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
              <label htmlFor="name">Discount</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="number"
                name="discountRate"
                id="discount"
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
              <Multiselect
                displayValue="name"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedSizesHandler(selectedItem)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedSizesHandler(selectedItem)
                }}
                options={sizesOptions}
                showCheckbox
              />

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
