import React, { useEffect, useState } from 'react'
import ClinicalLayout from '../../ClinicalLayout'
import { Button,Col, Container, Form, FormLabel, Row, Tab, Tabs } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import NursingSheet from './components/NursingSheet'
import { NursingIoD, NursingIoSaveFormat } from './Model/NursingModel'
import NursingIoRecords from './components/NursingIoRecords'
import { storeClinicalCurrentIpPatient } from '../../../redux-store/clinicalPersistSlice'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import { AxiosError } from 'axios'
import { errorHandling } from '../../../../error/state/error-handle-action'
import { log } from 'console'

const NursingIo = () => {
    const dispatch = useDispatch()

    const { clinicalCurrentOpPatient, clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)
    const [tempNurseIo, setTempNurseIo] = useState<NursingIoD>({ ...NursingIoSaveFormat })
    const [NurseIoData, setNurseIoData] = useState([])
    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService()
    const [btnView, setBtnView] = useState({ save: 1 })
    const [modal, setModal] = useState(false);
    const [intCount, setintCount] = useState({ intotal: 0, outTotal: 0 })
    const [modalShow, setModalShow] = useState(false);
    const [selectData, setSelectData] = useState([])

    const handleNurseIo = (name: any, value: any) => {
        try {
            setTempNurseIo({ ...tempNurseIo, [name]: value })

        } catch (error) {
            handleError(error)
        }
    }
    const handleNurseIoIntegers = (name: any, value: any) => {
            try {
                setTempNurseIo({ ...tempNurseIo, [name]:value })
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
    const fetchNursingIo = async () => {
        if(clinicalCurrentIpPatient?.visitId){
            try {
                const ioDet = await caseSheetApiService.fetchNursingIoByVstId(clinicalCurrentIpPatient?.visitId)
                setNurseIoData(ioDet)
            } catch (error) {
                handleError(error)
            }
        }
    }
    const handleSave = async () => {
        try {
            if(tempNurseIo.nurseDtmIo!='0000-00-00 00:00:00'){
                if (clinicalCurrentIpPatient.ipId) {
                    const local = { ...tempNurseIo, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId }
                    let res = await caseSheetApiService.saveNursingIo(local);
                    if (res.id) {
                        toastSuccessBounceDark("Io Sheet Saved");
                        fetchNursingIo()
                        setTempNurseIo({ ...NursingIoSaveFormat })
                    }
                }
            }
            else{
                toastErrorBounceDark("Date and Time is Empty");
            }
          
        } catch (error) {
            handleError(error)
        }
    }
    const setPrint = () => {
        setBtnView({ save: 1 })
    }
    const setSave = () => {
        setBtnView({ save: 0 })

    }
    const handleInCount = () => {
        const oral = tempNurseIo?.oral
        const ivf = tempNurseIo?.ivf
        const ot = tempNurseIo?.inOther
        const x = Number(oral) + Number(ivf) + Number(ot)
        setTempNurseIo({ ...tempNurseIo, inTotal: x })
        setintCount({ ...intCount, 'intotal': x })
    }

    const handleOutCount = () => {
        const urine = tempNurseIo?.urine
        const drain = tempNurseIo?.drain
        const oth = tempNurseIo?.outOther
        const x = Number(urine) + Number(drain) + Number(oth)
        setTempNurseIo({ ...tempNurseIo, outTotal: x })
        setintCount({ ...intCount, 'outTotal': x })
    }
    const handleEditRecords = (selectId:any) => {       
        setTempNurseIo(NurseIoData.filter((obj:any)=>{return obj.id==selectId})[0])
        setBtnView({ save: 2 })
    }
    const handleUpdate=async()=>{
        try {
            if (clinicalCurrentIpPatient.ipId) {
                const local = { ...tempNurseIo, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId }
                 let res =await  caseSheetApiService.updateNursingIo(tempNurseIo.id,local)
               
                    toastSuccessBounceDark("Io Sheet Updated");
                    fetchNursingIo()
                    setTempNurseIo({ ...NursingIoSaveFormat })
                    setBtnView({save:1})
            }
        } catch (error) {
            handleError(error)
        }
      
    }
   const printRecords=()=>{    
        try {
            
            let printContents = document.getElementById('printablediv')?.innerHTML;
            let originalContents = document.body.innerHTML;

            if (printContents !== undefined) {
                document.body.innerHTML = printContents;
            } else {
                console.error("printContents is undefined");
                return; // Exit the function if printContents is undefined
            }
            window.print();
            document.body.innerHTML = originalContents;
        } catch (error) {
            console.log(error);
        }
        window.location.reload();
   
   }

    const toggle = () => setModal(!modal);
  
    useEffect(() => {
        fetchNursingIo()
    }, [])
    const casesheet = "NURSING IO SHEET"
    return (
        <>
            <ClinicalLayout {...{casesheet}}>
                {/* <FormLabel className='heading mx-auto'>NURSING IO SHEET ENTRY <span className="text-dark">{clinicalCurrentIpPatient?.fullName} / {clinicalCurrentIpPatient?.displayNumber} / {clinicalCurrentIpPatient?.age} / {clinicalCurrentIpPatient?.gender}</span></FormLabel> */}
                <Container fluid="lg" className='clinical-general-container overflow-auto d-flex text-start h-100 flex-column'>
                    <Row className='h-100 overflow-auto'>

                        <Col className='d-flex flex-column h-100 p-3'>
                            <Tabs
                                defaultActiveKey="ioSheet"

                                className="my-1 justify-content-evenly"
                            >

                                <Tab eventKey="ioSheet" title="IO SHEET" className='h-100' onExit={()=>{setSave();fetchNursingIo()}} >
                                    <NursingSheet
                                        setTempNurseIo={setTempNurseIo}
                                        handleNurseIo={handleNurseIo}
                                        tempNurseIo={tempNurseIo}
                                        NurseIoData={NurseIoData}
                                        setBtnView={setBtnView}
                                        handleInCount={handleInCount}
                                        handleOutCount={handleOutCount}
                                        handleEditRecords={handleEditRecords}
                                        intCount={intCount}
                                        setModalShow={setModalShow}
                                        modalShow={modalShow}
                                        setSelectData={setSelectData}
                                        selectData={selectData}
                                        handleNurseIoIntegers={handleNurseIoIntegers}
                                    />
                                </Tab>
                                <Tab eventKey="rocords" title="IO RECORDS" className='h-100' onExit={()=>{setPrint();fetchNursingIo();setTempNurseIo({ ...NursingIoSaveFormat });setintCount({ intotal: 0, outTotal: 0 })}}>
                                    <NursingIoRecords
                                        NurseIoData={NurseIoData}
                                        clinicalCurrentIpPatient={clinicalCurrentIpPatient}
                                    />
                                </Tab>
                            </Tabs>

                        </Col>
                    </Row>
                    <Row className=''>
                        <Col className='text-end my-2'>
                            <Button variant="primary" className={`m-1 ${btnView?.save == 0 ? '' : 'd-none'}`} onClick={printRecords} > PRINT </Button>
                            <Button variant="success" className={`m-1 ${btnView?.save == 1 ? '' : 'd-none'}`} onClick={handleSave}> Save </Button>
                            <Button variant="primary" className={`m-1 ${btnView?.save == 2 ? '' : 'd-none'}`} onClick={handleUpdate}> Update </Button>
                        </Col>
                    </Row>
                </Container>
            </ClinicalLayout>
        </>
    )
}

export default NursingIo