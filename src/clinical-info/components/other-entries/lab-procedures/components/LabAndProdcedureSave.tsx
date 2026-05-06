import React from 'react'
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap'

const LabAndProdcedureSave = ({ show, onHide, selectedNames, handleSave, disc, saveState, hanldeNumberInputZero, getItemUnits, handleSelectedOrderUnitsChange, handleSelectedOrderUnitsInput }: any) => {

    const getSelectedTotal = () => {
        return selectedNames
            ?.map((item: any) => (Number(item?.rate || 0) * getItemUnits(item)))
            ?.reduce((c: any, n: any) => c + n, 0)
    }

    const handleDiscount = (e: any) => {
        let value = hanldeNumberInputZero(`${Number(e.target.value)}`)
        let totalValue = Number(getSelectedTotal() || 0).toFixed(2)

        if (Number(totalValue) <= Number(value)) {
            disc.setDiscount(0)
        } else {
            disc.setDiscount(value)
        }
    }
    return (
        <Modal
            {...{ onHide, show }}
            size="lg"
            aria-labelledby="contained"
            centered
        >
            <Modal.Header className='d-flex justify-content-around'>
                <Modal.Title id="contained">
                    INVESTIGATION ORDER DETAILS
                </Modal.Title>
                {/* <Button variant='outline-info' onClick={() => handleSave()} disabled={saveState.status}>Save Order Details</Button>
                <Button variant='outline-danger' onClick={onHide} disabled={saveState.status}>Add More Investigation</Button> */}
            </Modal.Header>
            <Modal.Body className='overflow-auto vh-50 '>
                {
                    selectedNames?.map((item: any, idx: number) => {
                        return (
                            <Row key={idx} className="pb-1 align-items-center">
                                <Col md={6} className=''> {item?.name}</Col>
                                <Col md={3} className='d-flex align-items-center justify-content-center gap-1'>
                                    <Button
                                        size='sm'
                                        variant='outline-secondary'
                                        className='py-0 px-2'
                                        onClick={() => handleSelectedOrderUnitsChange(item.id, -1)}
                                    >
                                        -
                                    </Button>
                                    <Form.Control
                                        size='sm'
                                        type='number'
                                        value={getItemUnits(item)}
                                        onChange={(e) => handleSelectedOrderUnitsInput(item.id, e.target.value)}
                                        className='text-center'
                                        style={{ width: 60 }}
                                        min={1}
                                    />
                                    <Button
                                        size='sm'
                                        variant='outline-secondary'
                                        className='py-0 px-2'
                                        onClick={() => handleSelectedOrderUnitsChange(item.id, 1)}
                                    >
                                        +
                                    </Button>
                                </Col>
                                <Col md={3} className='text-end'>{(Number(item?.rate || 0) * getItemUnits(item)).toFixed(2)}</Col>
                            </Row>
                        )
                    })
                }
            </Modal.Body>
            <Modal.Footer className='d-block'>
                {/* <Row>
                    <Col className='fs-16px fw-bold'>DISCOUNT</Col>
                    <Col><Form.Control type='number' value={disc.discount} onChange={(e) => handleDiscount(e)} onFocus={(e) => e.target.select()} /></Col>
                    
                </Row> */}
                <Row className='fs-16px fw-bold text-danger'>
                    <Col md={4} className=''>ORDERED TOTAL AMOUNT</Col>
                    <Col md={2} >{(Number(getSelectedTotal() || 0) - Number(disc?.discount)).toFixed(2)}</Col>
                    <Col md={6} className='d-flex align-items-end justify-content-end gap-2'>
                        <Button variant='outline-danger ' onClick={onHide} disabled={saveState.status}>Add More Investigation</Button>
                        <Button variant='info' onClick={() => handleSave()} disabled={saveState.status}>Save Order Details</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}

export default LabAndProdcedureSave