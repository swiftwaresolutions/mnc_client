import React from 'react'
import { Row, Col, Accordion } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'
import { ScreenDetails, visitDetailInterface } from '../model/interfaces'
import GeneralCaseSheetView from '../components/GeneralCaseSheetView'
import LaboratoryView from '../components/LaboratoryView'
import PrescriptionView from '../components/PrescriptionView'
import CaseSheetView from '../components/CaseSheetView'
import OutsideLaboratoryView from '../components/OutsideLaboratoryView'

interface ComponentProps {
    patientVisit: visitDetailInterface[],
    screenDetails: ScreenDetails,
    setScreenDetails:(value: React.SetStateAction<ScreenDetails>) => void,
    getPatientVisitClinicalDetails: (event: React.MouseEvent, visitItem: visitDetailInterface, visitIdx: number) => void,
    patientDetails: any
};

const VisitDetailsTab: React.FC<ComponentProps> = ({ patientVisit, screenDetails,setScreenDetails, getPatientVisitClinicalDetails,patientDetails }) => {

    const handleVisitTabAccordian = (activeKeys: string[]) => {
        setScreenDetails((prev)=>({...prev,visitTabActiveAccordian:activeKeys}))
    }

    return (
        <Row className=" h-100 overflow-auto rounded">
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
                            <Accordion 
                            defaultActiveKey={["0"]} flush alwaysOpen onSelect={(active: any) => handleVisitTabAccordian(active)}
                            activeKey={screenDetails.visitTabActiveAccordian}
                            >
                                {patientVisit.map((visit: visitDetailInterface, vstIdx: number) => {
                                    return (
                                        <Accordion.Item key={vstIdx} eventKey={`${vstIdx}`} className='my-2' onClick={(event) => getPatientVisitClinicalDetails(event, visit, vstIdx)} >
                                            <Accordion.Header >
                                                <Row className='w-100'>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>VISIT : <span className='text-danger'>{patientVisit.length - vstIdx}</span></Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>- {`${new DateUtils(visit.date).dateFormat("DD-MM-YYYY")} ${new DateUtils(visit.date).timeFormat("HH:MM")}`}</Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>/ {visit.departmentName}</Col>
                                                    <Col className='flex-grow-0 fw-bold text-nowrap'>/ {visit.doctorName}</Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body className='border border-top-0 rounded p-0 fs-12px overflow-auto '>
                                                <Row className='pt-1'>
                                                    {/* <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1 '>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>CASE SHEETS</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col xl="10">
                                                                        <Row className='h-100 '>
                                                                            <GeneralCaseSheetView {...{ generalCaseSheet: visit.generalCaseSheet }} />
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col >
                                                        </Row >
                                                    </Col> */}
                                                    <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1 '>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>CASE SHEETS</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col xl="10">
                                                                        <Row className='h-100 '>
                                                                            {/* <CaseSheetView {...{ caseSheet: visit.caseSheet }} /> */}
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col >
                                                        </Row >
                                                    </Col>
                                                    <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>LABORATORY</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col xl="10">
                                                                        <Row className='h-100 '>
                                                                            <LaboratoryView {...{ laboratory: visit.laboratory }} />
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    {/* <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>OUTSIDE LABORATORY</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col xl="10">
                                                                        <Row className='h-100 '>
                                                                            <OutsideLaboratoryView {...{ laboratory: visit.outsideLab }} />
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col> */}
                                                    <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column position-relative'>
                                                            <Col className='flex-grow-0 sticky-top'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>PRESCRIPTION</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className='rounded-bottom border border-top-0 h-100 justify-content-center'>
                                                                    <Col xl="10">
                                                                        <Row className='h-100 '>
                                                                            <PrescriptionView {...{ prescription: visit.prescription,patientDetails , printStatus: 0}} />
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

export default VisitDetailsTab;