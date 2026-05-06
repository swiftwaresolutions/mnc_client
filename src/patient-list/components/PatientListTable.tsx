import { Badge, Button, Col, Row, Spinner, Table, Modal } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../state/store";

import { routerPathNames } from "../../routes/routerPathNames";
import { storeClinicalCurrentIpPatient, storeClinicalCurrentOpPatient } from "../../clinical-info/redux-store/clinicalPersistSlice";
import { useMemo, useState } from "react";
import CaseSheetApiService from "../../api/case-sheet/case-sheet-api-service";
import { DepartmentApiService } from "../../api/department/department-api-service";

const PatientListTable = ({ searchText, ward, isSpinning, depatment, isIp }: any) => {
  const { clinicalOpPatientList, clinicalIpPatientList } = useSelector((state: RootState) => state.clinicalPatientListReducer);

  // Add a prop or state to select which transfer status to display (0, 1, 2)
  const [transferStatusFilter, setTransferStatusFilter] = useState<number | null>(null); // null = show all
  
  // Modal confirmation state
  const [showReceiveConfirmModal, setShowReceiveConfirmModal] = useState(false);
  const [pendingPatient, setPendingPatient] = useState<any>(null);
  const [pendingNavLink, setPendingNavLink] = useState<string>("");
  const [consultants, setConsultants] = useState<any[]>([]);
  const loginData = useSelector((state: RootState) => state.loginData);
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const caseSheetApiService : CaseSheetApiService = new CaseSheetApiService();

  // const handleSavePatientData = (item: any, navLink: string) => {
    // Fetch consultants on mount
    useMemo(() => {
      const fetchConsultants = async () => {
        try {
          const deptService = new DepartmentApiService();
          const resp = await deptService.fetchAllConsultantDetails();
          setConsultants(Array.isArray(resp) ? resp : []);
        } catch (err) {
          console.error("Error fetching consultants:", err);
          setConsultants([]);
        }
      };
      fetchConsultants();
    }, []);
  //   if (isIp == 0) {
  //     dispatch(storeClinicalCurrentOpPatient(item));
  //   } else {
  //     dispatch(storeClinicalCurrentIpPatient(item));
  //   }
  //   navigate(navLink);
  // };

  const handleTextSearch = (item: any) => {
    let condition: Boolean;
    if (isIp == 0) {
      condition =
        String(item.fullName).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.name).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.displayNumber).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.departmentName).toLowerCase().includes(searchText.toLowerCase());
    } else {
      condition =
        String(item.fullName).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.ipNo).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.displayNumber).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.ward).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.bedNo).toLowerCase().includes(searchText.toLowerCase());
    }
    return condition;
  };

  let departmentName = depatment.allDepartments.find((item: any) => item.id == depatment.selected)?.depName;

  let wardName = ward.allWards.find((item: any) => item.id == ward.selected)?.name;

  const handleDepartmentSearch = (item: any) => {
    let condition = String(item.departmentName)
      .toLowerCase()
      .includes(departmentName?.toLowerCase() == "department" ? "" : departmentName?.toLowerCase());
    return condition;
  };
  const handleWardSearch = (item: any) => {
    let condition = String(item.ward)
      .toLowerCase()
      .includes(wardName?.toLowerCase() == "ward" ? "" : wardName?.toLowerCase());
    return condition;
  };

//   const handleTransferFilter = (item: any) => {
//   if (transferStatusFilter === null) return true; 

//   if (!item.transfers || item.transfers === "[]") {
//     return transferStatusFilter === 0;
//   }

//   try {
//     const transfers = JSON.parse(item.transfers);
//     return transfers.some((t: any) => t.is_completed === transferStatusFilter);
//   } catch (err) {
//     console.error("Invalid transfers JSON", item.transfers);
//     return false;
//   }
// };

const handleTransferFilter = (item: any) => {
  if (transferStatusFilter === null) return true;

  const transfers = Array.isArray(item.transfers) ? item.transfers : [];

  if (!loginData.doctorId || loginData.doctorId === 0) {
    // show all patients for non-doctor users; no transfers => pending (0)
    if (transfers.length === 0) return transferStatusFilter === 0;
    return transfers.some((t: any) => Number(t.isCompleted) === Number(transferStatusFilter));
  }

  // doctor-specific filtering: relevant if assigned or transferred to this doctor
  const isRelevant = Number(item.doctorId) === Number(loginData.doctorId) ||
    transfers.some((t: any) => Number(t.toDoc) === Number(loginData.doctorId));

  if (!isRelevant) return false;

  if (transfers.length === 0) return transferStatusFilter === 0;
  return transfers.some((t: any) => Number(t.toDoc) === Number(loginData.doctorId) && Number(t.isCompleted) === Number(transferStatusFilter));
};


