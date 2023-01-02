import Joi from 'joi';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import categoryServices from '../../../../services/categoryServices';
import itemServices from '../../../../services/itemServices';
import './EditItem.scss'

export default function EditItem() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [xsSize, setXsSize] = useState(false);
  const [sSize, setSSize] = useState(false);
  const [mSize, setMSize] = useState(false);
  const [lSize, setLSize] = useState(false);
  const [xlSize, setXLSize] = useState(false);
  const [xxlSize, setXXLSize] = useState(false);

  const [oldItem, setOldItem] = useState({
    name: "",
    price: 0,
    description: "",
    gender: "",
    isAdult: true,
    sizes: [],
    categoryList: ""
  })

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    description: "",
    gender: "",
    isAdult: true,
    sizes: [],
    categoryList: ""
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

  async function getItemByIdHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getItemById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldItem({
          name: data?.Data?.name,
          price: data?.Data?.price,
          description: data?.Data?.description,
          gender: data?.Data?.gender,
          isAdult: data?.Data?.isAdult,
          sizes: data?.Data?.sizes,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id })
        })
        setNewItem({
          name: data?.Data?.name,
          price: data?.Data?.price,
          description: data?.Data?.description,
          gender: data?.Data?.gender,
          isAdult: data?.Data?.isAdult,
          sizes: data?.Data?.sizes,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id })
        })
        setUploadImage(data?.Data?.cover)
        setSelectedCategories(data?.Data?.categoryList)

      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewItemData(e) {
    let newItemData = { ...newItem }
    newItemData[e.target.name] = e.target.value
    setNewItem(newItemData)
  }

  function editItemValidation(newItem) {
    const schema = Joi.object({
      name: Joi.string()
        .required(),
      price: Joi.number().positive().required(),
      description: Joi.string().required(),
      gender: Joi.string(),
      isAdult: Joi.any(),
      sizes: Joi.any(),
      categoryList: Joi.any()
    });
    return schema.validate(newItem, { abortEarly: false });
  }

  async function editItemHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editItemValidation(newItem);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newItem, oldItem)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newItem[key]
        }
      })

      try {
        const { data } = await itemServices.updateItem(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object" && await itemServices.uploadItemCover(params.id, formData)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate(`/items/${params.id}`);
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

  function isSelectedCategory(categoreyId) {
    return newItem["categoryList"].includes(categoreyId)
  }

  function toggleSelectedCategoriesHandler(categoryId) {
    if (isSelectedCategory(categoryId)) {
      let oldSelectedCategories = newItem["categoryList"]
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setNewItem((prev) => { return { ...prev, categoryList: newSelectedCategories } })
    } else {
      setNewItem((prev) => { return { ...prev, categoryList: [...prev.categoryList, categoryId] } })
    }
  }

  useEffect(() => {
    getItemByIdHandler()
    getAllCategoriesHandler()
  }, [])


  let categoriesOptions = categories.map((category) => {
    return ({
      name: category.name,
      id: category._id
    }
    )
  })

  let selected_categories = selectedCategories.map((selectedCategory) => {
    return ({
      name: selectedCategory.name,
      id: selectedCategory._id
    }
    )
  })

  function isSelectedSize(size) {
    return newItem["sizes"].includes(size)
  }

  function toggleSelectedSizesHandler(size) {
    if (isSelectedSize(size)) {
      let oldSelectedSizes = newItem["sizes"]
      let newSelectedSizes = oldSelectedSizes.filter((size) => { return size !== size })
      setNewItem((prev) => { return { ...prev, sizes: newSelectedSizes } })
    } else {
      setNewItem((prev) => { return { ...prev, sizes: [...prev.sizes, size] } })
    }
  }

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-brand-page">
          <div className="edit-brand-card">
            <h3>Edit Item</h3>
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
                  src={typeof uploadImage === "object" ? URL.createObjectURL(uploadImage) :
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
            <form onSubmit={editItemHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewItemData}
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
                value={newItem.name}
              />
              <label htmlFor="description">Description</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="text"
                name="description"
                id="description"
                value={newItem.description}
              />
              <label htmlFor="price">Price</label>
              <input
                onChange={getNewItemData}
                className='form-control add-item-input'
                type="number"
                name="price"
                id="price"
                value={newItem.price}
              />
              <label htmlFor="">Gender</label>
              <div className="wrapper add-item-input">
                <input
                  onChange={getNewItemData}
                  value='male'
                  type="radio"
                  name="gender"
                  id="male"
                  checked={newItem.gender === 'male'}
                />
                <input
                  onChange={getNewItemData}
                  value='female'
                  type="radio"
                  name="gender"
                  id="female"
                  checked={newItem.gender === 'female'}
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
                <input
                  checked={newItem.isAdult}
                  type="checkbox"
                  id="isAdult"
                  onChange={(e) => { setNewItem((prev) => { return { ...prev, isAdult: e.target.checked } }) }} />
                <label htmlFor='isAdult'>For Adults</label>
              </div>

              <label htmlFor="">Avaliable Sizes</label>
              <div className="check">
                <input
                  checked={isSelectedSize('XS')}
                  value='xs'
                  type="checkbox"
                  id="xs"
                  onChange={(e) => { toggleSelectedSizesHandler("XS") }} />
                <label htmlFor='xs'>XS</label>
              </div>
              <div className="check">
                <input
                  checked={isSelectedSize('S')}
                  value='s'
                  type="checkbox"
                  id="s"
                  onChange={(e) => { toggleSelectedSizesHandler("S") }} />
                <label htmlFor='s'>S</label>
              </div>
              <div className="check">
                <input
                  checked={isSelectedSize('M')}
                  value='m'
                  type="checkbox"
                  id="m"
                  onChange={(e) => { toggleSelectedSizesHandler("M") }} />
                <label htmlFor='m'>M</label>
              </div>
              <div className="check">
                <input
                  checked={isSelectedSize('L')}
                  value='l'
                  type="checkbox"
                  id="l"
                  onChange={(e) => { toggleSelectedSizesHandler("L") }} />
                <label htmlFor='l'>L</label>
              </div>
              <div className="check">
                <input
                  checked={isSelectedSize('XL')}
                  value='xl'
                  type="checkbox"
                  id="xl"
                  onChange={(e) => { toggleSelectedSizesHandler("XL") }} />
                <label htmlFor='xl'>XL</label>
              </div>
              <div className="check add-item-input">
                <input
                  checked={isSelectedSize('XXL')}
                  value='xxl'
                  type="checkbox"
                  id="xxl"
                  onChange={(e) => { toggleSelectedSizesHandler("XXL") }} />
                <label htmlFor='xxl'>XXL</label>
              </div>

              {/* {
                categories.map((category, index) => {
                  return (
                    <div className="check" key={category._id}>
                      <input checked={isSelectedCategory(category._id)} type="checkbox" id={category.name} onChange={(e) => { toggleSelectedCategoriesHandler(category._id) }} />
                      <label htmlFor={category.name}>{category.name}</label>
                    </div>
                  )
                })
              } */}
              <p className='select-categories'>Select Categories</p>
              <Multiselect
                displayValue="name"
                selectedValues={selected_categories}
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
              <button className='add-brand-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Edit Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
