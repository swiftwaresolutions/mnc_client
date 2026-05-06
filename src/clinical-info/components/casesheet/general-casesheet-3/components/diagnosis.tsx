import { faPlus, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CaseSheetApiService from "../../../../../api/case-sheet/case-sheet-api-service";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { focusInputElementWithPreviousInput } from "../../../../../utils/elementUtil";
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";
interface ComponentProps {
  diagnosisInputs: any[];
  diagnosisInit: any;
  caseSheet: any;
  diagnosis: any[];
  setHandleDiagnosis: (value: any) => void;
  handleInputChange: (value: string, fieldName: string) => void;
  openSearchTemplate: (id: string | number) => void;
  openCreateTemplate: (id: string | number) => void;
}
const Diagnosis: FC<ComponentProps> = ({ diagnosisInputs, diagnosisInit, caseSheet, diagnosis, setHandleDiagnosis, handleInputChange, openSearchTemplate, openCreateTemplate }) => {
  const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService();

  const [DiagnosisOption, setDiagnosisOption] = useState<any>([])

  const handleDiagnosisSelect = (selected: any[], idx: number, item: any) => {
    const itemState = item.component.current as Typeahead
    if (!itemState.state.text) {
      return;
    }
    item.selectedDiagnosis = selected;
    item = handleDiagnosisValidation(item);    
    updateDiagnosis(idx, item);
  };

  const addDiagnosisRow = (idx: number) => {
    try {
      const updatedDiagnosisRow = [...diagnosis, { ...diagnosisInit }];
      setHandleDiagnosis([...updatedDiagnosisRow]);
      if (updatedDiagnosisRow[idx].component) {
        focusInputElementWithPreviousInput(updatedDiagnosisRow[idx].component.current.getInput(), 2);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeDiagnosisRow = (idx: number) => {
    let otherDiagnosis = [];
    if (diagnosis.length > 1) {
      otherDiagnosis = [...diagnosis].filter((row: any, row_idx: number) => row_idx != idx);
    } else {
      otherDiagnosis = [{ ...diagnosisInit }];
    }
    setHandleDiagnosis([...otherDiagnosis]);
  };

  const handleSearch = async (item: any, idx: number) => {
    try {
      const query = item.component?.current.state?.text
      if (query == "") {
        item.selectedDiagnosis = [{ id: 0, name: "" }];
      }
      item = handleDiagnosisValidation(item)
      updateDiagnosis(idx, item);
      if (query.length < 1) return;
      let diagnosisResponse = await caseSheetApiService.getDiagnosisDetails(query);
      setDiagnosisOption(diagnosisResponse);
    } catch (error) {
      console.error(error);
    }
  };
  const handleBlurOnDiagnosisInput = (item: any, idx: number) => {
    try {
      if (item?.component?.current) {
        item?.component?.current.hideMenu();
      }
      item = handleDiagnosisValidation(item);
      updateDiagnosis(idx, item);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiagnosisValidation = (item: any) => {
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
  }
  const updateDiagnosis = (idx: number, item: any) => {
    diagnosis[idx] = item;
    setHandleDiagnosis([...diagnosis]);
  };
  return (
    <>
      <Container className="d-flex flex-column h-100">
        <Row className="border clinical-general-history-header mx-2 py-1 rounded overflow-auto">
          <Col>
            {diagnosis.map((item: any, idx: number) => {
              let rowStyle: React.CSSProperties = { padding: "1.8px 0", marginTop: "1px" }
              if (item.hasError) {
                rowStyle = { ...rowStyle, backgroundColor: "#ec7070" }
              }
              return (
                <Row className="rounded" key={idx} style={rowStyle}>
                  <Col>
                    <AsyncTypeahead
                      className="min-w-200px react-bootstrap-typehead typeahead-mark"
                      filterBy={() => true}
                      id={`diagnosis-${idx}`}
                      isLoading={false}
                      labelKey="name"
                      minLength={1}
                      size="sm"
                      onSearch={() => false}
                      selected={item.selectedDiagnosis}
                      ref={item.component}
                      onFocus={() => handleSearch(item, idx)}
                      onInputChange={() => handleSearch(item, idx)}
                      onChange={(selectedItem) => handleDiagnosisSelect(selectedItem, idx, item)}
                      onBlur={() => handleBlurOnDiagnosisInput(item, idx)}
                      options={DiagnosisOption}
                      placeholder="DIAGNOSIS"
                      flip={true}
                      positionFixed={true}
                      renderMenuItemChildren={(option: any, { text }) => (
                        <>
                          <Highlighter search={text}>{option.name}</Highlighter>
                        </>
                      )}
                    />
                  </Col>
                  <Col className="max-w-90px d-flex flex-grow-0">
                    <Col className="px-2">
                      <Button variant="success" onClick={() => addDiagnosisRow(idx)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                    <Col className="px-2">
                      <Button variant="dark" onClick={() => removeDiagnosisRow(idx)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
        <Row className="border h-100 mt-4 mx-2 py-3 rounded overflow-auto flex-column">
          <Col className="my-1">
            {diagnosisInputs.map((data: any, idx: any) => (
              <Row key={idx}>
                <Col>
                  <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                    <Form.Control as="textarea" value={caseSheet[data.fieldName]} onChange={(e) => handleInputChange(e.target.value, data.fieldName)} placeholder="" rows={4} />
                    <label htmlFor={data.id}>
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
                    <Button variant="success" tabIndex={2} onClick={() => openCreateTemplate(data.id)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Col>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Diagnosis;
