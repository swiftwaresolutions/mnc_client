import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { OutsideInvInterface } from '../model/interfaces';

interface ComponentProps {
  investigation: OutsideInvInterface[];
}

const OutsideInvTab: React.FC<ComponentProps> = ({ investigation }) => {
  
  const groupedInvData: {
    [invName: string]: { [invDate: string]: { labName: string; findings: string }[] };
  } = {};

  investigation.forEach((item) => {
    // if (!item?.invName || !item?.invDate || !item?.labName || !item?.findings) return;

    if (!groupedInvData[item.invName]) {
      groupedInvData[item.invName] = {};
    }

    if (!groupedInvData[item.invName][item.invDate]) {
      groupedInvData[item.invName][item.invDate] = [];
    }

    groupedInvData[item.invName][item.invDate].push({
      labName: item.labName,
      findings: item.findings,
    });
  });

  const uniqueInvDates = Array.from(
    new Set(investigation.map((item) => item.invDate))
  );

  return (
    <Row className="justify-content-center ">
      <Col md={10} className="mt-5">
        <Row className="">
          <Table bordered  className='overflow-auto'>
            <thead className="position-sticky top-0 table-info">
              <tr>
                <th>Sl No</th>
                <th>Investigation Name</th>
                {uniqueInvDates.map((invDate, idx) => (
                  <th key={idx}>{invDate}</th>
                ))}
              </tr>
            </thead>
            <tbody>
  {Object.entries(groupedInvData).map(([invName, invDates], idx) => (
    <React.Fragment key={idx}>
      
      {Object.entries(invDates).map(([invDate, labNames], invDateIdx) => {
        const rowSpan = labNames.length; 

        return (
          <React.Fragment key={invDateIdx}>
            
            {labNames.map((item, labIdx) => (
              <tr className="text-center align-middle" key={labIdx}>
                
                {labIdx === 0 && invDateIdx === 0 && (
                  <td rowSpan={Object.keys(invDates).length}>
                    {idx + 1}
                  </td>
                )}

                
                {labIdx === 0 && (
                  <td rowSpan={rowSpan}>{invName}</td>
                )}

                
                {uniqueInvDates.map((date) => {
                  const matchingData = invDates[date];
                  return (
                    <td key={date}>
                      {matchingData
                        ? matchingData
                            .filter((data) => data.labName === item.labName)
                            .map((data, idx) => (
                              <div key={idx}>{data.findings}</div>
                            ))
                        : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  ))}
</tbody>



            {/* <tbody>
              {Object.entries(groupedInvData).map(([invName, invDates], idx) => (
                <React.Fragment key={idx}>
                  {Object.entries(invDates).map(([invDate, labNames], invDateIdx) => {
                    return (
                      <React.Fragment key={invDateIdx}>
                        {labNames.map((item, labIdx) => {
                          return (
                            <React.Fragment key={labIdx}>
                              <tr className="text-center align-middle">
                                
                                {labIdx === 0 && invDateIdx === 0 && (
                                  <td rowSpan={Object.keys(invDates).length}>
                                    {idx + 1}
                                  </td>
                                )}
                                {labIdx === 0 && (
                                  <td rowSpan={labNames.length}>{invName}</td>
                                )}
                               
                                {uniqueInvDates.map((date) => {
                                  const matchingData = invDates[date];
                                  return (
                                    <td key={date}>
                                      {matchingData
                                        ? matchingData
                                            .filter((data) => data.labName === item.labName)
                                            .map((data, idx) => (
                                              <div key={idx}>{data.findings}</div>
                                            ))
                                        : '-'}
                                    </td>
                                  );
                                })}
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody> */}
          </Table>
        </Row>
      </Col>
    </Row>
  );
};

export default OutsideInvTab;
