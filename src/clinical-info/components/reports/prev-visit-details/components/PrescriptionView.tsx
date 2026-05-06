import React, { Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import { prescriptionDeatilsInterface } from '../model/interfaces';

interface PrescriptionViewProps {
    prescription: prescriptionDeatilsInterface[]
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ prescription }) => {
    return (
        <Row className='h-100 flex-column'>
            <Col className='flex-grow-0'>
                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                    <Col className='fw-bolder text-nowrap text-center fs-5 '>PRESCRIPTION</Col>
                </Row>
            </Col>
            <Col>
                <Row className='rounded-bottom border-top-0 h-100 border'>
                    {
                        prescription.length == 0 && (
                            <Fragment>
                                <Row className='align-items-center py-4'>
                                    <Col className='text-center fw-bold text-danger fs-11px'>Prescription is Empty</Col>
                                </Row>
                            </Fragment>
                        )
                    }
                    {prescription.length !== 0 &&
                        <Col>
                            <Table className='mb-0'>
                                <thead>
                                    <tr className='fs-10px'>
                                        <th>Pres.No.</th>
                                        <th>Medicine Name</th>
                                        <th className='text-center'>Timing</th>
                                        <th className='text-center'>Dur.</th>
                                        <th className='text-center'>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.map((presItem, presIdx, presArr) => {
                                        const isFirstRow = presIdx === 0 || presItem.displayNo !== presArr[presIdx - 1]?.displayNo;
                                        const rowSpan = presArr.slice(presIdx).reduce((acc: any, cur: prescriptionDeatilsInterface, i: number, presArrRed) => {
                                            if (presItem.displayNo === presArrRed[i + 1]?.displayNo) {
                                                return acc + 1
                                            }
                                            return acc
                                        }, 1)
                                        return (<Fragment key={presIdx}>
                                            <tr>
                                                {isFirstRow && presItem.displayNo !== presArr[(presIdx - 1)]?.displayNo &&
                                                    <td rowSpan={rowSpan} className='w-50px fw-bold text-danger text-center align-middle'>{presItem.displayNo}</td>}
                                                <td className='fs-11px text-capitalize'>{presItem.medName.toLowerCase()}</td>
                                                <td className='fs-11px w-80px text-center'>{presItem.timing}</td>
                                                <td className='w-40px text-center'>{presItem.duration}</td>
                                                <td className='w-40px text-center'>{presItem.no}</td>
                                            </tr>
                                        </Fragment>
                                        )
                                    })}

                                </tbody>
                            </Table>
                        </Col>
                    }
                </Row>
            </Col>
        </Row>
    )
}

export default PrescriptionView