import { faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CaseSheetApiService from "../../../../../api/case-sheet/case-sheet-api-service";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { focusInputElementWithPreviousInput, hanldeZeroNumberInput } from "../../../../../utils/elementUtil";
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";

const day = [
  // {
  //   name: "Hour",
  // },
  {
    name: "Days",
  },
  {
    name: "Weeks",
  },
  {
    name: "Months",
  },
];

interface ComponentProps {
  historyInputs: any[];
  complaintInit: any;
  caseSheet: any;
  complaint: any;
  setHandleComplaint: (value: any) => void;
  handleInputChange: (value: string, fieldName: string) => void;
  openSearchTemplate: (id: string | number) => void;
  openCreateTemplate: (id: string | number) => void;
}
const History: FC<ComponentProps> = ({ complaintInit, caseSheet, complaint, historyInputs, setHandleComplaint, handleInputChange, openSearchTemplate, openCreateTemplate }) => {
  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();

  const [complaintDetailListOptions, setComplaintDetailListOptions] = useState<any>([]);

  const handleTypeheadComplaintSelect = (selectedItem: any[], idx: any, item: any) => {
    const itemState = item.component.current as Typeahead
    if (!itemState.state.text) {
      return;
    }
    item.selectedComplaint = selectedItem;
    item = handleComplaintValidation(item);
    updateComplaint(idx, item);
  };

  const handleSearch = async (item: any, idx: number) => {
    try {
      const query = item.component?.current.state?.text
      if (query === "") {
        item.selectedComplaint = [{ id: 0, name: "" }];
      }
      item = handleComplaintValidation(item)
      updateComplaint(idx, item);
      if (query.length < 1) return;
      const complaintDetail: any = await caseSheetApiService.getComplaintDetails(query);
      setComplaintDetailListOptions([...complaintDetail]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnComplaintInputBlur = (item: any, idx: number) => {
    try {
      if (item?.component?.current) {
        item?.component?.current.hideMenu();
      }
      item = handleComplaintValidation(item);
      updateComplaint(idx, item);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplaintPeriodNumber = (e: any, idx: number, item: any) => {
    let { value } = e.target;
    value = hanldeZeroNumberInput(value);
    item.number = value;
    updateComplaint(idx, item);
  };

  const hanldeComplaintPeriodName = (e: any, idx: number, item: any) => {
    let { value } = e.target;
    item.period = value;
    updateComplaint(idx, item);
  };

  const handleComplaintValidation = (item: any) => {
    try {
      let itemState = item.component.current.state
      if (itemState.text && !itemState.selected.length) {
        item.hasError = true;
      } else {
        item.hasError = false;
      }
      return item;
    } catch (error) {
      console.error(error);
    }
  };

  const addComplaintRow = (idx: number) => {
    try {
      const updatedHistoryRow = [...complaint, { ...complaintInit }];
      setHandleComplaint([...updatedHistoryRow]);
      if (updatedHistoryRow[idx].component.current) {
        focusInputElementWithPreviousInput(updatedHistoryRow[idx].component.current.getInput(), 3);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeHistoryComplaitRow = (idx: number) => {
    let othersComplaints = [];
    if (complaint.length > 1) {
      othersComplaints = [...complaint].filter((_row: any, row_idx: number) => row_idx != idx);
    } else {
      othersComplaints = [{ ...complaintInit }];
    }
    setHandleComplaint(othersComplaints);
  };

  const updateComplaint = (idx: number, item: any) => {
    complaint[idx] = item;
    setHandleComplaint([...complaint]);
  };

  return (
    <>
      <Container className="p-2 rounded d-flex flex-column h-100">
        <Row className="border rounded clinical-general-history-header overflow-auto py-1 mx-2">
          <Col>
            {complaint.map((item: any, idx: number) => {
              let rowStyle: React.CSSProperties = { padding: "1.8px 0", marginTop: "1px" }
              if (item.hasError) {
                rowStyle = { ...rowStyle, backgroundColor: "#ec7070" }
              }
              return (
                <Row key={idx} className="flex-nowrap rounded" style={rowStyle} >
                  <Col>
                    <AsyncTypeahead
                      className="min-w-200px react-bootstrap-typehead typeahead-mark"
                      inputProps={{ name: `complaint-input-${idx}` }}
                      filterBy={() => true}
                      id={`complaint-autocomplete-${idx}`}
                      isLoading={false}
                      labelKey="name"
                      minLength={1}
                      size="sm"
                      onSearch={() => true}
                      selected={item.selectedComplaint}
                      ref={item.component}
                      onFocus={() => handleSearch(item, idx)}
                      onInputChange={() => handleSearch(item, idx)}
                      onChange={(selectedItem) => handleTypeheadComplaintSelect(selectedItem, idx, item)}
                      onBlur={() => handleOnComplaintInputBlur(item, idx)}
                      options={complaintDetailListOptions}
                      placeholder="PRESENTING COMPLAINTS"
                      flip={true}
                      positionFixed={true}
                      renderMenuItemChildren={(option: any, { text }) => (
                        <>
                          <Highlighter search={text}>{option.name}</Highlighter>
                        </>
                      )}
                    />
                  </Col>
                  <Col className="max-w-100px">
                    <Form.Control
                      value={item.number}
                      onChange={(e) => {
                        handleComplaintPeriodNumber(e, idx, item);
                      }}
                      placeholder="PERIOD"
                      type="number"
                      name="periodNumber"
                      size="sm"
                    />
                  </Col>
                  <Col className="max-w-100px">
                    <Form.Select size="sm" name="periodName" value={item.period} onChange={(e) => hanldeComplaintPeriodName(e, idx, item)}>
                      {day.map((item: any, idx: any) => (
                        <option key={idx} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col className="max-w-90px d-flex ">
                    <Col>
                      <Button variant="success mx-2" onClick={() => addComplaintRow(idx)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="dark mx-2" onClick={() => removeHistoryComplaitRow(idx)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>

        <Row className="border h-100 mt-2 mx-2 py-3 rounded overflow-auto align-items-center">
          {historyInputs.map((data: any, idx: any) => (
            <Col md={6} className="my-1" key={idx}>
              <Row>
                <Col>
                  <Form.Group className="general-case-sheet-input" controlId={data.id}>
                    <Form.Control
                      as="textarea"
                      autoFocus={data.id == 1}
                      value={caseSheet[data.fieldName]}
                      onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                      placeholder=""
                      rows={4}
                    />
                    <label htmlFor={data.id}>{data.name}</label>
                  </Form.Group>
                </Col>
                <Col className="d-flex flex-grow-0">
                  <Col className="px-2">
                    <Button variant="dark" tabIndex={2} onClick={() => openSearchTemplate(data.id)}>
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </Col>
                  <Col className="px-2">
                    <Button variant="success" tabIndex={2} onClick={() => openCreateTemplate(data.id)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default History;
