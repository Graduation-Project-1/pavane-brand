import React from 'react'
import loadingSpinner from '../../assets/Spinner-2.gif'
import './OverlayLoading.scss'

export default function OverlayLoading() {
  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="spinner">
          <img src={loadingSpinner} alt="loading spinner" />
        </div>
      </div>
    </div>
  </>
}
