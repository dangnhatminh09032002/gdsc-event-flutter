import axios from "axios";

const fetch = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
  headers: {
    Accept: "application/json",
    Access_Control_Allow_Origin: "*",
  },
  withCredentials: true,
});

export default fetch;
