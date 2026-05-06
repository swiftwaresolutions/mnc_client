import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap"
import CaseSheetApiService from "../../../../api/case-sheet/case-sheet-api-service";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { errorHandling } from "../../../../error/state/error-handle-action";
import { useState } from "react";

const CreateTemplate = (props: any) => {
    const dispatch = useDispatch()
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;
    const id = props.id;
    const loginData = props.loginData
    const [templateName, setTemplateName] = useState('')
    const [templateDetails, setTemplateDetails] = useState('')
    const saveCaseSheetTemplate = async (event: any) => {
        try {
            let payload: any = { 
                name: templateName,
                fieldId: id,
                details: templateDetails,
                docId: 0,
                uid: loginData.id
            }

            await caseSheetApiService.saveSummaryTemplates(payload);
            props.handleClose()
        } catch (error: any) {
            handleError(error)
        }
    }
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        }
    }
    
    return <>
        <Container className="p-0">
            <Modal.Header>
                <Row className="d-flex justify-contant-between w-100">
                    <Col><h3>CREATE TEMPLATE</h3></Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-info mx-2" onClick={saveCaseSheetTemplate}>Create Template</Button>
                        <Button variant="outline-danger mx-2" onClick={() => props.setCreateTemplateShow(false)}>Close</Button>
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Template Name</Form.Label>
                        <Form.Control type="text"
                            autoFocus
                            value={templateName}
                            onChange={(e) =>  setTemplateName(e.target.value) } />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Template Details</Form.Label>
                        <Form.Control as="textarea" value={templateDetails}
                            onChange={e => { setTemplateDetails(e.target.value) }} rows={10} />
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Container>
    </>
}

export default CreateTemplate