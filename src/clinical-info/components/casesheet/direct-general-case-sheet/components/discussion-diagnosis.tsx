import { faPlus, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import CaseSheetApiService from '../../../../../api/case-sheet/case-sheet-api-service'

const Discussion = ({ setDiagnosisRow, diagnosisRow, diagnosisData, temporaryCaseSheet, handleInputChange, handleOpenSearchTemplate, handleOpenCreateTemplate, createDiagnosisDetailsRequestListModel }: any) => {

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;

    const [DiagnosisOption, setDiagnosisOption] = useState<any>([])

    const addDiagnosisRow = () => {
        const updatedDiagnosisRow = [...diagnosisRow, { ...createDiagnosisDetailsRequestListModel }];
        setDiagnosisRow([...updatedDiagnosisRow]);
    };
    const removeDiagnosisRow = (idx: number) => {
        if (diagnosisRow.length > 1) {
            let otherDiagnosis = [...diagnosisRow].filter((row: any, row_idx: number) => row_idx != idx)
            setDiagnosisRow([...otherDiagnosis]);
        } else {
            setDiagnosisRow([{ ...createDiagnosisDetailsRequestListModel }]);
        }
    };

    const handleDiagnosisSearch = async (query: string) => {
        try {
            let diagnosisResponse = await caseSheetApiService.getDiagnosisDetails(query)
            setDiagnosisOption(diagnosisResponse)
        } catch (error) {

        }
    }

    const handleTypeheadDiagnosisSelect = (selected: any[], idx: number, item: any) => {
        item.selectedDiagnosis = selected
        diagnosisRow[idx] = item
        setDiagnosisRow([...diagnosisRow])
    }

    return (
        <>

            <Container className="d-flex flex-column h-100 border border-black rounded py-2 overflow-auto">
                <Row className="border clinical-general-history-header mt-4 mx-2 py-1 rounded overflow-auto">
                    <Col>
                        {diagnosisRow.map((item: any, idx: number) => {
                            return <Row className="py-1" key={idx}>
                                <Col >
                                    <AsyncTypeahead
                                        autoFocus
                                        className="min-w-200px typeahead-mark"
                                        filterBy={() => true}
                                        id={`diagnosis_${idx}`}
                                        isLoading={false}
                                        labelKey="name"
                                        minLength={2}
                                        size='sm'
                                        onSearch={handleDiagnosisSearch}
                                        onChange={(selectedItem) => handleTypeheadDiagnosisSelect(selectedItem, idx, item)}
                                        options={DiagnosisOption}
                                        placeholder="DIAGNOSIS"
                                        flip={true}
                                        selected={item.selectedDiagnosis}
                                        positionFixed={true}
                                        renderMenuItemChildren={(option: any, { text }) => (
                                            <>
                                                <Highlighter search={text}>{option.name}</Highlighter>
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col className="d-flex flex-grow-0">
                                    <Col className="px-2">
                                        <Button  size='sm' variant="success" onClick={() => addDiagnosisRow()}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                    </Col>
                                    <Col className="px-2">
                                        <Button  size='sm' variant="dark" onClick={() => removeDiagnosisRow(idx)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </Col>
                                </Col>
                            </Row>
                        })}
                    </Col>
                </Row>
                <Row className="  h-100 mt-4 mx-2 py-3 flex-column">
                    <Col className="my-1" >
                        {diagnosisData.map((data: any, idx: any) => (
                            <Row key={idx}>
                                <Col>
                                    <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                                        <Form.Control as="textarea"
                                            value={temporaryCaseSheet[data.fieldName]}
                                            onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                                            placeholder='' rows={4}
                                        />
                                        <label htmlFor={data.id}>{data.name}</label>
                                    </Form.Group>
                                </Col>
                                <Col className="d-flex flex-grow-0">
                                    <Col className="px-2">
                                        <Button variant="dark" tabIndex={2} onClick={() => handleOpenSearchTemplate(data.id)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                    </Col>
                                    <Col className="px-2">
                                        <Button variant="success" tabIndex={2} onClick={() => handleOpenCreateTemplate(data.id)}>
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

    )
}

export default Discussion