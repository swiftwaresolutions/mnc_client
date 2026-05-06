import React, { Fragment, useEffect } from 'react'
import { Col, Container, FormLabel, Row } from 'react-bootstrap'

const PreviewGeneralCaseSheet = ({ SavedCaseSheet }: any) => {

  return (
    <Fragment>
      <Container>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet?.complaintDataList?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>PRESENTING COMPLAINTS</Col>
              <Col xs="2">PERIOD</Col>
              <Col xs="2">TIME</Col>
            </Row>
            {
              SavedCaseSheet?.complaintDataList?.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.name}</Col>
                  <Col xs="2">{item.no}</Col>
                  <Col xs="2">{item.periods}</Col>
                </Row>))
            }
          </Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.presentIllness ? '' : "d-none"}`}>HISTORY OF PRESENT ILLNESS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.presentIllness}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.pastHistory ? '' : "d-none"}`}>PAST HISTORY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.pastHistory}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.treatmentHistory ? '' : "d-none"}`}>TREATMENT HISTORY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.treatmentHistory}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.personalHistory ? '' : "d-none"}`}>PERSONAL HISTORY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.personalHistory}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.investigationHistory ? '' : "d-none"}`}>INVESTIGATION HISTORY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.investigationHistory}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet?.menstrualHistory ? '' : "d-none"}`}>MENSTURAL HISTORY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.menstrualHistory}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5`}>
            <Row>
              <Col>TEMP</Col>
              <Col >PULSE</Col>
              <Col >RR</Col>
              <Col >BP</Col>
              <Col >SPO2</Col>
              <Col >HEIGHT</Col>
              <Col >WEIGHT</Col>
              <Col >BMI</Col>
            </Row>
            <Row>
              <Col>{SavedCaseSheet?.temperature}</Col>
              <Col >{SavedCaseSheet?.pulse}</Col>
              <Col >{SavedCaseSheet?.rr}</Col>
              <Col >{SavedCaseSheet?.bp}</Col>
              <Col >{SavedCaseSheet?.spo2}</Col>
              <Col >{SavedCaseSheet?.height}</Col>
              <Col >{SavedCaseSheet?.weight}</Col>
              <Col >{SavedCaseSheet?.bmi}</Col>
            </Row>
          </Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.oralCavity ? '' : "d-none"}`}>ORAL CAVITY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.oralCavity}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.res ? '' : "d-none"}`}>RS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.res}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.cvs ? '' : "d-none"}`}>CVS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.cvs}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.abdominal ? '' : "d-none"}`}>ABDOMINAL</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.abdominal}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.cns ? '' : "d-none"}`}>CNS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.cns}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.perVaginal ? '' : "d-none"}`}>PER VAGINAL</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.perVaginal}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.oralRectal ? '' : "d-none"}`}>ORAL RECTAL</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.oralRectal}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.skin ? '' : "d-none"}`}>SKIN</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.skin}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.musculoskeletal ? '' : "d-none"}`}>MUSCULOSKELETAL</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.musculoskeletal}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.additionalFindings ? '' : "d-none"}`}>ADDITIONAL FINDINGS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.additionalFindings}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.allergy ? '' : "d-none"}`}>ALLERGY</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.allergy}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet?.diagnosisDetailsData?.length > 0 ? '' : "d-none"}`}>
            <Row>
              <Col>PRESENTING COMPLAINTS</Col>
            </Row>
            {
              SavedCaseSheet?.diagnosisDetailsData?.map((item: any, idx: number) => (
                <Row className='fw-normal' key={idx}>
                  <Col>{item.name}</Col>
                </Row>))
            }
          </Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.differentialDiagnosis ? '' : "d-none"}`}>DIFFERENTIAL DIAGNOSIS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.differentialDiagnosis}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.confirmedDiagnosis ? '' : "d-none"}`}>CONFIRMED DIAGNOSIS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.confirmedDiagnosis}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.medications ? '' : "d-none"}`}>MEDICATIONS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.medications}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.recomendations ? '' : "d-none"}`}>RECOMMENDATIONS</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.recomendations}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.proceduresPlanned ? '' : "d-none"}`}>PROCEDURES PLANNED</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.proceduresPlanned}</Col>
        </Row>
        <Row className='flex-column'>
          <Col className={`fw-bold py-2 fs-5 ${SavedCaseSheet.followUpPlan ? '' : "d-none"}`}>FOLLOW UP PLAN</Col>
          <Col className='fs-15px'>{SavedCaseSheet?.followUpPlan}</Col>
        </Row>

      </Container>
    </Fragment>
  );
};

export default PreviewGeneralCaseSheet