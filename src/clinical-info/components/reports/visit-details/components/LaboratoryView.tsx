import React from 'react'
import { Col, Row, Table } from 'react-bootstrap'

const LaboratoryView = ({ data }: any) => {
    return (
        <Row className='flex-column border h-100'>
            <Col className='text-center bg-primary text-white fs-5 fw-bold flex-grow-0'>LABORATORY</Col>
            <Col className='px-0'>
                <Row className=' flex-column '>
                    <Col className=''>
                        {data.length != 0 && <Table striped>
                            <thead>
                                <tr>
                                    <th className='fw-bold '>Sl.No</th>
                                    <th className='fw-bold text-nowrap'>Test Name</th>
                                    <th className='fw-bold text-nowrap'>Field Name</th>
                                    <th className='fw-bold '>Results</th>
                                    <th className='fw-bold '>Units</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((rs: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className='max-w-40px w-40px'>{idx + 1}</td>
                                        <td>{rs.testName}</td>
                                        <td>{rs.fieldName}</td>
                                        <td>{rs.value}</td>
                                        <td className=''>{rs.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        }
                        {data.length == 0 && <Row>
                            <Col className='text-center fw-bold py-3 text-danger'>Patient has No Lab Results</Col>
                        </Row>}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default LaboratoryView