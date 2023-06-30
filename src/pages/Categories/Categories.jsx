import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import categoryServices from '../../services/categoryServices'
import Pagination from "react-js-pagination";
import MyCategories from './MyCategories'
import './Categories.scss'

export default function Categories() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [myCategories, setMyCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [isLeftClicked, setIsLeftClicked] = useState(true);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  let categoriesArr = []

  function handlePageChange(pageNumber) {
    navigate(`/categories/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategories(data?.Data)
        setTotalResult(data?.totalResult)
        setHidePagination(false)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchCategoryByName(searchValue) {
    try {
      const { data } = await categoryServices.categorySearch(searchValue)
      if (data?.success && data?.status === 200) {
        setCategories(data?.Data)
        setTotalResult(data?.totalResult)
        setHidePagination(true)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getBrandHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrand();
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false)
        setMyCategories(data?.Data?.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function toggleLeft() {
    setIsLeftClicked(true)
    setIsRightClicked(false)
    getAllCategoriesHandler()
    getBrandHandler()
  }

  function toggleRight() {
    setIsLeftClicked(false)
    setIsRightClicked(true)
    getBrandHandler()
    getAllCategoriesHandler()
  }

  async function newCategoriesHandler(categoryId) {
    let categories = []
    myCategories?.map((category) => {
      return (
        categories?.push(category?._id)
      )
    })
    categories?.push(categoryId)
    try {
      const { data } = await brandServices.updateProfileBrand({ categoryList: categories })
      if (data?.success && data?.status === 200) {
        setLoading(false);
        getBrandHandler()
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler()
    getBrandHandler()
  }, [])

  useEffect(() => {
    getAllCategoriesHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchCategoryByName(searchValue)
    } else {
      getAllCategoriesHandler(params?.pageNumber)
    }
  }, [searchValue])

  myCategories?.map((category) => {
    return (
      categoriesArr?.push(category?._id)
    )
  })

  return <>
    <div className="categories">
      <div className="row">
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

      {isLeftClicked && <div className="form-search">
        <input onChange={(e) => setSearchValue(e.target.value)}
          className='form-control w-50'
          type="text"
          name="search"
          id="search"
          placeholder='Search...'
        />
      </div>}

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
                      categories?.map((category, index) => {
                        return (
                          <tr key={category?._id}
                            onClick={() => navigate(`/categories/page/${params?.pageNumber ? params?.pageNumber : 1}/${category?._id}`)}>
                            <td>{index + 1}</td>
                            <td>{category?.name}</td>
                            {
                              categoriesArr?.includes(category?._id) ?
                                <td><button disabled className='btn btn-dark'>Added</button></td>
                                :
                                <td><button
                                  onClick={(e) => { e.stopPropagation(); newCategoriesHandler(category?._id) }}
                                  className='btn btn-warning add-btn'>
                                  Add
                                </button></td>
                            }
                          </tr>
                        )
                      })
                    )}
                </tbody>
              </table>
            </div>
          </div>
          {!hidePagination && <div className='pagination-nav'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={postPerPage}
              totalItemsCount={totalResult}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>}
        </div>
      ) : ""}
      {isRightClicked ? (
        <MyCategories />
      ) : ""}
    </div>
  </>
}
