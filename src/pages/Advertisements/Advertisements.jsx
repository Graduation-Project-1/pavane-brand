import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import OverlayLoading from '../../components/OverlayLoading/OverlayLoading'
import advertisementServices from '../../services/advertisementServices';
import imageEndPoint from '../../services/imagesEndPoint'
import './Advertisements.scss'

export default function Advertisements() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [advertisements, setAdvertisements] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  async function getAllAdvertisementsHandler() {
    setLoading(true)
    try {
      const { data } = await advertisementServices.getAllAdvertisement();
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setAdvertisements(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAllAdvertisementsHandler()
  }, [])

  return <>
    <div className="advertisements">
      <div className="row">
        <div className="col-md-12">
          <div className="add-advertisement">
            <button
              className='add-advertisement-btn'
              onClick={() => { navigate(`/advertisements/addAdvertisement`) }}>
              Add Advertisement
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
        {loading ? (<OverlayLoading />) :
          (
            <div className="col-md-12">
              <div className="advertisement-data">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {advertisements?.map((advertisement) => {
                      return (
                        <div className="carousel-item active" key={advertisement?._id} onClick={() => navigate(`/advertisements/${advertisement?._id}`)}>
                          <img src={`${imageEndPoint}${advertisement?.image}`}
                            className="d-block w-100"
                            alt="Advertisement Image" />
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
          )}
      </div>
    </div>
  </>
}
