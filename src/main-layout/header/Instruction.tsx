import React from 'react';
import { Accordion, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faPrescriptionBottleMedical, 
  faFlask,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const Instruction = () => {
  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4 text-primary">Patient Management Instructions</h3>

      <Accordion defaultActiveKey="0" flush>

        {/* 1. Patient List Screen */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FontAwesomeIcon icon={faUserMd} className="me-2 text-success" />
            Patient List Screen
          </Accordion.Header>
          <Accordion.Body>
            <Card className="p-3 mb-3 shadow-sm border-info">
              <ul className="mb-0">
{/* 
                <li>
                  Only patients belonging to the logged-in doctor are visible. 
                  General doctors can view all patients.
                </li> */}

                <li>
                  <strong>Module Color Configuration:</strong> 
                  The color coding for Case Sheet, Prescription, Laboratory, and Vitals 
                  is configured based on the logged-in doctor.
                </li>
{/* 
                <li>
                  <strong>Patients Categories:</strong>
                  <div className="mt-2">
                    <Badge bg="danger" className="me-2">Pending</Badge> Not yet received treatment.<br/>
                    <Badge bg="warning" className="me-2">In Progress</Badge> Treatment in progress.<br/>
                    <Badge bg="success" className="me-2">Completed</Badge> Treatment completed.<br/>
                    <Badge bg="secondary" className="me-2">All</Badge> Displays all patients (default).
                  </div>
                </li>

                <li>
                  <strong>Patient Transfer:</strong> 
                  If a patient is not visible in your list, verify their active location and request transfer if required.
                </li> */}

              </ul>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

        {/* 2. Prescription */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="me-2 text-warning" />
            Prescription Screen
          </Accordion.Header>
          <Accordion.Body>
            <Card className="p-3 mb-3 shadow-sm border-warning">
              <ul className="mb-0">

                <li>
                  <strong>Auto Load Previous Medicines: </strong> 
                  Previously prescribed medicines for the logged-in doctor are automatically populated.
                </li>

                <li>
                  <strong>Prescription Report: </strong> 
                  A report is available to view all prescriptions for the current patient visit, 
                  filtered doctor-wise.
                </li>

              </ul>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

        {/* 3. Laboratory */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <FontAwesomeIcon icon={faFlask} className="me-2 text-info" />
            Laboratory
          </Accordion.Header>
          <Accordion.Body>
            <Card className="p-3 mb-3 shadow-sm border-info">
              <ul className="mb-0">

                <li>
                  All laboratory procedures are saved in an order-wise format.
                </li>

                <li>
                  Procedures can be viewed/removed in the same order-wise structure for improved tracking and clarity.
                </li>

              </ul>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

        {/* Important Notes */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2 text-danger" />
            Important Notes
          </Accordion.Header>
          <Accordion.Body>
            <Card className="p-3 mb-3 shadow-sm border-danger">
              <ul className="mb-0">
                <li>Ensure all updated features are functioning correctly.</li>
                <li>For any discrepancies or issues, contact the Software Administrator.</li>
              </ul>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>
    </div>
  )
}

export default Instruction;