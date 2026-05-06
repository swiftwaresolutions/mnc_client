import React from 'react'
import { generalCaseSheetDetailsInterface } from '../model/interfaces';
import { Row, Col, Table } from 'react-bootstrap';

interface ComponentProps {
    generalCaseSheet: generalCaseSheetDetailsInterface;
    patientDetails: any;
}

const hasValue = (v: any) => v !== undefined && v !== null && (`${v}`).toString().trim() !== '';

const anyPresent = (obj: Record<string, any>, keys: string[]) => keys.some((k) => hasValue(obj?.[k]));

const renderRow = (label: string, value: any) =>
    hasValue(value) ? (
        <tr key={label}>
            <td className='w-200px'>{label}</td>
            <td className='w-5px'>:</td>
            <td>{value}</td>
        </tr>
    ) : null;

const GeneralCaseSheetView: React.FC<ComponentProps> = ({ generalCaseSheet, patientDetails }) => {
    const isEmpty = !generalCaseSheet || Object.keys(generalCaseSheet).length === 0;

    if (isEmpty) {
        return (
            <Row className='h-100 align-items-center'>
                <Col className='text-center'>
                    <h5 className='text-danger'>CaseSheet is empty</h5>
                </Col>
            </Row>
        );
    }

    return (
        <Row style={{ fontSize: '1.02rem' }}>
            <div>
                {anyPresent(generalCaseSheet, ['temperature', 'pulse', 'rr', 'bp', 'spo2', 'height', 'weight', 'bmi']) && (
                        <div className='card mb-3 shadow-sm'>
                            <div className='card-header bg-white'>
                                <strong className='text-success'>VITALS</strong>
                            </div>
                            <div className='card-body p-2'>
                                <Table size='sm' className='mb-0'>
                                    <thead>
                                        <tr>
                                            <th>TEMP</th>
                                            <th>PULSE</th>
                                            <th>RR</th>
                                            <th>BP</th>
                                            <th>SPO2</th>
                                            <th>H</th>
                                            <th>W</th>
                                            <th>BMI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{hasValue(generalCaseSheet.temperature) ? generalCaseSheet.temperature : ''}</td>
                                            <td>{hasValue(generalCaseSheet.pulse) ? generalCaseSheet.pulse : ''}</td>
                                            <td>{hasValue(generalCaseSheet.rr) ? generalCaseSheet.rr : ''}</td>
                                            <td>{hasValue(generalCaseSheet.bp) ? generalCaseSheet.bp : ''}</td>
                                            <td>{hasValue(generalCaseSheet.spo2) ? generalCaseSheet.spo2 : ''}</td>
                                            <td>{hasValue(generalCaseSheet.height) ? generalCaseSheet.height : ''}</td>
                                            <td>{hasValue(generalCaseSheet.weight) ? generalCaseSheet.weight : ''}</td>
                                            <td>{hasValue(generalCaseSheet.bmi) ? generalCaseSheet.bmi : ''}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
            </div>
            {/* Use a 2-column responsive layout; each column contains two stacked cards so it forms a 2x2 on wide screens */}
            <Col md={6} className='pe-md-3'>
                {/* Top-left: HISTORY */}
                {anyPresent(generalCaseSheet, ['presentingComplaints', 'presentIllness', 'pastHistoryMedical', 'pastHistorySurgical', 'familyHistory', 'pastHistory', 'treatmentHistory', 'personalHistory', 'investigationHistory', 'menstrualHistory']) && (
                    <div className='card mb-3 shadow-sm'>
                        <div className='card-header bg-white d-flex align-items-center justify-content-between'>
                            <strong className='text-success'>HISTORY</strong>
                        </div>
                        <div className='card-body p-2'>
                            <Table borderless className='mb-0'>
                                <tbody>
                                    {renderRow('Presenting Complaints', generalCaseSheet.presentingComplaints)}
                                    {renderRow('History Of Present Illness', generalCaseSheet.presentIllness)}
                                    {renderRow('Past History ', generalCaseSheet.pastHistoryMedical || generalCaseSheet.pastHistory)}
                                    {renderRow('Past History (Surgical)', generalCaseSheet.pastHistorySurgical)}
                                    {renderRow('Family History', generalCaseSheet.familyHistory)}
                                    {renderRow('Treatment History', generalCaseSheet.treatmentHistory)}
                                    {renderRow('Personal History', generalCaseSheet.personalHistory)}
                                    {renderRow('Investigation History', generalCaseSheet.investigationHistory)}
                                    {renderRow('Menstrual History', generalCaseSheet.menstrualHistory)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}

                {/* Bottom-left: DIAGNOSIS & PLAN */}
                {anyPresent(generalCaseSheet, ['diagnosis', 'confirmedDiagnosis', 'differentialDiagnosis', 'followUpPlan', 'medications', 'recomendations', 'proceduresPlanned']) && (
                    <div className='card mb-3 shadow-sm'>
                        <div className='card-header bg-white'>
                            <strong className='text-success'>DIAGNOSIS &amp; PLAN</strong>
                        </div>
                        <div className='card-body p-2'>
                            <Table borderless className='mb-0'>
                                <tbody>
                                    {renderRow('Diagnosis', generalCaseSheet.diagnosis || generalCaseSheet.confirmedDiagnosis)}
                                    {renderRow('Differential Diagnosis', generalCaseSheet.differentialDiagnosis)}
                                    {renderRow('Plan / Follow Up', generalCaseSheet.followUpPlan)}
                                    {renderRow('Medications', generalCaseSheet.medications)}
                                    {renderRow('Recommendations', generalCaseSheet.recomendations)}
                                    {renderRow('Procedures Planned', generalCaseSheet.proceduresPlanned)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}

                {Array.isArray(generalCaseSheet.diagnosisDetailsData) && generalCaseSheet.diagnosisDetailsData.length > 0 && (
                    <div className='card mb-3 shadow-sm'>
                        <div className='card-header bg-white'>
                            <strong className='text-success'>DIAGNOSIS DETAILS</strong>
                        </div>
                        <div className='card-body p-2'>
                            <Table size='sm' className='mb-0'>
                                <thead><tr><th>#</th><th>Diagnosis</th></tr></thead>
                                <tbody>
                                    {generalCaseSheet.diagnosisDetailsData.map((d: any, idx: number) => (
                                        <tr key={d.id || idx}><td>{idx + 1}</td><td>{d.name}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
            </Col>

            <Col md={6} className='ps-md-3'>
                {/* Top-right: GENERAL EXAM */}
                {anyPresent(generalCaseSheet, ['pallor', 'icterus', 'edema', 'generalExamination', 'oralCavity', 'cvs', 'res', 'abdominal', 'cns', 'oralRectal', 'perVaginal', 'skin', 'musculoskeletal', 'additionalFindings', 'allergy']) && (
                    <div className='card mb-3 shadow-sm'>
                        <div className='card-header bg-white'>
                            <strong className='text-success'>GENERAL EXAMINATION</strong>
                        </div>
                        <div className='card-body p-2'>
                            {/* <Table bordered className='mb-2'>
                                <thead>
                                    <tr>
                                        <th>Pallor</th>
                                        <th>Icterus</th>
                                        <th>Edema</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{hasValue(generalCaseSheet.pallor) ? generalCaseSheet.pallor : ''}</td>
                                        <td>{hasValue(generalCaseSheet.icterus) ? generalCaseSheet.icterus : ''}</td>
                                        <td>{hasValue(generalCaseSheet.edema) ? generalCaseSheet.edema : ''}</td>
                                    </tr>
                                </tbody>
                            </Table> */}

                            <Table borderless className='mb-0'>
                                <tbody>
                                    {renderRow('Oral Cavity', generalCaseSheet.oralCavity)}
                                    {renderRow('CVS', generalCaseSheet.cvs)}
                                    {renderRow('RES', generalCaseSheet.res)}
                                    {renderRow('Abdominal', generalCaseSheet.abdominal)}
                                    {renderRow('CNS', generalCaseSheet.cns)}
                                    {renderRow('Per Vaginal', generalCaseSheet.perVaginal)}
                                    {renderRow('Oral Rectal', generalCaseSheet.oralRectal)}
                                    {renderRow('Skin', generalCaseSheet.skin)}
                                    {renderRow('Musculoskeletal', generalCaseSheet.musculoskeletal)}
                                    {renderRow('Additional Findings', generalCaseSheet.additionalFindings)}
                                    {renderRow('Allergy', generalCaseSheet.allergy)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}

                {/* Bottom-right: VITALS, SYSTEMIC, APPOINTMENT, LISTS compacted */}
                <div className='d-flex flex-column'>
                    

                    {anyPresent(generalCaseSheet, ['systemicExamination', 'others', 'examination']) && (
                        <div className='card mb-3 shadow-sm'>
                            <div className='card-header bg-white'>
                                <strong className='text-success'>SYSTEMIC / OTHERS</strong>
                            </div>
                            <div className='card-body p-2'>
                                <Table borderless className='mb-0'>
                                    <tbody>
                                        {renderRow('Systemic Examination', generalCaseSheet.systemicExamination)}
                                        {renderRow('Others', generalCaseSheet.others || generalCaseSheet.examination)}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                    {anyPresent(generalCaseSheet, ['foot', 'wound']) && (
                        <div className='card mb-3 shadow-sm'>
                            <div className='card-header bg-white'>
                                <strong className='text-success'>LOCAL EXAMINATION</strong>
                            </div>
                            <div className='card-body p-2'>
                                <Table borderless className='mb-0'>
                                    <tbody>
                                        {renderRow('Foot', generalCaseSheet.foot)}
                                        {renderRow('Wound', generalCaseSheet.wound)}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {anyPresent(generalCaseSheet, ['appointMentDate', 'appointmentPlan']) && (
                        <div className='card mb-3 shadow-sm'>
                            <div className='card-header bg-white text-center text-danger'>
                                <strong>APPOINTMENT</strong>
                            </div>
                            <div className='card-body p-2'>
                                <Table borderless className='mb-0'>
                                    <tbody>
                                        {renderRow('Appointment Date', generalCaseSheet.appointMentDate)}
                                        {renderRow('Appointment Plan', generalCaseSheet.appointmentPlan)}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {Array.isArray(generalCaseSheet.complaintDataList) && generalCaseSheet.complaintDataList.length > 0 && (
                        <div className='card mb-3 shadow-sm'>
                            <div className='card-header bg-white'>
                                <strong className='text-success'>COMPLAINTS</strong>
                            </div>
                            <div className='card-body p-2'>
                                <Table size='sm' className='mb-0'>
                                    <thead>
                                        <tr><th>#</th><th>Complaint</th><th>Duration</th></tr>
                                    </thead>
                                    <tbody>
                                        {generalCaseSheet.complaintDataList.map((c: any, idx: number) => (
                                            <tr key={c.id || idx}>
                                                <td>{idx + 1}</td>
                                                <td>{c.name}</td>
                                                <td>{c.periods || ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    
                </div>
            </Col>
        </Row>
    );
};

export default GeneralCaseSheetView