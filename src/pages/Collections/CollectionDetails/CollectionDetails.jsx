import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import collectionServices from '../../../services/collectionServices'
import toastPopup from '../../../helpers/toastPopup'
import imageEndPoint from '../../../services/imagesEndPoint'
import './CollectionDetails.scss'

export default function CollectionDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [collection, setCollection] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [collectionItems, setCollectionItems] = useState([])

  async function getCollectionByIdHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.getCollectionById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCollection(data?.Data)
        setCategories(data?.Data?.categoryList)
        setCollectionItems(data?.Data?.itemsList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteCollectionHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.deleteCollection(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/collections/page/${params?.pageNumber}`)
        toastPopup.success("Collection deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await collectionServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getCollectionByIdHandler()
      toastPopup.success("Collection added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await collectionServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getCollectionByIdHandler()
      toastPopup.success("Collection removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getCollectionByIdHandler()
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
          <div onClick={() => { deleteCollectionHandler() }}
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
            navigate(`/collections/page/${params?.pageNumber}`)
          }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                collection?.image ?
                  collection?.image?.includes('https://') ?
                    collection?.image :
                    `${imageEndPoint}${collection?.image}`
                  : "https://www.lcca.org.uk/media/574173/brand.jpg"
              }
              alt="Collection Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => {
                    navigate(`/collections/page/${params?.pageNumber}/${params?.id}/edit`)
                  }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    collection?.isArchived ? (
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
            <h2>{collection?.name}</h2>
            <p><span>Season:</span> {collection?.season}</p>
            <p><span>Date:</span> {new Date(collection?.date).toDateString()}</p>
            <p><span>Discount:</span> {collection?.discountRate}</p>
            <p><span>Likes:</span> {collection?.numberOfLikes}</p>
            <p><span>Reviews:</span> {collection?.numberOfReviews}</p>
            <p><span>Rate:</span> {collection?.averageRate}</p>
            <p><span>Categories:</span> {
              categories?.map((category) => {
                return category?.name + ", "
              })
            }</p>
            <p><span>Number of items:</span> {collection?.itemsList?.length}</p>
          </div>
        </div>

        <div className='cat-items-style'><p>Brand Items</p></div>
        <div className="row">
          {
            collectionItems?.map((item) => {
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
