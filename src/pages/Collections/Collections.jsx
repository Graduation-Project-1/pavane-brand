import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import collectionServices from '../../services/collectionServices'
import Pagination from 'react-js-pagination'
import './Collections.scss'

export default function Collections() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/collections/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllCollectionsHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.getAllBrandCollections();
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCollections(data?.Data)
        setHidePagination(false)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchCollectionByName(searchValue) {
    try {
      const { data } = await collectionServices.collectionSearch(searchValue)
      setCollections(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllCollectionsHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchCollectionByName(searchValue)
    } else {
      getAllCollectionsHandler(params?.pageNumber)
    }
  }, [searchValue])

  return <>
    <div className="collections">
      <div className="row">
        <div className="col-md-12">
          <div className="add-collection">
            <button
              className='add-collection-btn'
              onClick={() => { navigate(`/collections/addCollection`) }}>
              Add Collection
            </button>
          </div>
        </div>
      </div>
      <div className="form-search">
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          className='form-control w-50'
          type="text"
          name="search"
          id="search"
          placeholder='Search...'
        />
      </div>
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
          <div className="collection-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Season</th>
                  <th>Date</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    collections.map((collection, index) => {
                      return (
                        <tr key={collection?._id}
                          onClick={() => navigate(`/collections/page/${params?.pageNumber ? params?.pageNumber : 1}/${collection?._id}`)}>
                          <td>{index + 1}</td>
                          <td>{collection?.name}</td>
                          <td>{collection?.season}</td>
                          <td>{new Date(collection?.date)?.toDateString()}</td>
                          <td>{collection?.numberOfLikes}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
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
  </>
}
