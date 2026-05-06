import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"

const vitals = [
    {
        controlId: "temperature",
        inputType: "text",
        valueName: "temperature",
        name: "TEMP"
    },
    {
        controlId: "pulse",
        inputType: "text",
        valueName: "pulse",
        name: "PULSE"
    },
    {
        controlId: "rr",
        inputType: "text",
        valueName: "rr",
        name: "RR"
    },
    {
        controlId: "bp",
        inputType: "text",
        valueName: "bp",
        name: "BP"
    },
    {
        controlId: "spo2",
        inputType: "text",
        valueName: "spo2",
        name: "SPO2"
    },
    {
        controlId: "height",
        inputType: "number",
        valueName: "height",
        name: "HEIGHT(cm)"
    },
    {
        controlId: "weight",
        inputType: "number",
        valueName: "weight",
        name: "WEIGHT(kg)"
    },
    {
        controlId: "bmi",
        inputType: "number",
        valueName: "bmi",
        name: "BMI"
    },
]

interface ComponentProps {
    examinationInputs: any[],
    caseSheet: any,
    handleInputChange: (value: string, fieldName: string) => void
    openSearchTemplate: (id: string | number) => void
    openCreateTemplate: (id: string | number) => void
}

const Examination: FC<ComponentProps> = ({ examinationInputs, caseSheet, handleInputChange, openSearchTemplate, openCreateTemplate }) => {

    return <>
        <Container className="d-flex flex-column h-100">
            <Row className="border rounded py-1 mb-4">
                {
                    vitals.map((list: any, idx: number) => (
                        <Col key={idx}>
                            <Form.Group className="my-1 general-case-sheet-input" controlId={list.controlId}>
                                <Form.Control
                                    value={caseSheet[list.valueName]}
                                    onChange={e => { handleInputChange(e.target.value, list.valueName) }}
                                    placeholder=""
                                    size="sm"
                                    type={list.inputType}
                                    disabled={list.controlId == "bmi"} />
                                <label htmlFor={list.controlId} >{list.name}</label>
                            </Form.Group>
                        </Col>
                    ))
                }
            </Row>

            <Row className="border h-100 rounded overflow-auto align-items-center">
                {examinationInputs.map((data: any, idx: any) => (
                    <Col md={6} key={idx}>
                        <Row>
                            <Col>
                                <Form.Group className="general-case-sheet-input" controlId={data.id}>
                                    <Form.Control as="textarea" rows={3}
                                        value={caseSheet[data.fieldName]}
                                        onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                                        placeholder=''

                                    />
                                    <label htmlFor={data.id} >{data.name}</label>
                                </Form.Group>
                            </Col>
                            <Col className="d-flex flex-grow-0">
                                <Col className="px-2">
                                    <Button variant="dark" tabIndex={2} onClick={() => openSearchTemplate(data.id)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                </Col>
                                <Col className="px-2">
                                    <Button variant="success" tabIndex={2} onClick={() => openCreateTemplate(data.id)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
        </Container>
    </>
}
export default Examination