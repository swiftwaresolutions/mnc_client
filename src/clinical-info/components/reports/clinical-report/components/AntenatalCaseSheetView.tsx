
import React, { Fragment, useRef } from 'react'
import { ancChildDetailsDataInterface, ancDetailsDataInterface, antenatalCaseSheetInterface, prescriptionDeatilsInterface, ScreenDetails, visitDetailInterface } from '../model/interfaces'
import { Col, Row, Table } from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print'
import PrescriptionView from './PrescriptionView'

interface ComponentProps {
    ancCaseSheet: antenatalCaseSheetInterface,
    ancCasesheetDetails: ancDetailsDataInterface,
    patientDetails: any,
    prescription: prescriptionDeatilsInterface[]
}

const AntenatalCaseSheetView: React.FC<ComponentProps> = ({ ancCaseSheet, ancCasesheetDetails,patientDetails,prescription }) => {
    let antenatalCaseSheet: antenatalCaseSheetInterface = { ...ancCaseSheet }
    let antenatalCaseSheetDetails: ancDetailsDataInterface = { ...ancCasesheetDetails }

    const printRef = useRef(null);
    
      const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: "Antenatal Report",
      });

    const printRef1 = useRef(null);
    
      const handlePrint1 = useReactToPrint({
        content: () => printRef1.current,
        documentTitle: "Antenatal Report",
      });

    return (
        <Fragment>
            <Row className='h-100 flex-column position-relative'>
                {/* <Col className='flex-grow-0 sticky-top'>
                    <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                        <Col className='fw-bolder text-nowrap text-center fs-5 '>Antenatal Case Sheet</Col>
                    </Row>
                </Col> */}
                {
                    Object.keys(antenatalCaseSheet).length === 0 && Object.keys(antenatalCaseSheetDetails).length === 0 &&
                    <Fragment>
                        <Row className='py-4'>
                            <Col className='text-center fw-bold text-danger fs-13px'>CaseSheet is Empty</Col>
                        </Row>
                    </Fragment>
                }

                {
                    Object.keys(antenatalCaseSheet).length !== 0 &&

                    <Col className=''>
                        
                        <Row className="justify-content-end mt-0 no-print">
                            <Col><h6 className='text-success letter-spacing-05px sticky-top bg-white py-1 text-center'>INITIAL VISIT</h6></Col>
                            <Col xs="auto">
                                <button className="btn btn-primary" onClick={handlePrint}>
                                    Print
                                </button>
                            </Col>
                        </Row>
                        <div ref={printRef} className="print-area">
                            <div className="print-only">
                                <div className="text-center mb-4 print-header">
                                    <Row className='text-center fs-14px text-primary fw-bold p-1'>
                                        <Col>GNANADURAI HOSPITAL, SIVAKASI.</Col>
                                    </Row>
                                    <Row className='text-center fs-12px text-primary'><Col>ANTENATAL OP CASESHEET  
                                        
                                    </Col></Row>
                                    <hr />
                                    <Row className='text-center'>
                                        <Col>NAME : <span className="text-uppercase fw-bold">{patientDetails.fullName}</span></Col>
                                        <Col>Op No : {patientDetails.displayNumber}</Col>
                                    </Row>
                                    <Row className='text-center'>
                                        <Col>AGE : {patientDetails.age}Y</Col>
                                        <Col>GENDER : {patientDetails.gender}</Col>
                                    </Row>
                                    <Row className='text-center'>
                                        <Col> Date :
                                            {antenatalCaseSheet?.createdAt === "0000-00-00" || !antenatalCaseSheet?.createdAt
                                            ? "-"
                                            : (() => {
                                                const date = new Date(antenatalCaseSheet.createdAt);
                                                const day = String(date.getDate()).padStart(2, "0");
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const year = date.getFullYear();
                                                return `  ${day}-${month}-${year}`;
                                            })()}
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                    <hr />
                                </div>
                            </div>
                        
                        <Row className='h-100 justify-content-center'>
                            <Col>
                                <Row className='mt-2'>
                                    <Col>
                                        <Table bordered hover className='table-sm text-center'>
                                            <thead>
                                                <tr className='fs-13px'>
                                                    <th className='text-nowrap'>G</th>
                                                    <th className='text-nowrap'>P</th>
                                                    <th className='text-nowrap'>L</th>
                                                    <th className='text-nowrap'>A</th>
                                                    <th className='text-nowrap'>D</th>
                                                    <th className='text-nowrap'>LMP</th>
                                                    <th className='text-nowrap'>EDD</th>
                                                    <th className='text-nowrap'>SEDD</th>
                                                    <th className='text-nowrap'>GA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className='fs-14px'>
                                                    <td>{antenatalCaseSheet?.g}</td>
                                                    <td>{antenatalCaseSheet?.p}</td>
                                                    <td>{antenatalCaseSheet?.l}</td>
                                                    <td>{antenatalCaseSheet?.a}</td>
                                                    <td>{antenatalCaseSheet?.d}</td>
                                                    {/* <td>{`${antenatalCaseSheet?.lmp == "0000-00-00" ? "-" : antenatalCaseSheet?.lmp}`}</td>
                                                    <td>{`${antenatalCaseSheet?.edd == "0000-00-00" ? "-" : antenatalCaseSheet?.edd}`}</td>
                                                    <td>{`${antenatalCaseSheet?.sedd == "0000-00-00" ? "-" : antenatalCaseSheet?.sedd}`}</td> */}
                                                    <td>
                                                        {antenatalCaseSheet?.lmp === "0000-00-00" || !antenatalCaseSheet?.lmp
                                                            ? "-"
                                                            : (() => {
                                                                const date = new Date(antenatalCaseSheet.lmp);
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                    </td>
                                                    <td>{antenatalCaseSheet?.edd}</td>
                                                    {/* <td>
                                                        {antenatalCaseSheet?.edd === "0000-00-00" || !antenatalCaseSheet?.edd
                                                            ? "-"
                                                            : (() => {
                                                                const date = new Date(antenatalCaseSheet.edd);
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                    </td> */}
                                                    <td>
                                                        {antenatalCaseSheet?.sedd === "0000-00-00"
                                                            ? "-"
                                                            : (() => {
                                                                const date = new Date(antenatalCaseSheet?.sedd);
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                    </td>
                                                    <td>{antenatalCaseSheet?.ga}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row className='no-print'>
                                    {antenatalCaseSheet.riskFactor &&
                                    <Col md= {6}>
                                        <h6 className='text-success'>Risk Factors</h6>
                                        <p className='fs-14px'>{antenatalCaseSheet.riskFactor}</p>
                                    </Col>
                                    }
                                    {antenatalCaseSheet.personalInfo &&
                                    <Col md= {6}>
                                        <h6 className='text-success'>Patient Info</h6>
                                        <p className='fs-14px'>{antenatalCaseSheet.personalInfo}</p>
                                    </Col>
                                    }
                                </Row>
                                {
                                    antenatalCaseSheet.ancChildDetialsDataList?.length > 0 &&

                                    <Row>
                                        <Col className='overflow-auto'>
                                            <Table bordered hover className='table-sm text-center'>
                                                <thead>
                                                    <tr className='fs-13px text-center'>
                                                        <th className='text-nowrap'>GESTATION</th>
                                                        <th className='text-nowrap'>STATUS</th>
                                                        <th className='text-nowrap'>SEX</th>
                                                        <th className='text-nowrap'>DATE</th>
                                                        <th className='text-nowrap'>PLACE</th>
                                                        <th className='text-nowrap'>MODE</th>
                                                        <th className='text-nowrap'>OTHERS</th>
                                                        <th className='text-nowrap'>TYPE</th>
                                                        <th className='text-nowrap'>Risk Factors</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        antenatalCaseSheet.ancChildDetialsDataList?.map((childList: ancChildDetailsDataInterface, cIdx: number) => {
                                                            return (
                                                                <tr key={cIdx} className='fs-14px'>
                                                                    <td>{cIdx + 1}</td>
                                                                    <td>{childList.status === 1 ? "LIVE BIRTH" : childList.status === 2 ? "STILL BIRTH" : childList.status === 3 ? "ABORTION" : ""}</td>
                                                                    <td>{childList.sex === 1 ? "BOY" : childList.sex === 2 ? "GIRL" : ""}</td>
                                                                    {/* <td className='text-nowrap'>{childList.birthdate === "0000-00-00" ? '' : new Date(childList.birthdate).toLocaleDateString('en-GB')}</td> */}
                                                                    <td className='text-nowrap'>
                                                                    {childList.birthdate && childList.birthdate !== "0000-00-00"
                                                                        ? (() => {
                                                                            const date = new Date(childList.birthdate);
                                                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
                                                                            const year = date.getFullYear();
                                                                            return `${month}-${year}`;
                                                                        })()
                                                                        : ''}
                                                                    </td>
                                                                    <td>{childList.place}</td>
                                                                    <td>{childList.mode}</td>
                                                                    <td>{childList.others}</td>
                                                                    <td>{childList.type === 1 ? "INDUCED" : childList.type === 2 ? "SPONTANEOUS" : ""}</td>
                                                                    <td>{childList.riskFacOfThisPre}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                }
                                <Row className='mt-1 border pt-1'>
                                    <Col>
                                    {
                                       ( antenatalCaseSheet?.durationofmarriage != "" || antenatalCaseSheet?.consanguinity != "" || antenatalCaseSheet?.conception != "" || antenatalCaseSheet?.menstrualHis != "" || antenatalCaseSheet?.menstrualOthers != "" ) && 
                                    
                                        <Row>
                                            <Col className='overflow-auto'>
                                                <Table bordered hover className='table-sm text-center'>
                                                    <thead>
                                                        <tr className='fs-13px'>
                                                            <th className='text-nowrap'>DUR. OF MARRIAGE</th>
                                                            <th className='text-nowrap'>CONSANGUINITY</th>
                                                            <th className='text-nowrap'>CONCEPTION</th>
                                                            <th className='text-nowrap'>MENSTRUAL</th>
                                                            <th className='text-nowrap'>MENSTRUAL HISTORY</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className='fs-14px'>
                                                            <td>{antenatalCaseSheet?.durationofmarriage}</td>
                                                            <td>{antenatalCaseSheet?.consanguinity}</td> 
                                                            <td>{antenatalCaseSheet?.conception}</td>
                                                            <td>{antenatalCaseSheet?.menstrualHis}</td>
                                                            <td>{antenatalCaseSheet?.menstrualOthers}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        }
                                        <Row className={`${antenatalCaseSheet.stDose1 === 1 || antenatalCaseSheet.ndDose2 === 1 ? "" : "d-none"}`}>
                                            <Col>
                                                <h6>TD Vaccine</h6>
                                                <ol>
                                                    {antenatalCaseSheet.stDose1 === 1 ? <li className='fs-14px'>First Dose - {antenatalCaseSheet.stDose1 === 1 ? "yes" : "no"}  {antenatalCaseSheet.stDoseIn === "0000-00-00" ? "" : `- ${antenatalCaseSheet.stDoseIn}`}</li> : null}
                                                    {antenatalCaseSheet.ndDose2 === 1 ? <li className='fs-14px'>Second Dose - {antenatalCaseSheet.ndDose2 === 1 ? "yes" : "no"}  {antenatalCaseSheet.ndDoseIn === "0000-00-00" ? "" : `- ${antenatalCaseSheet.ndDoseIn}`}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>
                                        <Row className='text-center d-flex flex-column border'>
                                            <Col className={`${antenatalCaseSheet.diabetes === 1 || antenatalCaseSheet.hypertension === 1 || antenatalCaseSheet.asthma === 1 || antenatalCaseSheet.seiure === 1 || antenatalCaseSheet.cardiacDisease === 1 || antenatalCaseSheet.tb === 1 || antenatalCaseSheet.thyroidDisorder === 1 || antenatalCaseSheet.medicalHistory == 1 || antenatalCaseSheet.others == 1 ? "" : 'd-none'} `}>
                                                <h6>MEDICAL HISTORY</h6>
                                                <ol>
                                                    {antenatalCaseSheet.diabetes === 1 ? <li className='p-1 text-start fs-14px '>{`Diabetes : ${antenatalCaseSheet.diabetesNotes}`}</li> : null}
                                                    {antenatalCaseSheet.hypertension === 1 ? <li className='p-1 text-start fs-14px '>{`Hypertension : ${antenatalCaseSheet.hypertensionNotes}`}</li> : null}
                                                    {antenatalCaseSheet.asthma === 1 ? <li className='p-1 text-start fs-14px '>{`Asthma : ${antenatalCaseSheet.asthmaNotes}`}</li> : null}
                                                    {antenatalCaseSheet.seiure === 1 ? <li className='p-1 text-start fs-14px '>{`Seiure Disorder : ${antenatalCaseSheet.seiureNotes}`}</li> : null}
                                                    {antenatalCaseSheet.cardiacDisease === 1 ? <li className='p-1 text-start fs-14px '>{`Cardiac Diseases : ${antenatalCaseSheet.cardiacNotes}`}</li> : null}
                                                    {antenatalCaseSheet.tb === 1 ? <li className='p-1 text-start fs-14px '>{`TB : ${antenatalCaseSheet.tbNotes}`}</li> : null}
                                                    {antenatalCaseSheet.thyroidDisorder === 1 ? <li className='p-1 text-start fs-14px '>{`Thyroid Disorders : ${antenatalCaseSheet.thyroidDisorderNotes}`}</li> : null}
                                                    {antenatalCaseSheet.others == 1 ? <li className='p-1 text-start fs-14px '>{`Others : ${antenatalCaseSheet.othersNotes}`}</li> : null}
                                                    {antenatalCaseSheet.medicalHistory == 1 ? <li className='p-1 text-start fs-14px '>Nil</li> : null}
                                                </ol>
                                            </Col>
                                            <Col className={`${antenatalCaseSheet.surgicalHistory != "" || antenatalCaseSheet.chiefhistory != "" || antenatalCaseSheet.allergichistory != "" || antenatalCaseSheet.historyPreIll != "" || antenatalCaseSheet.familyHistory != "" || antenatalCaseSheet.othersHis != "" ? "" : 'd-none'} border`}>
                                                {/* <h6>MEDICAL HISTORY</h6> */}
                                                <ol className=''>
                                                    {antenatalCaseSheet.surgicalHistory != '' ? <li className='p-1 text-start fs-14px '>{`Surgical History - ${antenatalCaseSheet.surgicalHistory}`}</li> : null}
                                                    {antenatalCaseSheet.chiefhistory != '' ? <li className='p-1 text-start fs-14px '>{`Chief Complaints - ${antenatalCaseSheet.chiefhistory}`}</li> : null}
                                                    {antenatalCaseSheet.allergichistory != '' ? <li className='p-1 text-start fs-14px '>{`Allergic History - ${antenatalCaseSheet.allergichistory}`}</li> : null}
                                                    {antenatalCaseSheet.historyPreIll != '' ? <li className='p-1 text-start fs-14px '>{`History of Present Illness - ${antenatalCaseSheet.historyPreIll}`}</li> : null}
                                                    {antenatalCaseSheet.familyHistory != '' ? <li className='p-1 text-start fs-14px '>{`Family History - ${antenatalCaseSheet.familyHistory}`}</li> : null}
                                                    {antenatalCaseSheet.othersHis != '' ? <li className='p-1 text-start fs-14px '>{`Other History - ${antenatalCaseSheet.othersHis}`}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className='d-flex flex-column fs-16px'>
                                    {/* <Col className={`${antenatalCaseSheet.pallor != "" || antenatalCaseSheet.icterus != "" || antenatalCaseSheet.icterus != "" ? "" : "d-none"}`}>
                                <h6>General Examination</h6>
                                <ol>
                                    { antenatalCaseSheet.pallor  != "" ? <li>Pallor - {antenatalCaseSheet.pallor}</li> : null}
                                    { antenatalCaseSheet.icterus != "" ? <li>Icterus - {antenatalCaseSheet.icterus}</li> : null}
                                    { antenatalCaseSheet.edema   != "" ? <li>Edema - {antenatalCaseSheet.edema}</li> : null}
                                </ol>
                            </Col> */}
                            {
                                (antenatalCaseSheet.pallor != "" || antenatalCaseSheet.icterus != "" || antenatalCaseSheet.edema != "" ) &&
                                    <Table bordered className='mb-0'>
                                        <thead>
                                            <tr className='text-center'>
                                                <th>Pallor</th>
                                                <th>Icterus</th>
                                                <th>Edema</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='text-center'>
                                                <td>{antenatalCaseSheet.pallor}</td>
                                                <td>{antenatalCaseSheet.icterus}</td>
                                                <td>{antenatalCaseSheet.edema}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                }
                                    <Col className={`${antenatalCaseSheet.cvs != "" || antenatalCaseSheet.rs != "" || antenatalCaseSheet.iniSysOther != "" ? "" : "d-none"}`}>
                                        <h6 className='text-success'>Systemic Examination</h6>
                                        <ol>
                                            {antenatalCaseSheet.cvs != "" ? <li>CVS - {antenatalCaseSheet.cvs}</li> : null}
                                            {antenatalCaseSheet.rs != "" ? <li>RS - {antenatalCaseSheet.rs}</li> : null}
                                            {antenatalCaseSheet.iniSysOther != "" ? <li>Others - {antenatalCaseSheet.iniSysOther}</li> : null}
                                        </ol>
                                    </Col>
                                {
                                        ( antenatalCaseSheet.utreusSize != "" || antenatalCaseSheet.symphosisFundal != "" || antenatalCaseSheet.featolHeartRate != "" || antenatalCaseSheet.presentationAb != "" || antenatalCaseSheet.engaged != "" || antenatalCaseSheet.iniPaOther != "" ) &&
                                    
                                    <Col>
                                        <Row>
                                            <Col className='overflow-auto'>
                                                <h6 className='text-success'>Abdomen</h6>
                                                <Table bordered hover className='table-sm text-center'>
                                                    <thead>
                                                        <tr className='fs-13px text-center'>
                                                            <th className='text-nowrap'>Uterus</th>
                                                            <th className=''>Symphyosio Fundal Height</th>
                                                            <th className=''>Fetal Heart Rate</th>
                                                            <th className='text-nowrap'>Presentation</th>
                                                            <th className='text-nowrap'>Engaged</th>
                                                            <th className='text-nowrap'>Others</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='fs-14px'>{antenatalCaseSheet.utreusSize}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.symphosisFundal}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.featolHeartRate}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.presentationAb}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.engaged}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.iniPaOther}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {
                                   ( antenatalCaseSheet.cervix != "" || antenatalCaseSheet.dilatation != "" || antenatalCaseSheet.effacement != "" || antenatalCaseSheet.presentationPV != "" || antenatalCaseSheet.station != "" || antenatalCaseSheet.membrane != "" || antenatalCaseSheet.pelvis != "" || antenatalCaseSheet.iniPvOther != "" ) &&
                                
                                    <Col>
                                        <Row>
                                            <Col className='overflow-auto'>
                                                <h6 className='text-success'>Per Vaginum</h6>
                                                <Table bordered hover className='table-sm text-center'>
                                                    <thead>
                                                        <tr className='fs-13px text-center'>
                                                            <th className='text-nowrap'>Cervix</th>
                                                            <th className=''>Dilation</th>
                                                            <th className=''>Effacement</th>
                                                            <th className='text-nowrap'>Presentation</th>
                                                            <th className='text-nowrap'>Station</th>
                                                            <th className='text-nowrap'>Membrane</th>
                                                            <th className='text-nowrap'>Pelvis</th>
                                                            <th className='text-nowrap'>Others</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='fs-14px'>{antenatalCaseSheet.cervix}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.dilatation}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.effacement}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.presentationPV}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.station}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.membrane}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.pelvis}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.iniPvOther}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                    }
                                </Row>
                                <Row className={`fs-14px mt-2 ${antenatalCaseSheet.othersPlan == "" ? "d-none" : ''}`}>
                                    <Col className=''>{`PLAN : ${antenatalCaseSheet.othersPlan}`}</Col>
                                </Row>
                                {/* <h6 className={`text-center text-secondary ${antenatalCaseSheet.initialAppointmentDate == "00/00/0000" ? "d-none" : ''}`}>APPOINTMENT DETAILS</h6> */}
                                <Row className={`fs-15px fw-bold ${antenatalCaseSheet.initialAppointmentDate == "00/00/0000" && antenatalCaseSheet.initialAppointmentPlan == "" ? "d-none" : ''}`}>
                                    <Col className='text-danger'>{`Next Visit : ${antenatalCaseSheet.initialAppointmentDate} Reason : ${antenatalCaseSheet.initialAppointmentPlan}`}</Col>
                                </Row>
                                {/* <Row className={`fs-15px fw-bold ${antenatalCaseSheet.initialAppointmentPlan == "" ? "d-none" : ''}`}>
                                    <Col>{`Reason : ${antenatalCaseSheet.initialAppointmentPlan}`}</Col>
                                </Row> */}
                            </Col>
                        </Row>
                        <Row>
                            <PrescriptionView {...{ prescription: prescription, patientDetails , printStatus : 0}} />
                        </Row>
                    </div>
                    </Col>
                }
                {
                    Object.keys(antenatalCaseSheetDetails).length !== 0 &&

                    <Col>
                        <div ref={printRef1} className="print-area">
                            <div className="print-only">
                                <div className="text-center mb-4 print-header">
                                    <Row className='text-center fs-14px text-primary fw-bold p-1'>
                                        <Col>GNANADURAI HOSPITAL, SIVAKASI.</Col>
                                    </Row>
                                    <Row className='text-center fs-12px text-primary'><Col>ANTENATAL OP CASESHEET </Col></Row>
                                    <hr />
                                    <Row className='text-center'>
                                        <Col>NAME : <span className="text-uppercase fw-bold">{patientDetails.fullName}</span></Col>
                                        <Col>Op No : {patientDetails.displayNumber}</Col>
                                    </Row>
                                    <Row className='text-center'>
                                        <Col>AGE : {patientDetails.age}Y</Col>
                                        <Col>GENDER : {patientDetails.gender}</Col>
                                    </Row>
                                    <Row className='text-center'>
                                        <Col> Date :
                                            {antenatalCaseSheetDetails?.createdAt === "0000-00-00" || !antenatalCaseSheetDetails?.createdAt
                                            ? "-"
                                            : (() => {
                                                const date = new Date(antenatalCaseSheetDetails.createdAt);
                                                const day = String(date.getDate()).padStart(2, "0");
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const year = date.getFullYear();
                                                return `  ${day}-${month}-${year}`;
                                            })()}
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                    <hr />
                                </div>
                            </div>
                        <Row className="justify-content-end mt-0 no-print">
                            <Col><h6 className='text-success letter-spacing-05px sticky-top bg-white py-1 text-center'>SUBSEQUENT VISIT</h6></Col>
                            <Col xs="auto">
                                <button className="btn btn-primary" onClick={handlePrint1}>
                                    Print
                                </button>
                            </Col>
                        </Row>
                        
                        <Row className='h-100 d-flex flex-column rounded-bottom border border-top-0 justify-content-center'>
                            {/* <Col className='text-center text-primary'>SUBSEQUENT VISIT</Col> */}
                            <Col>
                                <Row className={`${antenatalCaseSheetDetails.height != '' || antenatalCaseSheetDetails.weight != '' || antenatalCaseSheetDetails.bmi != '' || antenatalCaseSheetDetails.temperature != '' || antenatalCaseSheetDetails.pulse != '' || antenatalCaseSheetDetails.rr != '' || antenatalCaseSheetDetails.bp != '' || antenatalCaseSheetDetails.spo2 != '' ? '' : 'd-none' }`}>
                                    <Col className='overflow-auto'>
                                        <Table bordered hover className='table-sm text-center'>
                                            <thead>
                                                <tr className='fs-13px text-center'>
                                                    <th className='text-nowrap'>HEIGHT</th>
                                                    <th className='text-nowrap'>WEIGHT</th>
                                                    <th className='text-nowrap'>BMI</th>
                                                    <th className='text-nowrap'>TEMPERATURE</th>
                                                    <th className='text-nowrap'>PULSE</th>
                                                    <th className='text-nowrap'>RR</th>
                                                    <th className='text-nowrap'>BP</th>
                                                    <th className='text-nowrap'>SPO2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && ()} */}
                                                <tr className='fs-14px text-center'>
                                                    <td>{antenatalCaseSheetDetails.height}</td>
                                                    <td>{antenatalCaseSheetDetails.weight}</td>
                                                    <td>{antenatalCaseSheetDetails.bmi}</td>
                                                    <td>{antenatalCaseSheetDetails.temperature}</td>
                                                    <td>{antenatalCaseSheetDetails.pulse}</td>
                                                    <td>{antenatalCaseSheetDetails.rr}</td>
                                                    <td>{antenatalCaseSheetDetails.bp}</td>
                                                    <td>{antenatalCaseSheetDetails.spo2}</td>
                                                    
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='overflow-auto'>
                                        <Table bordered hover className='table-sm text-center'>
                                            <thead>
                                                <tr className='fs-13px text-center'>
                                                    <th className='text-nowrap'>G</th>
                                                    <th className='text-nowrap'>p</th>
                                                    <th className='text-nowrap'>L</th>
                                                    <th className='text-nowrap'>A</th>
                                                    <th className='text-nowrap'>D</th>
                                                    <th className='text-nowrap'>LMP</th>
                                                    <th className='text-nowrap'>EDD</th>
                                                    <th className='text-nowrap'>SEDD</th>
                                                    <th className='text-nowrap'>GA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && ()} */}
                                                <tr className='fs-14px text-center'>
                                                    <td>{antenatalCaseSheetDetails.g}</td>
                                                    <td>{antenatalCaseSheetDetails.p}</td>
                                                    <td>{antenatalCaseSheetDetails.l}</td>
                                                    <td>{antenatalCaseSheetDetails.a}</td>
                                                    <td>{antenatalCaseSheetDetails.d}</td>
                                                    <td>
                                                        {antenatalCaseSheetDetails?.lmp === "0000-00-00" || !antenatalCaseSheetDetails?.lmp
                                                            ? "-"
                                                            : (() => {
                                                                const date = new Date(antenatalCaseSheetDetails.lmp);
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                    </td>
                                                    {/* <td>{antenatalCaseSheetDetails.lmp}</td> */}
                                                    <td>{antenatalCaseSheetDetails.edd}</td>
                                                    <td>
                                                        {antenatalCaseSheetDetails?.sedd === "0000-00-00" || !antenatalCaseSheetDetails?.sedd
                                                            ? "-"
                                                            : (() => {
                                                                const date = new Date(antenatalCaseSheetDetails.sedd);
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                    </td>
                                                    {/* <td>{antenatalCaseSheetDetails.sedd}</td> */}
                                                    <td>{antenatalCaseSheetDetails.ga}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>

                                <Row className={`fs-14px ${antenatalCaseSheetDetails.chiefComplaints != '' || antenatalCaseSheetDetails.hisPreIll != '' ? '' : 'd-none'}`}>
                                    <Col>
                                        <h6>Complaints Details</h6>
                                        <ol>
                                            {antenatalCaseSheetDetails.chiefComplaints != '' ? <li>Chief Complaints - {antenatalCaseSheetDetails.chiefComplaints}</li> : null}
                                            {antenatalCaseSheetDetails.hisPreIll != '' ? <li>History of Present Illness - {antenatalCaseSheetDetails.hisPreIll}</li> : null}
                                        </ol>
                                    </Col>
                                </Row>
                                
                                {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                        <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.pallor != 0 || antenatalCaseSheet.ancDetialsDataList[0]?.icterus != 0 || antenatalCaseSheet.ancDetialsDataList[0]?.edema != 0 ? "" : "d-none"}`}>
                            </Row>
                            )} */}
                                <Row>
                                    <Col>
                                        <Row className={`fs-14px ${antenatalCaseSheetDetails.pallor != 0 || antenatalCaseSheetDetails.icterus != 0 || antenatalCaseSheetDetails.edema != 0 ? '' : 'd-none'}`}>
                                            <Col>
                                                <h6>General Examination</h6>
                                                <ol>
                                                    {antenatalCaseSheetDetails.pallor != 0 ? <li>Pallor - {antenatalCaseSheetDetails.pallor}</li> : null}
                                                    {antenatalCaseSheetDetails.icterus != 0 ? <li>Icterus - {antenatalCaseSheetDetails.icterus}</li> : null}
                                                    {antenatalCaseSheetDetails.edema != 0 ? <li>Edema - {antenatalCaseSheetDetails.edema}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>

                                        

                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                                    <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.cvs != "" || antenatalCaseSheet.ancDetialsDataList[0]?.rs != "" ? "" : "d-none"}`}>
                                        </Row>
                                    )} */}
                                        <Row className={`fs-14px ${antenatalCaseSheetDetails.cvs != '' || antenatalCaseSheetDetails.rs != '' || antenatalCaseSheetDetails.subSysOther != '' ? '' : 'd-none'}`}>
                                            <Col>
                                                <h6>Systemic Examination</h6>
                                                <ol>
                                                    {antenatalCaseSheetDetails.cvs != '' ? <li>CVS - {antenatalCaseSheetDetails.cvs}</li> : null}
                                                    {antenatalCaseSheetDetails.rs != '' ? <li>RS - {antenatalCaseSheetDetails.rs}</li> : null}
                                                    {antenatalCaseSheetDetails.subSysOther != '' ? <li>Others - {antenatalCaseSheetDetails.subSysOther}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>

                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                                    <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.chiefcomplaints != "" || antenatalCaseSheet.ancDetialsDataList[0]?.hisPreIll != "" ? "" : "d-none"}`}>
                                        </Row>
                                    )} */}
                                        

                                        <Row className={`fs-14px ${antenatalCaseSheetDetails.utreusSize != '' || antenatalCaseSheetDetails.symphosisFundal != '' || antenatalCaseSheetDetails.featolHeartRate != '' || antenatalCaseSheetDetails.presentationAb != '' || antenatalCaseSheetDetails.engaged != '' || antenatalCaseSheetDetails.subPaOther != '' ? '' : 'd-none'}`}>
                                            <Col className='overflow-auto'>
                                                <h6>Abdomen</h6>
                                                <Table bordered hover className='table-sm text-center'>
                                                    <thead>
                                                        <tr className='fs-13px text-center'>
                                                            <th>Uterus Size</th>
                                                            <th>Symphosio Fundal Height</th>
                                                            <th>Fetal Heart Rate</th>
                                                            <th>Presentation</th>
                                                            <th>Engaged</th>
                                                            <th>Others</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && ()} */}
                                                        <tr className='fs-14px text-center'>
                                                            <td>{antenatalCaseSheetDetails.utreusSize}</td>
                                                            <td>{antenatalCaseSheetDetails.symphosisFundal}</td>
                                                            <td>{antenatalCaseSheetDetails.featolHeartRate}</td>
                                                            <td>{antenatalCaseSheetDetails.presentationAb}</td>
                                                            <td>{antenatalCaseSheetDetails.engaged}</td>
                                                            <td>{antenatalCaseSheetDetails.subPaOther}</td>
                                                        </tr>

                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row className={`fs-14px ${antenatalCaseSheetDetails.cervix != '' || antenatalCaseSheetDetails.dilatation != 0 || antenatalCaseSheetDetails.effacement != '' || antenatalCaseSheetDetails.presentationPv != '' || antenatalCaseSheetDetails.station != '' || antenatalCaseSheetDetails.membrane != '' || antenatalCaseSheetDetails.pelvis != 0 || antenatalCaseSheetDetails.subPvOther != '' ? '' : 'd-none'}`}>
                                            <Col className='overflow-auto'>
                                                <h6>Per Vaginum</h6>
                                                <Table bordered hover className='table-sm text-center'>
                                                    <thead>
                                                        <tr className='fs-13px text-center'>
                                                            <th>Cervix</th>
                                                            <th>Dilation</th>
                                                            <th>Effacement</th>
                                                            <th>Presentation</th>
                                                            <th>Station</th>
                                                            <th>Membrane</th>
                                                            <th>Pelvis</th>
                                                            <th>Others</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && ()} */}
                                                        <tr className='fs-14px text-center'>
                                                            <td>{antenatalCaseSheetDetails.cervix}</td>
                                                            <td>{antenatalCaseSheetDetails.dilatation}</td>
                                                            <td>{antenatalCaseSheetDetails.effacement}</td>
                                                            <td>{antenatalCaseSheetDetails.presentationPv}</td>
                                                            <td>{antenatalCaseSheetDetails.station}</td>
                                                            <td>{antenatalCaseSheetDetails.membrane}</td>
                                                            <td>{antenatalCaseSheetDetails.pelvis}</td>
                                                            <td>{antenatalCaseSheetDetails.subPvOther}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row className={`fs-14px mt-2 ${antenatalCaseSheetDetails.subOthersPlan == "" ? "d-none" : ''}`}>
                                            <Col className=''>{`PLAN : ${antenatalCaseSheetDetails.subOthersPlan}`}</Col>
                                        </Row>
                                        {/* <h6 className={`text-center text-secondary ${antenatalCaseSheetDetails.subsequentAppointmentDate == "" ? "d-none" : ''}`}>APPOINTMENT DETAILS</h6> */}
                                        <Row className={`fs-15px fw-bold ${antenatalCaseSheetDetails.subsequentAppointmentDate == "" && antenatalCaseSheetDetails.subsequentAppointmentPlan == "" ? "d-none" : ''}`}>
                                            <Col className='text-danger'>{`Next Visit : ${antenatalCaseSheetDetails.subsequentAppointmentDate} -  Reason : ${antenatalCaseSheetDetails.subsequentAppointmentPlan}`}</Col>
                                        </Row>
                                        {/* <Row className={`fs-15px fw-bold ${antenatalCaseSheetDetails.subsequentAppointmentPlan == "" ? "d-none" : ''}`}>
                                            <Col>{`Reason : ${antenatalCaseSheetDetails.subsequentAppointmentPlan}`}</Col>
                                        </Row> */}
                                        
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className=''>
                            <PrescriptionView {...{ prescription: prescription, patientDetails , printStatus : 0}} />
                        </Row>
                    </div>
                    </Col>
                }
            </Row>
        </Fragment>
    )
}

export default AntenatalCaseSheetView