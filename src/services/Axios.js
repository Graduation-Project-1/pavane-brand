import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import endPoint from "./endPoint";
import { authActions } from "../store/auth-slice";
import store from "../store";

const baseURL = endPoint;

const Axios = axios.create({ baseURL });
Axios.defaults.baseURL = endPoint;

Axios.interceptors.request.use(async (req) => {
  //don't check the token in login
  if (req.url === "loginBrand") {
    console.log("loggingig on");
    return req;
  }

  //auth state from redux 
  let auth = store.getState().auth;

  //decode token  
  const token = jwt_decode(auth.AdminToken);

  console.log("itercepting the request", token);
  //check token expiry in javascript time in milli seconds
  const isTokenExpired = dayjs.unix(token.exp).diff(dayjs()) <= 1;

  //if token is not expired attach it to request
  if (!isTokenExpired) {
    console.log("token not expired");
    req.headers.Authorization = `Bearer ${auth.AdminToken}`;
    return req;
  }

  // if token is expired destroy localStorage and log the user out 

  if (isTokenExpired) {
    console.log(req, "expired token");
    localStorage.removeItem("AdminToken");
    store.dispatch(authActions.logout());

    return Promise.reject("you are unautherised");
  }
});

export default Axios;