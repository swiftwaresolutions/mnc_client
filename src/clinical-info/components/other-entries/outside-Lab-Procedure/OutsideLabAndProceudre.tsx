import { Button, Col, Form, FormLabel, Row } from "react-bootstrap"
import ClinicalLayout from "../../ClinicalLayout"
import { useEffect, useState } from "react"
import { LaboratoryApiService } from "../../../../api/laboratory/laboratory-api-service"
import { InvestigationApiService } from "../../../../api/investigation/investigation-api-service"
import LabAndProdcedureTemplate from "../lab-procedures/components/LabAndProdcedureTemplate"
import LabAndProdcedureSave from "../lab-procedures/components/LabAndProdcedureSave"
import LabAndProdcedureOrder from "../lab-procedures/components/LabAndProdcedureOrder"
import { useDispatch, useSelector } from "react-redux"
import { DiscountApiService } from "../../../../api/discount/dicount-api-service"
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead"
import { ConsultantApiService } from "../../../../api/consultant/consultant-api-service"
import { toast } from "react-toastify"
import { clearErrorHandling, errorHandling } from "../../../../error/state/error-handle-action"
import { AxiosError } from "axios"
// import { toastErrorBounceDark, toastSuccessBounceDark } from "../../../../toast-message/toast"
import { toastSuccessBounceDark, toastErrorBounceDark } from '../../../../utils/toast'
import { RootState } from "../../../../state/store"
import { createOrderTemplateDetailsRequestsList, saveModel } from "../lab-procedures/model/model"
import LabScreenEntry from "./components/LabScreenEntry"
import { useNavigate } from "react-router-dom"
import { routerPathNames } from "../../../../routes/routerPathNames"
import PrevOutsideLab from "./components/PrevOutsideLab"
import ImageUploadScreen from "./components/ImageUploadScreen"
import { toastWarningBounceDark } from "../../../../toast-message/toast"

interface Item {
    id: number;
    name: string;
    rate: number;
    name1: string;
    isChecked: boolean;
    type?: string;
}

type GroupedData = {
    name1: string;
    items: Item[];
};

const labSaveInterFace = {
    orderId: 0,
    testId: 0, // need
    testCode: "string", //need
    deptId: 0, //need
    rate: 0, //need
    disc: 0,
    resultDone: 0,
    resultDate: "string",
    resultTime: "string",
    resultUid: 0,
    unit: 1,
    tempOrderId: 0,
    returnUnit: 0,
    fcRate: 0,
    patId: 0, // need
    uid: 0, //need
    dtm: "string", // need
    headId: 0,
    finalBillId: 0,
    vstId: 0
}
const InvSaveInterFace = {
    billId: 0,
    groupId: 0, //need
    particularId: 0, //need
    unit: 1,
    rate: 0, //need
    disc: 0, //need
    docId: 0,
    returnUnit: 0,
    fcRate: 0,
    patId: 0, //need
    uid: 0, //need
    dateTime: "string",
    finalBillId: 0
}
const saveLabAndInvInterFace = {
    templateName: "string", //need
    consultantId: 0, // need 
    isActive: 1,
    createdBy: 0, //need uid
    createdDTM: "string",
    createOrderTemplateDetailsRequestsList: [
        {
            templateId: 0,
            procedureId: 0, //  need
            procedureType: "string", //need L G
            procedureName: "string", // need 
            procedureRate: 0 // need
        }
    ]
}
const labAndProcedureDiscountInterface = {
    patId: 0,
    uid: 0,
    datetime: "string",
    discAmt: 0,
    finalBillId: 0
}

const labDetails = [
    {
        id: 1,
        name: "LAB NAME",
        fieldName: "labName",
        value: ""
    },
    {
        id: 2,
        name: "REFFER BY",
        fieldName: "suggestDoc",
        value: ""
    },
    {
        id: 3,
        name: "SELECT DATE",
        fieldName: "selDateTime",
        value: "0000-00-00 00:00"
    }
]

