import { createRef, FC, useEffect, useRef, useState } from 'react'
import { Container, FormLabel, FormGroup, FormControl, Row, Col, Card, Tabs, Tab, Button, Modal, Form } from 'react-bootstrap'
import History from './components/history'
import CommonLayout from '../../ClinicalLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import SearchTemplate from './components/search-template'
import CreateTemplate from './components/create-template'
import { AxiosError } from 'axios'
import { clearErrorHandling, errorHandling } from '../../../../error/state/error-handle-action'
import ClinicalNavigationButtons from '../../ClinicalNavigationButtons'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import { RootState } from '../../../../state/store'
import { hanldeZeroNumberInput } from '../../../../utils/elementUtil'
import { handleError } from '../../../../utils/errorUtil'
import AppointmentRegister from '../Appointment-Register/AppointmentRegister'
import DoctorTransfer from './components/doctor-transfer/DoctorTransfer'

const historyInputs = [
  {
    id: "9",
    name: "PRESENTING COMPLAINTS",
    fieldName: "presentingComplaints"
  },
  {
    id: "1",
    name: "HISTORY OF PRESENT ILLNESS",
    fieldName: "presentIllness"
  },
  {
    id: "2",
    name: "PAST HISTORY MEDICAL ",
    fieldName: "pastHistoryMedical"
  },
  {
    id: "3",
    name: "PAST HISTORY SURGICAL",
    fieldName: "pastHistorySurgical"
  },
  {
    id: "4",
    name: "FAMILY HISTORY ",
    fieldName: "familyHistory"
  },
  {
    id: "5",
    name: "OTHERS",
    fieldName: "others"
  },
  {
    id: "6",
    name: "SYSTEMIC EXAMINATION",
    fieldName: "systemicExamination"
  },
  {
    id: "7",
    name: "DIAGNOSIS",
    fieldName: "diagnosis"
  },
  {
    id: "8",
    name: "PLAN",
    fieldName: "followUpPlan"
  }
]

