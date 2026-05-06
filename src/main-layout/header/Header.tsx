import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment, useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../login/state/loginSlice'
import clinicalConfig from '../../clinicalConfig'
import { RootState } from '../../state/store'
import Instruction from './Instruction'

const Header = ({ setSideView }: any) => {
    const dispatch = useDispatch()

    const [showNewModal, setShowNewModal] = useState(false)

    const loginData = useSelector((state: any) => state.loginData)
    const {organization}= useSelector((s:RootState)=>s.appReducer)
    const navigate = useNavigate()

    const handleLogOut = () => {
        dispatch(authLogout())
        navigate('/')
    }

    return (
        <Fragment>
            <Row className="py-3 flex-grow-0 align-items-center" style={{background:"#1093b8"}}>
            <Col className="text-white flex-grow-0">
                    <FontAwesomeIcon icon={faBars} className='fs-15px btn btn-outline-light' onClick={() => setSideView((pre: any) => !pre)} />
                </Col>
                <Col className='px-lg-5 fs-17px fw-bold text-white'>
                    {/* {clinicalConfig.hospitalFullName} */}
                    {organization.name}
                </Col>
                <Col className="text-white text-end">
                    <Row className='align-items-center'>
                        <Col>
                            <span className='align-middle px-4 curser-pointer text-uppercase fs-14px'>
                                {loginData?.name}
                                <span
                                    className="ms-2 badge bg-danger blink-new curser-pointer"
                                    onClick={() => setShowNewModal(true)}
                                >
                                    NEW
                                </span>
                            </span>
                            <Button variant='warning' onClick={() => handleLogOut()}>Log Out</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal size='lg' show={showNewModal} onHide={() => setShowNewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>INSTRUCTION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your content here */}
                    <Instruction />
                </Modal.Body>
            </Modal>
            <style>
                {`
                    @keyframes blinkNewBadge {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.2; }
                    }
                    .blink-new {
                        animation: blinkNewBadge 1s infinite;
                    }
                `}
            </style>
        </Fragment>
    )
}

export default Header