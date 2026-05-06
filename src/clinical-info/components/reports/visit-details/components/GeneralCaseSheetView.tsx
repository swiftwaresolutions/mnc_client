import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';

const GeneralCaseSheetView = ({ data,data2 }: any) => {
    return (
        <Row className='flex-column border h-100 pb-2'>
            <Col className='text-center bg-primary text-white fs-5 fw-bold flex-grow-0'>CASE SHEET</Col>
            <Col className='px-0'>
                <Row className='flex-column '>
                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>GENERAL</Col>
                    <Col className={`fw-bold py-2 ${data?.complaintDataList?.length > 0 ? '' : "d-none"}`}>
                        <Row>
                            <Col className='fs-13px'>PRESENTING COMPLAINTS</Col>
                            <Col className='fs-13px' xs="2">PERIOD</Col>
                            <Col className='fs-13px' xs="2">TIME</Col>
                        </Row>
                        {
                            data?.complaintDataList?.map((item: any, idx: number) => (
                                <Row className='fw-normal' key={idx}>
                                    <Col className='fs-13px'>{item.name}</Col>
                                    <Col className='fs-13px' xs="2">{item.no}</Col>
                                    <Col className='fs-13px' xs="2">{item.periods}</Col>
                                </Row>))
                        }
                    </Col>
                    <Col className=''>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.presentIllness ? '' : "d-none"}`}>PRESENT ILLNESS</Col>
                            <Col className='fs-13px text-indent-50px' >{data?.presentIllness}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.pastHistory ? '' : "d-none"}`}>PAST HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.pastHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.treatmentHistory ? '' : "d-none"}`}>TREATMENT HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.treatmentHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.personalHistory ? '' : "d-none"}`}>PERSONAL HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.personalHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.investigationHistory ? '' : "d-none"}`}>INVESTIGATION HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.investigationHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data?.menstrualHistory ? '' : "d-none"}`}>MENSTURAL HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.menstrualHistory}</Col>
                        </Row>
                    </Col>

                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>EXAMINATION</Col>
                    <Col className={`py-2`}>
                        <Row className='row-cols-3 justify-content-center'>
                            <Col className={`${data?.temperature?"":"d-none"}`}>
                                <Row className='flex-column text-center text-center'>
                                    <Col className='fw-bold'>TEMP</Col>
                                    <Col>{data?.temperature}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.pulse?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >PULSE</Col>
                                    <Col >{data?.pulse}</Col>
                                </Row>
                            </Col>

                            <Col className={`${data?.rr?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >RR</Col>
                                    <Col >{data?.rr}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.bp?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >BP</Col>
                                    <Col >{data?.bp}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.spo2?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >SPO2</Col>
                                    <Col >{data?.spo2}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.height?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >HEIGHT</Col>
                                    <Col >{data?.height}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.weight?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >WEIGHT</Col>
                                    <Col >{data?.weight}</Col>
                                </Row>
                            </Col>
                            <Col className={`${data?.bmi?"":"d-none"}`}>
                                <Row className='flex-column text-center'>
                                    <Col className='fw-bold' >BMI</Col>
                                    <Col >{data?.bmi}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                        </Row>
                    </Col>
                    <Col className=''>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.oralCavity ? '' : "d-none"}`}>ORAL CAVITY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.oralCavity}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.res ? '' : "d-none"}`}>RS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.res}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.cvs ? '' : "d-none"}`}>CVS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.cvs}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.abdominal ? '' : "d-none"}`}>ABDOMINAL</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.abdominal}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.cns ? '' : "d-none"}`}>CNS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.cns}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.perVaginal ? '' : "d-none"}`}>PER VAGINAL</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.perVaginal}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.oralRectal ? '' : "d-none"}`}>ORAL RECTAL</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.oralRectal}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.skin ? '' : "d-none"}`}>SKIN</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.skin}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.musculoskeletal ? '' : "d-none"}`}>MUSCULOSKELETAL</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.musculoskeletal}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.additionalFindings ? '' : "d-none"}`}>ADDITIONAL FINDINGS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.additionalFindings}</Col>
                        </Row>
                    </Col>
                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>ALLERGY & FOLLOW UP</Col>
                    <Col className=''>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.allergy ? '' : "d-none"}`}>ALLERGY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.allergy}</Col>
                        </Row>

                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.medications ? '' : "d-none"}`}>MEDICATIONS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.medications}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.recomendations ? '' : "d-none"}`}>RECOMMENDATIONS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.recomendations}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.proceduresPlanned ? '' : "d-none"}`}>PROCEDURES PLANNED</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.proceduresPlanned}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.followUpPlan ? '' : "d-none"}`}>FOLLOW UP PLAN</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.followUpPlan}</Col>
                        </Row>
                    </Col>
                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>DIAGNOSIS</Col>
                    <Col className={`fw-bold py-2 ${data?.diagnosisDetailsData?.length > 0 ? '' : "d-none"}`}>
                        <Row>
                            <Col>PRESENTING COMPLAINTS</Col>
                        </Row>
                        {
                            data?.diagnosisDetailsData?.map((item: any, idx: number) => (
                                <Row className='fw-normal text-indent-10px' key={idx}>
                                    <Col>{idx + 1} . {item.name}</Col>
                                </Row>))
                        }
                    </Col>
                    <Col className=''>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.differentialDiagnosis ? '' : "d-none"}`}>DIFFERENTIAL DIAGNOSIS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.differentialDiagnosis}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.confirmedDiagnosis ? '' : "d-none"}`}>CONFIRMED DIAGNOSIS</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.confirmedDiagnosis}</Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Accordion defaultActiveKey={['0']} alwaysOpen style={{ padding : 0 }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header >DENTAL CASE SHEET</Accordion.Header>
                    <Accordion.Body style={{ padding : 0 }}>
                        <Row className='flex-column border h-100'>
                            {/* <Col className='text-center bg-primary text-white fs-5 fw-bold flex-grow-0'>DENTAL CASE SHEET</Col> */}
                            <Col className='px-0'>
                                <Row className='flex-column '>
                                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>HISTORY</Col>
                                    <Col className={`fw-bold py-2 ${data2?.complaintDataList?.length > 0 ? '' : "d-none"}`}>
                                        <Row>
                                            <Col className='fs-13px'>PRESENTING COMPLAINTS</Col>
                                            <Col className='fs-13px' xs="2">PERIOD</Col>
                                            <Col className='fs-13px' xs="2">TIME</Col>
                                        </Row>
                                        {
                                            data2?.complaintDataList?.map((item: any, idx: number) => (
                                                <Row className='fw-normal' key={idx}>
                                                    <Col className='fs-13px'>{item.name}</Col>
                                                    <Col className='fs-13px' xs="2">{item.no}</Col>
                                                    <Col className='fs-13px' xs="2">{item.periods}</Col>
                                                </Row>))
                                        }
                                    </Col>
                                    <Col className=''>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.historyofpresentIllness ? '' : "d-none"}`}>HISTORY OF PRESENT ILLNESS</Col>
                                            <Col className='fs-13px text-indent-50px' >{data2?.historyofpresentIllness}</Col>
                                        </Row>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.medicalHistory ? '' : "d-none"}`}>MEDICAL HISTORY</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.medicalHistory}</Col>
                                        </Row>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.past_History ? '' : "d-none"}`}>PAST HISTORY</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.past_History}</Col>
                                        </Row>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.habitHistory ? '' : "d-none"}`}>HABIT HISTORY</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.habitHistory}</Col>
                                        </Row>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.treatment_History ? '' : "d-none"}`}>TREATMENT HISTORY</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.treatment_History}</Col>
                                        </Row>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2?.occupation ? '' : "d-none"}`}>OCCUPATION</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.occupation}</Col>
                                        </Row>
                                    </Col>

                                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>EXAMINATION</Col>
                                    <Col className=''>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.extraoralexamination ? '' : "d-none"}`}>EXTRAORAL EXAMINATION</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.extraoralexamination}</Col>
                                        </Row>

                                        <Col className={`fw-bold py-2 ${data2?.teethDataList?.length > 0 ? '' : "d-none"}`}>
                                            <Row>
                                                <Col className='fs-13px' xs="7">TOOTH NO</Col>
                                                <Col className='fs-13px' xs="3">INTRA ORAL EXAM</Col>

                                            </Row>
                                            {
                                                data2?.teethDataList?.map((item: any, idx: number) => (
                                                    <Row className='fw-normal' key={idx}>
                                                        <Col className='fs-13px' xs="7">{item.toothnum}</Col>
                                                        <Col className='fs-13px' xs="3">{item.teethdetails}</Col>
                                                    </Row>))
                                            }
                                        </Col>


                                    </Col>

                                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>TREATMENT</Col>
                                    <Col className=''>
                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.treatmentplan ? '' : "d-none"}`}>TREATMENT PLAN</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.treatmentplan}</Col>
                                        </Row>

                                        <Row className='flex-column'>
                                            <Col className={`fw-bold ${data2.treatmentgeneral ? '' : "d-none"}`}>TREATMENT GENERAL</Col>
                                            <Col className='fs-13px text-indent-50px'>{data2?.treatmentgeneral}</Col>
                                        </Row>

                                        <Col className={`fw-bold py-2 ${data2?.teethTreatDataList?.length > 0 ? '' : "d-none"}`}>
                                            <Row>
                                                <Col className='fs-13px' xs="7">TOOTH NO</Col>
                                                <Col className='fs-13px' xs="3">TREAT TOOTH BASED</Col>
                                            </Row>
                                            {
                                                data2?.teethTreatDataList?.map((item: any, idx: number) => (
                                                    <Row className='fw-normal' key={idx}>
                                                        <Col className='fs-13px' xs="7">{item.toothnum}</Col>
                                                        <Col className='fs-13px' xs="3">{item.teethdetails}</Col>
                                                    </Row>))
                                            }
                                        </Col>


                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Row>
    )
}

export default GeneralCaseSheetView