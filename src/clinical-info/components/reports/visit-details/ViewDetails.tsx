import React, { useEffect, useState } from 'react'
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import GeneralCaseSheetView from './components/GeneralCaseSheetView'
import PrecriptionView from './components/PrescriptionView'
import LaboratoryView from './components/LaboratoryView'
import { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { errorHandling } from '../../../../error/state/error-handle-action'
import { PatientApiService } from '../../../../api/patient/patient-api-service'
import { RootState } from '../../../../state/store'
import { visitDetails } from "./model/visitDetailsModels"
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { LaboratoryApiService } from '../../../../api/laboratory/laboratory-api-service'
import { PrescriptionApiService } from '../../../../api/prescription/prescription-api-service'
import DentalCaseSheetView from './components/DentalCaseSheetView'

const ViewDetails = () => {

    const dispatch = useDispatch()

    const patientApiService: PatientApiService = new PatientApiService()

    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService()

    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService()

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()

    const {clinicalCurrentOpPatient} = useSelector((state: RootState) => state.clinicalPersistReducer)

    const [viewDetails, setViewDetails] = useState<any[]>([])

    const [loadingMessage, setLoadingMessage] = useState({ message: "", color: "" })


    const getPatientVisitDetailsByPatId = async () => {
        try {
            setLoadingMessage({ message: "Wait .... Visit Details is Loading", color: "warning" })
            let visitDetails = await patientApiService.getPatientVisitDetailsByPatId(clinicalCurrentOpPatient.patientId)
            if (visitDetails.length != 0) {
                visitDetails = [...visitDetails].map((item: any) => ({ ...item, generalCaseSheetResult: {}, prescriptionResult: [], laboratoryResult: [], dentalCaseSheetResult: {}  }))
                setViewDetails(visitDetails);
                setLoadingMessage({ message: "", color: "danger" })  // axaxaxaxafewwcwt4t
            } else {
                setLoadingMessage({ message: "Visit Details Empty", color: "danger" })
            }

        } catch (error: any) {
            handleError(error.message)
        }
    }
    const fetchCurrentPatientVisitDetails = async (visitId: string, item: any, idx: number, e: any) => {
        try {
            // console.log("visitId : " + visitId)

            let con = document.getElementById(`accordian_${idx}`)?.children[1].classList.contains('show')
            if (!con) {
                let local = [...viewDetails]
                let generalCaseSheetResultResponse = await caseSheetApiService.fetchGeneralCaseSheetByVstId(visitId)
                let laboratoryResultResponse = await laboratoryApiService.fetchLabResultsByVisitId(visitId)
                let prescriptionResultResponse = await prescriptionApiService.fetchPrescriptionDetailsByVstId(visitId,0)
                let dentalCaseSheetResultResponse = await caseSheetApiService.fetchDentalCaseSheetByVstId(visitId)
                if (generalCaseSheetResultResponse.status == true) {
                    item.generalCaseSheetResult = generalCaseSheetResultResponse.data[generalCaseSheetResultResponse.data.length - 1]
                }
                if ([...laboratoryResultResponse].length != 0) {
                    item.laboratoryResult = laboratoryResultResponse
                }
                if (prescriptionResultResponse.length != 0) {
                    item.prescriptionResult = prescriptionResultResponse
                }
                if (dentalCaseSheetResultResponse.status == true) {
                    item.dentalCaseSheetResult = dentalCaseSheetResultResponse.data[dentalCaseSheetResultResponse.data.length - 1]
                }
                local[idx] = item
                setViewDetails(local)
            }
        } catch (error: any) {
            handleError(error.message)
            console.log(error)
        }
    }
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    }
    useEffect(() => {
        getPatientVisitDetailsByPatId()
    }, [])
    return (
        <Container fluid className='d-flex align-items-center h-100 clinical-view-details-container px-4'>
            <Row className='vh-90 col overflow-auto shadow'>
                <Col className='bg-white'>

                    {viewDetails.length == 0 ? null : (
                        <Accordion flush alwaysOpen className='shadow-none'>
                            {viewDetails.map((curVisit: visitDetails, idx: number) => (
                                <Accordion.Item className='border' eventKey={`${idx}`} key={idx} onClick={(e) => fetchCurrentPatientVisitDetails(`${curVisit.visitId}`, curVisit, idx, e)} id={`accordian_${idx}`}>
                                    <Accordion.Header>
                                        <Row className='w-100'>
                                            <Col md="11" lg="8" xl="7">
                                                <Row className='fw-bold align-items-center'>
                                                    <Col className='text-danger'>VISIT : {viewDetails.length - idx}</Col>
                                                    <Col className=''>{clinicalCurrentOpPatient.fullName}</Col>
                                                    <Col className=''>{curVisit.date}</Col>
                                                    <Col className=''>{curVisit.doctorName}</Col>
                                                    <Col className=''>{curVisit.departmentName}</Col>
                                                </Row>
                                                {/* <span className='fw-bold text-danger'></span>
                                     <span ></span> */}
                                            </Col>
                                        </Row>

                                    </Accordion.Header>
                                    <Accordion.Body className=''>
                                        <Row>
                                            <Col><GeneralCaseSheetView data={curVisit.generalCaseSheetResult} data2={curVisit.dentalCaseSheetResult}  /></Col>
                                            <Col><LaboratoryView data={curVisit.laboratoryResult} /></Col>
                                            <Col><PrecriptionView data={curVisit.prescriptionResult} /></Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}

                        </Accordion>
                    )}
                    {viewDetails.length != 0 ? null : (
                        <Row className='align-items-center h-100'>
                            <Col className={`text-center fs-3 text-${loadingMessage.color}`}>
                                {loadingMessage.message}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ViewDetails

