import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import categoryServices from '../../../services/categoryServices'
import './CategoryDetails.scss'

export default function CategoryDetails() {

  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState({})
  const [errorMessage, setErrorMessage] = useState("");

  async function getCategoryByIdHandler() {
    setLoading(true)
    try {
      const { data } = await categoryServices.getCategoryById(params.id);
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCategory(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getCategoryByIdHandler()
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
            <img src={`https://graduation-project-23.s3.amazonaws.com/${category.image}`} alt="Category Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <h2>{category.name}</h2>
          </div>
        </div>
      </div>
    )}
  </>
}
