import React, { useState } from 'react'
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import ErrorView from '../../error/ErrorView'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../state/store'
import DoctorTransfer from './casesheet/general-casesheet-3/components/doctor-transfer/DoctorTransfer'
import ClinicalReport from './reports/clinical-report/CLinicalReport'
import { DepartmentApiService } from '../../api/department/department-api-service'
import CaseSheetApiService from '../../api/case-sheet/case-sheet-api-service'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../utils/toast'
import { storeClinicalCurrentOpPatient, storeClinicalCurrentIpPatient } from '../redux-store/clinicalPersistSlice'

interface Props {
    children: React.ReactNode,
    casesheet : string
}

const ClinicalLayout: React.FunctionComponent<Props> = (props: Props) => {

    const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
    const loginData = useSelector((s: RootState) => s.loginData)
    const dispatch = useDispatch()
    const deptService = new DepartmentApiService()
    const caseSheetService = new CaseSheetApiService()

    const [doctorTransferShow, setDoctorTransferShow] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [transferModalShow, setTransferModalShow] = useState(false)
    const [selectedTransfer, setSelectedTransfer] = useState<any | null>(null)
    const [nextReviewDate, setNextReviewDate] = useState<string>('')
    const [transferSubmitting, setTransferSubmitting] = useState<boolean>(false)
    let patientDetails: any;
    let ipId: number;
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }
    console.log("clinical patient ", clinicalCurrentOpPatient)

    const handleDoctorTransferClick = () => {
    // place for any pre-open logic (validation/analytics) before opening modal
    setDoctorTransferShow(true)
  }
  const handleDoctorTransferClose = () => setDoctorTransferShow(false)
  const handleDoctorTransfer = (consultant: any) => {
    // Hook to perform actual transfer action if needed. For now we just log.
    console.log('Doctor transferred to:', consultant)
  }

    // helpers for the Open/Close transfer feature
    const currentPatient = isIp === 0 ? clinicalCurrentOpPatient : clinicalCurrentIpPatient
    const myTransfer = Array.isArray(currentPatient?.transfers) ? currentPatient.transfers.slice().reverse().find((t: any) => Number(t.toDoc) === Number(loginData?.doctorId)) : null

    const openTransferModal = (transfer: any) => {
        setSelectedTransfer(transfer)
        setNextReviewDate(transfer?.nextReview ? String(transfer.nextReview).split('T')[0] : '')
        setTransferModalShow(true)
    }

    const closeTransferModal = () => {
        setSelectedTransfer(null)
        setNextReviewDate('')
        setTransferModalShow(false)
    }

    const submitComplete = async () => {
        if (!selectedTransfer) return
        // if (!nextReviewDate) {
        //     toastErrorBounceDark('Please enter next review date')
        //     return
        // }
        try {
            setTransferSubmitting(true)
            const payloadNextReview = nextReviewDate && String(nextReviewDate).trim() ? nextReviewDate : '0000-00-00'
            await deptService.updateDoctorTransfer(selectedTransfer.id, payloadNextReview)
            toastSuccessBounceDark('Transfer marked completed')
            // update redux patient
            const updated = { ...(currentPatient || {}) }
            if (Array.isArray(updated.transfers)) {
                updated.transfers = updated.transfers.map((t: any) => t.id === selectedTransfer.id ? { ...t, isCompleted: 2, nextReview: nextReviewDate } : t)
            }
            if (isIp === 0) dispatch(storeClinicalCurrentOpPatient(updated))
            else dispatch(storeClinicalCurrentIpPatient(updated))
            closeTransferModal()
        } catch (err) {
            console.error(err)
            toastErrorBounceDark('Failed to complete transfer')
        } finally {
            setTransferSubmitting(false)
        }
    }

    const submitReopen = async () => {
        if (!selectedTransfer) return
        try {
            setTransferSubmitting(true)
            // Reopen uses the receiveDoctorTransfer API
            await caseSheetService.reOpenDoctorTransfer(selectedTransfer.id)
            toastSuccessBounceDark('Transfer reopened')
            const updated = { ...(currentPatient || {}) }
            if (Array.isArray(updated.transfers)) {
                updated.transfers = updated.transfers.map((t: any) => t.id === selectedTransfer.id ? { ...t, isCompleted: 0, reviewDate: null } : t)
            }
            if (isIp === 0) dispatch(storeClinicalCurrentOpPatient(updated))
            else dispatch(storeClinicalCurrentIpPatient(updated))
            closeTransferModal()
        } catch (err) {
            console.error(err)
            toastErrorBounceDark('Failed to reopen transfer')
        } finally {
            setTransferSubmitting(false)
        }
    }

    return (
        <Row className='h-100 '>
            <Col className='mx-auto py-3 h-100'>
                <Card className='clinical-layout-container pt-1 shadow px-1'>
            {/* <FormLabel className='heading mx-auto fw-bold  text-success text- text-uppercase ps-2 letter-spacing-05px link-offset-3 '>VITALS ENTRY <span className="text-dark">shajin / stuart / 30 / M</span></FormLabel> */}
                    <Row className='border rounded shadow-sm align-items-center pb-2'>
                        <Col md={6} sm={12}>
                            <div className='d-flex align-items-start'>
                                <div style={{ width: 56, height: 56, borderRadius: 28, background: '#e9f7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#198754' }} className='me-3'>
                                    {patientDetails?.fullName ? String(patientDetails.fullName).charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='fw-bold fs-5 text-success text-uppercase'>{patientDetails?.fullName || 'Unknown Patient'}</div>
                                        {props.casesheet && (
                                            <span className='badge bg-success text-white mx-3'>{props.casesheet}</span>
                                        )}
                                    </div>
                                    <div className='text-muted small'>
                                        {isIp === 0 ? patientDetails?.displayNumber : patientDetails?.ipNo} &nbsp;•&nbsp; {patientDetails?.age || '-'} / {patientDetails?.gender || '-'} / Phone : {patientDetails?.mobileNumber || '-'} / Address : {patientDetails?.patientAddress || '-'}
                                    </div>
                                    {/* {patientDetails?.patientAddress && <div className='text-muted small'>{patientDetails.patientAddress}</div>} */}
                                    {/* <div className='mt-1'>
                                        <span className='badge bg-light text-dark me-2'>Mob: {patientDetails?.mobileNumber || '-'}</span>
                                        <span className='badge bg-light text-dark'>ID: {isIp === 0 ? patientDetails?.displayNumber || '-' : patientDetails?.ipNo || '-'}</span>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                        <Col md={4} sm={12} className='text-md-end text-start mt-2 mt-md-0'>
                            <div className='d-inline-block'>
                                {isIp === 0 && (
                                    <Button variant='outline-primary' className='me-2' onClick={handleDoctorTransferClick}>
                                        Doctor Transfer
                                    </Button>
                                )}
                                {isIp === 0 && myTransfer && (
                                    <Button variant={Number(myTransfer.isCompleted) === 2 ? 'secondary' : 'outline-success'} className='me-2' onClick={() => openTransferModal(myTransfer)}>
                                        {Number(myTransfer.isCompleted) === 2 ? 'Closed ' : 'Active '}
                                    {/* <span className="blink-badge">NEW</span> */}
                                    </Button>
                                    
                                )}
                                {/* <Button variant='outline-secondary'>Actions</Button> */}
                            </div>
                        </Col>
                        <Col md={2} sm={12} className='text-md-end text-start mt-2 mt-md-0'>
                            <div className='d-inline-block'>
                                {isIp === 0 && (
                                    <Button variant='outline-primary' className='me-2' onClick={() => setShowReportModal(true)}>
                                        CLINICAL REPORTS
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <ErrorView />
                    {props.children}
                </Card>
            </Col>

            <Modal size='lg'
                show={doctorTransferShow}
                onHide={handleDoctorTransferClose}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>Doctor Transfer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <DoctorTransfer onClose={handleDoctorTransferClose} onTransfer={handleDoctorTransfer} patientDetails={patientDetails} />
                </Modal.Body>
            </Modal>

            {/* Transfer complete/reopen modal */}
            <Modal show={transferModalShow} onHide={closeTransferModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTransfer ? (Number(selectedTransfer.isCompleted) === 2 ? 'Transfer (Closed)' : 'Complete Transfer') : 'Transfer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <Form.Label>Next review date</Form.Label>
                        <Form.Control type="date" value={nextReviewDate} onChange={(e) => setNextReviewDate(e.target.value)} />
                    </div>
                    {selectedTransfer && Number(selectedTransfer.isCompleted) === 2 && (
                        <div className="mb-2 text-muted">This transfer is marked completed. You can reopen it.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeTransferModal} disabled={transferSubmitting}>Cancel</Button>
                    {selectedTransfer && Number(selectedTransfer.isCompleted) === 2 ? (
                        <Button variant="warning" onClick={submitReopen} disabled={transferSubmitting}>
                            {transferSubmitting ? 'Processing...' : 'Reopen'}
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={submitComplete} disabled={transferSubmitting}>
                            {transferSubmitting ? 'Processing...' : 'Completed'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal styles to make modal occupy ~90% of viewport and let the ClinicalReport fill it */}
                        <style>
                            {`.clinical-report-modal .modal-dialog{
                                  position:fixed;
                                  top:50%;
                                  left:50%;
                                  transform:translate(-50%,-50%);
                                  max-width:90% !important;
                                  width:90% !important;
                                  height:90vh !important;
                                  margin:0;
                              }
                              /* Force the content to exactly the dialog height so it cannot grow */
                              .clinical-report-modal .modal-content{
                                  height:90vh !important;
                                  max-height:90vh !important;
                                  display:flex;
                                  flex-direction:column;
                                  overflow:hidden !important;
                              }
                              /* Sticky header/footer and fixed body area that always scrolls */
                              .clinical-report-modal .modal-header{
                                  position:sticky;
                                  top:0;
                                  z-index:1020;
                                  background:var(--bs-white);
                              }
                              .clinical-report-modal .modal-footer{
                                  position:sticky;
                                  bottom:0;
                                  z-index:1020;
                                  background:var(--bs-white);
                              }
                              /* Subtract header/footer heights explicitly so body height is fixed */
                              .clinical-report-modal .modal-body{
                                  height:calc(90vh - 112px) !important; /* 56px header + 56px footer approx */
                                  max-height:calc(90vh - 112px) !important;
                                  overflow:auto !important;
                                  padding:0.75rem;
                              }
                              /* Ensure inner tabs/content can shrink and not push modal size */
                              .clinical-report-modal .tab-content, .clinical-report-modal .tab-pane{
                                  min-height: 0 !important;
                              }
                            `}
                        </style>
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size='xl' dialogClassName='modal-fullscreen-lg-down clinical-report-modal' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Clinical Report</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <div style={{ height: '100%' }}>
                        <ClinicalReport />
                    </div>
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default ClinicalLayout