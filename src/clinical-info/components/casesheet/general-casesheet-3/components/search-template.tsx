import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap"
import CaseSheetApiService from "../../../../../api/case-sheet/case-sheet-api-service";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { errorHandling } from "../../../../../error/state/error-handle-action";
import { useDispatch } from "react-redux";



const SearchTemplate = ({ id, handleClose, setSearchTemplateShow, caseSheetType, docId }: any) => {
    const dispatch = useDispatch()
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;
    const [selectedTemplateName, setSelectedTemplateName] = useState('');
    const [templateData, setTemplateData] = useState<{id: number, templateName: string, templateDetails: string}[]>([]);
    const [selectedTemplateData, setSelectedTemplateData] = useState<{id: number, templateName: string, templateDetails: string}>({id: 0, templateName: '', templateDetails: ''});
    const [templateDetails, setTemplateDetails] = useState('');
    const [deleteTemplate , setDeleteTemplate] = useState(0);
    const [message , setMessage] = useState('');

    const getCaseSheetTemplates = async () => {
        try {
            let result = await caseSheetApiService.getCaseSheetTemplate(caseSheetType, id, docId);
            setTemplateData(result)
        } catch (error) {
            handleError(error)
            console.log("getCaseSheetTemplates Error", error);
        }
    }

    const handleTemplateNameChange = (value: any) => {
        
        setSelectedTemplateName(value);
        setMessage("");
        const selectedTemplate = templateData.find((data: any) => data.templateName === value) as any;
        setSelectedTemplateData(selectedTemplate);
        if (selectedTemplate) {
            setTemplateDetails(selectedTemplate.templateDetails);
            setDeleteTemplate(selectedTemplate.id);
        } else {
            setTemplateDetails("");
            setDeleteTemplate(0);
        }
    }

    const handleDeleteTemplate = async () => {
        try {
            let tempId = deleteTemplate;
            if (tempId === 0) {
                setMessage("Please select a template to delete.")
                return;
            }
            let result = await caseSheetApiService.deleteCaseSheetTemplateById(tempId);
            if (result) {
                setMessage("Template deleted successfully.");
                setDeleteTemplate(0);
                setTemplateDetails("")
            } else {
                setMessage("Failed to delete template.");
            }
        } catch (error) {
            handleError(error);
            console.log("Error while deleting template", error);
            setMessage("Error while deleting template.")
        } finally {
            setDeleteTemplate(0);
            getCaseSheetTemplates();
        }
    }

    const handleUpdateTemplate = async () => {
        try {
            let tempId = deleteTemplate;
            if (tempId === 0) {
                setMessage("Please select a template to delete.")
                return;
            }
            let data = {
                caseSheetType : 0,
                docId : 0,
                templateDetails : selectedTemplateData.templateDetails,
                templateFieldId : "",
                templateName : selectedTemplateData.templateName
                }
            await caseSheetApiService.updateCaseSheetTemplateById(tempId, data);
            setMessage("Template Updated successfully.");
            
        } catch (error) {
            handleError(error);
            console.log("Error while updating template", error);
            setMessage("Error while updating template.")
        } finally {
            setDeleteTemplate(0);
            setSelectedTemplateData({id: 0, templateName: '', templateDetails: ''});
            getCaseSheetTemplates();
            // setMessage("");
            setSelectedTemplateName("");
            setTemplateDetails("" );
        }
    }

    const handleChangeTemplate = (e: any) => {
        setSelectedTemplateData({...selectedTemplateData, templateDetails: e.target.value});
        setTemplateDetails(e.target.value);
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
                        <Button variant="outline-info mx-2" onClick={() => handleClose(templateDetails, id)}>Apply Template</Button>
                        <Button variant="outline-danger mx-2" onClick={() => setSearchTemplateShow(false)}>Close</Button>
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
                        <Form.Control as="textarea" value={templateDetails} onChange={(e) => handleChangeTemplate(e)}
                             rows={3} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {message && <Col md={11} className="text-danger text-center">{message}</Col>}
                <Button variant="outline-primary" onClick={handleUpdateTemplate} disabled = {deleteTemplate === 0}>Update</Button>
                <Button variant="outline-danger" onClick={handleDeleteTemplate} disabled = {deleteTemplate === 0}>Delete</Button>
            </Modal.Footer>
        </Container>
    </>
}
export default SearchTemplate