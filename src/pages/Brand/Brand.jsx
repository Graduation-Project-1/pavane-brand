import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import './Brand.scss'

export default function Brand() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState({})
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getBrandByIdHandler() {
    setLoading(true)
    try {
      const { data } = await brandServices.getBrandById();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setBrand(data.Data)
        setCategories(data.Data.categoryList)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getBrandByIdHandler()
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
        <div className="col-md-4">
          <div className="image">
            <img src={brand.image} alt="Brand Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="brand-data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/brand/edit`) }} className='edit btn btn-warning'>Edit</button>
                </div>
              </div>
            </div>
            <h2>{brand.name}</h2>
            <p>Email: {brand?.email}</p>
            <p>Phone: {brand?.phone}</p>
            <p>Likes: {brand?.numberOfLikes}</p>
            <p>Categories: {
              categories.map((category) => {
                return category.name + ", "
              })
            }</p>
          </div>
        </div>
      </div>
    )}
  </>
}
