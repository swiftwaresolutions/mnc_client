import React, { Component, Fragment, useEffect, useState  } from 'react'
import { Col, Row, Form, Modal, Container, Button } from 'react-bootstrap'
import { toastErrorBounceDark, toastInfoBounceDark, toastSuccessBounceDark } from '../../../../toast-message/toast'
import CaseSheetApiService from '../../../../api/case-sheet/case-sheet-api-service'

type ComponentProps = {
    type : number
}
const appointmentDate = [
    {
        id   : 1,
        name : "APPOINTMENT DATE",
        fieldName : "appointmentDate",
        type : "date"
    },
    {
        id   : 2,
        name : "REASON",
        fieldName : "appointmentPlan",
        type : "textarea"
    }
]
const AppointmentRegister  = ({show, onHide,patientDetails,caseSheetType, userId } : any) => {

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();
    const [appointmentDetails, setAppointmentDetails] = useState<any>({appointmentDate : "0000-00-00", appointmentPlan : "",prevId : '', prevStatus : false})
    // const [prevAppointmentDetails, setPreviousAppointmentDetails] =useState({prevId : '', prevStatus : false})

    const handleOnChange = (value : any, name : string) => {
        // console.log(value, name)
        setAppointmentDetails((prevState : any) => ({
            ...prevState,
            [name] : value
        }))
    }

    const getAppointmentDetails = () => {
        let patDetails = patientDetails
        caseSheetApiService.fetchPatientAppointmentByVstId(patDetails.visitId, caseSheetType)
        .then((response : any) => {
            if(response.length > 0){
                setAppointmentDetails({
                    appointmentDate : response[0].appointmentDate,
                    appointmentPlan : response[0].appointmentPlan,
                    prevId : response[0].id,
                    prevStatus : true
                })
            }
        })
        .catch((error : any) =>{
            console.log("error", error)
        })
    }

    const handleSaveAppointment = async () => {
        let patDetails = patientDetails
        try {
            if (appointmentDetails.appointmentDate == "0000-00-00" && appointmentDetails.appointmentPlan == "") {
                return toastInfoBounceDark("Enter Appointment Details")
            }
            
            let data = {patId : patDetails.patientId, vstId : patDetails.visitId, caseShetType : caseSheetType,
                consultantId : userId,appointmentDate : appointmentDetails.appointmentDate, appointmentPlan : appointmentDetails.appointmentPlan
            }

            let response = await caseSheetApiService.savePatientAppointmentRegister(data);
            getAppointmentDetails()
            toastSuccessBounceDark("Appointment Details Saved Successfully")
            onHide()
        } catch (error) {
            console.log("error", error);
        }
        
    }

    const handleUpdateAppointment = async () => {
        let patDetails = patientDetails
        try {
            if(appointmentDetails.prevId == "") {return toastErrorBounceDark("No Details Found")}
            let data = {consultantId : userId, appointmentDate : appointmentDetails.appointmentDate, appointmentPlan : appointmentDetails.appointmentPlan }
            await caseSheetApiService.updatePatientAppointmentRegister(appointmentDetails.prevId, data);
            getAppointmentDetails()
            toastSuccessBounceDark("Appointment Details Updated Successfully")
            onHide()
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(() => {
        getAppointmentDetails()
    },[])
  return (
    <>
        <Modal
                show ={show}
                onHide = {onHide}
                keyboard= {false}
                centered
                // size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 fw-bold text-center text-danger">PATIENT APPOINTMENT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='my-5'>
                        <Col>
                            {
                                appointmentDate.map((appoint : any, aIdx : number) => {
                                    return (
                                        <Row key={aIdx} className="m-3 p-2">
                                            <Col className='text-center'>
                                                <div className={`${appoint.fieldName === "appointmentPlan" ? "pt-4" : ""}`}>{appoint.name}</div>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId={appoint.id}>
                                                    <Form.Control
                                                        type={appoint.type}
                                                        as={appoint.type === "textarea" ? "textarea" : "input"}
                                                        name={appoint.fieldName}
                                                        {...(appoint.type === "textarea" ? { rows: 3 } : {})}
                                                        placeholder={appoint.name}
                                                        value={appointmentDetails[appoint.fieldName]}
                                                        className="form-control"
                                                        onChange = {(e : any) => handleOnChange(e.target.value, appoint.fieldName)}
                                                        {...(appoint.type === "date" ? { min: new Date().toISOString().split("T")[0] } : {})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Row className='w-100 text-center'>
                        <Col>
                        {
                            appointmentDetails.prevStatus ? (
                                <Button 
                                    onClick={handleUpdateAppointment}
                                    variant ='primary'
                                >UPDATE</Button>
                            ):(
                                <Button
                                     onClick={handleSaveAppointment}
                                     variant='success'
                                 >SAVE</Button>
                            )
                        }
                            
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        
    </>
  )
}

export default AppointmentRegister