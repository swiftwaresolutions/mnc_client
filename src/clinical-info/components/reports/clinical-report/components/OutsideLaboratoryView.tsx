// import React, { Fragment, useEffect, useRef, useState } from 'react'
// import { laboratoryDetailsInterface, OutsideInvInterface, OutsideLabInterface } from '../model/interfaces';
// import { Row, Col, Table, Button } from 'react-bootstrap';

// interface ComponentProps {
//     laboratory: OutsideLabInterface[]
//     outsideInv: OutsideInvInterface[]
// }
// const OutsideLaboratoryView: React.FC<ComponentProps> = ({ laboratory, outsideInv }) => {
//     let labData: any[] = [...laboratory]
//     let invData: any[] = [...outsideInv]
//     // const [labData, setLabData] = useState<any[]>(laboratory)
//     // const [invData, setInvData] = useState<any[]>(outsideInv)
//     const tempLabData = [...labData].reduce((acc: any, cur) => {
//         if (!cur || !cur.labId) {
//             return acc;
//         }

//         if (!acc[cur.labId]) {
//             acc[cur.labId] = {
//                 labNo: cur.labId,
//                 labName: cur.labName,
//                 suggestDoc: cur.suggestDoc,
//                 labDate: cur.selDate,
//                 labDetails: []
//             }
//         }
//         acc[cur.labId].labDetails.push({
//             specName: cur.specName,
//             testName: cur.testName,
//             value: cur.value,
//             unit: cur.unit,
//             fieldName: cur.fieldName,
//             fieldId: cur.fieldId
//         })
//         return acc
//     }, {})
//     const tempInvData = [...invData].reduce((acc: any, cur) => {
//         if (!cur || !cur.invNo) {
//             return acc;
//         }

//         if (!acc[cur.invNo]) {
//             acc[cur.invNo] = {
//                 invNo: cur.invNo,
//                 labName: cur.labName,
//                 suggestDoc: cur.suggestDoc,
//                 invDate: cur.invDate,
//                 details: []
//             }
//         }
//         acc[cur.invNo].details.push({
//             invName: cur.invName,
//             findings: cur.findings
//         })
//         return acc
//     }, {})
//     labData = [...Object.values(tempLabData)]
//     invData = [...Object.values(tempInvData)]
//     // useEffect (() => {
//     //     // setInvData([...Object.values(tempInvData)])
//     //     setLabData([...Object.values(tempLabData)])
//     // },[])
//     let labResSlNo = 0;
//     return (
//         <Fragment>
//             <Row>
//                 <Col md={6} className='border'>
//                         <Row className='text-center text-success fs-14px p-2 border'>
//                             <Col>OUTSIDE LABORATORY</Col>
//                         </Row>
//                         <Row>
//                             {
//                                 laboratory.length == 0 && (
//                                     <Fragment>
//                                         <Row className='py-4'>
//                                             <Col className='text-center fw-bold text-danger fs-11px'>Outside Laboratory is Empty</Col>
//                                         </Row>
//                                     </Fragment>
//                                 )
//                             }
//                             {laboratory.length !== 0 && (
//                                 <Col>
//                                     {
//                                         labData.map((item: any, idx: number) => {
//                                             labResSlNo = 0;
//                                             return (
//                                                 <Fragment key={idx}>
//                                                     <Row className='text-center m-2'>
//                                                         <Col>Date : <span className='text-primary fw-bold'>{item.labDate == "00-00-0000" ? "-" : item.labDate}</span></Col>
//                                                         <Col>lab : <span className='text-primary fw-bold'>{item.labName}</span></Col>
//                                                         <Col>Ref. : <span className='text-primary fw-bold'>{item.suggestDoc}</span></Col>
//                                                     </Row>
//                                                     <Table className='mb-2 border'>
//                                                         <thead>
//                                                             <tr className='fs-10px'>
//                                                                 <th>Sl.No</th>
//                                                                 <th>Test Name</th>
//                                                                 <th>Field Name</th>
//                                                                 <th>Results	</th>
//                                                                 <th>Units</th>

//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {item.labDetails?.map((labItem: any, labIdx: number, labarr: any) => {

//                                                                 const isFirstRow = labIdx === 0 || labItem.testName !== labarr[labIdx - 1]?.testName;
//                                                                 if (isFirstRow) {
//                                                                     labResSlNo++;
//                                                                 }

//                                                                 const rowSpan = labarr.slice(labIdx).reduce((acc: any, cur: OutsideLabInterface, i: number, presArrRed: any) => {
//                                                                     if (labItem.testName === presArrRed[i + 1]?.testName) {
//                                                                         return acc + 1
//                                                                     }
//                                                                     return acc
//                                                                 }, 1)
//                                                                 return (<Fragment key={labIdx}>
//                                                                     <tr>
//                                                                         {isFirstRow && labItem.testName !== labarr[(labIdx - 1)]?.testName &&
//                                                                             <td rowSpan={rowSpan} className='w-100px text-center fw-bold align-middle'>{labResSlNo}</td>}
//                                                                         {isFirstRow && labItem.testName !== labarr[(labIdx - 1)]?.testName &&
//                                                                             <td rowSpan={rowSpan} className='fs-10px w-100px fw-bold align-middle text-danger'>{labItem.testName}</td>}
//                                                                         <td className='fs-11px'>{labItem.fieldName}</td>
//                                                                         <td className='w-70px'>{labItem.value}</td>
//                                                                         <td className='w-50px'>{labItem.unit}</td>
//                                                                     </tr>
//                                                                 </Fragment>
//                                                                 )
//                                                             })}
//                                                         </tbody>
//                                                     </Table>
//                                                 </Fragment>
//                                             )
//                                         })}


