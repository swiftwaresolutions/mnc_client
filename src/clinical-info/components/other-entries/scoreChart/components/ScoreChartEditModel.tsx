import React from 'react'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'

const ScoreChartEditModel = ({show,onHide,prevScoreChart,handlePreviousScoreChart,setBtnView,setSelectId}:any) => {

    const handleId=(e:any)=>{
        if(e.target.value=='default'){
            setSelectId(0);
        }
        else{
            setSelectId(e.target.value);
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
    
                            <Form.Select onChange={(e:any)=>{handleId(e)}} >
                                <option key={1} value={'default'}>select</option>
                              {
                                prevScoreChart?.map((obj:any,i:number)=>{
                                    return(
                                        <option key={i+3} value={obj.id}>{obj.dtm}</option>
                                    )
                                })
                              }
    
                            </Form.Select>
                        </Col>
                       
                    </Row>
                   
                </Modal.Body>
                <Modal.Footer>
                <Col className='text-center'onClick={()=>{handlePreviousScoreChart(); onHide()}}><Button variant='outline-info'>Edit Score Chart</Button></Col>
    
                </Modal.Footer>
            </Modal>
      )
}

export default ScoreChartEditModel