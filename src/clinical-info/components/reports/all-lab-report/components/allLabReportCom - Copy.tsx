import { Col, Row, Table } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { OutsideLabInterface } from "../model/interfaces";


interface ComponentProps {
  laboratory: OutsideLabInterface[];
  resultDates: string[]
}

const OutsideLabTab: React.FC<ComponentProps> = ({ laboratory, resultDates }) => {
  return (
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
                                    <div key={idx} className={`mb-1 ${result.type == "lab" ? "text-success fw-bold fs-14px" : "text-danger"}`}>
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
  );
};

export default OutsideLabTab;