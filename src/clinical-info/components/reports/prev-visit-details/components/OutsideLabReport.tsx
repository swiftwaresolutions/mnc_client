import { Col, Row, Table } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { OutsideLabInterface } from "../model/interfaces";


interface ComponentProps {
  laboratory: OutsideLabInterface[];
}

const OutsideLabReport: React.FC<ComponentProps> = ({ laboratory }) => {

  
  const groupedData: { [testName: string]: { [fieldName: string]: { [selDate: string]: { value: string; unit: string }[] } } } = {};

  laboratory.forEach((item) => {
    // if (!item?.testName || !item?.selDate || !item?.fieldName) return;

    
    if (!groupedData[item.testName]) {
      groupedData[item.testName] = {};
    }

    
    if (!groupedData[item.testName][item.fieldName]) {
      groupedData[item.testName][item.fieldName] = {};
    }

    
    if (!groupedData[item.testName][item.fieldName][item.selDate]) {
      groupedData[item.testName][item.fieldName][item.selDate] = [];
    }

    
    groupedData[item.testName][item.fieldName][item.selDate].push({
      value: item.value,
      unit: item.unit,
    });
  });

  
  const uniqueSelDates = Array.from(
    new Set(laboratory.map((item) => item.selDate))
  );

  return (
    <Fragment >
      <Row className="justify-content-center overflow-auto h-100 w-100">
        <Col md={10} className="pt-2">
          <Row className=" overflow-auto">
            {/* <Col> */}
            <Table bordered className="position-relative">
              <thead className="table-info position-sticky top-0" style={{ zIndex: 1 }}>
                <tr className="text-center">
                  <th>Sl No</th>
                  <th className="min-w-120px">Test Name</th>
                  <th className="min-w-120px">Field Name</th>
                  {uniqueSelDates.map((selDate, idx) => (
                    <th key={idx} className="min-w-90px w-100px">{selDate}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([testName, fieldNames], idx) => (
                  <Fragment key={idx}>
                    {Object.entries(fieldNames).map(([fieldName, selDates], fieldIdx) => {
                      const rowSpan = Object.keys(selDates).length; 
                      return (
                        <Fragment key={fieldIdx}>
                          <tr className='text-center align-middle'>
                            {fieldIdx === 0 && (
                              <td rowSpan={Object.keys(fieldNames).length}>{idx + 1}. </td>
                            )}
                            {fieldIdx === 0 && (
                              <td rowSpan={Object.keys(fieldNames).length} >{testName}</td>
                            )}
                            <td>{fieldName}</td>
                            {uniqueSelDates.map((date) => {
                              const testResult = selDates[date];
                              return (
                                <td key={date}>
                                  {testResult
                                    ? testResult.map((result, idx) => (
                                      <div key={idx}>
                                        {result.value} {String(result.value).trim() == "" ? "" : result.unit}
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
            {/* </Col> */}
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OutsideLabReport;