import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading';
import brandServices from '../../services/brandServices';
import categoryServices from '../../services/categoryServices';
import './MyCategories.scss'

export default function MyCategories() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [myCategories, setMyCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShowRemove, setModalShowRemove] = useState(false)
  const [newCategoryId, setNewCategoryId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
  }

  async function getBrandByIdHandler(currentPage) {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById(currentPage);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false)
        setMyCategories(data.Data.categoryList)
        setTotalResult(data.Data.categoryList.length)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  async function getAllCategoriesHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getAllCategories();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  function removeBtn(categoryId) {
    setModalShowRemove(true)
    setNewCategoryId(categoryId)
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
      const { data } = await brandServices.updateProfileBrand({ categoryList: categories })
      if (data.success && data.status === 200) {
        setLoading(false);
        setModalShowRemove(false)
        getAllCategoriesHandler()
        getBrandByIdHandler(currentPage)
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response);
    }
  }

  useEffect(() => {
    getBrandByIdHandler(currentPage)
  }, [currentPage])

  return <>

    {modalShowRemove && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to remove?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShowRemove(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { removeCategoriesHandler() }}
            className='delete btn btn-warning add-btn w-50'>
            Remove
          </div>
        </div>
      </div>
    </div>}

    <div className="categories">
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
                        <tr key={category._id}
                          onClick={() => navigate(`/categories/${category._id}`)}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeBtn(category._id) }}
                              className='btn btn-danger'>
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='pagination-nav'>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={postPerPage}
          totalItemsCount={totalResult}
          pageRangeDisplayed={10}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  </>
}
