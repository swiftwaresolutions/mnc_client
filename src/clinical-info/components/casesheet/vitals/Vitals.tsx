import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormLabel, Row } from 'react-bootstrap'
import ClinicalLayout from '../../ClinicalLayout'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { clearErrorHandling } from '../../../../error/state/error-handle-action'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { toastSuccessBounceDark } from '../../../../utils/toast'

const vitalData = [
  { name: "TEMPERATURE", fieldName: "temperature", inputType: "text", unit : "°F",placeHolder : "°F" },
  { name: "PULSE", fieldName: "pulse", inputType: "text", unit : "per min", placeHolder : "per min" },
  { name: "RR", fieldName: "rr", inputType: "text", unit : "per min", placeHolder : "per min" },
  // BP will be rendered as two inputs (Systole/Diastole) below
  { name: "SPO2", fieldName: "spo2", inputType: "text", unit : "%", placeHolder : "%" },
  { name: "GRBS", fieldName: "grbs", inputType: "text", unit : "mg/dL", placeHolder : "mg/dL" },
  { name: "HEIGHT", fieldName: "height", inputType: "number", unit : "cms", placeHolder : "cms" },
  { name: "WEIGHT", fieldName: "weight", inputType: "number", unit : "kgs", placeHolder : "kgs" },
  { name: "BMI", fieldName: "bmi", inputType: "text" }
]

const vitalModel = {
  patId: 0,
  vstId: 0,
  temperature: "",
  // Pulse remains a single field
  pulse: "",
  // BP split in UI; API expects combined `bp` string like "120/80"
  bp: "",
  bpSystole: "",
  bpDiastole: "",
  rr: "",
  spo2: "",
  grbs: "",
  height: 0,
  weight: 0,
  bmi: 0,
  datetime: ""
}

