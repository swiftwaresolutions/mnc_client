import React, { Fragment, useEffect, useState } from 'react'
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../../utils/toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons'
import CreateTemplate from '../../../casesheet/general-case-sheet/components/create-template'
import SearchTemplate from '../../../casesheet/general-case-sheet/components/search-template'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../state/store'

const labDetails = [
  {
    id: 1,
    name: "LAB NAME",
    fieldName: "labName",
    value: ""
  },
  {
    id: 2,
    name: "REFFER BY",
    fieldName: "suggestDoc",
    value: ""
  },
  {
    id: 3,
    name: "Select Date",
    fieldName: "selDateTime",
    value: "0000-00-00 00:00"
  }
]

const LabScreenEntry = ({ onHide, refresh, show, selectedNames, setSelectedNames, selectedDeptNames, selectedInvNames, selectedInvDeptNames, setSelectedInvNames, setSelectedDeptNames, handleInputInvChange, handleInuputNotesChange, tempOustideResult, handleInputChange, saveOutsideLabData, saveOutsideInvData, handleInputFieldChange }: any) => {
  const { id: userId } = useSelector((s: RootState) => s.loginData);

  const caseSheetType = 21
  const docId = userId;
  
  const [createTemplateShow, setCreateTemplateShow] = useState(false)
  const [searchTemplateShow, setSearchTemplateShow] = useState(false)
  const [createTemplateId, setCreateTemplateId] = useState<any>(null)
  const [searchTemplateId, setSearchTemplateId] = useState<any>(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const handleCreateTemplateOpen = () => setCreateTemplateShow(true)

  const handleSearchTemplateOpen = () => setSearchTemplateShow(true)

  const handleCreateTemplateClose = () => {
    setCreateTemplateShow(false)
  }
  const openCreateTemplate = (id: any) => {
    handleCreateTemplateOpen();
    setCreateTemplateId(id)
  }

  const openSearchTemplate = (id: any) => {
    handleSearchTemplateOpen();
    setSearchTemplateId(id);
  }

  const handleSearchTemplateClose = (value: any, id: any) => {
    setSearchTemplateShow(false);
    setSelectedInvNames((prev: any) => {
      let local = [...prev]
      const foundIndex = local.findIndex((item) => item.id == id && item.label == "I")

      if (foundIndex != -1) {
        local[foundIndex].findings = value
      }
      return local
    })
  }

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    setCurrentDateTime(formattedDateTime);
  }, []);

  return (
    <>
      <Modal
        {...{ show }}
        size='xl'
        {...{ onHide }}
      >
        <Modal.Header>
          <Row className='justify-content-around w-100'>
            <Col className='ps-5 text-end text-danger'>
              <Modal.Title id="contained-modal-title-vcenter">OUTSIDE {selectedDeptNames.length > 0 ? "LAB" : "INVESTIGATION "} ENTRY SCREEN</Modal.Title>
            </Col>
            <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
          </Row>
        </Modal.Header>
        <Modal.Body className='vh-75 overflow-auto pb-5 mb-4'>
          <Row className='m-3 text-center fw-bold'>
            <Col>LAB DETAILS</Col>
          </Row>
          <Row>
            {(selectedDeptNames.length > 0 || selectedInvDeptNames.length > 0) &&
              labDetails.map((det: any, idx: number) => (
                <Col md={4} key={idx}>
                  <Row>
                    <Col xs={6} sm={4} className='text-center fw-bold'>{det.name} :</Col>
                    {
                      det.fieldName === "selDateTime" ?
                        <Col xs={6} sm={8} className="general-case-sheet-input">
                          <Form.Group>
                            <Form.Control
                              type='datetime-local'
                              placeholder=''
                              value={tempOustideResult[det.fieldName] == "0000-00-00 00:00" ? "" : tempOustideResult[det.fieldName]}
                              onChange={(e) => handleInputChange(e.target.value, det.fieldName)}
                              max={currentDateTime}
                            />
                            <label className="font-size-11px">SELECT DATE</label>
                          </Form.Group>
                        </Col>
                        :
                        <Col xs={6} sm={8} className='text-center'>
                          <Form.Group>
                            <Form.Control
                              placeholder={det.name}
                              size='sm'
                              value={tempOustideResult[det.fieldName]}
                              onChange={(e) => handleInputChange(e.target.value, det.fieldName)}
                            />
                          </Form.Group>
                        </Col>
                    }

                  </Row>
                </Col>
              ))
            }
          </Row>
          <Row className='mt-3'>
            {selectedDeptNames.length > 0 &&
              <Table striped hover>
                <thead className='table-dark border sticky-top fs-11px'>
                  <tr>
                    <th className='text-center'>S NO</th>
                    <th className='text-center'>TEST NAME</th>
                    <th className='text-center'>RESULT</th>
                    <th className='text-center'>Unit</th>
                    <th className='text-center'>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    selectedDeptNames.map((item: any, idx: number) => (
                      <Fragment key={idx}>
                        <tr>
                          <td colSpan={5} className='fw-bold text-center text-primary'>{item}</td>
                        </tr>
                        {
                          selectedNames
                            .filter((val: any, idN: number) => val.name1 === item)
                            .map((test: any, idz: number) => (
                              <>
                                <tr key={`test-${idz}`}>
                                  {/* <td>{idz+1}</td> */}
                                  <td colSpan={4} className='fw-bold px-3 text-uppercase'>{test.name}</td>
                                  <td>
                                    <Form.Group>
                                      <Form.Control
                                        size='sm'
                                        onChange={(e) => handleInuputNotesChange(e.target.value, test.id, test.label)}
                                      />
                                    </Form.Group>
                                  </td>
                                </tr>
                                {
                                  test.fields?.map((fName: any, fId: number) => (
                                    <>
                                      <tr key={`fiel-${fId}`} className='text-center mx-3'>
                                        <td>{fId + 1}</td>
                                        <td>{fName.fieldName}</td>
                                        <td>
                                          <Form.Group>
                                            <Form.Control
                                              size='sm'
                                              value={fName.value}
                                              onChange={(e) => handleInputFieldChange(e.target.value, fId, test.id, test.label)}
                                            />
                                          </Form.Group>
                                        </td>
                                        <td >{fName.unit}</td>
                                        <td></td>
                                      </tr>
                                    </>
                                  ))
                                }
                              </>
                            ))
                        }
                      </Fragment>
                    ))
                  }
                </tbody>
              </Table>
            }
          </Row>
          {
            selectedInvDeptNames.map((grpItem: any, gIdx: number) => (
              <Fragment key={gIdx}>
                <Row className='m-3 text-center fw-bold text-uppercase text-primary' key={gIdx}>
                  <Col>{grpItem}</Col>
                </Row>
                {
                  selectedInvNames
                    .filter((val: any, idz: number) => val.name1 === grpItem)
                    .map((item: any, idx: number) => (
                      <>

                        <Row key={idx}>
                          <Col>
                            <Form.Group className='mb-3 general-case-sheet-input'>
                              <Form.Control as="textarea" autoFocus={true}
                                rows={4}
                                placeholder=''
                                value={item.findings}
                                onChange={(e) => handleInputInvChange(e.target.value, item.id, item.label)}
                              />
                              <label >{item.name}</label>
                            </Form.Group>
                          </Col>
                          <Col className="d-flex flex-grow-0">
                            <Col className='px-2'>
                              <Button variant='dark' tabIndex={2} onClick={() => openSearchTemplate(item.id)}>
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </Col>
                            <Col className='px-2'>
                              <Button variant='success' tabIndex={2} onClick={() => openCreateTemplate(item.id)}>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </Col>
                          </Col>
                        </Row>
                      </>
                    ))
                }
              </Fragment>
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          {
            selectedDeptNames.length > 0 &&
            <Row>
              <Col>
                <Button variant='success' className='button_style py-1 px-5  mx-3' onClick={saveOutsideLabData}>SAVE</Button>
              </Col>
            </Row>
          }
          {
            selectedInvNames.length > 0 &&
            <Row>
              <Col>
                <Button variant='success' className='button_style py-1 px-5  mx-3' onClick={saveOutsideInvData}>SAVE Inv</Button>
              </Col>
            </Row>
          }

        </Modal.Footer>
      </Modal>
      {/* CREATE TEMPLATE */}

      <Modal
        show={createTemplateShow}
        onHide={handleCreateTemplateClose}
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Body className="p-0">
          <CreateTemplate handleClose={handleCreateTemplateClose} id={createTemplateId} setCreateTemplateShow={setCreateTemplateShow} caseSheetType={caseSheetType} docId={docId} />
        </Modal.Body>
      </Modal>

      {/* Search TEMPLATE */}

      <Modal
        show={searchTemplateShow}
        centered
        size="lg"
        onHide={() => setSearchTemplateShow(false)}
      >
        <Modal.Body className="p-0">
          <SearchTemplate handleClose={handleSearchTemplateClose} id={searchTemplateId} setSearchTemplateShow={setSearchTemplateShow} caseSheetType={caseSheetType} docId={docId} />
        </Modal.Body>
      </Modal>
    </>
  )
}



export default LabScreenEntry