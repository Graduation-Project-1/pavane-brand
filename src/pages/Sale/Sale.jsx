import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import saleServices from '../../services/saleServices'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import Pagination from 'react-js-pagination'
import './Sale.scss'

export default function Sale() {

  const navigate = useNavigate()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [sales, setSales] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(params?.pageNumber ? parseInt(params?.pageNumber) : 1)
  const [postPerPage, setPostPerPage] = useState(10)
  const [totalResult, setTotalResult] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [hidePagination, setHidePagination] = useState(false)

  function handlePageChange(pageNumber) {
    navigate(`/sale/page/${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  async function getAllSalesHandler() {
    setLoading(true)
    try {
      const { data } = await saleServices.getAllSales(params?.pageNumber);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setSales(data?.Data)
        setHidePagination(false)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function searchSalesByName(searchValue) {
    try {
      const { data } = await saleServices.saleSearch(searchValue)
      setSales(data?.Data)
      setTotalResult(data?.totalResult)
      setHidePagination(true)
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllSalesHandler(params?.pageNumber)
  }, [params?.pageNumber])

  useEffect(() => {
    if (searchValue?.length > 0) {
      searchSalesByName(searchValue)
    } else {
      getAllSalesHandler(params?.pageNumber)
    }
  }, [searchValue])

  return <>
    <div className="collections">
      <div className="row">
        <div className="col-md-12">
          <div className="add-collection">
            <button
              className='add-collection-btn'
              onClick={() => { navigate(`/sale/addSale`) }}>
              Add Sale
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
                    sales.map((sale, index) => {
                      return (
                        <tr key={sale?._id} onClick={() => navigate(`/sale/page/${params?.pageNumber ? params?.pageNumber : 1}/${sale?._id}`)}>
                          <td>{index + 1}</td>
                          <td>{sale?.name}</td>
                          <td>{sale?.season}</td>
                          <td>{new Date(sale?.date)?.toDateString()}</td>
                          <td>{sale?.numberOfLikes}</td>
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
