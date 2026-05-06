import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import { prescriptionDeatilsInterface } from '../model/interfaces';
import { useReactToPrint } from 'react-to-print';
import { PrescriptionApiService } from '../../../../../api/prescription/prescription-api-service';

interface ComponentProps {
    prescription: prescriptionDeatilsInterface[],
    patientDetails: any,
    printStatus : number
}

const PrescriptionView: React.FC<ComponentProps> = ({ prescription, patientDetails,printStatus }) => {

    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService();
    const [instructions, setInstructions] = useState<Record<number, string>>({});
    const [instrLoading, setInstrLoading] = useState<boolean>(false);
    const printRef = useRef<HTMLDivElement | null>(null);
    const handlePrint = useReactToPrint({ content: () => printRef.current });


    const groupedPrescriptions = prescription.reduce((acc: any, item) => {
        if (!acc[item.displayNo]) acc[item.displayNo] = [];
        acc[item.displayNo].push(item);
        return acc;
    }, {});


    useEffect(() => {
        const dispNos = Object.keys(groupedPrescriptions || {});
        if (dispNos.length === 0) return;

        let mounted = true;
        const load = async () => {
            setInstrLoading(true);
            try {
                const promises = dispNos.map(async (dispNo) => {
                    const prescId = groupedPrescriptions[dispNo][0].displayNo;
                    const res = await prescriptionApiService.getGeneralInstructionByPresId(prescId);
                    return [dispNo, res] as [string, string];
                });

                const results = await Promise.all(promises);
                if (!mounted) return;
                const map: Record<number, string> = {};
                results.forEach(([k, v]) => {
                    map[Number(k)] = v as string;
                });
                setInstructions(map);
            } catch (err) {
                console.error('Failed to load instructions', err);
            } finally {
                if (mounted) setInstrLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, [prescription]);


    return (
        <Fragment>
            {prescription.length == 0 && (
                <Fragment>
                    <Row className='py-4 no-print'>
                        <Col className='text-center fw-bold text-danger fs-11px'>Prescription is Empty</Col>
                    </Row>
                </Fragment>
            )}

            {prescription.length !== 0 && (
                <div ref={printRef}>
                    <Row className="align-items-center mb-2 no-print">
                        <Col>
                            <h5 className='text-success mb-0'>PRESCRIPTION</h5>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={8} className='pe-md-3'>
                            <div className='card mb-3 shadow-sm'>
                                <div className='card-header bg-white'>
                                    <strong className='text-success'>Prescription Items</strong>
                                </div>
                                <div className='card-body p-2'>
                                    <Table className='mb-0'>
                                        <thead>
                                            <tr className='fs-10px'>
                                                <th>Pres.No.</th>
                                                <th>Medicine Name</th>
                                                <th>DOSE</th>
                                                <th>UNIT</th>
                                                {/* <th className='text-center'>FREQUECY</th> */}
                                                <th className='text-center'>Dur.</th>
                                                <th className='text-center'>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(groupedPrescriptions).map((dispNo: any) => {
                                                const group = groupedPrescriptions[dispNo];
                                                const rowSpan = group.length;

                                                return (
                                                    <Fragment key={dispNo}>
                                                        {group.map((presItem: any, idx: number) => (
                                                            <tr key={idx}>
                                                                {idx === 0 && (
                                                                    <td rowSpan={rowSpan} className='fw-bold text-danger text-center align-middle'>
                                                                        {/* {presItem.displayNo} {presItem.doctorName} */}
                                                                        <div>{presItem.displayNo}</div>
                                                                        <div className="fw-normal text-dark">
                                                                            Prescribed by: <span className='text-primary'>{presItem.doctorName}</span>
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                <td className={`fs-11px ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.own == 1 ? '* ' : ''}{presItem.medName.toLowerCase()}</td>
                                                                <td className={`fs-11px text-center ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.timingUnit}</td>
                                                                <td className={`fs-11px text-center ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.unit}</td>
                                                                {/* <td className={`fs-11px text-center ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.timingName}</td> */}
                                                                <td className={`text-center ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.duration}</td>
                                                                <td className={`text-center ${presItem.own == 1 ? 'text-danger' : ''}`}>{presItem.no}</td>
                                                            </tr>
                                                        ))}

                                                        <tr className={`${instructions[dispNo] ? '' : 'd-none'}`}>
                                                            <td colSpan={5} className='text-secondary border rounded ps-3'>
                                                                {instructions[dispNo] ? `GENERAL INSTRUCTION - ${instructions[dispNo]}` : ''}
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Col>

                        <Col md={4} className='ps-md-3'>
                            {/* <div className='card mb-3 shadow-sm'>
                                <div className='card-header bg-white'>
                                    <strong className='text-success'>Patient</strong>
                                </div>
                                <div className='card-body p-2'>
                                    <Table borderless className='mb-0'>
                                        <tbody>
                                            <tr>
                                                <td className='w-120px'>Name</td>
                                                <td>{patientDetails?.name || ''}</td>
                                            </tr>
                                            <tr>
                                                <td>Age / Sex</td>
                                                <td>{patientDetails?.age || ''} / {patientDetails?.sex || ''}</td>
                                            </tr>
                                            <tr>
                                                <td>Visit</td>
                                                <td>{patientDetails?.visitNo || patientDetails?.visitId || ''}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div> */}

                            <div className='card mb-3 shadow-sm'>
                                <div className='card-header bg-white'>
                                    <strong className='text-success'>Prescription Summary</strong>
                                </div>
                                <div className='card-body p-2'>
                                    <Table borderless className='mb-0'>
                                        <tbody>
                                            <tr>
                                                <td>Total Prescriptions</td>
                                                <td>{Object.keys(groupedPrescriptions).length}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Medicines</td>
                                                <td>{prescription.length}</td>
                                            </tr>
                                            <tr>
                                                <td>Instructions</td>
                                                <td>{instrLoading ? 'Loading...' : Object.values(instructions).filter(Boolean).length}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            {/* {Object.values(instructions).filter(Boolean).length > 0 && (
                                <div className='card mb-3 shadow-sm'>
                                    <div className='card-header bg-white'>
                                        <strong className='text-success'>General Instructions</strong>
                                    </div>
                                    <div className='card-body p-2'>
                                        <ul className='mb-0 ps-3'>
                                            {Object.entries(instructions).map(([k, v]) => v ? <li key={k} className='fs-12px'>{v}</li> : null)}
                                        </ul>
                                    </div>
                                </div>
                            )} */}
                        </Col>
                    </Row>
                </div>
            )}
        </Fragment>
    )
}

export default PrescriptionView