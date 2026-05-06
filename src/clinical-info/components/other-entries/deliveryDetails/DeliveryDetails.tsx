import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import ClinicalLayout from '../../ClinicalLayout'
import { babyDetail, basic, deliverydetialsFormat, deliveryInfo, findings, inductionFormat } from './component/DeliveryDetailsData'
import { Button, Col, Container, Form, FormLabel, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { useNavigate } from 'react-router-dom'
import { routerPathNames } from '../../../../routes/routerPathNames'
import { toastSuccessBounceDark } from '../../../../utils/toast'
import { AxiosError } from 'axios'
import { errorHandling } from '../../../../error/state/error-handle-action'

const DeliveryDetails = () => {
    // const { clinicalCurrentOpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)
    const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
    const [show, setShow] = useState(false);
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()

    let patientDetails: any;
    let ipId: number;
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isPre, setIsPre] = useState({ isPrevious: false, id: '0' })

    const [tempDeliveryDetails, setTempDeliveryDetails] = useState<any>({ ...deliverydetialsFormat })
    const [tempInduction, settempInduction] = useState([
        ...inductionFormat
    ])

    const handleChange = (name: any, value: any) => {
        try {
            setTempDeliveryDetails({ ...tempDeliveryDetails, [name]: value })
        } catch (error) {
            handleError(error)
        }
    }
    const handleInduction = (name: any, value: any, i: number) => {
        try {
            tempInduction[i] = { ...tempInduction[i], [name]: value }
            settempInduction([...tempInduction])
        } catch (error) {
            handleError(error)
        }
        //{...res}
    }
    const handleInductionAdd = (i: number) => {
        try {
            if (tempInduction.length == i + 1) {
                tempInduction.push({ indNumber: i + 1, indName: '', indDate: '0000-00-00', indTime: '00:00', isValid: 1 })
                settempInduction([...tempInduction])
            }
        } catch (error) {
            handleError(error)
        }
    }
    const handleInductionDelete = (i: number) => {
        try {
            if (tempInduction.length > 1) {
                let inductionRow = [...tempInduction].filter((row: any, row_idx: number) => row_idx != i)
                settempInduction([...inductionRow])
            }
            else {
                settempInduction([...inductionFormat])
            }
        } catch (error) {
            handleError(error)
        }
    }
    const handleSave = async () => {
        try {
            let data = { ...tempDeliveryDetails, patId: clinicalCurrentOpPatient.patientId, vstId: clinicalCurrentOpPatient.visitId, createAncDeliveryInductionRequestList: [...tempInduction] }
            const response = await caseSheetApiService.saveDeliverySheet(data)
            console.log(response);
            setIsPre({ ...isPre, isPrevious: true, id: response.id })
            toastSuccessBounceDark("Anc Delivery Case Sheet  Saved");
        } catch (error) {
            handleError(error)
        }
    }
    const fetchPrevDetials = async () => {
        try {
            const CheckAnc = await caseSheetApiService.fetchAncByVstId(clinicalCurrentOpPatient.patientId)
            if (CheckAnc[0]) {
                const response = await caseSheetApiService.fetchDeliveryByVstId(clinicalCurrentOpPatient.visitId)
                if (response[0]) {
                    settempInduction([...tempInduction, ...response[0].ancDeliveryInductionList])
                    setIsPre({ ...isPre, isPrevious: true, id: response[0].id })
                    delete response[0]?.ancDetialsDataList
                    setTempDeliveryDetails({ ...tempDeliveryDetails, ...response[0] })
                }
            }
            else {
                //alert('ANC IS NOT REGISTERED')
                //navigate(routerPathNames.clinical.antenatalcasesheet3)
            }
        } catch (error) {
            handleError(error)
        }
    }
    const handleUpdate = async () => {
        try {
            let data = { ...tempDeliveryDetails, patId: clinicalCurrentOpPatient.patientId, vstId: clinicalCurrentOpPatient.visitId, createAncDeliveryInductionRequestList: [...tempInduction] }
            const response = await caseSheetApiService.updateDeliverSheet(isPre.id, data)
            console.log(response);
            toastSuccessBounceDark("Anc Delivery Case Sheet Updated");
        } catch (error) {
            handleError(error)
        }

    }
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    };
    useEffect(() => {
        fetchPrevDetials()
    }, [])
    const casesheet = "DELIVERY DETAILS"
    return (
        <>
            <ClinicalLayout {...{casesheet}}>
                {/* <FormLabel className='heading mx-auto'>DELIVERY DETAILS<span className="text-dark">{clinicalCurrentOpPatient?.fullName} / {clinicalCurrentOpPatient?.displayNumber} / {clinicalCurrentOpPatient?.age} / {clinicalCurrentOpPatient?.gender}</span></FormLabel> */}
                <Container fluid="lg" className='clinical-general-container overflow-auto d-flex text-start h-100 flex-column p-2'>
                    <Row className='border h-100 border-black mt-4 mx-2 py-3 rounded overflow-auto'>
                        <Row>
                            {
                                basic?.map((obj: any, i: number) => {
                                    return (
                                        <Col md={2} key={i}>
                                            <Form.Group className="mb-3 general-case-sheet-input" >
                                                <Form.Control
                                                    type={obj?.type}
                                                    name={obj?.fieldName}
                                                    value={tempDeliveryDetails[obj?.fieldName]}
                                                    onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                />
                                                <label className="fs-11px">{obj?.name}</label>
                                            </Form.Group>
                                        </Col>
                                    )
                                })
                            }
                            <Col>  <Button variant="secondary" onClick={handleShow}>
                                Basic Info
                            </Button>
                            </Col>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Basic Info</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Form.Group className="mb-3 general-case-sheet-input" >
                                            <Form.Control as='textarea'
                                                name='riskFactor'
                                                value={tempDeliveryDetails['riskFactor']}
                                                onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                            />
                                            <label className="fs-11px">Risk Factors</label>
                                        </Form.Group>

                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3 general-case-sheet-input" >
                                            <Form.Control as='textarea'
                                                name='complication'
                                                value={tempDeliveryDetails['complication']}
                                                onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                            />
                                            <label className="fs-11px">Complication</label>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3 general-case-sheet-input" >
                                            <Form.Control
                                                name='deliveryDoc'
                                                value={tempDeliveryDetails['deliveryDoc']}
                                                onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                            />
                                            <label className="fs-11px">Delivery conducted by</label>
                                        </Form.Group>
                                    </Row>
                                </Modal.Body>

                            </Modal>
                        </Row>
                        <Row className='border clinical-general-history-header m-4 mx-2 py-1 rounded overflow-auto'>
                            <div>
                                <Table size="sm">
                                    <thead>
                                        <tr className='text-center'>
                                            <th>INDUCTION</th>
                                            <th>NAME</th>
                                            <th>DATE</th>
                                            <th>TIME</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tempInduction.map((obj: any, i: number) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='text-center'>{i + 1}</td>
                                                        <td >
                                                            <Form.Group className="mb-3 general-case-sheet-input" >
                                                                <Form.Control
                                                                    size='sm'
                                                                    type=''
                                                                    name='indName'
                                                                    value={tempInduction[i]?.indName}
                                                                    onChange={(e) => { handleInduction(e.target.name, e.target.value, i) }}
                                                                />
                                                            </Form.Group>
                                                        </td>
                                                        <td >
                                                            <Form.Group className="mb-3 general-case-sheet-input" >
                                                                <Form.Control
                                                                    size='sm'
                                                                    type='date'
                                                                    name='indDate'
                                                                    value={obj?.indDate}
                                                                    onChange={(e) => { handleInduction(e.target.name, e.target.value, i) }}
                                                                />
                                                            </Form.Group>
                                                        </td>
                                                        <td >
                                                            <Form.Group className="mb-3 general-case-sheet-input" >
                                                                <Form.Control
                                                                    size='sm'
                                                                    type='time'
                                                                    name='indTime'
                                                                    value={obj?.indTime}
                                                                    onChange={(e) => { handleInduction(e.target.name, e.target.value, i) }}
                                                                />
                                                            </Form.Group>
                                                        </td>
                                                        <td >
                                                            <Row>
                                                                <Col>
                                                                    <Button variant="success">
                                                                        <FontAwesomeIcon icon={faPlus} onClick={() => { handleInductionAdd(i) }} />
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button variant="dark" >
                                                                        <FontAwesomeIcon icon={faTrash} onClick={() => { handleInductionDelete(i) }} />
                                                                    </Button>
                                                                </Col>
                                                            </Row>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </Table>
                            </div>
                        </Row>
                        <Row>
                            {
                                deliveryInfo?.map((obj: any, i) => {
                                    return (
                                        obj.option ?
                                            <Col key={i}>
                                                <Form.Group className="mb-3 general-case-sheet-input" >
                                                    <Form.Select className="button_style"
                                                        name={obj?.fieldName}
                                                        value={tempDeliveryDetails[obj?.fieldName]}
                                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                    >
                                                        {
                                                            obj.option.map((val: any, i: number) => {
                                                                return (
                                                                    <option key={i} value={val?.value}>{val?.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Select>
                                                    <label >{obj?.name}</label>
                                                </Form.Group>
                                            </Col> :
                                            <Col md={2} key={i}>
                                                <Form.Group className="mb-3 general-case-sheet-input" >
                                                    <Form.Control
                                                        name={obj?.fieldName}
                                                        type={obj?.type}
                                                        value={tempDeliveryDetails[obj?.fieldName]}
                                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                    />
                                                    <label className="fs-11px">{obj?.name}</label>
                                                </Form.Group>
                                            </Col>
                                    )
                                })
                            }
                            <Col md={2}>
                                <Form.Group className="mb-3 general-case-sheet-input" >
                                    <Form.Control as='textarea'
                                        name='indication'
                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        value={tempDeliveryDetails['indication']}
                                    />
                                    <label className="fs-11px">Indication</label>
                                </Form.Group>

                            </Col>
                        </Row>

                        <Row className=" mb-2 fw-bold"><Col>INTRAPARTUM/INTRAOPERATIVE FINDINGS</Col></Row>
                        <Col>
                            <Row>
                                {
                                    findings.map((obj: any, i: number) => {
                                        return (
                                            <Col md={2} key={i}>
                                                <Form.Group className="mb-3 general-case-sheet-input" >
                                                    <Form.Control
                                                        name={obj?.fieldName}
                                                        type={obj?.type}
                                                        value={tempDeliveryDetails[obj?.fieldName]}
                                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                    />
                                                    <label className="fs-11px">{obj?.name}</label>
                                                </Form.Group>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Col>

                        <Row className=" fw-bold"><Col>BABY DETAILS</Col></Row>
                        <Row>
                            {
                                babyDetail?.map((obj, i) => {
                                    return (
                                        obj.option ?
                                            <Col key={i}>
                                                <Form.Group className="mb-3 general-case-sheet-input" >
                                                    <Form.Select className="button_style"
                                                        name={obj?.fieldaname}
                                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                        value={tempDeliveryDetails[obj?.fieldaname]}
                                                    >
                                                        {obj?.option?.map((option, idx) => {
                                                            return (
                                                                <option key={idx} value={option?.value}>{option?.name}</option>
                                                            )
                                                        })}

                                                    </Form.Select>
                                                    <label className="fs-11px">{obj?.name}</label>

                                                </Form.Group>
                                            </Col> :
                                            <Col key={i}>
                                                <Form.Group className="mb-3 general-case-sheet-input" >
                                                    <Form.Control
                                                        name={obj?.fieldaname}
                                                        value={tempDeliveryDetails[obj?.fieldaname]}
                                                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                        type={obj?.type}
                                                    />
                                                    <label className="fs-11px">{obj?.name}</label>
                                                </Form.Group>
                                            </Col>
                                    )
                                })
                            }
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Row>
                                    <Col>Apgar  :</Col>
                                    <Col>
                                        <Form.Group className="mb-3 general-case-sheet-input" >
                                            <Form.Control
                                                name='mins1'
                                                onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                                value={tempDeliveryDetails['mins1']}
                                            />
                                            <label className="fs-11px">1 min</label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3 general-case-sheet-input" >
                                            <Form.Control
                                                name='mins5'
                                                value={tempDeliveryDetails['mins5']}
                                                onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                            />
                                            <label className="fs-11px">5 min</label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </Row>
                    <Row className=''>
                        <Col className='text-end my-2'>
                            {
                                isPre.isPrevious ?
                                    <Button variant="success" className="m-1" onClick={() => { handleUpdate() }}>
                                        Update
                                    </Button>
                                    :
                                    <Button variant="primary" className="m-1" onClick={() => { handleSave() }}>
                                        Save
                                    </Button>
                            }
                        </Col>
                    </Row>
                </Container>
            </ClinicalLayout>

        </>
    )
}

export default DeliveryDetails