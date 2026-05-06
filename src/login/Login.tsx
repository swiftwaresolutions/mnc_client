import React, { Fragment, useState, useEffect } from 'react'
import { Col, Row, Form, Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { LoginApiService } from '../api/login/login-api-service'
import { useDispatch, useSelector } from 'react-redux'
import { StorageService } from '../api/storage/storageService'
import clinicalConfig from '../clinicalConfig'
import { saveLoginDataAction } from './state/loginSlice'
import { RootState } from '../state/store'
import { routerPathNames } from '../routes/routerPathNames'

const Login = () => {
  
  const loginUser = useSelector((s: RootState) => s.loginData);
  const {organization} = useSelector((s:RootState)=>s.appReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginApiService: LoginApiService = new LoginApiService()
  const storageService: StorageService = new StorageService();
  
  const [user, setUser] = useState({ userName: "", password: "" })
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setUser((pre: any) => ({ ...pre, [name]: value }))
  }

  const handleLogin = async (e: any) => {
    try {
      e.preventDefault();
      storageService.clearToken()
      const response = await loginApiService.loginUser(user)
      if (response?.success) {
        dispatch(saveLoginDataAction(response?.data))
        storageService.setToken(response?.data?.accessToken)
        navigate(routerPathNames.clinical.dashboard)
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (loginUser.authorized && storageService.getToken()) {
      navigate(routerPathNames.clinical.dashboard)
    }
  }, [loginUser]);

  return (
    <Fragment>
      <Container className='login_bg row  flex-column vh-100' fluid>
        <Row className='h-100 flex-column align-items-center' style={{backdropFilter:"blur(3px)"}}>
          <Col>
            <Row className=''>
              {/* <h1 className='text-info text-center py-4 letter-spacing-3px'>{clinicalConfig.hospitalFullName}</h1> */}
              <h1 className='text-info text-center py-4 letter-spacing-3px'>{organization.name}</h1>
              <h4 className='text-white text-center py-2 letter-spacing-3px'>CLINICAL INFORMATION</h4>
            </Row>
          </Col>
          <Col>
            <Row className=' login-container col pe-lg-5'>
              <Col className='p-0 h-100 row justify-content-center justify-content-lg-end align-items-center pe-lg-5'>
                <Form className='row login_form' onSubmit={(e) => handleLogin(e)}>
                  <Row className='h3  justify-content-center align-items-center text-info letter-spacing-3px'>
                    LOGIN
                  </Row>
                  <Form.Group className="row align-items-center">
                    <Row className='p-0  justify-content-center'>
                      <Form.Control type="text" placeholder="UserName" name='userName' className='w-75 ps-3' value={user?.userName} onChange={handleChange} autoFocus />
                    </Row>
                  </Form.Group>
                  <Form.Group className="row align-items-center" >
                    <Row className='p-0 justify-content-center'>
                      <Form.Control type="password" placeholder="Password" name='password' className='w-75 ps-3' value={user?.password} onChange={handleChange} />
                    </Row>
                  </Form.Group>
                  <Row className=' justify-content-center'>
                    <Col className='pt-3'>
                      <Row>
                        <Col className="text-danger text-center fs-15px">{errorMessage}</Col>
                        <Col className="flex-grow-0"><Button variant='success' className='px-4' type='submit' >Login</Button></Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container >
    </Fragment>
  )
}

export default Login
