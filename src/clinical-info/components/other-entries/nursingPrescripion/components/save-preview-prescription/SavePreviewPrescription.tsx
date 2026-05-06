import React from 'react'
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
//import logo from '../../../../../../assets/logo.jpg';
import { format } from 'date-fns';



const SavePreviewPrescription = ({ show, onHide, savePrescriptionsData, isPrescriptionUpdated, setIsPrescriptionUpdated, setIsSave, setCommonDuration, patientDetails }: any) => {
    const currentDate = new Date();

    const navigate = useNavigate()
    const navigateRoute = (path: string, name: string) => {
        if (name == "Edit Prescription") {
            setIsPrescriptionUpdated((pre: any) => ({ ...pre, status: false }))
            setCommonDuration({ number: 0, duration: 0 })
            setIsSave(false)
            onHide()
            return
        }
        navigate(path)
    }
    const Print = () => {
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
    };

    return (
        <Modal
            {...{ onHide, show }}
            aria-labelledby="contained"
            centered
            dialogClassName="modal-90w modal-content-height-100"
        >
        <Modal.Header>
            <Row className='justify-content-around w-100'>
                <Col><Modal.Title id="contained-modal " className='fw-bold'> </Modal.Title></Col>
                {/* <Col className='text-center fs-4 text-success fw-bold'>PRESC NO : {isPrescriptionUpdated.id}</Col> */}
                <Col className='flex-grow-0 text-end'><Button variant='danger' className='py-1' onClick={onHide}>X</Button></Col>
            </Row>
        </Modal.Header>

        <Container className='mt-2'>
            
        {/* <div id='printablediv' > */}
            <Row className="mt-2 d-block vh-50 shadow overflow-auto" >
            <div id='printablediv' >
                <Row>
                <Col xs={1} className='mt-4'>
                        {/* <img className='mx-3 ' height={'85px'}  src={logo} alt="Logo" /> */}
                    </Col>

                        <Col  className='text-center '>
                            <Row className='text-center'>
                                <h5 className="fw-bold">RICHARDSONS&nbsp;FACE&nbsp;HOSPITALS</h5>
                            </Row>
                            <Row className='text-center'>
                                <h6>Kannur-Bagalur Airport Road,Kannur Bangalore-560077, India</h6>
                            </Row>
                            <Row className='text-center'>
                                <h6>Phone:   94431 82860 | 08022221040</h6>
                            </Row>
                            <Row className='text-center'>
                                <h6>Email:richardsonsfacehospital@gmail.com &amp; Web : www.facesurgeon.in</h6>
                            </Row>
                        </Col>

                        <Row className='text-center mt-2'>
                        <hr />
                        <h5 className='mb-2'>PRESCRIPTION</h5>
                        <hr  />
                    </Row>

                    <Row className='mt-4 mb-2'>
                        <Col className='mx-4'>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>Name : <span className='fw-light'>{patientDetails?.fullName}</span></h6>
                            </Row>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>OpNo : <span className='fw-light'>{patientDetails?.displayNumber}</span></h6>
                            </Row>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>Date : <span className='fw-light'>{format(currentDate, 'dd/MM/yyyy')}</span></h6>
                            </Row>
                        </Col>
                        <Col>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>Age : <span className='fw-light'>{patientDetails?.age}</span></h6>
                            </Row>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>Gender : <span className='fw-light'>{patientDetails?.gender}</span></h6>
                            </Row>
                            <Row className='text-left'>
                                <h6 className='fw-bold'>Prescription No : <span className='fw-light text-success'>{isPrescriptionUpdated.prescId}</span></h6>
                            </Row>
                        </Col>
                    </Row>
                </Row>
<Row>
                   

                    </Row>
                    <hr />
                <Row className='px-4'>
                    <Table striped hover>
                        <thead className=" sticky-top font-size-11px" >
                            <tr>
                                <th className='w-50px'>Sl.No</th>
                                <th className='min-w-200px'>MEDICINE NAME</th>
                                <th className='w-125px'>TOTAL NO.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                savePrescriptionsData.filter((prod: any) => prod.isOwn != 1).map((prod: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className='w-50px'>{idx + 1}</td>
                                        <td className='min-w-200px'>{prod.selectedMed}</td>
                                        {/* <td className='w-125px'>{prod.quantity}</td>
                                        <td className='w-125px'>{prod.unit}</td>
                                        <td className='w-125px min-w-100px'>{prod.timingUnits == "0-0-0" ? prod.timingName : prod.timingUnits} </td>
                                        <td className='w-125px min-w-100px'>{`${Number(prod.prescriptionDuration)} ${prod.configDurationName ? prod.configDurationName : ""}`}</td> */}
                                        <td className='w-125px min-w-100px'>{prod.quantity}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </Table>
                </Row>

                <Row>
                    <Col xs={9} className='m-4'>
                        
                    </Col>
                    <Col className='m-4'>
                        
                    </Col>
                </Row>
                <Row className='mb-5'>
                    <Col xs={9} className=''>
                        
                    </Col>
                    <Col className=''>
                        <h6 className='fw-bold'>Signature of Doctor</h6>
                    </Col>
                </Row>
            </div>
            </Row>
        
            <Row>
                <Col className='d-flex justify-content-center'>
                    <Button variant="outline-secondary" className="my-4 mx-4" onClick={Print} id="printbtn">Print Prescription</Button>
                </Col>
            </Row>
           
        </Container>

        </Modal>
    )
}

export default SavePreviewPrescription