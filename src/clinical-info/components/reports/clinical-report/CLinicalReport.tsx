import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import "./ClinicalReport.css";
import CaseSheetApiService from "../../../../api/case-sheet/case-sheet-api-service";
import { ImageApiService } from "../../../../api/image/image-api-service";
import { LaboratoryApiService } from "../../../../api/laboratory/laboratory-api-service";
import { PatientApiService } from "../../../../api/patient/patient-api-service";
import { PrescriptionApiService } from "../../../../api/prescription/prescription-api-service";
import { CaseSheetModel, PatientImageResponse, ScreenDetails, visitDetailInterface } from "./model/interfaces";
import { errorHandling } from "../../../../error/state/error-handle-action";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../state/store";
import VisitDetailsTab from "./tabs/VisitDetailsTab";
import ImageViewTab from "./tabs/ImageViewTab";
import UploadedSelectedImageView from "./components/UploadedSelectedImageView";
import PrescriptionTab from "./tabs/PrescriptionTab";
import LabAndProcTab from "./tabs/LabAndProcTab";
import { handleError } from "../../../../utils/errorUtil";
import { generalCaseSheetValidate } from "./validation/caseSheetValidations";
import CaseSheetTab from "./tabs/CaseSheetTab";
import OutsideLabAndInvTab from "./tabs/OutsideLabAndInvTab";
import AntenatalCaseSheetView from "./components/AntenatalCaseSheetView";
import GeneralCaseSheetTab from "./tabs/GeneralCaseSheetTab";
import { error } from "console";
import VitalsTab from "./tabs/VitalsTab";
import PdfViewTab from "./tabs/PdfViewTab";
import { InvestigationApiService } from "../../../../api/investigation/investigation-api-service";

