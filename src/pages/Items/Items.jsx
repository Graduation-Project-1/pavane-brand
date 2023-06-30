import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useNavigate, useParams } from 'react-router-dom'
import itemServices from '../../services/itemServices'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import imageEndPoint from '../../services/imagesEndPoint';
import './Items.scss'

export default function Items() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(12)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/items/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllItemsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllBrandItems(params?.pageNumber, 12);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setHidePagination(false)
        setItems(data?.Data)
        setTotalResult(data?.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchItemByName(searchValue) {
    try {
      const { data } = await itemServices.itemSearch(searchValue)
      setItems(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllItemsHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchItemByName(searchValue)
    } else {
      getAllItemsHandler(params?.pageNumber)
    }
  }, [searchValue])

  return <>
    <div className="items">
      <div className="row">
        <div className="col-md-12">
          <div className="add-item">
            <button
              className='add-item-btn'
              onClick={() => { navigate(`/items/addItem`) }}>
              Add Item
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

        {loading ? (<OverlayLoading />) :
          (
            items?.map((item) => {
              return (
                <div className="col-md-3" key={item?._id}>
                  <div className="item" onClick={() => navigate(`/items/page/${params?.pageNumber ? params?.pageNumber : 1}/${item?._id}`)}>
                    <div className="image">
                      <img src={
                        item?.cover ?
                          item?.cover?.includes('https://') ?
                            item?.cover :
                            `${imageEndPoint}${item?.cover}` :
                          item?.images?.[0] ?
                            item?.images?.[0].includes('https://') ?
                              item?.images?.[0] :
                              `${imageEndPoint}${item?.images?.[0]}`
                            : ""
                      }
                        alt="cover image" />
                    </div>
                    <div className="item-info">
                      <h3>{item?.name?.slice(0, 10)}</h3>
                    </div>
                  </div>
                </div>
              )
            })
          )}
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
