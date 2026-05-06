import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormLabel, Row } from 'react-bootstrap'
import ClinicalLayout from '../../../ClinicalLayout'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../state/store'
import { clearErrorHandling } from '../../../../../error/state/error-handle-action'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CaseSheetApiService from '../../../../../api/case-sheet/case-sheet-api-service'

const vitalData = [
  {
    controlId: "temperature",
    inputType: "text",
    valueName: "temperature",
    name: "TEMP"
  },
  {
    controlId: "pulse",
    inputType: "text",
    valueName: "pulse",
    name: "PULSE"
  },
  {
    controlId: "rr",
    inputType: "text",
    valueName: "rr",
    name: "RR"
  },
  {
    controlId: "bp",
    inputType: "text",
    valueName: "bp",
    name: "BP"
  }
]

const vitalData2 = [
  {
    controlId: "spo2",
    inputType: "text",
    valueName: "spo2",
    name: "SPO2"
  },
  {
    controlId: "height",
    inputType: "number",
    valueName: "height",
    name: "HEIGHT(cm)"
  },
  {
    controlId: "weight",
    inputType: "number",
    valueName: "weight",
    name: "WEIGHT(kg)"
  },
  {
    controlId: "bmi",
    inputType: "number",
    valueName: "bmi",
    name: "BMI"
  }
]

const vitalModel = {
  patId: 0,
  vstId: 0,
  temperature: "",
  pulse: "",
  rr: "",
  bp: "",
  spo2: "",
  height: 0,
  weight: 0,
  bmi: 0,
  datetime: ""
}

const Vitals = ({ temporaryCaseSheet, handleInputChange, examinationData, handleOpenSearchTemplate, handleOpenCreateTemplate }: any) => {

  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()

  const dispatch = useDispatch()

  const { clinicalCurrentOpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)

  let patDetails = clinicalCurrentOpPatient

  const [tempVitals, setTempVitals] = useState<any>({ ...vitalModel })

  const [vitalsStatus, setVitalsStatus] = useState<any>({ savingVitals: false, updatingVitals: false })

  const [isPrevVitals, setIsPrevVitals] = useState<any>({ status: false, id: "" })


  const saveVitals = () => {
    let temp = { ...tempVitals, patId: patDetails.patientId, vstId: patDetails.visitId }
    console.log(temp)
  };

  const updateVitals = () => {
    let temp = { ...tempVitals, patId: patDetails.patientId, vstId: patDetails.visitId }
    console.log(temp)
  };

  useEffect(() => {
    return () => {
      dispatch(clearErrorHandling())
    }
  }, [])
  return (
    <>
      <Container className="d-flex flex-column h-100 border border-dark rounded overflow-auto">
        <Row className="py-1 py-lg-4 row-cols-1 row-cols-lg-2">
          <Col className='my-2 my-lg-0'>
            <Row className='justify-content-center'>
              <Col md={9} className='pt-3 border rounded h-100 overflow-auto d-flex flex-column justify-content-center'  >
                {
                  vitalData.map((item: any, idx: number) => (
                    <Row className='py-lg-2  row-cols-1 row-cols-sm-2 align-items-center' key={idx}>
                      <Col className='fw-bold' >{item.name}</Col>
                      <Col className='px-5'>
                        <Form.Group className="mb-2 mb-lg-3 general-case-sheet-input" controlId={item.controlId}>
                          <Form.Control
                            value={temporaryCaseSheet[item.valueName]}
                            type={item.inputType}
                            onChange={e => { handleInputChange(e.target.value, item.valueName) }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))
                }
              </Col>
            </Row>
          </Col>
          <Col>
            <Row className='justify-content-center'>
              <Col md={9} className='pt-3 border rounded h-100 overflow-auto d-flex flex-column justify-content-center'  >
                {
                  vitalData2.map((item: any, idx: number) => (
                    <Row className='py-lg-2  row-cols-1 row-cols-sm-2 align-items-center' key={idx}>
                      <Col className='fw-bold' >{item.name}</Col>
                      <Col className='px-5'>
                        <Form.Group className="mb-2 mb-lg-3 general-case-sheet-input" controlId={item.controlId}>
                          <Form.Control
                            value={temporaryCaseSheet[item.valueName]}
                            type={item.inputType}
                            onChange={e => { handleInputChange(e.target.value, item.valueName) }}
                            disabled={item.valueName == "bmi"}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))
                }

              </Col>
            </Row>
          </Col>
        </Row>

        <Row className=" h-100 mt-lg-4 mx-2 py-3 rounded ">
          {examinationData.map((data: any, idx: any) => (
            <Col className="my-1" key={idx}>
              <Row>
                <Col>
                  <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                    <Form.Control as="textarea" rows={6}
                      value={temporaryCaseSheet[data.fieldName]}
                      onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                      placeholder=''
                    />
                    <label htmlFor={data.id}>{data.name}</label>
                  </Form.Group>
                </Col>
                <Col className="d-flex flex-grow-0">
                  <Col className="px-2">
                    <Button variant="dark" tabIndex={2} onClick={() => handleOpenSearchTemplate(data.id)}>
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </Col>
                  <Col className="px-2">
                    <Button variant="success" tabIndex={2} onClick={() => handleOpenCreateTemplate(data.id)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Container>



    </>
  )
}

export default Vitals