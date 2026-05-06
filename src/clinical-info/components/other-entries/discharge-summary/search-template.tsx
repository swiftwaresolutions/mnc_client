import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap"
import CaseSheetApiService from "../../../../api/case-sheet/case-sheet-api-service";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { errorHandling } from "../../../../error/state/error-handle-action";
import { useDispatch } from "react-redux";

const SearchTemplates = (props: any) => {
    const dispatch = useDispatch()
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;
    const id = props.id;
    const fieldId = props.fieldId;
    const [selectedTemplateName, setSelectedTemplateName] = useState('');
    const [templateDetails, setTemplateDetails] = useState('');
    const [templateData, setTemplateData] = useState<any[]>([])

    const handlePrevTempMap = async () => {
        try {
            if (fieldId) {
                let preSummaryData = await caseSheetApiService.getSummaryTemplate(fieldId)
                if ([...preSummaryData].length > 0) {
                    setTemplateData(preSummaryData)
                    setTemplateDetails(preSummaryData[0].details)
                } else {
                    setTemplateData([{ id: 0, details: "",templateName:"select" }])
                }

            }
        } catch (error) {
            handleError(error)
        }
    }
    const handleTemplateNameChange = (value: any) => {
        try {
            setSelectedTemplateName(value);

            const selectedTemplate = templateData.find((data: any) => data.templateName === value) as any;

            if (selectedTemplate) {
                setTemplateDetails(selectedTemplate.details);
            } else {
                setTemplateDetails("");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        }
    }
    const onSelectKeyDown = (e: any) => {
        try {
            if (e.key == "Enter") {
                e.preventDefault();
                handleTemplateNameChange(e?.target?.value)
                props.handleClose(templateDetails, fieldId)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const init = async () => {
        await handlePrevTempMap()
    }
    useEffect(() => {
        init();
    }, []);

    return <>
        <Container className="p-0">
            <Modal.Header>
                <Row className="d-flex justify-contant-between w-100">
                    <Col><h3>SEARCH TEMPLATE</h3></Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-info mx-2" onClick={() => props.handleClose(templateDetails, fieldId)}>Add Template</Button>
                        <Button variant="outline-danger mx-2" onClick={() => props.setSearchTemplateShow(false)}>Close</Button>
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Template Name</Form.Label>
                        <Form.Select onChange={(e) => handleTemplateNameChange(e.target.value)}
                            value={selectedTemplateName}
                            autoFocus
                            onKeyDown={(e) => onSelectKeyDown(e)}
                        >
                            {templateData.map((data: any, idx: any) => (
                                <option key={idx}>{data.templateName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Template Details</Form.Label>
                        <Form.Control as="textarea"
                            defaultValue={templateDetails} rows={7} disabled />
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Container>
    </>
}
export default SearchTemplates