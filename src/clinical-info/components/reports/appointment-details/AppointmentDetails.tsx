
import React from 'react'
import { Badge, Col, Modal, Row, Table } from 'react-bootstrap'
import { PatientApiService } from '../../../../api/patient/patient-api-service'
import { AppointmentDetailsInterface } from './components/AppointmentDetailsInterface'

interface ComponentProps {
    handleClose: () => void
    appointmentShow: boolean
}

const AppointmentDetails : React.FC<ComponentProps> = ({ appointmentShow,handleClose}) => {

    const patientApiService : PatientApiService = new PatientApiService();
    const [appointmentDetails, setAppointmentDetails] = React.useState<AppointmentDetailsInterface[]>([])

    const getAppointmentDetails = () => {
        patientApiService.fetchPatientAppointmentRegister()
        .then((response : AppointmentDetailsInterface[]) => {
            if(response.length > 0){
                setAppointmentDetails(response)
            }
        }).catch((error : any) => {
            console.log("error", error)
        })
        console.log("appointmentDetails", appointmentDetails);
        
    }
    React.useEffect(() => {
        getAppointmentDetails()
    },[appointmentShow])
  return (
    <>
        <Modal
            show ={appointmentShow}
            onHide = {handleClose}
            dialogClassName="w-90per max-w-xxl"
            fullscreen= 'sm'
            keyboard= {false}
            centered
        >
            <Modal.Header closeButton >
                {/* <Row>
                    <Col className="text-center py-1"> */}
                        
                    {/* </Col>
                </Row> */}
                <Modal.Title className="w-100 fw-bold text-center text-success">
                    <Row className=" ">
                        <Col xs={2} className='fs-13px'>
                            <Row>
                                <Col className="text-danger fw-bold">  <Badge pill bg="danger" className="mx-2 text-danger">.</Badge>Not Registered</Col>
                            </Row>
                            <Row>
                                <Col className="text-success fw-bold"> <Badge pill bg="success" className="mx-2 text-success">.</Badge>Registered</Col>
                            </Row>
                        </Col>
                        <Col xs={9} className='text-center'>CURRENT APPOINTMENT</Col>
                    </Row>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0 min-h-400px vh-85 overflow-auto rounded ">
                <Row >
                    <Col>
                        {
                            appointmentDetails.length == 0 &&
                           <Row className='vh-80 align-items-center' >
                                <Col className='text-center'>
                                    <h3 className='text-danger'>NO APPOINTMENT TODAY</h3>
                                </Col>
                            </Row>
                        }
                        {
                            appointmentDetails.length > 0 &&
                        <Row className='m-5 align-items-center justify-content-center p-2'>
                            <Col className='max-w-80per max-h-500px overflow-auto'>
                                <Table className='justify-content-center text-center table-bordered table-hover overflow-auto'>
                                    <thead className='table-dark sticky-top'>
                                        <tr>
                                            <th>Sl No</th>
                                            <th>Patient Name</th>
                                            <th>OP No</th>
                                            <th>Department</th>
                                            <th>Doctor</th>
                                            <th>Plan</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-secondary'>
                                    {
                                        appointmentDetails.map((item : AppointmentDetailsInterface, aIdx : number) => {
                                            return (
                                                    <tr key={aIdx}>
                                                        <td>{aIdx + 1}</td>
                                                        <td className={item.visitStatus == 1 ? "text-success" : "text-danger"}>{item.name}</td>
                                                        <td className={item.visitStatus == 1 ? "text-success" : "text-danger"}>{item.displayNumber}</td>
                                                        <td className={item.visitStatus == 1 ? "text-success" : "text-danger"}>{item.caseSheetType === 2 ? "ANTENATAL" : item.caseSheetType === 1 ? "GENERAL" : ""}</td>
                                                        <td className={item.visitStatus == 1 ? "text-success" : "text-danger"}>{item.consultantName}</td>
                                                        <td className={item.visitStatus == 1 ? "text-success" : "text-danger"}>{item.appointmentPlan}</td>
                                                    </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        }
                        
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default AppointmentDetails