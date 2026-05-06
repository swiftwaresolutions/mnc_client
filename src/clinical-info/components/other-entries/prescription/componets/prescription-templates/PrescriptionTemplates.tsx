import React, { useEffect, useState } from 'react'
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap'

const PrescriptionTemplates = ({ templateNameList, templateSelectedValue, hanldeGetSelectedTemplateDetails, setTemplateSelectedValue, onHide, show, handleMapTemplate,selTemplateName, handleChangeTemplateName, handleDeleteTemplate }: any) => {
    const [status , setStatus] = useState(false)
    console.log("selTemplateName", selTemplateName)
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
                                    <Button variant='outline-info' onClick={handleMapTemplate}>Add Template</Button>
                                </Col>
                                <Col className='flex-grow-0 text-nowrap'>
                                    <Button variant={status ? 'outline-primary' : 'outline-danger'} onClick={(e) => setStatus(!status)}>{status ? "Back" : "Edit Template"}</Button>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    { !status &&
                    <Row className="patientlist_table d-block" >
                        <Table striped hover>
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
                                    templateSelectedValue?.map((medicine: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{medicine.genName}</td>
                                            <td>{medicine.medName}</td>
                                            <td>{medicine.quantity}</td>
                                            <td>{medicine.unit}</td>
                                            <td>{medicine.timing} </td>
                                            <td>{medicine.routeId == 0 ? "None" : medicine.route} </td>
                                            <td>{medicine.instructionId == 0 ? "None" : medicine.instruction} </td>
                                            <td>{medicine.duration}</td>
                                            <td>{medicine.period}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </Table>

                    </Row>
                    }
                    { status && selTemplateName &&
                    <Row className='mt-5 border p-3 rounded'>
                        <Col>
                            
                            <Row className="w-100 justify-content-center">
                                <Col xs={12} md={6}>
                                    <Form.Group className="d-flex justify-content-center align-items-center">
                                        <Form.Label className="me-2 mb-0 w-50">Template Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={selTemplateName?.templateName} 
                                            onChange={(e) => handleChangeTemplateName(e.target.value, 'templateName')}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="w-100 justify-content-center mt-3">
                                <Col xs={12} md={6}>
                                    <Form.Group className="d-flex justify-content-start align-items-center">
                                        <Form.Label className="me-2 mb-0 w-50" htmlFor='isValid'>Block</Form.Label>
                                        <Form.Check 
                                            type="checkbox" name='isValid' id = 'isValid'
                                            onChange={(e) => handleChangeTemplateName(e.target.checked, 'isValid')}
                                            checked={selTemplateName?.isValid ===1 ? false : true} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex justify-content-end'>
                                    <Button onClick={() => {handleDeleteTemplate(); setStatus(false); onHide()}}>Update</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default PrescriptionTemplates