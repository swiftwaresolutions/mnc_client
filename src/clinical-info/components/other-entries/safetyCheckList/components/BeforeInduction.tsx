import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { beforeInductionData } from '../data/SafetyChecklistData'

const BeforeInduction = ({handleSafetyChecklist,tempData}:any) => {


  return (
    <>
      <Container className="d-flex flex-column h-100 p-3">

        <Row className='border h-100 border-black  py-3 rounded overflow-auto'>
        <Row className="form-check form-check-inline fs-5 text-center fw-bold">
             <span>With at least Nurse and Anaesthetist</span> 
          </Row>
          {
            beforeInductionData.map((item: any, i: number) => {
              return (
                <Row key={i}>
                  <Col md={6}>
                    <div className="form-check form-check-inline">
                      {item.content}
                    </div>
                  </Col>
                  <Col md={6}>
                  {
                    item.options.map((opt:any,idx:number)=>{
                      return(
                        <div className="form-check form-check-inline" key={idx}>
                        <input className="form-check-input" type="radio" name={item.fieldName}
                          id={opt.id}
                          checked={opt.name=='No'|| opt.name=='Not applicable'?tempData[item.fieldName]==0?true:false:tempData[item.fieldName]==0?false: true}
                          onChange={(e)=>{handleSafetyChecklist(e.target.name,opt.name)}}
                        />
                        <label className="form-check-label" htmlFor={opt.id}>{opt.name}</label>
                      </div>
                      )
                    })
                  }
                    
                  
                  </Col>
                </Row>
              )
            })
          }

        </Row>
      </Container>
    </>
  )
}

export default BeforeInduction