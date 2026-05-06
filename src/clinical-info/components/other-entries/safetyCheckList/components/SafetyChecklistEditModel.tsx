import React from 'react'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'

const SafetyChecklistEditModel = ({show,onHide,ChklistData,setSelectId,handlePreviousChecklistEdit,setBtnView}:any) => {

    const handleCheckListEdit=(e:any)=>{
        let id=e.target.value
        if(id!="default"){
            setSelectId(id)
        }
        else{
            setSelectId(0)
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
                <Col className='text-start'><Modal.Title id="contained-modal-title-vcenter">Edit Surgery checklist </Modal.Title></Col>
                
                <Col className='text-end'><Button variant='danger' onClick={onHide}>close</Button></Col>
            </Modal.Header>
            <Modal.Body>
                <Row className='justify-content-center m-2'>
                    <Col md={6}>

                        <Form.Select onChange={(e)=>{handleCheckListEdit(e)}} >
                            <option key={1} value={'default'}>select</option>
                            {
                                ChklistData.map((obj: any, idx: number) => {
                                    return (
                                        <option key={idx} value={obj.id}>{obj.surgName}</option>
                                    )
                                })
                            }

                        </Form.Select>
                    </Col>
                   
                </Row>
               
            </Modal.Body>
            <Modal.Footer>
            <Col className='text-center'><Button variant='outline-info' onClick={()=>{handlePreviousChecklistEdit(); onHide();setBtnView({save:0})}}>Edit  Check List</Button></Col>

            </Modal.Footer>
        </Modal>
  )
}

export default SafetyChecklistEditModel