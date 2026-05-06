import React, { useState, useEffect, Fragment } from 'react'
import CommonLayout from '../../ClinicalLayout'
import { FormLabel, Container, Col, Tabs, Tab, Row, Button, Modal } from 'react-bootstrap'
import { Form } from 'react-router-dom';
import History from './components/history';
import Discussion from './components/discussion-diagnosis';
import Vitals from './components/vitals-examination';
import { useDispatch, useSelector } from 'react-redux';
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service';
import ClinicalNavigationButtons from '../../ClinicalNavigationButtons';
import CreateTemplate from './components/create-template';
import PreviewGeneralCaseSheet from '../general-case-sheet/components/preview-general-case-sheet';
import SearchTemplate from './components/search-template';
import { AxiosError } from 'axios';
import { clearErrorHandling, errorHandling } from '../../../../error/state/error-handle-action';
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast';
import { RootState } from '../../../../state/store';
import { handleError } from '../../../../utils/errorUtil';


const historyData = [
    {
        id: "1",
        name: "History of Present Illness",
        fieldName: "presentIllness",
    },
    {
        id: "2",
        name: "Past/Personal History",
        fieldName: "pastHistory",
    },
    {
        id: "3",
        name: "History of Allergy",
        fieldName: "allergy",
    }
]

const examinationData = [
    {
        id: "4",
        name: "EXAMINATION",
        fieldName: "examination",
    },
]

const diagnosisData = [
    {
        id: "5",
        name: "DIAGNOSIS",
        fieldName: "diagnosis",
    },
    {
        id: "6",
        name: "DISCUSSION",
        fieldName: "discussion",
    },
    {
        id: "7",
        name: "RECOMMENDATIONS",
        fieldName: "recomendations",
    }
]

