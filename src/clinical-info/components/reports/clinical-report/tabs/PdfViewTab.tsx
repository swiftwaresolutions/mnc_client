import { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap"
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";

const PdfViewTab = ({ investigationPdf }: any) => {

  const [pdfModel, setPdfModel] = useState(false)
  const [currentPdf, setCurrentPdf] = useState<any>({})

  const handleSelectPdf = (visitIdx: number, idx: number) => {
    setCurrentPdf(investigationPdf[visitIdx].items[idx])
    setPdfModel(true)
  }
  const serverAddress = window.location.hostname;
  const { port: serverPort } = useSelector((s: RootState) => s.appReducer.organization)
  return (
    <>
      <Row className="h-100 p-2">
        <Col className="h-100 overflow-auto">
          <Row >
            <h6 className="text-success text-decoration-underline link-offset-2">UPLOADED PDF's :</h6>
          </Row>
          <Row>
            <Col>
              {
                investigationPdf && investigationPdf.map((visit: any, vstIdx: number) => {
                  return (
                    <Row key={vstIdx} className="pb-1">
                      <Col>
                        <h6 className="">Visit Date: {visit.visitedDate}</h6>
                        {
                          visit.items && visit.items.map((pdfItem: any, idx: number) => (
                            <Row key={idx}>
                              <Col className="pb-1 text-capitalize fw-medium cursor-pointer" >
                                {idx + 1}.
                                <button
                                  onClick={(e) => { e.preventDefault(); handleSelectPdf(vstIdx, idx) }}
                                  className="border-0 bg-transparent text-decoration-underline link-offset-2 link-primary"
                                >
                                  <span className="text-primary"> {pdfItem.fileName}</span>
                                </button>
                                <span className=" fs-11px text-secondary"> {`( ${pdfItem.invName} / ${pdfItem.createdDate} ${pdfItem.createdTime})`}</span>
                              </Col>
                            </Row>
                          ))
                        }
                      </Col>
                    </Row>
                  )
                })
              }
            </Col>
          </Row>
        </Col >
      </Row >
      <Modal show={pdfModel} onHide={() => setPdfModel(false)} backdrop="static"
        className="d-flex flex-column h-100"
        dialogClassName="my-2 mx-auto bg-light rounded shadow d-flex flex-column vw-70 max-w-xxl h-100 flex-grow-1 overflow-auto"
        contentClassName="w-100 flex-grow-1 overflow-auto"
      >
        <Modal.Header closeButton className="py-2">
          <div className="">
            <h5 className="fw-medium text-capitalize m-0">
              <span className="text-primary">File Name: </span>
              {currentPdf.fileName} {`(${currentPdf.createdDate} ${currentPdf.createdTime})`}</h5>
          </div>
        </Modal.Header>
        <Modal.Body className="user-select-none">
          <embed
            src={`http://${serverAddress}:${serverPort}/gdh/${currentPdf.path + "/" + currentPdf.storedFileName}`}
            type="application/pdf"
            className="h-100 w-100"
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PdfViewTab;