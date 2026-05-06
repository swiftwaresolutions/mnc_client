import { FormLabel, Container, Row, Col, Button, Modal } from "react-bootstrap";
import ClinicalLayout from "../../ClinicalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toastSuccessBounceDark } from "../../../../utils/toast";
import CaseSheetApiService from "../../../../api/case-sheet/case-sheet-api-service";
import { RootState } from "../../../../state/store";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { routerPathNames } from "../../../../routes/routerPathNames";
import { ConsultantApiService } from "../../../../api/consultant/consultant-api-service";
import { DepartmentApiService } from "../../../../api/department/department-api-service";
import { clearErrorHandling, errorHandling } from "../../../../error/state/error-handle-action";
import { AxiosError } from "axios";
import SearchTemplates from "./search-template";
import CreateTemplate from "./create-template";
import DischargeSummaryData from "./components/DischargeSummaryData";
import DischargeProcedure from "./components/DischargeProcedure";
import DischargeMedicine from "./components/DischargeMedicine";
import DischargeLab from "./components/DischargeLab";
import DischargeFooter from "./components/DischargeFooter";
import DisChargeHeader from "./components/DischargeHeader";
import ReactToPrint from "react-to-print";
import DischargePrint from "./components/DischargePrint";
import { LaboratoryApiService } from "../../../../api/laboratory/laboratory-api-service";
import { PrescriptionApiService } from "../../../../api/prescription/prescription-api-service";

const dischargeSummaryData: any[] = [
    {
        id: "1",
        name: "DIAGNOSIS",
        fieldName: "diagnosis",
    },
    {
        id: "2",
        name: "HISTORY",
        fieldName: "history",
    },
    {
        id: "3",
        name: "EXAMINATION",
        fieldName: "examination",
    },
    {
        id: "4",
        name: "TREATMENT",
        fieldName: "treatment",
    },
    {
        id: "5",
        name: "COURSE IN THE HOSPITAL",
        fieldName: "courseInTheHospital",
    },
    {
        id: "6",
        name: "OPERATIVE FINDINGS",
        fieldName: "operativeFindings",
    },
    {
        id: "7",
        name: "CONDITION OF PATIENT",
        fieldName: "conditionOfPatient",
    },
    {
        id: "8",
        name: "EMERGENCY INDICATION",
        fieldName: "emergencyIndication",
    },
    {
        id: "9",
        name: "DISCHARGE ADVICE",
        fieldName: "dischargeAdvice",
    },
    {
        id: "10",
        name: "GYNAECOLOGY",
        fieldName: "gynaecology",
    },
    {
        id: "11",
        name: "OBSTETRICS",
        fieldName: "obstetrics",
    },
    {
        id: "12",
        name: "NEONATAL",
        fieldName: "neonatal",
    },
    {
        id: "13",
        name: "BABY DETAILS",
        fieldName: "babyDetail",
    },
    {
        id: "14",
        name: "OUTSIDE MEDICINE",
        fieldName: "outSideMedicine",
    },
];

export interface dischargeSummaryInputFormatInterface {

}

const dischargeSummaryInputFormat = {
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
    date: "",
    time: "",
    reviewDTM: "0000-00-00T00:00",
    outSideMedicine: "",
};

