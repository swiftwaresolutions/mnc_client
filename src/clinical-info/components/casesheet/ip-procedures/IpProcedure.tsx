import React, { Fragment, useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormLabel, Row, Tab, Tabs } from 'react-bootstrap'
import CommonLayout from '../../ClinicalLayout'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { clearErrorHandling, errorHandling } from '../../../../error/state/error-handle-action'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { toastSuccessBounceDark } from '../../../../utils/toast'
import IpVitals from './ip-vitals/IpVitals'
import { AxiosError } from 'axios'

const progressNotesData = [
  {
      id: "4",
      name: "PROGRESS NOTES",
      fieldName: "progressNotes",
  },
]

const progressPlanData = [
  {
    id: "5",
    name: "PLAN",
    fieldName:"progressPlan"
  }
]

const IpProcedure = () => {

  const ipProcedureModel={
    patientId: 0,
    visitId: 0,
    ipId: 0,
    consultantId: 0,
    datetime: "0000-00-00 00:00",
    temperature: "",
    pulse: "",
    rr: "",
    bp: "",
    spo2: "",
    height: "",
    weight: "",
    bmi: "",
    progressNotes: "",
    progressPlan: "",
    isCancelled: 0
  }

  const dispatch = useDispatch()

  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();

  const [SavedCaseSheet, setSavedCaseSheet] = useState<{}>({})
  const [previewCaseSheetShow, setPreviewCaseSheetShow] = useState(false);

  const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
  const [isPreviousCaseSheet, setIsPreviousCaseSheet] = useState({ status: false, id: '' })

  const [isLoading, setIsLoading] = useState(false);

  let patientDetails: any
    let ipId
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipNo
    }
    const loginUser = useSelector((s: RootState) => s.loginData)

    const loginUsers = async () => {
      console.log(patientDetails);
    }

  const [temporaryIpProcedure,setTemporaryIpProcedure] =  useState<any>({ ...ipProcedureModel })


  const handleInputChange = (value: string, fieldName: string) => {
    if (fieldName == 'height' || fieldName == "weight") {
        value = hanldeNumberInputZero(value)

        setTemporaryIpProcedure((pre: any) => {
            if (fieldName == "height") {
                let height = Number(((Number(value) / 100) * (Number(value) / 100)).toFixed(2))
                pre.bmi = (Number(pre.weight) / (height)).toFixed(2)
            } else if (fieldName == "weight") {
                let weight = Number(value)
                pre.bmi = (Number(weight) / Number(((Number(pre.height) / 100) * (Number(pre.height) / 100)).toFixed(2))).toFixed(2)
            }
            if (pre.bmi == "NaN" || pre.bmi == "Infinity") {
                pre.bmi = 0
            }
            return { ...pre, [fieldName]: value }
        })
    } else {
      setTemporaryIpProcedure((pre: any) => ({ ...pre, [fieldName]: value }))
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
  }

  const handlePreviewCaseSheetopen = () => setPreviewCaseSheetShow(true);

  const handlePreviewCaseSheetClose = () => {
    setPreviewCaseSheetShow(false);
}

  const getHandlePreviousCaseSheetResponse = async () => {
    try {
        if (patientDetails.visitId) {
            return await caseSheetApiService.fetchIpProcedureCaseSheetByVstId(patientDetails.visitId)
        }
    } catch (error) {
        // handleError(error)
    }
}

const openPreviewCaseSheet = () => {
  handlePreviewCaseSheetopen();
}

  const saveIpProcedureCaseSheetData = async () => {
   
    setIsLoading(true)
    try{
      if(patientDetails.visitId){
        if(temporaryIpProcedure.datetime =="0000-00-00 00:00"){
          alert("ENTER VALID DATE.")
        }
        else{
          console.log(temporaryIpProcedure.datetime)
          let dateTimeArr=temporaryIpProcedure.datetime.split('T')
          let consultantId = loginUser.id;
          let local = {...temporaryIpProcedure, patientId: patientDetails.patientId,ipId: patientDetails.ipId, visitId: patientDetails.visitId,consultantId: consultantId,date:dateTimeArr[0],time:`${dateTimeArr[1]}:00`}                                          
          delete local.datetime;
          let res = await caseSheetApiService.saveIpProcedureCaseSheet({...local});
          await handleSavedCaseSheet()
          toastSuccessBounceDark("Ip Procedure Case Sheet Saved")
          //openPreviewCaseSheet();
          setIsPreviousCaseSheet({ status: true, id: res.id })
        }
      }
    }
    catch(error: any){
      handleError(error)
    }
    finally{
      setIsLoading(false)
    }
    
  }

  const updateIpProcedureCaseSheetData = async () => {
    setIsLoading(true)
    try{
      console.log("updateButtonClicked..!"+isPreviousCaseSheet.id)
      console.log("progressNotes :"+ipProcedureModel.progressNotes)
      if(patientDetails.visitId && isPreviousCaseSheet.id){
        if(temporaryIpProcedure.datetime =="0000-00-00 00:00"){
          alert("Entry valid date.")
        }
        else{
        let dateTimeArr=temporaryIpProcedure.datetime.split('T')
        let consultantId = loginUser.id;
        let local = {...temporaryIpProcedure, patientId: patientDetails.patientId,ipId: patientDetails.ipId, visitId: patientDetails.visitId,consultantId: consultantId,date:dateTimeArr[0],time:`${dateTimeArr[1]}:00`}                                          
        delete local.datetime;
        console.log("previouscasesheet id : "+isPreviousCaseSheet.id);
        let res = await caseSheetApiService.updateIpProcedureCaseSheet(isPreviousCaseSheet.id, {...local});
        await handleSavedCaseSheet()
        toastSuccessBounceDark("Ip Procedure Case Sheet Updated")
        //openPreviewCaseSheet();
        //setIsPreviousCaseSheet({ status: true, id: res.id })
      }
      }
    }
    catch(error: any){
      handleError(error)
    }
    finally{
      setIsLoading(false)
    }
  }
//previous Casesheet//
  const handlePreviousCaseSheet = async () => {
    try {
        let previousCaseSheet1 = await getHandlePreviousCaseSheetResponse()
        let previousCaseSheet = [...previousCaseSheet1].reverse()[0]
        if (previousCaseSheet.data.length > 0) {

            previousCaseSheet = await previousCaseSheet.data[previousCaseSheet.data.length - 1]


            setTemporaryIpProcedure(previousCaseSheet);
            setIsPreviousCaseSheet({ status: true, id: previousCaseSheet.id })
        }
    } catch (error) {

    }
}

  const handleSavedCaseSheet = async () => {
    try {
        let previousCaseSheet = await getHandlePreviousCaseSheetResponse()
        let lastDetails = [...previousCaseSheet].reverse()[0]
        console.log("savedcasesheet = "+lastDetails.value())
        if (lastDetails.status == true) {
            setSavedCaseSheet(lastDetails.data[lastDetails?.data?.length - 1]);
            //setTemporaryCaseSheet(previousCaseSheet.data[previousCaseSheet.data.length - 1]);
            //createComplaintDetailsRequestListModel

        }
    } catch (error) {
        handleError(error)
    }
}

  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
        dispatch(errorHandling(error.message));
    } else {

    }
}
const fetchPrevVitalsByVisitId = async () => {
  try {
      let prevVitalsResponse = await caseSheetApiService.fetchIpProcedureCaseSheetByVstId(`${patientDetails.visitId}`)
      if ([...prevVitalsResponse].length != 0) {
          prevVitalsResponse = [...prevVitalsResponse].reverse()[0]
          let date1 = prevVitalsResponse.date
          let time1 = prevVitalsResponse.time.slice(0, -3)
          let datetime = date1.concat("T",time1)
          delete prevVitalsResponse.vstId
          delete prevVitalsResponse.patId
          delete prevVitalsResponse.date
          delete prevVitalsResponse.time
          setIsPreviousCaseSheet({status: true, id: prevVitalsResponse.id})
          delete prevVitalsResponse.id
          setTemporaryIpProcedure((pre: any) => ({ ...pre, ...prevVitalsResponse,datetime: datetime }));
      }
  } catch (error) {

  }
}

