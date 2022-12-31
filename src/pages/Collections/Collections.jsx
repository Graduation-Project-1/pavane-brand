import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import brandServices from '../../services/brandServices'
import collectionServices from '../../services/collectionServices'
import './Collections.scss'

export default function Collections() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllCollectionsHandler() {
    setLoading(true)
    try {
      const { data } = await collectionServices.getAllBrandCollections();
      setLoading(true)
      if (data.success && data.status === 200) {
        setLoading(false);
        setCollections(data.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  useEffect(() => {
    getAllCollectionsHandler()
  }, [])

  return <>
    <div className="collections">
      <div className="row">
        <div className="col-md-12">
          <div className="add-collection">
            <button
              className='add-collection-btn'
              onClick={() => { navigate(`/collections/addCollection`) }}>
              Add Collection
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
        <div className="col-md-12">
          <div className="collection-data">
            <table className="table table-striped table-hover my-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Season</th>
                  <th>Date</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<OverlayLoading />) :
                  (
                    collections.map((collection, index) => {
                      return (
                        <tr key={collection._id} onClick={() => navigate(`/collections/${collection._id}`)}>
                          <td>{index + 1}</td>
                          <td>{collection.name}</td>
                          <td>{collection.season}</td>
                          <td>{new Date(collection.date).toDateString()}</td>
                          <td>{collection.numberOfLikes}</td>
                        </tr>
                      )
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
}
