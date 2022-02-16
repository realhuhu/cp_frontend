import {api_url} from "./settings";
import ajax from "axios";

let api = ajax.create({
  baseURL: api_url,
  timeout: 5000,
})


api.interceptors.request.use(
  config => {
    const token = document.cookie.match(/token=(.*?)(;|$)/)
    token && (config.headers.Authorization = token[1]);
    return config;
  },
  error => Promise.error(error)
)

export default {
  api,
  ajax
}