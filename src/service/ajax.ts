import axios, { AxiosInstance } from 'axios'
import store from "../store";
import { useRouter } from "vue-router";

function digital2Number(num: (number | string)) {
  return ('0' + num).slice(-2);
}

export default function ajax (url: string, method: string = 'get', data: any, isLoading: boolean = false) {
  const nowDate = new Date();
  const dateTime = `${nowDate.getFullYear()}-${digital2Number(nowDate.getMonth() + 1)}-${digital2Number(nowDate.getDate())} ${digital2Number(nowDate.getHours())}:${digital2Number(nowDate.getMinutes())}:${digital2Number(nowDate.getSeconds())}`;
  
  return new Promise((resolve, reject) => {
    if(isLoading) store.commit('setLoadingStatus', true);
    let headers = Object.assign({
      'Content-Type': 'application/json',
      dateTime
      // 'timeZoneCode': Math.round(new Date().getTimezoneOffset() / 60),
    }, store.getters.gUserToken ? {Authorization: `Bearer ${store.getters.gUserToken}` }:{});
    const instance: AxiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      headers,
      // withCredentials: true,
      timeout: 8000,
    })

    const applayInstance = method === 'get'
      ? instance.get
      : method === 'post'
        ? instance.post
        : method === 'put'
          ? instance.put
          : instance.delete 

    applayInstance(url, data)
      .then((res: any) => {
        resolve(res);
      })
      .catch(function(err) {
        reject(err);
      })
      .finally(()=>{
        if(isLoading) store.commit('setLoadingStatus', false);
      })
  })
}