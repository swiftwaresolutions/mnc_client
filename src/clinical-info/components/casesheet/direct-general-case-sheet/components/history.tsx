import React, { Fragment, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import { Form } from 'react-bootstrap'
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CaseSheetApiService from '../../../../../api/case-sheet/case-sheet-api-service'

const day = [
    {
        name: "Hour"
    },
    {
        name: "Days"
    },
    {
        name: "Weeks"
    },
    {
        name: "Months"
    },
    {
        name: "Years"
    }
]

const History = ({ historyComplaintRow, setHistoryComplaintRow, createComplaintDetailsRequestListModel, historyData, temporaryCaseSheet, handleInputChange, handleOpenSearchTemplate, handleOpenCreateTemplate, hanldeNumberInputZero }: any) => {

    const caseSheetApiService: CaseSheetApiService = new CaseSheetApiService;

    const [complaintDetailListOptions, setComplaintDetailListOptions] = useState<any>([]);

    const addHistoryComplaintRow = () => {
        const updatedHistoryRow = [...historyComplaintRow, { ...createComplaintDetailsRequestListModel }];
        setHistoryComplaintRow([...updatedHistoryRow]);
    };

    const removeHistoryComplaitRow = (idx: number) => {
        if (historyComplaintRow.length > 1) {
            let othersComplaints = [...historyComplaintRow].filter((row: any, row_idx: number) => row_idx != idx)
            setHistoryComplaintRow([...othersComplaints]);
        } else {
            setHistoryComplaintRow([{ ...createComplaintDetailsRequestListModel }]);
        }
    };

    const handleTypeheadComplaintSelect = (selectedItem: any, idx: any, item: any) => {
        item.selectedComplaint = selectedItem
        updateHistoryCompalaintRequestList(idx, item)
    };

    const handleHistoryComplaintPeriodNumber = (e: any, idx: number, item: any) => {
        let { value } = e.target
        value = hanldeNumberInputZero(value)
        item.number = value
        updateHistoryCompalaintRequestList(idx, item)
    }

    const hanldeHistoryComplaintPeriodName = (e: any, idx: number, item: any) => {
        let { value } = e.target
        item.period = value
        updateHistoryCompalaintRequestList(idx, item)
    }

    const updateHistoryCompalaintRequestList = (idx: number, item: any) => {
        historyComplaintRow[idx] = item;
        setHistoryComplaintRow([...historyComplaintRow]);
    }


    const handleSearch = async (query: string) => {
        try {
            const complaintDetail: any = await caseSheetApiService.getComplaintDetails(query);
            setComplaintDetailListOptions([...complaintDetail]);
        } catch (error) {

        }
    };

    return (
        <Fragment>
            <Container className="d-flex flex-column h-100 border border-black rounded py-3 overflow-auto">
                <Row className="border rounded clinical-general-history-header overflow-auto py-1 mx-2">
                <Col className="p-0">
                    {historyComplaintRow.map((item: any, idx: number) => {
                        return <Row className="pt-1 flex-nowrap" key={idx}>
                            <Col >
                                <AsyncTypeahead
                                    className="min-w-200px typeahead-mark"
                                    filterBy={() => true}
                                    id={`presentingComplaints_${idx}`}
                                    isLoading={false}
                                    labelKey="name"
                                    minLength={1}
                                    onSearch={() => true}
                                    size="sm"
                                    onInputChange={handleSearch}
                                    onChange={(selectedItem) => handleTypeheadComplaintSelect(selectedItem, idx, item)}
                                    options={complaintDetailListOptions}
                                    placeholder="PRESENTING COMPLAINTS"
                                    flip={true}
                                    ref={(component) => item.component = component}
                                    selected={item.selectedComplaint}
                                    positionFixed={true}
                                    renderMenuItemChildren={(option: any, { text }) => (
                                        <>
                                            <Highlighter search={text}>{option.name}</Highlighter>
                                        </>
                                    )}
                                />
                            </Col>
                            <Col className="min-w-80px max-w-90px">
                                <Form.Control
                                    value={item.number}
                                    onChange={e => { handleHistoryComplaintPeriodNumber(e, idx, item) }}
                                    placeholder="PERIOD"
                                    type="number"
                                    size="sm"
                                />
                            </Col>
                            <Col  className="min-w-90px max-w-100px">
                                <Form.Select size="sm" value={item.period} onChange={(e) => hanldeHistoryComplaintPeriodName(e, idx, item)}>
                                    {day.map((item: any, idx: any) => (
                                        <option key={idx} value={item.name}>{item.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col  className="min-w-90px max-w-100px d-flex">
                                <Col>
                                    <Button variant="success mx-2" onClick={() => addHistoryComplaintRow()}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="dark mx-2" onClick={() => removeHistoryComplaitRow(idx)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    })}
                </Col>
                </Row>

                <Row className=" h-100  mt-4 mx-2 py-3  row-cols-1">
                    {historyData.map((data: any, idx: any) => (
                        <Col className="my-1" key={idx}>
                            <Row>
                                <Col >
                                    <Form.Group className="mb-3 general-case-sheet-input" controlId={data.id}>
                                        <Form.Control as="textarea" autoFocus={data.id == 1}
                                            value={temporaryCaseSheet[data.fieldName]}
                                            onChange={(e) => handleInputChange(e.target.value, data.fieldName)}
                                            placeholder=''
                                            rows={4} />
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
                        </Col>
                    ))}
                </Row>
            </Container>

        </Fragment>

    )
}

export default History