// const transferCounts = clinicalOpPatientList?.reduce(
//   (acc: any, item: any) => {
//     if (!item.transfers || item.transfers === "[]") {
//       acc.pending++;
//     } else {
//       try {
//         const transfers = JSON.parse(item.transfers);
//         transfers.forEach((t: any) => {
//           if (t.is_completed === 0) acc.pending++;
//           else if (t.is_completed === 1) acc.inProgress++;
//           else if (t.is_completed === 2) acc.completed++;
//         });
//       } catch (err) {
//         console.error("Invalid transfers JSON", item.transfers);
//       }
//     }
//     return acc;
//   },
//   { pending: 0, inProgress: 0, completed: 0 }
// );


// const transferCounts = useMemo(() => {
//   const counts = { all: 0, pending: 0, inProgress: 0, completed: 0 };

//   const patients = clinicalOpPatientList?.filter((p: any) => {
//     if (p.doctorId === loginData.doctorId) return true;

//     if (!p.transfers || p.transfers === "[]") return false;

//     try {
//       const transfers = JSON.parse(p.transfers);
//       return transfers.some((t: any) => t.to_doc === loginData.doctorId);
//     } catch (err) {
//       console.error("Invalid transfers JSON", p.transfers);
//       return false;
//     }
//   }) || [];

//   counts.all = patients.length;

//   patients.forEach((p: any) => {
//     if (!p.transfers || p.transfers === "[]") {
//       counts.pending++; 
//       return;
//     }

//     try {
//       const transfers = JSON.parse(p.transfers);

//       if (transfers.some((t: any) => t.to_doc === loginData.doctorId && t.is_completed === 0)) counts.pending++;
//       else if (transfers.some((t: any) => t.to_doc === loginData.doctorId && t.is_completed === 1)) counts.inProgress++;
//       else if (transfers.some((t: any) => t.to_doc === loginData.doctorId && t.is_completed === 2)) counts.completed++;
//     } catch (err) {
//       counts.pending++; 
//     }
//   });

//   return counts;
// }, [clinicalOpPatientList, loginData.doctorId]);

const transferCounts = useMemo(() => {
  const counts = { all: 0, pending: 0, inProgress: 0, completed: 0 };

  // if doctorId is null/0, show all patients
  const patients = clinicalOpPatientList?.filter((p: any) => {
    if (!loginData.doctorId || loginData.doctorId === 0) return true;

    if (p.doctorId === loginData.doctorId) return true;

    const transfers = Array.isArray(p.transfers) ? p.transfers : [];
    return transfers.some((t: any) => Number(t.toDoc) === Number(loginData.doctorId));
  }) || [];

  counts.all = patients.length;

  patients.forEach((p: any) => {
    const transfers = Array.isArray(p.transfers) ? p.transfers : [];
    if (transfers.length === 0) {
      counts.pending++;
      return;
    }

    if (!loginData.doctorId || loginData.doctorId === 0) {
      // use first transfer status or default to pending
      const t = transfers[0];
      counts[t && Number(t.isCompleted) === 1 ? "inProgress" : t && Number(t.isCompleted) === 2 ? "completed" : "pending"]++;
    } else {
      const relevant = transfers.find((t: any) => Number(t.toDoc) === Number(loginData.doctorId));
      if (relevant) {
        counts[relevant && Number(relevant.isCompleted) === 1 ? "inProgress" : relevant && Number(relevant.isCompleted) === 2 ? "completed" : "pending"]++;
      }
    }
  });

  return counts;
}, [clinicalOpPatientList, loginData.doctorId]);


// const handleRowClick = async (item: any) => {
//   if (!item.transfers) {
//     console.log("No transfers for this patient.");
//     return;
//   }

