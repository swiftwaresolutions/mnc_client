import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { ConsultantApiService } from "../../../../../api/consultant/consultant-api-service";
import { createSurigicalNurseFormat } from "../model/SurgeryModel";
import { createSurigicalAssNurseFormat } from "../model/SurgeryModel";
import { SurgeryNamesaveFormat } from "../model/SurgeryModel";
import { consultantSavaFormat } from "../model/SurgeryModel";
import { AssConsultantSavaFormat } from "../model/SurgeryModel";


const Surgery = ({diagnosis,SurgeryTemproryData,handleSurgeryData,nurseValue,setNurseValue,assNurseValue,setAssNurseValue,consultant,setConsultant,AssConsultant,setAssConsultant,surgeryName,setsurgeryName}:any) => {

  const [Sergonvalue, SetSergonvalue] = useState<any>([]);

  const consultantApiService: ConsultantApiService = new ConsultantApiService()

  const handleConsultantSearch = async (query: string) => {
    try {
        const medicineNameListResponse: any = await consultantApiService.getConsultantList(query);
        SetSergonvalue(medicineNameListResponse);
    } catch (error) {

    }
  };
  const handleMainNurse=(value:any,i:number,item:any)=>{
    let local=[...nurseValue]
    local[i]={...item,nurse:value}
    setNurseValue(local)
  }
  const handleAssNurse=(value:any,i:number,item:any)=>{
    let local=[...assNurseValue]
    local[i]={...item,nurse:value}
    setAssNurseValue(local)
  }
  const handleSurgeryName=(value:any,i:number,item:any)=>{    
    let local=[...surgeryName]
    local[i]={...item,surgeryName:value}
    setsurgeryName(local)
  }
  const addPatPreRow=()=>{
    const updatedNurseValRow = [...nurseValue, { ...createSurigicalNurseFormat }];
    setNurseValue([...updatedNurseValRow]);
  }
  const addAssNurseRow=()=>{
    const updatedAssNurseValRow = [...assNurseValue, { ...createSurigicalAssNurseFormat }];
    setAssNurseValue([...updatedAssNurseValRow]);
  }
  const addSurgeryName=()=>{
    const updatedSurgeryRow = [...surgeryName, { ...SurgeryNamesaveFormat }];
    setsurgeryName([...updatedSurgeryRow]);
  }
  const removePatPreRow=(i:number)=>{
    if (nurseValue.length > 1) {
      let nurses = [...nurseValue].filter((row: any, row_idx: number) => row_idx != i)
      setNurseValue([...nurses]);
  } else {
    setNurseValue([{ ...createSurigicalNurseFormat }]);
  }
  }
  const removeAssNurseRow=(i:number)=>{
    if (assNurseValue.length > 1) {
      let nurses = [...assNurseValue].filter((row: any, row_idx: number) => row_idx != i)
      setAssNurseValue([...nurses]);
  } else {
    setAssNurseValue([{ ...createSurigicalAssNurseFormat }]);
  }
  }
  const removeSurgeryName=(i:number)=>{
    if (surgeryName.length > 1) {
      let surgery = [...surgeryName].filter((row: any, row_idx: number) => row_idx != i)
      setsurgeryName([...surgery]);
  } else {
    setsurgeryName([{ ...SurgeryNamesaveFormat }]);
  }
  }
  const handleConsultantname=(selectedItem:any, idx:number, item:any)=>{
    console.log(selectedItem)
    let local = [...consultant]
    local[idx]={...item,selectedConsultant:selectedItem}
    setConsultant(local)
  }
  const handleAssConsultantname=(selectedItem:any, idx:number, item:any)=>{
    console.log(selectedItem)
    let local = [...AssConsultant]
    local[idx]={...item,selectedConsultant:selectedItem}
    setAssConsultant(local)
  }
  const addConsultantRow=()=>{
    const updatedconsultantRow = [...consultant, { ...consultantSavaFormat }];
    setConsultant([...updatedconsultantRow]);
  }
  const addAssConsultantRow=()=>{
    const updatedAssConsultantRow = [...AssConsultant, { ...AssConsultantSavaFormat }];
    setAssConsultant([...updatedAssConsultantRow]);
  }
  const RemoveConsultantRow=(idx:number)=>{
    if (consultant.length > 1) {
      let consultantname = [...consultant].filter((row: any, row_idx: number) => row_idx != idx)
      setConsultant([...consultantname]);
  } else {
    setConsultant([{ ...consultantSavaFormat }]);
  }
  }
  const RemoveAssConsultantRow=(idx:number)=>{
    if (AssConsultant.length > 1) {
      let AssConsultantname = [...AssConsultant].filter((row: any, row_idx: number) => row_idx != idx)
      setAssConsultant([...AssConsultantname]);
  } else {
    setAssConsultant([{ ...AssConsultantSavaFormat }]);
  }
  }

  return (
    <>
      <Container className="d-flex flex-column h-100 p-3">
      <Row className="border clinical-general-history-header mt-4 mx-2 py-1 rounded overflow-auto">
                 <Col>
                    {surgeryName.map((item: any, i: number) => {
                        return <Row className="py-1 flex-nowrap" key={i}>
                           <Col md={10}>
                              <Form.Group className=" general-case-sheet-input">
                                <Form.Control value={item.surgeryName} placeholder="" name='surgeryName' id={`${item}${i}`} onChange={(e)=>{handleSurgeryName(e.target.value,i,item)}}/>
                                <label htmlFor={`${item}${i}`}>
                                  Surgery Name
                                </label>
                              </Form.Group>
                            </Col>
                            <Col className="d-flex ">
                                <Col>
                                    <Button variant="success mx-2" onClick={addSurgeryName}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="dark mx-2"onClick={()=>{removeSurgeryName(i)}}  >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    })}
                </Col>
      </Row>

        <Row className="border h-100 border-black mt-4 mx-2 py-3 rounded overflow-auto">
          {
            diagnosis.map((item:any,idx:number)=>{
              return <Col md={6} key={idx}>
              <Form.Group className="mb-3 general-case-sheet-input">
                <Form.Control as="textarea" id={item.fieldName} name={item.fieldName} value={SurgeryTemproryData[item.fieldName]} onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}} placeholder="" rows={4} />
                <label htmlFor={item.fieldName}>
                  {item.name}
                </label>
              </Form.Group>
            </Col>
            })
          }
