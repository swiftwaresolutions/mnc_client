import React from 'react'
import { Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { routerPathNames } from '../../../../routes/routerPathNames'

const menus = [
    {
        name: "LABORATORY RESULTS",
        color: "outline-danger",
        path: ""
    },
    {
        name: "INVESTIGATION RESULTS",
        color: "outline-danger",
        path: ""
    },
    {
        name: "PRESCRIPTION DETAILS",
        color: "outline-danger",
        path: ""
    },
    {
        name: "CASESHEET DETAILS",
        color: "outline-danger",
        path: ""
    },
    {
        name: "VISIT DETAILS",
        color: "outline-danger",
        path: routerPathNames.clinical.viewdetails
    },
    {
        name: "CLINICAL REPORT",
        color: "outline-danger",
        path: routerPathNames.clinical.clinicalReport
    }
]

const OutPatientReportMenu = () => {
    const navigate = useNavigate()
    const onChangeSubmenu = (path: any) => {
        navigate(path);
    };
    return (
        <Col className='mt-5  row justify-content-center'>
            <Col md="8">
                <Col className=''>
                    <Button variant="danger" className=" mb-3 w-100">REPORTS</Button>
                </Col>
                {menus.map((item, idx) => (
                    <Col key={idx} >
                        <Button variant={item.color} className={`mb-3 w-100 ${item.path=="" ? "d-none":""}`} onClick={() => onChangeSubmenu(item.path)}>{item.name}</Button>
                    </Col>
                ))}
            </Col>
        </Col>
    )
}
export default OutPatientReportMenu;