const DischargeSummary = () => {

    const dispatch = useDispatch();
    const loginData = useSelector((state: RootState) => state.loginData);
    const { clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer);

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();
    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService();
    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService();
    const consultantApiService: ConsultantApiService = new ConsultantApiService();
    const departmentApiService: DepartmentApiService = new DepartmentApiService();

    let patientDetails = clinicalCurrentIpPatient;

    let createDiagnosisDetailsRequestListModel = {
        patId: 0,
        vstId: 0,
        ipId: 0,
        summaryId: 0,
        selectedDiagnosis: [{ id: 0, name: "" }],
        isValid: 0,
    };

    let createConsultantDetailsRequestListModel = {
        summaryId: 0,
        selectedConsultant: [{ id: 0, name: "" }],
        isValid: 0,
    };

    let createDepartmentDetailsRequestListModel = {
        summaryId: 0,
        selectedDepartment: [{ id: 0, depName: "" }],
        isValid: 0,
    };

    const createprocedureRequestListFormat = {
        summaryId: 0,
        procDate: "",
        procName: "",
        report: "",
        date: "",
        time: "",
        uid: loginData.id,
        isActive: 0,
    };

    const [diagnosisRow, setDiagnosisRow] = useState<any>([{ ...createDiagnosisDetailsRequestListModel }]);
    const [textareaValue, setTextareaValue] = useState<dischargeSummaryInputFormatInterface>({ ...dischargeSummaryInputFormat });
    const [procedureRow, SetProcedureRow] = useState<any>([{ ...createprocedureRequestListFormat }]);
    const [presData, setpresData] = useState<any[]>([]);
    const [labData, setlabData] = useState<any[]>([]);
    const [departmentRow, setDepartmentRow] = useState<any>([{ ...createDepartmentDetailsRequestListModel }]);
    const [consultantRow, setConsultantRow] = useState<any>([{ ...createConsultantDetailsRequestListModel }]);

    const [doc, setDoc] = useState<any[]>([{ id: 0, name: "" }]);


    const [createTemplateShow, setCreateTemplateShow] = useState(false);
    const [searchTemplateShow, setSearchTemplateShow] = useState(false);
    const [createTemplateId, setCreateTemplateId] = useState<any>(null);
    const [searchTemplateId, setSearchTemplateId] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isPreviousSummary, setIsPreviousSummary] = useState({ status: false, id: "", isPrint: false });

    const handleSearchTemplateClose = (templateDetail: any, id: any) => {
        setSearchTemplateShow(false);
        const allField = [...dischargeSummaryData];
        const fieldName: any = allField.find((field: any) => field.id == id)?.fieldName;
        setTextareaValue((pre: dischargeSummaryInputFormatInterface) => ({ ...pre, [fieldName]: templateDetail }));
        if (templateDetail != "") {
            setIsPreviousSummary((pre: any) => ({ ...pre, isPrint: false }))
        }
    };
    const handleDischargeSummary = (fieldName: any, value: any) => {
        setTextareaValue((pre: any) => ({ ...pre, [fieldName]: value }));
        setIsPreviousSummary((pre: any) => ({ ...pre, isPrint: false }))
    };
    const handleSearchTemplateOpen = () => {
        setSearchTemplateShow(true)
    };

    const openSearchTemplate = (id: any) => {
        handleSearchTemplateOpen();
        setSearchTemplateId(id);
    };

    const handleCreateTemplateClose = () => {
        setCreateTemplateShow(false);
    };

    const handleCreateTemplateOpen = () => {
        setCreateTemplateShow(true)
    };

    const openCreateTemplate = (id: any) => {
        handleCreateTemplateOpen();
        setCreateTemplateId(id);
    };



    const saveDischargeSummary = async () => {
        try {
            setIsLoading(true);
            let updatedDiagnosisRow = [...diagnosisRow]
                .map((diagnos: any) => {
                    diagnos = { ...createDiagnosisDetailsRequestListModel, patId: patientDetails.patientId, vstId: patientDetails.visitId, ipId: patientDetails.ipId, diagnosisId: diagnos.selectedDiagnosis[0].id };
                    delete diagnos.selectedDiagnosis;
                    return diagnos;
                }).filter((diagnosis: any) => diagnosis.diagnosisId != 0);

            let updatedConsultantRow = [...consultantRow].map((consul: any) => {
                consul = { ...createConsultantDetailsRequestListModel, consultantId: consul.selectedConsultant[0].id };
                delete consul.selectedConsultant;
                return consul;
            }).filter((consultant: any) => consultant.consultantId != 0);

            let updatedDepartmentRow = [...departmentRow].map((depart: any) => {
                depart = { ...createDepartmentDetailsRequestListModel, deptId: depart.selectedDepartment[0].id };
                delete depart.selectedConsultant;
                return depart;
            }).filter((department: any) => department.deptId != 0);

            let updatedProcedureRow = [...procedureRow].filter((department: any) => department.procName != "");
            let temp = {
                ...textareaValue,
                patId: patientDetails.patientId,
                visitId: patientDetails.visitId,
                ipId: patientDetails.ipId,
                docId: patientDetails.doctorId,
                uid: loginData.id,
                createSummaryDiagnosisDetailsRequestList: [...updatedDiagnosisRow],
                createLabAndInvSummaryRequestList: [...updatedProcedureRow],
                createDisSumConsRequestList: [...updatedConsultantRow],
                createDisSumDeptRequestList: [...updatedDepartmentRow],
            };

            let preSummaryRes = await caseSheetApiService.saveDischargeSummary(temp);
            toastSuccessBounceDark("Discharge Summary Saved");
            setIsPreviousSummary((pre: any) => ({ ...pre, status: true, id: preSummaryRes.id, isPrint: true }))

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSummaryData = async () => {
        setIsLoading(true);
        try {
            if (patientDetails.visitId && isPreviousSummary.id) {
                let updatedDiagnosisRow = [...diagnosisRow].map((diagnos: any) => {
                    diagnos = { ...createDiagnosisDetailsRequestListModel, patId: patientDetails.patientId, vstId: patientDetails.visitId, ipId: patientDetails.ipId, diagnosisId: diagnos.selectedDiagnosis[0].id };
                    delete diagnos.selectedDiagnosis;
                    return diagnos;
                }).filter((diagnosis: any) => diagnosis.diagnosisId != 0);
                console.log(consultantRow);

                let updatedConsultantRow = [...consultantRow].map((consul: any) => {
                    consul = { ...createConsultantDetailsRequestListModel, consultantId: consul.selectedConsultant[0].id };
                    delete consul.selectedConsultant;
                    return consul;
                }).filter((consultant: any) => consultant.consultantId != 0);

                let updatedDepartmentRow = [...departmentRow].map((depart: any) => {
                    depart = { ...createDepartmentDetailsRequestListModel, deptId: depart.selectedDepartment[0].id };
                    delete depart.selectedConsultant;
                    return depart;
                }).filter((department: any) => department.deptId != 0);

                let updatedProcedureRow = [...procedureRow].filter((department: any) => department.procName != "");


                await caseSheetApiService.updateDischargeSummary(isPreviousSummary.id, {
                    ...textareaValue,
                    patId: patientDetails.patientId,
                    visitId: patientDetails.visitId,
                    ipId: patientDetails.ipId,
                    docId: patientDetails.doctorId,
                    uid: loginData.id,
                    createSummaryDiagnosisDetailsRequestList: [...updatedDiagnosisRow],
                    createLabAndInvSummaryRequestList: [...updatedProcedureRow],
                    createDisSumConsRequestList: [...updatedConsultantRow],
                    createDisSumDeptRequestList: [...updatedDepartmentRow],
                });
                toastSuccessBounceDark("Discharge Summary Updated");
                setIsPreviousSummary((pre: any) => ({ ...pre, isPrint: true }))
            }
        } catch (error: any) {
            console.log(error)
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevDischargeSummaryMap = async () => {
        try {
            if (patientDetails.visitId) {
                let preSummaryData = await caseSheetApiService.fetchDischargeSummaryByVstId(patientDetails.visitId);
                if (preSummaryData.status && preSummaryData.data.length > 0) {

                    preSummaryData = await preSummaryData.data[
                        preSummaryData.data.length - 1
                    ];

                    if (preSummaryData.dischargeDiagnosisDataList) {
                        let prevSummary = [...preSummaryData.dischargeDiagnosisDataList].map((diag: any) => {
                            diag = { ...createDiagnosisDetailsRequestListModel, selectedDiagnosis: [{ id: diag.diagnosisId, name: diag.name }] };
                            return diag;
                        }
                        );
                        if (prevSummary.length > 0) {
                            setDiagnosisRow([...prevSummary]);
                        } else {
                            setDiagnosisRow([{ ...createDiagnosisDetailsRequestListModel }]);
                        }
                        delete preSummaryData.dischargeDiagnosisDataList;
                    }

                    if (preSummaryData.dischargeLabInvSummaryDataList) {
                        let prevSummary = [...preSummaryData.dischargeLabInvSummaryDataList].map((labInv: any) => {
                            labInv = { ...createprocedureRequestListFormat, ...labInv };
                            return labInv;
                        });
                        if (prevSummary.length > 0) {
                            SetProcedureRow([...prevSummary]);
                        } else {
                            SetProcedureRow([{ ...createprocedureRequestListFormat }]);
                        }
                        delete preSummaryData.dischargeLabInvSummaryDataList;
                    }

                    if (preSummaryData.disSumConsultantDataList) {
                        let prevSummary = [...preSummaryData.disSumConsultantDataList].map((consul: any) => {
                            consul = { ...createConsultantDetailsRequestListModel, selectedConsultant: [{ id: consul.consultantId, name: consul.name }] };
                            return consul;
                        }
                        );
                        if (prevSummary.length > 0) {
                            setConsultantRow([...prevSummary]);
                        } else {
                            setConsultantRow([{ ...createConsultantDetailsRequestListModel }]);
                        }
                        delete preSummaryData.disSumConsultantDataList;
                    }
                    if (preSummaryData.disSumDeptDataList) {
                        let prevSummary = [...preSummaryData.disSumDeptDataList].map((dept: any) => {
                            dept = { ...createDepartmentDetailsRequestListModel, selectedDepartment: [{ id: dept.deptId, depName: dept.name }] };
                            return dept;
                        }
                        );
                        if (prevSummary.length > 0) {
                            setDepartmentRow([...prevSummary]);
                        } else {
                            setDepartmentRow([{ ...createDepartmentDetailsRequestListModel }]);
                        }
                        delete preSummaryData.disSumDeptDataList;
                    }
                    if (preSummaryData.consultantId) {
                        setDoc([{ id: preSummaryData.consultantId, name: preSummaryData.consultantName }])
                    }
                    setIsPreviousSummary({ status: true, id: preSummaryData.id, isPrint: true });
                    delete preSummaryData.ipId;
                    delete preSummaryData.id;
                    delete preSummaryData.is_active;
                    delete preSummaryData.uid;
                    delete preSummaryData.vstId;
                    delete preSummaryData.consultantId;
                    delete preSummaryData.patId;
                    delete preSummaryData.consultantName;

                    // let dateTimeArr = String(preSummaryData.reviewDTM).split(" ")
                    // let generateDtm = `${dateTimeArr[0]}T${dateTimeArr[1].split(":")[0]}:${dateTimeArr[1].split(":")[1]}`
                    // preSummaryData['reviewDTM'] = generateDtm
                    // console.log(preSummaryData)
                    setTextareaValue(preSummaryData);
                }
            }


        } catch (error) {
            handleError(error);
            console.log(error)
        }
    };

    const handlePrevprescriptionMap = async () => {
        try {
            if (patientDetails.visitId) {
                let preSummaryData = await prescriptionApiService.fetchPrescriptionDetailsByVstId(patientDetails.visitId, 1);
                setpresData(preSummaryData);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handlePrevlabMap = async () => {
        try {
            if (patientDetails.visitId) {
                let preSummaryData = await laboratoryApiService.fetchLabResultsByVisitId(
                    patientDetails.visitId
                );
                setlabData(preSummaryData);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const init = async () => {
        await handlePrevDischargeSummaryMap();
        await handlePrevprescriptionMap();
        await handlePrevlabMap();
    };

    useEffect(() => {
        init();
        return () => {
            dispatch(clearErrorHandling());
        };
    }, []);

    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {
        }
    };

    const casesheet = "DISCHARGE SUMMARY"
    return <>
        <ClinicalLayout {...{casesheet}}>
            {/* <FormLabel className='heading mx-auto'>DISCHARGE SUMMARY ENTRY OF <span className="text-dark">{patientDetails?.fullName} - {patientDetails.displayNumber} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}
            <Container fluid="lg" className='clinical-general-container overflow-auto d-flex  h-100 flex-column'>

                <Row className='h-100 overflow-auto' >
                    <Col className='d-flex flex-column h-100' >
                        <Container className="d-flex flex-column h-100">
                            <Row className="border h-100 border-black mt-4 mx-2 py-3 rounded overflow-auto">
                                <Col xs="12" className="px-3 mb-2">
                                    <DisChargeHeader {...{ caseSheetApiService, setDiagnosisRow, createDiagnosisDetailsRequestListModel, diagnosisRow }} />
                                </Col>
                                <Col>
                                    <DischargeSummaryData {...{ dischargeSummaryData, handleDischargeSummary, textareaValue, setTextareaValue, openSearchTemplate, openCreateTemplate }} />
                                </Col>
                                <Col xs="12">
                                    <DischargeMedicine {...{ isPreviousSummary, isLoading, saveDischargeSummary, updateSummaryData, presData }} />
                                </Col>
                                <Col xs="12">
                                    <DischargeProcedure {...{ procedureRow, SetProcedureRow, createprocedureRequestListFormat }} />
                                </Col>
                                
                                <Col xs="12">
                                    <DischargeLab {...{ labData }} />
                                </Col>
                                <Col md={12} className="my-1">
                                    <DischargeFooter {...{
                                        handleDischargeSummary, setDoc, doc,
                                        consultantRow, setConsultantRow, consultantApiService, createConsultantDetailsRequestListModel,
                                        departmentRow, departmentApiService, setDepartmentRow,
                                        createDepartmentDetailsRequestListModel, textareaValue, setTextareaValue
                                    }} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-end my-2'>
                      
                        {
                            isPreviousSummary.status ? (
                                <Button variant="primary" className="m-1" disabled={isLoading} onClick={updateSummaryData}>
                                    {isLoading ? 'Updating...' : 'Update'}
                                </Button>
                            ) : (
                                <Button variant="success" className="m-1" disabled={isLoading} onClick={saveDischargeSummary}>
                                    {isLoading ? 'Submitting...' : 'Save'}
                                </Button>)
                        }
                    </Col>
                </Row>
            </Container>

            {/* CREATE TEMPLATE */}

            <Modal
                show={createTemplateShow}
                dialog
                onHide={handleCreateTemplateClose}
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Body className="p-0">
                    <CreateTemplate handleClose={handleCreateTemplateClose} patientDetails={patientDetails} loginData={loginData} id={createTemplateId} setCreateTemplateShow={setCreateTemplateShow} />
                </Modal.Body>
            </Modal>

            {/* Search TEMPLATE */}

            <Modal
                show={searchTemplateShow}
                dialog
                centered
                size="lg"
                onHide={() => setSearchTemplateShow(false)}
            >
                <Modal.Body className="p-0">
                    <SearchTemplates handleClose={handleSearchTemplateClose} fieldId={searchTemplateId} setSearchTemplateShow={setSearchTemplateShow} />
                </Modal.Body>
            </Modal>
            {/* <DischargePrint {...{ doc, dischargeSummaryData, textareaValue, printRef, patientDetails }} /> */}
        </ClinicalLayout>
    </>;
};

export default DischargeSummary;

