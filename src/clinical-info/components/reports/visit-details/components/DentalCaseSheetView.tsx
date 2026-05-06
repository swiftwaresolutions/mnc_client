import React from 'react'
import { Col, Row } from 'react-bootstrap'

const DentalCaseSheetView = ({ data }: any) => {
    //console.log(data);
    
    return (
        <Row className='flex-column border h-100 pb-2'>
            <Col className='text-center bg-primary text-white fs-5 fw-bold flex-grow-0'>DENTAL CASE SHEET</Col>
            <Col className='px-0'>
                <Row className='flex-column '>
                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>HISTORY</Col>
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
                            <Col className={`fw-bold ${data.historyofpresentIllness ? '' : "d-none"}`}>HISTORY OF PRESENT ILLNESS</Col>
                            <Col className='fs-13px text-indent-50px' >{data?.historyofpresentIllness}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.medicalHistory ? '' : "d-none"}`}>MEDICAL HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.medicalHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.past_History ? '' : "d-none"}`}>PAST HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.past_History}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.habitHistory ? '' : "d-none"}`}>HABIT HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.habitHistory}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.treatment_History ? '' : "d-none"}`}>TREATMENT HISTORY</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.treatment_History}</Col>
                        </Row>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data?.occupation ? '' : "d-none"}`}>OCCUPATION</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.occupation}</Col>
                        </Row>
                    </Col>

                    <Col className='text-danger text-center fw-bold py-2 text-decoration-underline link-offset-2'>EXAMINATION</Col>
                    <Col className=''>
                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.extraoralexamination ? '' : "d-none"}`}>EXTRAORAL EXAMINATION</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.extraoralexamination}</Col>
                        </Row>

                        <Col className={`fw-bold py-2 ${data?.teethDataList?.length > 0 ? '' : "d-none"}`}>
                            <Row>
                                <Col className='fs-13px' xs="7">TOOTH NUMBER</Col>
                                <Col className='fs-13px' xs="3">INTRAORAL EXAMINATION</Col>
                                
                            </Row>
                            {
                                data?.teethDataList?.map((item: any, idx: number) => (
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
                            <Col className={`fw-bold ${data.treatmentplan ? '' : "d-none"}`}>TREATMENT PLAN</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.treatmentplan}</Col>
                        </Row>

                        <Row className='flex-column'>
                            <Col className={`fw-bold ${data.treatmentgeneral ? '' : "d-none"}`}>TREATMENT GENERAL</Col>
                            <Col className='fs-13px text-indent-50px'>{data?.treatmentgeneral}</Col>
                        </Row>

                        <Col className={`fw-bold py-2 ${data?.teethDataList?.length > 0 ? '' : "d-none"}`}>
                            <Row>
                                <Col className='fs-13px' xs="7">TOOTH NUMBER</Col>
                                <Col className='fs-13px' xs="3">TREATMENT TOOTH BASED</Col>
                                
                            </Row>
                            {
                                data?.teethDataList?.map((item: any, idx: number) => (
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
    )
}

export default DentalCaseSheetView