import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'

const NursingIoEditModal = ({ show, onHide, NurseIoData ,selectData, setSelectData,setTempNurseIo,handleInCount,handleOutCount,setBtnView,handleEditRecords}: any) => {
    const [selectId,setSelectId]=useState(0)
    const handleSelect = (value: any) => {
        if (value != 'defaut') {
            setSelectData(NurseIoData.filter((obj: any) => { return obj.id == value }))
            setSelectId(value)
        }
    }

    return (
        <Modal
            {...{ show, onHide }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Col className='text-start'><Modal.Title id="contained-modal-title-vcenter">Edit Nursing IO sheet</Modal.Title></Col>
                
                <Col className='text-end'><Button variant='danger' onClick={onHide}>close</Button></Col>
            </Modal.Header>
            <Modal.Body>
                <Row className='justify-content-center m-2'>
                    <Col md={6}>

                        <Form.Select onChange={(e => { handleSelect(e.target.value) })}>
                            <option key={1} value={'default'}>select</option>
                            {
                                NurseIoData.map((obj: any, idx: number) => {
                                    return (
                                        <option key={idx} value={obj.id}>{`${new DateUtils(obj.nurseDtmIo).dateFormat("DD-MM-YYYY")}-${new DateUtils(obj.nurseDtmIo).timeFormat("HH:MM")}`}</option>
                                    )
                                })
                            }

                        </Form.Select>
                    </Col>
                   
                </Row>
                <Row>
                    <Table>
                        <thead className=" " >
                            <tr className='text-center'>
                                <th ></th>
                                <th ></th>
                                <th colSpan={4}>INTAKE</th>
                                <th colSpan={4}>OUTPUT</th>
                            </tr>
                            <tr >
                                <th >S.No</th>
                                <th >DATE/TIME</th>
                                <th >ORAL</th>
                                <th >IVF</th>
                                <th >OTHER</th>
                                <th >TOTAL</th>
                                <th >URINE</th>
                                <th >DRAIN</th>
                                <th >OTHER</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className='table table-bordered'>
                            {
                                selectData?.map((obj: any, i: number) => {
                                    return (
                                        <tr className="fs-9px px-2" key={i}>
                                            <td className="max-w-50px w-50px ">{i + 1}</td>
                                            <td className="max-w-150px w-150px"><span >{`${new DateUtils(obj.nurseDtmIo).dateFormat("DD-MM-YYYY")}-${new DateUtils(obj.nurseDtmIo).timeFormat("HH:MM")}`}</span></td>
                                            <td className="max-w-100px w-100px">{obj.oral}  {obj.oral ? 'ml' : ''}-{obj.oralDetails}</td>
                                            <td className="max-w-100px w-100px">{obj.ivf} {obj.ivf ? 'ml' : ''}-{obj.ivfDetails}</td>
                                            <td className="max-w-100px w-100px">{obj.inOther} {obj.inOther ? 'ml' : ''}-{obj.inOtherDetails}</td>
                                            <td className="max-w-50px w-50px"><span className='text-danger fw-bold'>{obj.inTotal}</span></td>

                                            <td className="max-w-100px w-100px">{obj.urine} {obj.urine ? 'ml' : ''}-{obj.urineDetails}</td>
                                            <td className="max-w-100px w-100px" >{obj.drain} {obj.drain ? 'ml' : ''}-{obj.drainDetails}</td>
                                            <td className="max-w-100px w-100px">{obj.outOther} {obj.outOther ? 'ml' : ''}-{obj.outOtherDetails}</td>
                                            <td className="max-w-50px w-50px"><span className='text-danger fw-bold'>{obj.outTotal}</span></td>

                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </Table>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                 <Col className='text-center'><Button variant='outline-info' onClick={()=>{handleEditRecords(selectId); onHide()}}>Edit IO Chart</Button></Col>
            </Modal.Footer>
        </Modal>
    )
}

export default NursingIoEditModal