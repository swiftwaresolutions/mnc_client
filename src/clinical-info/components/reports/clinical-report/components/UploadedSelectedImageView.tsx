import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { PatientImageResponse, ScreenDetails } from '../model/interfaces'
import clinicalConfig from '../../../../../clinicalConfig'
interface ComponentProps {
    showImgModel: boolean,
    setShowImgModel:(value: React.SetStateAction<boolean>) => void,
    screenDetails:ScreenDetails,
    patientImageDetails:PatientImageResponse[]
};
const UploadedSelectedImageView: React.FC<ComponentProps> = ({ showImgModel,setShowImgModel,screenDetails,patientImageDetails}) => {
    return (
        <Modal
                show={showImgModel}
                onHide={() => setShowImgModel(false)}
                className="d-flex justify-content-center"
                dialogClassName="w-100 mx-auto h-100 my-0 row align-items-center justify-content-center"
                contentClassName="w-90per h-90per"
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="example-custom-modal-styling-title">
                        Custom Modal Styling
                    </Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <Row className="user-select h-100 text-center">
                        <Col className="max-h-500px">
                            {screenDetails.currentImgIdx === -1 ?
                                ""
                                :
                                <img
                                    src={clinicalConfig.apiBaseName + patientImageDetails[screenDetails.currentImgIdx].imagePath}
                                    alt={`Patient Image-${screenDetails.currentImgIdx}`}
                                    style={{ objectFit: "cover" }}
                                    className="shadow-lg h-100 "
                                    decoding="async"
                                    loading="lazy"
                                    onClick={() => setShowImgModel(true)}
                                />}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
    )
}

export default UploadedSelectedImageView