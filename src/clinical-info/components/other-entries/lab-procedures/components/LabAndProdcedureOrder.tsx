import React from 'react'
import { Button, Col, Modal, Row, Table } from 'react-bootstrap'
import { InvOrder, PrevInvOrderedDetails, PrevLabOrderedDetails } from '../LabAndProcedure'



const LabAndProdcedureOrder = ({ preDiscount, DeleteLabAndProcedureOrderDiscount, pastDetails, show, onHide, deleteLabOrderByLabId, deleteInvestigationOrderByProcId, deleteLaboratoryOrdersByPatId, deleteInvestigationOrdersByPatId, deleteInvestigationOrderByorderId, loginUserId, patientDetails }: any) => {
  const pastLabDetails: PrevLabOrderedDetails[] = pastDetails.pastLabDetails
  const pastInvDetails: InvOrder[] = pastDetails.pastInvDetails

  return (
    <Modal
      {...{ show: show, onHide: onHide }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className=''
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter" className='fw-bold w-100 d-flex justify-content-between'>
          ORDER VIEW / CANCEL
          <Button variant='danger' onClick={onHide} className='py-1'>X</Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='vh-70 overflow-auto'>
        <Row className='py-2'>
          <Col>
            <h4 className='text-center fw-bold m-0'>INVESTIGATION ORDERS</h4>
          </Col>
          <Col className='text-center'>
            <Button variant='danger' size='sm'
              disabled={!pastInvDetails?.some((o: InvOrder) => o.orderUserId === loginUserId)}
              title='Only Same user can Delete'
              onClick={() => deleteInvestigationOrdersByPatId(patientDetails?.patientId)}>Cancel All Investigation Orders</Button>
          </Col>
        </Row>
        {pastInvDetails?.length === 0 && (
          <Row className='justify-content-center py-4'>
            <Col xs="10" className='text-center text-muted'>No investigation orders found.</Col>
          </Row>
        )}

        {pastInvDetails?.map((order: InvOrder) => (
          <Row className='justify-content-center border rounded mb-3 overflow-hidden' key={order.orderId}>
            <Col xs="12" className='bg-dark text-white py-2 px-3 d-flex flex-wrap justify-content-between align-items-center'>
              <div className='d-flex flex-wrap gap-3'>
                <span className='fw-bold'>{order.orderDisplay}</span>
                <span>Dr. {order.doctorName}</span>
                <span className='text-warning'>{order.deptName}</span>
              </div>
              <div className='d-flex align-items-center gap-2'>
                <span className='fw-bold text-success'>Total: Rs.{order.totalAmt}</span>
                {order.orderUserId === loginUserId && (
                  <Button variant='danger' size='sm' className='py-0 px-2' onClick={() => deleteInvestigationOrderByorderId(order.orderId)}>Delete Order</Button>
                )}
              </div>
            </Col>
            <Col xs="12" className='p-0'>
              <Table hover size='sm' className='mb-0'>
                <thead className='table-secondary'>
                  <tr>
                    <th className='w-50px'>Sl.No</th>
                    <th>Particulars</th>
                    <th className='w-75px text-center'>Units</th>
                    <th className='w-100px'>Date</th>
                    <th className='w-75px text-end'>Rate</th>
                    <th className='w-75px text-center'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {order.details?.map((item: PrevInvOrderedDetails, idx: number) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.procName}</td>
                      <td className='text-center'>{item.units}</td>
                      <td>{item.date}</td>
                      <td className='text-end'>Rs.{item.rate}</td>
                      <td className='text-center'>
                        <Button variant='warning' className='py-0 px-2' size='sm'
                          disabled={order.orderUserId !== loginUserId}
                          // title='Only Same user can Delete'
                          onClick={() => deleteInvestigationOrderByProcId(item?.id)}>Del</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ))}

      </Modal.Body>
      <Modal.Footer className='w-100'>
        {/* <Row className='w-auto flex-grow-1'>
          <Col>
            <Row>
              <Col className=' text-center py-2 text-'>Lab Order Total : <span className='fw-bold'>Rs.{pastLabDetails.reduce((acc, cur) => (acc + cur.rate), 0)}</span></Col>
              <Col className='text-center py-2 flex-grow' >Lab Disc. Total : <span className='fw-bold'>Rs.{preDiscount.reduce((acc: number, cur: any) => (acc + cur.discAmt), 0)}</span></Col>
            </Row>
          </Col>
          <Col className='flex-grow-0 text-nowrap'>
            <Button variant='warning' onClick={() => DeleteLabAndProcedureOrderDiscount(patientDetails?.patientId)}>Delete Patient Discount</Button>
          </Col>
        </Row> */}
      </Modal.Footer>
    </Modal>
  )
}

export default LabAndProdcedureOrder