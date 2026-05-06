
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../state/store';
import { PatientApiService } from '../../../../../api/patient/patient-api-service';
import { LaboratoryApiService } from '../../../../../api/laboratory/laboratory-api-service';
import { ImageApiService } from '../../../../../api/image/image-api-service';
import { OutsideInvInterface, OutsideLabInterface, PatientInvImageInterface, ScreenDetails } from '../model/interfaces';
import { handleError } from '../../../../../utils/errorUtil';
import { Button, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import OutsideLabReport from '../components/OutsideLabReport';
import { AxiosError } from 'axios';
import { InvestigationApiService } from '../../../../../api/investigation/investigation-api-service';
import OutsideInvReport from '../components/outsideInvReport';
import UploadedImages from '../components/UploadedImages';

interface ComponentProps {
    patientOPNumber : string;
}


const OutsideLabInvReport : React.FC<ComponentProps> = ({patientOPNumber}) => {

    const patOpno = patientOPNumber.trim();
    const dispatch = useDispatch(); 

    const patientApiService = new PatientApiService();
    const laboratoryApiService = new LaboratoryApiService();
    const investigationApiService= new InvestigationApiService();
    const imageApiService = new ImageApiService();

    const [status , setStatus] = useState({ inv : false, lab : false, img : true})
    const [laboratory, setLaboratory] = useState<OutsideLabInterface[]>([])
    const [investigation, setInvestigation] = useState<OutsideInvInterface[]>([])
    const [outsideImages, setOutsideImages] = useState<PatientInvImageInterface[]>([])
    const [screenDetails, setScreenDetails] = useState<ScreenDetails>({
        isLoading : false,
        message : "Details are Empty",
        color : "danger"
    })

    const handleButttonStatus = (id : number) => {
        if( id === 1 ) {
            setStatus((pre) => {
                return {
                    ...pre,
                    lab : true,
                    inv : false,
                    img : false
                }
            })
        }
        if( id === 2 ) {
            setStatus((pre) => {
                return {
                    ...pre,
                    lab : false,
                    inv : true,
                    img : false
                }
            })
        }
        if( id === 3 ) {
            setStatus((pre) => {
                return {
                    ...pre,
                    lab : false,
                    inv : false,
                    img : true
                }
            })
        }
        
    }
    const fetchClinicalDetails = (patId :string) => {
        return Promise.all([
            laboratoryApiService.fetchOutsideLabResultDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
            investigationApiService.fetchAllOutsideInvDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
            imageApiService.fetchInvUploadedDetailsByPatId(`${patId}`).catch((error : AxiosError) => {handleError(dispatch, error); return []; }),
        ])
    }
    
    const getPatientClinicalDetails = async () => {
        try {
            if (!patOpno) {
                throw new Error("Patient Opno is Invalid!")
            }
            setScreenDetails((pre : any) => ({...pre, isLoading : true, message : "Loading ...", color : "primary"}))
            
            const patientId = await patientApiService.getPatientIdByDisplayNo(patOpno).catch((error : AxiosError) => {handleError(dispatch, error); return 0;  });
            if (!patientId) {
                throw new Error("Patient Id is Invalid!")
            }

            const promises : any[] =[];
            let patientResponse : any[] =[];
            patientResponse = [{...patientResponse, outsideLab : [], outsideInv : [], outsideImg : []}]
            promises.push(fetchClinicalDetails(patientId))
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
        <Row className=''>
            <Col><Button variant='secondary' disabled = {status.lab} onClick={e => handleButttonStatus(1)}>Lab</Button></Col>
            <Col><Button variant='secondary' disabled = {status.inv} onClick={e => handleButttonStatus(2)}>Inv</Button></Col>
            <Col><Button variant='secondary' disabled = {status.img} onClick={e => handleButttonStatus(3)}>Images</Button></Col>
        </Row>
        
        <Row className='h-100 flex-column flex-nowarap '>
            <Col className="d-flex flex-column flex-nowrap overflow-auto">     

                {
                    status.lab && <OutsideLabReport {...{  laboratory }} />

                }
                {
                    status.inv && <OutsideInvReport {...{ investigation }} />

                }
                {
                    status.img && <UploadedImages {...{ outsideImages }} />

                }
                {/* <Tabs defaultActiveKey="outsideLab" className="border-0 justify-content-evenly">
                    <Tab className='h-100 pb-1 border' eventKey="outsideLab" title="Outside Lab">
                        <OutsideLabReport {...{  laboratory }} />
                    </Tab>
                    <Tab className='h-100 pb-1 border' eventKey="outsideInv" title="Outside Inv">
                        <OutsideInvReport {...{ investigation }} />
                    </Tab>
                    <Tab className='h-100 pb-1 border' eventKey="outsideImages" title="Images">
                        <UploadedImages {...{ outsideImages }} />
                    </Tab>
                </Tabs> */}
            </Col>
        </Row>
    </Container>
  )
}

export default OutsideLabInvReport