import React, { useEffect, useState } from 'react'
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap'

const PrescriptionTemplates = ({ templateNameList, templateSelectedValue, hanldeGetSelectedTemplateDetails, setTemplateSelectedValue, onHide, show, handleMapTemplate }: any) => {
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
                        <Col><Modal.Title id="contained-modal-title-vcenter">CHOOSE TEMPLATE </Modal.Title></Col>
                        {/* <Col className='text-center'><Button variant='outline-info'>Add Template</Button></Col> */}
                        <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
                    </Row>
                </Modal.Header>
                <Modal.Body className='vh-50 d-flex flex-column'>
                    <Row className='justify-content-center'>
                        {/* <Col>
                            <Form.Select onChange={(e) => hanldeGetSelectedTemplateDetails(e.target.value)} autoFocus onKeyDown={(e) => e.key == "Enter" ? handleMapTemplate() : null}>
                                {templateNameList?.map((temp: any, tempIdx: number) => (
                                    <option key={tempIdx} value={temp.id}>{temp.templateName}</option>
                                ))}
                            </Form.Select>
                        </Col> */}
                        <Col md="7">
                            <Row >
                                <Col>
                                    <Form.Select onChange={(e) => hanldeGetSelectedTemplateDetails(e.target.value)} autoFocus onKeyDown={(e) => e.key == "Enter" ? handleMapTemplate() : null} >
                                        {templateNameList?.map((temp: any, tempIdx: number) => (
                                            <option key={tempIdx} value={temp.id}>{temp.templateName}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col className='flex-grow-0 text-nowrap'>
                                    <Button variant='outline-info' onClick={()=>{handleMapTemplate();onHide()}}>Add Template</Button>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <Row className="patientlist_table d-block" >
                        <Table striped hover>
                            <thead className="table-dark sticky-top font-size-11px" >
                                <tr >
                                    <th>GENERIC NAME</th>
                                    <th>MEDICINE NAME</th>
                                    <th>QTY </th>
                                    <th>UNIT</th>
                                    <th>TIMING </th>
                                    <th>DURATION</th>
                                    <th>PERIOD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    templateSelectedValue?.map((medicine: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{medicine.genName}</td>
                                            <td>{medicine.medName}</td>
                                            <td>{medicine.quantity}</td>
                                            <td>{medicine.unit}</td>
                                            <td>{medicine.timing} </td>
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

export default PrescriptionTemplates