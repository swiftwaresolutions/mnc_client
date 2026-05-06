import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Modal, Row, Col, Button, Accordion, Form, Tabs, Tab } from "react-bootstrap";
import CaseSheetApiService from "../../../../api/case-sheet/case-sheet-api-service";
import { LaboratoryApiService } from "../../../../api/laboratory/laboratory-api-service";
import { PatientApiService } from "../../../../api/patient/patient-api-service";
import { PrescriptionApiService } from "../../../../api/prescription/prescription-api-service";
import { DateUtils } from "../../../../utils/dateUtils";
import GeneralCaseSheetView from "./components/GeneralCaseSheetView";
import LaboratoryView from "./components/LaboratoryView";
import PrescriptionView from "./components/PrescriptionView";
import { visitDetailInterface } from "./model/interfaces";

import "./PrevVisitDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toastErrorBounceDark } from "../../../../utils/toast";
import { errorHandling } from "../../../../error/state/error-handle-action";
import { routerPathNames } from "../../../../routes/routerPathNames";
import { storePreviousVisit } from "../../../redux-store/clinicalPersistSlice";
import AntenatalCaseSheetView from "./components/AntenatalCaseSheetView";
import AllLabReport from "./components/allLabReportView";
import OutsideInvReport from "./components/outsideInvReport";
import OutsideLabInvReport from "./OutsideLabInvTab/outsideLabInvReport";

interface PrevVisitDetailsProps {
    handleClose: () => void
    prevVisistDetailsShow: boolean
}


