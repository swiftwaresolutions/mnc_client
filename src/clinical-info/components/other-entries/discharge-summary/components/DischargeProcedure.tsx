import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment } from 'react'
import { Row, FormLabel, Col, Button, Form } from 'react-bootstrap'
interface DischargeProcedureProps {
    procedureRow: any,SetProcedureRow:any, createprocedureRequestListFormat: any
}
const DischargeProcedure: React.FC<DischargeProcedureProps> = ({ procedureRow,SetProcedureRow, createprocedureRequestListFormat }) => {

    const handleProcedureRow = (e: any, idx: number, item: any) => {
        let local = [...procedureRow];
        item = { ...item, [e.target.name]: e.target.value };
        local[idx] = item;
        SetProcedureRow(local);
    };
    const addProcedureRow = () => {
        if (procedureRow.length > 1) {
            let updateRow = [
                ...procedureRow,
                { ...createprocedureRequestListFormat },
            ];
            SetProcedureRow([...updateRow]);
        } else {
            SetProcedureRow([, { ...createprocedureRequestListFormat }]);
        }
        let updateRow = [...procedureRow, { ...createprocedureRequestListFormat }];
        SetProcedureRow(updateRow);
    };
    const removeProcedureRow = (idx: number) => {
        if (procedureRow.length > 1) {
            let updateRow = [...procedureRow].filter(
                (row: any, row_idx: number) => row_idx != idx
            );
            SetProcedureRow([...updateRow]);
        }
    };
    return (
        <Fragment>

            <Row className="position-relative border">
                <FormLabel className='heading mx-auto'>PRODCEURES AND OUTSIDE LAB INVESTIGATIONS </FormLabel>
                <Col>
                    {procedureRow.map((item: any, idx: number) => {
                        return <Row className="my-4 mx-2 py-3" key={idx}>
                            <Col md={2} className="my-1">
                                <Row>
                                    <Col md={12}>
                                        <input
                                            type="date"
                                            name='procDate'
                                            value={item.procDate}
                                            className="button_style"
                                            onChange={(e) => { handleProcedureRow(e, idx, item) }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4} className="my-1">
                                <Row>
                                    <Col md={12}>
                                        <Form.Control
                                            name='procName'
                                            placeholder="Procedure Name"
                                            className="button_style"
                                            value={item.procName}
                                            onChange={(e) => { handleProcedureRow(e, idx, item) }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6} className="my-1">
                                <Row>
                                    <Col md={9}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Report"
                                                rows={4}
                                                name="report"
                                                value={item.report}
                                                onChange={(e) => { handleProcedureRow(e, idx, item) }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="d-flex">
                                        <Col>
                                            <Button variant="success" onClick={() => addProcedureRow()}>
                                                <FontAwesomeIcon icon={faPlus}  />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => removeProcedureRow(idx)} >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </Col>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    })}
                </Col>
            </Row>
        </Fragment>
    )
}

export default DischargeProcedure