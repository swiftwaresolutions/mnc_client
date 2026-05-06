import { Fragment, useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./style/main_style.css"
import "./style/predefined.css"
import AppRouter from './routes/AppRouter'
import { useDispatch, useSelector } from "react-redux"

import { ToastContainer } from "react-toastify"
import { authLogout } from "./login/state/loginSlice"
import { routerBaseUrl } from "./clinicalConfig"
import { RootState } from "./state/store"
import { AppApiService } from "./api/app/app-api-service"
import { handleError } from "./utils/errorUtil"
import { setClinicalModuleDetails, setOrganizationDetails } from "./state/app-reducer/app-slice"

export default function App() {

  const appApiService: AppApiService = new AppApiService();

  const dispatch = useDispatch()

  const auth = useSelector((state: RootState) => state.loginData)

  const updateExpireTime = () => {
    const expireTime: number = Date.now() + 1000 * 60 * 60
    localStorage.setItem('expireTime', `${expireTime}`)
  };

  const getOrganizationDetails = async () => {
    try {
      const resData = await appApiService.fetchOrganizationDetails();
      
      if (!resData.name && !resData.code) {
        throw Error("no organization found");
      }
      dispatch(setOrganizationDetails(resData))
    } catch (error) {
      handleError(dispatch, error)
    }
  }
  const getClinicalModuleDetails = async () => {
    try {
      const resData: any[] = await appApiService.fetchClinicalModuleDetails();
      if (resData.length < 1) return;
      dispatch(setClinicalModuleDetails(resData));
    } catch (error) {
      handleError(dispatch, error)
    }
  }

  useEffect(() => {
    getOrganizationDetails();
    getClinicalModuleDetails();
  }, [])

  useEffect(() => {
    try {
      updateExpireTime()
      window.addEventListener('click', updateExpireTime)
      window.addEventListener('keypress', updateExpireTime)
      window.addEventListener('scroll', updateExpireTime)
      window.addEventListener('mousemove', updateExpireTime)
      window.addEventListener('keydown', updateExpireTime);

      const checkForInactivity = () => {
        const expireTime: number = Number(localStorage.getItem('expireTime'))
        if (auth.authorized === true && expireTime < Date.now()) {
          dispatch(authLogout())
          clearInterval(intervel)
          window.location.href = routerBaseUrl + "/"
        }
      }
      const intervel = setInterval(() => {
        checkForInactivity()
      }, 1000)
    } catch (error) {
      console.error(error)
    }

    return () => {
      window.removeEventListener('click', updateExpireTime)
      window.removeEventListener('keypress', updateExpireTime)
      window.removeEventListener('scroll', updateExpireTime)
      window.removeEventListener('mousemove', updateExpireTime)
      window.removeEventListener('keydown', updateExpireTime)
    }
  }, [auth])

  return (
    <Fragment>
      <ToastContainer />
      <AppRouter />
    </Fragment>
  )
}
