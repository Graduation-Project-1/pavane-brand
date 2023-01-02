import Joi from 'joi'
import Multiselect from 'multiselect-react-dropdown'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import categoryServices from '../../../../services/categoryServices'
import collectionServices from '../../../../services/collectionServices'
import itemServices from '../../../../services/itemServices'
import './EditCollection.scss'

export default function EditCollection() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const [oldCollection, setOldCollection] = useState({
    name: "",
    season: "",
    date: "",
    categoryList: "",
    itemsList: ""
  })

  const [newCollection, setNewCollection] = useState({
    name: "",
    season: "",
    date: "",
    categoryList: "",
    itemsList: ""
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

  async function getCollectionByIdHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.getCollectionById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setOldCollection({
          name: data?.Data?.name,
          season: data?.Data?.season,
          date: data?.Data?.date,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id }),
          itemsList: data?.Data?.itemsList.map((item) => { return item._id }),
        })
        setNewCollection({
          name: data?.Data?.name,
          season: data?.Data?.season,
          date: data?.Data?.date,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id }),
          itemsList: data?.Data?.itemsList.map((item) => { return item._id }),
        })
        setUploadImage(data?.Data?.image)
        setSelectedCategories(data?.Data?.categoryList)
        setSelectedItems(data?.Data?.itemsList)

      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function getNewCollectionData(e) {
    let newCollectionData = { ...newCollection }
    newCollectionData[e.target.name] = e.target.value
    setNewCollection(newCollectionData)
  }

  function editCollectionValidation(newCollection) {
    const schema = Joi.object({
      name: Joi.string().required(),
      season: Joi.string().required(),
      date: Joi.string(),
      categoryList: Joi.any(),
      itemsList: Joi.any(),
    });
    return schema.validate(newCollection, { abortEarly: false });
  }

  async function editCollectionHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = editCollectionValidation(newCollection);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      let editedData = {};

      Object.keys(checkUpdatedFields(newCollection, oldCollection)).forEach((key) => {
        editedData = {
          ...editedData,
          [key]: newCollection[key]
        }
      })

      try {
        const { data } = await collectionServices.updateCollection(params.id, editedData)
        if (data.success && data.status === 200) {
          setLoading(false);
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object"
              && await collectionServices.uploadImageCollection(params.id, formData)
            if (data.success && data.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
          navigate(`/collections/${params.id}`);
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

  function isSelectedCategory(categoreyId) {
    return newCollection["categoryList"].includes(categoreyId)
  }

  function isSelectedItem(itemId) {
    return newCollection["itemsList"].includes(itemId)
  }

  function toggleSelectedCategoriesHandler(categoryId) {
    if (isSelectedCategory(categoryId)) {
      let oldSelectedCategories = newCollection["categoryList"]
      let newSelectedCategories = oldSelectedCategories.filter((category) => { return category !== categoryId })
      setNewCollection((prev) => { return { ...prev, categoryList: newSelectedCategories } })
    } else {
      setNewCollection((prev) => { return { ...prev, categoryList: [...prev.categoryList, categoryId] } })
    }
  }

  function toggleSelectedItemsHandler(itemId) {
    if (isSelectedItem(itemId)) {
      let oldSelectedItems = newCollection["itemsList"]
      let newSelectedItems = oldSelectedItems.filter((item) => { return item !== itemId })
      setNewCollection((prev) => { return { ...prev, itemsList: newSelectedItems } })
    } else {
      setNewCollection((prev) => { return { ...prev, itemsList: [...prev.itemsList, itemId] } })
    }
  }

  useEffect(() => {
    getCollectionByIdHandler()
    getAllCategoriesHandler()
    getAllItemsHandler()
  }, [])

  let categoriesOptions = categories.map((category) => {
    return ({
      name: category.name,
      id: category._id
    })
  })

  let itemsOptions = items.map((item) => {
    return ({
      name: item.name,
      id: item._id
    })
  })

  let selected_categories = selectedCategories.map((selectedCategory) => {
    return ({
      name: selectedCategory.name,
      id: selectedCategory._id
    })
  })

  let selected_items = selectedItems.map((selectedItem) => {
    return ({
      name: selectedItem.name,
      id: selectedItem._id
    })
  })

  let date = (newCollection.date).split('T')[0]

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="edit-brand-page">
          <div className="edit-brand-card">
            <h3>Edit Collection</h3>
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
            <form onSubmit={editCollectionHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewCollectionData}
                className='form-control add-brand-input'
                type="text"
                name="name"
                id="name"
                value={newCollection.name}
              />

              <label>Season</label>
              <select onChange={getNewCollectionData}
                selected={newCollection.season}
                value={newCollection.season}
                className='form-control add-customer-input'
                id="season"
                name="season"
                title='season'>
                <option value={0} disabled>-- Season --</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="none">none</option>
              </select>

              <label htmlFor="date">Date</label>
              <div className="date add-brand-input">
                <input
                  onChange={getNewCollectionData}
                  type="date"
                  name="date"
                  id="date"
                  className='picker'
                  value={date}
                />
              </div>

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

              <p className='select-items'>Select Items</p>
              <Multiselect
                displayValue="name"
                selectedValues={selected_items}
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
                  : "Edit Collection"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