//   try {
//     const transfers = JSON.parse(item.transfers); 
//     const filteredTransfers = transfers.filter(
//       (t: any) =>
//         t.to_doc === loginData.doctorId || loginData.doctorId === 0 || t.to_doc === null
//     );

    
//     console.log("Filtered transfers for this doctor:", filteredTransfers);
//     window.confirm(
//       `Do you want to continue? \nTransfers: ${JSON.stringify(filteredTransfers)}`
//     );
//     if(filteredTransfers.length > 0){
//       const firstTransfer = filteredTransfers[0];
//       const response = await caseSheetApiService.receiveDoctorTransfer(firstTransfer.id);
//     }

//     handleSavePatientData(item, routerPathNames.clinical.clinicalmenu, filteredTransfers);

//   } catch (err) {
//     console.error("Invalid transfers JSON", item.transfers);
//   }
// };

const handleSavePatientData = async (item: any, navLink: string) => {
  try {
    const transfers = Array.isArray(item.transfers) ? item.transfers : [];
    const deptService = new DepartmentApiService();
    
    // Check if patient is in doctor's transfer list
    const relevantTransfer = transfers.find((t: any) => Number(t.toDoc) === Number(loginData.doctorId));

    // If not in transfer list and user is admin/doctor, show modal confirmation
    if (!relevantTransfer && (loginData.isDoctor === 1 || loginData.isAdmin === 1) && loginData.doctorId && loginData.doctorId !== 0 && loginData.doctorId !== 1) {
      setPendingPatient(item);
      setPendingNavLink(navLink);
      setShowReceiveConfirmModal(true);
      return;
    }

    if (relevantTransfer) {
      await caseSheetApiService.receiveDoctorTransfer(relevantTransfer.id);
    }

    const updatedPatient = { ...item, doctorTransfer: relevantTransfer || null };
    if (isIp == 0) {
      dispatch(storeClinicalCurrentOpPatient(updatedPatient));
    } else {
      dispatch(storeClinicalCurrentIpPatient(item));
    }
    navigate(navLink);
  } catch (err) {
    console.error("Transfer handling error:", err);
  }
};

const handleConfirmReceivePatient = async () => {
  if (!pendingPatient || !pendingNavLink) {
    setShowReceiveConfirmModal(false);
    return;
  }

  try {
    const deptService = new DepartmentApiService();
    
    // Create a self-transfer (fromDoc and toDoc same)
      const selectedConsultant = consultants.find((c: any) => Number(c.consultantId) === Number(loginData.doctorId));
    // console.log("Selected consultant for transfer:", selectedConsultant);
    const payload = {
      toDoc: loginData.doctorId,
      investigationOrders: [
        {
          billId: 0,
          groupId: selectedConsultant?.groupId ?? 0,
          particularId: selectedConsultant?.particularId ?? 0,
          unit: 0,
          rate: selectedConsultant?.consultationCharge ?? 0,
          disc: 0,
          docId: 0,
          returnUnit: 0,
          fcRate: 0,
          patId: pendingPatient.patientId,
          vstId: pendingPatient.visitId,
          uid: 0,
          dateTime: new Date().toISOString(),
          finalBillId: 0
        }
      ]
    };
    
    // Save the transfer
    const transferResponse = await deptService.saveDoctorTransfer(payload);
    
    // Create the relevantTransfer from the response
    const newTransfer = {
      id: transferResponse?.id || 0,
      toDoc: loginData.doctorId,
      isCompleted: 1
    };
    
    // Mark as received
    if (newTransfer.id) {
      await caseSheetApiService.receiveDoctorTransfer(newTransfer.id);
    }
    
    // Update patient with new transfer
    const updatedPatient = { 
      ...pendingPatient, 
      transfers: [...(Array.isArray(pendingPatient.transfers) ? pendingPatient.transfers : []), newTransfer],
      doctorTransfer: newTransfer 
    };
    
    if (isIp == 0) {
      dispatch(storeClinicalCurrentOpPatient(updatedPatient));
    } else {
      dispatch(storeClinicalCurrentIpPatient(updatedPatient));
    }
    
    setShowReceiveConfirmModal(false);
    setPendingPatient(null);
    setPendingNavLink("");
    navigate(pendingNavLink);
  } catch (err) {
    console.error("Failed to receive patient transfer:", err);
    setShowReceiveConfirmModal(false);
  }
};

