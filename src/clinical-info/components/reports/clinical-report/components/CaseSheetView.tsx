import React, { FC, Fragment } from 'react'
import { CaseSheetModel } from '../model/interfaces'
import { Col, Row, Table } from 'react-bootstrap'
interface ComponenetProps {
    caseSheet: CaseSheetModel
}
interface NameValueModel {
    name: string,
    value: string
}

const CaseSheetView: FC<ComponenetProps> = ({ caseSheet }) => {
    console.log("case is " + caseSheet);
    const isEmptyCaseSheet = caseSheet.isEmptyCaseSheet;

    let historyValues: string[] = Object.values(caseSheet.history)
    let history: NameValueModel[] = Object.keys(caseSheet.history).map((key: string, idx: number) => ({ name: key, value: historyValues[idx] }));

    let vitalsValues: string[] = Object.values(caseSheet.vitals)
    let vitals: NameValueModel[] = Object.keys(caseSheet.vitals).map((key: string, idx: number) => ({ name: key, value: vitalsValues[idx] }));

    let examinationValues: string[] = Object.values(caseSheet.examination)
    let examinations: NameValueModel[] = Object.keys(caseSheet.examination).map((key: string, idx: number) => ({ name: key, value: examinationValues[idx] }));

    let allergyValues: string[] = Object.values(caseSheet.allergy)
    let allergys: NameValueModel[] = Object.keys(caseSheet.allergy).map((key: string, idx: number) => ({ name: key, value: allergyValues[idx] }))

    let diagnosisValues: string[] = Object.values(caseSheet.diagnosis)
    let diagnosis: NameValueModel[] = Object.keys(caseSheet.diagnosis).map((key: string, idx: number) => ({ name: key, value: diagnosisValues[idx] }))

    let followUpsValues: string[] = Object.values(caseSheet.followUp)
    let followUps: NameValueModel[] = Object.keys(caseSheet.followUp).map((key: string, idx: number) => ({ name: key, value: followUpsValues[idx] }))
    return (
        <Col>
            <Row className='h-100 flex-column position-relative'>
                <Col className='flex-grow-0 sticky-top p-0'>
                    <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                        <Col className='fw-bolder text-nowrap text-center fs-5 '>General Case Sheet</Col>
                    </Row>
                </Col>
            </Row>
            {
                isEmptyCaseSheet && (
                    <Fragment>
                        <Row className='py-4'>
                            <Col className='text-center fw-bold text-danger fs-11px'>CaseSheet is Empty</Col>
                        </Row>
                    </Fragment>
                )
            }
            {
                !isEmptyCaseSheet && (
                    <Table className='mb-0 border p-0 m-0'>
                        <tbody className='fs-10px'>

                            {/* FOR COMPLAINTS */}
                            {caseSheet.complaints.length > 0 &&
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>COMPLAINTS</td>
                                    </tr>
                                    < tr >
                                        <td className='text-capitalize text-indent-10px'>
                                            {caseSheet.complaints.map((item: any, idx: number) => {
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
                            }

                            {/* FOR HISTORY */}
                            {history.filter((item) => item.value).length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>HISTORY</td>
                                    </tr>
                                    {history.map((his: NameValueModel, idx: number) => (
                                        <Fragment key={idx}>
                                            {his.value !== "" &&
                                                <tr>
                                                    <td className='border-0 text-break lh-md '>
                                                        <span className='fw-bold text-uppercase fs-9px pe-2'>{his.name} : </span>
                                                        <span>{`${String(his.value).charAt(0).toUpperCase()}${String(his.value).slice(1)}.`}</span>
                                                    </td>
                                                </tr>}
                                        </Fragment>))
                                    }
                                </Fragment>
                            )}

                            {/* FOR VITALS */}
                            {/* {vitals.length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>Vitals</td>
                                    </tr>

                                    <tr>
                                        <td className='border-0 text-break lh-md '>
                                            <Row xs={2} className='justify-content-center'>
                                                {vitals.map((vital: NameValueModel, idx: number) => (
                                                    <Fragment key={idx}>
                                                        {vital.value !== "" &&
                                                            <Col><span className='fw-bold text-uppercase fs-9px pe-2'>{vital.name} : </span>
                                                                <span>{`${String(vital.value).charAt(0).toUpperCase()}${String(vital.value).slice(1)}`}</span></Col>
                                                        }
                                                    </Fragment>))
                                                }
                                            </Row>
                                        </td>
                                    </tr>
                                </Fragment>
                            )} */}

                            {/* FOR EXAMINATIONS */}
                            {examinations.filter((item) => item.value).length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>EXAMINATIONS</td>
                                    </tr>
                                    {examinations.map((examination: NameValueModel, idx: number) => (
                                        <Fragment key={idx}>
                                            {examination.value !== "" &&
                                                <tr>
                                                    <td className='border-0 text-break lh-md '>
                                                        <span className='fw-bold text-uppercase fs-9px pe-2'>{examination.name} : </span>
                                                        <span>{`${String(examination.value).charAt(0).toUpperCase()}${String(examination.value).slice(1)}.`}</span>
                                                    </td>
                                                </tr>}
                                        </Fragment>))
                                    }
                                </Fragment>
                            )}

                            {/* FOR ALLERGY */}
                            {allergys.filter((item) => item.value).length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>ALLERGY</td>
                                    </tr>
                                    {allergys.map((allergy: NameValueModel, idx: number) => (
                                        <Fragment key={idx}>
                                            {allergy.value !== "" &&
                                                <tr>
                                                    <td className='border-0 text-break lh-md '>
                                                        <span className='fw-bold text-uppercase fs-9px pe-2'>{allergy.name} : </span>
                                                        <span>{`${String(allergy.value).charAt(0).toUpperCase()}${String(allergy.value).slice(1)}.`}</span>
                                                    </td>
                                                </tr>}
                                        </Fragment>))
                                    }
                                </Fragment>
                            )}

                            {/* FOR DIAGNISI DETAILS */}
                            {caseSheet.diagnosisDetails.length > 0 &&
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>DIAGNOSIS DETAILS</td>
                                    </tr>
                                    < tr >
                                        <td className='text-capitalize text-indent-10px'>
                                            {caseSheet.diagnosisDetails.map((diagnosis: any, idx: number) => {
                                                return <Fragment key={idx}>
                                                    <Row>
                                                        <Col><span className='fw-bold'>{idx + 1} .</span> {diagnosis.name}</Col>
                                                    </Row>
                                                </Fragment>
                                            })}
                                        </td>
                                    </tr>
                                </Fragment>
                            }

                            {/* FOR DIAGNISIS */}
                            {diagnosis.filter((item) => item.value).length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>DIAGNOSIS</td>
                                    </tr>
                                    {diagnosis.map((diag: NameValueModel, idx: number) => (
                                        <Fragment key={idx}>
                                            {diag.value !== "" &&
                                                <tr>
                                                    <td className='border-0 text-break lh-md '>
                                                        <span className='fw-bold text-uppercase fs-9px pe-2'>{diag.name} : </span>
                                                        <span>{`${String(diag.value).charAt(0).toUpperCase()}${String(diag.value).slice(1)}.`}</span>
                                                    </td>
                                                </tr>}
                                        </Fragment>))
                                    }
                                </Fragment>
                            )}

                            {/* FOR DIAGNISIS */}
                            {followUps.filter((item) => item.value).length > 0 && (
                                <Fragment>
                                    <tr>
                                        <td className='fw-bold text-uppercase text-center text-danger'>FOLLOW UP</td>
                                    </tr>
                                    {followUps.map((followUp: NameValueModel, idx: number) => (
                                        <Fragment key={idx}>
                                            {followUp.value !== "" &&
                                                <tr>
                                                    <td className='border-0 text-break lh-md '>
                                                        <span className='fw-bold text-uppercase fs-9px pe-2'>{followUp.name.toLocaleLowerCase() == "followupplan" ? "PLAN" : followUp.name} : </span>
                                                        <span>{`${String(followUp.value).charAt(0).toUpperCase()}${String(followUp.value).slice(1)}.`}</span>
                                                    </td>
                                                </tr>}
                                        </Fragment>))
                                    }
                                </Fragment>
                            )}
                        </tbody>
                    </Table>
                )
            }
        </Col>
    )
}

export default CaseSheetView