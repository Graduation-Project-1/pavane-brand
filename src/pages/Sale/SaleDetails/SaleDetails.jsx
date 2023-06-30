import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import saleServices from '../../../services/saleServices'
import toastPopup from '../../../helpers/toastPopup'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import imageEndPoint from '../../../services/imagesEndPoint'
import './SaleDetails.scss'

export default function SaleDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [sale, setSale] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [saleItems, setSaleItems] = useState([])

  async function getSaleByIdHandler() {
    setLoading(true)
    try {
      const { data } = await saleServices.getSaleById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setSale(data?.Data)
        setCategories(data?.Data?.categoryList)
        setSaleItems(data?.Data?.itemsList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteSaleHandler() {
    setLoading(true)
    try {
      const { data } = await saleServices.deleteSale(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/sale/page/${params?.pageNumber}`)
        toastPopup.success("Sale deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await saleServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getSaleByIdHandler()
      toastPopup.success("Sale added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await saleServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getSaleByIdHandler()
      toastPopup.success("Sale removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getSaleByIdHandler()
  }, [])

  return <>
    {modalShow && <div className="overlay-modal" id='overlay-remove'>
      <div className="overlay-box">
        <h3>Are you sure you want to delete?</h3>
        <div className="modal-buttons">
          <div onClick={() => setModalShow(false)}
            className='btn btn-dark w-50'>
            Cancel
          </div>
          <div onClick={() => { deleteSaleHandler() }}
            className='delete btn btn-danger w-50'>
            Delete
          </div>
        </div>
      </div>
    </div>}

    {loading ? (<div className="overlay"><OverlayLoading /></div>) : (
      <div className="row">
        <div className="col-md-12 text-center">
          {
            errorMessage ?
              (<div className="alert alert-danger myalert">
                {errorMessage}
              </div>) : ""
          }
        </div>
        <div>
          <button className='back' onClick={() => {
            navigate(`/sale/page/${params?.pageNumber}`)
          }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                sale?.image ?
                  sale?.image?.includes('https://') ?
                    sale?.image :
                    `${imageEndPoint}${sale?.image}`
                  : "https://www.lcca.org.uk/media/574173/brand.jpg"
              }
              alt="Sale Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => {
                    navigate(`/sale/page/${params?.pageNumber}/${params?.id}/edit`)
                  }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    sale?.isArchived ? (
                      <button
                        className='edit btn btn-warning'
                        onClick={removeFromArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Remove from Archive"}
                      </button>
                    ) : (
                      <button
                        className='edit btn btn-warning'
                        onClick={addToArchiveHandler}>
                        {archiveLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Add to Archive"}
                      </button>
                    )
                  }
                  <button onClick={() => { setModalShow(true) }}
                    className='delete btn btn-danger'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <h2>{sale?.name}</h2>
            <p><span>Season:</span> {sale?.season}</p>
            <p><span>Date:</span> {new Date(sale?.date)?.toDateString()}</p>
            <p><span>Discount:</span> {sale?.discountRate}</p>
            <p><span>Likes:</span> {sale?.numberOfLikes}</p>
            <p><span>Categories:</span> {
              categories?.map((category) => {
                return category?.name + ", "
              })
            }</p>
            <p><span>Number of items:</span> {sale?.itemsList?.length}</p>
          </div>
        </div>

        <div className='cat-items-style'><p>Brand Items</p></div>
        <div className="row">
          {
            saleItems?.map((item) => {
              return (
                <div className="col-md-3" key={item?._id}>
                  <div className="item" onClick={() => navigate(`/items/${item?._id}`)}>
                    <div className="image">
                      <img src={item?.images?.[0]?.includes('https://') ?
                        item?.images?.[0] :
                        `${imageEndPoint}${item?.images?.[0]}`}
                        alt="Item Image" />
                    </div>
                    <div className="item-info">
                      <h3>{item?.name?.slice(0, 10)}</h3>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )}
  </>
}