const DirectGeneralCaseSheet = () => {
    const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
    const {id:userId} = useSelector((s:RootState)=>s.loginData)
    let patientDetails: any;

    let ipId;

    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }
    const temporaryCaseSheetModel = {
        presentIllness: "",
        pastHistory: "",
        treatmentHistory: "",
        personalHistory: "",
        investigationHistory: "",
        allergy: "",
        menstrualHistory: "",
        oralCavity: "",
        cvs: "",
        res: "",
        abdominal: "",
        cns: "",
        perVaginal: "",
        oralRectal: "",
        skin: "",
        musculoskeletal: "",
        additionalFindings: "",
        differentialDiagnosis: "",
        confirmedDiagnosis: "",
        medications: "",
        recomendations: "",
        proceduresPlanned: "",
        followUpPlan: "",
        temperature: "",
        pulse: "",
        rr: "",
        bp: "",
        spo2: "",
        height: "0",
        weight: "0",
        bmi: "0",
        examination: "",
        diagnosis: "",
        discussion: "",
        generalPhysical:"",
        others:""
    }
    let createComplaintDetailsRequestListModel = {
        patId: clinicalCurrentOpPatient.patientId,
        vstId: clinicalCurrentOpPatient.visitId,
        ipId: 0,
        caseSheetType: 1,
        caseSheetId: 0,
        complaintId: 0,
        isValid: 1,
        number: 1,
        period: "Days",
        selectedComplaint: [{ id: 0, name: "" }]
    };

    let createDiagnosisDetailsRequestListModel = {
        patId: clinicalCurrentOpPatient.patientId,
        vstId: clinicalCurrentOpPatient.visitId,
        ipId: 0,
        caseSheetType: 1,
        caseSheetId: 0,
        diagnosisId: 0,
        isValid: 1,
        selectedDiagnosis: [{ id: 0, name: "" }]
    }

    const dispatch = useDispatch()

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();

    const [temporaryCaseSheet, setTemporaryCaseSheet] = useState({ ...temporaryCaseSheetModel })
    const [SavedCaseSheet, setSavedCaseSheet] = useState<{}>({})
    const [historyComplaintRow, setHistoryComplaintRow] = useState<any>([{ ...createComplaintDetailsRequestListModel }]);
    const [diagnosisRow, setDiagnosisRow] = useState<any>([{ ...createDiagnosisDetailsRequestListModel }])
    const [createTemplateShow, setCreateTemplateShow] = useState(false)
    const [searchTemplateShow, setSearchTemplateShow] = useState(false);
    const [previewCaseSheetShow, setPreviewCaseSheetShow] = useState(false);
    const [createTemplateId, setCreateTemplateId] = useState<any>(null);
    const [searchTemplateId, setSearchTemplateId] = useState<any>(null);
    const [isPreviousCaseSheet, setIsPreviousCaseSheet] = useState({ status: false, id: '' })

    const [isLoading, setIsLoading] = useState(false);

    const handleSearchTemplateClose = (templateDetail: any, id: any) => {
        setSearchTemplateShow(false);
        const allField = [...historyData, ...examinationData, ...diagnosisData]
        const fieldName: any = allField.find((field: any) => field.id == id)?.fieldName
        setTemporaryCaseSheet((pre: any) => ({ ...pre, [fieldName]: templateDetail }))
    }

    const handleInputChange = (value: string, fieldName: string) => {
        if (fieldName == 'height' || fieldName == "weight") {
            value = hanldeNumberInputZero(value)

            setTemporaryCaseSheet((pre: any) => {
                if (fieldName == "height") {
                    let height = Number(((Number(value) / 100) * (Number(value) / 100)).toFixed(2))
                    pre.bmi = (Number(pre.weight) / (height)).toFixed(2)
                } else if (fieldName == "weight") {
                    let weight = Number(value)
                    pre.bmi = (Number(weight) / Number(((Number(pre.height) / 100) * (Number(pre.height) / 100)).toFixed(2))).toFixed(2)
                }
                if (pre.bmi == "NaN" || pre.bmi == "Infinity") {
                    pre.bmi = 0
                }
                return { ...pre, [fieldName]: value }
            })
        } else {
            setTemporaryCaseSheet((pre: any) => ({ ...pre, [fieldName]: value }))
        }

    }

    const getHandlePreviousCaseSheetResponse = async () => {
        try {
            if (clinicalCurrentOpPatient.visitId) {
                return await caseSheetApiService.fetchGeneralCaseSheetByVstId(clinicalCurrentOpPatient.visitId)
            }
        } catch (error) {
            // handleError(dispatch,error)
        }
    }
    const hanldeNumberInputZero = (value: string) => {
        if (value.length > 1 && value[0] == "0") {
            value = value.slice(1, value.length)
        } else if (!value) {
            value = "0"
        } else {
            value = value
        }
        return value
    }
    const handleCreateTemplateOpen = () => setCreateTemplateShow(true);

    const handleSearchTemplateOpen = () => setSearchTemplateShow(true);

    const handlePreviewCaseSheetopen = () => setPreviewCaseSheetShow(true);

    const handlePreviewCaseSheetClose = () => {
        setPreviewCaseSheetShow(false);
    }

    const handleCreateTemplateClose = () => {
        setCreateTemplateShow(false);
    }

    const openCreateTemplate = (id: any) => {
        handleCreateTemplateOpen();
        setCreateTemplateId(id);
    }

    const openSearchTemplate = (id: any) => {
        handleSearchTemplateOpen();
        setSearchTemplateId(id);
    }

    const openPreviewCaseSheet = () => {
        handlePreviewCaseSheetopen();
    }

    const saveGeneralCaseSheetData = async () => {
        setIsLoading(true)
        try {
            if (!patientDetails.visitId) {
                return toastErrorBounceDark("The patient has no Visit Details")
            }
            let updatedComplaintRow = [...historyComplaintRow].map((his: any) => {
                his = { ...createComplaintDetailsRequestListModel, complaintId: his.selectedComplaint[0]?.id, number: his.number, period: his.period, }
                delete his.selectedComplaint
                return his
            }).filter((his: any) => his.complaintId != 0)
            let updatedDiagnosisRow = [...diagnosisRow].map((diagnos: any) => {
                diagnos = { ...createDiagnosisDetailsRequestListModel, diagnosisId: diagnos.selectedDiagnosis[0]?.id }
                delete diagnos.selectedDiagnosis
                return diagnos
            }).filter((diagnosis: any) => diagnosis.diagnosisId != 0)
            let res = await caseSheetApiService.saveGeneralCaseSheet({ ...temporaryCaseSheet,uid:userId, patientId: clinicalCurrentOpPatient.patientId, ipId: "0", visitId: clinicalCurrentOpPatient.visitId, createComplaintDetailsRequestList: [...updatedComplaintRow], createDiagnosisDetailsRequestList: [...updatedDiagnosisRow] });
            await handleSavedCaseSheet()
            toastSuccessBounceDark("General Case Sheet Saved")
            // openPreviewCaseSheet();
            setIsPreviousCaseSheet({ status: true, id: res.id })
        } catch (error: any) {
            handleError(dispatch,error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateGeneralCaseSheetData = async () => {
        setIsLoading(true)
        try {
            if (!patientDetails.visitId) {
                return toastErrorBounceDark("The patient has no Visit Details : "+ patientDetails.visitId )
            }
            if (!isPreviousCaseSheet.id) {
                return toastErrorBounceDark("The patient has no Previous Data")
            }
            let updatedComplaintRow = [...historyComplaintRow].map((his: any) => {
                his = { ...createComplaintDetailsRequestListModel, complaintId: his.selectedComplaint[0].id, number: his.number, period: his.period, }
                delete his.selectedComplaint
                return his
            }).filter((his: any) => his.complaintId != 0)
            let updatedDiagnosisRow = [...diagnosisRow].map((diagnos: any) => {
                diagnos = { ...createDiagnosisDetailsRequestListModel, diagnosisId: diagnos.selectedDiagnosis[0].id }
                delete diagnos.selectedDiagnosis
                return diagnos
            }).filter((diagnosis: any) => diagnosis.diagnosisId != 0)

            await caseSheetApiService.updateGeneralCaseSheet(isPreviousCaseSheet.id, 1, { ...temporaryCaseSheet,uid:userId,patientId: clinicalCurrentOpPatient.patientId, ipId: "0", visitId: clinicalCurrentOpPatient.visitId, createComplaintDetailsRequestList: [...updatedComplaintRow], createDiagnosisDetailsRequestList: [...updatedDiagnosisRow] });
            await handleSavedCaseSheet()
            toastSuccessBounceDark("General Case Sheet Updated")
            // openPreviewCaseSheet();
        } catch (error: any) {
            handleError(dispatch,error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePreviousCaseSheet = async () => {
        try {
            let previousCaseSheet = await getHandlePreviousCaseSheetResponse()
            if (previousCaseSheet.length > 0) {

                previousCaseSheet = await previousCaseSheet[previousCaseSheet.length - 1]

                if (previousCaseSheet.complaintDataList) {
                    let prevComplaints = [...previousCaseSheet.complaintDataList].map((complaint: any) => {
                        complaint = { ...createComplaintDetailsRequestListModel, complaintId: complaint.id, number: complaint.no, period: complaint.periods, selectedComplaint: [{ id: complaint.id, name: complaint.name }] }
                        return complaint
                    });
                    if (prevComplaints.length > 0) {
                        setHistoryComplaintRow([...prevComplaints]);
                    } else {
                        setHistoryComplaintRow([{ ...createComplaintDetailsRequestListModel }]);
                    }
                    delete previousCaseSheet.complaintDataList;
                }
                if (previousCaseSheet.diagnosisDetailsData) {
                    let prevDiagnosis = [...previousCaseSheet.diagnosisDetailsData].map((diagnos: any) => {
                        diagnos = { ...createDiagnosisDetailsRequestListModel, diagnosisId: diagnos.id, selectedDiagnosis: [{ id: diagnos.id, name: diagnos.name }] }
                        return diagnos
                    });
                    if (prevDiagnosis.length > 0) {
                        setDiagnosisRow([...prevDiagnosis]);
                    } else {
                        setDiagnosisRow([{ ...createDiagnosisDetailsRequestListModel }]);
                    }
                    delete previousCaseSheet.diagnosisDetailsData;
                }

                setTemporaryCaseSheet(previousCaseSheet);
                setIsPreviousCaseSheet({ status: true, id: previousCaseSheet.id })
            }
        } catch (error) {
            handleError(dispatch,error)
        }
    }

    const handleSavedCaseSheet = async () => {
        try {
            let previousCaseSheet = await getHandlePreviousCaseSheetResponse()
            if (previousCaseSheet.status == true) {
                setSavedCaseSheet(previousCaseSheet.data[previousCaseSheet?.data?.length - 1]);
                //setTemporaryCaseSheet(previousCaseSheet.data[previousCaseSheet.data.length - 1]);
                //createComplaintDetailsRequestListModel
            }
        } catch (error) {
            handleError(dispatch,error)
        }
    }
    const fetchPrevVitalsByVisitId = async () => {
        try {
            let prevVitalsResponse = await caseSheetApiService.fetchOpVitalsByVstId(`${clinicalCurrentOpPatient.visitId}`)
            if ([...prevVitalsResponse].length != 0) {
                prevVitalsResponse = prevVitalsResponse[0]
                delete prevVitalsResponse.id
                delete prevVitalsResponse.vstId
                delete prevVitalsResponse.patId
                delete prevVitalsResponse.datetime
                setTemporaryCaseSheet((pre: any) => ({ ...pre, ...prevVitalsResponse }));
            }
        } catch (error) {
            handleError(dispatch,error)
        }
    }
    const init = async () => {
        await handlePreviousCaseSheet();
        fetchPrevVitalsByVisitId();
    }
    useEffect(() => {
        init()
        return () => {
            dispatch(clearErrorHandling())
        }
    }, []);


    const casesheet = "GENERAL CASESHEET"
    return (
        <Fragment>
            <CommonLayout {...{casesheet}}>
                {/* <FormLabel className='heading mx-auto'>GENERAL CASE SHEET ENTRY OF <span className="text-dark">{clinicalCurrentOpPatient?.fullName} / {clinicalCurrentOpPatient?.displayNumber} / {clinicalCurrentOpPatient?.age} / {clinicalCurrentOpPatient?.gender}</span></FormLabel> */}
                <Container fluid="lg" className='clinical-general-container overflow-auto d-flex  h-100 flex-column'>
                    <Row className='h-100 overflow-auto'>
                        <Col className='d-flex flex-column h-100'>
                            <Tabs
                                defaultActiveKey="history"
                                id="generalCaseSheetId"
                                className="mb-2 justify-content-evenly"
                            >
                                <Tab eventKey="history" title={"History"} className='h-100'>
                                    <History
                                        historyData={historyData}
                                        historyComplaintRow={historyComplaintRow}
                                        setHistoryComplaintRow={setHistoryComplaintRow}
                                        createComplaintDetailsRequestListModel={createComplaintDetailsRequestListModel}
                                        handleInputChange={handleInputChange}
                                        setTemporaryCaseSheet={setTemporaryCaseSheet}
                                        temporaryCaseSheet={temporaryCaseSheet}
                                        handleOpenSearchTemplate={openSearchTemplate}
                                        handleOpenCreateTemplate={openCreateTemplate}
                                        hanldeNumberInputZero={hanldeNumberInputZero}
                                    />

                                </Tab>
                                <Tab eventKey="Vitals" title={"Vitals & Examination"} className='h-100'>
                                    <Vitals
                                        examinationData={examinationData}
                                        handleInputChange={handleInputChange}
                                        temporaryCaseSheet={temporaryCaseSheet}
                                        setTemporaryCaseSheet={setTemporaryCaseSheet}
                                        handleOpenSearchTemplate={openSearchTemplate}
                                        handleOpenCreateTemplate={openCreateTemplate}
                                    />
                                </Tab>
                                <Tab eventKey="Discussion" title={"Diagnosis & Discussion"} className='h-100'>
                                    <Discussion
                                        diagnosisData={diagnosisData}
                                        handleInputChange={handleInputChange}
                                        temporaryCaseSheet={temporaryCaseSheet}
                                        setTemporaryCaseSheet={setTemporaryCaseSheet}
                                        handleOpenSearchTemplate={openSearchTemplate}
                                        handleOpenCreateTemplate={openCreateTemplate}
                                        diagnosisRow={diagnosisRow}
                                        setDiagnosisRow={setDiagnosisRow}
                                        createDiagnosisDetailsRequestListModel={createDiagnosisDetailsRequestListModel}
                                    />
                                </Tab>


                            </Tabs>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='text-end my-2'>
                            {
                                isPreviousCaseSheet.status ? (
                                    <Button
                                        variant="primary"
                                        onClick={updateGeneralCaseSheetData}
                                        className="m-1" disabled={isLoading}>
                                        {isLoading ? 'Updating...' : 'Update'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="success"
                                        onClick={saveGeneralCaseSheetData}
                                        className="m-1"
                                        disabled={isLoading}>
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
                        <CreateTemplate handleClose={handleCreateTemplateClose} id={createTemplateId} setCreateTemplateShow={setCreateTemplateShow} />
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
                        <SearchTemplate handleClose={handleSearchTemplateClose} id={searchTemplateId} setSearchTemplateShow={setSearchTemplateShow} />
                    </Modal.Body>
                </Modal>

                {/* SAVE PREVIEW */}

                <Modal show={previewCaseSheetShow} dialogClassName="clinical-general-save-preview"
                    onHide={handlePreviewCaseSheetClose}
                    keyboard={false} size="xl">
                    <Modal.Header closeButton>
                        <h3 className='fw-bold'>GENERAL CASESHEET</h3>
                    </Modal.Header>
                    <Modal.Body className='overflow-auto flex-grow-1'>
                        <PreviewGeneralCaseSheet SavedCaseSheet={SavedCaseSheet} />
                    </Modal.Body>
                    <Modal.Footer className='justify-content-center'>
                        <ClinicalNavigationButtons />
                    </Modal.Footer>
                </Modal>
            </CommonLayout>
        </Fragment>


    )
}

export default DirectGeneralCaseSheet;