const GeneralCaseSheet: FC = () => {  

  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();
  const dispatch = useDispatch();
  const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
  const { id: userId } = useSelector((s: RootState) => s.loginData);

  let patientDetails: any;
  let ipId: number;
  const caseSheetType = 1
  const docId = userId

  if (isIp == 0) {
    patientDetails = clinicalCurrentOpPatient
    ipId = 0
  } else {
    patientDetails = clinicalCurrentIpPatient
    ipId = patientDetails.ipId
  }

  const caseSheetInit = {
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
    generalPhysical: "",
    others: "",
    appointMentDate: '0000-00-00',

    pastHistorySurgical: "",
    pastHistoryMedical: "",
    familyHistory: "",
    generalExamination: "",
    systemicExamination: "",
    presentingComplaints: "",
    pallor: "",
    icterus: "",
    edema: "",
  }

  const complaintInit = {
    component: createRef(),
    hasError: false,
    number: 1,
    period: "Days",
    selectedComplaint: [{ id: 0, name: "" }]
  };

  const diagnosisInit = {
    component: createRef(),
    hasError: false,
    selectedDiagnosis: [{ id: 0, name: "" }]
  };

  const screenStateInit = {
    isPrevious: false,
    previousId: "",
    loading: false
  }

  const [screenState, setScreenState] = useState({ ...screenStateInit });
  const screenStateRef = useRef({ ...screenStateInit });

  const [caseSheet, setCaseSheet] = useState({ ...caseSheetInit });
  const [complaint, setComplaint] = useState([{ ...complaintInit }]);
  const [diagnosis, setDiagnosis] = useState([{ ...diagnosisInit }]);

  const prevCaseSheetRef = useRef<any>({
    ...caseSheet,
    complaintDataList: [],
    diagnosisDetailsData: [],
  });

  const caseSheetRef = useRef(caseSheet);
  const complaintRef = useRef(complaint);
  const diagnosisRef = useRef(diagnosis);

  const setHandleCaseSheet = (value: any) => {
    setCaseSheet({ ...value })
    caseSheetRef.current = { ...value }
  }
  const setHandleComplaint = (value: any[]) => {
    setComplaint([...value])
    complaintRef.current = [...value]
  }
  const setHandleDiagnosis = (value: any[]) => {
    setDiagnosis([...value])
    diagnosisRef.current = [...value]
  }

  const [createTemplateShow, setCreateTemplateShow] = useState(false)
  const [searchTemplateShow, setSearchTemplateShow] = useState(false);
  const [createTemplateId, setCreateTemplateId] = useState<any>(null);
  const [searchTemplateId, setSearchTemplateId] = useState<any>(null);
  const [appointmentRegisterShow, setAppointmentRegisterShow] = useState(false);
  const [doctorTransferShow, setDoctorTransferShow] = useState(false);

  const handleInputChange = (value: string, fieldName: string) => {
    let caseSheetLocal = { ...caseSheet }
    if (fieldName == 'height' || fieldName == "weight") {
      value = hanldeZeroNumberInput(value);
      if (fieldName == "height") {
        let height = Number(((Number(value) / 100) * (Number(value) / 100)).toFixed(2))
        caseSheetLocal.bmi = (Number(caseSheetLocal.weight) / (height)).toFixed(2)
      } else if (fieldName == "weight") {
        let weight = Number(value)
        caseSheetLocal.bmi = (Number(weight) / Number(((Number(caseSheetLocal.height) / 100) * (Number(caseSheetLocal.height) / 100)).toFixed(2))).toFixed(2)
      }
      if (caseSheetLocal.bmi == "NaN" || caseSheetLocal.bmi == "Infinity") {
        caseSheetLocal.bmi = "0"
      }
      caseSheetLocal = { ...caseSheetLocal, [fieldName]: value }
    } else {
      caseSheetLocal = { ...caseSheetLocal, [fieldName]: value }
    }
    setHandleCaseSheet({ ...caseSheetLocal })
  }

  const openSearchTemplate = (id: any) => {
    setSearchTemplateShow(true)
    setSearchTemplateId(id);
  }
  const handleSearchTemplateClose = (templateDetail: any, id: any) => {
    setSearchTemplateShow(false);
    const allField = [...historyInputs,
      //  ...examinationInputs, ...allergyInputs, ...diagnosisInputs, ...followUpPlanInputs
    ]
    const fieldName: any = allField.find((field: any) => field.id == id)?.fieldName;
    setCaseSheet((prev: any) => {
      caseSheetRef.current = { ...prev, [fieldName]: templateDetail }
      return { ...prev, [fieldName]: templateDetail }
    });
  }
  const openCreateTemplate = (id: any) => {
    setCreateTemplateShow(true)
    setCreateTemplateId(id);
  }
  const handleCreateTemplateClose = () => {
    setCreateTemplateShow(false);
  }

  const handleAppointmentRegisterOpen = () => setAppointmentRegisterShow(true);
  const handleAppointmentRegisterClose = () => setAppointmentRegisterShow(false);
  const handleDoctorTransferClick = () => {
    // place for any pre-open logic (validation/analytics) before opening modal
    setDoctorTransferShow(true)
  }
  const handleDoctorTransferClose = () => setDoctorTransferShow(false)
  const handleDoctorTransfer = (consultant: any) => {
    // Hook to perform actual transfer action if needed. For now we just log.
    console.log('Doctor transferred to:', consultant)
  }

  const caseSheetValidation = () => {
    try {
      const complaintError: any[] = [...complaintRef.current].filter((item) => item.hasError)
      const diagnosisError: any[] = [...diagnosisRef.current].filter((item) => item.hasError)
      if (complaintError.length) {
        if (complaintError[0].component.current) {
          complaintError[0].component.current.focus();
        }
        toastErrorBounceDark("Select Complaint value")
      }
      if (diagnosisError.length) {
        if (diagnosisError[0].component.current) {
          diagnosisError[0].component.current.focus();
        }
        toastErrorBounceDark("Select Diagnosis value")
      }
      if (complaintError.length || diagnosisError.length) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }
  const handleCheckCaseSheetModify = () => {
    try {
      const filteredPrevCaseSheetData = Object.fromEntries(
        Object.entries(prevCaseSheetRef.current)
          .filter((item) => typeof item[1] !== "object" && item[0] !== "id" && item[0] !== "patId" && item[0] !== "vstId" && item[0] !== "ipId")
          .sort((a: any, b: any) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
          })
      );
      const filteredCurrCaseSheetData = Object.fromEntries(
        Object.entries(caseSheetRef.current)
          .filter((item) => typeof item[1] !== "object" && item[0] !== "id" && item[0] !== "patId" && item[0] !== "vstId" && item[0] !== "ipId")
          .sort((a: any, b: any) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
          })
      );

      const filteredPrevComplaint = [...prevCaseSheetRef.current.complaintDataList]
        .map((complaint: any) => ({
          number: complaint.number,
          period: complaint.period,
          selectedComplaint: complaint.selectedComplaint
        })).filter((item) => item.selectedComplaint[0].id)
        .sort((a: any, b: any) => a.selectedComplaint[0].id - b.selectedComplaint[0].id)

      const filteredCurrComplaint = [...complaintRef.current]
        .map((complaint: any) => ({
          number: complaint.number,
          period: complaint.period,
          selectedComplaint: complaint.selectedComplaint
        })).filter((item) => item.selectedComplaint[0]?.id)
        .sort((a: any, b: any) => a.selectedComplaint[0]?.id - b.selectedComplaint[0]?.id)

      const filteredPrevDiagnosis = [...prevCaseSheetRef.current.diagnosisDetailsData]
        .map((diagnosis: any) => ({
          selectedDiagnosis: diagnosis.selectedDiagnosis,
        })
        ).filter((item) => item.selectedDiagnosis[0].id)
        .sort((a: any, b: any) => a.selectedDiagnosis[0].id - b.selectedDiagnosis[0].id)

      const filteredcurrDiagnosis = [...diagnosisRef.current]
        .map((diagnosis: any) => ({
          selectedDiagnosis: diagnosis.selectedDiagnosis,
        }))
        .filter((item) => item.selectedDiagnosis[0].id)
        .sort((a: any, b: any) => a.selectedDiagnosis[0].id - b.selectedDiagnosis[0].id)

      if (
        (JSON.stringify(filteredCurrCaseSheetData) !== JSON.stringify(filteredPrevCaseSheetData))
        || (JSON.stringify(filteredCurrComplaint) !== JSON.stringify(filteredPrevComplaint))
        || (JSON.stringify(filteredPrevDiagnosis) !== JSON.stringify(filteredcurrDiagnosis))
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  }
  const saveGeneralCaseSheetData = async (whenExit: boolean) => {
    setScreenState((prev) => ({ ...prev, loading: true }))
    try {
      if (!patientDetails.visitId) {
        return toastErrorBounceDark("The patient has no Visit Details")
      }
      if (!caseSheetValidation()) {
        return
      }
      if (!handleCheckCaseSheetModify()) {
        toastErrorBounceDark("No changes found")
        return;
      }
      let updatedComplaintRow = [...complaintRef.current].map((complaint: any) => {
        complaint = {
          complaintId: complaint.selectedComplaint[0].id,
          number: complaint.number,
          period: complaint.period,
          patId: patientDetails.patientId,
          vstId: patientDetails.visitId,
          ipId: ipId,
          caseSheetType: caseSheetType,
          caseSheetId: 0,
          isValid: 1,
        }
        return complaint;
      }).filter((complaint: any) => complaint.complaintId != 0)
      let updatedDiagnosisRow = [...diagnosisRef.current].map((diagnos: any) => {
        diagnos = {
          diagnosisId: diagnos.selectedDiagnosis[0].id,
          patId: patientDetails.patientId,
          vstId: patientDetails.visitId,
          ipId: ipId,
          caseSheetType: caseSheetType,
          caseSheetId: 0,
          isValid: 1,
        }
        return diagnos;
      }).filter((diagnosis: any) => diagnosis.diagnosisId != 0);
      let payload = {
        ...caseSheetRef.current,
        uid: userId,
        patientId: patientDetails.patientId,
        ipId: ipId,
        visitId: patientDetails.visitId,
        createComplaintDetailsRequestList: [...updatedComplaintRow],
        createDiagnosisDetailsRequestList: [...updatedDiagnosisRow]
      }
      await caseSheetApiService.saveGeneralCaseSheet(payload);
      if (!whenExit) {
        toastSuccessBounceDark("General Case Sheet Saved")
        handlePreviousPatientDetails()
      }
    } catch (error: any) {
      handleError(dispatch, error)
    } finally {
      setScreenState((prev) => ({ ...prev, loading: false }))
    }
  }

  const updateGeneralCaseSheetData = async (whenExit: boolean) => {
    setScreenState((prev) => ({ ...prev, loading: true }))
    try {
      if (!patientDetails.visitId) {
        return toastErrorBounceDark("The patient has no Visit Details")
      }
      if (!screenStateRef.current.previousId) {
        return toastErrorBounceDark("The patient has no Previous Data")
      }
      if (!caseSheetValidation()) {
        return
      }
      if (!handleCheckCaseSheetModify()) {
        toastErrorBounceDark("No changes found")
        return;
      }
      let updatedComplaintRow = [...complaintRef.current].map((complaint: any) => {
        complaint = {
          complaintId: complaint.selectedComplaint[0].id,
          number: complaint.number,
          period: complaint.period,
          patId: patientDetails.patientId,
          vstId: patientDetails.visitId,
          ipId: ipId,
          caseSheetType: caseSheetType,
          caseSheetId: 0,
          isValid: 1,
        }
        return complaint;
      }).filter((complaint: any) => complaint.complaintId != 0)
      let updatedDiagnosisRow = [...diagnosisRef.current].map((diagnos: any) => {
        diagnos = {
          diagnosisId: diagnos.selectedDiagnosis[0].id,
          patId: patientDetails.patientId,
          vstId: patientDetails.visitId,
          ipId: ipId,
          caseSheetType: caseSheetType,
          caseSheetId: 0,
          isValid: 1,
        }
        return diagnos;
      }).filter((diagnosis: any) => diagnosis.diagnosisId != 0);
      let payload = {
        ...caseSheetRef.current,
        uid: userId,
        patientId: patientDetails.patientId,
        ipId: ipId,
        visitId: patientDetails.visitId,
        createComplaintDetailsRequestList: [...updatedComplaintRow],
        createDiagnosisDetailsRequestList: [...updatedDiagnosisRow]
      }
      await caseSheetApiService.updateGeneralCaseSheet(screenStateRef.current.previousId, caseSheetType, payload);
      if (!whenExit) {
        handlePreviousPatientDetails();
        toastSuccessBounceDark("General Case Sheet Updated")
      }
    } catch (error: any) {

      handleError(dispatch, error)
    } finally {
      setScreenState((prev) => ({ ...prev, loading: false }))
    }
  }

  const handlePreviousPatientDetails = async () => {
    try {
      let prevCaseSheetResponse: any[] = []
      let prevVitalsResponse: any[] = []
      let prevCaseSheet: any = {}
      let prevVitals: any = {};
      let prevComplaints: any[] = [];
      let complaintDataList: any[] = []
      let prevDiagnosis: any[] = [];
      let diagnosisDetailsData: any[] = []
      let patientHeight : any[] = []

      const response = await Promise.all([
        caseSheetApiService.fetchGeneralCaseSheetByVstId(patientDetails.visitId),
        caseSheetApiService.fetchOpVitalsByVstId(patientDetails.visitId),
        caseSheetApiService.fetchPatientHeight(clinicalCurrentOpPatient.patientId)
      ]);
      prevCaseSheetResponse = response[0];
      prevVitalsResponse = response[1];
      patientHeight = response[2];
      
      if (prevVitalsResponse.length > 0) {
        prevVitals = prevVitalsResponse[prevVitalsResponse.length - 1];
        prevVitals = {
          temperature: prevVitals.temperature,
          bp: prevVitals.bp,
          pulse: prevVitals.pulse,
          rr: prevVitals.rr,
          spo2: prevVitals.spo2,
          height: prevVitals.height,
          weight: prevVitals.weight,
          bmi: prevVitals.bmi
        };
        Object.keys(prevVitals).forEach((vitalFieldName) => {   
          if (prevVitals[vitalFieldName] !== "" && prevVitals[vitalFieldName] !== "0") {
            prevCaseSheet[vitalFieldName] = prevVitals[vitalFieldName];
          }
        });
      } else {
          if(patientHeight.length > 0) {
            prevVitals = patientHeight[patientHeight.length - 1];
            prevVitals = {height : prevVitals.height}
            Object.keys(prevVitals).forEach((vitalFieldName) => {   
            if (prevVitals[vitalFieldName] !== "" && prevVitals[vitalFieldName] !== "0") {
              prevCaseSheet[vitalFieldName] = prevVitals[vitalFieldName];
            }
          });
          }
      }

      if (prevCaseSheetResponse.length > 0) {
        prevCaseSheet = prevCaseSheetResponse[prevCaseSheetResponse.length - 1];
        if ([...prevCaseSheet.complaintDataList].length > 0) {
          const ref = [...prevCaseSheet.complaintDataList].map(() => createRef())
          complaintDataList = [...prevCaseSheet.complaintDataList].map((complaint, idx) => ({
            ...complaintInit,
            component: ref[idx],
            number: complaint.no,
            period: complaint.periods,
            selectedComplaint: [{ id: complaint.id, name: complaint.name }],
          }))
          prevComplaints = [...prevCaseSheet.complaintDataList].map((complaint, idx) => ({
            ...complaintInit,
            component: ref[idx],
            number: complaint.no,
            period: complaint.periods,
            selectedComplaint: [{ id: complaint.id, name: complaint.name }],
          }))
        } else {
          prevComplaints = [{ ...complaintInit }]
          complaintDataList = [{ ...complaintInit }]
        }
        if ([...prevCaseSheet.diagnosisDetailsData].length > 0) {
          const ref = [...prevCaseSheet.diagnosisDetailsData].map(() => createRef())
          diagnosisDetailsData = [...prevCaseSheet.diagnosisDetailsData].map((diagnos, idx) => ({
            ...diagnosisInit,
            component: ref[idx],
            selectedDiagnosis: [{ id: diagnos.id, name: diagnos.name }],
          }));
          prevDiagnosis = [...prevCaseSheet.diagnosisDetailsData].map((diagnos, idx) => ({
            ...diagnosisInit,
            component: ref[idx],
            selectedDiagnosis: [{ id: diagnos.id, name: diagnos.name }],
          }));
        } else {
          prevDiagnosis = [{ ...diagnosisInit }];
        }
        setHandleComplaint([...prevComplaints]);
        setHandleDiagnosis([...prevDiagnosis])
        setScreenState((prev) => {
          prev = { ...prev, isPrevious: true, previousId: prevCaseSheet.id };
          screenStateRef.current = prev;
          return prev;
        });
      };
      
      prevCaseSheetRef.current = {
        ...prevCaseSheetRef.current,
        ...prevCaseSheet,
        complaintDataList,
        diagnosisDetailsData
      };

      setCaseSheet((prev: any) => {
        prev = { ...prev, ...prevCaseSheet };
        delete prev.id;
        delete prev.patId;
        delete prev.vstId;
        delete prev.ipId;
        delete prev.complaintDataList;
        delete prev.diagnosisDetailsData;
        caseSheetRef.current = prev
        return prev
      })

    } catch (error) {
      handleError(dispatch, error);
    }
  };

  const init = async () => {
    await handlePreviousPatientDetails();
    dispatch(clearErrorHandling());
  };

  useEffect(() => {
    init();
    const handleSaveKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLocaleLowerCase() === 's') {
        e.preventDefault();
        if (screenStateRef.current.isPrevious && screenStateRef.current.previousId) {
          updateGeneralCaseSheetData(false);
        } else {
          saveGeneralCaseSheetData(false)
        }
      }
    };
    window.addEventListener('keydown', handleSaveKeyDown);
    return () => {
      dispatch(clearErrorHandling());
      window.removeEventListener('keydown', handleSaveKeyDown);
      // if (handleCheckCaseSheetModify()) {
      //     const confirmCond = window.confirm(`Do You Want to ${screenStateRef.current.isPrevious ? "Update" : "Save"} modified data`)
      //     if (!confirmCond) return
      //     if (screenStateRef.current.isPrevious && screenStateRef.current.previousId) {
      //         updateGeneralCaseSheetData(true);
      //     } else {
      //         saveGeneralCaseSheetData(true);
      //     }
      // }
    }
  }, []);
  const casesheet = "GENERAL CASESHEET"
  return (
    <CommonLayout {...{casesheet}}>
      {/* <FormLabel className='heading mx-auto'>GENERAL CASE SHEET ENTRY OF <span className="text-dark">{patientDetails?.fullName} / {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} / {patientDetails?.age} / {patientDetails?.gender}</span></FormLabel> */}
      <Container style={{ transform: "background-color 2s ease, transform 2s ease" }} fluid="lg" className=' clinical-general-container overflow-auto d-flex h-100 flex-column'>

        <Row className='align-items-center pb-1'>
          <Col className='fw-bold py-0 text-success text- text-uppercase ps-2 letter-spacing-05px text-decoration-underline link-offset-3 '>
            PATIENT DETAILS :- <span className="text-dark"><span className='text-capitalize '>{String(patientDetails?.gender).toLowerCase() == "female" ? "Ms/Mrs. " : "Mr. "}</span>{patientDetails?.fullName} / {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} / {patientDetails?.age} / {patientDetails?.gender}</span>
          </Col>
          <Col>
            <Button onClick={handleDoctorTransferClick}>Doctor Transfer</Button>
          </Col>
        </Row>
        <Row className='flex-grow-1 overflow-auto'>
          <Col className='d-flex flex-column h-100'>
            <History {...{ historyInputs, complaintInit, complaint, caseSheet, setHandleComplaint, handleInputChange, openSearchTemplate, openCreateTemplate }} />
          </Col>
        </Row>

        <Row className='text-start align-items-center'>
          <Col >
            <Row>
              <Col className='text-success fw-bold fs-10px'>* Ctrl + S - to save or update caseSheet when data modified.</Col>
              {/* <Col>
                <Form.Group className="my-1 general-case-sheet-input" >
                  <Form.Control
                    placeholder=""
                    size="sm"
                    type='date'
                    name='appointMentDate'
                    value={caseSheet['appointMentDate']}
                    onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                  />
                  <label  >Appointment Date</label>
                </Form.Group>
              </Col> */}
              <Col className="text-end">
                  <Button variant="secondary" onClick={handleAppointmentRegisterOpen}>APPOINTMENT</Button>
              </Col>
            </Row>
          </Col>
          <Col className='text-end my-2'>
            {
              screenState.isPrevious ? (
                <Button variant="primary" onClick={() => updateGeneralCaseSheetData(false)} className="m-1" disabled={screenState.loading}>
                  {screenState.loading ? 'Updating...' : 'Update'}
                </Button>
              ) : (
                <Button variant="success" onClick={() => saveGeneralCaseSheetData(false)} className="m-1" disabled={screenState.loading}>
                  {screenState.loading ? 'Submitting...' : 'Save'}
                </Button>)
            }
          </Col>
        </Row>
      </Container>

      <AppointmentRegister 
          show={appointmentRegisterShow}
          onHide={() => setAppointmentRegisterShow(false)}
          type={caseSheetType}
          patientDetails={patientDetails}
          caseSheetType = {caseSheetType}
          userId = {userId}
      />

      {/* DOCTOR TRANSFER MODAL */}
      <Modal
        show={doctorTransferShow}
        onHide={handleDoctorTransferClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Doctor Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DoctorTransfer onClose={handleDoctorTransferClose} onTransfer={handleDoctorTransfer} patientDetails={patientDetails} />
        </Modal.Body>
      </Modal>

      {/* CREATE TEMPLATE */}

      <Modal
        show={createTemplateShow}
        onHide={handleCreateTemplateClose}
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Body className="p-0">
          <CreateTemplate handleClose={handleCreateTemplateClose} id={createTemplateId} setCreateTemplateShow={setCreateTemplateShow} caseSheetType={caseSheetType} docId={docId} />
        </Modal.Body>
      </Modal>

      {/* Search TEMPLATE */}

      <Modal
        show={searchTemplateShow}
        centered
        size="lg"
        onHide={() => setSearchTemplateShow(false)}
      >
        <Modal.Body className="p-0">
          <SearchTemplate handleClose={handleSearchTemplateClose} id={searchTemplateId} setSearchTemplateShow={setSearchTemplateShow} caseSheetType={caseSheetType} docId={docId} />
        </Modal.Body>
      </Modal>
    </CommonLayout>
  )
}

export default GeneralCaseSheet