import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Container, Table } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import ClinicalNavigationButtons from '../../../../ClinicalNavigationButtons'
import { useNavigate } from 'react-router-dom'

const SavePreviewPrescription = ({ handleError, prescriptionApiService, show, onHide, savePrescriptionsData, setSavePrescriptionsData, isPrescriptionUpdated, setIsPrescriptionUpdated, setIsSave, setCommonDuration, generalInstruction }: any) => {
    const ExtraButton = [
        {
            color: "outline-warning",
            name: "Patient List",
            path: "/clinical/dashboard",

        },
        {
            color: "primary",
            name: "Edit Prescription",
            path: ""
        }
    ]
    const button = [
        {
            color: "outline-primary",
            name: "Prescription",
            path: ""
        },
        {
            color: "outline-primary",
            name: "Lab & Procedures",
            path: "",
        },
        {
            color: "outline-primary",
            name: "Radiology",
            path: "",
        },
        {
            color: "outline-primary",
            name: "ECG",
            path: "",
        },
        {
            color: "outline-primary",
            name: "Eye optometry",
            path: "",
        },
        {
            color: "outline-primary",
            name: "Community Notes",
            path: "",
        },
        {
            color: "outline-danger",
            name: "Laboratory View",
            path: "",
        },
        {
            color: "outline-danger",
            name: "Investigation View",
            path: "",
        },
        {
            color: "outline-danger",
            name: "Prescription View",
            path: "",
        },
        {
            color: "outline-danger",
            name: "CaseSheet View",
            path: "",
        },
        {
            color: "outline-danger",
            name: "Visit Details",
            path: "",
        },
        {
            color: "outline-success",
            name: "General",
            path: "",
        },
        {
            color: "outline-success",
            name: "Antental",
            path: "",
        },
        {
            color: "outline-success",
            name: "Pediatric",
            path: "",
        },
        {
            color: "outline-success",
            name: "Ophthal",
            path: "",
        },
        {
            color: "outline-success",
            name: "Dental",
            path: "",
        },
    ]
    const navigate = useNavigate()
    const navigateRoute = (path: string, name: string) => {
        if (name == "Edit Prescription") {
            setIsPrescriptionUpdated((pre: any) => ({ ...pre, status: false }))
            setCommonDuration({ number: 0, duration: 0 })
            setIsSave(false)
            onHide()
            return
        }
        navigate(path)
    };

    const handleOnBlurNotes = async (id: number, index: number) => {
        try {
            const notes = savePrescriptionsData[index].notes
            if (notes) {
                await prescriptionApiService.updatePrescriptionDetailsNotes(id,notes)
            }
        } catch (error) {
            handleError(error)
        }
    }
    const handleOnChangeNotes = async (e: React.ChangeEvent, prod: any, index: number) => {
        const { value } = e.target as HTMLInputElement
        let newSavePrescriptionsData = [...savePrescriptionsData]
        newSavePrescriptionsData[index] = { ...prod, notes: value }
        setSavePrescriptionsData(newSavePrescriptionsData)
    }
    console.log("savePrescriptionsData", savePrescriptionsData)

    return (
        <Modal
            {...{ onHide, show }}
            aria-labelledby="contained"
            centered
            dialogClassName="modal-90w modal-content-height-100"
        >
            <Modal.Header>
                <Row className='justify-content-around w-100'>
                    <Col><Modal.Title id="contained-modal " className='fw-bold'>PRESCRIPTION SAVED</Modal.Title></Col>
                    <Col className='text-center fs-4 text-success fw-bold'>PRESC NO : {isPrescriptionUpdated.id}</Col>
                    <Col className='flex-grow-0 text-end'><Button variant='danger' className='py-1' onClick={onHide}>X</Button></Col>
                </Row>
            </Modal.Header>
            <Container>
                <Row className="mt-1 d-block vh-50 shadow overflow-auto" >
                    <Table striped hover>
                        <thead className="table-dark sticky-top fs-11px" >
                            <tr>
                                <th>Sl.No</th>
                                <th >MEDICINE NAME</th>
                                {/* <th>QUANTITY</th> */}
                                {/* <th>FREQUENCY</th> */}
                                <th>UNIT</th>
                                <th>DOSE </th>
                                <th>ROUTE</th>
                                <th>INSTRUCTION</th>
                                <th>DURATION</th>
                                <th className='text-center'>TOTAL NO.</th>
                                <th className='text-center'>NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                savePrescriptionsData.filter((prod: any) => prod.isOwn != 1).map((prod: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className='w-30px ps-3'>{idx + 1}</td>
                                        <td className='w-200px'>{prod.prodName}</td>
                                        {/* <td className='w-75px'>{prod.quantity}</td> */}
                                        {/* <td className='w-50px'>{prod.timingName}</td> */}
                                        <td className='w-50px'>{prod.unit}</td>
                                        <td className='w-75px min-w-100px'>{prod.timingUnits == "0-0-0-0" ? prod.timingName : prod.timingUnits} </td>
                                        <td className='w-75px min-w-75px'>{prod.route ? prod.route : "None"} </td>
                                        <td className='w-75px min-w-75px'>{prod.instruction ? prod.instruction : "None"} </td>
                                        <td className='w-75px min-w-75px'>{`${Number(prod.prescriptionDuration)} ${prod.configDurationName ? prod.configDurationName : ""}`}</td>
                                        <td className='text-center w-75px min-w-75px'>{prod.totalNo}</td>
                                        <td >
                                            <Form.Control onChange={(e) => { handleOnChangeNotes(e, prod, idx) }} onBlur={() => handleOnBlurNotes(prod.id, idx)} className='w-100' size='sm' placeholder='Notes' value={prod.notes?prod.notes:""} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    {generalInstruction &&
                        <div className='my-3'>
                            <span className='fw-bold'>General Instructions: </span>
                            <span>{generalInstruction}</span>
                        </div>
                    }
                    
                </Row>

                {/* <Row className='my-4'>
                    {ExtraButton.map((data: any, idx: any) => (
                        <Col md={2} key={idx}>
                            <Button variant={data.color} className="w-100 m-1" onClick={() => navigateRoute(data.path, data.name)}>{data.name}</Button>
                        </Col>
                    ))}
                    {button.filter((data: any) => data.name != "Prescription").map((data: any, idx: any) => (
                        <Col md={2} key={idx}>
                            <Button variant={data.color} className="w-100 m-1" onClick={() => navigateRoute(data.path, data.name)}>{data.name}</Button>
                        </Col>
                    ))}
                </Row> */}
            </Container>
        </Modal>
    )
}

export default SavePreviewPrescription


