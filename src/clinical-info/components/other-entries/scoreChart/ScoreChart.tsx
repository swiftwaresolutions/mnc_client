import React, { useEffect, useState } from 'react'
import ClinicalLayout from '../../ClinicalLayout';
import { Button, Col, Container, Form, FormLabel, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { ScoreSheetitems } from './data/ScoreChartData';
import { ScoreChartModel, ScoreChartSaveFormat } from './Model/ScoreChartModel';
import { AxiosError } from 'axios';
import { errorHandling } from '../../../../error/state/error-handle-action';
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service';
import ScoreChartEditModel from './components/ScoreChartEditModel';

const ScoreChart = () => {
    const { clinicalCurrentOpPatient, clinicalCurrentIpPatient } = useSelector((state: RootState) => state.clinicalPersistReducer)
    const [modalShow, setModalShow] = useState(false);
    const [btnView,setBtnView]=useState({save:1})
    const [selectId, setSelectId] = useState(0)
    const loginData = useSelector((state: any) => state.loginData)
    const dispatch = useDispatch()
    const caseSheetApiService = new CaseSheetApiService()

    const [tempScoreChart, setTempScoreChart] = useState<any>({ ...ScoreChartSaveFormat })
    const [Score, setScore] = useState()
    const [prevScoreChart, setPrevScoreChart] = useState([])

    const handleScore = (obj: any, val: number) => {
        setTempScoreChart({ ...tempScoreChart, [obj.FeildName]: val })
    }
    const handleDate = (e: any) => {
        setTempScoreChart({ ...tempScoreChart, [e.target.name]: e.target.value })
    }
    const calculate = () => {
        const total = tempScoreChart?.respiration + tempScoreChart?.saturation + tempScoreChart?.conscious + tempScoreChart?.activity
        setScore(total)
    }
    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    };
    const fetchScoreChart = async () => {
        try {
            if (clinicalCurrentIpPatient.visitId) {
                let res = await caseSheetApiService.fetchAldreteScoreChartByVstId(clinicalCurrentIpPatient?.visitId)
                if (res) {
                    setPrevScoreChart(res)
                }

            }
        } catch (error) {
            handleError(error)
        }
    }
    const handlePreviousScoreChart = () => {
        if(selectId!=0){
            setTempScoreChart(prevScoreChart.filter((obj:any)=>{ return(obj.id==selectId) })[0])
            setBtnView({save:0})
        } 
    }
    const handleSave = async () => {
        if (tempScoreChart.dtm != '') {
            try {
                if (clinicalCurrentIpPatient.ipId) {
                    const local = { ...tempScoreChart, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId, userId: loginData.id }
                    let res = await caseSheetApiService.saveAldreteScoreChart(local)
                    if (res) {
                        toastSuccessBounceDark("Surgery CheckList saved")
                        setTempScoreChart({ ...ScoreChartSaveFormat })
                    }
                }
            } catch (error) {
                handleError(error)
            }
        }
        else {
            toastErrorBounceDark("Enter the Date");
        }
    }
    const handleUpdate = async () => {
        try {
          if (clinicalCurrentIpPatient.ipId) {
            const local = { ...tempScoreChart, patId: clinicalCurrentIpPatient?.displayNumber, visitId: clinicalCurrentIpPatient?.visitId, ipId: clinicalCurrentIpPatient?.ipId }
            caseSheetApiService.updateAldreteScoreChart(selectId,local)
            toastSuccessBounceDark("Surgery Score chart Updated");
            setTempScoreChart({...ScoreChartSaveFormat})
            setSelectId(0)
            setBtnView({save:1})
          }
        } catch (error) {
          handleError(error)
        }
      }
    useEffect(() => {
        calculate()
    }, [tempScoreChart])

    const casesheet = ">MODIFIED ALDRETE SCORE CHART"
    return (
        <>
            <ClinicalLayout {...{casesheet}}>
                {/* <FormLabel className='heading mx-auto'>MODIFIED ALDRETE SCORE CHART <span className="text-dark">{clinicalCurrentIpPatient?.fullName} / {clinicalCurrentIpPatient?.displayNumber} / {clinicalCurrentIpPatient?.age} / {clinicalCurrentIpPatient?.gender}</span></FormLabel> */}
                <Container fluid="lg" className='clinical-general-container overflow-auto d-flex text-start h-100 flex-column'>
                    <Row className='h-100 overflow-auto'>
                        <Col className='d-flex flex-column h-100 p-3'>
                            <Row className='fw-bold justify-content-center text-center'> <Col md={9} className='border border-secondary p-2 mb-3'><p>This score is designed to assess a patient's transition from discontinuation of anaesthesia to refum of consciousness, adequate respiration, protective reflexes & motor function</p></Col></Row>
                            <Table>
                                <thead className='text-center'>
                                    <tr>
                                        <th className='text-left'>Parameters</th>
                                        <th>2</th>
                                        <th>1</th>
                                        <th>0</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ScoreSheetitems.map((obj: any, idx: number) => {
                                            return (
                                                <tr key={idx + 1}>
                                                    <td>{`${obj.Para}`}</td>
                                                    <td><Button size='sm' variant="outline-info" onClick={(e: any) => { handleScore(obj, 2) }}>{obj.scoreF}</Button></td>
                                                    <td><Button size='sm' variant="outline-warning" onClick={(e: any) => { handleScore(obj, 1) }}>{obj.scoreS}</Button></td>
                                                    <td><Button size='sm' variant="outline-danger" onClick={(e: any) => { handleScore(obj, 0) }}>{obj.scoreT}</Button></td>
                                                    <td className='fw-bold text-danger'>{tempScoreChart[obj.FeildName]}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr key={0}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='fw-bold' >Total</td>
                                        <td className='fw-bold text-danger'>{Score}</td>
                                    </tr>
                                </tbody>
                            </Table>

                        </Col>
                    </Row>
                    <Row className='py-4'>
                        <Col md={1} className='fw-bold text-center'>
                            Nb :
                        </Col>
                        <Col>
                            <Row>
                                1. In Spinal or Epidural blocks look for upper limb activity
                            </Row>
                            <Row>
                                2. In upper limb blocks look for lower limb activity and the other limb
                            </Row>
                            <Row>
                                3 Patient can be transferred from the post anaesthesia recovery area to the Post operative ward when Modified Aldrete Score in & or more as assessed by annesthesiologist.
                            </Row>
                        </Col>
                    </Row>
                    <Row className=''>
                        <Col className='text-start my-2'><Button variant="secondary" onClick={() => { setModalShow(true); fetchScoreChart() }}> Edit Chart </Button></Col>
                        <Col className='text-start my-2'>  <Form.Group className=" general-case-sheet-input">
                            <Form.Control type="datetime-local" value={tempScoreChart.dtm} onChange={(e) => { handleDate(e) }} name='dtm' id='dtm' /><label htmlFor="dtm" className="">Date</label></Form.Group></Col>
                        <Col className='text-end my-2'>
                                <Button variant="success" onClick={handleSave} className={`${btnView.save==1?'':'d-none'}`}> Save </Button>
                                 <Button variant="primary" onClick={handleUpdate} className={`${btnView.save==0?'':'d-none'}`}> Update </Button>
                         </Col>
                    </Row>
                </Container>
            </ClinicalLayout>
            <ScoreChartEditModel
                show={modalShow}
                handlePreviousScoreChart={handlePreviousScoreChart}
                onHide={() => { setModalShow(false); }}
                prevScoreChart={prevScoreChart}
                setSelectId={setSelectId}
            />
        </>
    )
}

export default ScoreChart