const ClinicalReport: React.FC = () => {

    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer);
    let patientDetails: any;
    if (isIp) {
        patientDetails = clinicalCurrentIpPatient;
    } else {
        patientDetails = clinicalCurrentOpPatient;
    }

    const patientApiService = new PatientApiService();
    const caseSheetApiService = new CaseSheetApiService();
    const prescriptionApiService = new PrescriptionApiService();
    const laboratoryApiService = new LaboratoryApiService();
    const investigationApiService = new InvestigationApiService();
    const imageApiService = new ImageApiService();

    const dispatch = useDispatch();

    // let caseSheetInit: CaseSheetModel = {
    //     complaints: [],
    //     history: {},
    //     vitals: {},
    //     examination: {},
    //     allergy: {},
    //     diagnosis: {},
    //     diagnosisDetails: [],
    //     followUp: {},
    //     isEmptyCaseSheet: true
    // }

    const [screenDetails, setScreenDetails] = useState<ScreenDetails>({
        isLoading: false,
        message: "Details is Empty",
        color: "danger",
        currentImgIdx: -1,
        visitTabOpenAllAccordian: false,
        visitTabActiveAccordian: ["0"]
    })

    const [patientVisit, setPatientVisit] = useState<visitDetailInterface[]>([]);
    const [patientImageDetails, setPatientImageDetails] = useState<PatientImageResponse[]>([]);
    const [showImgModel, setShowImgModel] = useState(false);
    const [investigationPdf, setInvestigationPdf] = useState<any[]>([])

    const visitDetailsTabOpenAllAccordian = async () => {
        try {
            let activeCondition = !screenDetails.visitTabOpenAllAccordian

            let activeKeys = activeCondition ? patientVisit.map((visit, idx) => `${idx}`) : []
            setScreenDetails((prev) => ({ ...prev, visitTabOpenAllAccordian: activeCondition, visitTabActiveAccordian: activeKeys }))
            activeCondition && getPatientVisitDetails(1);
        } catch (error) {
            console.error(error)
        }
    };

    const fetchClinicalDetails = (visitId: string) => {
        return Promise.all([
            prescriptionApiService.fetchPrescriptionDetailsByVstId(`${visitId}`, 0).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
            laboratoryApiService.fetchLabResultsByVisitId(`${visitId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
            caseSheetApiService.fetchGeneralCaseSheetByVstId(`${visitId}`).catch((error: AxiosError) => { handleError(dispatch, error); return { data: [] }; }),
            //laboratoryApiService.fetchOutsideLabResultDetailsByVistiId(`${visitId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
            //laboratoryApiService.fetchAllInvDetailsByVisitId(`${visitId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
            caseSheetApiService.fetchOpVitalsByVstId(`${visitId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; })
        ]);
    };
    const getPatientVisitClinicalDetails = async (event: React.MouseEvent, visitItem: visitDetailInterface, visitIdx: number) => {
        try {
            let target = event.target as HTMLDivElement
            let condition = target.offsetParent?.className.includes("collapsed")
            if (condition) {
                let clinicalDetails = await fetchClinicalDetails(`${visitItem.visitId}`)
                let visitDetailsDum = [...patientVisit]
                visitDetailsDum[visitIdx].prescription = clinicalDetails[0]
                visitDetailsDum[visitIdx].laboratory = clinicalDetails[1]
                //visitDetailsDum[visitIdx].outsideLab = clinicalDetails[3]
                //visitDetailsDum[visitIdx].outsideInv = clinicalDetails[4]
                if (clinicalDetails[2]?.length > 0) {
                    visitDetailsDum[visitIdx].generalCaseSheet = clinicalDetails[2][clinicalDetails[2]?.length - 1]
                    // visitDetailsDum[visitIdx].caseSheet = caseSheetValidtate(visitDetailsDum[visitIdx])

                }
                if (clinicalDetails[3].length > 0) {
                    visitDetailsDum[visitIdx].vitals = clinicalDetails[3]
                    // visitDetailsDum[visitIdx].vitals = clinicalDetails[3][clinicalDetails[3].length - 1]
                }
                setPatientVisit([...visitDetailsDum]);
            }
        } catch (error) {
            handleError(dispatch, error);
        }
    };
    // const caseSheetValidtate = (visitItem: visitDetailInterface) => {
    //     let casesheet: CaseSheetModel = { ...visitItem.caseSheet }
    //     casesheet = generalCaseSheetValidate(casesheet, visitItem.generalCaseSheet)
    //     return casesheet;
    // };
    const getPatientVisitDetails = async (maxGetCondition: number): Promise<void> => {
        try {
            if (!patientDetails.patientId) {
                throw new Error("Patient id does not exit.");
            }
            setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "Loading...", color: "primary" }))
            const promises: any[] = [];
            let visitResponse: visitDetailInterface[] = await patientApiService.getPatientVisitDetailsByPatId(patientDetails.patientId);

            visitResponse = visitResponse.map((item: visitDetailInterface) => ({
                ...item,
                prescription: [],
                laboratory: [],
                //outsideLab: [],
                //outsideInv: [],
                // caseSheet: { ...caseSheetInit },
                generalCaseSheet: {},
                vitals: []
            }));
            maxGetCondition = maxGetCondition == 1 ? visitResponse.length : maxGetCondition
            visitResponse.forEach((item: visitDetailInterface, index: number) => {
                if (index < maxGetCondition) {
                    promises.push(fetchClinicalDetails(`${item.visitId}`))
                }
            });
            const resultsResponse = await Promise.all(promises);
            resultsResponse.forEach((item, index) => {
                visitResponse[index].prescription = item[0];
                visitResponse[index].laboratory = item[1];
                //visitResponse[index].outsideLab = item[3]
                //visitResponse[index].outsideInv = item[4]
                if (item[2]?.length > 0) {
                    visitResponse[index].generalCaseSheet = item[2][item[2]?.length - 1]
                }
                if (item[3]?.length > 0) {
                    visitResponse[index].vitals = item[3]
                    // visitResponse[index].vitals = item[3][item[3]?.length - 1]
                }
                // visitResponse[index].caseSheet = caseSheetValidtate(visitResponse[index])
            });
            setPatientVisit([...visitResponse]);
            setScreenDetails((pre: any) => ({ ...pre, isLoading: false, message: "", color: "danger" }))
        } catch (error) {
            handleError(dispatch, error);
            setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "Error Fetching Data", color: "danger" }))
        }
    };
    const fetchUploadedImage = async () => {
        try {
            let imageDetailResponse: PatientImageResponse[] = await imageApiService.fetchPatientUploadedImageDetails(`${patientDetails.patientId}`)
            setPatientImageDetails(imageDetailResponse)
        } catch (error) {
            handleError(dispatch, error);
        }
    };
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
    const handleOnImageClick = (idx: number) => {
        setScreenDetails((prev) => ({ ...prev, currentImgIdx: idx }));
        setShowImgModel(true);
    };

    useEffect(() => {
        getPatientVisitDetails(2);
        // fetchUploadedImage()
        // fetchUploadedPdf();
    }, []);

    return (
        <Container fluid="xl" className='shadow clinical-report-container h-100 p-2'>
            <Row className='h-100 flex-column flex-nowarap border border-black rounded'>
                <Col className="d-flex flex-column flex-nowrap overflow-auto">
                    <Row xs={1} lg={2} className=" justify-content-center m-2 p-2 border rounded align-items-center bg-light">
                        <Col className="flex-grow-1">
                            <Row className='align-items-center'>
                                <Col className='fw-bold py-0 text-primary text-start text-uppercase ps-2 letter-spacing-05px'>
                                    PATIENT DETAILS :- <span className="text-dark">{patientDetails?.fullName} / {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} / {patientDetails?.age} / {patientDetails?.gender}</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="pt-2 pt-lg-0 w-auto fw-bold text-end ">
                            <Button variant="dark" className="py-1 fs-11px" onClick={visitDetailsTabOpenAllAccordian}>Open All Visit</Button>
                        </Col>
                    </Row>
                    <Tabs defaultActiveKey="generalCaseSheet" className="justify-content-evenly">
                        {/* <Tab className='h-100 pb-1' eventKey="visitDetails" title="Visit Details">
                            <VisitDetailsTab {...{ patientVisit, screenDetails, setScreenDetails, getPatientVisitClinicalDetails }} />
                        </Tab> */}
                        {/* <Tab className='h-100 pb-1' eventKey="caseSheet" title="CaseSheet">
                            <CaseSheetTab {...{ patientVisit, screenDetails, setScreenDetails, getPatientVisitClinicalDetails }} />
                        </Tab> */}
                        
                        <Tab className='h-100 pb-1' eventKey="generalCaseSheet" title="General">
                            <GeneralCaseSheetTab {...{ patientVisit, screenDetails, getPatientVisitClinicalDetails,patientDetails }} />
                        </Tab>
                        <Tab className="h-100 pb-1" eventKey="vitals" title="Vitals">
                            <VitalsTab  {...{ patientVisit, screenDetails, getPatientVisitClinicalDetails }} />
                        </Tab>
                        <Tab className='h-100 pb-1' eventKey="prescription" title="Prescription">
                            <PrescriptionTab {...{ patientVisit, screenDetails, setScreenDetails, getPatientVisitClinicalDetails,patientDetails }} />
                        </Tab>
                        {/* <Tab className='h-100 pb-1' eventKey="laboratory" title="Lab And Procedure">
                            <LabAndProcTab {...{ patientVisit, screenDetails, setScreenDetails, getPatientVisitClinicalDetails }} />
                        </Tab> */}
                        {/* <Tab className='h-100 pb-1' eventKey="uploadedPdf" title="Investigation PDF">
                            <PdfViewTab investigationPdf={investigationPdf} />
                        </Tab> */}
                        {/* <Tab className='h-100 pb-1' eventKey="outsideLaboratory" title="Outside Lab And Inv">
                            <OutsideLabAndInvTab {...{ patientVisit, screenDetails, setScreenDetails, getPatientVisitClinicalDetails }} />
                        </Tab>
                        <Tab className='h-100 pb-1' eventKey="image" title="Image">
                            <ImageViewTab {...{ patientImageDetails, handleOnImageClick, showImgModel, setShowImgModel, screenDetails }} />
                        </Tab> */}
                    </Tabs>
                </Col>
            </Row>
        </Container>
    )
}

export default ClinicalReport;


