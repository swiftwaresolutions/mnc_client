import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"


interface ComponentProps {
    followUpPlanInputs: any[]
    caseSheet: any,
    handleInputChange: (value: string, fieldName: string) => void
    openSearchTemplate: (id: string | number) => void
    openCreateTemplate: (id: string | number) => void
}
const FollowUpPlan:FC<ComponentProps> = ({followUpPlanInputs, caseSheet, handleInputChange, openSearchTemplate, openCreateTemplate}) => {
    return <>
        <Container className="d-flex flex-column h-100 pt-3">
            <Row>
                <Col className="p-0">
                    <Form.Group className="mb-3 general-case-sheet-input" controlId="medication">
                        <Form.Control
                            value={caseSheet.medications}
                            onChange={(e) => handleInputChange(e.target.value, "medications")}
                            as="textarea"
                            placeholder="" rows={4} />
                        <label htmlFor='medication'>MEDICATIONS</label>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="border mx-2 py-3 rounded overflow-auto h-100 px-1">
                {followUpPlanInputs.map((data: any, idx: any) => (
                    <Col xs="12" className="my-1" key={idx}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                                    <Form.Control as="textarea"
                                        value={caseSheet[data.fieldName]}
                                        onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                                        placeholder=''
                                        rows={4}
                                        />
                                    <label htmlFor={data.id} >{data.name}</label>
                                </Form.Group>
                            </Col>
                            <Col className="d-flex flex-grow-0">
                                <Col className="px-2">
                                    <Button variant="dark" onClick={() => openSearchTemplate(data.id)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                </Col>
                                <Col className="px-2">
                                    <Button variant="success" onClick={() => openCreateTemplate(data.id)}>
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
export default FollowUpPlan