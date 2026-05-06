import React from 'react'
import { Row, Col, Accordion } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'
import PrescriptionView from '../components/PrescriptionView'
import { ScreenDetails, visitDetailInterface } from '../model/interfaces'
interface ComponentProps {
    patientVisit: visitDetailInterface[],
    screenDetails: ScreenDetails,
    setScreenDetails:(value: React.SetStateAction<ScreenDetails>) => void,
    getPatientVisitClinicalDetails: (event: React.MouseEvent, visitItem: visitDetailInterface, visitIdx: number) => void,
    patientDetails: any
}
const PrescriptionTab: React.FC<ComponentProps> = ({ patientVisit, screenDetails,setScreenDetails, getPatientVisitClinicalDetails,patientDetails }) => {
    return (
        <Row className="h-100 overflow-auto rounded">
            <Col >
                {patientVisit.length == 0 &&
                    <Row className='h-100 align-items-center' >
                        <Col className='text-center'>
                            <h3 className={`text-${screenDetails.color}`}>{screenDetails.message}</h3>
                        </Col>
                    </Row>
                }
                {patientVisit.length !== 0 && (
                    <Row className='h-100' >
                        <Col className='px-4 py-2' >
                            <Accordion defaultActiveKey={['pres_res_0']} alwaysOpen>
                                {patientVisit.map((visit: visitDetailInterface, vstIdx: number) => {
                                    return (
                                        <Accordion.Item key={vstIdx} eventKey={`pres_res_${vstIdx}`} className='my-2'>
                                            <Accordion.Header onClick={(event) => getPatientVisitClinicalDetails(event, visit, vstIdx)}>
                                                <Row className='w-100'>
                                                    <Col className='flex-grow-0 text-danger fw-bold text-nowrap'>VISIT {patientVisit.length - vstIdx} :</Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>/ {`${new DateUtils(visit.date).dateFormat("DD-MM-YYYY")} ${new DateUtils(visit.date).timeFormat("HH:MM")}`}</Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>/ {visit.departmentName}</Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>/ {visit.doctorName}</Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body className='border border-top-0 rounded p-0 fs-12px max-h-350px overflow-auto '>
                                                <Row className='pt-1'>
                                                    <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            {/* <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>PRESCRIPTION</Col>
                                                                </Row>
                                                            </Col> */}
                                                            <Col className=''>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col lg="11">
                                                                        <Row className=' h-100 '>
                                                                            <PrescriptionView {...{ prescription: visit.prescription,patientDetails,printStatus : 1 }} />
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })}
                            </Accordion>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    )
}

export default PrescriptionTab