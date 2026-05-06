import React, { useEffect, useState } from 'react'
import ClinicalLayout from '../../ClinicalLayout'
import { Button, Col, Form, FormLabel, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { PrescriptionApiService } from '../../../../api/prescription/prescription-api-service'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import EditPrescription from './components/editPrescription/EditPrescription'
import SavePreviewPrescription from './components/save-preview-prescription/SavePreviewPrescription'
import { AxiosError } from 'axios'
import { errorHandling } from '../../../../error/state/error-handle-action'
import PreviousPrescription from './components/previousPrescription/PreviousPrescription'
import PrescriptionTemplates from './components/prescription-templates/PrescriptionTemplates'

const NursePrescription = () => {
  const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)

  let patientDetails: any;

  let ipId;

  if (isIp == 0) {
    patientDetails = clinicalCurrentOpPatient
    ipId = 0
  } else {
    patientDetails = clinicalCurrentIpPatient
    ipId = patientDetails.ipId
  }
  let medicineStoreId: number = 0;

  let hospitalDisponsoryStoreId: number = 0;

  let prescriptionTemplateId: number = 1;


    hospitalDisponsoryStoreId = 1; // Need to check hospital
    medicineStoreId = 1;
  

  const loginUser = useSelector((s: RootState) => s.loginData)
  const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService()
  const [medicineNameListOption, setMedicineNameListOption] = useState([])
  const [prescriptionUnits, setprescriptionUnits] = useState([])
  const [PresNo, setPresNo] = useState('')
  const [issave, setIssave] = useState(true)
  const [prescriptionId, setPrescriptionId] = useState({ status: false, prescId: '' })
  const [savePrescriptionsData, setSavePrescriptionsData] = useState<any[]>([]);
  const [previousPrescriptionNameList, setPreviousPrescriptionNameList] = useState<any[]>([])
  const [previousPrescriptionSelectedValue, setPreviousPrescriptionSelectedValue] = useState<any[]>([])
  const [previousPrescriptionAllList, setPreviousPrescriptionAllList] = useState<any[]>([])

  const [templateNameList, setTemplateNameList] = useState<any[]>([])
  const [templateSelectedValue, setTemplateSelectedValue] = useState<any[]>([])



  const dispatch = useDispatch()
  const [showEditPrescription, setShowEditPrescription] = useState(false);
  const [total, setTotal] = useState(0);
  const [showPreviousPrescription, setShowPreviousPrescription] = useState(false);
  const [showSavePreviewPrescription, setShowSavePreviewPrescription] = useState(false);
  const [isSave, setIsSave] = useState(true)
  const [commonDuration, setCommonDuration] = useState<any>({ number: 0, duration: 0 })
  const [showPrescriptionTemplates, setShowPrescriptionTemplates] = useState(false);
  const [updateDisable,setUpdateDisable]=useState(false)


  const tempPrescriptionSaveFormat = {
    display: 0,
    cycle_id: 0,
    pat_id: 0,
    doc_id: 0,
    dept_id: 0,
    date: '',
    time: '',
    uid: 0,
    is_doc_prescription: 0,
    is_valid: 1,
    is_first_dosage_seted: 0,
    ip_id: 0,
    is_order_prepared: 0,
    is_opd_order: 1,
    advice: 0,
    visit_id: 0,
    isIssued: 0,
    is_billed: 0,
    final_bill_id: 0,
    notes: '',
    isFromSummary: 0,
    createPrescriptionDetailsRequestList: []
  }
  const createMedicineRequestList =
  {
    prescription_id: 0,
    generic_id: 0,
    prods_id: 0,
    quantity: 0,
    unit: 0,
    qno: 0,
    timing: 72,
    duration: 0,
    period: 0,
    route: 0,
    instruction: 0,
    date: "",
    is_order_prepared: 0,
    order_id: 0,
    is_paid: 0,
    is_own: 0,
    is_cancelled: 0,
    batchId: 0,
    notes: "",
    timingUnits: "",
    units: [...prescriptionUnits],
    stock: 0,
    rate: 0,
    med: {},
    mrpPrice: '',
    selectedMed: [''],
    itemHasError: ''
  }
  const [tempPrescriptions, setTempPrescriptions] = useState({ ...tempPrescriptionSaveFormat })
  const [tempMedicine, setTempMedicine] = useState([createMedicineRequestList])

  // Functions

  useEffect(()=>{
    handleTotal()
  },[tempMedicine])

  function refreshAll(){
    getUnits()
    setTempMedicine([createMedicineRequestList])
    setTempPrescriptions({ ...tempPrescriptionSaveFormat })
    setUpdateDisable(false)
    setIssave(true)
    setTotal(0)
    setPrescriptionId({ status: false, prescId: '' })
    setPresNo('')
  }
  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
      dispatch(errorHandling(error.message));
    } else {

    }
  };
  const handleMedicineSearch = async (query: any, item: any, idx: any) => {
    try {
      if (query.length > 0) {
        tempMedicine[idx].selectedMed = [query]
      }
      else {
        tempMedicine[idx].selectedMed = ['']
      }
      item.searchMedName = query
      tempMedicine[idx] = item;
      setTempMedicine([...tempMedicine]);
      if (query.length > 1) {
        const medicineNameListResponse: any = await prescriptionApiService.getMedicineNameList(query, `${medicineStoreId}`);
        setMedicineNameListOption(medicineNameListResponse);
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleMedicine = async (selectedMedicine: any) => {
    try {
      if (selectedMedicine) {
        const stockArr = await prescriptionApiService.getStoreWiseAvailableStock(selectedMedicine?.id);
        const med = stockArr.filter((obj: any) => {
          return obj.storeId == 1
        })
        return med
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleMedicineSelect = async (selected: any, idx: any, item: any) => {
    try {
      if (selected[0]) {
        const med = await handleMedicine(selected[0])
        const itemUnit: any = prescriptionUnits.filter((obj: any) => {
          return (selected[0]?.unit == obj?.name)
        })
        if (selected[0].stock == 0) {
          tempMedicine[idx] = { ...createMedicineRequestList, generic_id: selected[0]?.genId, prods_id: selected[0]?.id, stock: selected[0]?.stock, unit: itemUnit[0]?.id, rate: med[0] ? (med[0]?.mrpPrice).toFixed(2) : 0, mrpPrice: med[0] ? (med[0]?.mrpPrice.toFixed(2)) : 0, med: med ? med[0] : {}, qno: 1, quantity: 1, selectedMed: [selected[0].medName], itemHasError: 'less stock' }
          setTempMedicine([...tempMedicine])
          toastErrorBounceDark('less stock')
        }
        else {
          tempMedicine[idx] = { ...createMedicineRequestList, generic_id: selected[0]?.genId, prods_id: selected[0]?.id, stock: selected[0]?.stock, unit: itemUnit[0]?.id, rate: med[0] ? (med[0]?.mrpPrice).toFixed(2) : 0, mrpPrice: med[0] ? (med[0]?.mrpPrice.toFixed(2)) : 0, med: med ? med[0] : {}, qno: 1, quantity: 1, selectedMed: [selected[0].medName], itemHasError: '' }
          setTempMedicine([...tempMedicine])
        }
        handleTotal()
      }
    } catch (error) {
      handleError(error)
    }
  }
  const getUnits = async () => {
    try {
      let unitResponse = await prescriptionApiService.getPrescriptionUnitDetails();
      setprescriptionUnits(unitResponse);
    } catch (error) {
      handleError(error)
    }
  }
  const handleOnQtyChange = (event: any, iNo: any, obj: any) => {
    try {
      obj.qno = event.target.value
      obj.quantity = event.target.value
      obj = calculateMedicineAmt(obj)
      tempMedicine[iNo] = obj
      if(obj.quantity>obj.stock){
        obj.itemHasError='less stock'
        toastErrorBounceDark("less stock")

      }
      else{
        obj.itemHasError=''
      }
      setTempMedicine([...tempMedicine])
      handleTotal()
    } catch (error) {
      handleError(error)
    }
  }
  const calculateMedicineAmt = (obj: any) => {
    try {
      let rate = obj.mrpPrice
      let tRate = (Number(obj.qno) * Number(rate)).toFixed(2)
      obj.rate = tRate
      return obj
    } catch (error) {
      handleError(error)
    }
  }
  const addMorePrescription = (obj: any, iNo: number) => {
    try {
      if (tempMedicine.length - 1 <= iNo && tempMedicine[iNo].prods_id) {
        tempMedicine[iNo + 1] = createMedicineRequestList
        setTempMedicine([...tempMedicine])
        handleTotal()
      }
      else {
        toastErrorBounceDark("Medicine should not be empty")
      }
    } catch (error) {
      handleError(error)
    }
  }
  const removePrescription = (obj: any, iNo: number) => {
    try {
      if (tempMedicine.length == 1) {
        setTempMedicine([createMedicineRequestList])
      }
      else {
        setTempMedicine((pre: any) => pre.filter((item: any, idx: number) => idx != iNo));
      }
      console.log(tempMedicine);
    } catch (error) {
      handleError(error)
    }
  }
  const handleSavePrescription = async () => {
    try {
      let tempx = true
      tempMedicine.forEach((med: any) => {
        if (med.stock == 0) {
          toastErrorBounceDark("less stock")
          tempx = false
        }
        if (med.prods_id == 0) {
          toastErrorBounceDark("Medicine should not be empty")
          tempx = false
        }
      })
      if (tempx) {
        let save = { ...tempPrescriptions, cycle_id: 1, pat_id: patientDetails.patientId, doc_id: patientDetails.doctorId, visit_id: patientDetails.visitId, uid: loginUser.id, createPrescriptionDetailsRequestList: [...tempMedicine], ip_id: patientDetails.ipId }
        console.log('save', save);
        let res = await prescriptionApiService.savePrescription(save)
        setPresNo(res[0].display)
        setIssave(false)
        setPrescriptionId({ ...prescriptionId, status: true, prescId: res[0].display })
        setShowSavePreviewPrescription(true)
        setSavePrescriptionsData(save.createPrescriptionDetailsRequestList)
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleUpdatePrescription = async () => {
    try {
      console.log(tempMedicine);
      
      let tempx = true
      tempMedicine.forEach((med: any) => {
        if (med.stock == 0) {
          toastErrorBounceDark("less stock")
          tempx = false
        }
        if(med.quantity==0){
          toastErrorBounceDark("Medicine is zero")
          tempx = false
        }
        if (med.prods_id == 0) {
          toastErrorBounceDark("Medicine should not be empty")
          tempx = false
        }
      })
      if (tempx) {
        if (tempMedicine[tempMedicine.length - 1].prods_id != 0) {
          let save = { ...tempPrescriptions, cycle_id: 1, pat_id: patientDetails.patientId, doc_id: patientDetails.doctorId, visit_id: patientDetails.visitId, uid: loginUser.id, createPrescriptionDetailsRequestList: [...tempMedicine], ip_id: patientDetails.ipId }
              let data = await prescriptionApiService.updatePrescription(prescriptionId?.prescId, save)
              setShowSavePreviewPrescription(true)
              setSavePrescriptionsData(save.createPrescriptionDetailsRequestList)
              setUpdateDisable(true)
        }
      }
      else {
        toastErrorBounceDark("Medicine should not be empty")
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleEditPrescription = async () => {
    try {
      setShowEditPrescription(true)
      let prevPrescriptionListResponse = await prescriptionApiService.getPrescriptionDetailsbyPatId(String(patientDetails.patientId), hospitalDisponsoryStoreId)
      setPreviousPrescriptionAllList([...prevPrescriptionListResponse])
      prevPrescriptionListResponse = prevPrescriptionListResponse.reduce((acc: any[], cur: any) => {
        if (acc.findIndex((item: any) => item.displayNo == cur.displayNo) < 0) {
          acc.push(cur)
        }
        return acc
      }, [])
      setPreviousPrescriptionNameList([...prevPrescriptionListResponse])
      handleTotal()
    } catch (error) {
      handleError(error)
    }
  }
  const handlePreviousPrescription = async () => {
    setShowPreviousPrescription(true)
    let prevPrescriptionListResponse = await prescriptionApiService.getPrescriptionDetailsbyPatId(String(patientDetails.patientId), hospitalDisponsoryStoreId)
    setPreviousPrescriptionAllList([...prevPrescriptionListResponse])
    prevPrescriptionListResponse = prevPrescriptionListResponse.reduce((acc: any[], cur: any) => {
      if (acc.findIndex((item: any) => item.displayNo == cur.displayNo) < 0) {
        acc.push(cur)
      }
      return acc
    }, [])
    setPreviousPrescriptionNameList([...prevPrescriptionListResponse])
  }
  const handlePreviousPrescrionSelected = async (selectedDisplayNumber: string) => {
    try {
      let selected = [...previousPrescriptionAllList].filter((pres: any) => pres.displayNo == selectedDisplayNumber).filter((pre: any) => pre.formType)
      setPreviousPrescriptionSelectedValue([...selected])

    } catch (error) {
      handleError(error)
    }
  };
  const handleCurPresEdit = () => {
    try {
      setUpdateDisable(false)
      setIssave(false)
      let load: any = []
      previousPrescriptionSelectedValue.forEach((preMed: any, i: any) => {
        let rate = (Number(preMed.quantity) * Number(preMed.mrpPrice)).toFixed(2)
        let temp={}
        if(preMed.stock==0){
          temp = { ...createMedicineRequestList, ...preMed, selectedMed: [preMed.medName], rate: rate, period: 0, generic_id: preMed.genId, prods_id: preMed.id, unit: 1, timing: 0, itemHasError: 'less stock', quantity: 0 }
          toastErrorBounceDark('less stock')
        }
        else{
          temp = { ...createMedicineRequestList, ...preMed, selectedMed: [preMed.medName], rate: rate, period: 0, generic_id: preMed.genId, prods_id: preMed.id, unit: 1, timing: 0, }
        }
        load.push(temp)
      })
      setPrescriptionId({ status: true, prescId: load[0]?.displayNo })
      setPresNo(load[0]?.displayNo)
      setTempMedicine([...load])
      handleTotal()
    } catch (error) {
      handleError(error)
    }
  }
  const handlePresEdit = () => {
    try {
      setIssave(true)
      let load: any = []
      previousPrescriptionSelectedValue.forEach((preMed: any, i: any) => {
        let rate = (Number(preMed.quantity) * Number(preMed.mrpPrice)).toFixed(2)
        let temp = { ...createMedicineRequestList, ...preMed, selectedMed: [preMed.medName], rate: rate, period: 0, generic_id: preMed.genId, prods_id: preMed.id, unit: 0, timing: 0, }
        load.push(temp)
      })
      setPrescriptionId({ status: true, prescId: load[0]?.displayNo })
      setTempMedicine([...load])
      handleTotal()
    } catch (error) {
      handleError(error)
    }
  }
  const hanldeGetSelectedTemplateDetails = async (tempId: string) => {
    try {
      if (tempId != "0") {
        const tempResponse = await prescriptionApiService.getPrescriptionTemplateDetailsById(tempId, hospitalDisponsoryStoreId)
        setTemplateSelectedValue(tempResponse);
      }
    } catch (error) {
      handleError(error)
    }
  }
  const hanldeGetTemplateNameList = async () => {
    try {
      let tempNameResponse: any[] = await prescriptionApiService.getPrecriptionTemplateNameList(prescriptionTemplateId)
      if (tempNameResponse.length > 0) {
        tempNameResponse = tempNameResponse.sort((a, b) => String(a.templateName).toLocaleLowerCase() > String(b.templateName).toLocaleLowerCase() ? 1 : -1)
        setTemplateNameList(tempNameResponse)
        hanldeGetSelectedTemplateDetails(tempNameResponse[0].id)
      } else {
        setTemplateNameList([{ id: "0", templateName: "Template Is Empty" }]);
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleMapTemplate = () => {
    let load: any = []
    templateSelectedValue.forEach((preMed: any, i: any) => {
      let rate = (Number(preMed.quantity) * Number(preMed.mrpPrice)).toFixed(2)
      let temp = {}
      if (preMed.stock == 0) {
        temp = { ...createMedicineRequestList, ...preMed, selectedMed: [preMed.medName], rate: 0.00, period: 0, generic_id: preMed.genId, prods_id: preMed.id, unit: 1, timing: 0, itemHasError: 'less stock', quantity: 0 }
        toastErrorBounceDark('less stock')
      }
      else {
        temp = { ...createMedicineRequestList, ...preMed, selectedMed: [preMed.medName], rate: rate, period: 0, generic_id: preMed.genId, prods_id: preMed.id, unit: 1, timing: 0, itemHasError: '' }
      }
      load.push(temp)

    })
    setTempMedicine([...load])
    handleTotal()
  }
  const handleTotal = () => {
    try {
      let total: any = 0
      tempMedicine.map((med: any) => {
        if (med.rate > 0) {
          total = (Number(total) + Number(med.rate)).toFixed(2)
        }
      })
      console.log(tempMedicine);
      setTotal(total)
    } catch (error) {
      handleError(error)
    }
  }
 
  useEffect(() => {
    getUnits()

  }, [])
  const casesheet = "PRESCRIPTION ENTRY"
  return (
    <ClinicalLayout {...{casesheet}}>
      {/* <FormLabel className='heading mx-auto'>PRESCRIPTION ENTRY OF <span className="text-dark">{patientDetails?.fullName} - {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}
      {/* Header */}
      <Row className="py-1">
        <Col>
          <Row>
            <Col className='pt-3'>

            </Col>
          </Row>
          <Row className="row-cols-2 pt-3 mt-1 align-items-center">
            <Col className="typeaheadIndex">
            </Col>
            <Col>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="align-items-center">
            <Col>
              <Row className='justify-content-center align-items-center mb-2'>
                <Col className='fw-bold text-sart fs-5 text-success' >{PresNo ? PresNo : null}</Col>
                <Col >
                  <Button variant='dark' className='w-100' size='sm' title="View Templates" onClick={() => { hanldeGetTemplateNameList(); setShowPrescriptionTemplates(true) }}>TEMPLATES</Button>
                </Col>
                <Col >
                  <Button variant='dark' className='w-100' size='sm' title="Edit Prescription" onClick={handleEditPrescription} >EDIT PRESCRIPTION</Button>  {/*onClick={() => setShowEditPrescription(true)}*/}</Col>
              </Row>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col >
              <Row className="align-items-center">
                <Col >
                  <Row>
                    <Col className="px-0 text-end">

                    </Col>
                    <Col className="px-0 text-end">

                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="fw-bold align-items-center">
                    <Col className="text-end px-0 text-nowrap">ORDER TOTAL</Col>
                    <Col className='text-danger'>{total}</Col>
                  </Row>
                </Col>
                <Col >
                  {/* <Button variant='dark' className='w-100' size='sm' title="Previous Prescription" onClick={handlePreviousPrescription} >PRE. PRESCRIPTION</Button> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* main tabble */}
      <Row className="clinical-prescription-container d-block col text-start px-2" >
        <Table hover >
          <thead className="table-dark sticky-top font-size-12px" >
            <tr >
              <th>Sl.NO</th>
              <th>MEDICINE</th>
              <th>STOCK</th>
              <th>QTY-NUMBER</th>
              <th>RATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody >
            {
              tempMedicine.map((obj, iNo) => {
                return (
                  <tr key={iNo} className={obj?.itemHasError == "" ? "py-3" : "py-3  my-1 error-danger"}>
                    <td className=''>{iNo + 1}</td>
                    <td>
                      <AsyncTypeahead
                        className="min-w-200px typeahead-mark shadow-none my-1"
                        filterBy={() => true}
                        isLoading={false}
                        size='sm'
                        labelKey="medName"
                        minLength={0}
                        id={`medicine${iNo}`}
                        onSearch={(q) => handleMedicineSearch(q, obj, iNo)}
                        selected={obj?.selectedMed}
                        options={medicineNameListOption}
                        placeholder="MEDICINE NAME"
                        inputProps={{ className: "shadow-sm" }}
                        //onFocus={(e) => handleMedicineSearch(item.searchMedName, item, idx)}
                        // onKeyDown={async (e) => await handleMedicineOnKeyDown(e, idx, item)}
                        onChange={(selected: any[]) => handleMedicineSelect(selected, iNo, obj)}
                        flip={true}
                        // ref={(component) => item.component = component}
                        renderMenuItemChildren={(option: any, { text }) => (
                          <>
                            <Highlighter search={text}>{option.medName}</Highlighter>
                          </>
                        )}
                      />
                    </td>
                    <td>{obj?.stock}</td>
                    <td>
                      <Form.Control type='number' size='sm'
                        placeholder="QTY." className="w-75px"
                        name="duration"
                        value={obj?.quantity}
                        onChange={(event) => handleOnQtyChange(event, iNo, obj)}
                        autoComplete="off"
                        onKeyDown={(e) => (e.key == "ArrowUp" || e.key == "ArrowDown") ? e.preventDefault() : null}
                      />
                    </td>
                    <td>{obj?.rate}</td>
                    <td>
                      <Button variant="success" className="px-2 py-1 mx-1" title="Add Row" onClick={() => addMorePrescription(obj, iNo)}><FontAwesomeIcon icon={faPlus} /></Button>
                      <Button variant="danger" className="px-2 py-1 mx-1" title="Del Row" onClick={() => removePrescription(obj, iNo)}><FontAwesomeIcon icon={faTrash} /></Button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Row>
      {/* footer */}

      <Row className='py-2 row-cols-3 row-cols-lg-4 align-items-center border-top'>
        <Col className='row  justify-content-end'>
          {issave ?
            <Col xs="10">
              <Button variant='success' className='w-100 button_style' title="Save Prescription" onClick={handleSavePrescription} >SAVE PRESCRIPTION</Button>
            </Col> :
            <Col xs="10">
              <Button variant='primary' className='w-100 button_style' title="Update Prescription" onClick={handleUpdatePrescription} disabled={updateDisable}>UPDATE PRESCRIPTION</Button>
            </Col>
          }
        </Col>
        <Col className='row  justify-content-center'>
          <Col xs="10">
            <Button variant='warning' className="button_style w-100" onClick={refreshAll}>Refresh</Button>
          </Col>
        </Col>
      </Row>
      <EditPrescription
        show={showEditPrescription}
        onHide={() => { setShowEditPrescription(false) }}
        previousPrescriptionNameList={previousPrescriptionNameList}
        previousPrescriptionSelectedValue={previousPrescriptionSelectedValue}
        handlePreviousPrescrionSelected={handlePreviousPrescrionSelected}
        handleCurPresEdit={handleCurPresEdit}
      />
      <SavePreviewPrescription
        show={showSavePreviewPrescription}
        onHide={() => setShowSavePreviewPrescription(false)}
        savePrescriptionsData={savePrescriptionsData}
        isPrescriptionUpdated={prescriptionId}
        setIsPrescriptionUpdated={setPrescriptionId}
        setIsSave={setIsSave}
        setCommonDuration={setCommonDuration}
        patientDetails={patientDetails}
      />
      <PreviousPrescription
        show={showPreviousPrescription}
        onHide={() => { setShowPreviousPrescription(false) }}
        previousPrescriptionNameList={previousPrescriptionNameList}
        previousPrescriptionSelectedValue={previousPrescriptionSelectedValue}
        handlePreviousPrescrionSelected={handlePreviousPrescrionSelected}
        handlePresEdit={handlePresEdit}
      />
      <PrescriptionTemplates
        show={showPrescriptionTemplates}
        onHide={() => { setShowPrescriptionTemplates(false); setTemplateSelectedValue([]); }}
        handleError={handleError}
        templateNameList={templateNameList}
        templateSelectedValue={templateSelectedValue}
        hanldeGetSelectedTemplateDetails={hanldeGetSelectedTemplateDetails}
        handleMapTemplate={handleMapTemplate}
      />
    </ClinicalLayout>
  )
}

export default NursePrescription