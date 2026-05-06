import React, { Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { dischargeSummaryInputFormatInterface } from '../DischargeSummary'
// import logo from "../../../../../assets/hospital-logo.jpeg"
interface DischargeSummaryPrintProps {
  dischargeSummaryData: any[],
  textareaValue: any,
  printRef: any,
  patientDetails: any
  doc: any
}
const DischargePrint: React.FC<DischargeSummaryPrintProps> = ({ doc, dischargeSummaryData, textareaValue, printRef, patientDetails }) => {

  const patPrint = [
    {
      name1: "PATIENT NAME : ",
      name1value: patientDetails.fullName,
      name2: "HOSPITAL.NO : ",
      name2value: patientDetails.displayNumber
    },
    {
      name1: "AGE / GENDER : ",
      name1value: `${patientDetails.age} / ${patientDetails.gender}`,
      name2: "WARD \ IP.NO : ",
      name2value: `${patientDetails.ward} \ ${patientDetails.ipNo}`
    },
    {
      name1: "ADDRESS : ",
      name1value: patientDetails.address,
      name2: `${patientDetails.gtype} : `,
      name2value: patientDetails.guardianName
    }

  ]

  return (
    <Row className="d-none" >
      <Col ref={printRef} className=' m-4 ' id='printdiv'>
        <Row className='flex-column h-100 flex-nowrap'>
          <Col className='pt-2'>
            <Row className='align-items-center mb-2'>
              <Col>
                <h2 className='text-center fw-bold link-offset-1 text-decoration-underline'>CHRISTIAN HOSPITAL BERHAMPUR</h2>
                <h5 className='text-center fw-bold text-decoration-underline'>DIST.GANJAM,ODISHA-760001</h5>
                <p className='fw-bolder'>{"Reg.No - GAN/624/2021 (Odisha Clinical Establishments (Controll & Regulation) Act 1990)"}</p>
              </Col>
              <Col className='flex-grow-0 pe-4'>
                {/* <img src={logo} alt="" style={{ maxWidth: "130px" }} /> */}
              </Col>
            </Row>
            {patPrint.map((item: any, idx: number) => (
              <Row className='fs-12px' key={idx}>
                <Col>
                  <span className='fw-bold text-capitalize'>{item.name1}</span><span>{item.name1value}</span>
                </Col>
                <Col>
                  <span className='fw-bold text-capitalize'>{item.name2}</span><span>{item.name2value}</span>
                </Col>
              </Row>
            ))}
            <Row className='fs-12px  mb-3'>
              <Col>
                <span className='fw-bold'>ADMISSION DATE : </span><span>{patientDetails.admissionDate} </span>
              </Col>
              <Col>
                <span className={`fw-bold ${textareaValue.neonatal == "0000-00-00" ? "d-none" : ""}`}>DISCHARGE DATE : </span>
                <span className={`fw-bold ${textareaValue.neonatal == "0000-00-00" ? "d-none" : ""}`}>{textareaValue.neonatal} </span>
              </Col>
            </Row>
            <Row>
              <Col className='fw-bolder h5 text-decoration-underline link-offset-2 text-center'>DISCHARGE CERTIFICATE</Col>
            </Row>

            {dischargeSummaryData.map((item: any, idx: number) => (
              <Row key={idx} className={`fs-13px ${textareaValue[`${item.fieldName}`] == "" ? "d-none" : ""}`}>
                <Col >
                  <p className='fw-bold m-0 text-decoration-underline link-offset-2 fs-13px m-0 p-1'>{item.name}</p>
                  <p style={{ whiteSpace: "pre-line" }} className='text-indent-40px fs-12px p-0 m-0'>{textareaValue[`${item.fieldName}`]}</p>
                </Col>
              </Row>
            ))}
            <Row className={`${textareaValue['reviewDTM'] == "0000-00-00 00:00:00" || textareaValue['reviewDTM'] =="0000-00-00T00:00" ? "d-none" : ""}`}>
              <Col>
                <span className='fw-bold m-0 text-decoration-underline link-offset-2 fs-13px m-0 p-1'>REVIEW DTM</span><span> : {textareaValue['reviewDTM']} </span>
              </Col>
            </Row>
          </Col>
          <Col className='flex-grow-0 mt-5'>
            <p className='text-indent-40px'>
              To review in Christian Hospital Berhampur casualty or go to a nearby hospital as soon as possible if there is
              excessive vaginal bleeding soaking 2-3 pads in 30 minutes/excessive vaginal bleeding after 2 weeks of delivery/foul smelling vaginal discharge/pain or pus over the vaginal area/fever/abdominal pain/chest pain
            </p>
            <p className='fw-bold text-indent-40px'>For Emergency Contact :
              Christian Hospital Berhampur OPD- Monday to Saturday (8am-4pm)– Phone No. 943773444 , 9124564002.
            </p>
            <Row>
              <Col><p className='fw-bold '>Doctor’s name : {doc[0] && doc[0].name}</p></Col>
              <Col><p className='fw-bold '>RECEIVED BY : </p></Col>
            </Row>
            <Row>
              <Col><p className='fw-bold '>Doctor’s signature : </p></Col>
              <Col><p className='fw-bold '>NAME : </p></Col>
            </Row>
            <Row>
              <Col><p className='fw-bold '></p></Col>
              <Col><p className='fw-bold '>SIGNATURE : </p></Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default DischargePrint