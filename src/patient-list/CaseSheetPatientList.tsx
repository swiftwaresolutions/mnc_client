import { Col, Row, Form, Button, Container, Pagination, Badge, Modal } from "react-bootstrap";

import PatientListTable from "./components/PatientListTable";

import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from 'react-redux';

import { storeClinicalIpPatientList, storeClinicalOpPatientList } from "./components/state/clinicalPatientListSlice";

import { errorHandling } from "../error/state/error-handle-action";

import { AxiosError } from "axios";

import { PatientApiService } from "../api/patient/patient-api-service";

import { DepartmentApiService } from "../api/department/department-api-service";
import { RootState } from "../state/store";
import { storeClinicalIsIp } from "../clinical-info/redux-store/clinicalPersistSlice";
import PrevVisitDetails from "../clinical-info/components/reports/prev-visit-details/PrevVisitDetails";
import AppointmentDetails from "../clinical-info/components/reports/appointment-details/AppointmentDetails";

const PatientListCaseSheetLayout = () => {

  const patientApiService: PatientApiService = new PatientApiService();

  const departmentApiService: DepartmentApiService = new DepartmentApiService();

  const { isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)

  const loginData = useSelector((state: RootState) => state.loginData);

  const dispatch = useDispatch();

  const [isSpinning, setIsSpinning] = useState(false);

  const [depatment, setDepatment] = useState<any>({ allDepartments: [{ depName: "DEPARTMENT", id: 0 }], selected: "0" });

  const [ward, setWard] = useState({ allWards: [{ name: "WARD", id: 0 }], selected: "0" });

  const [searchText, setSearchText] = useState<string>("");

  const [isReady, setIsReady] = useState(false);

//   const filteredOpPatients = useMemo(() => {
//     if (!opPatientList) return [];
//     if (depatment.selected === "0") return opPatientList;
//     return opPatientList.filter(p => p.departmentId === +depatment.selected);
// }, [opPatientList, depatment.selected]);


  const getOutPatientList = async () => {
    try {
      setIsSpinning(true);
      const outPatientResponse = await patientApiService.getOutPatientList();
      setIsSpinning(false);
      if (outPatientResponse) {
        // dispatch(storeClinicalOpPatientList([...outPatientResponse]))

        const filteredPatients = filterPatientsForDoctor(outPatientResponse);
      dispatch(storeClinicalOpPatientList(filteredPatients));
         setIsReady(true);

      }
    } catch (error) {
      setIsSpinning(false);
      handleError(error);
    }
  };

  const filterPatientsForDoctor = (patients: any[]) => {
  if (!patients) return [];

  // if user is not a doctor, show all
  if (loginData.isDoctor === 0 || loginData.doctorId === 1 || loginData.isAdmin === 1) return patients;

  // else filter by doctorId or transfers.to_doc
  return patients.filter((p) => {
    // include if directly assigned to this doctor
    // if (Number(p.doctorId) === Number(loginData.doctorId)) return true;

    // transfers expected as an array now; fall back safely if still a string
    let transfers: any[] = [];
    if (Array.isArray(p.transfers)) transfers = p.transfers;
    else if (typeof p.transfers === 'string') {
      try {
        transfers = JSON.parse(p.transfers);
      } catch (err) {
        transfers = [];
        console.error('Invalid transfers JSON', p.transfers);
      }
    }

    const isTransferredToMe = transfers.some((t: any) => Number(t.toDoc) === Number(loginData.doctorId));
    console.log("is transfer " , isTransferredToMe)
    return isTransferredToMe;
  });
};

  const getInPatientList = async () => {
    try {
      // setIsSpinning(true);
      const inPatientResponse = await patientApiService.getInPatientList();
      // setIsSpinning(false);
      if (inPatientResponse) {
        dispatch(storeClinicalIpPatientList([...inPatientResponse]))
      }
    } catch (error) {
      // setIsSpinning(false);
      handleError(error);
    }
  };

  const handleSearchTextChange = (value: string) => {
    sessionStorage.setItem("clinicalPatientSearchTextInput", value);              //    store search value
    setSearchText(value);
  };

  const handleDepartmentSearch = (value: string) => {
    setDepatment((pre: any) => ({ ...pre, selected: value }));
    sessionStorage.setItem("clinicalPatientDepartmentSearch", value);
  };

  const handleWardChange = (value: string) => {
    setWard((pre: any) => ({ ...pre, selected: value }));
    sessionStorage.setItem("clinicalPatientDepartmentSearch", value);
  };

  const getDepatmentList = async () => {
    try {
      let res = await departmentApiService.fetchDepartment("0");
      res = [...res].sort((a, b) => String(a.depName).toLocaleLowerCase() > String(b.depName).toLocaleLowerCase() ? 1 : -1)
      setDepatment((pre: any) => ({ ...pre, allDepartments: [{ depName: "DEPARTMENT", id: 0 }, ...res] }));
    } catch (error) {
      console.log(error)
    }
  };

  const fetchWards = async () => {
    try {
      let res = await departmentApiService.fetchWards();
      res = [...res].sort((a, b) => String(a.name).toLocaleLowerCase() > String(b.name).toLocaleLowerCase() ? 1 : -1)
      setWard((pre: any) => ({ ...pre, allWards: [{ name: "WARD", id: 0 }, ...res] }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
      dispatch(errorHandling(error.message));
    } else {

    }
  };

  const handleOnOpChange = () => {
    handleSearchTextChange("");
    getOutPatientList();
    // handleWardChange("0")
    dispatch(storeClinicalIsIp(0))
  };

  const handleOnIpChange = () => {
    handleSearchTextChange("");
    getInPatientList()
    dispatch(storeClinicalIsIp(1))
  };
  const [prevVisistDetailsShow, setPrevVisistDetailsShow] = useState(false)
  const [appointmentShow, setAppointmentShow] = useState(false)
  const handlePrevVisitModalOpen = () => {
    setPrevVisistDetailsShow(true)
  }
  const handlePrevVisitModalClose = () => {
    setPrevVisistDetailsShow(false)
  }
  
  const handleAppointmentModalOpen = () => {
    setAppointmentShow(true)
  }
  const handleAppointmentModalClose = () => {
    setAppointmentShow(false)
  }
  // Transfer report modal state
  const [transferReportShow, setTransferReportShow] = useState(false)
  const [transferReportLoading, setTransferReportLoading] = useState(false)
  const [transferReportPatients, setTransferReportPatients] = useState<any[]>([])
  const [transferReportSearch, setTransferReportSearch] = useState<string>('')
  const [transferFromFilter, setTransferFromFilter] = useState<number>(0)
  const [transferToFilter, setTransferToFilter] = useState<number>(0)
  const [transferConsultants, setTransferConsultants] = useState<any[]>([])
  const [selectedReportPatient, setSelectedReportPatient] = useState<any | null>(null)
  const [selectedPatientTransfers, setSelectedPatientTransfers] = useState<any[]>([])
  const [transfersLoading, setTransfersLoading] = useState(false)

  const openTransferReport = async () => {
    setTransferReportShow(true)
    try {
      setTransferReportLoading(true)
      // fetch both OP and IP lists
      const [ops, consultants] = await Promise.all([
        patientApiService.getOutPatientList(),
        departmentApiService.fetchAllConsultantDetails()
      ])
      const allPatients = Array.isArray(ops) ? ops : []
      setTransferReportPatients(allPatients)
      setTransferConsultants(Array.isArray(consultants) ? consultants : [])
    } catch (err) {
      console.error(err)
      // continue with whatever loaded
    } finally {
      setTransferReportLoading(false)
    }
  }

  const closeTransferReport = () => {
    setTransferReportShow(false)
    setTransferReportPatients([])
    setSelectedReportPatient(null)
    setSelectedPatientTransfers([])
    setTransferReportSearch('')
    setTransferFromFilter(0)
    setTransferToFilter(0)
  }

  const fetchTransfersForPatient = async (patient: any) => {
    if (!patient || !patient.visitId) return
    try {
      setTransfersLoading(true)
      const resp: any = await departmentApiService.fetchDoctorTransfer(patient.visitId)
      setSelectedPatientTransfers(Array.isArray(resp) ? resp : [])
      setSelectedReportPatient(patient)
    } catch (err) {
      console.error(err)
      setSelectedPatientTransfers([])
    } finally {
      setTransfersLoading(false)
    }
  }
  
  useEffect(() => {
    let text = sessionStorage.getItem("clinicalPatientSearchTextInput") || "";
    let dept = sessionStorage.getItem("clinicalPatientDepartmentSearch") || "";
    setSearchText(text);                                               //    store search value
    setDepatment((pre: any) => ({ ...pre, selected: dept }));
    // getOutPatientList();
    // getInPatientList();
    // getDepatmentList();
    // fetchWards();
  }, []);

  useEffect(() => {
    if (!loginData.authorized) return; // wait for login info

    console.log("login dataa in patient list", loginData);
    const initPage = async () => {
        await getDepatmentList();
        await fetchWards();
        await getOutPatientList(); // can pass loginData.departmentId to API if supported
        await getInPatientList();
    };

    initPage();
}, [loginData.authorized]);

  return (
    <Col className="h-100 d-flex align-items-center">
      <Container className="px-md-5 py-2 rounded ">
        <Row className=" align-items-center py-2 row-cols-1 row-cols-lg-2">
          <Col>
            <Row className="align-items-center">
              {/* <Col className="text-center py-1 px-0">
                <Form.Control placeholder="Search for Any Column" value={searchText} size="sm" onChange={(e) => handleSearchTextChange(e.target.value)} />
              </Col> */}
              <Col className="text-center py-1">
                {isIp == 0 && <Row className="justify-content-center py-1 align-items-center ">
                  <Col className="text-success fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="success" className="p-1" style={{ width: '15px', height: '15px', display: 'block' }}>N</Badge>
                    NEW OP
                  </Col>
                  <Col className="text-danger fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="danger" className="p-1" style={{ width: '15px', height: '15px', display: 'block' }}>R</Badge>
                    REPEAT OP
                  </Col>
                </Row>}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className="text-center py-1">
                <Row className="justify-content-center py-1 align-items-center">
                  <Col className="text-danger fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="danger" className="p-1" style={{ width: '10px', height: '10px', display: 'block' }}></Badge>
                    EMPTY ENTRY
                  </Col>
                  <Col className="text-warning fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="warning" className="p-1" style={{ width: '10px', height: '10px', display: 'block' }}></Badge>
                    PROCESSING
                  </Col>
                  <Col className="text-success fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="success" className="p-1" style={{ width: '10px', height: '10px', display: 'block' }}></Badge>
                    EXECUTED
                  </Col>
                  <Col className="text-secondary fw-medium d-flex align-items-center gap-2">
                    <Badge pill bg="secondary" className="p-1" style={{ width: '10px', height: '10px', display: 'block' }}></Badge>
                    DISPENSED
                  </Col>
                </Row>

              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="py-1 row-cols-2 row-cols-md-4" >
          <Col className="text-center py-1">
            {/* {isIp == 0 && <Form.Select size="sm" value={depatment.selected} onChange={(e) => handleDepartmentSearch(e.target.value)}>
              {depatment?.allDepartments?.map((dept: any, idx: number) => (
                <option value={dept.id} key={idx}>{dept?.depName}</option>
              ))}
            </Form.Select>} */}
            <Form.Control placeholder="Search for Any Column" value={searchText} size="sm" onChange={(e) => handleSearchTextChange(e.target.value)} />
            {isIp == 1 && <Form.Select size="sm" value={ward.selected} onChange={(e) => handleWardChange(e.target.value)}>
              {ward?.allWards?.map((ward: any, idx: number) => (
                <option value={ward.id} key={idx}>{ward?.name}</option>
              ))}
            </Form.Select>}

          </Col>
          <Col md={2} className="text-center py-1">
            <Button variant="dark" size="sm" onClick={handleOnOpChange}>OUT PATIENT</Button>
          </Col>
          <Col md={2} className="text-center py-1">
            <Button variant="dark" size="sm" onClick={handleOnIpChange}>IP PATIENT</Button>
          </Col>
          <Col md={2} className="text-center py-1">
            <Button variant="dark" size="sm" onClick={openTransferReport}>TRANSFER REPORT</Button>
          </Col>
          <Col md={2} className="text-center py-1">
            <Button variant="dark" size="sm" onClick={handlePrevVisitModalOpen}>PREVIOUS DETAILS</Button>
          </Col>
          {/* <Col md={2} className="text-center py-1">
            <Button variant="dark" size="sm" onClick={handleAppointmentModalOpen}>APPOINTMENT</Button>
          </Col> */}
        </Row>
        {isReady && isIp == 0 && <PatientListTable depatment={depatment} ward={ward} searchText={searchText} isSpinning={isSpinning} isIp={isIp} />}
        {isIp == 1 && <PatientListTable depatment={depatment} ward={ward} searchText={searchText} isSpinning={isSpinning} isIp={isIp} />}

        <PrevVisitDetails handleClose={handlePrevVisitModalClose} {...{ prevVisistDetailsShow }} />
        <AppointmentDetails handleClose={handleAppointmentModalClose} {...{ appointmentShow }} />
        {/* Transfer Report Modal */}
        <Modal show={transferReportShow} onHide={closeTransferReport} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Transfer Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex" style={{ gap: 12 }}>
              <div style={{ width: 360, maxHeight: '60vh', overflowY: 'auto', borderRight: '1px solid #e9ecef', paddingRight: 12 }}>
                <div className="mb-2">
                  <Form.Control placeholder="Search patient" value={transferReportSearch} onChange={(e) => setTransferReportSearch(e.target.value)} size="sm" />
                </div>
                {/* <div className="mb-2 d-flex gap-2">
                  <Form.Select size="sm" value={transferFromFilter} onChange={(e) => setTransferFromFilter(Number(e.target.value))}>
                    <option value={0}>From Doctor (All)</option>
                    {transferConsultants.map((c: any) => <option key={c.consultantId} value={c.consultantId}>{c.consultantName}</option>)}
                  </Form.Select>
                  <Form.Select size="sm" value={transferToFilter} onChange={(e) => setTransferToFilter(Number(e.target.value))}>
                    <option value={0}>To Doctor (All)</option>
                    {transferConsultants.map((c: any) => <option key={c.consultantId} value={c.consultantId}>{c.consultantName}</option>)}
                  </Form.Select>
                </div> */}
                <div>
                  {transferReportLoading ? <div>Loading...</div> : (
                    transferReportPatients
                      .filter(p => {
                        if (!transferReportSearch) return true
                        const q = transferReportSearch.toLowerCase()
                        const hay = `${p.fullName || ''} ${p.displayNumber || ''} ${p.ipNo || ''} ${p.mobileNumber || ''}`.toLowerCase()
                        return hay.includes(q)
                      })
                      .map((p: any, idx: number) => (
                        <div key={idx} className={`p-2 border-bottom ${selectedReportPatient && selectedReportPatient.visitId === p.visitId ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => fetchTransfersForPatient(p)}>
                          <div className="fw-bold">{p.fullName ? p.fullName : (p.displayNumber || p.ipNo || 'Unknown Patient')}{(p.displayNumber && p.fullName) ? ` (${p.displayNumber})` : ''}</div>
                          <div className="text-muted small">{p.mobileNumber || '-' } • {p.age || '-'} / {p.gender || '-'}</div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              <div style={{ flex: 1, maxHeight: '60vh', overflowY: 'auto' }}>
                <h6>{selectedReportPatient ? (selectedReportPatient.fullName || selectedReportPatient.displayNumber) : 'Select a patient'}</h6>
                {transfersLoading ? <div>Loading transfers...</div> : (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>Sl</th>
                        <th>From</th>
                        <th>To</th>
                        <th style={{ width: 120 }}>Status</th>
                        <th style={{ width: 120 }}>Next Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatientTransfers && selectedPatientTransfers.length > 0 ? selectedPatientTransfers.map((t: any, i: number) => (
                        <tr key={t.transferId ?? i}>
                          <td>{i+1}</td>
                          <td>{t.fromDoctor ?? 'REGISTRATION'}</td>
                          <td>{t.toDoctor ?? '-'}</td>
                          <td className={`${t.isCompleted === 1 ? 'text-success' : (t.isCompleted === 2 ? 'text-primary' : 'text-dark')}`}>{t.isCompleted === 1 ? 'Received' : (t.isCompleted === 2 ? 'Completed' : 'Pending')}</td>
                          <td>{t.nextReview && t.nextReview !== '0000-00-00' ? t.nextReview : '-'}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="text-center">No transfers</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={closeTransferReport}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Col>
  )
}

export default PatientListCaseSheetLayout

