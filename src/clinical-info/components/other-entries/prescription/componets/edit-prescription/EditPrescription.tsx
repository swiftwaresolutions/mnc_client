import React from 'react'
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap'
import { DateUtils } from '../../../../../../utils/dateUtils'


const EditPrescription = ({ show, onHide, previousPrescriptionNameList, previousPrescriptionSelectedValue, handlePreviousPrescrionSelected, handleMapEditMed }: any) => {

    return (
        <Container className="p-0">
            <Modal
                {...{ onHide, show }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Row className='justify-content-around w-100'>
                        <Col><Modal.Title id="contained-modal-title-vcenter">Edit Prescription </Modal.Title></Col>
                        <Col className='text-center'><Button variant='outline-info' onClick={() => handleMapEditMed()} disabled={previousPrescriptionSelectedValue.length == 0 ? true : false}>Edit Prescription</Button></Col>
                        <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
                    </Row>
                </Modal.Header>
                <Modal.Body className='vh-50 overflow-hidden pb-5 mb-4'>
                    <Row className='justify-content-center'>
                        <Col md="6">
                            <Form.Select onChange={(e) => handlePreviousPrescrionSelected(e.target.value)} >
                                {previousPrescriptionNameList?.filter((pres: any) => {
                                    if ((pres.isBilled != 1) || pres.displayNo == "SELECT PRESCRIPTION") {   // new Date().toJSON().split('T')[0] == pres?.date &&
                                        return true
                                    }
                                    return false
                                })?.sort((a: any, b: any) => b.displayNo - a.displayNo)?.map((pres: any, pres_Idx: number) => (
                                    <option key={pres_Idx} value={pres.displayNo}>{pres.date ? (new DateUtils(pres.date).dateFormat("DD-MM-YYYY") + " - ") : ""}{pres.displayNo} {` ${pres.doctorName ? pres.doctorName : " "}`}</option>
                                ))}
                                {/* {previousPrescriptionNameList?.sort((a: any, b: any) => b.displayNo - a.displayNo)?.map((pres: any, pres_Idx: number) => (
                                    <option key={pres_Idx} value={pres.displayNo}>{pres.date ? (new DateUtils(pres.date).dateFormat("DD-MM-YYYY") + " - ") : ""}{pres.displayNo}</option>
                                ))} */}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="overflow-auto mt-4 pb-4 h-100 d-block" >
                        <Table striped hover className='m-0'>
                            <thead className="table-dark sticky-top fs-11px" >
                                <tr >
                                    <th>GENERIC NAME</th>
                                    <th>MEDICINE NAME</th>
                                    <th>QTY </th>
                                    <th>UNIT</th>
                                    <th>TIMING </th>
                                    <th>ROUTE</th>
                                    <th>INSTRUCTION</th>
                                    <th>DURATION</th>
                                    <th>PERIOD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    previousPrescriptionSelectedValue?.map((medicine: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{medicine.genName}</td>
                                            <td>{medicine.medName}</td>
                                            <td>{medicine.quantity}</td>
                                            <td>{medicine.unit}</td>
                                            <td>{medicine.timing} </td>
                                            <td>{medicine.route ? medicine.route : "None"} </td>
                                            <td>{medicine.instruction ? medicine.instruction : "None"} </td>
                                            <td>{medicine.duration}</td>
                                            <td>{medicine.period}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>

                    </Row>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default EditPrescription