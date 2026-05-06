import React, { Fragment } from 'react'
import { Row, FormLabel, Col } from 'react-bootstrap'
interface DischargeLabProps {
    labData: any
}
const DischargeLab: React.FC<DischargeLabProps> = ({ labData }) => {
    return (
        <Fragment>
            <Row className="position-relative border py-4">
                <FormLabel className='heading mx-auto'>LABORATORY INVESTIGATIONS </FormLabel>
                <Row>
                    <Col md={12}>
                        <p><b>Laboratary Results</b></p>
                    </Col>
                    <Col md={2}>
                        <p><b>S.No</b></p>
                    </Col>
                    <Col md={3}>
                        <p><b>Test Name</b></p>
                    </Col>
                    <Col md={3}>
                        <p><b>Field Name</b></p>
                    </Col>
                    <Col md={2}>
                        <p><b>Results</b></p>
                    </Col>
                    <Col md={2}>
                        <p><b>Units</b></p>
                    </Col>
                </Row>

                <Row>
                    {
                        labData?.map((data: any, idx: number) => (
                            <Col md={12} className="my-1" key={idx}>
                                <Row>
                                    <Col md={2}>
                                        <p>{idx + 1}</p>
                                    </Col>
                                    <Col md={3}>
                                        <p>{data.testName}</p>
                                    </Col>
                                    <Col md={3}>
                                        <p>{data.fieldName}</p>
                                    </Col>
                                    <Col md={2}>
                                        <p>{data.value}</p>
                                    </Col>
                                    <Col md={2}>
                                        <p>{data.unit}</p>
                                    </Col>

                                </Row>
                            </Col>
                        ))
                    }
                </Row>
            </Row>
        </Fragment>
    )
}

export default DischargeLab