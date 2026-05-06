import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row, Form } from 'react-bootstrap'
import { handleError } from '../../../../../utils/errorUtil'
import { useDispatch, useSelector } from 'react-redux'
import { InvestigationApiService } from '../../../../../api/investigation/investigation-api-service'
import { ImageApiService } from '../../../../../api/image/image-api-service'
import { PatientImageResponse } from '../../../reports/clinical-report/model/interfaces'
import { PatientInvImageUploadInterface } from './interface'
import { RootState } from '../../../../../state/store'
import { hostAddress } from '../../../../../clinicalConfig'

interface Item {
  id: number;
  name: string;
  rate: number;
  name1: string;
  type?: string;
}

const ImageUploadScreen = ({ show, onHide, investigationDepartmentList, patientDetails, loginUser }: any) => {
  const appData = useSelector((state: RootState) => state.appReducer)
  // let hostName = isDev ? "192.168.1.60" : window.location.hostname
  let hostName = hostAddress
  const uploadedBaseUrl = `http://${hostName}:${appData.organization.port}/${appData.organization.code}`;
//  console.log(JSON.stringify(uploadedBaseUrl))

  const dispatch = useDispatch()
  const investigationApiService: InvestigationApiService = new InvestigationApiService()
  const imageApiService: ImageApiService = new ImageApiService();
  const [temporaryListNames, setTemporaryListNames] = useState<any[]>([])
  const [selectedInvestigation, setSelectedInvestigation] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>('0000-00-00');
  const [otherInv, setOtherInv] =useState<string>("")
  const [image, setImage] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [patientImageDetails, setPatientImageDetails] = useState<PatientInvImageUploadInterface[]>([])
  const [uploadImage, setUploadImage] = useState<string | null>(null)
  const [previewSelectedImage, setPreviewSelectedImage] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PatientInvImageUploadInterface>();

  const fileInput = useRef<HTMLInputElement | null>(null)

  const getAllInvestigation = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const selectDeptId = parseInt(event.target.value)
      let investigationNamesResponse = []
      investigationNamesResponse = await investigationApiService.getInvestigationNamesByDepartment("0")
      const filteredInvNames = investigationNamesResponse.filter((inv: any) => inv.groupId === selectDeptId)
      //console.log(JSON.stringify(investigationNamesResponse))
      // console.log(JSON.stringify(filteredInvNames))  
      setTemporaryListNames(filteredInvNames)

    } catch (error) {
      handleError(dispatch, error)
    }
  }

  const handleInvestigationSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    const selected = temporaryListNames.find(inv => inv.id === selectedId);
    if(selected) {
      setSelectedInvestigation({...selected, date : selectedDate, otherInv : otherInv}); 
    }
  }

  const fetchUploadedImage = async () => {
    try {
      let imageDetailResponse: PatientInvImageUploadInterface[] = await imageApiService.fetchInvUploadedDetailsByVstId(`${patientDetails.visitId}`)
      //console.log(imageDetailResponse)
      setPatientImageDetails(imageDetailResponse)
      // fetchImage()
    } catch (error) {
      handleError(dispatch, error);
    }
  };
  const fetchUploadedImageByPatId = async () => {
    try {
      let imageDetailResponse: PatientInvImageUploadInterface[] = await imageApiService.fetchInvUploadedDetailsByPatId(`${patientDetails.patientId}`)
      //console.log(imageDetailResponse)
      setPatientImageDetails(imageDetailResponse)
      // fetchImage()
    } catch (error) {
      handleError(dispatch, error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files ? event.target.files[0] : null
    // if(file) {
    //   setImage(file)
    //   const previewUrl = URL.createObjectURL(file)
    //   setImagePreview(previewUrl)
    // }
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) {
      setImage(files)
      const tempPreview = files.map(file => URL.createObjectURL(file))
      setImagePreview(tempPreview)
    }
  }

  // Function to handle the image upload
  const handleImageUpload = async () => {
    if (image.length === 0) {
      alert("please select an image to upload!")
      return
    }
    if (selectedInvestigation) {
      const formData = new FormData();
      // formData.append('file',image)
      image.forEach((img) => {
        formData.append('file', img)
      })
      formData.append('CreateImgInvUploadRequest', JSON.stringify({
        patId: patientDetails.patientId,
        vstId: patientDetails.visitId,
        consultantId: loginUser.id,
        invId: selectedInvestigation.id,
        groupId: selectedInvestigation.groupId,
        invDate : selectedInvestigation.date,
        otherInv : selectedInvestigation.otherInv
      }))


      try {
        let response = await investigationApiService.uploadImage(formData)
        // console.log(response)

      } catch (error) {
        handleError(dispatch, error)
      } finally {
        setSelectedInvestigation(null)
        setImage([])
        setOtherInv("")
        setSelectedDate("0000-00-00")
        setImagePreview([])
        fetchUploadedImage()
      }
    }
  }

  const handleDeleteClick = (image: any) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedImage) return;
    try {
      let tempDetails = { ...selectedImage, blockedUid: loginUser.id }
      console.log(tempDetails)
      let imgId = tempDetails.id
      let blockedUid = loginUser.id
      await investigationApiService.updateSelectedImage(imgId,blockedUid, selectedImage)
    } catch (error) {
      handleError(dispatch, error)
    } finally {
      setShowModal(false)
      fetchUploadedImage()
    }
  };
  const handlePreviewClick = (image: any) => {
    setPreviewSelectedImage(`${uploadedBaseUrl}/${image.path}`);
  };

  const handleClosePreview = () => {
    setPreviewSelectedImage(null);
  };


  useEffect(() => {
    fetchUploadedImage()
  }, [])
  return (
    <>
      {/* <Modal
        {...{ show }}
        size='xl'
        {...{ onHide }}
      >
        <Modal.Header> */}

      <Row className=''>
        <Col md={8} className='ps-5 text-center text-danger'>
          <Modal.Title id="contained-modal-title-vcenter text-nowrap">INVESTIGATION IMG UPLOADER</Modal.Title>
        </Col>
        {/* <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col> */}
      </Row>
      {/* </Modal.Header>
        <Modal.Body className='vh-75 overflow-auto'> */}
      <Row className='justify-content-center'>
        <Col md={6} className='p-3 vh-60 border overflow-auto'>
          <Row className='justify-content-center'>
            <Col xs="6">
              <h6 className='p-2'>Select Investigation to Upload Images.</h6>
            </Col>
            <Col xs="6" className='p-2'>
              <Form.Select onChange={getAllInvestigation} name='I' id='dep_I'>
                <option value="0">SELECT INVESTIGATION HEAD</option>
                {
                  investigationDepartmentList?.map((inv: any, invIdx: number) => (
                    <option value={inv.id} key={invIdx}>{inv.name}</option>
                  ))
                }
              </Form.Select>
            </Col>
          </Row>
          {
            temporaryListNames.length > 0 &&
            <Row className='m-2 p-2'>
              <Col md={4}>
                <Form.Select value={selectedInvestigation ? selectedInvestigation.id : ''} onChange={handleInvestigationSelect}>
                  <option value="">Select Investigation</option>
                  {
                    temporaryListNames?.map((inv: any, invIdx: number) => (
                      <option value={inv.id} key={invIdx}>{inv.name}</option>
                    ))
                  }
                </Form.Select>
              </Col>
              <Col md={4}>
                  <Form.Group className='mb-3 general-case-sheet-input'>
                  <Form.Control 
                    type='date'
                    id='selDate'
                    name='selDate'
                    placeholder=''
                    value={selectedDate}
                    disabled={!selectedInvestigation}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (selectedInvestigation) {
                        setSelectedInvestigation({
                          ...selectedInvestigation,
                          date: e.target.value
                        });
                      }
                    }}
                  />
                  <label htmlFor="selDate" className='fw-14px'>Select Scan Date</label>
                  </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                      <Form.Control 
                      id='invOthers'
                      name='invOthers'
                      placeholder='Enter Other Details'
                      value={otherInv}
                      onChange={(e) => {
                        setOtherInv(e.target.value)
                        if (selectedInvestigation) {
                          setSelectedInvestigation({
                            ...selectedInvestigation,
                            otherInv : e.target.value
                          });
                        }
                      }}
                      />
                    </Form.Group>
                </Col>

              {selectedInvestigation && (
                <>
                  <Row>
                    <Col md={3} className='m-2'>
                      <input type="file" ref={fileInput} multiple accept="image/*" onChange={handleImageChange} />
                    </Col>
                    <Col md={2} className='m-2'>
                      <Button variant="primary"
                        onClick={handleImageUpload}
                        disabled={!image}>
                        Upload
                      </Button>
                    </Col>
                  </Row>

                </>
              )}
            </Row>
          }
          <Row>
            <Col>
              {/* {
                      imagePreview && (
                        <div className="image-preview-container">
                          <h5>Selected Image : </h5>
                          <img src={imagePreview} alt="Preview Image" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                        </div>
                      )
                    } */}
              {
                imagePreview.length > 0 && (
                  <div className="image-preview-container">
                    <h5>Selected Images:</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {imagePreview.map((img, idx) => (
                        <img key={idx} src={img} alt={`Preview ${idx}`} style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  </div>
                )
              }
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              {uploadImage && (
                <div>
                  <h5>Uploaded Image:</h5>
                  <img src={uploadImage} alt="Uploaded Patient" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                </div>
              )}
            </Col>
          </Row>
        </Col>
        <Col md={6} className='vh-60 border overflow-auto'>
              <Row className='m-2 text-end'>
                <Col><Button onClick={fetchUploadedImageByPatId}>All Images</Button></Col>
              </Row>
          <Row>
            <Col className='overflow-auto'>
              {patientImageDetails.length < 1 ?
                <Row className="h-100 align-items-center">
                  <Col>
                    <h4>No Images Uploaded in this Visit.</h4>
                  </Col>
                </Row>
                :
                <Row className="gap-2 justify-content-center p-2">
                  {appData.organization.code && patientImageDetails.map((image, idx) => (
                    <Col className="position-relative border rounded min-w-150px max-w-150px p-0" key={idx}>
                      <img
                        src={`${uploadedBaseUrl}/${image.path}`}
                        alt={`Preview ${idx}`}
                        onClick={() => handlePreviewClick(image)}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        onClick={() => handleDeleteClick(image)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '10px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </span>
                      <div>{image.invDate == "0000-00-00" ? "" : image.invDate }</div>
                      <div className="text-center mt-1">{image.invName}</div>
                      <div className='text-center mt-1'>{image.otherInv}</div>
                    </Col>
                  ))}
                </Row>
                // <Row className="gap-2 justify-content-center p-2">
                //       {appData.organization.code && patientImageDetails.map((image, idx) => (
                //           <Col className="border rounded min-w-150px max-w-150px" key={idx}>
                //             <img key={idx} 
                //               src={`${uploadedBaseUrl}/${image.path}`} 
                //               alt={`Preview ${idx}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />

                //           </Col>
                //       ))}
                //   </Row>
              }
            </Col>
          </Row>
        </Col>
      </Row>

      {previewSelectedImage && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          onClick={handleClosePreview}
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body p-0">
                <img src={previewSelectedImage} alt="Full Preview" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}




      {/* </Modal.Body>
      </Modal> */}

      {/* Modal for delete confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete this image?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ImageUploadScreen