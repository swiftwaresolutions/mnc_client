import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { beforeskinInsertion, beforeskinInsertionAnaesthetist, beforeskinInsertionNursing, beforeskinInsertionSurgen } from '../data/SafetyChecklistData'


const BeforeSkinInsection = ({handleSafetyChecklist,tempData}:any) => {
  return (
    <>
    <Container className="d-flex flex-column h-100 p-3">

        <Row className='border h-100 border-black  py-3 rounded overflow-auto'>
        <Row className="form-check form-check-inline fs-5 text-center fw-bold">
             <span>With Nurse, Anaesthetist and Surgeon</span> 
          </Row>
        
        {
            beforeskinInsertion.map((item: any, i: number) => {
              return (
                <Row  key={i}>
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
          <Row className="p-4">
          <Row className="form-check form-check-inline fs-5 text-center fw-bold">
             <span>Anticipated Critical Events</span> 
          </Row>

          <Row className="form-check form-check-inline fs-6 fw-bold ">
             <span>TO SURGON</span> 
          </Row>
          {
            beforeskinInsertionSurgen.map((item: any, i: number) => {
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
                          onChange={(e)=>{handleSafetyChecklist(e.target.name,opt.name)}}
                          checked={opt.name=='No'|| opt.name=='Not applicable'?tempData[item.fieldName]==0?true:false:tempData[item.fieldName]==0?false: true}
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
             <Row className="form-check form-check-inline fs-6 fw-bold ">
             <span>TO ANAESTHETIST </span> 
          </Row>
          {
            beforeskinInsertionAnaesthetist.map((item: any, i: number) => {
              return (
                <Row  key={i}>
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
                          onChange={(e)=>{handleSafetyChecklist(e.target.name,opt.name)}}
                          checked={opt.name=='No'|| opt.name=='Not applicable'?tempData[item.fieldName]==0?true:false:tempData[item.fieldName]==0?false: true}
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
           <Row className="form-check form-check-inline fs-6 fw-bold ">
             <span>TO NURSING TEAM</span> 
          </Row>
          {
            beforeskinInsertionNursing.map((item: any, i: number) => {
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
                        onChange={(e)=>{handleSafetyChecklist(e.target.name,opt.name)}}
                        checked={opt.name=='No'|| opt.name=='Not applicable'?tempData[item.fieldName]==0?true:false:tempData[item.fieldName]==0?false: true}
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
        </Row>

    </Container>
</>
  )
}

export default BeforeSkinInsection