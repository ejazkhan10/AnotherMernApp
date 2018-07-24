import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import jwt_decode from "jwt-decode";

// Action: Register User

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Action: Login User

export const LoginUser = UserData => dispatch => {
  axios
    .post("/api/users/login", UserData)
    .then(res => {
      //Save to localStorage
      const { token } = res.data;

      //console.log(res.data);

      localStorage.setItem("jwtToken", token);
      // Set token to off header
      setAuthToken(token);

      //Decode Token to get user data
      const decoded = jwt_decode(token);

      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Action: Set Logged in User
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Action:  Log user out

export const LogOutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  //Remove auth header for future requests
  setAuthToken(false);

  //Set Current user to {} wjich will set isAuthenticated to talse

  dispatch(setCurrentUser({}));
};
