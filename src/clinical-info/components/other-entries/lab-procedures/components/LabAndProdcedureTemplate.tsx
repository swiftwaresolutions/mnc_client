import React from 'react'
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap'

const LabAndProdcedureTemplate = ({ onHide, show, templateNameList, selectedTemplateValue, handleSelectTemplate, hanldeMapTemplates, handleDeleteTemplate }: any) => {

    return (
        <Modal
            {...{ onHide, show }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Row className='justify-content-around w-100'>
                    <Col><Modal.Title id="contained-modal-title-vcenter">CHOOSE TEMPLATE </Modal.Title></Col>

                    <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
                </Row>
            </Modal.Header>
            {/* <Modal.Body className='vh-50'>
                <Form.Select  >
                    {templateNameList?.map((tempName: any, tempName_Idx: number) => (
                        <option key={tempName_Idx} value={tempName.id}>{tempName.templateName}</option>
                    ))}
                </Form.Select>
            </Modal.Body> */}
            <Modal.Body className='vh-50 overflow-hidden pb-5 mb-4'>
                <Row className='justify-content-center'>
                    <Col md="7">
                        <Row>
                            <Col>
                                <Form.Select onChange={(e) => handleSelectTemplate(`${e.target.value}`)} autoFocus onKeyDown={(e) => e.key == "Enter" ? hanldeMapTemplates() : null}>
                                    {templateNameList?.map((tempName: any, tempName_Idx: number) => (
                                        <option key={tempName_Idx} value={tempName.id}>{tempName.templateName}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col className='flex-grow-0 text-nowrap'>
                                <Button variant='outline-info' onClick={hanldeMapTemplates}>Add Template</Button>
                            </Col>
                            <Col className='flex-grow-0 text-nowrap'>
                                <Button variant='outline-danger' onClick={handleDeleteTemplate}>Delete Template</Button>
                            </Col>
                        </Row>

                    </Col>
                </Row>
                <Row className="overflow-auto mt-4 pb-4 h-100 d-block" >
                    <Table striped hover className='m-0'>
                        <thead className="table-dark sticky-top fs-11px" >
                            <tr >
                                <th className='w-50px'>CATEGORY</th>
                                <th>NAME</th>
                                <th>RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedTemplateValue?.map((order: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>{order.label == "I" ? "Inv" : "Lab"}</td>
                                        <td>{order.name}</td>
                                        <td>{order.rate}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default LabAndProdcedureTemplate