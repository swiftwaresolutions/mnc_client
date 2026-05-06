import React, { useEffect, useState } from 'react'
import ClinicalLayout from '../../ClinicalLayout'
import { Button, Col, Container, FormLabel, Modal, Row, Tab, Tabs } from 'react-bootstrap'
import { RootState } from '../../../../state/store'
import { useDispatch, useSelector } from 'react-redux'
import Surgery from './components/Surgery'
import Procedure from './components/Procedure'
import { toastSuccessBounceDark } from '../../../../utils/toast'
import { diagnosis } from './data/SurgeryData'
import { SurgeryModel,surgicalModelSaveFormat } from './model/SurgeryModel'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { createSurigicalSurgonSaveFormat } from './model/SurgeryModel'
import { createSurigicalNurseFormat } from './model/SurgeryModel'
import { createSurigicalAssNurseFormat } from './model/SurgeryModel'
import { consultantSavaFormat } from './model/SurgeryModel'
import { AssConsultantSavaFormat } from './model/SurgeryModel'
import { SurgeryNamesaveFormat } from './model/SurgeryModel'
import { AxiosError } from 'axios'
import { errorHandling } from '../../../../error/state/error-handle-action'
import ClinicalNavigationButtons from '../../ClinicalNavigationButtons'
import PreviewPediatricCaseSheet from './components/preview-case-sheet'
import CreateTemplate from './components/create-template'
import SearchTemplate from './components/search-template'

