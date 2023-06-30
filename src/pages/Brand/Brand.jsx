import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import imageEndPoint from '../../services/imagesEndPoint'
import './Brand.scss'

export default function Brand() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getBrandHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrand();
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setBrand(data?.Data)
        setCategories(data?.Data?.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getBrandHandler()
  }, [])

  return <>
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
        <div className="col-md-12">
          <div className="cover-image">
            <img src={
              brand?.coverImage ?
                brand?.coverImage?.includes('https://') ?
                  brand?.coverImage :
                  `${imageEndPoint}${brand?.coverImage}`
                : "https://www.lcca.org.uk/media/574173/brand.jpg"
            }
              alt="cover image" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img
              src={
                brand?.image ?
                  brand?.image?.includes('https://') ?
                    brand?.image :
                    `${imageEndPoint}${brand?.image}`
                  : "https://www.lcca.org.uk/media/574173/brand.jpg"
              }
              alt="Brand Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="brand-data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button
                    onClick={() => { navigate(`/brand/edit`) }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <h2>{brand?.name}</h2>
            <p><span>Email:</span> {brand?.email}</p>
            <p><span>Phone:</span> {brand?.phone}</p>
            <p><span>Likes:</span> {brand?.numberOfLikes}</p>
            <p><span>Rate:</span> {brand?.averageRate}</p>
            <p><span>Categories:</span> {
              categories?.map((category) => {
                return category?.name + ", "
              })
            }</p>
          </div>
        </div>
      </div>
    )}
  </>
}
