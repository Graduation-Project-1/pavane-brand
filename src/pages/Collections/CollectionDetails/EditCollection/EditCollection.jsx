import Multiselect from 'multiselect-react-dropdown'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import categoryServices from '../../../../services/categoryServices'
import collectionServices from '../../../../services/collectionServices'
import itemServices from '../../../../services/itemServices'
import toastPopup from '../../../../helpers/toastPopup'
import imageEndPoint from '../../../../services/imagesEndPoint'
import './EditCollection.scss'

export default function EditCollection() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const [oldCollection, setOldCollection] = useState({
    name: "",
    season: "",
    discountRate: 0,
    date: "",
    categoryList: "",
    itemsList: ""
  })

  const [newCollection, setNewCollection] = useState({
    name: "",
    season: "",
    discountRate: 0,
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
      const { data } = await collectionServices.getCollectionById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setOldCollection({
          name: data?.Data?.name,
          season: data?.Data?.season,
          discountRate: data?.Data?.discountRate,
          date: data?.Data?.date,
          categoryList: data?.Data?.categoryList.map((cat) => { return cat._id }),
          itemsList: data?.Data?.itemsList.map((item) => { return item._id }),
        })
        setNewCollection({
          name: data?.Data?.name,
          season: data?.Data?.season,
          discountRate: data?.Data?.discountRate,
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
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function getNewCollectionData(e) {
    let newCollectionData = { ...newCollection }
    newCollectionData[e.target.name] = e.target.value
    setNewCollection(newCollectionData)
  }

  async function editCollectionHandler(e) {
    e.preventDefault();
    setLoading(true);
    let editedData = {};

    Object.keys(checkUpdatedFields(newCollection, oldCollection)).forEach((key) => {
      editedData = {
        ...editedData,
        [key]: newCollection[key]
      }
    })

    try {
      const { data } = await collectionServices.updateCollection(params?.id, editedData)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        if (typeof (uploadImage) === 'object') {
          var formData = new FormData();
          formData.append("images", uploadImage);
          setLoading(true);
          try {
            const { data } = typeof uploadImage === "object" &&
              await collectionServices.uploadImageCollection(params?.id, formData)
            if (data?.success && data?.status === 200) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setErrorMessage(error);
          }
        }
        navigate(`/collections/page/${params?.pageNumber}/${params?.id}`)
        toastPopup.success("Collection updated successfully")
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response);
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
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategories(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllItemsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllBrandItems(1, 10000);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setItems(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
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

  let categoriesOptions = categories?.map((category) => {
    return ({
      name: category?.name,
      id: category?._id
    })
  })

  let itemsOptions = items?.map((item) => {
    return ({
      name: item?.name,
      id: item?._id
    })
  })

  let selected_categories = selectedCategories?.map((selectedCategory) => {
    return ({
      name: selectedCategory?.name,
      id: selectedCategory?._id
    })
  })

  let selected_items = selectedItems?.map((selectedItem) => {
    return ({
      name: selectedItem?.name,
      id: selectedItem?._id
    })
  })

  useEffect(() => {
    getCollectionByIdHandler()
    getAllCategoriesHandler()
    getAllItemsHandler()
  }, [])

  let date = (newCollection?.date)?.split('T')[0]

  return <>
    <div>
      <button className='back-edit' onClick={() => {
        navigate(`/collections/page/${params?.pageNumber}/${params?.id}`)
      }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
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
            <div className="main-image-label">
              {uploadImage && (
                <img
                  src={typeof uploadImage === "object" ?
                    URL.createObjectURL(uploadImage) :
                    (`${imageEndPoint}${uploadImage}`)}
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
                value={newCollection?.name}
              />

              <label>Season</label>
              <select
                onChange={(e) => {
                  setNewCollection((prev) => {
                    return { ...prev, season: e.target.value };
                  });
                }}
                className='form-control add-brand-input'
                id="season"
                name="season"
                title='season'
                value={newCollection?.season}>
                <option value=''>-- Season --</option>
                <option value='winter'>Winter</option>
                <option value='spring'>Spring</option>
                <option value='summer'>Summer</option>
                <option value='fall'>Fall</option>
              </select>

              <label htmlFor="date">Date</label>
              <input
                onChange={getNewCollectionData}
                type="date"
                name="date"
                id="date"
                className='form-control add-customer-input'
                value={date}
              />

              <label htmlFor="name">Discount</label>
              <input
                onChange={getNewCollectionData}
                className='form-control add-collection-input'
                type="number"
                name="discountRate"
                id="discount"
                value={newCollection?.discountRate}
              />

              <p className='select-categories'>Select Categories</p>
              <Multiselect
                displayValue="name"
                selectedValues={selected_categories}
                onKeyPressFn={function noRefCheck() { }}
                onRemove={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem?.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedCategoriesHandler(selectedItem?.id)
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
                  toggleSelectedItemsHandler(selectedItem?.id)
                }}
                onSearch={function noRefCheck() { }}
                onSelect={function noRefCheck(selectedList, selectedItem) {
                  toggleSelectedItemsHandler(selectedItem?.id)
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