//                                 </Col>
//                             )
//                             }
//                         </Row>
//                 </Col>

//                 <Col md={6} className='border'>
//                         <Row className='text-center text-success fs-14px p-2 border'>
//                             <Col>INVESTIAGION DETAILS</Col>
//                         </Row>
//                         <Row>
//                             {
//                                 outsideInv.length == 0 && (
//                                     <Fragment>
//                                         <Row className='py-4'>
//                                             <Col className='text-center fw-bold text-danger fs-11px'>Investigation is Empty</Col>
//                                         </Row>
//                                     </Fragment>
//                                 )
//                             }
//                         </Row>
//                         {
//                             invData.map((item: any, idx: number) => {
//                                 return (
//                                     <Fragment key={idx}>
//                                         {/* <Row className='text-center fs-14px'>
//                                         <Col>Inv No : <span className='fw-bold text-danger'>{item.invNo}</span></Col>
//                                     </Row> */}
//                                         <Row className='text-center'>
//                                             <Col>DATE : <span className='fw-bold text-primary'>{item.invDate}</span></Col>
//                                             <Col>LAB : <span className='fw-bold text-primary'>{item.labName}</span></Col>
//                                             <Col>REF. : <span className='fw-bold text-primary'>{item.suggestDoc}</span></Col>
//                                         </Row>
//                                         <Row className='text-center'>
//                                             <Table className='border'>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>No</th>
//                                                         <th>Inv Name</th>
//                                                         <th>Findings</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {
//                                                         item.details?.map((invDet: any, invDetIdx: number) => {
//                                                             return (
//                                                                 <tr key={invDetIdx}>
//                                                                     <td>{invDetIdx + 1}</td>
//                                                                     <td>{invDet.invName}</td>
//                                                                     <td>{invDet.findings}</td>
//                                                                 </tr>
//                                                             )
//                                                         })
//                                                     }

//                                                 </tbody>
//                                             </Table>
//                                         </Row>
//                                     </Fragment>
//                                 )
//                             })
//                         }
//                 </Col>
//             </Row>

//         </Fragment>
//     )
// }

// export default OutsideLaboratoryView


import React, { Fragment } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { OutsideLabInterface } from '../model/interfaces';

interface ComponentProps {
  laboratory: OutsideLabInterface[];
}

const OutsideLaboratoryView: React.FC<ComponentProps> = ({ laboratory }) => {
  // Grouping by testName and fieldName, then selDate for each fieldValue.
  const groupedData: { [testName: string]: { [fieldName: string]: { [selDate: string]: { value: string; unit: string }[] } } } = {};

  laboratory.forEach((item) => {
    if (!item?.testName || !item?.selDate || !item?.fieldName) return;

    // Initialize the testName entry if not already present
    if (!groupedData[item.testName]) {
      groupedData[item.testName] = {};
    }

    // Initialize the fieldName entry under the testName if not already present
    if (!groupedData[item.testName][item.fieldName]) {
      groupedData[item.testName][item.fieldName] = {};
    }

    // Initialize the selDate entry for the fieldName if not already present
    if (!groupedData[item.testName][item.fieldName][item.selDate]) {
      groupedData[item.testName][item.fieldName][item.selDate] = [];
    }

    // Push the test result into the array for this testName, fieldName, and selDate
    groupedData[item.testName][item.fieldName][item.selDate].push({
      value: item.value,
      unit: item.unit,
    });
  });

  // Extract all unique selDates for column headers
  const uniqueSelDates = Array.from(
    new Set(laboratory.map((item) => item.selDate))
  );

  return (
    <Fragment>
      <Row>
        <Col md={12} className="border">
          <Row className="text-center text-success fs-14px p-2 border">
            <Col>OUTSIDE LABORATORY</Col>
          </Row>
          <Row>
            <Col>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Field Name</th>
                    {uniqueSelDates.map((selDate, idx) => (
                      <th key={idx}>{selDate}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedData).map(([testName, fieldNames], idx) => (
                    <Fragment key={idx}>
                      {Object.entries(fieldNames).map(([fieldName, selDates], fieldIdx) => {
                        const rowSpan = Object.keys(selDates).length; // Set rowSpan based on the number of selDates for the fieldName
                        return (
                          <Fragment key={fieldIdx}>
                            <tr className='text-center'>
                              {/* Display testName once with rowSpan */}
                              {fieldIdx === 0 && (
                                <td rowSpan={Object.keys(fieldNames).length}>{testName}</td>
                              )}
                              <td>{fieldName}</td>
                              {uniqueSelDates.map((date) => {
                                const testResult = selDates[date];
                                return (
                                  <td key={date}>
                                    {testResult
                                      ? testResult.map((result, idx) => (
                                          <div key={idx}>
                                            {result.value} {result.unit}
                                          </div>
                                        ))
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
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OutsideLaboratoryView;
