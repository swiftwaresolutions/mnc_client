import React from 'react'
import { Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { routerPathNames } from '../../../../routes/routerPathNames'

const menus = [
    {
        name: "GENERAL-1",
        color: "outline-success",
        path: routerPathNames.clinical.generalcasesheet
    },
    {
        name: "GENERAL-2",
        color: "outline-success",
        path: routerPathNames.clinical.directgeneralcasesheet
    },
    {
        name: "ANTENATAL",
        color: "outline-success",
        path: routerPathNames.clinical.antenatalcasesheet
    },
    {
        name: "ANTENATAL - 2",
        color: "outline-success",
        path: routerPathNames.clinical.antenatalcasesheet2
    },
    {
        name: "PAEDIATRIC",
        color: "outline-success",
        path: routerPathNames.clinical.pediatriccasesheet
    },
    {
        name: "OPHTHAL",
        color: "outline-success",
        path: ""
    },
    {
        name: "DENTAL",
        color: "outline-success",
        path: routerPathNames.clinical.dentalcasesheet
    },
    {
        name: "NEONATE",
        color: "outline-success",
        path: routerPathNames.clinical.neonate
    },
    {
        name: "DISEASE DIAGNOSIS",
        color: "outline-success",
        path: ""
    },
    {
        name: "VITALS",
        color: "outline-success",
        path: routerPathNames.clinical.vitals
    }
]

const OPWorkstationMenu = () => {
    const navigate = useNavigate();
    const onChangeSubmenu = (path: any) => {
        navigate(path);
    };
    return (
        <Col className='mt-5  row justify-content-center'>
            <Col md="8">
                <Col className=''>
                    <Button variant="success" className=" mb-3 w-100">OP WORK STATIONS</Button>
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
export default OPWorkstationMenu;