const Vitals = () => {

  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()

  const dispatch = useDispatch()

  // const {clinicalCurrentOpPatient} = useSelector((state: RootState) => state.clinicalPersistReducer)

  const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)

  const [tempVitals, setTempVitals] = useState<any>({ ...vitalModel })

  const [vitalsStatus, setVitalsStatus] = useState<any>({ savingVitals: false, updatingVitals: false })

  const [isPrevVitals, setIsPrevVitals] = useState<any>({ status: false, id: "" })
  const [prevVitalsList, setPrevVitalsList] = useState<any[]>([])
  const [selectedPrevId, setSelectedPrevId] = useState<string>("")

  let patientDetails: any;
    let ipId: number;
    const caseSheetType = 1
    // const docId = userId
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }


  const handleVitalsOnChange = (value: string, fieldName: string) => {
    if (fieldName === 'height' || fieldName === 'weight') {
      const cleaned = hanldeNumberInputZero(value)
      setTempVitals((prev: any) => {
        const next = { ...prev, [fieldName]: cleaned }
        const heightNum = Number(next.height) || 0
        const weightNum = Number(next.weight) || 0
        const heightMetersSq = heightNum > 0 ? Math.pow(heightNum / 100, 2) : 0
        const bmi = heightMetersSq > 0 ? Number((weightNum / heightMetersSq).toFixed(2)) : 0
        return { ...next, bmi }
      })
    } else {
      setTempVitals((prev: any) => ({ ...prev, [fieldName]: value }))
    }
  }

  const hanldeNumberInputZero = (value: string) => {
    if (value.length > 1 && value[0] == "0") {
      value = value.slice(1, value.length)
    } else if (!value) {
      value = "0"
    } else {
      value = value
    }
    return value
  };

  const fetchPatientHeight = async () => {
    await caseSheetApiService.fetchPatientHeight(clinicalCurrentOpPatient.patientId)
    .then((res : any) => {
      if (res && res.length > 0) {
        setTempVitals((pre : any) => { return { ...pre, height : res[0].height}})
      }
    }).catch((error : any) => {console.error("Error fetching patient Height : ", error )})
  }

  const fetchPrevVitalsByVisitId = async () => {
    try {
      let prevVitalsResponse = await caseSheetApiService.fetchOpVitalsByVstId(`${clinicalCurrentOpPatient.visitId}`)
      if (prevVitalsResponse && prevVitalsResponse.length > 0) {
        // keep full list for selector
        setPrevVitalsList(prevVitalsResponse)
        // pick the first (assumed latest) as default selection
        const first = prevVitalsResponse[0]
        setIsPrevVitals({ status: true, id: first.id })
        setSelectedPrevId(first.id)
        // remove id when populating form
        const { id, ...rest } = first
        // split bp into systole/diastole if formatted with '/'
        let bpSystole = ""
        let bpDiastole = ""
        if (rest.bp && typeof rest.bp === 'string' && rest.bp.includes('/')) {
          const parts = rest.bp.split('/')
          bpSystole = parts[0] ?? ""
          bpDiastole = parts[1] ?? ""
        } else if (rest.bp) {
          bpSystole = String(rest.bp)
          bpDiastole = ""
        }

        setTempVitals({ ...rest, bpSystole, bpDiastole })
      } else {
        fetchPatientHeight()
      }
    } catch (error) {
      console.error("Error fetching prev vitals:", error)
    }
  }

  const saveVitals = async () => {
    try {
      setVitalsStatus((pre: any) => ({ ...pre, savingVitals: true }))
      // construct payload: combine bp systole/diastole into bp string
  const combinedBp = `${tempVitals.bpSystole ?? ''}${(tempVitals.bpSystole && tempVitals.bpDiastole) ? '/' : (tempVitals.bpDiastole ? '/' : '')}${tempVitals.bpDiastole ?? ''}`.replace(/^\//, '')
      let temp = { 
        ...tempVitals, 
        patId: clinicalCurrentOpPatient.patientId, 
        vstId: clinicalCurrentOpPatient.visitId,
        bp: combinedBp
      }
      // ensure numeric types for height/weight/bmi if API expects numbers
      temp.height = Number(temp.height) || 0
      temp.weight = Number(temp.weight) || 0
      temp.bmi = Number(temp.bmi) || 0

      let savedRes = await caseSheetApiService.saveOpVitals(temp)
      setIsPrevVitals({ status: true, id: savedRes.id })
      toastSuccessBounceDark("Vitals Saved")
      await fetchPrevVitalsByVisitId()
    } catch (error) {
      console.log(error)
    } finally {
      setVitalsStatus((pre: any) => ({ ...pre, savingVitals: false }))
    }
  };

  const updateVitals = async () => {
    try {
      if (isPrevVitals.status && isPrevVitals.id != "") {
        setVitalsStatus((pre: any) => ({ ...pre, updatingVitals: true }));
  const combinedBp = `${tempVitals.bpSystole ?? ''}${(tempVitals.bpSystole && tempVitals.bpDiastole) ? '/' : (tempVitals.bpDiastole ? '/' : '')}${tempVitals.bpDiastole ?? ''}`.replace(/^\//, '')
        let temp = { ...tempVitals, patId: clinicalCurrentOpPatient.patientId, vstId: clinicalCurrentOpPatient.visitId, bp: combinedBp };
        temp.height = Number(temp.height) || 0
        temp.weight = Number(temp.weight) || 0
        temp.bmi = Number(temp.bmi) || 0
        await caseSheetApiService.updateOPVitals(`${isPrevVitals.id}`, temp);
        toastSuccessBounceDark("Vitals Updated");
        fetchPrevVitalsByVisitId();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setVitalsStatus((pre: any) => ({ ...pre, updatingVitals: false }));
    }
  };

  useEffect(() => {
    fetchPrevVitalsByVisitId()
    return () => {
      dispatch(clearErrorHandling())
    }
  }, [])

  const casesheet = "VITALS SHEET"
  return (
    <>
      <ClinicalLayout {...{casesheet}}>
        {/* <FormLabel className='heading mx-auto'>PEDIATRIC CASE SHEET ENTRY <span className="text-dark">{clinicalCurrentOpPatient?.fullName} / {clinicalCurrentOpPatient?.displayNumber} / {clinicalCurrentOpPatient?.age} / {clinicalCurrentOpPatient?.gender}</span></FormLabel> */}
        <Container fluid="lg" className='clinical-general-container overflow-auto d-flex h-100 flex-column'>
          <Row className='h-100 justify-content-center overflow-auto my-3'>
            <Col className='pt-3 border rounded overflow-auto d-flex flex-column justify-content-center' md="10" lg="8" xl="5" >
              {/* Selector for previous vitals and New Entry */}
              <Row className='py-2 align-items-center'>
                <Col className='fw-bold' md ={3}>All Entries</Col>
                <Col className='px-5 d-flex gap-2'>
                  <Form.Select size='sm' value={selectedPrevId} onChange={(e) => {
                    const id = e.target.value
                    setSelectedPrevId(id)
                    if (!id) return
                    const found = prevVitalsList.find(p => String(p.id) === String(id))
                    if (found) {
                      const { id: _id, ...rest } = found
                      let bpSystole = ""
                      let bpDiastole = ""
                      if (rest.bp && typeof rest.bp === 'string' && rest.bp.includes('/')) {
                        const parts = rest.bp.split('/')
                        bpSystole = parts[0] ?? ""
                        bpDiastole = parts[1] ?? ""
                      } else if (rest.bp) {
                        bpSystole = String(rest.bp)
                        bpDiastole = ""
                      }
                      setTempVitals({ ...rest, bpSystole, bpDiastole })
                      setIsPrevVitals({ status: true, id: found.id })
                    }
                  }}>
                    <option value="">Select previous or choose New Entry</option>
                    {prevVitalsList.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.datetime ? `Id : ${p.id} Date :  ${p.datetime}` : `Entry ${p.id}`}</option>
                    ))}
                  </Form.Select>
                  <Button variant="secondary" size='sm' onClick={() => {
                    // new entry: reset form and fetch height
                    setTempVitals({ ...vitalModel })
                    setIsPrevVitals({ status: false, id: "" })
                    setSelectedPrevId("")
                    fetchPatientHeight()
                  }}>Add New</Button>
                </Col>
              </Row>

               <Row className='py-3  row-cols-1 row-cols-sm-2 align-items-center'>
                <Col className='fw-bold'>BP  (mmHg)</Col>
                <Col className='px-5 d-flex gap-2'>
                  <Form.Control
                    value={tempVitals.bpSystole}
                    type="text"
                    placeholder="Systole"
                    onChange={(e) => handleVitalsOnChange(e.target.value, 'bpSystole')}
                  />
                  <span className="align-self-center">/</span>
                  <Form.Control
                    value={tempVitals.bpDiastole}
                    type="text"
                    placeholder="Diastole"
                    onChange={(e) => handleVitalsOnChange(e.target.value, 'bpDiastole')}
                  />
                </Col>
              </Row>
              {
                vitalData.map((item: any, idx: number) => {
                  return (
                    <Row className='py-3  row-cols-1 row-cols-sm-2 align-items-center' key={idx}>
                      <Col className='fw-bold' >{item.name} {item.unit && `(${item.unit})`}</Col>
                      <Col className='px-5'>
                        <Form.Control
                          value={tempVitals[item.fieldName]}
                          type={item.inputType}
                          placeholder={item.placeHolder ? item.placeHolder : ""}
                          onChange={(e) => handleVitalsOnChange(e.target.value, item.fieldName)}
                          disabled={item.fieldName == "bmi"}
                        />
                      </Col>
                    </Row>
                  )
                })
              }

              {/* BP row (Systole / Diastole) */}
             

            </Col>
          </Row>
          <Row className='border-top'>
            <Col className='text-end my-2'>
              {
                isPrevVitals.status ? (

                  <Button variant="primary" className="m-1" disabled={vitalsStatus.updatingVitals} onClick={updateVitals}>
                    {vitalsStatus.updatingVitals ? 'Updating...' : 'Update'}
                  </Button>
                ) : (
                  <Button variant="success" className="m-1" disabled={vitalsStatus.savingVitals} onClick={saveVitals}>
                    {vitalsStatus.savingVitals ? 'Submitting...' : 'Save'}
                  </Button>)
              }
            </Col>
          </Row>
        </Container>
      </ClinicalLayout>
    </>
  )
}

export default Vitals