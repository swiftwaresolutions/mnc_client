import React, { Fragment, useEffect, useRef, useState } from 'react'
import { laboratoryDetailsInterface, OutsideInvInterface, OutsideLabInterface } from '../model/interfaces';
import { Row, Col, Table, Button } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../state/store';

interface ComponentProps {
    laboratory: OutsideLabInterface[]
    outsideInv: OutsideInvInterface[]
}
const OutsideLabAndInvPrint: React.FC<ComponentProps> = ({ laboratory, outsideInv }) => {
    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer);
    let patientDetails: any;
    if (isIp) {
        patientDetails = clinicalCurrentIpPatient;
    } else {
        patientDetails = clinicalCurrentOpPatient;
    }

    const printRef = useRef(null);
    const printInvRef = useRef(null);
    let labData: any[] = [...laboratory]
    let invData: any[] = [...outsideInv]

    const tempLabData = [...labData].reduce((acc: any, cur) => {
        if (!cur || !cur.labId) {
            return acc;
        }

        if (!acc[cur.labId]) {
            acc[cur.labId] = {
                labNo: cur.labId,
                labName: cur.labName,
                suggestDoc: cur.suggestDoc,
                labDate: cur.selDate,
                labDetails: []
            }
        }
        acc[cur.labId].labDetails.push({
            specName: cur.specName,
            testName: cur.testName,
            value: cur.value,
            unit: cur.unit,
            fieldName: cur.fieldName,
            fieldId: cur.fieldId
        })
        return acc
    }, {})
    const tempInvData = [...invData].reduce((acc: any, cur) => {
        if (!cur || !cur.invNo) {
            return acc;
        }

        if (!acc[cur.invNo]) {
            acc[cur.invNo] = {
                invNo: cur.invNo,
                labName: cur.labName,
                suggestDoc: cur.suggestDoc,
                invDate: cur.invDate,
                details: []
            }
        }
        acc[cur.invNo].details.push({
            invName: cur.invName,
            findings: cur.findings
        })
        return acc
    }, {})
    labData = [...Object.values(tempLabData)]
    invData = [...Object.values(tempInvData)]
    let labResSlNo = 0;
    return (
        <Fragment>
            <Row>
                <Col md={6} className='border'>
                    <div id='labprintdiv' ref={printRef} className=''>
                        <Row className='text-center fs-14px text-primary fw-bold p-1'>
                            <Col>GNANADURAI HOSPITAL, SIVAKASI.</Col>
                        </Row>
                        <Row className='text-center fs-12px text-primary'><Col>LABORATORY</Col></Row>
                        <hr />
                        <Row className='text-center'>
                            <Col>NAME : {patientDetails.fullName}</Col>
                            <Col>Op No : {patientDetails.displayNumber}</Col>
                        </Row>
                        <Row className='text-center'>
                            <Col>AGE : {patientDetails.age}Y</Col>
                            <Col>GENDER : {patientDetails.gender}</Col>
                        </Row>
                        <hr />
                        <Row>
                            {
                                laboratory.length == 0 && (
                                    <Fragment>
                                        <Row className='py-4'>
                                            <Col className='text-center fw-bold text-danger fs-11px'>Outside Laboratory is Empty</Col>
                                        </Row>
                                    </Fragment>
                                )
                            }
                            {laboratory.length !== 0 && (
                                <Col>
                                    {
                                        labData.map((item: any, idx: number) => {
                                            labResSlNo = 0;
                                            return (
                                                <Fragment key={idx}>
                                                    <Row className='text-center m-2'>
                                                        <Col>Date : <span className='text-primary fw-bold'>{item.labDate == "00-00-0000" ? "-" : item.labDate}</span></Col>
                                                        <Col>lab : <span className='text-primary fw-bold'>{item.labName}</span></Col>
                                                        <Col>Ref. : <span className='text-primary fw-bold'>{item.suggestDoc}</span></Col>
                                                    </Row>
                                                    <Table className='mb-2 border'>
                                                        <thead>
                                                            <tr className='fs-10px'>
                                                                <th>Sl.No</th>
                                                                <th>Test Name</th>
                                                                <th>Field Name</th>
                                                                <th>Results	</th>
                                                                <th>Units</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.labDetails?.map((labItem: any, labIdx: number, labarr: any) => {

                                                                const isFirstRow = labIdx === 0 || labItem.testName !== labarr[labIdx - 1]?.testName;
                                                                if (isFirstRow) {
                                                                    labResSlNo++;
                                                                }

                                                                const rowSpan = labarr.slice(labIdx).reduce((acc: any, cur: OutsideLabInterface, i: number, presArrRed: any) => {
                                                                    if (labItem.testName === presArrRed[i + 1]?.testName) {
                                                                        return acc + 1
                                                                    }
                                                                    return acc
                                                                }, 1)
                                                                return (<Fragment key={labIdx}>
                                                                    <tr>
                                                                        {isFirstRow && labItem.testName !== labarr[(labIdx - 1)]?.testName &&
                                                                            <td rowSpan={rowSpan} className='w-100px text-center fw-bold align-middle'>{labResSlNo}</td>}
                                                                        {isFirstRow && labItem.testName !== labarr[(labIdx - 1)]?.testName &&
                                                                            <td rowSpan={rowSpan} className='fs-10px w-100px fw-bold align-middle text-danger'>{labItem.testName}</td>}
                                                                        <td className='fs-11px'>{labItem.fieldName}</td>
                                                                        <td className='w-70px'>{labItem.value}</td>
                                                                        <td className='w-50px'>{labItem.unit}</td>
                                                                    </tr>
                                                                </Fragment>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </Fragment>
                                            )
                                        })}


                                </Col>
                            )
                            }
                        </Row>
                        <Row className='text-center p-2'>
                            <Col>
                                <ReactToPrint
                                    trigger={() => <Button variant='secondary' id="printbtnhide">Print</Button>}
                                    content={() => printRef.current}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col md={6} className='border'>
                    <div id='invprintdiv' ref={printInvRef} >
                    <Row className='text-center fs-14px text-primary fw-bold p-1'>
                            <Col>GNANADURAI HOSPITAL, SIVAKASI.</Col>
                        </Row>
                        <Row className='text-center fs-12px text-primary'><Col>LABORATORY</Col></Row>
                        <hr />
                        <Row className='text-center'>
                            <Col>NAME : {patientDetails.fullName}</Col>
                            <Col>Op No : {patientDetails.displayNumber}</Col>
                        </Row>
                        <Row className='text-center'>
                            <Col>AGE : {patientDetails.age}Y</Col>
                            <Col>GENDER : {patientDetails.gender}</Col>
                        </Row>
                        <hr />
                        <Row>
                            {
                                outsideInv.length == 0 && (
                                    <Fragment>
                                        <Row className='py-4'>
                                            <Col className='text-center fw-bold text-danger fs-11px'>Investigation is Empty</Col>
                                        </Row>
                                    </Fragment>
                                )
                            }
                        </Row>
                        {
                            invData.map((item: any, idx: number) => {
                                return (
                                    <Fragment key={idx}>
                                        {/* <Row className='text-center fs-14px'>
                                        <Col>Inv No : <span className='fw-bold text-danger'>{item.invNo}</span></Col>
                                    </Row> */}
                                        <Row className='text-center'>
                                            <Col>DATE : <span className='fw-bold text-primary'>{item.invDate}</span></Col>
                                            <Col>LAB : <span className='fw-bold text-primary'>{item.labName}</span></Col>
                                            <Col>REF. : <span className='fw-bold text-primary'>{item.suggestDoc}</span></Col>
                                        </Row>
                                        <Row className='text-center'>
                                            <Table className='border'>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Inv Name</th>
                                                        <th>Findings</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        item.details?.map((invDet: any, invDetIdx: number) => {
                                                            return (
                                                                <tr key={invDetIdx}>
                                                                    <td>{invDetIdx + 1}</td>
                                                                    <td>{invDet.invName}</td>
                                                                    <td>{invDet.findings}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }

                                                </tbody>
                                            </Table>
                                        </Row>
                                    </Fragment>
                                )
                            })
                        }
                        <Row className='text-center p-2'>
                            <Col>
                                <ReactToPrint
                                    trigger={() => <Button variant='secondary' id="printbtninvhide">Print</Button>}
                                    content={() => printInvRef.current}
                                />
                            </Col>
                        </Row>

                    </div>
                </Col>

            </Row>
            {/* </div> */}

        </Fragment>
    )
}

export default OutsideLabAndInvPrint