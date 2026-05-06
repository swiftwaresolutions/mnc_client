import React, { Fragment } from 'react'
import { laboratoryDetailsInterface } from '../model/interfaces';
import { Row, Col, Table } from 'react-bootstrap';

interface ComponentProps {
    laboratory: laboratoryDetailsInterface[]
}
const LaboratoryView: React.FC<ComponentProps> = ({ laboratory }) => {
    let labResSlNo = 0;
    return (
        <Fragment>
            {
                laboratory.length == 0 && (
                    <Fragment>
                        <Row className='py-4'>
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
                                <th>Sl.No</th>
                                <th>Test Name</th>
                                <th>Field Name</th>
                                <th>Results	</th>
                                <th>Units</th>

                            </tr>
                        </thead>
                        <tbody>
                            {laboratory.map((labItem, labIdx, labarr) => {
                                const isFirstRow = labIdx === 0 || labItem.testName !== labarr[labIdx - 1]?.testName;
                                
                                if(isFirstRow) {
                                    labResSlNo++;
                                }

                                const rowSpan = labarr.slice(labIdx).reduce((acc: any, cur: laboratoryDetailsInterface, i: number, presArrRed) => {
                                    if (labItem.testName === presArrRed[i + 1]?.testName) {
                                        return acc + 1
                                    }
                                    return acc
                                }, 1)
                                return (<Fragment key={labIdx}>
                                    <tr>
                                        {/* <td>{labIdx+1}</td> */}
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
                </Col>
            )
            }
        </Fragment>
    )
}

export default LaboratoryView