import React, { Fragment } from 'react'
import { PatientImageResponse, ScreenDetails } from '../model/interfaces'
import { Row, Col } from 'react-bootstrap'
import clinicalConfig from '../../../../../clinicalConfig';
import UploadedSelectedImageView from '../components/UploadedSelectedImageView';

interface ComponentProps {
    patientImageDetails: PatientImageResponse[],
    showImgModel:boolean,
    screenDetails:ScreenDetails,
    handleOnImageClick: (idx: number) => void,
    setShowImgModel: React.Dispatch<React.SetStateAction<boolean>>,
};

const ImageViewTab: React.FC<ComponentProps> = ({ patientImageDetails, handleOnImageClick, showImgModel, setShowImgModel, screenDetails }) => {
    return (
        <Fragment>
            <Row className="h-100 border overflow-auto rounded">
                <Col>
                    {patientImageDetails.length < 1 ?
                        <Row className="h-100 align-items-center">
                            <Col className="text-center text-danger">
                                <h3>Patient has no Images.</h3>
                            </Col>
                        </Row>
                        :
                        <Row className="gap-2 justify-content-center p-2">
                            {patientImageDetails.filter((imag) => imag.imageExist).map((image, idx) => (
                                <Col className="border rounded min-w-150px max-w-150px" key={idx}>
                                    <Row className="p-2 flex-column flex-nowarp text-center">
                                        <Col className="border ">
                                            <picture>
                                                <img
                                                    src={clinicalConfig.apiBaseName + image.imagePath}
                                                    alt={`Patient Image-${idx}`}
                                                    style={{ objectFit: "cover" }}
                                                    className="shadow-lg h-100 max-h-150px"
                                                    decoding="async"
                                                    loading="lazy"
                                                    onClick={() => handleOnImageClick(idx)}
                                                />
                                            </picture>
                                        </Col>
                                        <Col>
                                            {image.date}
                                        </Col>
                                    </Row>
                                </Col>
                            ))}
                        </Row>
                    }
                </Col>
            </Row>
            {
                showImgModel && (
                    <UploadedSelectedImageView  {...{ showImgModel, setShowImgModel, screenDetails, patientImageDetails }} />
                )
            }
        </Fragment>
    )
}

export default ImageViewTab