import React, { useEffect, useRef, useState } from 'react'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { clearErrorHandling, errorHandling } from '../../../../error/state/error-handle-action'
import { Button, Col, Container, Form, Row, FormLabel, Alert, Table } from "react-bootstrap"
import logo from '../../../../assets/images/logo.jpg'
import sign from '../../../../assets/sign.jpg';
import { LaboratoryApiService } from '../../../../api/laboratory/laboratory-api-service'
import { PrescriptionApiService } from '../../../../api/prescription/prescription-api-service'
import ReactToPrint from 'react-to-print'
import { DateUtils } from '../../../../utils/dateUtils'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { PatientApiService } from '../../../../api/patient/patient-api-service';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { routerPathNames } from '../../../../routes/routerPathNames';
import { storeClinicalCurrentIpPatient, storeClinicalCurrentOpPatient } from '../../../redux-store/clinicalPersistSlice';
import printArr from '../../../../assets/print/PrintData';



const dischargeSummaryFormat = {
    diagnosis: "",
    history: "",
    examination: "",
    treatment: "",
    courseInTheHospital: "",
    operativeFindings: "",
    conditionOfPatient: "",
    emergencyIndication: "",
    dischargeAdvice: "",
    gynaecology: "",
    obstetrics: "",
    neonatal: "",
    babyDetail: "",
    date: "0000-00-00",
    time: "00:00:00",
    reviewDTM: "0000-00-00 00:00:00",
}
const DischargeSummaryPrintC = () => {
    const [patientDetails, setpatientDetails] = useState<any>({})

    const currentDate = new Date();

    const visitId = useSelector((state: RootState) => { return (state.clinicalPersistReducer.vstId) })
    const HospitalInfo = useSelector((state: RootState) => { return (state.appReducer.organization) })
    console.log(HospitalInfo.code);
    const [hospitlDetials, sethospitalDetials] = useState({name:'',location:'',phone:'',others:'',code:'',logo:''})
    
   const Hospital=()=>{
    const data=printArr.filter((obj: any) => {
        return obj.code == HospitalInfo.code
    })
    console.log(data);
    
    sethospitalDetials(data[0])
   }
   


    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();
    const patPatientApiService: PatientApiService = new PatientApiService();
    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService();
    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService();
    const { clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)

    // const { clinicalCurrentOpPatient, isIp } = useSelector((state: RootState) => state.clinicalPersistReducer)
    // const { clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)
    // const [textareaValue, setTextareaValue] = useState<any>({ ...dischargeSummaryFormat })
    // const loginData = useSelector((state: RootState) => state.loginData)
    const dispatch = useDispatch()

    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    };

    const getDischargeSummaryResponse = async () => {
        try {
            if (visitId) {
                return await caseSheetApiService.fetchDischargeSummaryByVstId(visitId)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const [sumData, setsumData] = useState<any>({})
    const [sumStatus, setsumStatus] = useState({ status: "true" })
    const navigate: any = useNavigate();
    const handlePrevDischargeSummaryMap = async () => {
        try {
            let preSummaryData = await getDischargeSummaryResponse()
            let status = preSummaryData.status
            if (status == false) {
                setsumStatus({ status: "false" })
            }
            setsumData(preSummaryData.data[0])
        } catch (error) {

        }
    }

    const handlpatientData = async () => {
        let patientData = await patPatientApiService.getPrePatientDetialsByVstId(visitId)
        setpatientDetails(patientData[0])
    }

    const getDischargeSummaryPrescriptionResponse = async () => {
        try {
            if (visitId) {
                return await prescriptionApiService.fetchPrescriptionDetailsByVstId(visitId, 1)
            }
        } catch (error) {
            handleError(error)
        }
    }
    const [presData, setpresData] = useState<any[]>([])
    const handlePrevprescriptionMap = async () => {
        try {
            let preSummaryData = await getDischargeSummaryPrescriptionResponse()
            setpresData(preSummaryData)
        } catch (error) {

        }
    }
    const getDischargeSummaryLabResponse = async () => {
        try {
            if (visitId) {
                return await laboratoryApiService.fetchLabResultsByVisitId(visitId)
            }
        } catch (error) {
            handleError(error)
        }
    }
    const [labData, setlabData] = useState<any[]>([])
    const handlePrevlabMap = async () => {
        try {
            let preSummaryData = await getDischargeSummaryLabResponse()
            setlabData(preSummaryData)
        } catch (error) {

        }
    }
    const handleBack = () => {
        let path = routerPathNames.clinical.dashboard
        dispatch(storeClinicalCurrentOpPatient({}))
        dispatch(storeClinicalCurrentIpPatient({}))
        navigate(path);
    }

    const init = async () => {
        await handlePrevDischargeSummaryMap()
        await handlePrevprescriptionMap()
        await handlePrevlabMap()
        await handlpatientData()
    }
    useEffect(() => {
        init()
        Hospital()
        return () => {
            dispatch(clearErrorHandling())
        }
    }, [visitId]);


    const printRef = useRef(null);

    return (
        <div>

            <div id='printablediv' ref={printRef} className='disSumDataFontSize' >
                <div className='m-5'>
                    <Row>
                        <Col xs={1} className='mt-4'>
                            <img className='mx-3 ' height={'85px'}  src={`../../../../assets/images/${hospitlDetials.logo}.jpg`} alt="Logo" />
                        </Col>
                        <Col className='text-center '>
                            <Row className='text-center'>
                                <h5 className="fw-bold">{hospitlDetials.name} </h5>
                            </Row>
                            <Row className='text-center'>
                                <h6>{hospitlDetials.location} </h6>
                            </Row>
                            <Row className='text-center'>
                                <h6> {hospitlDetials.phone}</h6>
                            </Row>
                            <Row className='text-center'>
                                <h6> {hospitlDetials.others} </h6>
                            </Row>
                        </Col>

                    </Row>
                    <hr></hr>
                    <Row className='my-2'>
                        <Col >
                            <h4 className="text-center"><u>DISCHARGE SUMMARY</u></h4>
                        </Col>
                    </Row>


                    <Row className="text-left">
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>Patient Name  </b></p>
                                </Col>
                                <Col>
                                    <p >: {patientDetails?.name}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>OPNo  </b></p>
                                </Col>
                                <Col>
                                    <p >: {patientDetails?.displayNumber}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="text-left">
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>Age  </b></p>
                                </Col>
                                <Col>
                                    <p >: {`${patientDetails?.dob}`}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>Date of Admission  </b></p>
                                </Col>
                                <Col>
                                    <p >: {patientDetails?.admDate}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="text-left">
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>Gender  </b></p>
                                </Col>
                                <Col>
                                    <p >: {`${patientDetails?.sex == 'M' ? 'Male' : 'Female'}`}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col >
                            <Row>
                                <Col>
                                    <p ><b>Date of Discharge  </b></p>
                                </Col>
                                <Col>
                                    <p >:{` ${patientDetails?.ddate}`}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>




                    {/* <Row className="text-left">
                    <Col >
                        <Row>
                            <Col>
                                <p ><b>Address  </b></p>
                            </Col>
                            <Col>
                                <p >: {clinicalCurrentIpPatient.address}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col >
                        <Row>
                            <Col>
                                <p ><b>Ward  </b></p>
                            </Col>
                            <Col>
                                <p >: {clinicalCurrentIpPatient.ward}/{clinicalCurrentIpPatient.bedNo}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}


                    <hr></hr>

                    <Col className={`${sumStatus.status == 'true' ? '' : "d-none"}`}>
                        <Row>
                            <Col md={12} className={`${sumData.diagnosis == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>DIAGNOSIS</b></p>
                            </Col>
                        </Row>
                        <Row>
                            {
                                sumData?.dischargeDiagnosisDataList?.map((data: any, idx: number) => (
                                    <Col md={12} className="my-1" key={idx}>
                                        <Row>

                                            <p>{data.name}</p>


                                        </Row>
                                    </Col>
                                ))
                            }
                        </Row>
                        <Row>
                            <Col md={12} className={`${sumData.diagnosis == '' ? 'd-none' : ''}`}>
                                <Row><p >{sumData.diagnosis}</p></Row>
                            </Col>
                            <Col md={12} className={`${sumData.history == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>HISTORY</b></p>
                                <p>{sumData.history}</p>
                            </Col>
                            <Col md={12} className={`${sumData.examination == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>EXAMINATION</b></p>
                                <p>{sumData.examination}</p>
                            </Col>
                            <Row className={`${labData?.length > 0 ? '' : "d-none"}`}>
                                <Col md={12}>
                                    <p className='bg'><b>INVESTIGATION</b></p>
                                </Col>
                                <Table className='tableWidth no-border'>
                                    <thead className='theadBorder'>
                                        <tr>
                                            <th>S.No</th>
                                            <th >Test Name</th>
                                            <th>Field Name</th>
                                            <th>Results</th>
                                            <th>Units</th>

                                        </tr>
                                    </thead>
                                    <tbody className='theadBorder'>
                                        {
                                            labData?.map((data: any, idx: number) => (
                                                <tr key={idx} >
                                                    <td>{idx + 1}</td>
                                                    <td><b>{idx === 0 || data.testName !== labData[idx - 1].testName ? data.testName : ' '}</b></td>
                                                    <td>{data.fieldName}</td>
                                                    <td>{data.value}</td>
                                                    <td>{data.unit}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>

                            </Row>
                            <Row className={`${sumData?.dischargeLabInvSummaryDataList?.length > 0 ? '' : "d-none"}`}>

                                <Col md={12}>
                                    <p className='bg'><b>LAB AND PROCEDURE</b></p>
                                </Col>
                                <Table className='tableWidth no-border'>
                                    <thead className='theadBorder'>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Report</th>
                                        </tr>
                                    </thead>
                                    <tbody className='theadBorder'>
                                        {
                                            sumData?.dischargeLabInvSummaryDataList?.map((data: any, idx: number) => (
                                                <tr key={idx} >
                                                    <td>{data.report.length > 0 ? data.procDate : ''}</td>
                                                    <td>{data.procName}</td>
                                                    <td>{data.report}</td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Row>


                            <Col md={12} className={`${sumData.treatment == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>TREATMENT</b></p>
                                <p>{sumData.treatment}</p>
                            </Col>

                            <Col md={12} className={`${sumData.outSideMedicine == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>OUTSIDE MEDICINE</b></p>
                                <p>{sumData.outSideMedicine}</p>
                            </Col>
                            <Col md={12} className={`${sumData.courseInTheHospital == '' ? 'd-none' : ''}`}>
                                <p className='bg' ><b>COURSE IN THE HOSPITAL</b></p>
                                <p>{sumData.courseInTheHospital}</p>
                            </Col>
                            <Col md={12} className={`${sumData.operativeFindings == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>PROCEDURE</b></p>
                                <p>{sumData.operativeFindings}</p>
                            </Col>
                            <Col md={12} className={`${sumData.conditionOfPatient == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>CONDITION OF PATIENT</b></p>
                                <p>{sumData.conditionOfPatient}</p>
                            </Col>
                            <Col md={12} className={`${sumData.emergencyIndication == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>EMERGENCY INDICATION</b></p>
                                <p>{sumData.emergencyIndication}</p>
                            </Col>
                            <Col md={12} className={`${sumData.dischargeAdvice == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>DISCHARGE ADVICE</b></p>
                                <p>{sumData.dischargeAdvice}</p>
                            </Col>
                            <Col md={12} className={`${sumData.gynaecology == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>GYNAECOLOGY</b></p>
                                <p>{sumData.gynaecology}</p>
                            </Col>
                            <Col md={12} className={`${sumData.obstetrics == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>OBSTETRICS</b></p>
                                <p>{sumData.obstetrics}</p>
                            </Col>
                            <Col md={12} className={`${sumData.neonatal == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>NEONATAL</b></p>
                                <p>{sumData.neonatal}</p>
                            </Col>
                            <Col md={12} className={`${sumData.babyDetail == '' ? 'd-none' : ''}`}>
                                <p className='bg'><b>BABY DETAILS</b></p>
                                <p>{sumData.babyDetail}</p>
                            </Col>
                            <Col md={12} >
                                <Row className={`${presData?.length > 0 ? '' : "d-none"}`}>
                                    <Col md={12}>
                                        <p className='bg'><b>DISCHARGE MEDICINE</b></p>
                                    </Col>
                                    <Table className='tableWidth no-border'>
                                        <thead className='theadBorder'>
                                            <tr>
                                                <th>Medicine Name</th>
                                                <th>Timing</th>
                                                <th>Duration</th>
                                                <th>Qty</th>

                                            </tr>
                                        </thead>
                                        <tbody className='theadBorder'>
                                            {
                                                presData?.map((data: any, idx: number) => (
                                                    <tr key={idx} >
                                                        <td>{data.medName}</td>
                                                        <td>{data.timing}</td>
                                                        <td>{data.duration}{data.period}</td>
                                                        <td>{data.no}</td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Row>
                            </Col>
                        </Row>

                        {/* <Col md={12} className={`${sumData.dischargeLabInvSummaryDataList == ' ' ? 'd-none' : ' '}`}> */}

                        {/* </Col> */}
                        {/* <Col md={12} className={`${sumData.dischargeLabInvSummaryDataList == '' ? 'd-none' : ''}`}> */}



                        {/* </Col> */}

                        <Row className='row-cols-2 row-cols-md-4'>
                            <Col className={`${sumData.disSumConsultantDataList == '' ? 'd-none' : ''}`}>
                                <Row>
                                    <Col>
                                        <b>DISCHARGED DOCTOR</b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="my-1" >
                                        {
                                            sumData?.disSumConsultantDataList?.map((data: any, idx: number) => (
                                                <p key={idx} >{idx + 1}.{data.name}</p>
                                            ))
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            {/* <Col className={`${sumData.disSumDeptDataList == '' ? 'd-none' : ''}`}>
                        <Row>
                            <Col >
                                <b>DEPARTMENT</b>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="my-1" >
                                {
                                    sumData?.disSumDeptDataList?.map((data: any, idx: number) => (
                                        <p key={idx}>{idx + 1}.{data.name}</p>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col > */}
                        </Row>

                        <Col md={12} className={`${sumData.reviewDTM == '0000-00-00 00:00:00' ? 'd-none' : ''}`}>
                            <Row>
                                <Col md={12}>
                                    <p className='bg'><b>Review Date</b></p>
                                    <p>{sumData?.reviewDTM ? (new DateUtils(sumData?.reviewDTM).dateFormat("DD-MM-YYYY") + " - " + new DateUtils(sumData?.reviewDTM).timeFormat("HH:MM")) : ""}</p>

                                </Col>
                            </Row>
                        </Col>

                    </Col>
                    <Row className='m-4'>
                        <Col xs={9} className='mt-4'>

                        </Col>
                        <Col className='mt-4'>
                            {/* <img className='' src={sign} /> */}
                        </Col>
                    </Row>
                    <Row className='mb-5'>
                        <Col xs={9} className=''>

                        </Col>
                        <Col className=''>
                            <h6 className='fw-bold'>Signature of Doctor</h6>
                        </Col>
                    </Row>
                    <hr />
                    <span className='fw-bold'>
                        For any emergency please contact : +91 7397739796
                    </span>
                    {/* <div className='watermark'  style={{opacity:0.2}}><img className='image' src={logo} style={{width:'430px',height:'430px'}}></img></div> */}
                    <div className='text-center'>
                        <ReactToPrint
                            trigger={() => <Button id="printbtnhide" className='m-2'>Print</Button>}
                            content={() => printRef.current}
                        />
                        <Button variant='danger' id="printbtnhide" onClick={handleBack}>Back</Button>

                    </div>

                    {/* <Button variant="success" onClick={Print} id="printbtn" className="m-1" >Print Summary</Button>{' '} */}
                </div>
            </div>
        </div>
    )
}

export default DischargeSummaryPrintC


