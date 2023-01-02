import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useNavigate } from 'react-router-dom'
import itemServices from '../../services/itemServices'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import './Items.scss'

export default function Items() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(12)
  const [totalResult, setTotalResult] = useState(0)

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
  }

  async function getAllItemsHandler(currentPage) {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllBrandItems(currentPage, 12);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setItems(data.Data)
        setTotalResult(data.totalResult)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllItemsHandler(currentPage)
  }, [currentPage])


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
            items.map((item, index) => {
              return (
                <div className="col-md-3" key={item._id}>
                  <div className="item" onClick={() => navigate(`/items/${item._id}`)}>
                    {item.cover ? (
                      <div className="image">
                        <img src={`https://graduation-project-23.s3.amazonaws.com/${item.cover}`}
                          alt="Item Image" />
                      </div>
                    ) : (
                      <div className="image">
                        <img src={item.images[0]} alt="Item Image" />
                      </div>
                    )}
                    <div className="item-info">
                      <h3>{item.name.slice(0, 10)}</h3>
                    </div>
                  </div>
                </div>
              )
            })
          )}
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
