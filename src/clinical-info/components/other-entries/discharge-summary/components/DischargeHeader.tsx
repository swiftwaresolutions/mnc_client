import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import CaseSheetApiService from '../../../../../api/case-sheet/case-sheet-api-service'

interface DisChargeHeaderProps {
    caseSheetApiService:CaseSheetApiService,setDiagnosisRow: any, createDiagnosisDetailsRequestListModel: any, diagnosisRow: any
}

const DisChargeHeader: React.FC<DisChargeHeaderProps> = ({caseSheetApiService, setDiagnosisRow, createDiagnosisDetailsRequestListModel, diagnosisRow }) => {
    
    const [DiagnosisOption, setDiagnosisOption] = useState<any>([]);
    
    const addDiagnosisRow = () => {
        const updatedDiagnosisRow = [
            ...diagnosisRow,
            { ...createDiagnosisDetailsRequestListModel },
        ];
        setDiagnosisRow([...updatedDiagnosisRow]);
    };

    const removeDiagnosisRow = (idx: number) => {
        if (diagnosisRow.length > 1) {
            let otherDiagnosis = [...diagnosisRow].filter((row: any, row_idx: number) => row_idx != idx);
            setDiagnosisRow([...otherDiagnosis]);
        } else {
            setDiagnosisRow([{ ...createDiagnosisDetailsRequestListModel }]);
        }
    };
    const handleDiagnosisSearch = async (query: string) => {
        try {
            let diagnosisResponse = await caseSheetApiService.getDiagnosisDetails(
                query
            );
            setDiagnosisOption(diagnosisResponse);
        } catch (error) { }
    };
    const handleTypeheadDiagnosisSelect = (
        selected: any[],
        idx: number,
        item: any
    ) => {
        item.selectedDiagnosis = selected;
        diagnosisRow[idx] = item;
        setDiagnosisRow([...diagnosisRow]);
    };

    return (
        <Row className="border rounded clinical-general-history-header overflow-auto py-1 ">
            <Col>
                {diagnosisRow.map((item: any, idx: number) => {
                    return <Row className="py-1" key={idx}>
                        <Col >
                            <AsyncTypeahead
                                className="min-w-200px typeahead-mark"
                                filterBy={() => true}
                                id={`diagnosis_${idx}`}
                                isLoading={false}
                                labelKey="name"
                                minLength={2}
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
                                <Button variant="success" onClick={() => addDiagnosisRow()}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </Col>
                            <Col className="px-2">
                                <Button variant="dark" onClick={() => removeDiagnosisRow(idx)}>
                                    <FontAwesomeIcon icon={faTrash}  />
                                </Button>
                            </Col>
                        </Col>
                    </Row>
                })
                }
            </Col>
        </Row>
    )
}

export default DisChargeHeader
