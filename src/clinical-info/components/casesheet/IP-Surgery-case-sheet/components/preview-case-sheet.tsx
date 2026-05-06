import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const PreviewPediatricCaseSheet = ({ savedCaseSheet }: any) => {
  let savedCaseSheetDatails = savedCaseSheet
  console.log(savedCaseSheetDatails);

  let surgon =savedCaseSheetDatails?.surgerySurgonData

  let nursedata=savedCaseSheetDatails?.surgeryNurseData

  const consultant=surgon.filter((item:any)=>{
   return(item.isAssSurgon==0)
  })
 const Assconsultant=surgon.filter((item:any)=>{
   return(item.isAssSurgon==1)
  })
 const nurse=nursedata.filter((item:any)=>{
  return(item.isAssNurse==0)
 })
 const assNurse=nursedata.filter((item:any)=>{
  return(item.isAssNurse==1)
 })
  
  return (
    <Fragment>
      <Container>


        <Row >
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgeryDataList?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>SURGERY NAME</Col>
            </Row>
            {
              savedCaseSheetDatails?.surgeryDataList?.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.surgeryName}</Col>
                </Row>))
            }
          </Col>
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.anestDoc?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>ANESTHESIOLOGIST</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.anestDoc}</Col>
            }
          </Col>
        </Row>
        <Row className=''>
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgerySurgonData?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>SURGEON NAME</Col>
            </Row>
            {
              consultant.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.name}</Col>
                </Row>))
            }
          </Col>
          <Col className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgerySurgonData?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>ASSISTANT SURGEON NAME</Col>
            </Row>
            {
              Assconsultant.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.name}</Col>
                </Row>))
            }
          </Col>
        </Row>
        <Row className=''>
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgeryNurseData?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>NURSE NAME</Col>
            </Row>
            {
              nurse.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.nurse}</Col>
                </Row>))
            }
          </Col>
          <Col className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgeryNurseData?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>ASSISTANT NURSE NAME</Col>
            </Row>
            {
              assNurse.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.nurse}</Col>
                </Row>))
            }
          </Col>
        </Row>
        <Row className=''>
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.preOtDiagnosis?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>PRE-OPRATIVE DIAGNOSIS</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.preOtDiagnosis}</Col>
            }
          </Col>
          <Col className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.postOtDiagnosis?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>POST-OPRATIVE DIAGNOSIS</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.postOtDiagnosis}</Col>
            }
          </Col>
        </Row>
        <Row className=''>
          <Col md={6} className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.surgeryDate?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>SURGERY DATE</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.surgeryDate}</Col>
            }
          </Col>
          <Col className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.durSurgery?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>DURATION OF SURGERY</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.durSurgery}</Col>
            }
          </Col>
        </Row>
        <Row className=''>
          <Col  className={`fw-bold py-2 fs-5 ${savedCaseSheetDatails?.procedureNotes?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>PROCEDURE NOTES</Col>
            </Row>
            {
             <Col className='fw-normal'>{savedCaseSheetDatails?.procedureNotes}</Col>
            }
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default PreviewPediatricCaseSheet