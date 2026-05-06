import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { intake, output } from '../data/NursingIoData'
import NursingIoEditModal from './NursingIoEditModal'

const NursingSheet = ({ handleNurseIo, setTempNurseIo,handleNurseIoIntegers, tempNurseIo, NurseIoData,setModalShow ,setSelectData,selectData,setBtnView ,handleInCount,handleOutCount,handleEditRecords,intCount,setintCount,modalShow}: any) => {
    return (
        <>
            <Container className="d-flex flex-column h-100 p-3">

                <Row className='border h-100 border-black  py-3 rounded overflow-auto'>
                    <Row className='m-2 ioSheet-event'>
                        <Row className='m-2'>
                            <Col className=' text-center' md={7}><span className='fw-bold'>INTAKE</span></Col>
                            <Col className="">
                                <Row>
                                    <Col>
                                        <Form.Group className=" general-case-sheet-input">
                                            <Form.Control type="datetime-local" name='nurseDtmIo' id='nurseDtmIo' value={tempNurseIo.nurseDtmIo} onChange={(e) => { handleNurseIo(e.target.name, e.target.value) }} />
                                            <label htmlFor="nurseDtmIo" className="">
                                                Date
                                            </label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Button variant='secondary' onClick={() => setModalShow(true)} className='w-100' size='sm' title="Edit Records" >EDIT RECORDS</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {
                            intake.map((obj: any, i: number) => {
                                return (
                                    <Row key={i}>
                                        <Col md={3}>

                                            <Form.Group className="mb-3 general-case-sheet-input"   >
                                                <Form.Control
                                                    type='number'
                                                    name={obj.iId}
                                                    id={obj.iId}
                                                    value={Number(tempNurseIo[obj.iId])}
                                                    onChange={(e) => { handleNurseIoIntegers(e.target.name, e.target.value) }}
                                                    onBlur={handleInCount}
                                                />
                                                <label className="fs-11px">{obj.intake}</label>
                                            </Form.Group>
                                        </Col>
                                        <Col md={9}>

                                            <Form.Group className="mb-3 general-case-sheet-input"   >
                                                <Form.Control
                                                    name={obj.idetId}
                                                    id={obj.idetId}
                                                    value={tempNurseIo[obj.idetId]}
                                                    onChange={(e) => { handleNurseIo(e.target.name, e.target.value) }}
                                                />
                                                <label className="fs-11px">{obj.indet}</label>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                            })
                        }

                        <Row >
                            <Col md={3}>
                                <Form.Group className="mb-3 general-case-sheet-input"   >
                                    <Form.Control
                                        name='inTotal'
                                        id='inTotal'
                                        value={intCount?.intotal}
                                        onChange={(e) => { handleNurseIo(e.target.name, e.target.value) }}
                                        disabled
                                    />
                                    <label className="fs-11px">TOTAL</label>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Row>
                    <Row className=' ioSheet-event'>
                        <Row className='m-2'>
                            <Col className=' text-center' md={7}><span className='fw-bold'>OUTPUT</span></Col>
                            <Col className="">
                            </Col>
                        </Row>

                        {
                            output.map((obj: any, i: number) => {
                                return (
                                    <Row key={i}>
                                        <Col md={3}>

                                            <Form.Group className="mb-3 general-case-sheet-input"   >
                                                <Form.Control
                                                    name={obj.iId}
                                                    id={obj.iId}
                                                    type='number'
                                                    value={Number(tempNurseIo[obj.iId])}
                                                    onChange={(e) => { handleNurseIoIntegers(e.target.name, e.target.value) }}
                                                    onBlur={handleOutCount}
                                                />
                                                <label className="fs-11px">{obj.intake}</label>
                                            </Form.Group>
                                        </Col>
                                        <Col md={9}>

                                            <Form.Group className="mb-3 general-case-sheet-input"   >
                                                <Form.Control
                                                    name={obj.idetId}
                                                    id={obj.idetId}
                                                    value={tempNurseIo[obj.idetId]}
                                                    onChange={(e) => { handleNurseIo(e.target.name, e.target.value) }}
                                                />
                                                <label className="fs-11px">{obj.indet}</label>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                            })
                        }

                        <Row >
                            <Col md={3}>
                                <Form.Group className="mb-3 general-case-sheet-input"   >
                                    <Form.Control
                                        name='outTotal'
                                        id='outTotal'
                                        onChange={(e) => { handleNurseIo(e.target.name, e.target.value) }}
                                        value={intCount?.outTotal}
                                        disabled
                                    />
                                    <label className="fs-11px">TOTAL</label>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Row>
                </Row>
            </Container>
            <NursingIoEditModal
                NurseIoData={NurseIoData}
                setSelectData={setSelectData}
                selectData={selectData}
                
                handleEditRecords={handleEditRecords}
                show={modalShow}
                onHide={() => {setModalShow(false) ; setSelectData([]) }}
            />
        </>
    )
}

export default NursingSheet