
import React, { Fragment } from 'react'
import { VitalsInterface } from '../model/interfaces'
import { Col, Row, Table } from 'react-bootstrap';

interface ComponentProps {
    vitals : VitalsInterface[] ;
}
const VitalsView : React.FC<ComponentProps> = ({ vitals }) => {
    // console.log("vitals ", vitals.length)
  return (
    <Row style={{ fontSize: "1.05rem" }}>
        <Col>
        {
            Object.keys(vitals).length === 0 && 
            <Fragment>
                <Row className='py-4'>
                    <Col className='text-center fw-bold text-danger fs-13px'>Vitals is Empty</Col>
                </Row>
            </Fragment>
        }
        {
            // Object.keys(vitals).length !== 0 && 
            vitals.length !== 0 && 
                // <h6 className='mt-2 fw-medium letter-spacing-05px text-success link-offset-2 text-decoration-underline'>VITALS</h6>
            <Table>
                <thead>
                    <tr className='text-center'>
                        <th>Sl. No</th>
                        <th>TEMPERATURE</th>
                        <th>PULSE</th>
                        <th>RR</th>
                        <th>BP</th>
                        <th>SPO2</th>
                        <th>GRBS</th>
                        <th>HEIGHT</th>
                        <th>WEIGHT</th>
                        <th>BMI</th>
                    </tr>
                </thead>
                <tbody>
                    {vitals.map((vitalItem: VitalsInterface, vitalIdx: number) => {
                        return (
                            <tr className='fs-14x text-center'>
                                <td>{vitals.length - vitalIdx}</td>
                                <td>{vitalItem.temperature}</td>
                                <td>{vitalItem.pulse}</td>
                                <td>{vitalItem.rr}</td>
                                <td>{vitalItem.bp}</td>
                                <td>{vitalItem.spo2}</td>
                                <td>{vitalItem.grbs}</td>
                                <td>{vitalItem.height}</td>
                                <td>{vitalItem.weight}</td>
                                <td>{vitalItem.bmi}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            }
        </Col>
    </Row>
  )
}

export default VitalsView