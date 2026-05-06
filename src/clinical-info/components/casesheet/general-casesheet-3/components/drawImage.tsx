import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"

const DrawImage = (props: any) => {

    const [image, setImage] = useState<any>();
    const [previewImage, setPreviewImage] = useState<any>();

    const handleImage = (e: any) => {
        let file: any = e.target.files[0];
        let previewImage: any = URL.createObjectURL(file);
        setPreviewImage(previewImage);
        setImage(file);
        if (props.caseSheetFormData.has('file')) {
            props.caseSheetFormData.delete('file');
        }
        props.caseSheetFormData.append('file', image);
    }

    return <>
        <Container>
            <Form className="inputDnD w-25" id="singleFileUpload">
                <Col>
                    <Form.Control type="file"
                        className="form-control-file"
                        onChange={e => { handleImage(e); }}
                        accept="image/*"
                    />
                </Col>
            </Form>
        </Container>

        <Container className="d-flex my-4">
            <Button variant="primary me-3">Save Image</Button>
            <Button variant="dark">Clear Image</Button>
        </Container>
    </>
}
export default DrawImage