const OutsideLabAndProcedure = () => {

    const dispatch = useDispatch()
    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
    let patientDetails: any
    let ipId: number;
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }
    const loginUser = useSelector((s: RootState) => s.loginData)

    const tempOutsideModel = {
        labName: "",
        suggestDoc: "",
        selDateTime: "0000-00-00 00:00"
    }

    const discountApiService: DiscountApiService = new DiscountApiService()
    const investigationApiService: InvestigationApiService = new InvestigationApiService()
    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService()

    const [temporaryListNames, setTemporaryListNames] = useState<any[]>([])
    const [selectedInvNames, setSelectedInvNames] = useState<any[]>([])
    const [selectedInvDeptNames, setSelectedInvDeptNames] = useState<any[]>([])
    const [selectedNames, setSelectedNames] = useState<any[]>([])
    const [selectedDeptNames, setSelectedDeptNames] = useState<any[]>([])
    const [pastLabDetails, setPastLabDetails] = useState<any[]>([])
    const [pastInvDetails, setPastInvDetails] = useState<any[]>([])
    const [templateNameList, setTemplateNameList] = useState<any[]>([])
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<any[]>([])

    const [currentSelected, setCurrentSelected] = useState<any>({ labSelected: "0", invSelected: "0" })
    const [laboratoryDepartmentList, setLaboratoryDepartmentList] = useState<any[]>([])
    const [investigationDepartmentList, setInvestigationDepartmentList] = useState<any[]>([])
    const [searchTempListNames, setSearchTempListNames] = useState<any[]>([])
    const [consultantOption, setConsultantOption] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [selectedTest, setSelectedTest] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    const [discount, setDiscount] = useState<number>(0)
    const [saveState, setSaveState] = useState<{}>({ status: false, loading: false })
    const [templateStatus, setTemplateStatus] = useState<any>({ saveTemplateStatus: false, text: "" })

    const [tempOustideResult, setTempOutsideResult] = useState({ ...tempOutsideModel })
    const [templateId , setTemplateId ] = useState<number>(0)  


    //----------------------------------POPUP--------------------------------

    const [showLabAndProcedureTemplate, setShowLabAndProcedureTemplate] = useState<any>(false)
    const [showLabAndProcedureSave, setShowLabAndProcedureSave] = useState<any>(false)
    const [showLabAndProcedureOrder, setShowLabAndProcedureOrder] = useState<any>(false)

    const [showLabScreen, setShowLabScreen] = useState<any>(false)
    const [showPreviousOutsideLab, setShowPreviousOutsideLab] = useState<any>()
    const [showImageScreen, setShowImageScreen] = useState<any>(false)
    const [labStatus, setLabStatus] = useState<any>({ default: true, imgStatus: false })

    const hanldeNumberInputZero = (value: string) => {
        if (value.length > 1 && value[0] == "0") {
            value = value.slice(1, value.length)
        } else if (!value) {
            value = "0"
        } else {
            value = value
        }
        return value
    }

    const getLaboratoryDepartmentList = async () => {
        try {
            let labDepartmentResponse = await laboratoryApiService.getLabDepartment()
            setLaboratoryDepartmentList(labDepartmentResponse);
        } catch (error) {
            handleError(error);
        }
    }

    const getInvestigationDepartmentList = async () => {
        try {
            let investigationDepartmentResponse = await investigationApiService.getInvestigationDepartment()
            setInvestigationDepartmentList(investigationDepartmentResponse);
        } catch (error) {
            handleError(error);
        }
    }

    const getAllLabAndProcedures = async () => {
        try {
            let state: Item[] = [];
            let labDepartmentResponse = await laboratoryApiService.getLabTestNamesByDepartment("0");
            let investigationDepartmentResponse = await investigationApiService.getInvestigationNamesByDepartment("0");
            
            
            state.push(...labDepartmentResponse.map((item: any) => ({
                ...item,
                isChecked: false,
                type: 'lab' 
            })));
            state.push(...investigationDepartmentResponse.map((item: any) => ({
                ...item,
                isChecked: false,
                type: 'inv' 
            })));

            
            const labItems = state.filter(item => item.type === 'lab');
            const invItems = state.filter(item => item.type === 'inv');

            
            const groupedLabData = labItems.reduce((acc: Record<string, Item[]>, item: Item) => {
                if (!acc[item.name1]) {
                    acc[item.name1] = [];
                }
                acc[item.name1].push(item);
                return acc;
            }, {});
            
            const formattedLabData = Object.entries(groupedLabData).map(([name1, items]) => ({
                name1,
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            })).sort((a, b) => a.name1.localeCompare(b.name1)); 

            
            const groupedInvData = invItems.reduce((acc: Record<string, Item[]>, item: Item) => {
                if (!acc[item.name1]) {
                    acc[item.name1] = [];
                }
                acc[item.name1].push(item);
                return acc;
            }, {});

            const formattedInvData = Object.entries(groupedInvData).map(([name1, items]) => ({
                name1,
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            })).sort((a, b) => a.name1.localeCompare(b.name1)); 
            
            const combinedData = [
                ...formattedLabData,
                ...formattedInvData
            ];

            setTemporaryListNames(combinedData);
            setSearchTempListNames(combinedData);
        } catch (error) {
            handleError(error);
        }
    };

    const handleDisplayButton = () => {
        setLabStatus((pre: any) => ({ ...pre, imgStatus: !pre.imgStatus, default: !pre.default }))
    }

    const handleInputChange = (value: string, fieldName: string) => {
        setTempOutsideResult((pre: any) => ({ ...pre, [fieldName]: value }))
    }

    const handleInputInvChange = (value: string, invId: number, invLabel: string) => {
        setSelectedInvNames((prev) => {
            let local = [...prev]
            const foundIndex = local.findIndex((item) => item.id == invId && item.label == invLabel)

            if (foundIndex != -1) {
                local[foundIndex].findings = value
            }
            return local
        })
    }
    const handleInuputNotesChange = (value: string, testId: number, testLabel: string) => {

        setSelectedNames((prev) => {
            let local = [...prev]
            const foundIndex = local.findIndex((item) => item.id == testId && item.label == testLabel)

            if (foundIndex != -1) {
                local[foundIndex].notes = value
            }
            console.log(local)

            return local;
        })
    }
    const handleInputFieldChange = (value: string, fIdx: number, testId: number, testLabel: string) => {
        setSelectedNames((prev) => {
            let local = [...prev]
            const foundTestIndex = local.findIndex((item) => item.id == testId && item.label == testLabel)
            if (foundTestIndex != -1) {
                const foundFieldIndex = local[foundTestIndex].fields.findIndex((item: any, idx: number) => fIdx == idx)
                local[foundTestIndex].fields[foundFieldIndex].value = value
            }
            
            return local;
        })
    }

    const saveOutsideInvData = async () => {
        try {
            // if(tempOustideResult.labName == "") {
            //     return toastErrorBounceDark("Please Enter Outside Inv Name")
            // } else {
            // }
            if (tempOustideResult.selDateTime === tempOutsideModel.selDateTime) return toast.warning("Enter Date To save")
            const createOutsideInvDetailsRequestList = selectedInvNames.map((invItem: any) => {
                return { deptId: invItem.groupId, invId: invItem.id, findings: invItem.findings }
            })
            let tempData = {
                ...tempOustideResult, display: 0, patId: patientDetails.patientId, vstId: patientDetails.visitId, ipId: 0, consultantId: loginUser.id,
                createOutsideInvDetailsRequestList
            }
            await laboratoryApiService.saveOutsideInvResult(tempData)
            getPastTestNames()
            setTempOutsideResult({ ...tempOutsideModel })
            refresh()
            toastSuccessBounceDark("Lab Result Saved Successfully")
            setShowLabScreen(false)


        } catch (error: any) {
            handleError(error)
        }
    }
    const saveOutsideLabData = async () => {
        try {
            // if(tempOustideResult.labName == "") {
            //     toastErrorBounceDark("Please Enter Laboratory Name")
            // } else if (tempOustideResult.suggestDoc == "") {
            //     toastErrorBounceDark("Please Enter Reffered Doctor Name")
            // } else {
            // }
            if (tempOustideResult.selDateTime === tempOutsideModel.selDateTime) return toast.warning("Enter Date To save")

            const createOutsideLabResultRequestList = selectedNames.map((testItem: any) => {
                let createOutsideLabResultDetailsRequestList = []
                if (testItem.fields?.length > 0) {
                    createOutsideLabResultDetailsRequestList = testItem.fields.map((fieldItem: any) => {
                        return { testId: testItem.id, fldId: fieldItem.fieldId, value: fieldItem.value, isValid: 1 }
                    })
                }
                return { deptId: testItem.deptCode, testId: testItem.id, notes: testItem.notes, isValid: 1, createOutsideLabResultDetailsRequestList }
            })
            let tempData = {
                ...tempOustideResult, labResId: 0, patId: patientDetails.patientId, vstId: patientDetails.visitId, ipId: 0, consultantId: loginUser.id, isValid: 1,
                createOutsideLabResultRequestList
            }
            console.log(tempData)
            await laboratoryApiService.saveOutsideLabResult(tempData)
            toastSuccessBounceDark("Lab Result Saved Successfully")
            getPastTestNames()
            setTempOutsideResult({ ...tempOutsideModel })
            refresh()
            setShowLabScreen(false)
        } catch (error: any) {
            handleError(error)
        }
    }

    const removeDuplicates = () => {
        const uniqueLabName = selectedDeptNames.filter((item, index, self) =>
            self.indexOf(item) === index)
        const uniqueInvName = selectedInvDeptNames.filter((item, index, self) =>
            self.indexOf(item) === index)

        setSelectedDeptNames(uniqueLabName)
        setSelectedInvDeptNames(uniqueInvName)
    };

    const handleSelectedTestForResultEntry = async () => {

        let tstId: any;
        const tempTestDetails = await Promise.all(
            selectedNames.map(async (item: any, idx: number) => {
                tstId = item.id
                const tempfields = await laboratoryApiService.fetchLabTestFields(tstId);
                const actualfields = [...tempfields].map((item) => ({ ...item, value: "", testId: tstId }))
                let local = { ...item, fields: actualfields, notes: "" }
                return local

            })
        )
        setSelectedNames(tempTestDetails)
    }

    const handleSelectedTestforResult = (event: React.ChangeEvent<HTMLInputElement>, item: any, groupIndex: number, idx: number) => {
        console.log(temporaryListNames)

        const { checked } = event.target
        const updatedList = temporaryListNames.map((group: any, gIdx: number) => {
            if (gIdx === groupIndex) {
                return {
                    ...group,
                    items: group.items.map((currentItem: any, iIdx: number) =>
                        iIdx === idx ? { ...currentItem, isChecked: checked } : currentItem

                    )
                }
            }
            return group
        })
        setTemporaryListNames(updatedList);

        if (item.label == "L") {
            if (checked) {
                setSelectedNames(prev => [...prev, item])
                setSelectedDeptNames(prev => [...prev, item.name1])
                setSelectedInvNames([])
                setSelectedInvDeptNames([])
            } else {
                setSelectedDeptNames((prev) => {
                    const index = prev.indexOf(item.name1);
                    if (index !== -1) {

                        const updatedDeptNames = [...prev];
                        updatedDeptNames.splice(index, 1);
                        return updatedDeptNames;
                    }
                    return prev;
                });
                setSelectedNames(prev => prev.filter((selectedItem: any) => selectedItem.id !== item.id));
                setSelectedInvNames([])
                setSelectedInvDeptNames([])

            }
        } else if (item.label == "I") {
            if (checked) {
                let tempItem = { ...item, findings: "" }
                setSelectedInvNames(prev => [...prev, tempItem])
                setSelectedInvDeptNames(prev => [...prev, item.name1])
                setSelectedNames([])
                setSelectedDeptNames([])
            } else {
                setSelectedInvDeptNames((prev) => {
                    const index = prev.indexOf(item.name1);
                    if (index !== -1) {

                        const updatedDeptNames = [...prev];
                        updatedDeptNames.splice(index, 1);
                        return updatedDeptNames;
                    }
                    return prev;
                });
                setSelectedInvNames(prev => prev.filter((selectedItem: any) => selectedItem.id !== item.id));
                setSelectedNames([])
                setSelectedDeptNames([])

            }
        }
        let tempTestLen = [...selectedNames]
        let tempInvLen = [...selectedInvDeptNames]
        if (tempTestLen.length > 0 && tempInvLen.length > 0) {
            toastErrorBounceDark("Please Select Either Lab or Investigation")
        }
    }

    const handleDeleteTemplate = async () => {
            try {
                if (templateId === 0) {
                    toastWarningBounceDark("Please select a template to delete.")
                    return;
                }
                let result = await laboratoryApiService.deleteLabTemplateById(templateId);
                if (result) {
                    if (result == "Template Id is InCorrect")
                        toastWarningBounceDark("Template Id is InCorrect")
                    else {
                        toastSuccessBounceDark("Template deleted successfully.")
                    }
                    
                } else {
                    toastErrorBounceDark("Failed to delete template.")
                }
            } catch (error) {
                handleError(error);
                console.log("Error while deleting template", error);
                toastErrorBounceDark("Error while deleting template.")
            } finally {
                setTemplateId(0)
                setShowLabAndProcedureTemplate(false);
            }
        }

    const handleSelectDepartment = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const { value, name } = event.target;

            let labData: Item[] = [];
            let invData: Item[] = [];

            if (name === "L") {
                setCurrentSelected((prev: any) => ({ ...prev, labSelected: value }));
            } else if (name === "I") {
                setCurrentSelected((prev: any) => ({ ...prev, invSelected: value }));
            }

            if (name === "L" || value === "0") {
                labData = await laboratoryApiService.getLabTestNamesByDepartment(value);
            }
            if (name === "I" || value === "0") {
                invData = await investigationApiService.getInvestigationNamesByDepartment(value);
            }

            const combinedData: Item[] = [
                ...labData.map((item: Item) => ({
                    ...item,
                    isChecked: selectedNames.some((selectedItem: Item) => selectedItem.id === item.id),
                    type: "lab"
                })),
                ...invData.map((item: Item) => ({
                    ...item,
                    isChecked: selectedNames.some((selectedItem: Item) => selectedItem.id === item.id),
                    type: "inv"
                }))
            ];

            const groupedData = combinedData.reduce((acc: Record<string, Item[]>, item: Item) => {
                if (!acc[item.name1]) {
                    acc[item.name1] = [];
                }
                acc[item.name1].push(item);
                return acc;
            }, {});

            const formattedData = Object.entries(groupedData).map(([name1, items]) => ({
                name1,
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            }));

            const labDataSorted = formattedData.filter(group => group.items[0].type === "lab")
                .sort((a, b) => a.name1.localeCompare(b.name1));

            const invDataSorted = formattedData.filter(group => group.items[0].type === "inv")
                .sort((a, b) => a.name1.localeCompare(b.name1));

            const orderedData = name === "L"
                ? labDataSorted
                : name === "I"
                    ? invDataSorted
                    : [...labDataSorted, ...invDataSorted];

            setTemporaryListNames(orderedData);
            setSearchTempListNames(orderedData);
            setSearchInput("");
        } catch (error) {
            handleError(error);
        }
    };

    const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase().trim();
        setSearchInput(query);

        if (query) {
            const filtered = searchTempListNames
                .map((group: GroupedData) => {
                    const filteredItems = group.items.filter((item: Item) => {
                        const nameLower = item.name.toLowerCase();
                        return nameLower.startsWith(query);
                    });

                    if (filteredItems.length > 0) {
                        return { ...group, items: filteredItems };
                    }
                    return null;
                })
                .filter((group: GroupedData | null) => group !== null);

            setTemporaryListNames(filtered as GroupedData[]);
        } else {
            setTemporaryListNames(searchTempListNames);
        }
    };

    const getPastTestNames = async () => {
        try {
            const labResponse = await laboratoryApiService.getLabTestNamesByPatId(patientDetails.patientId)
            setPastLabDetails([...labResponse])
            const invResponse = await investigationApiService.getInvestigationNamesByPatId(patientDetails.patientId)
            setPastInvDetails([...invResponse])
            // if (labResponse.length > 0 || invResponse.length > 0) {
            //     setSaveState((pre: any) => ({ ...pre, status: true }))
            // }
        } catch (error) {
            handleError(error);
        }
    }

    const fetchLabAndProcedureTemplateNameList = async () => {
        try {
            let labAndInvTemplateNameRes: any[] = await investigationApiService.fetchLabAndProcedureTemplateNameList(2)
            if (labAndInvTemplateNameRes.length > 0) {
                setTemplateNameList(labAndInvTemplateNameRes);
                handleSelectTemplate(labAndInvTemplateNameRes[0].id)
            } else {
                setTemplateNameList([{ id: "0", templateName: "Template Is Empty" }]);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleSelectTemplate = async (tempId: string) => {
        try {
            if (tempId != "0") {
                setTemplateId(Number(tempId))
                let local: any[] = []
                const invTemplateResponse = await investigationApiService.fetchInvOrderTemplatesById(tempId)
                const labTemplateResponse = await laboratoryApiService.fetchLabOrderTemplatesById(tempId)
                local = [...invTemplateResponse, ...labTemplateResponse]
                setSelectedTemplateValue(local)
            }
        } catch (error) {
            handleError(error)
        }
    };

    const hanldeMapTemplates = () => {
        let local = selectedTemplateValue.map((order: any) => {
            setSelectedDeptNames((prev : any) => [...prev, order.name1])
            order = { ...order, isChecked: true }
            return order
        })
        setSelectedNames((prev: any) => [...prev, ...local]);
        setShowLabAndProcedureTemplate(false);
        let temp = temporaryListNames.map((item: any) => {
            for (var i = 0; i < local.length; i++) {
                if (local[i].name == item.name) {
                    return item = local[i];
                }
            }
            return { ...item, isChecked: false };
        })
        setTemporaryListNames(temp)
    };

    const handleSave = async () => {
        try {
            if (patientDetails.patientId) {
                const lab = selectedNames.filter((item: any) => item.label == "L").map((item: any) => ({ ...labSaveInterFace, testId: item.id, testCode: item.code, deptId: item.deptCode, rate: item.rate, disc: item.charity, patId: patientDetails.patientId, uid: loginUser.id, vstId: patientDetails.visitId }))
                const Inv = selectedNames.filter((item: any) => item.label != "L").map((item: any) => ({ ...InvSaveInterFace, groupId: item.groupId, particularId: item.id, rate: item.rate, disc: item.charity, patId: patientDetails.patientId, uid: loginUser.id }))
                setSaveState((pre: any) => ({ ...pre, loading: true }))
                await laboratoryApiService.SaveLaboratoryOrder(lab)
                await investigationApiService.SaveInvestigationOrder(Inv)
                if (discount != 0) {
                    await discountApiService.saveLabAndProcedureOrderDiscount({ ...labAndProcedureDiscountInterface, patId: patientDetails.patientId, uid: loginUser.id, discAmt: discount })
                }

                toastSuccessBounceDark("Details Saved")
                setShowLabAndProcedureSave(false)
                getPastTestNames()
                refresh()
            }
        } catch (error) {
            handleError(error);
        }
        finally {
            setSaveState((pre: any) => ({ ...pre, status: true, loading: false }))
        }
    };




    const saveLabAndInvestigationTemplate = async () => {
        try {
            if (templateStatus.text != "" && selectedNames.length > 0) {
                let tempOrders = selectedNames.map((order: any) => {
                    if (String(order.label).toString() == "i") {
                        order.label = "G"
                    }
                    let tempOrder = { ...createOrderTemplateDetailsRequestsList, procedureType: order.label, procedureId: order.id, procedureRate: order.rate, procedureName: order.name }
                    return tempOrder
                })
                let tempSaveModel = { ...saveModel, createdBy: loginUser.id, templateName: templateStatus.text, tempType : 2, createOrderTemplateDetailsRequestsList: tempOrders }
                await investigationApiService.saveLabInvOrderTemplate(tempSaveModel)
                toastSuccessBounceDark('Template Is Saved')
                setTemplateStatus((pre: any) => ({ ...pre, saveTemplateStatus: true }))
            } else if (templateStatus.text == "") {
                toastErrorBounceDark("Template Name is empty")
            } else if (templateStatus.text != "" && selectedInvNames .length > 0){
                toast.warning("Only Lab Template Can Be Saved")
            } else {
                toastErrorBounceDark("Select Any Order")
            }
        } catch (error) {
            handleError(error);
        }

    };

    const handleError = (error: any) => {
        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
        } else {

        }
    };

    const initState = () => {
        getLaboratoryDepartmentList()
        getInvestigationDepartmentList()
        getAllLabAndProcedures()
        getPastTestNames()

    };

    const refresh = () => {
        setSelectedNames([])
        // setConsultantOption([])
        setSearchInput('')
        setDiscount(0)
        setSaveState({ status: false, loading: false })
        setTemplateStatus({ saveTemplateStatus: false, text: "" })
        initState()
        setSelectedInvNames([])
        setSelectedDeptNames([])
        setSelectedInvDeptNames([])
        setCurrentSelected({ invSelected: "0", labSelected: "0" })
    };

    useEffect(() => {
        initState();
        return () => {
            dispatch(clearErrorHandling())
        }
    }, []);

    const  casesheet = "OUTSIDE LAB ENTRY";
    return (
        <ClinicalLayout {...{casesheet}}>
            {/* <FormLabel className='heading mx-auto'>OUTSIDE LAB ENTRY OF <span className="text-dark">{patientDetails?.fullName} - {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}

            <Row className="my-2 flex-column flex-lg-row justify-content-center">
                
                <Col lg={6} className="mb-3 mb-lg-0 d-flex">
                    <Row className={`${labStatus.default ? "" : 'd-none'} w-50 mb-2`}>
                        <Col className="fw-bold">LABORATORY</Col>
                        <Col>
                            <Form.Select size="sm" value={currentSelected.labSelected} onChange={handleSelectDepartment} name="L" id="dep_l">
                                <option value="0">All Lab Department</option>
                                {laboratoryDepartmentList?.map((item: any, idx: number) => (
                                    <option value={item.id} key={idx}>{item.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className={`${labStatus.default ? "" : 'd-none'} mb-2`}>
                        <Col className="fw-bold">INVESTIGATION</Col>
                        <Col>
                            <Form.Select size="sm" value={currentSelected.invSelected} onChange={handleSelectDepartment} name="I" id="dep_i">
                                <option value="0">Procedure/Other Investigation</option>
                                {investigationDepartmentList?.map((item: any, idx: number) => (
                                    <option value={item.id} key={idx}>{item.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>

                <Col lg={6} className="d-flex">
                    <Row className="w-75 align-items-center mb-2">
                        <Col className={`${labStatus.default ? "" : 'd-none'}`}>
                            <Form.Group className="general-case-sheet-input" controlId={`search_input`}>
                                <Form.Control
                                    size="sm"
                                    value={searchInput}
                                    onChange={handleNameSearch}
                                    placeholder='' />
                                <label htmlFor="search_input" className="fs-11px">SEARCH</label>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="w-100">
                        <Col>
                            <Button variant="dark" size="sm" className='w-100' onClick={() => setShowPreviousOutsideLab(true)}>
                                Edit Lab / Inv
                            </Button>
                        </Col>
                        <Col >
                            <Button variant="success" size="sm" className='w-100' onClick={handleDisplayButton}>
                                {labStatus.default ? "Upload Images" : "Back"}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={`${labStatus.default ? "" : 'd-none'} mb-2`}>
                <Col xs={4}>
                    <Row className="mb-2">
                        <Col >
                            <Form.Group className="general-case-sheet-input" controlId={`temp_Name`}>
                                <Form.Control
                                    size="sm"
                                    value={templateStatus.text}
                                    onChange={(e) => setTemplateStatus((pre: any) => ({ ...pre, text: e.target.value }))}
                                    placeholder='' />
                                <label htmlFor="temp_Name" className="fs-11px">ENTER TEMPLATE NAME</label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    <Row className="mb-2">
                        <Col >
                            <Button variant='success' size="sm" className='w-100' onClick={saveLabAndInvestigationTemplate} disabled={templateStatus.saveTemplateStatus}>SAVE TEMPLATE</Button>
                        </Col>
                    </Row>            
                </Col>
                <Col xs={2}>
                    <Row className="justify-content-center">
                        <Col >
                            <Button variant='dark' size="sm" className='w-100 ' onClick={() => { fetchLabAndProcedureTemplateNameList(); setShowLabAndProcedureTemplate(true); }}>Templates</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                labStatus.default && labStatus.imgStatus === false &&
                <Row className='col flex-column overflow-auto'>
                    <Col className="row py-2 text-start overflow-auto">
                        <Row className="border col py-2 h-100">
                            <Col className="h-100 overflow-auto">
                                {temporaryListNames.length ? (
                                    temporaryListNames.map((group: any, groupIndex: number) => (
                                        <div key={groupIndex} className="mb-3">
                                            <h6>{group.name1}</h6>
                                            <Row className="row-cols-4">
                                                {group.items.map((item: any, itemIndex: number) => (
                                                    <Col key={itemIndex}>
                                                        <Row className="user-select-none" title={`${group.name1} / RATE : ${item.rate}`}>
                                                            <Col className="flex-grow-0">
                                                                <Form.Check inline>
                                                                    <Form.Check.Input
                                                                        className="border border-secondary"
                                                                        id={`check-${groupIndex}-${itemIndex}`}
                                                                        onChange={(e) => handleSelectedTestforResult(e, item, groupIndex, itemIndex)}
                                                                        type="checkbox"
                                                                        checked={item.isChecked || selectedNames.some((selectedItem: any) => selectedItem.id === item.id)}
                                                                    />
                                                                </Form.Check>
                                                            </Col>
                                                            <Col>
                                                                <Form.Label htmlFor={`check-${groupIndex}-${itemIndex}`} className={`w-100 ${(group.name1 == "THYROCARE " || group.name1 == "Z-THYROCARE") ? "text-danger" : ""}`}>
                                                                    {item.name}
                                                                </Form.Label>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-danger text-center fs-5 align-middle">Wait...! Searching for Details</p>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col className="flex-grow-0 row text-end pb-2">
                        <Col>
                            <Button variant='warning' className="button_style py-1 px-5 mx-3" onClick={() => refresh()}>Refresh</Button>
                            <Button variant='dark' className=' button_style py-1 px-5  mx-3' onClick={() => { removeDuplicates(); handleSelectedTestForResultEntry(); setShowLabScreen(true); }} disabled={(selectedNames.length > 0 && selectedInvNames.length > 0) ? true : (selectedNames.length > 0 || selectedInvNames.length > 0) ? false : true}>Enter Result</Button>
                        </Col>
                    </Col>
                </Row>
            }
            {
                labStatus.imgStatus && labStatus.default === false &&
                <Row>
                    <ImageUploadScreen
                        patientDetails={patientDetails}
                        loginUser={loginUser}
                        show={showImageScreen}
                        onHide={() => { setShowImageScreen(false) }}
                        investigationDepartmentList={investigationDepartmentList}
                    />
                </Row>
            }
            <LabAndProdcedureTemplate show={showLabAndProcedureTemplate} onHide={() => { setShowLabAndProcedureTemplate(false); setSelectedTemplateValue([]) }} templateNameList={templateNameList} selectedTemplateValue={selectedTemplateValue} handleError={handleError} handleSelectTemplate={handleSelectTemplate} hanldeMapTemplates={hanldeMapTemplates} handleDeleteTemplate = {handleDeleteTemplate} />
            <LabAndProdcedureSave hanldeNumberInputZero={hanldeNumberInputZero} saveState={saveState} selectedNames={selectedNames} disc={{ setDiscount, discount }} handleSave={handleSave} show={showLabAndProcedureSave} onHide={() => setShowLabAndProcedureSave(false)} />
            {/* <LabAndProdcedureOrder patientDetails={patientDetails} pastDetails={{ pastInvDetails, pastLabDetails }} show={showLabAndProcedureOrder} onHide={() => setShowLabAndProcedureOrder(false)} deleteLabOrderByLabId={deleteLabOrderByLabId} deleteInvestigationOrderByProcId={deleteInvestigationOrderByProcId} DeleteLabAndProcedureOrderDiscount={DeleteLabAndProcedureOrderDiscount} deleteInvestigationOrdersByPatId={deleteInvestigationOrdersByPatId} deleteLaboratoryOrdersByPatId={deleteLaboratoryOrdersByPatId} /> */}
            <LabScreenEntry
                show={showLabScreen}
                refresh={refresh}
                handleInputFieldChange={handleInputFieldChange}
                handleInuputNotesChange={handleInuputNotesChange}
                selectedTest={selectedTest}
                selectedInvDeptNames={selectedInvDeptNames}
                selectedInvNames={selectedInvNames}
                selectedNames={selectedNames}
                setSelectedNames={setSelectedNames}
                saveOutsideLabData={saveOutsideLabData}
                handleInputChange={handleInputChange}
                tempOustideResult={tempOustideResult}
                selectedDeptNames={selectedDeptNames}
                setSelectedDeptNames={setSelectedDeptNames}
                setSelectedInvNames={setSelectedInvNames}
                selectedGroup={selectedGroup}
                onHide={() => { setShowLabScreen(false); setSelectedTemplateValue([]) }}
                templateNameList={templateNameList}
                selectedTemplateValue={selectedTemplateValue}
                handleError={handleError}
                handleSelectTemplate={handleSelectTemplate}
                saveOutsideInvData={saveOutsideInvData}
                handleInputInvChange={handleInputInvChange}
                hanldeMapTemplates={hanldeMapTemplates} />
            <PrevOutsideLab
                show={showPreviousOutsideLab}
                onHide={() => { setShowPreviousOutsideLab(false) }}
                laboratoryApiService={laboratoryApiService}
                patientDetails={patientDetails}
                handleError={handleError}
                labDetails={labDetails}
                handleInputChange={handleInputChange}
                loginUser={loginUser}
            />

        </ClinicalLayout>
    )
}

export default OutsideLabAndProcedure