const handleCancelReceivePatient = () => {
  setShowReceiveConfirmModal(false);
  setPendingPatient(null);
  setPendingNavLink("");
};




  return (
    <Row className="patientlist_table d-block">
      {isSpinning ? (
        <Col className="position-absolute top-50 start-50 translate-middle text-center">
          <Spinner animation="border" variant="info" />
        </Col>
      ) : null}

      

      {isIp == 0 && (
        <>
        {/* ✅ Transfer status filter buttons */}
        {/* <Row className="mb-2  gap-2">
          <Button variant="secondary" size="sm" onClick={() => setTransferStatusFilter(null)}>All</Button>
          <Button variant="info" size="sm" onClick={() => setTransferStatusFilter(0)}>Pending (0)</Button>
          <Button variant="warning" size="sm" onClick={() => setTransferStatusFilter(1)}>In Progress (1)</Button>
          <Button variant="success" size="sm" onClick={() => setTransferStatusFilter(2)}>Completed (2)</Button>
        </Row> */}

        {/* <Row className="mb-3">
          <div className="d-flex gap-2 flex-wrap">

            {[
              { label: "All", value: null, color: "dark" },
              { label: "Pending", value: 0, color: "danger" },
              { label: "In Progress", value: 1, color: "warning" },
              { label: "Completed", value: 2, color: "success" },
            ].map((btn, index) => (
              <Button
                key={index}
                onClick={() => setTransferStatusFilter(btn.value)}
                variant={
                  transferStatusFilter === btn.value
                    ? btn.color
                    : "outline-" + btn.color
                }
                className="rounded-pill px-3 fw-semibold shadow-sm"
                size="sm"
              >
                {btn.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {btn.value ?? "All"}
                </Badge>
              </Button>
            ))}

          </div>
        </Row> */}

        {/* <Row className="mb-3">
          <div className="d-flex gap-2 flex-wrap">

            {[
              { label: "All", value: null, color: "dark", count: clinicalOpPatientList?.length || 0 },
              { label: "Pending", value: 0, color: "danger", count: transferCounts.pending },
              { label: "In Progress", value: 1, color: "warning", count: transferCounts.inProgress },
              { label: "Completed", value: 2, color: "success", count: transferCounts.completed },
            ].map((btn, index) => (
              <Button
                key={index}
                onClick={() => setTransferStatusFilter(btn.value)}
                variant={
                  transferStatusFilter === btn.value
                    ? btn.color
                    : "outline-" + btn.color
                }
                className="rounded-pill px-3 fw-semibold shadow-sm"
                size="sm"
              >
                {btn.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {btn.count}
                </Badge>
              </Button>
            ))}

          </div>
        </Row> */}

        {
          loginData.isDoctor === 0 || loginData.doctorId === 1 ? null :

       

        <Row className="mb-3">
          <div className="d-flex gap-2 flex-wrap">
            {[
              { label: "All", value: null, color: "dark", count: transferCounts.all },
              { label: "Pending", value: 0, color: "danger", count: transferCounts.pending },
              { label: "In Progress", value: 1, color: "warning", count: transferCounts.inProgress },
              { label: "Completed", value: 2, color: "success", count: transferCounts.completed },
            ].map((btn, index) => (
              <Button
                key={index}
                onClick={() => setTransferStatusFilter(btn.value)}
                variant={transferStatusFilter === btn.value ? btn.color : "outline-" + btn.color}
                className="rounded-pill px-3 fw-semibold shadow-sm"
                size="sm"
              >
                {btn.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {btn.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Row>
 }

        <Table striped hover>
          <thead className="table-dark sticky-top fs-11px">
            <tr className="fw-medium">
              <th>Sl No</th>
              <th>DEPARTMENT</th>
              <th>OP NO</th>
              <th>PATIENT NAME</th>
              <th>AGE/GENDER</th>
              <th>MOBILE</th>
              <th>ADDRESS</th>
              <th>REG TIME</th>
              <th>CASE SHEET</th>
              <th>PRESC</th>
              <th>INV/PROC</th>
              <th>VITALS</th>
              <th className="text-center">REPORTS</th>
            </tr>
          </thead>
          <tbody>
            {clinicalOpPatientList
              ?.filter((item: any) => handleDepartmentSearch(item))
              ?.filter((item: any) => handleTextSearch(item))
              ?.filter((item: any) => handleTransferFilter(item))
              .map((item: any, idx: number) => (
                <tr key={idx} className="curser-pointer" >
                  {/* <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.name}</td> */}
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{idx+1}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.departmentName}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.displayNumber}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>
                    {item.fullName}{" "}
                    {item.new ? (
                      <Badge pill bg="success" className="mx-2">
                        N
                      </Badge>
                    ) : (
                      <Badge pill bg="danger" className="mx-2">
                        R
                      </Badge>
                    )}
                  </td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>
                    {item.age} / {item.gender}
                  </td>
                  <td className="curser-default">
                    {item.mobileNumber}
                  </td>
                  <td className="curser-default">
                    {item.patientAddress}
                  </td>
                  <td className="curser-default">
                    {item.formattedTime}
                  </td>
                  <td className="curser-default">
                    <Button variant={item.casesheetStatus == 0 ? "danger" : "success"} size="sm" onClick={(e: any) => { e.stopPropagation(); handleSavePatientData(item, routerPathNames.clinical.generalCaseSheet3); }}>
                      CASE SHEET
                    </Button>
                  </td>
                  <td className="curser-default">
                    <Button variant={item.prescriptionStatus == 0 ? "danger" : item.prescriptionStatus == 1 ? "warning" : item.prescriptionStatus == 2 ? "success" : "secondary"} size="sm" onClick={(e: any) => { e.stopPropagation(); handleSavePatientData(item, routerPathNames.clinical.prescription); }}>
                      Presc
                    </Button>
                  </td>
                  <td className="curser-default">
                    <Button variant={item.labStatus == 0 ? "danger" : item.labStatus == 1 ? "warning" : "success"} size="sm" onClick={() => handleSavePatientData(item, routerPathNames.clinical.labandprocedure)}>
                      Inv/Proc
                    </Button>
                  </td>
                  <td className="curser-default">
                    <Button variant={item.vitalStatus == 0 ? "danger" : "success"} size="sm" onClick={(e: any) => { e.stopPropagation(); handleSavePatientData(item, routerPathNames.clinical.vitals); }}>
                      Vitals
                    </Button>
                  </td>
                  <td className="curser-default d-flex gap-1 w-auto justify-content-center">
                    <Button variant={"outline-primary"} size="sm"
                      onClick={(e: any) => { e.stopPropagation(); handleSavePatientData(item, routerPathNames.clinical.clinicalReport); }}
                    >
                      Clinical
                    </Button>
                    {/* <Button variant={"outline-secondary"} size="sm" className="ms-2 "
                      onClick={() => handleSavePatientData(item, routerPathNames.clinical.outsideReport)}
                    >
                      Lab Report
                    </Button> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        </>
      )}

      {isIp == 1 && (
        <Table striped hover> 
          <thead className="table-dark sticky-top fs-11px">
            <tr>
              <th>HIN</th>
              <th>IP NO</th>
              <th>PATIENT NAME</th>
              <th>WARD NAME / BED NO</th>
              <th>AD DATE</th>
              <th>PRESC</th>
              <th>LAB</th>
            </tr>
          </thead>
          <tbody>
            {clinicalIpPatientList
              ?.filter((item: any) => handleWardSearch(item))
              ?.filter((item: any) => handleTextSearch(item))
              .map((item: any, idx: number) => (
                <tr key={idx} className="curser-pointer">
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.displayNumber}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.ipNo}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.fullName}</td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>
                    {item.ward} / {item.bedNo}
                  </td>
                  <td onClick={() => handleSavePatientData(item, routerPathNames.clinical.clinicalmenu)}>{item.admissionDate}</td>
                  <td className="curser-default" onClick={() => handleSavePatientData(item, routerPathNames.clinical.prescription)}>
                    <Button variant="primary" size="sm">
                      Presc
                    </Button>
                  </td>
                  <td className="curser-default">
                    <Button variant="primary" size="sm" onClick={() => handleSavePatientData(item, routerPathNames.clinical.labandprocedure)}>
                      Lab
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      
      {/* Receive Patient Confirmation Modal */}
      <Modal show={showReceiveConfirmModal} onHide={handleCancelReceivePatient} centered>
        <Modal.Header closeButton>
          <Modal.Title>Receive Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            <strong>{pendingPatient?.fullName || pendingPatient?.displayNumber}</strong> is not in your list.
          </p>
          <p>Do you want to receive this patient?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelReceivePatient}>
            No, Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmReceivePatient}>
            Yes, Receive Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default PatientListTable;
