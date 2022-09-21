import { PROFILE_ERROR, GET_PROFILE } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

import React from "react";

//Get current profile
export const getCurrentProfile = () => async (dispatch) => {
  console.log("get current profile");
  try {
    const res = await axios.get("/api/profile/me");
    console.log(
      "🚀 ~ file: profile.js ~ line 12 ~ getCurrentProfile ~ res",
      res
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
        token: error.response.token,
      },
    });
  }
};
