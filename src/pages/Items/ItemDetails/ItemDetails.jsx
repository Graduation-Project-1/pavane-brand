import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import itemServices from '../../../services/itemServices'
import toastPopup from '../../../helpers/toastPopup'
import imageEndPoint from '../../../services/imagesEndPoint';
import Rating from 'react-rating'
import avatar from '../../../assets/avatar.png'
import './ItemDetails.scss'

export default function ItemDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [item, setItem] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [seeMore, setSeeMore] = useState(false)
  const [allReviews, setAllReviews] = useState([])

  async function getItemByIdHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getItemById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setItem(data?.Data)
        setCategories(data?.Data?.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteItemHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.deleteItem(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/items/page/${params?.pageNumber}`)
        toastPopup.success("Item deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await itemServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getItemByIdHandler()
      toastPopup.success("Item added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await itemServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getItemByIdHandler()
      toastPopup.success("Item removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function getAllItemReviewsHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getAllItemReviews(params?.id, 1, 5000)
      setLoading(false);
      setAllReviews(data?.Data);
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getItemByIdHandler()
    getAllItemReviewsHandler()
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
          <div onClick={() => { deleteItemHandler() }}
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
          <button className='back-edit' onClick={() => { navigate(`/items/page/${params?.pageNumber}`) }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-12">
          <div className="cover-image">
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
        </div>
        <div className="col-md-4">
          <div className="image">
            <div className="advertisement-data">
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {item?.images?.map((image, index) => {
                    return (
                      <div className="carousel-item active" key={index}>
                        <img src={image.includes('https://') ? image : `${imageEndPoint}${image}`} className="d-block w-100" alt="Item Image" />
                      </div>
                    )
                  })}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/items/page/${params?.pageNumber}/${params?.id}/edit`) }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    item?.isArchived ? (
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
            <h2>{item?.name}</h2>
            <div>
              {item?.description?.length >= 500 ? (
                <div className='seeMore'>
                  {seeMore ?
                    (<p className='Description'>{item?.description}
                      <button onClick={() => { setSeeMore(false) }}>See Less</button></p>)
                    : (<p className='Description'>{item?.description?.slice(0, 500)}
                      - <button onClick={() => { setSeeMore(true) }}>See More</button></p>)}
                </div>
              ) : (
                <p className='Description'>{item?.description}</p>
              )}
            </div>

            <p><span>Price:</span> {item?.price} L.E</p>
            <p><span>Discount:</span> {item?.discountRate ? item?.discountRate : 0} L.E</p>
            <p><span>Gender:</span> {item?.gender}</p>
            <p><span>For kids:</span> {item?.isAdult ? "No" : "Yes"}</p>
            <p><span>Rate:</span> {item?.averageRate &&
              (((item?.averageRate)?.toString())?.length === 1 ?
                ((item?.averageRate)?.toString())?.slice(0, 1) :
                ((item?.averageRate)?.toString())?.slice(0, 3))}</p>
            <p><span>Available Sizes:</span> {item?.sizes + ", "}</p>
            <p><span>Available Colors:</span> {item?.colors + ", "}</p>
            <p><span>Available Categories:</span> {
              categories.map((category) => {
                return category?.name + ", "
              })
            }</p>
            <p><span>Reviews:</span> {item?.numberOfReviews}</p>
            <p><span>Likes:</span> {item?.numberOfLikes}</p>
          </div>
        </div>

        <div className="col-md-12">
          {allReviews?.map((review) => {
            return (
              <div className="review" key={review?._id}>
                <div className="image">
                  <img src={avatar} alt="Reviewer image" />
                </div>
                <div className="review-data">
                  <p className='comment'>{review?.comment}</p>
                  <p className='reviewer'>{review?.customerId?.name} - {new Date(review?.date)?.toLocaleString()}</p>
                </div>
                <div className="rating">
                  <Rating
                    emptySymbol={<span className='fa-regular fa-star rate-color'></span>}
                    fullSymbol={<span className='fa-solid fa-star'></span>}
                    fractions={2}
                    start={0}
                    stop={5}
                    readonly
                    placeholderSymbol={<span className='fa-solid fa-star rate-color'></span>}
                    placeholderRating={review?.rate}
                    quiet
                  />
                </div>
              </div>)
          })}
        </div>
      </div>
    )}
  </>
}
