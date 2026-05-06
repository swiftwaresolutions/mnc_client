import React, { Fragment } from 'react'
import { Row, FormLabel, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { routerPathNames } from '../../../../../routes/routerPathNames';

interface DischargeMedicineProps {
    isPreviousSummary: any, isLoading: any, saveDischargeSummary: any, updateSummaryData: any, presData: any
}
const DischargeMedicine: React.FC<DischargeMedicineProps> = ({ isPreviousSummary, isLoading, saveDischargeSummary, updateSummaryData, presData }) => {

    const navigate = useNavigate();

    const selectMedicine1 = () => {
        updateSummaryData()
        navigate(routerPathNames.clinical.prescription + "?via=summary");
    };
    const selectMedicine2 = () => {
        saveDischargeSummary()
        navigate(routerPathNames.clinical.prescription + "?via=summary");
    };

    return (
        <Fragment>

            <Row className="my-4 mx-2 position-relative border">
                <FormLabel className='heading mx-auto'>DISCHARGE MEDICINE RECOMMENDATION </FormLabel>
                <Col md={12} className="my-1 py-4">
                    {
                        isPreviousSummary.status ? (
                            <Button variant="primary" className="m-1" disabled={isLoading} onClick={selectMedicine1}>
                                {isLoading ? 'Updating...' : 'Choose Medicine'}
                            </Button> //update function will trigger
                        ) : (
                            <Button variant="success" className="m-1" disabled={isLoading} onClick={selectMedicine2}>
                                {isLoading ? 'Submitting...' : 'Choose Medicine'}
                            </Button>) //save function will trigger
                    }
                </Col>

                <Col md={12} >
                    <Row>

                        <Col md={4}>
                            <p><b>Medicine Name</b></p>
                        </Col>
                        <Col md={2}>
                            <p><b>Timing</b></p>
                        </Col>
                        <Col md={2}>
                            <p><b>Duration</b></p>
                        </Col>
                        <Col md={2}>
                            <p><b>Qty</b></p>
                        </Col>
                    </Row>
                    <Row>
                        {
                            presData?.map((data: any, idx: number) => (
                                <Col md={12} className="my-1" key={idx}>
                                    <Row>
                                        <Col md={4}>
                                            <p>{data.medName}</p>
                                        </Col>
                                        <Col md={2}>
                                            <p>{data.timing}</p>
                                        </Col>
                                        <Col md={2}>
                                            <p>{data.duration}{data.period}</p>
                                        </Col>
                                        <Col md={2}>
                                            <p>{data.no}</p>
                                        </Col>

                                    </Row>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </Fragment>
    )
}

export default DischargeMedicine