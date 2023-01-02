import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import itemServices from '../../../services/itemServices'
import './ItemDetails.scss'

export default function ItemDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [item, setItem] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)
  const [seeMore, setSeeMore] = useState(false)

  async function getItemByIdHandler() {
    setLoading(true)
    try {
      const { data } = await itemServices.getItemById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setItem(data.Data)
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
      const { data } = await itemServices.deleteItem(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/items`)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getItemByIdHandler()
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
        <div className="col-md-4">
          <div className="image">
            <div className="advertisement-data">
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {item?.images?.map((image, index) => {
                    return (
                      <div className="carousel-item active" key={index}>
                        <img src={image} className="d-block w-100" alt="..." />
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
                  <button onClick={() => { navigate(`/items/${params.id}/edit`) }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  <button onClick={() => { setModalShow(true) }}
                    className='delete btn btn-danger'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <h2>{item.name}</h2>
            <div>
              {item?.description?.length >= 500 ? (
                <div className='seeMore'>
                  {seeMore ?
                    (<p className='Description'>Description: {item.description}
                      <button onClick={() => { setSeeMore(false) }}>See Less</button></p>)
                    : (<p className='Description'>Description: {item.description.slice(0, 500)}
                      - <button onClick={() => { setSeeMore(true) }}>See More</button></p>)}
                </div>
              ) : (
                <p className='Description'>Description: {item.description}</p>
              )}
            </div>

            <p>Brand: {item?.brandId?.name}</p>
            <p>Price: {item.price}</p>
            <p>Gender: {item.gender}</p>
            {item.isAdult ? (<p>For Adults: Yes</p>) : (<p>For Adults: No</p>)}
            <p>Rate: {item.averageRate &&
              (((item.averageRate).toString()).length === 1 ?
                ((item.averageRate).toString()).slice(0, 1) :
                ((item.averageRate).toString()).slice(0, 3))}</p>
            <p>Available Sizes: {item.sizes + ", "}</p>
            <p>Available Colors: {item.colors + ", "}</p>
            <p>Available Categories: {
              categories.map((category) => {
                return category.name + ", "
              })
            }</p>
            <p>Reviews: {item.numberOfReviews}</p>
            <p>Likes: {item.numberOfLikes}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
