import { Col, Container, Row } from "react-bootstrap"
import Header from "./header/Header"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { Fragment, useState, useEffect } from "react"
import ClinicalOpSideMenu from "./side/ClinicalOpSideMenu"
import ClinicalIpSideMenu from "./side/ClinicalIpSideMenu"
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorHandling } from "../error/state/error-handle-action"
import { RootState } from "../state/store"
const MainLayout = () => {

    const { isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)

    const dispatch = useDispatch()

    const location = useLocation()

    const [sideView, setSideView] = useState<boolean>(true)

    const loginUser = useSelector((s: any) => s.loginData)

    useEffect(() => {
        dispatch(clearErrorHandling())
    }, [])

    return (
        <Fragment>
            {loginUser ? (
                <Row className='main-layout'>
                    <Header setSideView={setSideView} />
                    <Col className="px-0 overflow-auto flex-nowrap">
                        <Row className="h-100 overflow-hidden">
                            <Col className="main-layout-sidebar py-3" >
                                <Row className="shadow rounded overflow-auto h-100">
                                    <Col className="rounded pt-2">
                                        {isIp == 0 && <ClinicalOpSideMenu sideView={sideView} />}
                                        {isIp == 1 && <ClinicalIpSideMenu sideView={sideView} />}
                                    </Col>
                                </Row>
                            </Col>
                            <Col className=" px-0 main-layout-dashboard">
                                <Row className="shadow rounded overflow-hidden h-100">
                                    <Col className="h-100 rounded">
                                        <Outlet />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : (
                <Navigate to={`/`} state={{ from: location }} replace />
            )}
        </Fragment>
    )
}

export default MainLayout