import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap"
import CaseSheetApiService from "../../../../../api/case-sheet/case-sheet-api-service";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { errorHandling } from "../../../../../error/state/error-handle-action";
import { useDispatch } from "react-redux";

const SearchTemplate = (props: any) => {
    const dispatch = useDispatch()
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;
    const id = props.id;
    const [selectedTemplateName, setSelectedTemplateName] = useState('');
    const [templateData, setTemplateData] = useState([]);
    const [templateDetails, setTemplateDetails] = useState('');

    const getCaseSheetTemplates = async () => {
        try {
            let result = await caseSheetApiService.getCaseSheetTemplate(6, id);
            setTemplateData(result)
        } catch (error) {
            console.log("getCaseSheetTemplates Error");
            handleError(error)
            console.log(error);
        }
    }

    const handleTemplateNameChange = (value: any) => {
        setSelectedTemplateName(value);

        const selectedTemplate = templateData.find((data: any) => data.templateName === value) as any;

        if (selectedTemplate) {
            setTemplateDetails(selectedTemplate.templateDetails);
        } else {
            setTemplateDetails("");
        }
    }

    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        }
    }

    useEffect(() => {
        getCaseSheetTemplates();
    }, []);

    return <>
        <Container className="p-0">
            <Modal.Header>
                <Row className="d-flex justify-contant-between w-100">
                    <Col><h3>SEARCH TEMPLATE</h3></Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-info mx-2" onClick={() => props.handleClose(templateDetails, id)}>Add Template</Button>
                        <Button variant="outline-danger mx-2" onClick={() => props.setSearchTemplateShow(false)}>Close</Button>
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Template Name</Form.Label>
                        <Form.Select onChange={(e) => handleTemplateNameChange(e.target.value)}
                            value={selectedTemplateName}>
                            <option>--select--</option>
                            {templateData.map((data: any, idx: any) => (
                                <option key={idx}>{data.templateName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Template Details</Form.Label>
                        <Form.Control as="textarea"
                            defaultValue={templateDetails} rows={3} />
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Container>
    </>
}
export default SearchTemplate