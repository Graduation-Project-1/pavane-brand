import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth-slice'
import NavLogo from '../../assets/LOGO-01.png'
import './Navbar.scss'
import WelcomeImage from '../../assets/Welcome.jpg'
import brandServices from '../../services/brandServices';

export default function Navbar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [errorrMessage, setErrorMessage] = useState('')

  async function getBrandHandler() {
    try {
      const { data } = await brandServices.getBrand();
      if (data?.success && data?.status === 200) {
        setName(data?.Data?.name)
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.message);
    }
  }

  function logoutHandler() {
    localStorage.removeItem("AdminToken");
    dispatch(authActions.logout());
  }

  useEffect(() => {
    getBrandHandler()
  }, [])

  return <>
    <nav className="navbar navbar-expand-lg mynav">
      <div className="container-fluid">
        <a className="navbar-brand nav-logo" onClick={() => { navigate(`/admins`) }}>
          <img src={NavLogo} alt="Pavane" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link"><span>Welcome</span> {name}</a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <a className="nav-link" href="#"><span>Welcome</span> Ahmed Samir</a>
            </li> */}
            {/* <li className="nav-item welcome-image">
              <img src={WelcomeImage} alt="" />
            </li> */}
            <li className="nav-item" onClick={logoutHandler}>
              <a className="nav-link">Logout <i className="fa-solid fa-right-from-bracket"></i></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
}