const SurgeryCaseSheet = () => {

    const dispatch = useDispatch()

    const {clinicalCurrentIpPatient} = useSelector((state: RootState) => state.clinicalPersistReducer)

    const [isPreviousCaseSheet, setIsPreviousCaseSheet] = useState({ status: false, id: '' })

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()

    const [caseSheetStatus, setCaseSheetStatus] = useState({ savingCaseSheet: false, updatingCaseSheet: false })

    const [SurgeryTemproryData,SetSurgeryTemproryData]=useState<SurgeryModel>({...surgicalModelSaveFormat})

    const [nurseValue,setNurseValue]=useState<any[]>([{...createSurigicalNurseFormat}])

    const [assNurseValue,setAssNurseValue]=useState<any[]>([{...createSurigicalAssNurseFormat}])
        
    const [consultant,setConsultant]=useState<any[]>([{...consultantSavaFormat}])

    const [AssConsultant,setAssConsultant]=useState<any[]>([{...AssConsultantSavaFormat}])

    const [surgeryName,setsurgeryName]=useState<any[]>([{...SurgeryNamesaveFormat}])

    const [previewCaseSheetShow, setPreviewCaseSheetShow] = useState(false);

    const [savedCaseSheet, setSavedCaseSheet] = useState<any>({})

    const [createTemplateShow, setCreateTemplateShow] = useState(false);

    const [createTemplateId, setCreateTemplateId] = useState<any>(null);

    const [searchTemplateShow, setSearchTemplateShow] = useState(false);

    const [searchTemplateId, setSearchTemplateId] = useState<any>({ fieldName: "", id: null });


    const handleSurgeryData=(value:any,name:any)=>{
        SetSurgeryTemproryData({...SurgeryTemproryData,[name]:value})
    }
    const handleSavedPreviewCaseSheet = async () => {
        try {
            let previousCaseSheet = await getHandlePreviousCaseSheetResponse();
            if (previousCaseSheet) {
                setSavedCaseSheet(previousCaseSheet[previousCaseSheet.length - 1]);
            }
        } catch (error) {
            handleError(error);
        }
    };


    const saveSurgeryCaseSheet=async()=>{
        if (clinicalCurrentIpPatient.ipId) {
            let updatedConsultatant = [...consultant].map((row: any) => {
                row = { ...consultantSavaFormat, surgonId: row.selectedConsultant[0].id }
                delete row.selectedConsultant;
                return row;
            }).filter((row: any) => row.surgonId != 0)
            let updatedAssConsultatant = [...AssConsultant].map((row: any) => {
                row = { ...AssConsultantSavaFormat, surgonId: row.selectedConsultant[0].id }
                delete row.selectedConsultant;
                return row;
            }).filter((row: any) => row.surgonId != 0)

             let local ={ ...SurgeryTemproryData, patId: clinicalCurrentIpPatient.patientId, visitId: clinicalCurrentIpPatient.visitId, createSurigicalSurgonRequests: [...updatedConsultatant,...updatedAssConsultatant] ,createSurigicalNurseRequests:[...nurseValue,...assNurseValue],createSurgicalSurgeryRequests:[...surgeryName] }
             //console.log(local);
             let res = await caseSheetApiService.saveSurgeryCaseSheet(local);
            

              await handleSavedPreviewCaseSheet()
                 toastSuccessBounceDark("SurgeryCase Sheet Saved");
                 setCaseSheetStatus((pre: any) => ({ ...pre, savingCaseSheet: false }));
                 setIsPreviousCaseSheet({ status: true, id: res.id });
                setPreviewCaseSheetShow(true);
         }
    }
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    };
    const getHandlePreviousCaseSheetResponse = async () => {
        try {
            if (clinicalCurrentIpPatient.visitId) {
                return await caseSheetApiService.fetchSurgeryCaseSheetByVstId(clinicalCurrentIpPatient.visitId);
            }
        } catch (error) {
            handleError(error);
        }
    };
    const handlePreviousCaseSheet = async () => {
        try {
            let previousCaseSheet = await getHandlePreviousCaseSheetResponse();
            //console.log(previousCaseSheet);
          

            if (previousCaseSheet.length > 0) {
                
                previousCaseSheet = previousCaseSheet[previousCaseSheet.length - 1]
                //console.log(previousCaseSheet);

                if (previousCaseSheet.surgeryDataList.length>0) {
                    let sergeryData=previousCaseSheet.surgeryDataList
                    setsurgeryName([...sergeryData]);   
                }
                if (previousCaseSheet.surgeryNurseData.length>0) {
                    let sergeryNurse=[...previousCaseSheet.surgeryNurseData].filter((row:any)=>row.isAssNurse==0)
                    setNurseValue([...sergeryNurse]);   
                }
                if (previousCaseSheet.surgeryNurseData.length>0) {
                    let AssSergeryNurse=[...previousCaseSheet.surgeryNurseData].filter((row:any)=>row.isAssNurse==1)
                    setAssNurseValue([...AssSergeryNurse]);   
                }
                if (previousCaseSheet.surgerySurgonData.length>0) {
                    let consultantname=[...previousCaseSheet.surgerySurgonData].filter((row:any)=>row.isAssSurgon==0)
                    let prevConsultant = [...consultantname].map((Consultant: any) => {
                        Consultant = { ...consultantSavaFormat, id: Consultant.id, isAssSurgon: Consultant.isAssSurgon, selectedConsultant: [{ id: Consultant.surgonId, name: Consultant.name }] }
                        return Consultant
                    });
                   // console.log(prevConsultant);
                    setConsultant([...prevConsultant]);   
                }
                if (previousCaseSheet.surgerySurgonData.length>0) {
                    let Assconsultantname=[...previousCaseSheet.surgerySurgonData].filter((row:any)=>row.isAssSurgon==1)
                    let prevConsultant = [...Assconsultantname].map((Consultant: any) => {
                        Consultant = { ...consultantSavaFormat, id: Consultant.id, isAssSurgon: Consultant.isAssSurgon, selectedConsultant: [{ id: Consultant.surgonId, name: Consultant.name }] }
                       
                        return Consultant
                    });
                    setAssConsultant([...prevConsultant]);  
                }
                let preSurgereyDetails=previousCaseSheet
                        delete preSurgereyDetails.surgeryDataList
                        delete preSurgereyDetails.surgeryNurseData
                        delete preSurgereyDetails.surgerySurgonData

                        SetSurgeryTemproryData(preSurgereyDetails)
                setIsPreviousCaseSheet({ status: true, id: previousCaseSheet.id });
            }
        } catch (error) {
            handleError(error)
        }
    };
    const UpdateSurgeryCaseSheet = async () => {
        try {
            setCaseSheetStatus((pre: any) => ({ ...pre, updatingCaseSheet: true }));
            if (clinicalCurrentIpPatient.visitId && isPreviousCaseSheet.id) {
                let updatedConsultatant = [...consultant].map((row: any) => {
                    row = { ...consultantSavaFormat, surgonId: row.selectedConsultant[0].id }
                    delete row.selectedConsultant;
                    return row;
                }).filter((row: any) => row.surgonId != 0)
                let updatedAssConsultatant = [...AssConsultant].map((row: any) => {
                    row = { ...AssConsultantSavaFormat, surgonId: row.selectedConsultant[0].id }
                    delete row.selectedConsultant;
                    return row;
                }).filter((row: any) => row.surgonId != 0)
    
                 let local ={ ...SurgeryTemproryData, patId: clinicalCurrentIpPatient.patientId, visitId: clinicalCurrentIpPatient.visitId, createSurigicalSurgonRequests: [...updatedConsultatant,...updatedAssConsultatant] ,createSurigicalNurseRequests:[...nurseValue,...assNurseValue],createSurgicalSurgeryRequests:[...surgeryName] }
                 console.log(local);
                 let res = await caseSheetApiService.updateSurgeryCaseSheet(isPreviousCaseSheet.id,local);

                 await handleSavedPreviewCaseSheet();
                 toastSuccessBounceDark("Surgery Case Sheet Updated");
                 setCaseSheetStatus((pre: any) => ({ ...pre, updatingCaseSheet: false }));
                 setPreviewCaseSheetShow(true);
            }
        } catch (error: any) {
            handleError(error);
        }
    };
    const handleSearchTemplateClose = (templateDetail: any, id: any, fieldName: string) => {
        setSearchTemplateShow(false);
        SetSurgeryTemproryData((pre: any) => ({ ...pre, [fieldName]: templateDetail }))
    }
    const handleSearchTemplateOpen = (id: any, fieldName: string) => {
        setSearchTemplateShow(true);
        setSearchTemplateId({ id, fieldName });
    }
    const handleOpenCreateTemplate = (id: any) => {
        setCreateTemplateShow(true);
        setCreateTemplateId(id);
    };
    useEffect(() => {
        handlePreviousCaseSheet();
    }, []);
    const casesheet = "SURGERY CASESHEET"
  return (
    <>
        <ClinicalLayout {...{casesheet}}>
            {/* <FormLabel className='heading mx-auto'>SURGERY CASE SHEET ENTRY <span className="text-dark">{clinicalCurrentIpPatient?.fullName}/ {clinicalCurrentIpPatient?.displayNumber}  /{clinicalCurrentIpPatient?.age} / {clinicalCurrentIpPatient?.gender}</span></FormLabel> */}
            <Container fluid="lg" className='clinical-general-container overflow-auto d-flex text-start h-100 flex-column'>
             <Row className='h-100 overflow-auto'>
                <Col className='d-flex flex-column h-100'>
                    <Tabs
                        defaultActiveKey="Surgery"
                        id="generalCaseSheetId"
                        className="my-1 justify-content-evenly"
                    >
                        <Tab eventKey="Surgery" title="SURGERY" className='h-100'>
                           <Surgery
                           diagnosis={diagnosis}
                           SurgeryTemproryData={SurgeryTemproryData}
                           handleSurgeryData={handleSurgeryData}
                           setNurseValue={setNurseValue}
                           nurseValue={nurseValue}
                           assNurseValue={assNurseValue}
                           setAssNurseValue={setAssNurseValue}
                           consultant={consultant}
                           setConsultant={setConsultant}
                           AssConsultant={AssConsultant}
                           setAssConsultant={setAssConsultant}
                           surgeryName={surgeryName}
                           setsurgeryName={setsurgeryName}
                           />
                        </Tab>
                        <Tab eventKey="Current" title="PROCEDURE" className='h-100'>
                          <Procedure
                          handleSurgeryData={handleSurgeryData}
                          SurgeryTemproryData={SurgeryTemproryData}
                          handleSearchTemplateOpen={handleSearchTemplateOpen}
                          handleOpenCreateTemplate={handleOpenCreateTemplate}
                          />
                        </Tab>
                    </Tabs>
                </Col>
             </Row>
             <Row className=''>
                 <Col className='text-end my-2'>
                    {
                                isPreviousCaseSheet.status ? (
                                    <Button variant="primary" className="m-1" disabled={caseSheetStatus.updatingCaseSheet} onClick={UpdateSurgeryCaseSheet} >
                                        {caseSheetStatus.updatingCaseSheet ? 'Updating...' : 'Update'}
                                    </Button>
                                ) : (
                                    <Button variant="success" className="m-1" disabled={caseSheetStatus.savingCaseSheet}  onClick={saveSurgeryCaseSheet}  >
                                        {caseSheetStatus.savingCaseSheet ? 'Submitting...' : 'Save'}
                                    </Button>)
                      }
                 </Col>
            </Row>   
            </Container>
            <Modal
                    show={createTemplateShow}
                    onHide={() => setCreateTemplateShow(false)}
                    keyboard={false}
                    centered
                    size="lg"
                >
                    <Modal.Body className="p-0">
                        <CreateTemplate handleClose={() => setCreateTemplateShow(false)} tempId={createTemplateId} setCreateTemplateShow={setCreateTemplateShow} />
                    </Modal.Body>
                </Modal>

                {/* Search TEMPLATE */}

                <Modal
                    show={searchTemplateShow}
                    keyboard={false}
                    centered
                    onHide={() => setSearchTemplateShow(false)}
                    size="lg"
                >
                    <Modal.Body className="p-0">
                        <SearchTemplate handleClose={handleSearchTemplateClose} tempId={searchTemplateId.id} fieldName={searchTemplateId.fieldName} setSearchTemplateShow={setSearchTemplateShow} />
                    </Modal.Body>
                </Modal>
            <Modal show={previewCaseSheetShow} dialogClassName="modal-90w clinical-general-save-preview"
                    onHide={() => setPreviewCaseSheetShow(false)}
                    keyboard={false} size="xl">
                    <Modal.Header closeButton>
                        <h3 className='fw-bold'>SURGERY CASESHEET</h3>
                    </Modal.Header>
                    <Modal.Body className='overflow-auto flex-grow-1'>
                        <PreviewPediatricCaseSheet savedCaseSheet={savedCaseSheet} />
                    </Modal.Body>
                    <Modal.Footer className='justify-content-center'>
                        <ClinicalNavigationButtons />
                    </Modal.Footer>
                </Modal>
        </ClinicalLayout>
    </>
  )
}

export default SurgeryCaseSheet