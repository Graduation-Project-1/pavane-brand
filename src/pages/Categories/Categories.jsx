import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import categoryServices from '../../services/categoryServices'
import './Categories.scss'

export default function Categories() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [myCategories, setMyCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [isLeftClicked, setIsLeftClicked] = useState(true);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [modalShow, setModalShow] = useState(false)
  const [modalShowRemove, setModalShowRemove] = useState(false)
  const [newCategoryId, setNewCategoryId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  let categoriesArr = []

  async function getAllCategoriesHandler(page) {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(page);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCategories(data.Data)
        setTotalResult(data.totalResult)
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
        setLoading(false)
        setMyCategories(data.Data.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function toggleLeft() {
    setIsLeftClicked(true)
    setIsRightClicked(false)
    getAllCategoriesHandler()
  }

  function toggleRight() {
    setIsLeftClicked(false)
    setIsRightClicked(true)
    getBrandByIdHandler()
  }

  function addBtn(categoryId) {
    setModalShow(true)
    setNewCategoryId(categoryId)
  }

  function removeBtn(categoryId) {
    setModalShowRemove(true)
    setNewCategoryId(categoryId)
  }

  async function newCategoriesHandler() {
    let categories = []
    myCategories.map((category) => {
      return (
        categories.push(category._id)
      )
    })
    categories.push(newCategoryId)
    try {
      const { data } = await brandServices.updateProfileBrand({ categoryList: categories })
      if (data.success && data.status === 200) {
        setLoading(false);
        setModalShow(false)
        getBrandByIdHandler()
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response);
    }
  }

  async function removeCategoriesHandler() {

    let categoriesObj = myCategories.filter((category) => {
      return category._id !== newCategoryId
    })

    let categories = []
    categoriesObj.map((category) => {
      return (
        categories.push(category._id)
      )
    })

    try {
      console.log(categories);
      const { data } = await brandServices.updateProfileBrand({ categoryList: categories })
      if (data.success && data.status === 200) {
        setLoading(false);
        setModalShowRemove(false)
        getBrandByIdHandler()
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandByIdHandler()
  }, [])

  myCategories.map((category) => {
    return (
      categoriesArr.push(category._id)
    )
  })

  const pages = []

  for (let index = 1; index <= Math.ceil(totalResult / postPerPage); index++) {
    pages.push(index)
  }

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to add?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { newCategoriesHandler() }} className='delete btn btn-warning add-btn w-50'>Add</div>
        </div>
      </div>
    </div>}

    {modalShowRemove && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to remove?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShowRemove(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { removeCategoriesHandler() }} className='delete btn btn-warning add-btn w-50'>Remove</div>
        </div>
      </div>
    </div>}

    <div className="categories">
      <div className="row">
        {/* <div className="col-md-12">
          <div className="add-category">
            <button
              className='add-category-btn'
              onClick={() => { navigate(`/categories/addCategory`) }}>
              Add Category
            </button>
          </div>
        </div> */}
        <div className="col-md-12">
          <div className="cats d-flex justify-content-center">
            <ul className="nav nav-tabs">
              {
                isLeftClicked ? (
                  <li className="nav-item" onClick={() => { toggleLeft() }}>
                    <a className="nav-link active" aria-current="page">All Categories</a>
                  </li>
                ) : (
                  <li className="nav-item" onClick={() => { toggleLeft() }}>
                    <a className="nav-link" aria-current="page">All Categories</a>
                  </li>
                )
              }

              {
                isRightClicked ? (
                  <li className="nav-item" onClick={() => { toggleRight() }}>
                    <a className="nav-link active">My Categories</a>
                  </li>
                ) : (
                  <li className="nav-item" onClick={() => { toggleRight() }}>
                    <a className="nav-link">My Categories</a>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
      {isLeftClicked ? (
        <div className="row">
          <div className="col-md-12 text-center">
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
            }
          </div>
          <div className="col-md-12">
            <div className="category-data">
              <table className="table table-striped table-hover my-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Add</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (<OverlayLoading />) :
                    (
                      categories.map((category, index) => {
                        return (
                          <tr key={category._id} onClick={() => navigate(`/categories/${category._id}`)}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            {
                              categoriesArr.includes(category._id) ?
                                <td><button disabled className='btn btn-dark'>Added</button></td>
                                :
                                <td><button onClick={(e) => { e.stopPropagation(); addBtn(category._id) }} className='btn btn-warning add-btn'>Add</button></td>
                            }
                          </tr>
                        )
                      })
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : ""}
      {isRightClicked ? (
        <div className="row">
          <div className="col-md-12 text-center">
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
            }
          </div>
          <div className="col-md-12">
            <div className="category-data">
              <table className="table table-striped table-hover my-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (<OverlayLoading />) :
                    (
                      myCategories.map((category, index) => {
                        return (
                          <tr key={category._id} onClick={() => navigate(`/categories/${category._id}`)}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td><button onClick={(e) => { e.stopPropagation(); removeBtn(category._id) }} className='btn btn-danger'>Remove</button></td>
                          </tr>
                        )
                      })
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : ""}

      <nav className='pagination-nav'>
        <ul className="pagination-ul">
          {
            pages.map((page, index) => {
              return (
                <li key={index}
                  onClick={() => { setCurrentPage(page); getAllCategoriesHandler(page) }}
                  className={currentPage === page ? "active-pagination" : "page-item"}>
                  <span className="page-link">{page}</span>
                </li>
              )
            })
          }
        </ul>
      </nav>
    </div>
  </>
}
