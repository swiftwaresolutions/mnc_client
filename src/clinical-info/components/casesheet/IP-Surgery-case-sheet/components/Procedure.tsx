import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { progress } from '../data/SurgeryData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons'

const Procedure = ({SurgeryTemproryData,handleSurgeryData,handleSearchTemplateOpen,handleOpenCreateTemplate}:any) => {
  return (
    <>
      <Container className='d-flex flex-column h-100 p-3'>
      <Row className="border h-100 border-black mt-4 mx-2 py-3 rounded overflow-auto">
        <Row>
        <Row>
            <Col>
              <Row className="py-3    align-items-center">
                <Col className="fw-bold">Surgery date and time</Col>
                <Col>
                  <Form.Group className=" general-case-sheet-input">
                    <Form.Control type="date" name='surgeryDate' id='surgeryDate' value={SurgeryTemproryData.surgeryDate} placeholder="" onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}}/>
                    <label htmlFor="surgeryDate">
                      Date
                    </label>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className=" general-case-sheet-input">
                    <Form.Control type="time" name='surgeryTime' id='surgeryTime' value={SurgeryTemproryData.surgeryTime} placeholder="" onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}} />
                    <label htmlFor="surgeryTime">
                      Time
                    </label>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row className="py-3    align-items-center">
                <Col className="fw-bold" md={4}>Duration of surgery</Col>
                <Col md={4}>
                  <Form.Group className=" general-case-sheet-input">
                    <Form.Control value={SurgeryTemproryData.durSurgery} placeholder="" name='durSurgery' id='durSurgery' onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}}/>
                    <label htmlFor="durSurgery">
                      Hours
                    </label>
                  </Form.Group>
                </Col>
                <Col className="d-none">
                  {/* <Form.Group className=" general-case-sheet-input">
                    <Form.Control value="" placeholder="" name='Minutes' id='Minutes'/>
                    <label htmlFor="Minutes">
                      Minutes
                    </label>
                  </Form.Group> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Row>
        {
          progress.map((item:any,idx:number)=>{
            return(
          <Row key={idx}>
            <Col md={10}>
              <Form.Group className="mb-3 general-case-sheet-input">
                <Form.Control as="textarea" value={SurgeryTemproryData[item.fieldName]} placeholder="" rows={8} name={item.fieldName} id={item.fieldName} onChange={(e)=>{handleSurgeryData(e.target.value,e.target.name)}}/>
                <label htmlFor={item.fieldName}>
                 {item.name}
                </label>
              </Form.Group>
            </Col>
            <Col className="d-flex ">
                       <Col>
                            <Button variant="success mx-2" onClick={() => handleSearchTemplateOpen(item.id, item.fieldName)}>
                              <FontAwesomeIcon icon={faEye}  />
                             </Button>
                          </Col>
                        <Col>
                       <Button variant="dark mx-2"onClick={() => handleOpenCreateTemplate(item.id)}  >
                           <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                 </Col>
             </Row>
            )
          })
        }
      </Row>
      </Container>
    </>
  )
}

export default Procedure