const refresh = () => {
  setTemporaryIpProcedure({ ...ipProcedureModel })
  setIsPreviousCaseSheet({ status: false, id: '' })
}

const init = async () => {
  //console.log("initStatus : "+isPreviousCaseSheet.status)
  console.log("initId : "+temporaryIpProcedure.datetime)
  await handlePreviousCaseSheet()
  fetchPrevVitalsByVisitId()
}
useEffect(() => {
  init()
  return () => {
      dispatch(clearErrorHandling())
  }
}, []);
const casesheet = "IP PROCEDURE"
  
  return (
    <Fragment>
      <CommonLayout {...{casesheet}}>
        {/* <FormLabel className='heading mx-auto'>IP PROCEDURE OF <span className="text-dark">{patientDetails?.fullName} - {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}
        <Container fluid="lg" className='clinical-general-container overflow-auto d-flex  h-100 flex-column'>
          <Row className='h-100 overflow-auto'>
            <Col className='d-flex flex-column h-100'>
              <Tabs
                defaultActiveKey="ipVitals"
                id="generalCaseSheetId"
                className="mb-2 justify-content-evenly"
              >
                  <Tab eventKey="ipVitals" title={"Ip_Vitals & Progress"} className='h-100'>
                    <IpVitals
                      progressNotesData = {progressNotesData}
                      progressPlanData = {progressPlanData}
                      handleInputChange = {handleInputChange}
                      temporaryIpProcedure = {temporaryIpProcedure}
                    />
                  </Tab>
              </Tabs>
            </Col>
          </Row>
          
          <Row className='d-flex justify-content-center'>
            <Col>
              <Row className='my-2 d-flex justify-content-end'>
                <Col md={12} className="my-2 general-case-sheet-input">
                  CLICK <b className='text-primary'>REFRESH </b> FOR NEW ENTRY..!
                </Col>
              </Row>
            </Col>
            <Col>
              <Row className='my-2 d-flex justify-content-end'>
                <Col md={6} className="my-2 general-case-sheet-input">
                  <Form.Group>
                    <Form.Control
                    value={temporaryIpProcedure["datetime"]=="0000-00-00 00:00:00"?"":temporaryIpProcedure.datetime}
                    onChange={e => { handleInputChange(e.target.value, "datetime") }}
                    placeholder=""
                    type="datetime-local"
                    />
                    <label className="font-size-11px">ENTER DATE</label>
                  </Form.Group>
                </Col>
                <Col className='row  justify-content-center'>
                  <Col xs="10">
                      <Button variant='warning' className="button_style w-100" onClick={() => refresh()}>Refresh</Button>
                  </Col>
                </Col>
              </Row>
            </Col>
            <Col className='text-end my-2'>
            {isPreviousCaseSheet.status ? (
              <Button 
                variant="primary" 
                className="m-1" 
                onClick={updateIpProcedureCaseSheetData}
                disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
               ) : (
              <Button 
              variant="success" 
              className="m-1"
              onClick ={saveIpProcedureCaseSheetData}
              disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Save'}
              </Button>)
              }
            </Col>
          </Row>
        </Container>

      </CommonLayout>
    </Fragment>
  )
}

export default IpProcedure