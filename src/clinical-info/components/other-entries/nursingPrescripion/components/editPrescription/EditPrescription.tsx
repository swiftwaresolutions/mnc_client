import React from 'react'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'

const EditPrescription = ({ show, onHide, previousPrescriptionNameList, handlePreviousPrescrionSelected,handleCurPresEdit, previousPrescriptionSelectedValue }: any) => {
 
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
                        <Col><Modal.Title id="contained-modal-title-vcenter" >Edit Prescription </Modal.Title></Col>
                        <Col className='text-center'><Button variant='outline-info' onClick={()=>{handleCurPresEdit();onHide()}}>Edit Prescription</Button></Col>
                        <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
                    </Row>
                </Modal.Header>
                <Modal.Body className='vh-50 overflow-hidden pb-5 mb-4'>
                    <Row className='justify-content-center'>
                        <Col md="6">
                            <Form.Select onChange={(e) => handlePreviousPrescrionSelected(e.target.value)} >
                                <option key='001' value='x01'>SELECT PRESCRIPTION</option>
                                {previousPrescriptionNameList?.filter((pres: any) => {
                                    if ((pres.isBilled != 1) || pres.displayNo == "SELECT PRESCRIPTION") {   // new Date().toJSON().split('T')[0] == pres?.date &&
                                        return true
                                    }
                                    return false
                                })?.map((pres: any, pres_Idx: number) => (
                                    <option key={pres_Idx} value={pres.displayNo}>{pres.displayNo}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="overflow-auto mt-4 pb-4 h-100 d-block" >
                        <Table striped hover className='m-0'>
                            <thead className="table-dark sticky-top font-size-11px" >
                                <tr >
                                    <th>GENERIC NAME</th>
                                    <th>MEDICINE NAME</th>
                                    <th>QTY </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    previousPrescriptionSelectedValue?.map((medicine: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{medicine.genName}</td>
                                            <td>{medicine.medName}</td>
                                            <td>{medicine.quantity}</td>

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