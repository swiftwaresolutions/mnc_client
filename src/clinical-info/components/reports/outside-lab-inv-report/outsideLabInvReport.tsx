
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { PatientApiService } from '../../../../api/patient/patient-api-service';
import { LaboratoryApiService } from '../../../../api/laboratory/laboratory-api-service';
import { ImageApiService } from '../../../../api/image/image-api-service';
import { OutsideInvInterface, OutsideLabInterface, patientDetailsInterface, PatientInvImageInterface, ScreenDetails, visitDetailInterface } from './model/interfaces';
import { handleError } from '../../../../utils/errorUtil';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import OutsideLabTab from './tabs/outsideLabTab';
import OutsideInvTab from './tabs/outsideInvTab';
import { AxiosError } from 'axios';
import { InvestigationApiService } from '../../../../api/investigation/investigation-api-service';
import UploadOutsideImages from './tabs/uploadOutsideImages';
import PdfViewTab from '../clinical-report/tabs/PdfViewTab';
import AllLabReport from '../all-lab-report/allLabReport';

const OutsideLabInvReport : React.FC = () => {

    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer);
    let patientDetails: any;
    if (isIp) {
        patientDetails = clinicalCurrentIpPatient;
    } else {
        patientDetails = clinicalCurrentOpPatient;
    }
    const dispatch = useDispatch(); 

    const patientApiService = new PatientApiService();
    const laboratoryApiService = new LaboratoryApiService();
    const investigationApiService= new InvestigationApiService();
    const imageApiService = new ImageApiService();

    const [laboratory, setLaboratory] = useState<OutsideLabInterface[]>([])
    const [investigation, setInvestigation] = useState<OutsideInvInterface[]>([])
    const [outsideImages, setOutsideImages] = useState<PatientInvImageInterface[]>([])
    const [investigationPdf, setInvestigationPdf] = useState<any[]>([])
    const [screenDetails, setScreenDetails] = useState<ScreenDetails>({
        isLoading : false,
        message : "Details are Empty",
        color : "danger"
    })

    const fetchClinicalDetails = (patId :string) => {
        return Promise.all([
            laboratoryApiService.fetchOutsideLabResultDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
            investigationApiService.fetchAllOutsideInvDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
            imageApiService.fetchInvUploadedDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
        ])
    }

    const fetchUploadedPdf = async () => {
        try {
            let pdfResponse: any[] = await investigationApiService.fetchUploadedPdf(`${patientDetails.patientId}`)
            let updated = pdfResponse.map((item) => {
                const updated = { ...item }
                let fileName = String(updated.originalFileName)
                fileName = fileName.slice(0, fileName.lastIndexOf('.'))
                Object.assign(updated, { fileName })
                return updated;
            })
            updated = Array.from(
                updated.reduce((acc, item) => {
                    if (!acc.has(item.visitId)) {
                        acc.set(item.visitId, { visitId: item.visitId, visitedDate: item.visitedDate, items: [] });
                    }
                    acc.get(item.visitId).items.push(item);
                    return acc;
                }, new Map()),
                ([, value]) => value
            )
            setInvestigationPdf(updated);
        } catch (error) {
            handleError(dispatch, error);
        }
    };
    
    const getPatientClinicalDetails = async () => {
        try {
            if(!patientDetails.patientId) {
                throw new Error("Patient Id is Invalid!")
            }
            setScreenDetails((pre : any) => ({...pre, isLoading : true, message : "Loading ...", color : "primary"}))
            const promises : any[] =[];
            let patientResponse : any[] =[];
            patientResponse = [{...patientResponse, outsideLab : [], outsideInv : [], outsideImg : []}]
            promises.push(fetchClinicalDetails(patientDetails.patientId))
            const resultsResponse = await Promise.all(promises);
            resultsResponse.forEach((item : any, index : number) => {
                if(item.length > 0) {
                    patientResponse[index].outsideLab = item[0]
                    patientResponse[index].outsideInv = item[1]
                    patientResponse[index].outsideImg = item[2]
                }
            })
            setLaboratory([...patientResponse[0].outsideLab])
            setInvestigation([...patientResponse[0].outsideInv])
            setOutsideImages([...patientResponse[0].outsideImg])
            // console.log("resultsResponse", patientResponse[0].outsideInv)
        } catch (error) {
            handleError(dispatch,error)
            setScreenDetails((pre : any) => ({ ...pre, isLoading : false, message : "Error Fetching Data", color : "danger" }))
        }
    }
    useEffect(() => {getPatientClinicalDetails()},[])

  return (
    <Container fluid="xl" className='shadow clinical-report-container h-100 p-2'>
        <Row className='h-100 flex-column flex-nowarap border border-black rounded'>
            <Col className="d-flex flex-column flex-nowrap overflow-auto">
                <Row xs={1} lg={2} className=" justify-content-center m-2 p-2 border rounded align-items-center bg-light">
                    <Col className="flex-grow-1">
                        <Row className='align-items-center'>
                            <Col className='fw-bold py-0 text-success text-start text-uppercase ps-2 letter-spacing-05px'>
                                PATIENT DETAILS :- <span className="text-dark">{patientDetails?.fullName} / {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} / {patientDetails?.age} / {patientDetails?.gender}</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="outsideLab" className="border-0 justify-content-evenly">
                    <Tab className='h-100 pb-1 border' eventKey="outsideLab" title="Outside Lab">
                        {/* <OutsideLabTab {...{  laboratory }} /> */}
                        <AllLabReport />
                    </Tab>
                    <Tab className='h-100 pb-1 border' eventKey="outsideInv" title="Outside Inv">
                        <OutsideInvTab {...{ investigation }} />
                    </Tab>
                    <Tab className='h-100 pb-1 border' eventKey="outsideImages" title="Images">
                        <UploadOutsideImages {...{ outsideImages }} />
                    </Tab>
                    <Tab className='h-100 pb-1 border' eventKey="uploadedPdf" title="Investigation PDF">
                        <PdfViewTab investigationPdf={investigationPdf} />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    </Container>
  )
}

export default OutsideLabInvReport