
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { PatientApiService } from '../../../../api/patient/patient-api-service';
import { LaboratoryApiService } from '../../../../api/laboratory/laboratory-api-service';
import { ImageApiService } from '../../../../api/image/image-api-service';
import { OutsideInvInterface, OutsideLabInterface, patientDetailsInterface, PatientInvImageInterface, ScreenDetails, visitDetailInterface } from './model/interfaces';
import { handleError } from '../../../../utils/errorUtil';
import { Badge, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import AllLabReports from './components/allLabReportCom';
import { AxiosError } from 'axios';
import { InvestigationApiService } from '../../../../api/investigation/investigation-api-service';

import UploadOutsideImages from './tabs/uploadOutsideImages';
import PdfViewTab from '../clinical-report/tabs/PdfViewTab';
import OutsideLabTab from './tabs/outsideLabTab';
import OutsideInvTab from './tabs/outsideInvTab';

const AllLabReport: React.FC = () => {

    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer);
    let patientDetails: any;
    if (isIp) {
        patientDetails = clinicalCurrentIpPatient;
    } else {
        patientDetails = clinicalCurrentOpPatient;
    }
    const dispatch = useDispatch();

    const laboratoryApiService = new LaboratoryApiService();

    const [laboratory, setLaboratory] = useState<OutsideLabInterface[]>([])
    const [resultDates, setResultDates] = useState<string[]>([]);

    const [screenDetails, setScreenDetails] = useState<ScreenDetails>({
        isLoading: false,
        message: "Details are Empty",
        color: "danger"
    })

    const getPatientClinicalDetails = async () => {
        try {
            if (!patientDetails.patientId) {
                throw new Error("Patient Id is Invalid!")
            }
            setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "Loading ...", color: "primary" }))
            const resultsResponse = await Promise.all([
                laboratoryApiService.fetchOutsideLabResultDetailsByPatId(`${patientDetails.patientId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
                laboratoryApiService.fetchLabResultsByPatientId(`${patientDetails.patientId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; })
            ]);
            let outSideLabResults: any[] = resultsResponse[0].map((item: any) => ({ ...item, type: "outSideLab", date: item.selDate }))
            let labResults: any[] = resultsResponse[1].map((item: any) => ({ ...item, type: "lab", date: item.visitDate }))

            let results = [...outSideLabResults, ...labResults];
            console.log('results', results)
            const groupedData: any = {};
            results.forEach((result: any) => {
                if (!groupedData[result.testName]) {
                    groupedData[result.testName] = {};
                }

                // Initialize the fieldName entry under the testName if not already present
                if (!groupedData[result.testName][result.fieldName]) {
                    groupedData[result.testName][result.fieldName] = {};
                }

                // Initialize the date entry for the fieldName if not already present
                if (!groupedData[result.testName][result.fieldName][result.date]) {
                    groupedData[result.testName][result.fieldName][result.date] = [];
                }

                // Push the test result into the array for this testName, fieldName, and date
                groupedData[result.testName][result.fieldName][result.date].push({
                    value: result.value,
                    unit: result.unit,
                    type: result.type
                });
            })

            setLaboratory(groupedData);
            setResultDates(Array.from(
                new Set(results.map((item) => item.date))
            ))
            if (results.length === 0) {
                setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "No Records Found", color: "danger" }))
            } else
            setScreenDetails((pre: any) => ({ ...pre, isLoading: false, message: "", color: "" }))
        } catch (error) {
            handleError(dispatch, error)
            setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "Error Fetching Data", color: "danger" }))
        }
    }
    useEffect(() => {
        getPatientClinicalDetails()
    }, [])

    return (
        <Container fluid="xl" className='shadow clinical-report-container h-100 px-2'>
            <Row className='h-100 flex-column flex-nowarap'>
                <Col className="d-flex flex-column flex-nowrap overflow-auto">
                    {/* <Row xs={1} lg={2} className=" justify-content-center m-2 p-2 border rounded align-items-center bg-light">
                        <Col className="flex-grow-1">
                            <Row className='align-items-center'>
                                <Col md={9} className='fw-bold py-0 text-start text-center text-uppercase ps-2 letter-spacing-05px'>
                                    <span className='text-success'> PATIENT DETAILS :- </span><span className="text-dark">{patientDetails?.fullName} / {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} / {patientDetails?.age} / {patientDetails?.gender}</span>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col className="text-success fw-medium d-flex align-items-center gap-2"><Badge pill bg= {"success"} className = "p-1" style ={{ width : '10px', height : '10px', display : 'block'}}></Badge>Lab</Col>
                                        <Col className="text-danger fw-medium d-flex align-items-center gap-2"><Badge pill bg= {"danger"} className = "p-1" style ={{ width : '10px', height : '10px', display : 'block'}}></Badge>Outside Lab</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row> */}
                    {/* <Row className='flex-grow-1 overflow-hidden'>
                        <Col className='h-100 overflow-auto p-0'>
                            {
                                screenDetails.isLoading ?
                                    <div className='d-flex justify-content-center align-items-center h-100'>
                                        <span className={`text-${screenDetails.color} fw-bold fs-16px`}>{screenDetails.message}</span>
                                    </div>
                                    : <AllLabReports {...{ laboratory, resultDates,patientDetails }} />
                            }
                            
                        </Col>

                        
                    </Row> */}
                    {screenDetails.isLoading ? (
                        <div className='d-flex justify-content-center align-items-center h-100'>
                            <span className={`text-${screenDetails.color} fw-bold fs-16px`}>
                                {screenDetails.message}
                            </span>
                        </div>
                    ) : (
                        <AllLabReports laboratory={laboratory} resultDates={resultDates} patientDetails={patientDetails} />

                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default AllLabReport;