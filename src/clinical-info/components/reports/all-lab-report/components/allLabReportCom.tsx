import { Badge, Col, Row, Table } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { OutsideLabInterface } from "../model/interfaces";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";


interface ComponentProps {
  laboratory: OutsideLabInterface[];
  resultDates: string[]
  patientDetails: any;
}

const OutsideLabTab: React.FC<ComponentProps> = ({ laboratory, resultDates,patientDetails }) => {

  // Grouping by testName and fieldName, then date for each fieldValue.

  // Extract all unique dates for column headers


  // console.log('laboratory', laboratory)
  // console.log('resultDates', resultDates)

  // console.log('uniqueSelDates', uniqueSelDates)


  const preferredOrder: string[] = [
   "CBC", "BLOOD GROUPING", "URINE ALBUMIN",
   "URINE SUGAR", "UREA", "CREATININE", "Thyroid",
   "BLOOD GROUPING & TYPING","HbAsg","HCV","HIV",
   "VDRL","BT","CT","LFT"];

  const sortedLaboratoryEntries = Object.entries(laboratory).sort(([a], [b]) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Outside Lab Report",
  });
  
  return (
    <Fragment >
      <Row className="justify-content-center  p-2">
        <Col className="p-0">
        <Row className="justify-content-end  no-print">
          <Col className="text-success fw-medium d-flex align-items-center gap-2"><Badge pill bg= {"success"} className = "p-1" style ={{ width : '10px', height : '10px', display : 'block'}}></Badge>Lab</Col>
          <Col className="text-danger fw-medium d-flex align-items-center gap-2"><Badge pill bg= {"danger"} className = "p-1" style ={{ width : '10px', height : '10px', display : 'block'}}></Badge>Outside Lab</Col>
          <Col xs="auto">
            <button className="btn btn-primary" onClick={handlePrint}>
              Print
            </button>
          </Col>
        </Row>

        <div ref={printRef} className="print-area">
          <div className="print-only">
            <div className="text-center mb-4 print-header">
                  <Row className='text-center fs-14px text-primary fw-bold p-1'>
                      <Col>GNANADURAI HOSPITAL, SIVAKASI.</Col>
                  </Row>
                  <Row className='text-center fs-12px text-primary'><Col>LABORATORY</Col></Row>
                  <hr />
                  <Row className='text-center'>
                      <Col>NAME : <span className="text-uppercase fw-bold">{patientDetails.fullName}</span></Col>
                      <Col>Op No : {patientDetails.displayNumber}</Col>
                  </Row>
                  <Row className='text-center'>
                      <Col>AGE : {patientDetails.age}Y</Col>
                      <Col>GENDER : {patientDetails.gender}</Col>
                  </Row>
                  <hr />
              </div>
          </div>
        

          <Row className="m-1">
            {/* <Col> */}
            <Table bordered >
              <thead className="table-info position-sticky top-0">
                <tr className="text-center">
                  <th>No</th>
                  <th className="min-w-120px">Test Name</th>
                  <th className="min-w-120px">Field Name</th>
                  {resultDates.map((date, idx) => (
                    <th key={idx} className="min-w-90px w-100px">{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedLaboratoryEntries.map(([testName, test], idx) => (
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
                              <td rowSpan={Object.keys(test).length} >{testName}</td>
                            )}
                            <td>{fieldName}</td>
                            {resultDates.map((date) => {
                              const testResult = dates[date];
                              return (
                                <td key={date} className="py-0">
                                  {testResult ? testResult && (testResult.map((result: any, idx: number) => (
                                    <div key={idx} className={`mb-1 text-nowrap ${result.type == "lab" ? "text-success" : "text-danger"}`}>
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
        </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OutsideLabTab;