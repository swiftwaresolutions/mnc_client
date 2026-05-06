import React from 'react'
import { Col, Row, Table } from 'react-bootstrap'

const PrecriptionView = ({ data }: any) => {
    return (
        <Row className='flex-column border h-100'>
            <Col className='text-center bg-primary text-white fs-5 fw-bold flex-grow-0'>PRESCRIPTION</Col>
            <Col className='px-0'>
                <Row className=' flex-column '>
                    {/* <Col className='text-danger text-center py-1 fw-bold'>930</Col> */}
                    <Col className=''>
                        {/* <Row>
                            <Col className='bg-light fw-bold'>MEDICINE NAME</Col>
                            <Col xs="3" className='fw-bold'>TIMING</Col>
                            <Col xs="3" className='fw-bold '>DURATION</Col>
                        </Row>
                        <Row>
                            <Col className=''>T PARACETAMOL 500MG TAB</Col>
                            <Col xs="3">2 Mg Thrice Daily</Col>
                            <Col xs="3">2 Day</Col>
                        </Row> */}
                        {data.length != 0 && <Table striped>
                            <thead>
                                <tr>
                                    {/* <th className='fw-bold '>Sl.No</th> */}
                                    <th className='fw-bold text-nowrap'>MEDICINE NAME</th>
                                    <th className='fw-bold text-nowrap'>TIMING</th>
                                    <th className='fw-bold '>DURATION</th>
                                    <th className='fw-bold '>QTY</th>
                                </tr>
                            </thead>

                            {/* <tr >
                                    <td colSpan={3} className='text-center'>{presc.displayNo} </td>
                                </tr> */}
                            {data.map((presc: any, idx: number, prescArr: any) => {
                                return <tbody key={idx}>
                                    <tr>
                                        <td colSpan={4} className={prescArr[idx - 1]?.displayNo == presc.displayNo ? "d-none" : "text-center text-danger fw-bold"}>{presc.displayNo}</td>
                                    </tr>
                                    <tr>
                                        <td>{presc.medName}</td>
                                        <td>{presc.quantity} {presc.unit} / {presc.timing}</td>
                                        <td>{presc.duration} {presc.period}</td>
                                        <td>{presc.no}</td>

                                    </tr>
                                </tbody>
                            })}

                        </Table>}
                        {data.length == 0 && <Row>
                            <Col className='text-center fw-bold py-3 text-danger'>Patient has No Prescription</Col>
                        </Row>}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default PrecriptionView

