import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"

interface ComponentProps {
    allergyInputs: any[]
    caseSheet: any,
    handleInputChange: (value: string, fieldName: string) => void
    openSearchTemplate: (id: string | number) => void
    openCreateTemplate: (id: string | number) => void
}
const Allergy: FC<ComponentProps> = ({ allergyInputs, caseSheet, handleInputChange, openSearchTemplate, openCreateTemplate }) => {

    return <>
        <Container className="h-100 min-h-200px h-100 overflow-auto border rounded">
            <Col className="my-1">
                {allergyInputs.map((data: any, idx: any) => (
                    <Row key={idx} className="pt-5">
                        <Col >
                            <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                                <Form.Control
                                    as="textarea"
                                    value={caseSheet[data.fieldName]}
                                    onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                                    placeholder=''
                                    rows={5} />
                                <label htmlFor={data.id}>{data.name}</label>
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
                ))}
            </Col>
        </Container>
    </>
}
export default Allergy