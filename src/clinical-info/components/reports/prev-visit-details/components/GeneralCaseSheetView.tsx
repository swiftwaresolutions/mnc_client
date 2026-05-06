import React, { Fragment } from 'react'
import { generalCaseSheetDetailsInterface } from '../model/interfaces';
import { Row, Col, Table } from 'react-bootstrap';
interface GeneralCaseSheetViewProps {
    generalCaseSheet: generalCaseSheetDetailsInterface;
}
const GeneralCaseSheetView: React.FC<GeneralCaseSheetViewProps> = ({ generalCaseSheet }) => {

    const handleGeneralCaseSheetSplit = (generalRes: generalCaseSheetDetailsInterface) => {
        if (Object.keys(generalRes).length === 0) {
            return { generalValidation: [], complaintDataList: [], history: [], vitals: [], examinations: [], allergyAndFollowUp: [], diagnosisDetailsData: [], diagnosis: [] }
        }
        let complaintDataList: any[] = [...generalRes.complaintDataList]
        let history = [
            { value: generalRes.presentingComplaints, displayName: "PRESENTING COMPLAINTS" },
            { value: generalRes.presentIllness, displayName: "PRESENT ILLNESS" },
            { value: generalRes.pastHistoryMedical, displayName: "PAST HISTORY MEDICAL" },
            { value: generalRes.pastHistorySurgical, displayName: "PAST HISTORY SURGICAL" },
            { value: generalRes.familyHistory, displayName: "FAMILY HISTORY" }
        ]
        let vitals = [
            { value: generalRes.temperature, displayName: "TEMP" },
            { value: generalRes.pulse, displayName: "PULSE" },
            { value: generalRes.rr, displayName: "RR" },
            { value: generalRes.bp, displayName: "BP" },
            { value: generalRes.spo2, displayName: "SPO2" },
            { value: generalRes.height == "0" ? "" : generalRes.height, displayName: "HEIGHT" },
            { value: generalRes.weight == "0" ? "" : generalRes.weight, displayName: "WEIGHT" },
            { value: generalRes.bmi == "0" ? "" : generalRes.bmi, displayName: "BMI" },
        ]
        let examinations = [
            { value: generalRes.pallor, displayName: "PALLOR" },
            { value: generalRes.icterus, displayName: "ICTERUS" },
            { value: generalRes.edema, displayName: "EDEMA" },
            { value: generalRes.systemicExamination, displayName: "SYSTEMIC EXAMINATION" },
            // { value: generalRes.abdominal, displayName: "ABDOMINAL" },
            // { value: generalRes.cns, displayName: "CNS" },
            // { value: generalRes.perVaginal, displayName: "PRE VAGINAL" },
            // { value: generalRes.oralRectal, displayName: "RECTAL" },
            // { value: generalRes.skin, displayName: "SKIN" },
            // { value: generalRes.musculoskeletal, displayName: "MUSCULOSKELETAL" },
            // { value: generalRes.additionalFindings, displayName: "ADDTIONAL FINDINGS" }
        ]
        let allergyAndFollowUp = [ 
            // { value: generalRes.allergy, displayName: "ALLERGY ALERT" },
            // { value: generalRes.medications, displayName: "MEDICATIONS" },
            // { value: generalRes.recomendations, displayName: "RECOMMENDATIONS" },
            // { value: generalRes.proceduresPlanned, displayName: "PROCEDURES PLANNED" },
            { value: generalRes.followUpPlan, displayName: "FOLLOW UP PLAN" }
        ]
        let diagnosisDetailsData = [...generalRes.diagnosisDetailsData]
        let diagnosis = [
            { value: generalRes.diagnosis, displayName: "DIAGNOSIS" },
            { value: generalRes.others, displayName: "OTHERS" },
        ]
        let local = [complaintDataList, history, vitals, examinations, allergyAndFollowUp, diagnosisDetailsData, diagnosis];

        let generalValidation = local.map(element => {
            let value = element.filter((item) => item.name != "")
            return value.length
        });
        return { generalValidation, complaintDataList, history, vitals, examinations, allergyAndFollowUp, diagnosisDetailsData, diagnosis }
    };
    let generalCaseSheetLocal = handleGeneralCaseSheetSplit(generalCaseSheet);

    return (
        <Row className='rounded-bottom border-top-0 h-100 border'>
             <Col className=''>
                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                    <Col className='fw-bolder text-nowrap text-center fs-5 '>GENERAL CASE SHEET</Col>
                </Row>

                {
                    Object.keys(generalCaseSheet).length == 0 && (
                        <Fragment>
                            <Row className='align-items-center py-4'>
                                <Col className='text-center fw-bold text-danger fs-11px'>CaseSheet is Empty</Col>
                            </Row>
                        </Fragment>
                    )
                }
                {
                    Object.keys(generalCaseSheet).length !== 0 && (
                        <Table className='mb-0'>
                            <tbody className='fs-10px'>

                                {/* FOR COMPLAINTS */}
                                {generalCaseSheetLocal.generalValidation[0] !== 0 && (
                                    <Fragment>
                                        <tr>
                                            <td className='fw-bold text-uppercase text-center text-danger'>COMPLAINTS</td>
                                        </tr>
                                        < tr >
                                            <td className='text-capitalize text-indent-10px'>
                                                {generalCaseSheetLocal.complaintDataList.map((item: any, idx: number) => {
                                                    return <Fragment key={idx}>
                                                        <Row>
                                                            <Col><span className='fw-bold'>{idx + 1} .</span> {item.name}</Col>
                                                            <Col className='flex-grow-0 text-nowrap'>{item.no} {item.periods}</Col>
                                                        </Row>
                                                    </Fragment>
                                                })}
                                            </td>
                                        </tr>
                                    </Fragment>
                                )}

                                {/* FOR HISTORY */}
                                {generalCaseSheetLocal.generalValidation[1] !== 0 && generalCaseSheetLocal.history.filter((item) => item.value !== "").length !== 0 && (
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>HISTORY</td>
                                    </tr>)
                                }
                                {generalCaseSheetLocal.history.map((item: any, idx: number) => (
                                    <Fragment key={idx}>
                                        {item.value !== "" && <tr>
                                            <td className='border-0 text-break lh-md '>
                                                <span className='fw-bold text-uppercase fs-9px pe-2'>{item.displayName} : </span>
                                                <span>{`${String(item.value).charAt(0).toUpperCase()}${String(item.value).slice(1)}.`}</span>
                                            </td>
                                        </tr>}
                                    </Fragment>))
                                }

                                {/* FOR VITALS AND EXAMINATIONS */}
                                {(generalCaseSheetLocal.generalValidation[2] !== 0 || generalCaseSheetLocal.generalValidation[3] !== 0) &&
                                    (generalCaseSheetLocal.vitals.filter((item) => item.value !== "").length !== 0 || generalCaseSheetLocal.examinations.filter((item) => item.value !== "").length !== 0) &&
                                    (<Fragment>
                                        <tr>
                                            <td className=' fw-bold text-uppercase text-center text-danger'>VITALS</td>
                                        </tr>
                                        {generalCaseSheetLocal.vitals.filter((item) => item.value !== "").length !== 0 && <tr>
                                            <td className='text-uppercase text-center border-0'>
                                                <Row className='row-cols-2 row-cols-lg-4 py-1'>
                                                    {generalCaseSheetLocal.vitals.map((item: any, idx: number) => (<Fragment key={idx}>
                                                        {item.value !== "" &&
                                                            <Col>
                                                                <Row className='flex-column'>
                                                                    <Col className='fw-bold'>{item.displayName}</Col>
                                                                    <Col>{item.value}</Col>
                                                                </Row>
                                                            </Col>
                                                        }
                                                    </Fragment>
                                                    ))}
                                                </Row>
                                            </td>
                                        </tr>}
                                        <tr>
                                            <td className=' fw-bold text-uppercase text-center text-danger'>EXAMINATIONS</td>
                                        </tr>
                                        {generalCaseSheetLocal.examinations.map((item: any, idx: number) => (
                                            <Fragment key={idx}>
                                                {item.value !== "" && (
                                                    <tr>
                                                        <td className='border-0 text-break lh-md '>
                                                            <span className='fw-bold text-uppercase fs-9px pe-2'>{item.displayName} : </span>
                                                            <span>{`${String(item.value).charAt(0).toUpperCase()}${String(item.value).slice(1)}.`}</span>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>))
                                        }
                                    </Fragment>
                                    )

                                }


                                {/* FOR ALLERGY AND FOLLOW UP */}
                                {generalCaseSheetLocal.generalValidation[4] !== 0 && generalCaseSheetLocal.allergyAndFollowUp.filter((item) => item.value !== "").length !== 0 && (
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>FOLLOW UP PLAN</td>
                                    </tr>)
                                }
                                {generalCaseSheetLocal.allergyAndFollowUp.map((item: any, idx: number) => (
                                    <Fragment key={idx}>
                                        {item.value !== "" && (
                                            <tr>
                                                <td className='border-0 text-break lh-md '>
                                                    <span className='fw-bold text-uppercase fs-9px pe-2'>{item.displayName} : </span>
                                                    <span>{`${String(item.value).charAt(0).toUpperCase()}${String(item.value).slice(1)}.`}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>))
                                }

                                {/* FOR DIAGNOSIS */}
                                {(generalCaseSheetLocal.generalValidation[5] !== 0 || generalCaseSheetLocal.generalValidation[6] !== 0) &&
                                    (generalCaseSheetLocal.diagnosis.filter((item) => item.value !== "").length !== 0) &&
                                    (<tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>DIAGNOSIS</td>
                                    </tr>)
                                }
                                {generalCaseSheetLocal.diagnosisDetailsData.map((item: any, idx: number) => {
                                    return <Fragment key={idx}>
                                        <tr>
                                            <td className='border-0 text-capitalize text-indent-10px'><span className='fw-bold'>{idx + 1} .</span> {item.name}</td>
                                        </tr>
                                    </Fragment>
                                })}
                                {generalCaseSheetLocal.diagnosis.map((item: any, idx: number) => (
                                    <Fragment key={idx}>
                                        {item.value !== "" && (
                                            <tr>
                                                <td className='border-0 text-break lh-md '>
                                                    <span className='fw-bold text-uppercase fs-9px pe-2'>{item.displayName} : </span>
                                                    <span>{`${String(item.value).charAt(0).toUpperCase()}${String(item.value).slice(1)}.`}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>))
                                }
                            </tbody>
                        </Table>
                    )
                }

            </Col>
            
        </Row >
    )
}

export default GeneralCaseSheetView