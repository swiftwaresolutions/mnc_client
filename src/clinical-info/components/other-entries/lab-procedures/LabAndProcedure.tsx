import { Button, Col, Form, FormLabel, Row } from "react-bootstrap"
import ClinicalLayout from "../../ClinicalLayout"
import { useEffect, useState } from "react"
import { LaboratoryApiService } from "../../../../api/laboratory/laboratory-api-service"
import { InvestigationApiService } from "../../../../api/investigation/investigation-api-service"
import LabAndProdcedureTemplate from "./components/LabAndProdcedureTemplate"
import LabAndProdcedureSave from "./components/LabAndProdcedureSave"
import LabAndProdcedureOrder from "./components/LabAndProdcedureOrder"
import { useDispatch, useSelector } from "react-redux"
import { DiscountApiService } from "../../../../api/discount/dicount-api-service"
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead"
import { ConsultantApiService } from "../../../../api/consultant/consultant-api-service"
import { toast } from "react-toastify"
import { clearErrorHandling, errorHandling } from "../../../../error/state/error-handle-action"
import { AxiosError } from "axios"
import { toastErrorBounceDark, toastSuccessBounceDark } from "../../../../utils/toast"
import { RootState } from "../../../../state/store"
import { createOrderTemplateDetailsRequestsList, saveModel } from "./model/model"
import { json } from "stream/consumers"
import { toastWarningBounceDark } from "../../../../toast-message/toast"

interface Item {
    id: number;
    name: string;
    rate: number;
    units?: number;
    name1: string;
    isChecked: boolean;
    type?: string;
     isPreviouslyOrdered?: boolean; 
    label?: string; 
    code?: string;
    deptCode?: number;
    groupId?: number;
    charity?: number;
}

type GroupedData = {
    name1: string;
    items: Item[];
};

export interface PrevLabOrderedDetails {
    id: number,
    patId: number,
    testName: string,
    units: number,
    date: string,
    rate: number
  }

  export interface PrevInvOrderedDetails { 
      id: number,
      patId: number,
      procName: string,
      units: number,
      date: string,
      rate: number
  }

