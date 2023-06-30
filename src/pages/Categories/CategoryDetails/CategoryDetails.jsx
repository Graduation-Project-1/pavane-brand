import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../../services/categoryServices'
import imageEndPoint from '../../../services/imagesEndPoint'
import './CategoryDetails.scss'

export default function CategoryDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState({})
  const [errorMessage, setErrorMessage] = useState("");

  async function getCategoryByIdHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getCategoryById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setCategory(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getCategoryByIdHandler()
  }, [])

  return <>
    <div>
      <button className='back' onClick={() => {
        navigate(`/categories/page/${params?.pageNumber}`)
      }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
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
            <img
              src={
                category?.image ?
                  category?.image?.includes('https://') ?
                    category?.image :
                    `${imageEndPoint}${category?.image}`
                  : "https://resources.workable.com/wp-content/uploads/2016/01/category-manager-640x230.jpg"
              }
              alt="Category Image"
              className='category-image' />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <h2>{category?.name}</h2>
          </div>
        </div>
      </div>
    )}
  </>
}
