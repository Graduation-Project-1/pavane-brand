import Joi from 'joi'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authServices from '../../services/authServices';
import { authActions } from '../../store/auth-slice'
import './Login.scss'

export default function Login() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  })

  function getAdminData(e) {
    let newAdminData = { ...adminData }
    newAdminData[e.target.name] = e.target.value
    setAdminData(newAdminData)
  }

  function loginValidation(adminData) {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string().required().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).messages({
        "string.base": "please enter a valid password",
        "any.required": "password must be entered",
        "string.empty": "password cannot be empty",
        "string.pattern.base": "Wrong Password"
      })
    });
    return schema.validate(adminData, { abortEarly: false });
  }

  async function loginHandler(e) {
    e.preventDefault();
    setErrorList([]);
    let validationResult = loginValidation(adminData);
    setLoading(true);
    if (validationResult.error) {
      setLoading(false);
      setErrorList(validationResult.error.details);
    } else {
      setLoading(true);
      try {
        const { data } = await authServices.login(adminData)
        if (data.message === "Success") {
          setLoading(false);
          dispatch(
            authActions.login({
              AdminToken: data.token
            })
          );
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return <>
    <div className="row">
      <div className="col-md-12">
        <div className="login">
          <div className="login-card">
            <h3>Sign In</h3>
            <p>Log in to your account to continue.</p>
            {
              errorMessage ?
                (<div className="alert alert-danger myalert">
                  {errorMessage}
                </div>) : ""
            }
            {
              errorList.map((err, index) => {
                return (
                  <div key={index} className="alert alert-danger myalert">
                    {err.message}
                  </div>
                )
              })
            }
            <form onSubmit={loginHandler}>
              <label htmlFor="email">Email</label>
              <input
                onChange={getAdminData}
                className='form-control login-input'
                type="email"
                name="email"
                id="email"
              />
              <label htmlFor="password">Password</label>
              <input
                onChange={getAdminData}
                className='form-control login-input'
                type="password"
                name="password"
                id="password"
              />
              <button className='login-button'>
                {loading ?
                  (<i className="fas fa-spinner fa-spin "></i>)
                  : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}
