import Joi from 'joi';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import brandServices from '../../../services/brandServices';
import categoryServices from '../../../services/categoryServices';
import collectionServices from '../../../services/collectionServices';
import itemServices from '../../../services/itemServices';
import './AddCollection.scss'

export default function AddCollection() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [season, setSeason] = useState("");
  const [date, setDate] = useState("");
  const [brandId, setBrandId] = useState("");
  const [items, setItems] = useState([])

  const [newCollection, setNewCollection] = useState({
    name: ""
  })

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  function getNewCollectionData(e) {
    let newCollectionData = { ...newCollection }
    newCollectionData[e.target.name] = e.target.value
    setNewCollection(newCollectionData)
  }

  function addCollectionValidation(newCollection) {
    const schema = Joi.object({
      name: Joi.string()
        .pattern(/^[a-zA-Z0-9 &_\-'"\\|,.\/]*$/)
        .min(3)
        .max(30)
        .required()
    });
    return schema.validate(newCollection, { abortEarly: false });
  }

  async function addCollectionHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = addCollectionValidation(newCollection);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        let collectionData = {
          name: newCollection.name,
          season: season,
          date: date,
          itemsList: getFinalItems(),
          categoryList: getFinalCategories(),
          brandId: brandId
        }
        const { data } = await collectionServices.addCollection(collectionData)
        if (data.success && data.message === "collectionAdded") {
          setLoading(false);
          let collectionID = data.Data._id
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true)
          try {
            const { data } = await collectionServices.uploadImageCollection(collectionID, formData)
            setLoading(true)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate("/collections");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
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

  async function getAllItemsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllBrandItems(1, 5000);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setItems(data.Data)
        // setTotalResult(data.totalResult)
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

  function toggleSelectedItemsHandler(itemId) {
    if (selectedItems.includes(itemId)) {
      let oldSelectedItems = selectedItems
      let newSelectedItems = oldSelectedItems.filter((item) => { return item !== itemId })
      setSelectedItems(newSelectedItems)
    } else {
      setSelectedItems((prev) => { return [...prev, itemId] })
    }

    console.log(itemId);
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

  function getFinalItems() {
    let finalBrandItems = []
    selectedItems.forEach((selectedItem) => {
      items.filter(item => item._id === selectedItem).map((item) => {
        finalBrandItems.push(item._id)
      })
    })

    return finalBrandItems
  }

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandByIdHandler()
    getAllItemsHandler()
  }, [])


  let itemsOptions = items.map((item) => {
    return ({
      name: item.name,
      id: item._id
    }
    )
  })

  let categoriesOptions = categories.map((category) => {
    return ({
      name: category.name,
      id: category._id
    }
    )
  })



  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="add-brand-page">
          <div className="add-brand-card">
            <h3>Add Collection</h3>
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

            <form onSubmit={addCollectionHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCollectionData}
                className='form-control w-100 add-brand-input'
                type="text"
                name="name"
                id="name"
              />
              <label>Season</label>
              <select onChange={(e) => { setSeason(e.target.value) }} className='form-control w-100 add-brand-input' id="season" name="season" title='season'>
                <option defaultValue='Season'>-- Season --</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
              <label htmlFor="Date">Date</label>
              <div className="date add-brand-input">
                <input
                  onChange={(e) => { setDate(e.target.value) }}
                  type="date"
                  name="Date"
                  id="Date"
                  className='picker'
                />
              </div>

              <p className='select-categories'>Select Categories</p>
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

              <p className='select-items'>Select Items</p>
              <Multiselect
                displayValue="name"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedItemsHandler(selectedItem.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedItemsHandler(selectedItem.id)
                }}
                options={itemsOptions}
                showCheckbox
              />

              <button className='add-brand-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Add Collection"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
