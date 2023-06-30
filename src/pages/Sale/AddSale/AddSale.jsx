import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import categoryServices from '../../../services/categoryServices';
import brandServices from '../../../services/brandServices';
import itemServices from '../../../services/itemServices';
import saleServices from '../../../services/saleServices';
import toastPopup from '../../../helpers/toastPopup';
import Multiselect from 'multiselect-react-dropdown';
import './AddSale.scss'

export default function AddSale() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [brandId, setBrandId] = useState("")
  const [items, setItems] = useState([])
  const [season, setSeason] = useState("")
  const [date, setDate] = useState("")

  const [newSale, setNewSale] = useState({
    name: "",
    discountRate: 0
  })

  function getNewSaleData(e) {
    let newSaleData = { ...newSale }
    newSaleData[e.target.name] = e.target.value
    setNewSale(newSaleData)
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(1, 10000);
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

  let categoriesOptions = categories.map((category) => {
    return ({
      name: category?.name,
      id: category?._id
    })
  })

  async function getBrandHandler() {
    try {
      const { data } = await brandServices.getBrand();
      if (data?.success && data?.status === 200) {
        setBrandId(data?.Data?._id)
      }
    } catch (e) {
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

  function toggleSelectedItemsHandler(itemId) {
    if (selectedItems.includes(itemId)) {
      let oldSelectedItems = selectedItems
      let newSelectedItems = oldSelectedItems.filter((item) => { return item !== itemId })
      setSelectedItems(newSelectedItems)
    } else {
      setSelectedItems((prev) => { return [...prev, itemId] })
    }
  }

  function getFinalItems() {
    let finalBrandItems = []
    selectedItems.forEach((selectedItem) => {
      items.filter(item => item?._id === selectedItem).map((item) => {
        finalBrandItems.push(item?._id)
      })
    })

    return finalBrandItems
  }

  let itemsOptions = items.map((item) => {
    return ({
      name: item?.name,
      id: item?._id
    })
  })

  async function addSaleHandler(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let saleData = {
        name: newSale?.name,
        season: season,
        date: date,
        discountRate: newSale?.discountRate,
        categoryList: getFinalCategories(),
        itemsList: getFinalItems(),
        brandId: brandId,
      }

      const { data } = await saleServices.addSale(saleData)
      if (data?.success) {
        setLoading(false);
        let saleId = data?.Data?._id
        var formData = new FormData();
        formData.append("images", uploadImage);
        setLoading(true)
        try {
          const { data } = await saleServices.uploadImageSale(saleId, formData)
          setLoading(true)
          if (data?.success && data?.status === 200) {
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          setErrorMessage(error);
        }
        navigate("/sale");
        toastPopup.success("Sale added successfully")
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandHandler()
    getAllItemsHandler()
  }, [])

  return <>
    <div>
      <button className='back-edit' onClick={() => { navigate(`/sale`) }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="add-brand-page">
          <div className="add-brand-card">
            <h3>Add Sale</h3>
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
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
                Add Sale Image
              </label>
            </div>

            <form onSubmit={addSaleHandler}>
              <label htmlFor="name">Name</label>
              <input
                onChange={getNewSaleData}
                className='form-control add-collection-input'
                type="text"
                name="name"
                id="name"
              />

              <label>Season</label>
              <select onChange={(e) => { setSeason(e.target.value) }}
                className='form-control add-collection-input'
                id="season"
                name="season"
                title='season'>
                <option value=''>-- Season --</option>
                <option value="winter">Winter</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
              </select>

              <label htmlFor="Date">Date</label>
              <div className="date add-brand-input">
                <input
                  onChange={(e) => { setDate(e.target.value) }}
                  type="date"
                  name="Date"
                  id="Date"
                  className='form-control add-brand-input'
                />
              </div>

              <label htmlFor="name">Discount</label>
              <input
                onChange={getNewSaleData}
                className='form-control add-collection-input'
                type="number"
                name="discountRate"
                id="discount"
              />

              <p className='select-categories'>Categories</p>
              <Multiselect
                displayValue="name"
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

              <p className='select-categories'>Items</p>
              <Multiselect
                displayValue="name"
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
                  : "Add Sale"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
