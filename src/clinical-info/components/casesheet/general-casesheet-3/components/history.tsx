import { faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CaseSheetApiService from "../../../../../api/case-sheet/case-sheet-api-service";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { focusInputElementWithPreviousInput, hanldeZeroNumberInput } from "../../../../../utils/elementUtil";
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";

// const day = [
//   // {
//   //   name: "Hour",
//   // },
//   {
//     name: "Days",
//   },
//   {
//     name: "Weeks",
//   },
//   {
//     name: "Months",
//   },
// ];

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
const examinationBodyDataVitals = [

    {
        id: '25',
        name: 'Weight',
        fieldName: 'weight',
        type : 'number',
        disable: false
    },
    {
        id: '26',
        name: 'Height',
        fieldName: 'height',
        type : 'number',
        disable: false

    },
    {
        id: '27',
        name: 'BMI',
        fieldName: 'bmi',
        type : 'number',
        disable: true

    },
    {
        id: '28',
        name: 'Bp',
        fieldName: 'bp',
        type : 'text',
        disable: false

    },
    {
        id: '30',
        name: 'RR',
        fieldName: 'rr',
        type : 'text',
        disable: false

    },
    {
        id: '31',
        name: 'SPO2',
        fieldName: 'spo2',
        type : 'text',
        disable: false

    },
    {
        id: '55',
        name: 'TEMP',
        fieldName: 'temperature',
        type : 'text',
        disable: false

    },
    {
        id: '56',
        name: 'PULSE',
        fieldName: 'pulse',
        type : 'text',
        disable: false

    }
]

const examinationBodyData = [
  {
    name: "PALLOR",
    fieldName: "pallor",
    Options: [
      {
        value: '', name: 'Select'
      },
      {
        value: '-', name: '-'
      },
      {
        value: '+', name: '+'
      },
      {
        value: '++', name: '++'
      },
      {
        value: '+++', name: '+++'
      }
    ]
  },
  {
    name: "ICTERUS",
    fieldName: "icterus",
    Options: [
      {
        value: '', name: 'Select'
      },
      {
        value: '-', name: '-'
      },
      {
        value: '+', name: '+'
      },
      {
        value: '++', name: '++'
      },
      {
        value: '+++', name: '+++'
      }
    ]
  },
  {
    name: "EDEMA",
    fieldName: "edema",
    Options: [
      {
        value: '', name: 'Select'
      },
      {
        value: '-', name: '-'
      },
      {
        value: '+', name: '+'
      },
      {
        value: '++', name: '++'
      },
      {
        value: '+++', name: '+++'
      }
    ]
  }
]

const History: FC<ComponentProps> = ({ complaintInit, caseSheet, complaint, historyInputs, setHandleComplaint, handleInputChange, openSearchTemplate, openCreateTemplate }) => {

  return (
    <>
      <Container className="p-2 rounded d-flex flex-column h-100">
          <Row className=" m-2 p-3 ">
            <Row>
                <Row className=''>
                    <div className='fw-bold '>vitals</div>
                </Row>
            </Row>
            <Row className="p-3 m-2 flex-nowrap">
                {
                    examinationBodyDataVitals.map((list: any, idx: number) => (
                        <Col key={idx}>
                            <Form.Group className="mb-3 general-case-sheet-input" controlId={list.id}>
                                <Form.Control as="textarea"
                                    name={list.fieldName}
                                    disabled={list.disable}
                                    value={caseSheet[list.fieldName]}
                                    onChange={(e) => handleInputChange(e.target.value, list.fieldName)}
                                />
                                <label htmlFor={list.id} className="fs-11px">{list.name}</label>
                            </Form.Group>
                        </Col>
                    ))
                }
            </Row>
        </Row>

        <Row className='my-2'>
          <div className='fw-bold '>General Examination</div>
        </Row>
        <Row className="">
          {
            examinationBodyData.map((list: any, idx: number) => (
              <Col key={idx}>
                <Form.Group className="mb-3 general-case-sheet-input" controlId={list.fieldName}>
                  <Form.Select className="button_style"
                    onChange={(e) => handleInputChange(e.target.value, list.fieldName)}
                    name={list.fieldName}
                    value={caseSheet[list.fieldName]}
                  >
                    {
                      list.Options.map((val: any, i: number) => {
                        return (
                          <option key={i} value={val.value}>{val.name}</option>)
                      })
                    }
                  </Form.Select>
                  <label htmlFor={list.fieldName}>{list.name}</label>
                </Form.Group>
              </Col>
            ))
          }
        </Row>

        <Row className="shadow-sm h-100 mt-2 mx-2 py-3 rounded overflow-auto align-items-center">
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
