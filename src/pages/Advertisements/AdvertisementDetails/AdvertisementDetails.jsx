import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OverlayLoading from '../../../components/OverlayLoading/OverlayLoading'
import advertisementServices from '../../../services/advertisementServices'
import toastPopup from '../../../helpers/toastPopup'
import imageEndPoint from '../../../services/imagesEndPoint'
import './AdvertisementDetails.scss'

export default function AdvertisementDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [advertisement, setAdvertisement] = useState({})
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false)

  async function getAdvertisementByIdHandler() {
    setLoading(true)
    try {
      const { data } = await advertisementServices.getAdvertisementById(params?.id);
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setLoading(false);
        setAdvertisement(data?.Data)
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function deleteAdvertisementHandler() {
    setLoading(true)
    try {
      const { data } = await advertisementServices.deleteAdvertisement(params?.id)
      setLoading(true)
      if (data?.success && data?.status === 200) {
        setModalShow(false)
        setLoading(false);
        navigate(`/advertisements`)
        toastPopup.success("Advertisement deleted successfully")
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function addToArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await advertisementServices.addToArchive(params?.id)
      setArchiveLoading(false);
      getAdvertisementByIdHandler()
      toastPopup.success("Advertisement added to archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  async function removeFromArchiveHandler() {
    setArchiveLoading(true)
    try {
      const { data } = await advertisementServices.removeFromArchive(params?.id)
      setArchiveLoading(false);
      getAdvertisementByIdHandler()
      toastPopup.success("Advertisement removed from archive successfully")
    } catch (e) {
      setLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    getAdvertisementByIdHandler()
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
          <div onClick={() => { deleteAdvertisementHandler() }}
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
          <button className='back' onClick={() => { navigate(`/advertisements`) }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img src={`${imageEndPoint}${advertisement?.image}`}
              alt="Advertisement Image" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="data">
            <div className="row">
              <div className="col-md-12">
                <div className="actions">
                  <button onClick={() => { navigate(`/advertisements/${params?.id}/edit`) }}
                    className='edit btn btn-warning'>
                    Edit
                  </button>
                  {
                    advertisement?.isArchived ? (
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
            <h2>{advertisement?.name}</h2>
            <p><a target='_blank' href={advertisement?.link}>Adverisement Link</a></p>
            <p><span>Advertisor: </span>{advertisement?.creatorName}</p>
            <p><span>Start date: </span>{new Date(advertisement?.startDate).toDateString()}</p>
            <p><span>End date: </span>{new Date(advertisement?.endDate).toDateString()}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