export interface InvOrder {
    orderId: number,
    orderDisplay: string,
    totalAmt: number,
    orderUserId: number,
    doctorId: number,
    userName: string,
    doctorName: string,
    deptName: string,
    details: PrevInvOrderedDetails[]
}

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
    finalBillId: 0
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
const LabAndProcedure = () => {

    const dispatch = useDispatch()
    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)
    let patientDetails: any
    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
    } else {
        patientDetails = clinicalCurrentIpPatient
    }
    const loginUser = useSelector((s: RootState) => s.loginData)

    const discountApiService: DiscountApiService = new DiscountApiService()
    const investigationApiService: InvestigationApiService = new InvestigationApiService()
    const laboratoryApiService: LaboratoryApiService = new LaboratoryApiService()
    const consultantApiService: ConsultantApiService = new ConsultantApiService()

    const [temporaryListNames, setTemporaryListNames] = useState<any[]>([])
    const [selectedNames, setSelectedNames] = useState<any[]>([])
    const [pastLabDetails, setPastLabDetails] = useState<PrevLabOrderedDetails[]>([])
    const [pastInvDetails, setPastInvDetails] = useState<InvOrder[]>([])
    const [templateNameList, setTemplateNameList] = useState<any[]>([])
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<any[]>([])

    const [currentSelected, setCurrentSelected] = useState<any>({ labSelected: "0", invSelected: "0" })
    const [laboratoryDepartmentList, setLaboratoryDepartmentList] = useState<any[]>([])
    const [investigationDepartmentList, setInvestigationDepartmentList] = useState<any[]>([])
    const [searchTempListNames, setSearchTempListNames] = useState<any[]>([])
    const [consultantOption, setConsultantOption] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");

    const [discount, setDiscount] = useState<number>(0)
    const [preDiscount, setPreDiscount] = useState<any[]>([])
    const [saveState, setSaveState] = useState<{}>({ status: false, loading: false })
    const [templateStatus, setTemplateStatus] = useState<any>({ saveTemplateStatus: false, text: "" })

    const [pastOrderedTestNames, setPastOrderedTestNames] = useState<Set<string>>(new Set()); 
    const [pastOrderedItems, setPastOrderedItems] = useState<any[]>([]);  
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [templateId , setTemplateId ] = useState<number>(0)                      

    //----------------------------------POPUP--------------------------------

    const [showLabAndProcedureTemplate, setShowLabAndProcedureTemplate] = useState<any>(false)
    const [showLabAndProcedureSave, setShowLabAndProcedureSave] = useState<any>(false)
    const [showLabAndProcedureOrder, setShowLabAndProcedureOrder] = useState<any>(false)

    const getItemUnits = (item: any) => {
        const qty = Number(item?.units)
        return qty > 0 ? qty : 1
    }

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

    const getOrderDiscBypatId = async () => {
        try {
            let response :any[]=  await discountApiService.fetchOrderDiscountAmount(patientDetails.patientId)
            setPreDiscount(response)
        } catch (error) {
            handleError(error);
        }
    };

    const deleteLabOrderByLabId = async (labId: any) => {
        try {
            await laboratoryApiService.deleteLabOrderByLabId(labId)
            await refresh();
            getPastTestNames()
        } catch (error) {
            handleError(error);
        }
    }

    const deleteInvestigationOrderByProcId = async (orderId: any) => {
        try {
            await investigationApiService.deleteInvestigationOrderByProcId(orderId)
            await refresh();
            getPastTestNames()
        } catch (error) {
            handleError(error);
        }
    }

    const deleteInvestigationOrdersByPatId = async (patId: any) => {
        try {
            await investigationApiService.deleteInvestigationOrderByPatientId(patId)
            await refresh();
            getPastTestNames()
        } catch (error) {
            handleError(error);
        }
    }

    const deleteInvestigationOrderByorderId = async (orderId: any) => {
        try {
            await investigationApiService.deleteInvestigationOrderByorderId(orderId)
            await refresh();
            getPastTestNames()
        } catch (error) {
            handleError(error);
        }
    }

    const deleteLaboratoryOrdersByPatId = async (patId: any) => {
        try {
            await laboratoryApiService.deleteLabOrderByPatientId(patId)
            await refresh();
            getPastTestNames()
        } catch (error) {
            handleError(error);
        }
    }

    const DeleteLabAndProcedureOrderDiscount = async (patId: any) => {
        try {
            await discountApiService.DeleteLabAndProcedureOrderDiscount(patId)
            await refresh();
            getPastTestNames()
            toastSuccessBounceDark('Discount Canceled')
        } catch (error) {
            toastErrorBounceDark("No discount for the Patient")
        }
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

    const getAllLabAndProcedures = async (orderedNames: Set<string>) => {
        try {
            let state : Item[] = []
            let labDepartmentResponse :any = []
            // let labDepartmentResponse = await laboratoryApiService.getLabTestNamesByDepartment("0")
            let investigationDepartmentResponse = await investigationApiService.getInvestigationNamesByDepartment("0")
           
            // state.push(...labDepartmentResponse.map((item: any) => ({
            //     ...item,
            //     isChecked: false,
            //     type: 'lab',
            //     label: 'L', 
            //     isPreviouslyOrdered: orderedNames.has(item.name)
            // })));
            state.push(...investigationDepartmentResponse.map((item: any) => ({
                ...item,
                isChecked: false,
                type: 'inv', // Tag items as 'inv'
                label: 'G',
                isPreviouslyOrdered: orderedNames.has(item.name)
            })));

            // Separate lab and investigation items
            // const labItems = state.filter(item => item.type === 'lab');
            const invItems = state.filter(item => item.type === 'inv');

            // Group and sort lab items
            // const groupedLabData = labItems.reduce((acc: Record<string, Item[]>, item: Item) => {
            //     if (!acc[item.name1]) {
            //         acc[item.name1] = [];
            //     }
            //     acc[item.name1].push(item);
            //     return acc;
            // }, {});
            
            // const formattedLabData = Object.entries(groupedLabData).map(([name1, items ]) => ({
            //     name1,
            //     items: items.sort((a, b) => a.name.localeCompare(b.name))
            // })).sort((a, b) => a.name1.localeCompare(b.name1)); // Sort alphabetically by name1

            // Group and sort investigation items
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
            })).sort((a, b) => a.name1.localeCompare(b.name1)); // Sort alphabetically by name1

            // Combine both sorted lab and investigation data
            const combinedData = [
                // ...formattedLabData,
                ...formattedInvData
            ];
            setTemporaryListNames(combinedData)
            setSearchTempListNames(combinedData)
        } catch (error) {
            handleError(error);
            setIsLoading(false);
        }
    }

    const getPastTestNames = async () => {
        try {
            // const labResponse = await laboratoryApiService.getLabTestNamesByPatId(patientDetails.patientId)
            // setPastLabDetails([...labResponse])
            const invResponse: InvOrder[] = await investigationApiService.getInvestigationNamesByPatId(patientDetails.patientId)
            setPastInvDetails([...invResponse])

            const allOrderedNames = new Set<string>(); //start
            const allOrderedItems: any[] = [];
            
            // labResponse.forEach((item: PrevLabOrderedDetails) => {
            //     allOrderedNames.add(item.testName);
            //     allOrderedItems.push({
            //         id: item.id,
            //         name: item.testName,
            //         isPreviouslyOrdered: true,
            //         rate: item.rate,
            //         type: 'lab',
            //         label: 'L'
            //     });
            // });
            
            invResponse.forEach((order: InvOrder) => {
                order.details.forEach((item: PrevInvOrderedDetails) => {
                    allOrderedNames.add(item.procName);
                    allOrderedItems.push({
                        id: item.id,
                        name: item.procName,
                        isPreviouslyOrdered: true,
                        rate: item.rate,
                        type: 'inv',
                        label: 'G'
                    });
                });
            });
            
            setPastOrderedTestNames(allOrderedNames);
            setPastOrderedItems(allOrderedItems);
            return allOrderedNames;
            // if (labResponse.length > 0 || invResponse.length > 0) {
            //     setSaveState((pre: any) => ({ ...pre, status: true }))
            // }
        } catch (error) {
            handleError(error);
            return new Set<string>();
        }
    }

    const  handleSelectName = (event: any, item: any,groupIndex: number, idx: number) => {
         if (item.isPreviouslyOrdered) { 
            return;
        } 

        let local = [...temporaryListNames]
        const { checked } = event.target
        item.isChecked = checked
        // local[idx] = item;
        const updatedList = local.map((group : any, gIdx : number) => {
            if (gIdx === groupIndex) {
                const updatedItems = group.items.map((subItem: any, sIdx: number) => {
                    if (sIdx === idx) {
                        return { ...subItem, isChecked: checked };
                    }
                    return subItem;
                });
                return { ...group, items: updatedItems };
            }
            return group;
        })
        setTemporaryListNames([...updatedList]);
        if (checked) {
            setSelectedNames((pre: any) => [...pre, { ...item, units: getItemUnits(item) }])
        } else {
            setSelectedNames((pre: any) => {
                let state = [...pre]
                state = state.filter((ele: any) => ele.name != item.name)
                return state
            })
        }
    }

    const handleSelectedOrderUnitsChange = (orderId: number, delta: number) => {
        setSelectedNames((pre: any[]) => pre.map((item: any) => {
            if (item.id !== orderId || item.isPreviouslyOrdered) {
                return item
            }
            const current = getItemUnits(item)
            const next = Math.max(1, current + delta)
            return { ...item, units: next }
        }))
    }

    const handleSelectedOrderUnitsInput = (orderId: number, value: string) => {
        const parsed = Number(value)
        const next = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
        setSelectedNames((pre: any[]) => pre.map((item: any) => {
            if (item.id !== orderId || item.isPreviouslyOrdered) {
                return item
            }
            return { ...item, units: next }
        }))
    }

    const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if (!event.target.value) {
        //     setTemporaryListNames(searchTempListNames)
        //     setSearchInput(event.target.value)
        //     return
        // }
        // let filtered = searchTempListNames.filter((item: any) => item?.name.toLowerCase()?.includes(event.target.value.toLowerCase()))
        // setTemporaryListNames(filtered)
        // setSearchInput(event.target.value)

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

    }

    const handleRemoveSelectedOrder = (orderName: string) => {
        let local = [...selectedNames].filter((ele: any) => ele.name != orderName)
        let temp = temporaryListNames.map((group: any) => {
            const updatedItems = group.items.map((item: any) => { 
                if (item.name === orderName) {
                    return { ...item, isChecked: false };
                }
                return item;
            });   
            return { ...group, items: updatedItems }; 
        })
        setSelectedNames(local)
        setTemporaryListNames(temp)
    }

    const fetchLabAndProcedureTemplateNameList = async () => {
        try {
            let labAndInvTemplateNameRes: any[] = await investigationApiService.fetchLabAndProcedureTemplateNameList(1)
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

    const handleSelectTemplate = async (tempId: string) => {
        try {
            if (tempId != "0") {
                setTemplateId(Number(tempId))
                let local: any[] = []
                const invTemplateResponse = await investigationApiService.fetchInvOrderTemplatesById(tempId)
                // const labTemplateResponse = await laboratoryApiService.fetchLabOrderTemplatesById(tempId)
                // local = [...invTemplateResponse, ...labTemplateResponse]
                local = [...invTemplateResponse]
                setSelectedTemplateValue(local)
            }
        } catch (error) {
            handleError(error)
        }
    };

    const hanldeMapTemplates = () => {
        console.log("Selected Template Value: ", selectedTemplateValue)
        console.log("pastOrderedTestNames : ", pastOrderedTestNames)
        const local = selectedTemplateValue.map((order: any) => ({
            ...order,
            isChecked: true,
            isPreviouslyOrdered: pastOrderedTestNames.has(order.name)
        }));
        console.log("Mapped Template with isChecked and isPreviouslyOrdered: ", local)
    const newItems = local.filter(item => !item.isPreviouslyOrdered);
    console.log("New Items to be added: ", newItems)
    // setSelectedNames((prev: any) => [...prev, ...local]);
    setSelectedNames((prev: any) => [...prev, ...newItems]);
    setShowLabAndProcedureTemplate(false);

    const temp = temporaryListNames.map((group: any) => {
        const updatedItems = group.items.map((item: any) => {
            const matched = local.find((x: any) => x.name === item.name);
           if (matched) { 
                    return {
                        ...item,
                        isChecked: !item.isPreviouslyOrdered 
                    };
                } 
                return item; 
        });

        return {
            ...group,
            items: updatedItems
        };
    });
    console.log("Updated Temporary List Names: ", temp)
    setTemporaryListNames(temp);
};


    const handleSelectDepartment = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const { value, name } = event.target

            let labData: Item[] = [];
            let invData: Item[] = [];

            // Update selected department state
            if (name === "L") {
                setCurrentSelected((prev: any) => ({ ...prev, labSelected: value }));
            } else if (name === "I") {
                setCurrentSelected((prev: any) => ({ ...prev, invSelected: value }));
            }

            // Fetch lab and investigation data based on selected value
            // if (name === "L" || value === "0") {
            //     labData = await laboratoryApiService.getLabTestNamesByDepartment(value);
            // }
            if (name === "I" || value === "0") {
                invData = await investigationApiService.getInvestigationNamesByDepartment(value);
            }

            // Combine and categorize data
            const combinedData: Item[] = [
                // ...labData.map((item: Item) => ({
                //     ...item,
                //     isChecked: selectedNames.some((selectedItem: Item) => selectedItem.id === item.id),
                //     type: "lab",
                //     label: "L", 
                //     isPreviouslyOrdered: pastOrderedTestNames.has(item.name)
                // })),
                ...invData.map((item: Item) => ({
                    ...item,
                    isChecked: selectedNames.some((selectedItem: Item) => selectedItem.id === item.id),
                    type: "inv",
                    label: "G", 
                    isPreviouslyOrdered: pastOrderedTestNames.has(item.name)
                }))
            ];

            // Group by name1
            const groupedData = combinedData.reduce((acc: Record<string, Item[]>, item: Item) => {
                if (!acc[item.name1]) {
                    acc[item.name1] = [];
                }
                acc[item.name1].push(item);
                return acc;
            }, {});

            // Format and sort data
            const formattedData = Object.entries(groupedData).map(([name1, items]) => ({
                name1,
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            }));

            // Separate lab and inv data
            const labDataSorted = formattedData.filter(group => group.items[0].type === "lab")
                .sort((a, b) => a.name1.localeCompare(b.name1));

            const invDataSorted = formattedData.filter(group => group.items[0].type === "inv")
                .sort((a, b) => a.name1.localeCompare(b.name1));

            // Combine sorted data based on department selection
            const orderedData = name === "L"
                ? labDataSorted
                : name === "I"
                    ? invDataSorted
                    : [...labDataSorted, ...invDataSorted];

            // Update state
            setTemporaryListNames(orderedData);
            setSearchTempListNames(orderedData);
            setSearchInput("");

            // if (name === "L") {
            //     let labTestNamesResponse = await laboratoryApiService.getLabTestNamesByDepartment(value)
            //     labTestNamesResponse = labTestNamesResponse?.map((item: any) => ({ ...item, isChecked: false }))
            //     labTestNamesResponse = labTestNamesResponse.map(function (item: any) {
            //         for (var i = 0; i < selectedNames.length; i++) {
            //             if (selectedNames[i].name == item.name) {
            //                 return item = selectedNames[i];
            //             }
            //         }
            //         return item;
            //     })
            //     setCurrentSelected((pre: any) => ({ ...pre, labSelected: value }))
            //     setTemporaryListNames(labTestNamesResponse);
            //     setSearchTempListNames(labTestNamesResponse)
            //     setSearchInput("")
            // } else {
            //     let investigationNamesResponse = await investigationApiService.getInvestigationNamesByDepartment(value)
            //     investigationNamesResponse = investigationNamesResponse?.map((item: any) => ({ ...item, isChecked: false }))
            //     investigationNamesResponse = investigationNamesResponse.map(function (item: any) {
            //         for (var i = 0; i < selectedNames.length; i++) {
            //             if (selectedNames[i].name == item.name) {
            //                 return item = selectedNames[i];
            //             }
            //         }
            //         return item;
            //     })
            //     setCurrentSelected((pre: any) => ({ ...pre, invSelected: value }))
            //     setTemporaryListNames(investigationNamesResponse);
            //     setSearchTempListNames(investigationNamesResponse)
            //     setSearchInput("")
            // }
        } catch (error) {
            handleError(error);
        }
    };

    const handleSave = async () => {
        try {
            if (patientDetails.patientId) {
                const newLabItems = selectedNames.filter((item: any) => item.type === "lab" && !item.isPreviouslyOrdered);
                const newInvItems = selectedNames.filter((item: any) => item.type === "inv" && !item.isPreviouslyOrdered);
                
                const lab = newLabItems.map((item: any) => ({  
                    ...labSaveInterFace, 
                    testId: item.id, 
                    testCode: item.code, 
                    deptId: item.deptCode, 
                    rate: item.rate || 0, 
                    disc: item.charity || 0, 
                    patId: patientDetails.patientId, 
                    vstId : patientDetails.visitId,
                    uid: loginUser.id 
                }))
                
                const Inv = newInvItems.map((item: any) => ({ 
                    ...InvSaveInterFace, 
                    groupId: item.groupId, 
                    particularId: item.id, 
                    unit: getItemUnits(item),
                    rate: item.rate || 0, 
                    disc: item.charity || 0, 
                    patId: patientDetails.patientId, 
                    vstId : patientDetails.visitId,
                    uid: loginUser.id 
                })) 

                setSaveState((pre: any) => ({ ...pre, loading: true }))
                await laboratoryApiService.SaveLaboratoryOrder(lab)
                await investigationApiService.SaveInvestigationOrder(Inv)
                if (discount != 0) {
                    await discountApiService.saveLabAndProcedureOrderDiscount({ ...labAndProcedureDiscountInterface, patId: patientDetails.patientId, uid: loginUser.id, discAmt: discount })
                }
                toastSuccessBounceDark("Details Saved")
                setShowLabAndProcedureSave(false)
                setSaveState((pre: any) => ({ ...pre, status: true, loading: false }))
                getPastTestNames()
                refresh()
            }
        } catch (error) {
            handleError(error);
        }
    };

    const saveLabAndInvestigationTemplate = async () => {
        try {
            if (templateStatus.text != "" && selectedNames.length > 0) {
                const newItems = selectedNames.filter((item: any) => !item.isPreviouslyOrdered);
                let tempOrders = selectedNames.map((order: any) => {
                    if (String(order.label).toString() == "i") {
                        order.label = "G"
                    }
                    let tempOrder = { ...createOrderTemplateDetailsRequestsList, procedureType: order.label, procedureId: order.id, procedureRate: order.rate, procedureName: order.name }
                    return tempOrder
                })
                let tempSaveModel = { ...saveModel, createdBy: loginUser.id, templateName: templateStatus.text, tempType : 1, createOrderTemplateDetailsRequestsList: tempOrders }
                await investigationApiService.saveLabInvOrderTemplate(tempSaveModel)
                toastSuccessBounceDark('Template Is Saved')
                setTemplateStatus((pre: any) => ({ ...pre, saveTemplateStatus: true }))
            } else if (templateStatus.text == "") {
                toastErrorBounceDark("Template Name is empty")
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

   const initState = async () => {  
        //setIsLoading(true);
        // await getLaboratoryDepartmentList();
        await getInvestigationDepartmentList();
        const orderedNames = await getPastTestNames();
        await getAllLabAndProcedures(orderedNames);   
    };
    const refresh = async () => {
        setSelectedNames([])  
        setSearchInput('')
        // setConsultantOption([])
        setDiscount(0)
        setSaveState({ status: false, loading: false })
        setTemplateStatus({ saveTemplateStatus: false, text: "" })
        setIsLoading(true); 
        const orderedNames = await getPastTestNames(); 
        await getAllLabAndProcedures(orderedNames);     
        setCurrentSelected({ invSelected: "0", labSelected: "0" })
    };

    useEffect(() => {
        initState();
        return () => {
            dispatch(clearErrorHandling())
        }
    }, []);
        const previousOrdersTotal = pastOrderedItems.reduce((total, item) => total + ((item.rate || 0) * getItemUnits(item)), 0);
        const orderTotal = selectedNames
            .filter(item => !item.isPreviouslyOrdered)
            .reduce((total, item) => total + ((item.rate || 0) * getItemUnits(item)), 0);
        const grandTotal = previousOrdersTotal + orderTotal;
        const allDisplayItems = [
            ...pastOrderedItems.map(item => ({ ...item, isCurrentSelection: false })),
            ...selectedNames.map(item => ({ ...item, isCurrentSelection: true }))
        ];

        const casesheet = "INVESTIGATION & PROCECURES"
    return (
        <ClinicalLayout {...{casesheet}}>
            {/* <FormLabel className='heading mx-auto'>PRESCRIPTION ENTRY OF <span className="text-dark">{patientDetails?.fullName} - {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}
            <Row className="my-2">
                <Col xs="4">
                    {/* <Row className="mb-2">
                        <Col className="fw-bold">
                            LABORATORY
                        </Col>
                        <Col >
                            <Form.Select size="sm" value={currentSelected.labSelected} onChange={handleSelectDepartment} name="L" id="dep_l">
                                <option value="0" >All Department</option>
                                {laboratoryDepartmentList?.map((item: any, idx: number) => {
                                    return <option value={item.id} key={idx} >{item.name}</option>
                                })}
                            </Form.Select >
                        </Col>
                    </Row> */}
                    <Row>
                        <Col className="fw-bold">
                            INVESTIGATION
                        </Col>
                        <Col>
                            <Form.Select size="sm" value={currentSelected.invSelected} onChange={handleSelectDepartment} name="I">
                                <option value="0">All Investigation</option>
                                {investigationDepartmentList?.map((item: any, idx: number) => {
                                    return <option value={item.id} key={idx}>{item.name}</option>
                                })}
                            </Form.Select >
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row className="mb-2">

                        <Col >
                            <Form.Group className="general-case-sheet-input" controlId={`temp_Name`}>
                                <Form.Control
                                    size="sm"
                                    value={templateStatus.text}
                                    onChange={(e) => setTemplateStatus((pre: any) => ({ ...pre, text: e.target.value }))}
                                    placeholder='' />
                                <label htmlFor="temp_Name" className="fs-11px">TEMPLATE NAME</label>
                            </Form.Group>
                        </Col>
                        {/* <Col >
                            <AsyncTypeahead
                                filterBy={() => true}
                                id="medicineName"
                                isLoading={false}
                                labelKey="name"
                                flip={true}
                                onSearch={handleConsultantSearch}
                                options={consultantOption}
                                placeholder="CONSULTANT NAME"
                                size="sm"
                                renderMenuItemChildren={(option: any, { text }) => (
                                    <>
                                        <Highlighter search={text}>{option.name}</Highlighter>
                                    </>
                                )} />
                        </Col> */}
                    </Row>
                    <Row className="align-items-center">
                        {/* <Col>
                            <Form.Control placeholder="SEARCH" size="sm" value={searchInput} onChange={(e) => handleNamesSearch(e)} />
                        </Col> */}
                        <Col >
                            <Form.Group className="general-case-sheet-input" controlId={`serach_input`}>
                                <Form.Control
                                    size="sm"
                                    value={searchInput} onChange={handleNameSearch}
                                    placeholder='' />
                                <label htmlFor="serach_input" className="fs-11px">SEARCH</label>
                            </Form.Group>
                        </Col>
                        <Col xs="4">
                            <Row className="justify-content-center">
                                <Col >
                                    <Button variant='dark' size="sm" className='w-100 ' onClick={() => { fetchLabAndProcedureTemplateNameList(); setShowLabAndProcedureTemplate(true); }}>Templates</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs="2">
                    <Row className="mb-2">
                        <Col >
                            <Button variant='success' size="sm" className='w-100' onClick={saveLabAndInvestigationTemplate} disabled={templateStatus.saveTemplateStatus}>SAVE TEMPLATE</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant='dark' size="sm" className='w-100' onClick={() =>{ setShowLabAndProcedureOrder(true);getOrderDiscBypatId();}}>ORDER VIEW/CANCEL</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='col flex-column overflow-auto'> 
                <Col className="row py-2 text-start overflow-auto">
                    <Row className="border col py-2 h-100">
                        <Col className="h-100 overflow-auto">
                                { temporaryListNames.length ? (
                                    temporaryListNames.map((group: any, groupIndex: number) => (
                                        <div key={groupIndex} className="mb-3">
                                            <h6>{group.name1}</h6>
                                            <Row className="row-cols-4">
                                                {group.items.map((item: any, itemIndex: number) => (
                                                    <Col key={itemIndex}>
                                                        <Row className="user-select-none" title={`${group.name1} / RATE : ${item.rate}${item.isPreviouslyOrdered ? ' (Previously Ordered)' : ''}`}>
                                                            <Col className="flex-grow-0">
                                                                <Form.Check inline>
                                                                    <Form.Check.Input 
                                                                        className="border border-secondary" 
                                                                        id={`check-${groupIndex}-${itemIndex}`}
                                                                        onChange={(e) => handleSelectName(e, item, groupIndex,itemIndex)} 
                                                                        type="checkbox" 
                                                                        checked={item?.isChecked}
                                                                        disabled={item.isPreviouslyOrdered}
                                                                    />
                                                                </Form.Check>
                                                            </Col>
                                                            <Col>
                                                                <Form.Label 
                                                                    htmlFor={`check-${groupIndex}-${itemIndex}`} 
                                                                    className={`w-100 ${(group.name1 == "THYROCARE " || group.name1 == "Z-THYROCARE") ? "text-danger" : ""} ${item.isPreviouslyOrdered ? "text-primary" : ""}`}
                                                                    style={item.isPreviouslyOrdered ? { cursor: 'not-allowed' } : {}}
                                                                >
                                                                    {item.name}
                                                                    {item.isPreviouslyOrdered && " ✓"}
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
                        <Col xs="2" className="bg-light rounded border overflow-auto h-100">
                            <Row className="border-bottom pb-1 text-primary fw-bold">
                                <Col>PREVIOUS ORDERS TOTAL</Col>
                                <Col className="text-end">
                                    {Number(previousOrdersTotal).toFixed(2)}
                                </Col>
                            </Row>
                            <Row className="border-bottom pb-1 text-success fw-bold">
                                <Col>ORDER TOTAL</Col>
                                <Col className="text-end">
                                    {Number(orderTotal).toFixed(2)}
                                </Col>
                            </Row>
                            
                            <Row className="border-bottom pb-1 text-danger fw-bold">
                                <Col>GRAND TOTAL</Col>
                                <Col className="text-end">
                                    {Number(grandTotal).toFixed(2)}
                                </Col>
                            </Row>
                            {
                                allDisplayItems.map((item: any, idx: number) => {
                                    const isPastOrder = item.isPreviouslyOrdered;
                                    const isCurrentSelection = item.isCurrentSelection;
                                    
                                    return (
                                        <Row key={idx} className="border-bottom pb-1 align-items-center" title={`${item?.name} / RATE : ${item?.rate || 0}`}>
                                            <Col
                                                onClick={() => !isPastOrder && handleRemoveSelectedOrder(item.name)}
                                                className={isPastOrder ? "text-primary" : isCurrentSelection ? "text-success" : "text-muted"}
                                                style={{ cursor: isPastOrder ? 'default' : 'pointer' }}
                                            >
                                                {item.name}
                                                {isPastOrder && " ✓"}
                                            </Col>
                                        </Row>
                                    );
                                })
                            }
                        </Col>
                    </Row>
                </Col>
                <Col className="flex-grow-0 row text-end pb-2">
                    <Col>
                        <Button variant='warning' className="button_style py-1 px-5 mx-3" onClick={() => refresh()}>Refresh</Button>
                        <Button variant='dark' className=' button_style py-1 px-5  mx-3' onClick={() => setShowLabAndProcedureSave(true)} disabled={selectedNames.filter(item => !item.isPreviouslyOrdered).length > 0 ? false : true}>PREVIEW</Button>
                    </Col>
                </Col>
            </Row>
            <LabAndProdcedureTemplate show={showLabAndProcedureTemplate} onHide={() => { setShowLabAndProcedureTemplate(false); setSelectedTemplateValue([]) }} templateNameList={templateNameList} selectedTemplateValue={selectedTemplateValue} handleError={handleError} handleSelectTemplate={handleSelectTemplate} hanldeMapTemplates={hanldeMapTemplates} handleDeleteTemplate ={handleDeleteTemplate} />
            <LabAndProdcedureSave
                hanldeNumberInputZero={hanldeNumberInputZero}
                saveState={saveState}
                selectedNames={selectedNames.filter(item => !item.isPreviouslyOrdered)}
                disc={{ setDiscount, discount }}
                handleSave={handleSave}
                show={showLabAndProcedureSave}
                onHide={() => setShowLabAndProcedureSave(false)}
                getItemUnits={getItemUnits}
                handleSelectedOrderUnitsChange={handleSelectedOrderUnitsChange}
                handleSelectedOrderUnitsInput={handleSelectedOrderUnitsInput}
            />
            <LabAndProdcedureOrder preDiscount={preDiscount} patientDetails={patientDetails} pastDetails={{ pastInvDetails, pastLabDetails }} show={showLabAndProcedureOrder} onHide={() => setShowLabAndProcedureOrder(false)} deleteLabOrderByLabId={deleteLabOrderByLabId} deleteInvestigationOrderByProcId={deleteInvestigationOrderByProcId} DeleteLabAndProcedureOrderDiscount={DeleteLabAndProcedureOrderDiscount} deleteInvestigationOrdersByPatId={deleteInvestigationOrdersByPatId} deleteLaboratoryOrdersByPatId={deleteLaboratoryOrdersByPatId} deleteInvestigationOrderByorderId={deleteInvestigationOrderByorderId} loginUserId={loginUser.id} />
        </ClinicalLayout>
    )
}

export default LabAndProcedure