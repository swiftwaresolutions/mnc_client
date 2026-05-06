import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
interface DischargeSummaryDataProps {
  handleDischargeSummary: any
  dischargeSummaryData: any;
  textareaValue: any;
  setTextareaValue: any;
  openSearchTemplate: any;
  openCreateTemplate: any;
}
const DischargeSummaryData: React.FC<DischargeSummaryDataProps> = ({
  handleDischargeSummary,
  dischargeSummaryData,
  textareaValue,
  setTextareaValue,
  openSearchTemplate,
  openCreateTemplate,
}) => {


  return (
    <Fragment>

      <Row>
        {dischargeSummaryData.map((data: any, idx: number) => (
          <Col md={6} className="my-1" key={idx}>
            <Row>
              <Col>
                <Form.Group
                  className="mb-3 general-case-sheet-input"
                  controlId={data.fieldName}
                >

                  <Form.Control
                    as="textarea"
                    placeholder=""
                    name={data.fieldName}
                    rows={4}
                    value={textareaValue[`${data.fieldName}`]}
                    onChange={(e) => {
                      handleDischargeSummary(e.target.name, e.target.value);
                    }}
                  />

                  <label htmlFor={data.fieldName}>
                    {data.name}
                  </label>
                </Form.Group>
              </Col>
              <Col className="d-flex flex-grow-0">
                <Col className="px-2">
                  <Button variant="dark" tabIndex={2} onClick={() => openSearchTemplate(data.id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </Col>
                <Col className="px-2">
                  <Button variant="success" tabIndex={2} onClick={() => openCreateTemplate(data.id)}                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Col>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

    </Fragment>
  );
};

export default DischargeSummaryData;
