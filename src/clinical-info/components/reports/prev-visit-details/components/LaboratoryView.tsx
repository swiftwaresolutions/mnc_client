import React, { Fragment } from 'react'
import { laboratoryDetailsInterface } from '../model/interfaces';
import { Row, Col, Table } from 'react-bootstrap';
interface LaboratoryViewProps {
    laboratory: laboratoryDetailsInterface[]
}
const LaboratoryView: React.FC<LaboratoryViewProps> = ({ laboratory }) => {
    return (
        <Row className='flex-column h-100'>
            <Col className='flex-grow-0'>
                <Row className='w-100 justify-content-between border rounded-top bg-light text-success pb-1'>
                    <Col className='fw-bolder text-nowrap text-center fs-5 '>LABORATORY</Col>
                </Row>
            </Col>
            <Col>
                <Row className='rounded-bottom border-top-0 h-100 border'>
                    {
                        laboratory.length == 0 && (
                            <Fragment>
                                <Row className='align-items-center py-4'>
                                    <Col className='text-center fw-bold text-danger fs-11px'>Laboratory is Empty</Col>
                                </Row>
                            </Fragment>
                        )
                    }
                    {laboratory.length !== 0 && (
                        <Col>
                            <Table className='mb-0'>
                                <thead>
                                    <tr className='fs-10px'>
                                        {/* <th>Sl.No</th> */}
                                        <th>Test Name</th>
                                        <th>Field Name</th>
                                        <th>Results	</th>
                                        <th>Units</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {laboratory.map((labItem, labIdx, labarr) => {
                                        const isFirstRow = labIdx === 0 || labItem.testName !== labarr[labIdx - 1]?.testName;
                                        const rowSpan = labarr.slice(labIdx).reduce((acc: any, cur: laboratoryDetailsInterface, i: number, presArrRed) => {
                                            if (labItem.testName === presArrRed[i + 1]?.testName) {
                                                return acc + 1
                                            }
                                            return acc
                                        }, 1)
                                        return (<Fragment key={labIdx}>
                                            <tr>
                                                {isFirstRow && labItem.testName !== labarr[(labIdx - 1)]?.testName &&
                                                    <td rowSpan={rowSpan} className='w-100px fw-bold align-middle text-danger'>{labItem.testName}</td>}
                                                <td className=''>{labItem.fieldName}</td>
                                                <td className='w-70px'>{labItem.value}</td>
                                                <td className='w-50px'>{labItem.unit}</td>
                                            </tr>
                                        </Fragment>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    )
                    }
                </Row>

            </Col>
        </Row>
    )
}

export default LaboratoryView