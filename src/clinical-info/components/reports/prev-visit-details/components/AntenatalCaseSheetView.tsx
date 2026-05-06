
import React, { Fragment } from 'react'
import { ancChildDetailsDataInterface, ancDetailsDataInterface, antenatalCaseSheetInterface } from '../model/interfaces'
import { Col, Row, Table } from 'react-bootstrap'

interface ComponentProps {
    ancCaseSheet: antenatalCaseSheetInterface,
    ancCasesheetDetails: ancDetailsDataInterface,
}

const AntenatalCaseSheetView: React.FC<ComponentProps> = ({ ancCaseSheet, ancCasesheetDetails }) => {
    console.log(ancCaseSheet)
    let antenatalCaseSheet: antenatalCaseSheetInterface = { ...ancCaseSheet }
    let antenatalCaseSheetDetails: ancDetailsDataInterface = { ...ancCasesheetDetails }
    // console.log("AntenatalCaseSheetView", Object.keys(antenatalCaseSheet).length)
    return (
        <Fragment>
            <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                <Col className='fw-bolder text-nowrap text-center fs-5 '>ANTENATAL CASE SHEET</Col>
            </Row>
            <Row className='h-100  position-relative'>
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
                        <h6 className='text-success letter-spacing-05px sticky-top bg-white py-1 text-center'>INITIAL VISIT</h6>
                        <Row className='h-100 h-100 justify-content-center'>
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
                                                    <td>{`${antenatalCaseSheet?.lmp == "0000-00-00" ? "-" : antenatalCaseSheet?.lmp}`}</td>
                                                    <td>{`${antenatalCaseSheet?.edd == "0000-00-00" ? "-" : antenatalCaseSheet?.edd}`}</td>
                                                    <td>{`${antenatalCaseSheet?.sedd == "0000-00-00" ? "-" : antenatalCaseSheet?.sedd}`}</td>
                                                    <td>{antenatalCaseSheet?.ga}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
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
                                                                    <td className='text-nowrap'>{childList.birthdate === "0000-00-00" ? '' : childList.birthdate}</td>
                                                                    <td>{childList.place}</td>
                                                                    <td>{childList.mode}</td>
                                                                    <td>{childList.others}</td>
                                                                    <td>{childList.type === 1 ? "INDUCED" : childList.type === 2 ? "SPONTANEOUS" : ""}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                }
                                <Row className='mt-2 border pt-1'>
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
                                                    {antenatalCaseSheet.diabetes === 1 ? <li className='p-1 text-start fs-14px border'>{`Diabetes : ${antenatalCaseSheet.diabetesNotes}`}</li> : null}
                                                    {antenatalCaseSheet.hypertension === 1 ? <li className='p-1 text-start fs-14px border'>{`Hypertension : ${antenatalCaseSheet.hypertensionNotes}`}</li> : null}
                                                    {antenatalCaseSheet.asthma === 1 ? <li className='p-1 text-start fs-14px border'>{`Asthma : ${antenatalCaseSheet.asthmaNotes}`}</li> : null}
                                                    {antenatalCaseSheet.seiure === 1 ? <li className='p-1 text-start fs-14px border'>{`Seiure Disorder : ${antenatalCaseSheet.seiureNotes}`}</li> : null}
                                                    {antenatalCaseSheet.cardiacDisease === 1 ? <li className='p-1 text-start fs-14px border'>{`Cardiac Diseases : ${antenatalCaseSheet.cardiacNotes}`}</li> : null}
                                                    {antenatalCaseSheet.tb === 1 ? <li className='p-1 text-start fs-14px border'>{`TB : ${antenatalCaseSheet.tbNotes}`}</li> : null}
                                                    {antenatalCaseSheet.thyroidDisorder === 1 ? <li className='p-1 text-start fs-14px border'>{`Thyroid Disorders : ${antenatalCaseSheet.thyroidDisorderNotes}`}</li> : null}
                                                    {antenatalCaseSheet.others == 1 ? <li className='p-1 text-start fs-14px border'>{`Others : ${antenatalCaseSheet.othersNotes}`}</li> : null}
                                                    {antenatalCaseSheet.medicalHistory == 1 ? <li className='p-1 text-start fs-14px border'>Nil</li> : null}
                                                </ol>
                                            </Col>
                                            <Col className={`${antenatalCaseSheet.surgicalHistory != "" || antenatalCaseSheet.chiefhistory != "" || antenatalCaseSheet.allergichistory != "" || antenatalCaseSheet.historyPreIll != "" || antenatalCaseSheet.familyHistory != "" || antenatalCaseSheet.othersHis != "" ? "" : 'd-none'} border`}>
                                                {/* <h6>MEDICAL HISTORY</h6> */}
                                                <ol className=''>
                                                    {antenatalCaseSheet.surgicalHistory != '' ? <li className='p-1 text-start fs-14px border'>{`Surgical History - ${antenatalCaseSheet.surgicalHistory}`}</li> : null}
                                                    {antenatalCaseSheet.chiefhistory != '' ? <li className='p-1 text-start fs-14px border'>{`Chief Complaints - ${antenatalCaseSheet.chiefhistory}`}</li> : null}
                                                    {antenatalCaseSheet.allergichistory != '' ? <li className='p-1 text-start fs-14px border'>{`Allergic History - ${antenatalCaseSheet.allergichistory}`}</li> : null}
                                                    {antenatalCaseSheet.historyPreIll != '' ? <li className='p-1 text-start fs-14px border'>{`History of Present Illness - ${antenatalCaseSheet.historyPreIll}`}</li> : null}
                                                    {antenatalCaseSheet.familyHistory != '' ? <li className='p-1 text-start fs-14px border'>{`Family History - ${antenatalCaseSheet.familyHistory}`}</li> : null}
                                                    {antenatalCaseSheet.othersHis != '' ? <li className='p-1 text-start fs-14px border'>{`Other History - ${antenatalCaseSheet.othersHis}`}</li> : null}
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
                                    <Col className={`${antenatalCaseSheet.cvs != "" || antenatalCaseSheet.rs != "" ? "" : "d-none"}`}>
                                        <h6 className='text-success'>Systemic Examination</h6>
                                        <ol>
                                            {antenatalCaseSheet.cvs != "" ? <li>CVS - {antenatalCaseSheet.cvs}</li> : null}
                                            {antenatalCaseSheet.rs != "" ? <li>RS - {antenatalCaseSheet.rs}</li> : null}
                                        </ol>
                                    </Col>
                                {
                                        ( antenatalCaseSheet.utreusSize != "" || antenatalCaseSheet.symphosisFundal != "" || antenatalCaseSheet.featolHeartRate != "" || antenatalCaseSheet.presentationAb != "" || antenatalCaseSheet.engaged != "" ) &&
                                    
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
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='fs-14px'>{antenatalCaseSheet.utreusSize}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.symphosisFundal}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.featolHeartRate}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.presentationAb}</td>
                                                            <td className='fs-14px'>{antenatalCaseSheet.engaged}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {
                                   ( antenatalCaseSheet.cervix != "" || antenatalCaseSheet.dilatation != "" || antenatalCaseSheet.effacement != "" || antenatalCaseSheet.presentationPV != "" || antenatalCaseSheet.station != "" || antenatalCaseSheet.membrane != "" || antenatalCaseSheet.pelvis != "" ) &&
                                
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
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                    }
                                </Row>
                                <Row className={`fs-15px fw-bold ${antenatalCaseSheet.initialAppointmentDate == "00/00/0000" ? "d-none" : ''}`}>
                                    <Col className='text-danger'>{`Next Visit : ${antenatalCaseSheet.initialAppointmentDate}`}</Col>
                                </Row>
                                <Row className={`fs-15px fw-bold ${antenatalCaseSheet.initialAppointmentPlan == "" ? "d-none" : ''}`}>
                                    <Col>{`Plan : ${antenatalCaseSheet.initialAppointmentPlan}`}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                }
                {
                    Object.keys(antenatalCaseSheetDetails).length !== 0 &&

                    <Col>
                        <Row className='h-100 d-flex flex-column rounded-bottom border border-top-0 h-100 justify-content-center'>
                            <Col className='text-center text-primary'>SUBSEQUENT VISIT</Col>
                            <Col>
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
                                                    <td>{antenatalCaseSheetDetails.sedd}</td>
                                                    <td>{antenatalCaseSheetDetails.ga}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                        <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.pallor != 0 || antenatalCaseSheet.ancDetialsDataList[0]?.icterus != 0 || antenatalCaseSheet.ancDetialsDataList[0]?.edema != 0 ? "" : "d-none"}`}>
                            </Row>
                            )} */}
                                <Row>
                                    <Col>
                                        <Row className='fs-14px'>
                                            <Col>
                                                <h6>General Examination</h6>
                                                <ol>
                                                    {antenatalCaseSheetDetails.pallor != 0 ? <li>Pallor - {antenatalCaseSheetDetails.pallor}</li> : null}
                                                    {antenatalCaseSheetDetails.icterus != 0 ? <li>Icterus - {antenatalCaseSheetDetails.pallor}</li> : null}
                                                    {antenatalCaseSheetDetails.edema != 0 ? <li>Edema - {antenatalCaseSheetDetails.pallor}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>

                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                                    <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.cvs != "" || antenatalCaseSheet.ancDetialsDataList[0]?.rs != "" ? "" : "d-none"}`}>
                                        </Row>
                                    )} */}
                                        <Row className='fs-14px'>
                                            <Col>
                                                <h6>Systemic Examination</h6>
                                                <ol>
                                                    {antenatalCaseSheetDetails.cvs != '' ? <li>CVS - {antenatalCaseSheetDetails.cvs}</li> : null}
                                                    {antenatalCaseSheetDetails.rs != '' ? <li>RS - {antenatalCaseSheetDetails.rs}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>

                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && (
                                    <Row className={`${antenatalCaseSheet.ancDetialsDataList[0]?.chiefcomplaints != "" || antenatalCaseSheet.ancDetialsDataList[0]?.hisPreIll != "" ? "" : "d-none"}`}>
                                        </Row>
                                    )} */}
                                        <Row className='fs-14px'>
                                            <Col>
                                                <h6>Complaints Details</h6>
                                                <ol>
                                                    {antenatalCaseSheetDetails.chiefComplaints != '' ? <li>Chief Complaints - {antenatalCaseSheetDetails.chiefComplaints}</li> : null}
                                                    {antenatalCaseSheetDetails.hisPreIll != '' ? <li>History of Present Illness - {antenatalCaseSheetDetails.hisPreIll}</li> : null}
                                                </ol>
                                            </Col>
                                        </Row>

                                        <Row>
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
                                                        </tr>

                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row>
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
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {Array.isArray(antenatalCaseSheet.ancDetialsDataList) && antenatalCaseSheet.ancDetialsDataList.length > 0 && ()} */}
                                                        <tr className='fs-14px text-center'>
                                                            <td>{antenatalCaseSheetDetails.cervix}</td>
                                                            <td>{antenatalCaseSheetDetails.dilation}</td>
                                                            <td>{antenatalCaseSheetDetails.effacement}</td>
                                                            <td>{antenatalCaseSheetDetails.presentationPv}</td>
                                                            <td>{antenatalCaseSheetDetails.station}</td>
                                                            <td>{antenatalCaseSheetDetails.membrane}</td>
                                                            <td>{antenatalCaseSheetDetails.pelvis}</td>
                                                        </tr>

                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
        </Fragment>
    )
}

export default AntenatalCaseSheetView