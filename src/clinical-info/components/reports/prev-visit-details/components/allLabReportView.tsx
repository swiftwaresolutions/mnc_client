
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { LaboratoryApiService } from '../../../../../api/laboratory/laboratory-api-service';
import {  OutsideLabInterface , ScreenDetails } from '../model/interfaces';
import { handleError } from '../../../../../utils/errorUtil';
import { Badge, Col, Container, Row ,Table } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { PatientApiService } from '../../../../../api/patient/patient-api-service';

interface ComponentProps {
    patientOPNumber : string;
}

const AllLabReport: React.FC<ComponentProps> = ({patientOPNumber}) => {
    const patOpno = patientOPNumber.trim();
    const dispatch = useDispatch();

    const laboratoryApiService = new LaboratoryApiService();
    const patientApiService = new PatientApiService();

    const [laboratory, setLaboratory] = useState<OutsideLabInterface[]>([])
    const [resultDates, setResultDates] = useState<string[]>([])

    const [screenDetails, setScreenDetails] = useState<ScreenDetails>({
        isLoading: false,
        message: "Details are Empty",
        color: "danger"
    })

    const getPatientClinicalDetails = async () => {
        try {
            if (!patOpno) {
                throw new Error("Patient Opno is Invalid!")
            }
            setScreenDetails((pre: any) => ({ ...pre, isLoading: true, message: "Loading ...", color: "primary" }))
            const patientId = await patientApiService.getPatientIdByDisplayNo(patOpno).catch((error : AxiosError) => {handleError(dispatch, error); return 0;  });
            if (!patientId) {
                throw new Error("Patient Id is Invalid!")
            }
            const resultsResponse = await Promise.all([
                laboratoryApiService.fetchOutsideLabResultDetailsByPatId(`${patientId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; }),
                laboratoryApiService.fetchLabResultsByPatientId(`${patientId}`).catch((error: AxiosError) => { handleError(dispatch, error); return []; })
            ]);
            let outSideLabResults: any[] = resultsResponse[0].map((item: any) => ({ ...item, type: "outSideLab", date: item.selDate }))
            let labResults: any[] = resultsResponse[1].map((item: any) => ({ ...item, type: "lab", date: item.visitDate }))

            let results = [...outSideLabResults, ...labResults];
            //console.log('results', results)
            const groupedData: any = {};
            results.forEach((result: any) => {
                if (!groupedData[result.testName]) {
                    groupedData[result.testName] = {};
                }

                
                if (!groupedData[result.testName][result.fieldName]) {
                    groupedData[result.testName][result.fieldName] = {};
                }

                
                if (!groupedData[result.testName][result.fieldName][result.date]) {
                    groupedData[result.testName][result.fieldName][result.date] = [];
                }

                
                groupedData[result.testName][result.fieldName][result.date].push({
                    value: result.value,
                    unit: result.unit,
                    type: result.type
                });
            })

            setLaboratory(groupedData);
            setResultDates(Array.from(
                new Set(results.map((item) => item.date))
            ))
        } catch (error) {
            handleError(dispatch, error)
            setScreenDetails((pre: any) => ({ ...pre, isLoading: false, message: "Error Fetching Data", color: "danger" }))
        }
    }
    useEffect(() => {
        getPatientClinicalDetails()
    }, [])

    return (
        <Container fluid="xl" className='shadow clinical-report-container h-100 p-2'>
            <Fragment >
                <Row className="justify-content-center  p-2">
                    <Col className="p-0">
                    <Row className="m-1">
                        {/* <Col> */}
                        <Table bordered >
                        <thead className="table-info position-sticky top-0">
                            <tr className="text-center text-nowrap">
                            <th>Sl No</th>
                            <th className="min-w-120px">Test Name</th>
                            <th className="min-w-120px">Field Name</th>
                            {resultDates.map((date, idx) => (
                                <th key={idx} className="min-w-90px w-100px">{date}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(laboratory).map(([testName, test], idx) => (
                            <Fragment key={idx}>
                                {Object.entries(test).map(([fieldName, dates], fieldIdx) => {
                                const rowSpan = Object.keys(dates).length; 
                                return (
                                    <Fragment key={fieldIdx}>
                                    <tr className='text-center align-middle'>
                                        {fieldIdx === 0 && (
                                        <td rowSpan={Object.keys(test).length}>{idx + 1}. </td>
                                        )}
                                        {fieldIdx === 0 && (
                                        <td rowSpan={Object.keys(test).length}>{testName}</td>
                                        )}
                                        <td>{fieldName}</td>
                                        {resultDates.map((date) => {
                                        const testResult = dates[date];
                                        return (
                                            <td key={date}>
                                            {testResult ? testResult && (testResult.map((result: any, idx: number) => (
                                                <div key={idx} className={`mb-1 ${result.type == "lab" ? "text-success" : "text-danger"}`}>
                                                {result.value} {String(result.value).trim() == "" ? "" : result.unit}
                                                </div>
                                            )))
                                                : '-'}
                                            </td>
                                        );
                                        })}
                                    </tr>
                                    </Fragment>
                                );
                                })}
                            </Fragment>
                            ))}
                        </tbody>
                        </Table>
                        {/* </Col> */}
                    </Row>
                    </Col>
                </Row>
            </Fragment>
        </Container>
    )
}

export default AllLabReport;