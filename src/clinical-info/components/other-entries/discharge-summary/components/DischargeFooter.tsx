import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
interface DischargeFooterProps {
  handleDischargeSummary: any, doc: any, setDoc: any,
  consultantRow: any; consultantApiService: any; setConsultantRow: any; createConsultantDetailsRequestListModel: any; departmentRow: any; departmentApiService: any;
  setDepartmentRow: any; createDepartmentDetailsRequestListModel: any; textareaValue: any; setTextareaValue: any;
}

const DischargeFooter: React.FC<DischargeFooterProps> = ({
  handleDischargeSummary, consultantRow, consultantApiService, setConsultantRow, createConsultantDetailsRequestListModel, departmentRow, departmentApiService,
  setDepartmentRow, createDepartmentDetailsRequestListModel, textareaValue, setTextareaValue, doc, setDoc
}) => {

  const [ConsultantOption, setConsultantOption] = useState<any>([]);
  const [docOption, setDocOption] = useState<any>([]);
  const [DepartmentOption, setDepartmentOption] = useState<any>([]);



  const handleTypeheadConsultantSelect = (selected: any[], idx: number, item: any) => {
    item.selectedConsultant = selected;
    consultantRow[idx] = item;
    setConsultantRow([...consultantRow]);
  };

  const handleConsultantSearch = async (query: string) => {
    try {
      let consultantResponse = await consultantApiService.getConsultantList(query);
      setConsultantOption(consultantResponse);
    } catch (error) { }
  };

  const addConsultantRow = () => {
    const updatedConsultantRow = [...consultantRow, { ...createConsultantDetailsRequestListModel }];
    setConsultantRow([...updatedConsultantRow]);
  };

  const removeConsultantRow = (idx: number) => {
    if (consultantRow.length > 1) {
      let otherConsultant = [...consultantRow].filter((row: any, row_idx: number) => row_idx != idx);
      setConsultantRow([...otherConsultant]);
    } else {
      setConsultantRow([{ ...createConsultantDetailsRequestListModel }]);
    }
  };

  const handleDepartmentSearch = async (query: string) => {
    try {
      let departmentResponse = await departmentApiService.fetchDepartment(query);
      setDepartmentOption(departmentResponse);
    } catch (error) { }
  };

  const handleTypeheadDepartmentSelect = (selected: any[], idx: number, item: any) => {
    item.selectedDepartment = selected;
    departmentRow[idx] = item;
    setDepartmentRow([...departmentRow]);
  };

  const addDepartmentRow = () => {
    const updatedDepartmentRow = [...departmentRow, { ...createDepartmentDetailsRequestListModel }];
    setDepartmentRow([...updatedDepartmentRow]);
  };

  const removeDepartmentRow = (idx: number) => {
    if (departmentRow.length > 1) {
      let otherDepartment = [...departmentRow].filter((row: any, row_idx: number) => row_idx != idx);
      setDepartmentRow([...otherDepartment]);
    } else {
      setDepartmentRow([{ ...createDepartmentDetailsRequestListModel }]);
    }
  };

  const handleDocSearch = async (query: string) => {
    try {
      let consultantResponse = await consultantApiService.getConsultantList(query);
      setDocOption(consultantResponse);
    } catch (error) { }
  };

  const handleTypeheadDocSelect = (selected: any[]) => {
    setDoc([...selected]);
  };

  return (
    <Fragment>

      <Row className="px-2 row-cols-1 row-cols-lg-2">
        <Col>
          <b>OTHER CONSULTANT</b>
          <Row className="border rounded clinical-general-history-header overflow-auto py-1 mx-2">
            <Col>
              {consultantRow.map((item: any, idx: number) => {

                return <Row className="position-relative" key={idx}>
                  <Col md={8}>
                    <AsyncTypeahead

                      className="min-w-200px typeahead-mark"
                      filterBy={() => true}
                      id={`consultant_${idx}`}
                      isLoading={false}
                      labelKey="name"
                      minLength={2}
                      onSearch={handleConsultantSearch}
                      onChange={(selectedItem) => handleTypeheadConsultantSelect(selectedItem, idx, item)}
                      options={ConsultantOption}
                      placeholder="Search Doctor"
                      flip={true}
                      selected={item.selectedConsultant}
                      positionFixed={true}
                      renderMenuItemChildren={(option: any, { text }) => (
                        <>
                          <Highlighter search={text}>{option.name}</Highlighter>
                        </>
                      )}
                    />
                  </Col>
                  <Col className="d-flex flex-grow-0">
                    <Col className="px-2">
                      <Button variant="success"  onClick={() => addConsultantRow()}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                    <Col className="px-2">
                      <Button variant="dark"  onClick={() => removeConsultantRow(idx)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Col>
                </Row>
              })}
            </Col>
          </Row>

        </Col>
        <Col>
          <b>DEPARTMENT AT REVIEW</b>
          <Row className="border rounded clinical-general-history-header overflow-auto py-1 mx-2">
            <Col>
              {departmentRow.map((item: any, idx: number) => {

                return <Row className="position-relative" key={idx}>
                  <Col md={8}>
                    <AsyncTypeahead

                      className="min-w-200px typeahead-mark"
                      filterBy={() => true}
                      id={`department_${idx}`}
                      isLoading={false}
                      labelKey="depName"
                      minLength={2}
                      onSearch={handleDepartmentSearch}
                      onChange={(selectedItem) => handleTypeheadDepartmentSelect(selectedItem, idx, item)}
                      options={DepartmentOption}
                      placeholder="Search Department"
                      flip={true}
                      selected={item.selectedDepartment}
                      positionFixed={true}
                      renderMenuItemChildren={(option: any, { text }) => (
                        <>
                          <Highlighter search={text}>{option.depName}</Highlighter>
                        </>
                      )}
                    />
                  </Col>
                  <Col className="d-flex flex-grow-0">
                    <Col className="px-2">
                      <Button variant="success" onClick={() => addDepartmentRow()}>
                        <FontAwesomeIcon icon={faPlus}  />
                      </Button>
                    </Col>
                    <Col className="px-2">
                      <Button variant="dark" onClick={() => removeDepartmentRow(idx)} >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Col>
                </Row>

              })}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <Row className="py-3 align-items-center row-cols-1 row-cols-xl-3">
        <Col className="d-flex align-items-center justify-content-center">
          <span className="fw-bold pe-3">DOCTOR : </span>
          <Row className="overflow-auto py-1">
            <Col>
              <Row className="position-relative">
                <Col>
                  <AsyncTypeahead
                    className="min-w-200px typeahead-mark"
                    filterBy={() => true}
                    id={`doc`}
                    isLoading={false}
                    labelKey="name"
                    minLength={0}
                    onSearch={handleDocSearch}
                    onChange={(selectedItem) => handleTypeheadDocSelect(selectedItem)}
                    options={docOption}
                    placeholder="Select Doctor"
                    dropup={true}
                    flip={true}
                    selected={doc}
                    positionFixed={true}
                    renderMenuItemChildren={(option: any, { text }) => (
                      <>
                        <Highlighter search={text}>{option.name}</Highlighter>
                      </>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <span className="fw-bold">REVIEW DATE : </span>
          <Form.Control
            name="reviewDTM" type="datetime-local" className="w-auto ms-2"
            value={textareaValue.reviewDTM == "0000-00-00 00:00:00" ? "" : textareaValue.reviewDTM}
            onChange={(e) => { handleDischargeSummary(e.target.name, e.target.value); }}
          />
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <span className="fw-bold">DISCHARGE DATE : </span>
          <Form.Control
            name="neonatal" type="date" className="w-auto ms-2"
            value={textareaValue.neonatal}
            onChange={(e) => { handleDischargeSummary(e.target.name, e.target.value); }}
          />
        </Col>
      </Row> */}
    </Fragment>
  );
};

export default DischargeFooter;