const PrevVisitDetails: React.FC<PrevVisitDetailsProps> = ({ prevVisistDetailsShow, handleClose }) => {

    const patientApiService: PatientApiService = new PatientApiService(); 
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();
    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService();
    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService();
    const patPatientApiService: PatientApiService = new PatientApiService();

    const [patientOPNumber, setPatientOPNumber] = useState("")
    const [patientVisit, setPatientVisit] = useState<visitDetailInterface[]>([]);
    const [loading, setLoading] = useState({ isLoading: false, message: "Details is Empty", color: "danger" })
    const [handleButton, setHandleButton] = useState({ clinicalDetails : false, otherDetails : true})
    
    const dispatch=useDispatch()
    const fetchPatientVisitDetails = async (): Promise<any> => {
        if (patientOPNumber === "") {
            return;
        }
        return await patientApiService.getPatientVisitDetailsByPatDisplayNumber(patientOPNumber)
    };
    const fetchClinicalPatientDetails = (visitId: string) => {
        return Promise.all([
            prescriptionApiService.fetchPrescriptionDetailsByVstId(`${visitId}`, 0)
                .catch((error: AxiosError) => {
                    console.error(`Error fetching prescription details for visitId ${visitId}:`, error);
                    return [];
                }),
            laboratoryApiService.fetchLabResultsByVisitId(`${visitId}`)
                .catch((error: AxiosError) => {
                    console.error(`Error fetching lab results for visitId ${visitId}:`, error);
                    return [];
                }),
            caseSheetApiService.fetchGeneralCaseSheetByVstId(`${visitId}`)
                .catch((error: AxiosError) => {
                    console.error(`Error fetching general case sheet for visitId ${visitId}:`, error);
                    return [];
                }),
            caseSheetApiService.fetchAncByVstId(`${visitId}`)
                .catch((error: AxiosError) => {
                    console.error(`Error fetching Antenatal case sheet for visitId ${visitId}:`, error);
                    return [];
                }),
            caseSheetApiService.fetchAncDetialsByVstId(`${visitId}`)
                .catch((error: AxiosError) => {
                    console.error(`Error fetching Antenatal Details for visitId ${visitId}:`, error);
                    return [];
                }),
        ]);
    };
    const buttonHandle = async (event : React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
        setHandleButton({ clinicalDetails: false, otherDetails: true })
    }
    const getPatientVisitDetails = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        try {
            event.preventDefault();
            setLoading((pre: any) => ({ ...pre, isLoading: true, message: "Loading...", color: "primary" }))
            let visitDetailsDum = [...patientVisit];
            let visitResponse: visitDetailInterface[] = await fetchPatientVisitDetails();
            const promises: any[] = []
            visitResponse = visitResponse.map((item: visitDetailInterface) => ({
                ...item,
                prescription: [],
                laboratory: [],
                generalCaseSheet: {},
                antenatalCaseSheet: {},
                ancCasesheetDetails: {},
            }));
            visitDetailsDum = visitResponse;
            visitResponse.forEach((item: visitDetailInterface, index: number) => {
                if (index < 2) {
                    promises.push(fetchClinicalPatientDetails(`${item.visitId}`))
                }
            });
            const results = await Promise.all(promises);
            results.forEach((item, index) => {
                visitDetailsDum[index].prescription = item[0];
                visitDetailsDum[index].laboratory = item[1]
                if (item[2].length > 0) {
                    visitDetailsDum[index].generalCaseSheet = item[2][item[2].length - 1]
                }
                if (item[3].length > 0) {
                    visitDetailsDum[index].antenatalCaseSheet = item[3][item[3].length - 1]
                }
                if (item[4].length > 0) {
                    visitDetailsDum[index].ancCasesheetDetails = item[4][item[4].length - 1]
                }
            });
            setPatientVisit([...visitDetailsDum]);
        } catch (error) {
            console.error('Error fetching patient visit details:', error);
            setLoading((pre: any) => ({ ...pre, isLoading: true, message: "Error Fetching Data", color: "danger" }))
        } finally {
            setHandleButton({ clinicalDetails: true, otherDetails: false })
            setLoading((pre: any) => ({ ...pre, isLoading: false, message: "", color: "danger" }))
        }
    };

    const getPatientVisitClinicalDetails = async (event: React.MouseEvent, visitItem: visitDetailInterface, visitIdx: number) => {
        try {
            let target = event.target as HTMLDivElement
            let condition = target.offsetParent?.className.includes("collapsed")
            if (condition) {
                let clinicalDetails = await fetchClinicalPatientDetails(`${visitItem.visitId}`)
                let visitDetailsDum = [...patientVisit]
                visitDetailsDum[visitIdx].prescription = clinicalDetails[0]
                visitDetailsDum[visitIdx].laboratory = clinicalDetails[1]
                if (clinicalDetails[2].length > 0) {
                    visitDetailsDum[visitIdx].generalCaseSheet = clinicalDetails[2][clinicalDetails[2].length - 1]
                }
                if (clinicalDetails[3].length > 0) {
                    visitDetailsDum[visitIdx].antenatalCaseSheet = clinicalDetails[3][clinicalDetails[3].length - 1]
                }
                if (clinicalDetails[4].length > 0) {
                    visitDetailsDum[visitIdx].ancCasesheetDetails = clinicalDetails[4][clinicalDetails[4].length - 1]
                }
                console.log(visitDetailsDum)
                setPatientVisit([...visitDetailsDum]);
            }
        } catch (error) {
            console.log(error)
        }
    };
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
          dispatch(errorHandling(error.message));
        } else {
    
        }
      };
    const navigate=useNavigate()
    const handleDischargePrint = async (path: any, vstId: any) => {
        try {
            console.log(vstId);
            let res = await patPatientApiService.getPrePatientDetialsByVstId(vstId)
            console.log(res);
            if (res[0].admDate!='#') {
                dispatch(storePreviousVisit(vstId))
              navigate(path)
            }
            else{
                toastErrorBounceDark("Discharged Print Unavailable")
            }
        } catch (error) {
            handleError(error);
        }
    }

    const init = () => {
        setPatientOPNumber("")
        setPatientVisit([])
        setLoading({ isLoading: false, message: "Details is Empty", color: "danger" })
        setHandleButton({ clinicalDetails : false, otherDetails : true})
    }
    useEffect(() => {
        if (!prevVisistDetailsShow) {
            init()
        }
    }, [prevVisistDetailsShow])
    return (
        <Modal className='clinical-prev-visit-details-container ' show={prevVisistDetailsShow} fullscreen={"sm"} dialogClassName="w-90per max-w-xxl" onHide={handleClose} centered  >
            <Modal.Header className='py-2'>
                <Row className='w-100 align-items-center'>
                    <Col className='flex-grow-0 text-nowrap '>
                        <h5 className='m-0 fw-bold'>PATIENT PREVIOUS DETAILS</h5>
                    </Col>
                    <Col className="d-flex justify-content-center flex-grow-1">
                        <Form className='d-flex justify-content-center' onSubmit={(e) => getPatientVisitDetails(e)}>
                            <Form.Control autoFocus className='max-w-150px me-3' size='sm' placeholder='Enter Patient Number' value={patientOPNumber} onChange={(e) => setPatientOPNumber(e.target.value)} />
                            <Button variant='warning' type='submit' size='sm' className="text-nowrap" disabled = {handleButton.clinicalDetails}>Clinical DETAILS</Button>
                        </Form>
                        {/* <Button className="ms-3" variant='primary' type='submit' size='sm' disabled = {handleButton.otherDetails} onClick={buttonHandle}>Others</Button> */}
                    </Col>
                    <Col className='flex-grow-0'>
                        <Button size='sm' variant='danger rounded' className='px-2 ' onClick={handleClose}>
                            <span className='px-1 fs-6'>X</span>
                        </Button>
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body className="p-0 min-h-400px vh-85 overflow-auto rounded">
                {patientVisit.length == 0 &&
                    <Row className='h-100 align-items-center' >
                        <Col className='text-center'>
                            <h3 className={`text-${loading.color}`}>{loading.message}</h3>
                        </Col>
                    </Row>
                }
                {patientVisit.length !== 0 && handleButton.clinicalDetails && (
                    <Row className='h-100' >
                        <Col className='px-4 py-2' >
                            <Accordion defaultActiveKey="visit_0" alwaysOpen className='visit-main-accordian'>
                                {patientVisit.map((visit: visitDetailInterface, vstIdx: number) => {
                                    return (
                                        <Accordion.Item eventKey={`visit_${vstIdx}`} key={vstIdx} className='my-2'>
                                            <Accordion.Header onClick={(event) => getPatientVisitClinicalDetails(event, visit, vstIdx)}>
                                                <Row className='w-100 justify-content-between'>
                                                    <Col className='flex-grow-0 text-danger fw-bold text-nowrap'>VISIT {patientVisit.length - vstIdx} :</Col>
                                                    <Col className='fw-bold'> {`${new DateUtils(visit.date).dateFormat("DD-MM-YYYY")} ${new DateUtils(visit.date).timeFormat("HH:MM")}`}</Col>
                                                    <Col className='fw-bold'> {visit.departmentName}</Col>
                                                    <Col className='fw-bold'> {visit.doctorName}</Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body className='border border-top-0 rounded p-0 pt-1 fs-12px max-h-350px overflow-auto'>
                                                <Row>
                                                    <Col>
                                                        <Tabs defaultActiveKey={"caseSheet"} className="mb-3" fill>
                                                            <Tab title="CaseSheet Details" eventKey={"caseSheet"}>
                                                                <Row>
                                                                    <Col md={5}><GeneralCaseSheetView {...{ generalCaseSheet: visit.generalCaseSheet }} /></Col>
                                                                    <Col md={7}><AntenatalCaseSheetView {...{ ancCaseSheet: visit.antenatalCaseSheet,ancCasesheetDetails : visit.ancCasesheetDetails }} /></Col>   
                                                                </Row>                                                             
                                                            </Tab>
                                                            <Tab title="Lab and Prescription Details" eventKey={"labPresc"}>
                                                                <Row>
                                                                    <Col><PrescriptionView {...{ prescription: visit.prescription }} /></Col>
                                                                    <Col><LaboratoryView {...{ laboratory: visit.laboratory }} /></Col>
                                                                </Row>
                                                                
                                                            </Tab>
                                                            {/* <Tab title="Images / Pdf" eventKey={"imgPdf"}>
                                                                <LaboratoryView {...{ laboratory: visit.laboratory }} />
                                                            </Tab> */}
                                                        </Tabs>
                                                    </Col>
                                                </Row>
                                                {/* <Row>
                                                    <Col className={` text-end p-2 `}><button className="btn btn-primary btn-sm" onClick={() => { handleDischargePrint(routerPathNames.clinical.dischargesummaryprintC, visit.visitId) }}  >Discharge Print</button></Col>
                                                </Row> */}
                                                {/* <Row className=''>
                                                    <Col className='mb-1 px-0'>
                                                        <Row className='h-100 flex-column'>
                                                            <Col className='flex-grow-0'>
                                                                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                                                                    <Col className='fw-bolder text-nowrap text-center fs-5 '>CASE SHEETS</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <GeneralCaseSheetView {...{ generalCaseSheet: visit.generalCaseSheet }} />
                                                            </Col >
                                                        </Row >
                                                    </Col>
                                                    <Col className='mb-1 px-0'>
                                                        <PrescriptionView {...{ prescription: visit.prescription }} />
                                                    </Col>
                                                    <Col className='mb-1 px-0'>
                                                        <LaboratoryView {...{ laboratory: visit.laboratory }} />
                                                    </Col>
                                                </Row> */}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })}
                            </Accordion>
                        </Col>
                    </Row>
                )}
                {handleButton.otherDetails && (
                    <Row className='h-100'>
                        <Col className='px-4 py-2'>
                            <Row className='w-100 justify-content-center'>
                                <Col className='text-center'>
                                    <Tabs defaultActiveKey={"allLabReport"} className="mb-3" fill>
                                        <Tab title="All Lab Report" eventKey={"allLabReport"}>
                                            <Row className=''>
                                                <Col ><AllLabReport {...{ patientOPNumber: patientOPNumber }}/></Col>
                                            </Row>
                                        </Tab>
                                        <Tab title="Images & Pdf" eventKey={"imagesAndPdf"}>
                                            <Row className=''>
                                                <Col ><OutsideLabInvReport {...{ patientOPNumber: patientOPNumber }}/></Col>
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                )}

            </Modal.Body>
        </Modal>
    )
}

export default PrevVisitDetails