<Row>
<Row className="border clinical-general-history-header mt-4 mx-2 py-1 rounded overflow-auto">
            <Col md={6}>
            <Row className=" fw-bold"><Col>SURGEON</Col></Row>
              <Row className="py-1 flex-nowrap">
              <Col>
                    {consultant.map((item: any, idx: number) => {
                        return <Row className="py-1 flex-nowrap" key={idx}>
                            <Col md={9}>
                                <AsyncTypeahead
                                    className="min-w-200px typeahead-mark"
                                    filterBy={() => true}
                                    id={`surgen${idx}`}
                                    isLoading={false}
                                    labelKey="name"
                                    minLength={1}
                                    onSearch={() => true}
                                    onInputChange={handleConsultantSearch}
                                    onChange={(selectedItem) => handleConsultantname(selectedItem, idx, item)}
                                    options={Sergonvalue}
                                    placeholder="Surgeon Name"
                                    flip={true}
                                    ref={(component) => item.component = component}
                                    // onBlur={() => item.component.clear()}
                                    selected={item.selectedConsultant}
                                    positionFixed={true}
                                    renderMenuItemChildren={(option: any, { text }) => (
                                        <>
                                            <Highlighter search={text}>{option.name}</Highlighter>
                                        </>
                                    )}
                                />
                            </Col>
                            <Col className="d-flex ">
                                <Col>
                                    <Button variant="success mx-2" onClick={addConsultantRow}>
                                        <FontAwesomeIcon icon={faPlus}  />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="dark mx-2" onClick={()=>{RemoveConsultantRow(idx)}} >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    })}
                </Col>
              </Row>
            </Col>
            <Col md={6}>
            <Row className=" fw-bold"><Col>ASSISISTANT  SERGEON</Col></Row>
              <Row className="py-1 flex-nowrap">
              <Col>
                    {AssConsultant.map((item: any, idx: number) => {
                        return <Row className="py-1 flex-nowrap" key={idx}>
                            <Col md={9}>
                                <AsyncTypeahead
                                    className="min-w-200px typeahead-mark"
                                    filterBy={() => true}
                                    id={`AssSurgen${idx}`}
                                    isLoading={false}
                                    labelKey="name"
                                    minLength={1}
                                    onSearch={() => true}
                                    onInputChange={handleConsultantSearch}
                                    onChange={(selectedItem) => handleAssConsultantname(selectedItem, idx, item)}
                                    options={Sergonvalue}
                                    placeholder="Assistant Surgeon Name"
                                    flip={true}
                                    ref={(component) => item.component = component}
                                    // onBlur={() => item.component.clear()}
                                    selected={item.selectedConsultant}
                                    positionFixed={true}
                                    renderMenuItemChildren={(option: any, { text }) => (
                                        <>
                                            <Highlighter search={text}>{option.name}</Highlighter>
                                        </>
                                    )}
                                />
                            </Col>
                            <Col className="d-flex ">
                                <Col>
                                    <Button variant="success mx-2" onClick={addAssConsultantRow}>
                                        <FontAwesomeIcon icon={faPlus}  />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="dark mx-2" onClick={()=>{RemoveAssConsultantRow(idx)}}>
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
</Row>
          <Row>
          <Row className="border clinical-general-history-header mt-4 mx-2 py-1 rounded overflow-auto">

            <Col md={6}>
            <Row className=" fw-bold"><Col>PATIENT PREPARED BY</Col></Row>
                  {
                    nurseValue.map((item:any,i:number)=>{
                   return   <Row className="py-2 flex-nowrap" key={i}>
                        <Col md={9}>
                          <Form.Group className=" general-case-sheet-input">
                            <Form.Control type="text" value={item.nurse}  name="nurse" placeholder="Nurse Name" onChange={(e)=>{handleMainNurse(e.target.value,i,item)}}/>
                          
                          </Form.Group>
                        </Col>
                        <Col className="d-flex ">
                          <Col>
                            <Button variant="success mx-2" onClick={addPatPreRow}>
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </Col>
                          <Col>
                            <Button variant="dark mx-2" onClick={() => removePatPreRow(i)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Col>
                        </Col>
                      </Row>
                    })
                  }
            </Col>
            <Col md={6}>
            <Row className=" fw-bold"><Col>ASSISTANT NURSE</Col></Row>
             {
              assNurseValue.map((item:any,i:number)=>{
                return (
                  <Row className="py-2 flex-nowrap" key={i}>
                    <Col md={9}>
                        <Form.Group className=" general-case-sheet-input">
                          <Form.Control type="text" value={item.nurse} name="nurse" placeholder="Assistant Nurse Name" onChange={(e)=>{handleAssNurse(e.target.value,i,item)}} />
                        
                        </Form.Group>
                      </Col>
                      <Col className="d-flex">
                        <Col>
                          <Button variant="success mx-2" onClick={addAssNurseRow} >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </Col>
                        <Col>
                          <Button variant="dark mx-2"  onClick={() => removeAssNurseRow(i)}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </Button>
                        </Col>
                      </Col>
                    </Row>
                )
              })
             } 

            </Col>
          </Row>
          <Row>
            <Col>
            <Form.Group className=" general-case-sheet-input m-3">
                    <Form.Control type="text" value={SurgeryTemproryData.anestDoc} id="anestDoc" name="anestDoc" placeholder=""  onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}}/>
                    <label htmlFor="anestDoc">
                     ANESTHESIOLOGIST
                    </label>
                  </Form.Group>
            </Col>
            <Col>
            </Col>
          </Row>
        </Row>
        </Row>
      </Container>
    </>
  );
};

export default Surgery;
