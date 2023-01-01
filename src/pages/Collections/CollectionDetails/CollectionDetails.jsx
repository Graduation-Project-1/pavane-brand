import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import collectionServices from '../../../services/collectionServices'
import './CollectionDetails.scss'

export default function CollectionDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [collection, setCollection] = useState({})
  const [categories, setCategories] = useState([])
  const [itemsList, setItemsList] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getCollectionByIdHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.getCollectionById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCollection(data.Data)
        setCategories(data?.Data?.categoryList)
        setItemsList(data?.Data?.itemsList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteCollectionHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.deleteCollection(params.id)
      setLoading(true)
      if (data.success && data.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/collections`)
      }
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
          <div onClick={() => setModalShow(false)} className='btn btn-dark w-50'>Cancel</div>
          <div onClick={() => { deleteCollectionHandler() }} className='delete btn btn-danger w-50'>Delete</div>
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
            <img src={`https://graduation-project-23.s3.amazonaws.com/${collection.image}`} alt="Collection Cover" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="item-details">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/collections/${params.id}/edit`) }} className='edit btn btn-warning'>Edit</button>
                  <button onClick={() => { setModalShow(true) }} className='delete btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
            <h2>{collection.name}</h2>
            {collection.season === 'none' ? "" : (<p>Season: {collection.season}</p>)}
            <p>Date: {new Date(collection.date).toDateString()}</p>
            <p>Reviews: {collection.numberOfReviews}</p>
            <p>Likes: {collection.numberOfLikes}</p>
            <p>Rate: {collection.averageRate}</p>
            <p>Discount: {collection.discountRate}</p>
            <p>Available Categories: {
              categories.map((category) => {
                return category.name + ", "
              })
            }</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="all-items">
              <div className="all-items-label">
                <h3>All Items</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row data-data">
          {
            itemsList.map((item, index) => {
              return (
                <div className="col-md-3" key={item._id}>
                  <div className="item" onClick={() => navigate(`/items/${item._id}`)}>
                    {item.cover ? (
                      <div className="image">
                        <img src={`https://graduation-project-23.s3.amazonaws.com/${item.cover}`} alt="Item Image" />
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
          }
        </div>
      </div>
    )}
  </>
}
