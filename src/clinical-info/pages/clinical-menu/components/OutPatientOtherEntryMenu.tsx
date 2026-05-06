import React from 'react'
import { Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { routerPathNames } from '../../../../routes/routerPathNames'

const menus = [
    {
        name: "PRESCRIPTION",
        color: "outline-primary",
        path: routerPathNames.clinical.prescription
    },
    {
        name: "LAB & PROCEDURES",
        color: "outline-primary",
        path: routerPathNames.clinical.labandprocedure
    },
    {
        name: "RADIOLOGY",
        color: "outline-primary",
        path: ""
    },
    {
        name: "ECG",
        color: "outline-primary",
        path: ""
    },
    {
        name: "EYE OPTOMETRY",
        color: "outline-primary",
        path: ""
    },
    {
        name: "COMMUNITY NOTES",
        color: "outline-primary",
        path: ""
    },
    {
        name: "DISCHARGE SUMMARY",
        color: "outline-primary",
        path: ""
    }
]

const OutPatientOtherEntryMenu = () => {
    const navigate = useNavigate()
    const onChangeSubmenu = (path: any) => {
        navigate(path);
    };
    return (
        <Col className='mt-5  row justify-content-center'>
            <Col md="8">
                <Col className=''>
                    <Button variant="primary" className=" mb-3 w-100">OTHER ENTRY</Button>
                </Col>
                {menus.map((item, idx) => (
                    <Col key={idx} className=''>
                        <Button variant={item.color} className={`mb-3 w-100 ${item.path=="" ? "d-none":""}`} onClick={() => onChangeSubmenu(item.path)}>{item.name}</Button>
                    </Col>
                ))}
            </Col>
        </Col>
    )
}
export default OutPatientOtherEntryMenu;
