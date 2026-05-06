import React from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { DateUtils } from '../../../../../utils/dateUtils'
import logo from '../../../../../assets/logo.jpg';


const NursingIoRecords = ({ NurseIoData, clinicalCurrentIpPatient }: any) => {
    let x = NurseIoData[0]?.nurseDtmIo
    //

    return (
        <>
            <Container className="d-flex flex-column h-100 p-3">
                <Row className='border h-100 border-black  px-3 rounded overflow-auto d-block'>
                    <div id='printablediv'>
                        {/* <Row>
                            <Row className=''>
                                <Col className='mx-4'>
                                    <Row className='text-left'>
                                        <h6 className='fw-bold'>Name : <span className='fw-light'>{clinicalCurrentIpPatient?.fullName}</span></h6>
                                    </Row>
                                    <Row className='text-left'>
                                        <h6 className='fw-bold'>OpNo : <span className='fw-light'>{clinicalCurrentIpPatient?.displayNumber}</span></h6>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='text-left'>
                                        <h6 className='fw-bold'>Age : <span className='fw-light'>{clinicalCurrentIpPatient?.age}</span></h6>
                                    </Row>
                                    <Row className='text-left'>
                                        <h6 className='fw-bold'>Gender : <span className='fw-light'>{clinicalCurrentIpPatient?.gender}</span></h6>
                                    </Row>
                                    <Row className='text-left'>
                                    </Row>
                                </Col>
                            </Row>
                        </Row> */}
                        <Table>
                            <thead className=" " >
                                <tr className='text-center'>
                                    <th ></th>
                                    <th ></th>
                                    <th colSpan={4}>INTAKE</th>
                                    <th colSpan={4}>OUTPUT</th>
                                </tr>
                                <tr >
                                    <th >S.No</th>
                                    <th >DATE/TIME</th>
                                    <th >ORAL</th>
                                    <th >IVF</th>
                                    <th >OTHER</th>
                                    <th >TOTAL</th>
                                    <th >URINE</th>
                                    <th >DRAIN</th>
                                    <th >OTHER</th>
                                    <th>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='table table-bordered'>
                                {
                                    NurseIoData?.map((obj: any, i: number) => {
                                        return (
                                            <tr className="fs-9px px-2" key={i}>
                                                <td className="max-w-50px w-50px ">{i + 1}</td>
                                                <td className="max-w-150px w-150px"><span >{`${new DateUtils(obj.nurseDtmIo).dateFormat("DD-MM-YYYY")}-${new DateUtils(obj.nurseDtmIo).timeFormat("HH:MM")}`}</span></td>
                                                <td className="max-w-100px w-100px">{obj.oral}  {obj.oral ? 'ml' : ''}-{obj.oralDetails}</td>
                                                <td className="max-w-100px w-100px">{obj.ivf} {obj.ivf ? 'ml' : ''}-{obj.ivfDetails}</td>
                                                <td className="max-w-100px w-100px">{obj.inOther} {obj.inOther ? 'ml' : ''}-{obj.inOtherDetails}</td>
                                                <td className="max-w-50px w-50px"><span className='text-danger fw-bold'>{obj.inTotal}</span></td>
                                                <td className="max-w-100px w-100px">{obj.urine} {obj.urine ? 'ml' : ''}-{obj.urineDetails}</td>
                                                <td className="max-w-100px w-100px" >{obj.drain} {obj.drain ? 'ml' : ''}-{obj.drainDetails}</td>
                                                <td className="max-w-100px w-100px">{obj.outOther} {obj.outOther ? 'ml' : ''}-{obj.outOtherDetails}</td>
                                                <td className="max-w-50px w-50px"><span className='text-danger fw-bold'>{obj.outTotal}</span></td>

                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </Table>
                    </div>

                </Row>
            </Container>
        </>
    )
}

export default NursingIoRecords