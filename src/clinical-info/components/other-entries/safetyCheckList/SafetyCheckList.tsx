import React, { useEffect, useState } from 'react'
import ClinicalLayout from '../../ClinicalLayout'
import { Button, Col, Container, Form, FormLabel, Row, Tab, Tabs } from 'react-bootstrap'
import { RootState } from '../../../../state/store'
import { useDispatch, useSelector } from 'react-redux'
import BeforeInduction from './components/BeforeInduction'
import BeforeSkinInsection from './components/BeforeSkinInsection'
import BeforeOperation from './components/BeforeOperation'
import { SafetyCheckListModel, SafetyCheckListSaveFormat } from './model/SafetyCheckListModel'
import { AxiosError } from 'axios'
import { errorHandling } from '../../../../error/state/error-handle-action'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import SafetyChecklistEditModel from './components/SafetyChecklistEditModel'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import { ConsultantApiService } from '../../../../api/consultant/consultant-api-service'
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";


const SafetyCheckList = () => {
  const dispatch = useDispatch()
  const { clinicalCurrentOpPatient, clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)
  const [modalShow, setModalShow] = useState(false);
  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()
  const consultantApiService: ConsultantApiService = new ConsultantApiService()
  const [tempData, setTempData] = useState<SafetyCheckListModel>({ ...SafetyCheckListSaveFormat })
  const [ChklistData, setChklistData] = useState([])
  const [selectId, setSelectId] = useState(0)
  const [btnView, setBtnView] = useState({ save: 1 })
  const [Sergonvalue, SetSergonvalue] = useState<any>([]);

  console.log(Sergonvalue);
  
  const handleSafetyChecklist = (name: any, value: any) => {
    let val
    if (value == 'No' || value == 'Not applicable') {
      val = 0
    }
    else val = 1
    setTempData({ ...tempData, [name]: val })
  }
  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
      dispatch(errorHandling(error.message));
    } else {

    }
  };
  const handleSave = async () => {
    if (tempData.surgName != '') {
      if (tempData.docId != 0) {
        try {
          if (clinicalCurrentIpPatient.ipId) {
            console.log(tempData);
            const local = { ...tempData, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId }
            let res = await caseSheetApiService.saveSurgeryCheckList(local)
            if (res) {
              toastSuccessBounceDark("Surgery CheckList saved")
              setTempData({ ...SafetyCheckListSaveFormat })
            }

          }
        } catch (error) {
          handleError(error)
        }
      }
      else {
        toastErrorBounceDark("Select the Doctor Name");
      }

    }
    else {
      toastErrorBounceDark("Enter the Surgery Name");
    }


  }
  const handleUpdate = async () => {
    try {
      if (clinicalCurrentIpPatient.ipId) {
        const local = { ...tempData, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId }
        caseSheetApiService.updateSurgeryCheckList(selectId, local)
        toastSuccessBounceDark("Surgery CheckList Updated");
        setTempData({ ...SafetyCheckListSaveFormat })
        setSelectId(0)
        setBtnView({ save: 1 })
      }
    } catch (error) {
      handleError(error)
    }
  }
  const fetchNursingIo = async () => {
    if (clinicalCurrentIpPatient?.visitId) {
      try {
        const ChkLstDet = await caseSheetApiService.fetchSurgeryCheckListByVstId(clinicalCurrentIpPatient?.visitId)
        setChklistData(ChkLstDet);
      } catch (error) {
        handleError(error)
      }
    }
  }
  const handlePreviousChecklistEdit = () => {
    if (selectId != 0) {
      let EditData = ChklistData.filter((obj: any) => { return obj.id == selectId })

    // if(EditData[0]){
    //   let pvData:any=EditData[0]                      
    //   console.log(pvData?.docId);
    // }
      
      setTempData(EditData[0])
    }
  }
  const handleConsultantSearch = async (query: string) => {
    try {
      const medicineNameListResponse: any = await consultantApiService.getConsultantList(query);
      SetSergonvalue(medicineNameListResponse);
    } catch (error) {

    }
  };
  const handleDoc = (item: any) => {
    if (item[0]) {
      setTempData({ ...tempData, ['docId']: item[0].id })
    }
  }
  useEffect(() => {
    fetchNursingIo()
  }, [tempData])

  const casesheet = "SURGERY SAFETY CHECKLIST"
  return (
    <>
      <ClinicalLayout {...{casesheet}}>
        {/* <FormLabel className='heading mx-auto'>SURGERY SAFETY CHECKLIST<span className="text-dark">{clinicalCurrentIpPatient?.fullName} / {clinicalCurrentIpPatient?.displayNumber} / {clinicalCurrentIpPatient?.age} / {clinicalCurrentIpPatient?.gender}</span></FormLabel> */}
        <Container fluid="lg" className='clinical-general-container overflow-auto d-flex text-start h-100 flex-column'>
          <Row className='h-100 overflow-auto'>

            <Col className='d-flex flex-column h-100 p-3'>
              <Tabs
                defaultActiveKey="b-Anethesia"
                id="b-Anethesia"
                className="my-1 justify-content-evenly"
              >
                <Tab eventKey="b-Anethesia" title="BEFORE INDUCTION OF ANAESTHESIA" className='h-100'>
                  <BeforeInduction
                    handleSafetyChecklist={handleSafetyChecklist}
                    tempData={tempData}
                  />
                </Tab>
                <Tab eventKey="b-skinIcition" title="BEFORE SKIN INCISION" className='h-100' >
                  <BeforeSkinInsection
                    handleSafetyChecklist={handleSafetyChecklist}
                    tempData={tempData}
                  />
                </Tab>
                <Tab eventKey="b-opreationRoom" title="BEFORE PATIENT LEAVES OPERATING ROOM" className='h-100'>
                  <BeforeOperation
                    handleSafetyChecklist={handleSafetyChecklist}
                    tempData={tempData}
                  />
                </Tab>
              </Tabs>

            </Col>
          </Row>
          <Row className=''>
            <Col className='text-start my-2'>
              <Button variant="secondary" onClick={() => setModalShow(true)}> EDIT CHECKLIST </Button>
            </Col>
            <Col className='text-center my-2'>
              <Form.Group className="mb-3 general-case-sheet-input"   >
                <Form.Control
                  name='surgName'
                  id='surgName'
                  value={String(tempData.surgName)}
                  onChange={(e) => { setTempData({ ...tempData, [e.target.name]: e.target.value }) }}
                />
                <label className="fs-11px">Surgery Name</label>
              </Form.Group>

            </Col>
            <Col className='text-center my-2'>
              <AsyncTypeahead
                className="min-w-200px typeahead-mark"
                filterBy={() => true}
                isLoading={false}
                id='surgonName'
                labelKey="name"
                minLength={1}
                onSearch={() => true}
                onInputChange={handleConsultantSearch}
                options={Sergonvalue}
                placeholder="Surgeon Name"
                flip={true}
                onChange={(selectedItem) => {handleDoc(selectedItem)}}
                positionFixed={true}
                renderMenuItemChildren={(option: any, { text }) => (
                  <>
                    <Highlighter search={text}>{option.name}</Highlighter>
                  </>
                )}
              />

            </Col>
            <Col className='text-end my-2'>
              <Button variant="success" onClick={handleSave} className={`${btnView.save == 1 ? '' : 'd-none'}`}> SAVE </Button>
              <Button variant="primary" onClick={handleUpdate} className={`${btnView.save == 0 ? '' : 'd-none'}`}> Update </Button>
            </Col>
          </Row>
        </Container>

      </ClinicalLayout>
      <SafetyChecklistEditModel
        handlePreviousChecklistEdit={handlePreviousChecklistEdit}
        show={modalShow}
        onHide={() => { setModalShow(false); }}
        ChklistData={ChklistData}
        setSelectId={setSelectId}
        setBtnView={setBtnView}
      />

    </>
  )
}

export default SafetyCheckList