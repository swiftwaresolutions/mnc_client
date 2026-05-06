
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Form, Table } from 'react-bootstrap'
import { toastSuccessBounceDark } from '../../../../../utils/toast';


const PrevOutsideLab = ({ show, onHide, handleError, patientDetails, laboratoryApiService, labDetails, handleInputChange, loginUser }: any) => {
    const [prevOutsideLabNameList, setPrevOutsideLabNameList] = useState<any[]>([]);
    const [prevOutsideInvNameList, setPrevOutsideInvNameList] = useState<any[]>([]);
    const [selectedList, setSelectedList] = useState<any>({})
    // const [selectedInvList, setSelectedInvList] = useState<any>({})
    const [prevOutsideLabList, setPrevOutsideLabList] = useState<any[]>([])
    const [prevOutsideInvList, setPrevOutsideInvList] = useState<any[]>([])
    const [currentDateTime, setCurrentDateTime] = useState<string>("")
    const fetchPreviousOutsideLab = async () => {
        try {
            if (patientDetails.visitId) {
                let prevOutsideLabListResponse = await laboratoryApiService.fetchPrevOutsideLabByVstId(String(patientDetails.visitId))
                prevOutsideLabListResponse = [...prevOutsideLabListResponse]
                setPrevOutsideLabNameList([...prevOutsideLabListResponse])
            }
        } catch (error) {
            handleError(error)
        }
    }

    const fetchPreviousOutsideInv = async () => {
        try {
            if (patientDetails.visitId) {
                let prevOutsideInvListResponse = await laboratoryApiService.fetchPrevOutsideInvByVstId(String(patientDetails.visitId))
                prevOutsideInvListResponse = [...prevOutsideInvListResponse]
                setPrevOutsideInvNameList([...prevOutsideInvListResponse])
            }
        } catch (error) {
            handleError(error)
        }
    }

    const fetchPrevOutsideInvDetailsByDisplayNo = async (display : string) => {
        if (display == "0") return;
        const data = [...prevOutsideInvNameList].find((invList) => invList.display == display)
        console.log(data)
        setSelectedList(data)
        let invResponse = await laboratoryApiService.fetchPrevOutsideInvResultDetailsId(display)

        const finalResponse = invResponse.reduce((acc: any, cur : any) => {
            let dept = acc.find((dept:any) => dept.deptId === cur.deptId)
            if(!dept) {
                dept = { deptName : cur.deptName, deptId : cur.deptId, invList : [] }
                acc.push(dept)
            }
            let inv = dept.invList.find((inv: any) => inv.invId === cur.invId)
            if (!inv) {
                inv = {invId : cur.invId, invName : cur.invName, findings : cur.findings}
                dept.invList.push(inv)
            }
            return acc
        }, [])
        setPrevOutsideInvList(finalResponse)
        setPrevOutsideLabList([])

    }

    const fetchPrevOutsideLabDetailsByDisplayNo = async (display: string) => {
        if (display == "0") return;
        const data = [...prevOutsideLabNameList].find((labList)=>labList.display==display)
        setSelectedList(data)
        let response = await laboratoryApiService.fetchPrevOutsideLabResultDetailsId(display); 

        const finalResponse = response.reduce((acc: any, cur: any) => { 
            let dept = acc.find((dept: any) => dept.deptId === cur.deptId)

            if (!dept) {
                dept = { deptName: cur.deptName, deptId: cur.deptId, testList: [] }
                acc.push(dept)
            }
            let test = dept.testList.find((test: any) => test.testId === cur.testId)
            if (!test) {
                test = { testId: cur.testId, testName: cur.testName, notes: cur.notes, fieldList: [] }
                dept.testList.push(test)
            }
            let testField = test.fieldList.find((field: any) => field.fldId === cur.fldId)
            if (!testField) {
                testField = { fldId: cur.fldId, fieldName: cur.fieldName, value: cur.value, unit: cur.unit, lowerValue: cur.lowerValue, upperValue: cur.upperValue }
                test.fieldList.push(testField)
            }
            return acc
        }, [])
        setPrevOutsideLabList(finalResponse)
        setPrevOutsideInvList([])
    }
    const handleSelectedList = (value:string,fieldName:string) => {
        console.log(value, fieldName)
        setSelectedList((prev :any) => ({...prev,[fieldName] : value}))
    }

    const handleInvFindings = (value : string, deptId: number, invId : number) => {
        const data = [...prevOutsideInvList]
        const dept = data.find(dept => dept.deptId === deptId)
        if (dept) {
            const inv = dept.invList.find((inve:any) => inve.invId === invId)
            if(inv) {
                inv.findings = value
            }
        }
        setPrevOutsideInvList(data)
    }

    const handleNotes =  (value: string, deptId : number, testId : number) => {
        const data =[...prevOutsideLabList]
        const dept = data.find(dept => dept.deptId === deptId)
        if (dept) {
            const test = dept.testList.find((test :any) => test.testId === testId) 
            if (test) {
                test.notes = value
            }
        }
        setPrevOutsideLabList(data)
    }

    const handleTestResultChange = (value: string, deptId: number, testId: number, fldId: number) => {
        const data =[...prevOutsideLabList]
        const department = data.find(dept => dept.deptId === deptId);

        if (department) {
            
            const test = department.testList.find((t:any) => t.testId === testId);

            if (test) {
                
                
                const field = test.fieldList.find((f:any) => f.fldId === fldId);

                if (field) {
                
                    field.value = value;
                    console.log(`Updated fldId ${fldId} to ${value} in test ${test.testName}`);
                } else {
                    console.log(`Field with fldId ${fldId} not found in test ${test.testName}`);
                }
            } else {
                console.log(`Test with testId ${testId} not found in department ${department.deptName}`);
            }
            setPrevOutsideLabList(data)
        } else {
            console.log(`Department with deptId ${deptId} not found`);
        }
    }
    const deleteOutsideLabResult = async () => {
        try {
            const data ={...selectedList}
            const id = data.display
            await laboratoryApiService.deleteOutsideLabResultById(id);
            toastSuccessBounceDark("Lab Result Deleted Successfully")
            fetchPreviousOutsideLab();
            setPrevOutsideLabList([]);
            setSelectedList({})
        } catch (error) {
            handleError(error)
        }
    }
    const deleteOutsideInvResult = async () => {
        try {
            const data ={...selectedList}
            const id = data.display
            await laboratoryApiService.deleteOutsideLabResultById(id);
            toastSuccessBounceDark("Inv Result Deleted Successfully")
            fetchPreviousOutsideInv();
            setPrevOutsideInvList([]);
            setSelectedList({})
        } catch (error) {
            handleError(error)
        }
    }
    const updatPrevOutsideInv =  async () => {
        try {
            const data ={...selectedList}
            console.log(data)
            let payload={
                display: data.display,
                patId: patientDetails.patientId,
                vstId: patientDetails.visitId,
                ipId: 0,
                labName: data.labName,
                consultantId: loginUser.id,
                type: 2,
                createOutsideInvDetailsRequestList:[],
                suggestDoc: data.suggestDoc,
                selDateTime : data.selDateTime
            }
            console.log(payload)
            const createOutsideInvDetailsRequestList = [...prevOutsideInvList].reduce((acc,cur) => {
                const invList = [...cur.invList].map((inv) => {
                    return {deptId:cur.deptId, invId : inv.invId,findings: inv.findings}
                })
                acc.push(...invList)
                return acc
            },[])
            payload.createOutsideInvDetailsRequestList = createOutsideInvDetailsRequestList
            await laboratoryApiService.updatePrevOutsideInvDetails(data.display,payload)
            toastSuccessBounceDark("Inv Details Updated Successfully")
            fetchPreviousOutsideInv();
        } catch (error) {
            handleError(error)
        } 
    }
    const updatePrevOusideLab= async ()=>{
        try {
            const data ={...selectedList}
            console.log(data)
            let payload={
                display: data.display,
                patId: patientDetails.patientId,
                vstId: patientDetails.visitId,
                ipId: 0,
                labName: data.labName,
                consultantId: loginUser.id,
                type: 1,
                createOutsideLabResultRequestList:[],
                suggestDoc: data.suggestDoc,
                selDateTime : data.selDateTime
            }
            const createOutsideLabResultRequestList = [...prevOutsideLabList].reduce((acc,curr)=>{
                const testList = [...curr.testList].map((test)=>{
                    const createOutsideLabResultDetailsRequestList =[...test.fieldList].map((field)=>{
                        return {testId:test.testId,fldId:field.fldId,value:field.value}
                    })
                    
                    return {deptId:curr.deptId,testId:test.testId,notes:test.notes ,createOutsideLabResultDetailsRequestList}
                })
                acc.push(...testList)
                return acc;
            },[])
            payload.createOutsideLabResultRequestList = createOutsideLabResultRequestList;
            await laboratoryApiService.updatePrevOutsideLabResult(data.display,payload)
            toastSuccessBounceDark("Lab Result Updated Successfully")
            fetchPreviousOutsideLab();
            console.log("Final ",payload)
        } catch (error) {
            handleError(error)
        } 
    }
    useEffect(() => {
        fetchPreviousOutsideLab();
        fetchPreviousOutsideInv();
        setPrevOutsideInvList([]);
        setPrevOutsideLabList([]);
        setSelectedList({})
    }, [show])
    useEffect(() => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16); 
      setCurrentDateTime(formattedDateTime);
    }, []);

    return (
        <>
            <Modal
                {...{ show }}
                size='xl'
                {...{ onHide }}
            >
                <Modal.Header>
                    <Row className='justify-content-center'>
                        <Col md="6">
                            <Form.Select onChange={(e) => fetchPrevOutsideInvDetailsByDisplayNo(e.target.value)}>
                                <option value="0">SELECT INVESTIGATION</option>
                                {prevOutsideInvNameList?.map((item: any, item_Idx: number) => (
                                    <option key={item_Idx} value={item.display}>{item.display}-{item.labName}-{item.suggestDoc}</option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md="6">
                            <Form.Select onChange={(e) => fetchPrevOutsideLabDetailsByDisplayNo(e.target.value)}>
                                <option value="0">SELECT lABORATORY</option>
                                {prevOutsideLabNameList?.map((item: any, item_Idx: number) => (
                                    <option key={item_Idx} value={item.display}>{item.display}-{item.labName}-{item.suggestDoc}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='justify-content-around w-100'>
                        <Col className='ps-5 text-end text-danger'>
                            <Modal.Title id="contained-modal-title-vcenter text-nowrap">UPDATE LAB / INV SCREEN</Modal.Title>
                        </Col>
                        <Col className='text-end'><Button variant='danger' onClick={onHide}>Close</Button></Col>
                    </Row>
                    
                </Modal.Header>
                <Modal.Body className='vh-75 overflow-auto'>
                    <Row className='m-3 text-center fw-bold'>
                        <Col>LAB DETAILS</Col>
                    </Row>
                    <Row>
                        {
                            labDetails.map((det: any, idx: number) => (
                                <Col md={4} key={idx}>
                                    <Row>
                                        <Col xs={6} sm={4} className='text-center fw-bold'>{det.name} :</Col>
                                        {
                                            det.fieldName === "selDateTime" ? 
                                            <Col xs={6} sm={8} className="general-case-sheet-input">
                                                <Form.Group>
                                                <Form.Control 
                                                    type='datetime-local'
                                                    placeholder=''
                                                    value={selectedList[det.fieldName] == "0000-00-00 00:00" ? "" : selectedList[det.fieldName]}
                                                    onChange={(e) => handleSelectedList(e.target.value, det.fieldName)}
                                                    max={currentDateTime}
                                                />
                                                <label className="font-size-11px">SELECT DATE</label>
                                                </Form.Group>
                                            </Col>  
                                            :
                                            <Col xs={6} sm={8} className='text-center'>
                                                <Form.Group>
                                                    <Form.Control
                                                        placeholder={det.name}
                                                        size='sm'
                                                        value={selectedList[det.fieldName]}
                                                        onChange={(e) => handleSelectedList(e.target.value,det.fieldName)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        }
                                        
                                    </Row>
                                </Col>
                            ))
                        }
                    </Row>
                    <Row>
                        {prevOutsideLabList.length >0 &&
                            <Table striped hover>
                                <thead className='table-dark border sticky-top fs-11px'>
                                    <tr>
                                        <th className='text-center'>S NO</th>
                                        <th className='text-center'>TEST NAME</th>
                                        <th className='text-center'>RESULT</th>
                                        <th className='text-center'>Unit</th>
                                        <th className='text-center'>Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        prevOutsideLabList.map((deptList: any, deptIdx: number) => (
                                            <>
                                                <tr key={`dept-${deptIdx}`}>
                                                    <td colSpan={5} className='fw-bold text-primary text-center'>{deptList.deptName}</td>
                                                </tr>
                                                {
                                                    deptList.testList.map((tstList: any, tstIdx: number) => (
                                                        <>
                                                            <tr key={`test-${tstIdx}`}>
                                                                <td colSpan={4} className='fw-bold px-3 text-uppercase'>{tstList.testName}</td>
                                                                <td>
                                                                    <Form.Group className="general-case-sheet-input" controlId={`temp_notes`}>
                                                                        <Form.Control
                                                                            size='sm'
                                                                            value={tstList.notes}
                                                                            placeholder=''
                                                                            onChange = { (e) => handleNotes(e.target.value,deptList.deptId, tstList.testId)}
                                                                        />
                                                                        <label htmlFor="temp_notes">Notes</label>
                                                                    </Form.Group>
                                                                </td>
                                                            </tr>
                                                            {
                                                                tstList.fieldList.map((fldList: any, fldIdx: number) => (
                                                                    <>
                                                                        <tr key={`field-${fldIdx}`}>
                                                                            <td>{fldIdx + 1}</td>
                                                                            <td>{fldList.fieldName}</td>
                                                                            <td>
                                                                                <Form.Group>
                                                                                    <Form.Control
                                                                                        value={fldList.value}
                                                                                        onChange={(e) => handleTestResultChange(e.target.value, deptList.deptId, tstList.testId, fldList.fldId)}
                                                                                    />
                                                                                </Form.Group>
                                                                            </td>
                                                                            <td >{fldList.unit}</td>
                                                                            <td>{fldList.lowerValue} - {fldList.upperValue}</td>
                                                                        </tr>
                                                                    </>
                                                                ))
                                                            }
                                                        </>
                                                    ))
                                                }
                                            </>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        }
                    </Row>
                    <Row>
                        {
                            prevOutsideInvList.map((deptList : any, deptIdx: number) => (
                                <> 
                                    <Row key={deptIdx}>
                                        <Col >
                                            <Row className='m-3 text-center fw-bold text-uppercase text-primary'>
                                                <Col>{deptList.deptName}</Col>
                                            </Row>
                                            {
                                                deptList.invList.map((invList: any, invIdx: number) => (
                                                    <>
                                                        <Row key={invIdx}>
                                                            <Col>
                                                                <Form.Group className='mb-3 general-case-sheet-input'>
                                                                    <Form.Control as= "textarea" autoFocus = {true}
                                                                    rows={4}
                                                                    placeholder=''
                                                                    value={invList.findings}
                                                                    onChange = { (e) => handleInvFindings(e.target.value,deptList.deptId, invList.invId)}
                                                                    />
                                                                    <label >{invList.invName}</label>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                    
                                </>
                            ))
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {
                        prevOutsideLabList.length >0 && 
                        <Row className='w-100'>
                            <Col className='text-end'>
                                <Button variant='outline-danger' className='button_style py-1 px-5  mx-3' onClick={deleteOutsideLabResult}>Delete</Button>
                            </Col>
                            <Col>
                                <Button variant='primary' className='button_style py-1 px-5  mx-3' onClick={updatePrevOusideLab}>UPDATE Lab</Button>
                            </Col>
                        </Row>  
                    }
                    {
                        prevOutsideInvList.length > 0 &&
                        <Row className='w-100'>
                            <Col className='text-end'>
                                <Button variant='outline-danger' className='button_style py-1 px-5  mx-3' onClick={deleteOutsideInvResult}>Delete</Button>
                            </Col>
                            <Col>
                                <Button variant='primary' className='button_style py-1 px-5  mx-3' onClick={updatPrevOutsideInv}>UPDATE Inv</Button>
                            </Col>
                        </Row> 
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PrevOutsideLab