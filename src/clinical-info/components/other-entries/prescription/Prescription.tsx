import { useEffect, useState } from 'react'
import { Button, Col, Form, FormLabel, Row, Table, InputGroup, ButtonGroup, Modal } from 'react-bootstrap'
import ClinicalLayout from '../../../components/ClinicalLayout'
import { PrescriptionApiService } from '../../../../api/prescription/prescription-api-service'
import PrescriptionTemplates from './componets/prescription-templates/PrescriptionTemplates'
import PreviousPrescription from './componets/previous-prescription/PreviousPrescription'
import EditPrescription from './componets/edit-prescription/EditPrescription'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrorHandling, errorHandling } from '../../../../error/state/error-handle-action'
import { AxiosError } from 'axios'
import SavePreviewPrescription from './componets/save-preview-prescription/SavePreviewPrescription'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faCircleInfo, faFilePrescription } from '@fortawesome/free-solid-svg-icons'
import { ConsultantApiService } from '../../../../api/consultant/consultant-api-service'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../utils/toast'
import { RootState } from '../../../../state/store'
import { useLocation } from 'react-router-dom'
import { DiscountApiService } from '../../../../api/discount/dicount-api-service'
import { focusInputElementWithIndex } from '../../../../utils/elementUtil'
import { toastWarningBounceDark } from '../../../../toast-message/toast'

const Prescription = () => {

    const dispatch = useDispatch()
    //          ----------------------API-----------------------
    const { clinicalCurrentIpPatient, clinicalCurrentOpPatient, isIp } = useSelector((s: RootState) => s.clinicalPersistReducer)

    let patientDetails: any;

    let ipId;

    const location = useLocation();

    if (isIp == 0) {
        patientDetails = clinicalCurrentOpPatient
        ipId = 0
    } else {
        patientDetails = clinicalCurrentIpPatient
        ipId = patientDetails.ipId
    }

    const loginUser = useSelector((s: RootState) => s.loginData)
    const {organization} = useSelector((s:RootState)=>s.appReducer)
    const prescriptionApiService: PrescriptionApiService = new PrescriptionApiService()
    const consultantApiService: ConsultantApiService = new ConsultantApiService()
    const [prescriptionDurationDetails, setPrescriptionDurationDetails] = useState<any>([]);
    const [prescriptionUnitDetails, setPrescriptionUnitDetails] = useState<any>([]);
    const [prescriptionTimingDetails, setPrescriptionTimingDetails] = useState<any>([]);
    const [phInstructionDetails, setPhInstructionDetails] = useState<any>([]);
    const [phRoutesDetails, setPhRoutesDetails] = useState<any>([]);
    const [selTemplateName , setSelTemplateName] = useState <any>({"id": 0,"templateName": "", "isValid" : 1})

    const prescription: any = {
        medName: '',
        searchMedName: "",
        genName: "",
        genId: "0",
        id: '',
        formType: "0",
        stock: "0",
        quantity: "1",
        unit: "",
        timingValue: ["0", "0", "0", "0"],
        duration: 0,
        period: "",
        no: "0",
        mrpPrice: 0,
        rate: 0.00,
        medStrength: 0,
        medQuantity: 0,
        own: 0,
        notes: '',
        selectedMedicine: [],
        selectedTiming: { id: '0', name: 'None', totalUnits: 0, doseDuration: 1 },
        selectedPeriod: { id: '0', name: "None", days: 0 },
        selectedUnit: { id: "0", name: 'None', typeId: 0 },
        selectedInstruction: { id: "0", name: 'None' },
        selectedRoute: { id: "0", name: 'None' },
        isUnitDisabled: false,
        isQuantityDisabled: false,
        isPeriodDisabled: false,
        isVariableDose: false,
        isManualTotal: false,
        allStock: [],
        units: [...prescriptionUnitDetails],
        timings: [...prescriptionTimingDetails],
        periods: [...prescriptionDurationDetails],
        instructions: [...phInstructionDetails],
        routes: [...phRoutesDetails],
        itemHasError: ""
    };

    const prescriptionFormat = {
        prescription_id: 0,
        generic_id: 0, // need
        prods_id: 0, // need
        quantity: 1, //need
        unit: 0, // need
        qno: 0,
        timing: 0, //
        timingUnits: "0-0-0-0",//
        duration: 0,//
        period: 0,//
        route: 0,
        is_order_prepared: 0,
        order_id: 0,
        is_paid: 0,
        is_own: 0,//
        is_cancelled: 0,
        batchId: 0,
        instruction: 0,
        notes: ""
    }

    const saveFormat = {
        display: 0,//
        cycle_id: 1,
        pat_id: 0,//
        doc_id: 0,
        dept_id: 0,//
        date: "0000-00-00",
        time: "00:00:00",
        uid: 0,
        instruction: 0,
        is_doc_prescription: 1,
        is_valid: 1,
        is_first_dosage_seted: 0,
        ip_id: ipId,
        is_order_prepared: 0,
        is_opd_order: 1,
        advice: 0,
        visit_id: 0,//
        isIssued: 0,
        is_billed: 0,
        final_bill_id: 0,
        notes: "",
        isFromSummary: 0,
        discAmt: 0
    }

    const saveTemplateFormat = {
        name: "",
        docId: 0,
        deptId: 0,
        date: "0000-00-00",
        time: "00:00:00",
        uid: 0,
        isDocTemplate: 0,
        templateType: 1,
        isValid: 1,
        vaccinationId: 0,
        fromPeriod: 0,
        vaccinationTo: 0,
        toPeriod: 0,
        vaccinationFrm: 0
    }

    const createPrescTemplateRequestList = {
        templateId: 0,
        genericId: 0,
        prodsId: 0,
        quantity: 0,
        unit: 0,
        no: 0,
        timing: 0,
        duration: 0,
        period: 0,
        route: 0,
        instruction: 0,
        extra1: 0,
        extra2: 0,
        extra3: 0,
        extra4: 0,
        extra5: 0,
        timingUnit: "0-0-0-0"
    }

    const [tempPrescriptions, setTempPrescriptions] = useState<any[]>([prescription]);
    const [savePrescriptionsData, setSavePrescriptionsData] = useState<any[]>([]);

    const [medicineNameListOption, setMedicineNameListOption] = useState<any>([]);
    const [genericNameOptions, setGenericNameOptions] = useState<any[]>([])
    const [consultantOption, setConsultantOption] = useState<[]>([]);
    const [equalantDrugs, setEqualantDrugs] = useState<any[]>([{ id: "0", drugsName: "EQUIALANT DRUGS" }])
    const [selectedGenericName, setSelectedGenericName] = useState<any[]>([])
    const [selectedEqualantDrug, setSelectedEqualantDrug] = useState<any>({})
    const [selectedConsultant, setSelectedConsultant] = useState<[]>([])
    const [commonDuration, setCommonDuration] = useState<any>({ number: 0, duration: 0 })


    const [templateNameList, setTemplateNameList] = useState<any[]>([])
    const [templateSelectedValue, setTemplateSelectedValue] = useState<any[]>([])
    const [previousPrescriptionAllList, setPreviousPrescriptionAllList] = useState<any[]>([])
    const [previousPrescriptionNameList, setPreviousPrescriptionNameList] = useState<any[]>([])
    const [previousPrescriptionSelectedValue, setPreviousPrescriptionSelectedValue] = useState<any[]>([])

    const [isPrescriptionSaved, setIsPrescriptionSaved] = useState(false)
    const [isPrescriptionUpdated, setIsPrescriptionUpdated] = useState({ status: false, id: "" })
    const [isSave, setIsSave] = useState(true)
    const [templateStatus, setTemplateStatus] = useState({ text: "", status: false })
    const [generalInstruction, setGeneralInstruction] = useState("")
    const [timingPicker, setTimingPicker] = useState<{ show: boolean; idx: number | null }>({ show: false, idx: null })
    const [periodPicker, setPeriodPicker] = useState<{ show: boolean; idx: number | null }>({ show: false, idx: null })
    const [routePicker, setRoutePicker] = useState<{ show: boolean; idx: number | null }>({ show: false, idx: null })
    const [instructionPicker, setInstructionPicker] = useState<{ show: boolean; idx: number | null }>({ show: false, idx: null })
    const [dosePicker, setDosePicker] = useState<{ show: boolean; idx: number | null }>({ show: false, idx: null })

    //         ---------------------POP UP---------------------

    const [showPrescriptionTemplates, setShowPrescriptionTemplates] = useState(false);
    const [showPreviousPrescription, setShowPreviousPrescription] = useState(false);
    const [showEditPrescription, setShowEditPrescription] = useState(false);
    const [showSavePreviewPrescription, setShowSavePreviewPrescription] = useState(false);
    const [showPrescribedDetails, setShowPrescribedDetails] = useState(false);
    const [prescribedDetailsData, setPrescribedDetailsData] = useState<any[]>([]);
    const { id: userId } = useSelector((s: RootState) => s.loginData);

    //         ---------------------DISCOUNT---------------------

    const discountApiService: DiscountApiService = new DiscountApiService()
    //const [discountAmount, setDiscountAmount] = useState({ patId: patientDetails.patientId, uid: loginUser.id, datetime: "string", discAmt: 0, finalBillId: 0 })
    const [discountAmount, setDiscountAmount] = useState({ discAmt: 0 })
    const [isPrescriptionCurrent , setIsPrescriptionCurrent] = useState(false)

    //         ---------------------FUNCTIONS---------------------

   // console.log(organization?.salesStoreId);
    
    let timingPossibilitiesId = ['3', "12", "13", "14", "15", "16", "17"]; // for insulin like 0-0-0, 0-0-1, 0-1-1,etc......

    let timingPossibilitiesArray: number[] = [19, 21, 23, 22, 72] // for stat,s-o-s,num,etc....

    // let hospitalDisponsoryStoreId: number = 6;
    let hospitalDisponsoryStoreId: number = Number(organization?.salesStoreId);

    let medicineStoreId: number = Number(organization?.salesStoreId);

    let prescriptionTemplateId: number = 1;

    const getDurationDetails = async () => {
        try {
            let durationResponse = await prescriptionApiService.getPrescriptionDurationDetails();
            durationResponse.unshift({ id: 0, name: "None", days: 0 });
            const sorted = [...durationResponse].sort((a, b) => a.days > b.days ? 1 : -1);
            prescription.periods = sorted;
            setPrescriptionDurationDetails(sorted);
            const dayPeriod = getDefaultPeriod(sorted);
            if (dayPeriod) {
                prescription.selectedPeriod = dayPeriod
                setTempPrescriptions((prev: any[]) => prev.map((item: any) => {
                    if (!item?.selectedPeriod?.id || item.selectedPeriod.id == 0) {
                        return { ...item, selectedPeriod: dayPeriod }
                    }
                    return item
                }))
            }
        } catch (error) {
            handleError(error)
        }
    }

    const getUnitDetails = async () => {
        try {
            let unitResponse = await prescriptionApiService.getPrescriptionUnitDetails();
            unitResponse.unshift({ typeId: '0', name: 'None', id: 0 });
            prescription.units = unitResponse;
            setPrescriptionUnitDetails([...unitResponse]);
        } catch (error) {
            handleError(error)
        }
    }

    const getTimingDetails = async () => {
        try {
            const timingResponse = await prescriptionApiService.getPrescriptionTimingDetails();
            timingResponse.unshift({ 'id': '0', 'name': 'None', 'totalUnits': "0", "doseDuration": "1" });
            prescription.timings = timingResponse;
            setPrescriptionTimingDetails([...timingResponse]);
        } catch (error) {
            handleError(error)
        }
    }
    const getInstructionDetails = async () => {
        try {
            let instructionResponse = await prescriptionApiService.getPhInstructionDetails();
            instructionResponse.unshift({ name: 'None', id: 0 });
            prescription.instructions = instructionResponse;
            setPhInstructionDetails([...instructionResponse]);
        } catch (error) {
            handleError(error)
        }
    }
    const getRouteDetails = async () => {
        try {
            let routeResponse = await prescriptionApiService.getPhRoutesDetails();
            routeResponse.unshift({ name: 'None', id: 0 });
            prescription.routes = routeResponse;
            setPhRoutesDetails([...routeResponse]);
        } catch (error) {
            handleError(error)
        }
    }

    const hanldeGetTemplateNameList = async () => {
        try {
            let tempNameResponse: any[] = await prescriptionApiService.getPrecriptionTemplateNameList(prescriptionTemplateId)
            if (tempNameResponse.length > 0) {
                tempNameResponse = tempNameResponse.sort((a, b) => String(a.templateName).toLocaleLowerCase() > String(b.templateName).toLocaleLowerCase() ? 1 : -1)
                setTemplateNameList(tempNameResponse)
                hanldeGetSelectedTemplateDetails(tempNameResponse[0].id)
            } else {
                setTemplateNameList([{ id: "0", templateName: "Template Is Empty" }]);
            }
        } catch (error) {
            handleError(error)
        }
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

    const normalizeTimingDoseInput = (value: string) => {
        let cleaned = value.replace(/[^0-9.]/g, "")
        const firstDot = cleaned.indexOf(".")
        if (firstDot !== -1) {
            cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "")
        }
        if (cleaned.startsWith(".")) {
            cleaned = "0" + cleaned
        }
        if (cleaned === "") {
            return ""
        }
        const [intPartRaw, decPartRaw] = cleaned.split(".")
        let intPart = (intPartRaw || "").slice(0, 3)
        if (!cleaned.includes(".")) {
            intPart = intPart.replace(/^0+(?=\d)/, "")
        }
        const decPart = (decPartRaw || "").slice(0, 2)
        if (cleaned.includes(".")) {
            return `${intPart}.${decPart}`
        }
        return intPart || "0"
    }

    const getTimingUnitsString = (values: any[] | undefined) => {
        const arr = Array.isArray(values) && values.length > 0 ? values : ["0", "0", "0", "0"]
        return arr.join("-")
    }

    const getTimingUnitsForSave = (item: any) => {
        const pattern = getTimingPatternFromItem(item)
        if (pattern) {
            // For numeric timing patterns (0-0-0-1, 1-0-0-0, etc.), save as dose array
            return getTimingUnitsString(item.timingValue)
        } else {
            // For non-numeric timings (BD, OD, S-O-S, STAT, WKLY, etc.), save as single dose value
            // Use quantity field if no pattern, else use first timingValue element
            return String(item.quantity || item.timingValue[0] || "0")
        }
    }

    const timingPossibilitiesCondition = (item: any) => {
        let condArr: boolean[] = []
        timingPossibilitiesArray.forEach((posId: number) => {
            if (item.selectedTiming.id == posId) {
                condArr.push(true)
            }
        })
        if (condArr.includes(true)) {
            return true
        } else {
            return false
        }
    }

    const getDefaultPeriod = (periods: any[]) => {
        return [...periods].find((p: any) => String(p?.name || "").toLowerCase() === "day")
    }

    const getOralRoute = (routes: any[]) => {
        return [...routes].find((r: any) => String(r?.name || "").toLowerCase() === "oral")
    }

    const getTimingPatternFromItem = (item: any) => {
        const timingName = String(item?.selectedTiming?.name || "").trim()
        if (/^[01]-[01]-[01]$/.test(timingName) || /^[01]-[01]-[01]-[01]$/.test(timingName)) {
            return timingName.split('-').map((v: string) => Number(v))
        }
        return null
    }

    const applyTimingPatternToItem = (item: any, setDefaults: boolean = false) => {
        const pattern = getTimingPatternFromItem(item)
        if (!pattern) {
            return item
        }
        if (item.formType == 3) {
            item.quantity = "1"
        }
        if (!Array.isArray(item.timingValue) || item.timingValue.length !== pattern.length) {
            item.timingValue = new Array(pattern.length).fill("0")
        }
        item.timingValue = item.timingValue.map((val: any, idx: number) => {
            if (pattern[idx] === 0) {
                return "0"
            }
            if (setDefaults && (val === undefined || val === null || String(val) === "" || String(val) === "0")) {
                return "1"
            }
            if (val === undefined || val === null || String(val) === "") {
                return "0"
            }
            return String(val)
        })
        return item
    }

    const handleCommonDurationForAll = (e: any) => {
        let { value } = e.target
        let posibilitiesTimingsCondition: Boolean
        value = hanldeNumberInputZero(value)
        tempPrescriptions.forEach((medItem: any, idx: number) => {
            posibilitiesTimingsCondition = timingPossibilitiesCondition(medItem)
            if (!posibilitiesTimingsCondition) {
                medItem.duration = value
            }
            medItem = updateRowItemWithCalculation(medItem)

            updateRowItem(idx, medItem)
        })
        setCommonDuration((pre: any) => ({ ...pre, number: value }))
    }

    const handleCommonDurationPeriodForAll = (e: any) => {
        let { value } = e.target
        tempPrescriptions.forEach((medItem: any, idx: number) => {
            medItem.selectedPeriod = [...medItem.periods].find((period: any) => period.id == value)
            medItem = updateRowItemWithCalculation(medItem)
            updateRowItem(idx, medItem)
        })
        setCommonDuration((pre: any) => ({ ...pre, duration: value }))
    }

    const hanldeGetSelectedTemplateDetails = async (tempId: string) => {
        try {
            if (tempId != "0") {
                console.log(tempId)
                handleEditTemplate(tempId);
                const tempResponse = await prescriptionApiService.getPrescriptionTemplateDetailsById(tempId, hospitalDisponsoryStoreId)
                setTemplateSelectedValue(tempResponse);
            }
        } catch (error) {
            handleError(error)
        }
    }

    const fetchGetPreviousPrescription = async () => {
        try {
            if (patientDetails.visitId) {
                let prevPrescriptionListResponse = await prescriptionApiService.getPrescriptionDetailsbyPatId(String(patientDetails.patientId), hospitalDisponsoryStoreId)
                prevPrescriptionListResponse = [{ displayNo: "SELECT PRESCRIPTION" }, ...prevPrescriptionListResponse]
                setPreviousPrescriptionAllList([...prevPrescriptionListResponse])
                prevPrescriptionListResponse = prevPrescriptionListResponse.reduce((acc: any[], cur: any) => {
                    if (acc.findIndex((item: any) => item.displayNo == cur.displayNo) < 0) {
                        acc.push(cur)
                    }
                    return acc
                }, [])
                setPreviousPrescriptionNameList([...prevPrescriptionListResponse])
            }
        } catch (error) {
            handleError(error)
        }
    }

    const fetchPrevPrescriptionDetailsByVstId = async () => {
        try {
            if (patientDetails.visitId) {
                let prevPrescriptionListResponse = await prescriptionApiService.fetchPrevPrescriptionDetailsByVstId(String(patientDetails.visitId), hospitalDisponsoryStoreId)
                prevPrescriptionListResponse = [{ displayNo: "SELECT PRESCRIPTION" }, ...prevPrescriptionListResponse]
                setPreviousPrescriptionAllList([...prevPrescriptionListResponse])
                prevPrescriptionListResponse = prevPrescriptionListResponse.reduce((acc: any[], cur: any) => {
                    if (acc.findIndex((item: any) => item.displayNo == cur.displayNo) < 0) {
                        acc.push(cur)
                    }
                    return acc
                }, [])
                setPreviousPrescriptionNameList([...prevPrescriptionListResponse])
            }
        } catch (error) {
            handleError(error)
        }
    }

    const fetchPrescribedDetailsByVstId = async () => {
        try {
            if (patientDetails.visitId) {
                const response = await prescriptionApiService.fetchPrevPrescriptionDetailsByVstId(
                    String(patientDetails.visitId),
                    hospitalDisponsoryStoreId
                )
                const enrichedPrescribedDetails = response
                    .filter((item: any) => item.formType)
                    .map((item: any) => {
                        const matchedTiming = prescriptionTimingDetails.find((timing: any) => String(timing.id) === String(item.timingId))
                        return {
                            ...item,
                            frequencyName: matchedTiming?.timingName || matchedTiming?.name || "",
                            frequencyDescription: matchedTiming?.description || "",
                            routeText: item?.route || "",
                            instructionText: item?.instruction || "",
                            notesText: item?.notes || "",
                            billingStatus: String(item?.isBilled) === "1" ? "Billed" : "Prescribed"
                        }
                    })
                setPrescribedDetailsData(enrichedPrescribedDetails)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleTypeHeadGenericSearch = async (query: string) => {
        try {
            const genericResponse = await prescriptionApiService.getGenericDetails(query)
            if (genericResponse.length > 0) {
                setGenericNameOptions([...genericResponse]);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleMedicineSearch = async (query: string, item: any, idx: number) => {
        try {
            item.searchMedName = query
            tempPrescriptions[idx] = item;
            setTempPrescriptions([...tempPrescriptions]);
            if (query.length > 1) {
                const medicineNameListResponse: any = await prescriptionApiService.getMedicineNameList(query, `${medicineStoreId}`);
                setMedicineNameListOption(medicineNameListResponse);
            }
        } catch (error) {
            // handleError(error)
        }
    };

    const handleConsultantSearch = async (query: string) => {
        try {
            const medicineNameListResponse: any = await consultantApiService.getConsultantList(query);
            setConsultantOption(medicineNameListResponse);
        } catch (error) {

        }
    };

    const getGenericEqualantDrugs = async (genId: string) => {
        try {
            let response = await prescriptionApiService.getEqualentDrugs(genId)
            setEqualantDrugs([...response])
            return response
        } catch (error) {

        }
    };

    const handleMedicineSelect = async (selectedArr: any, idx: number, item: any) => {
        try {
            item = await handleMedicineSelectedInit(selectedArr, item)
            item = updateRowItemWithCalculation(item)
            validateAndClearError(idx, item)
            updateGenericName(item.genName, item.genId, item.medName);
        } catch (error) {
            handleError(error)
        }
    };

    const handleConsultantSelect = async (selectedArr: any) => {
        try {
            if (selectedArr.length > 0) {
                setSelectedConsultant(selectedArr)
            } else {
                setSelectedConsultant([])
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleMedicineOnKeyDown = async (e: any, idx: number, item: any) => {
        if (medicineNameListOption.length > 0 && (e.key == 'Tab' || e.key == "Enter")) { //            
            if (item.component && item.component.state && item.component.state) {
                e.preventDefault()
                let state = item.component.state;
                if (e.key == 'Tab' && state.activeItem) {
                    handleMedicineSelect([{ ...state.activeItem }], idx, item)
                }
                if (e.key == "Enter" && !state.activeItem && state.initialItem) {
                    handleMedicineSelect([{ ...state.initialItem }], idx, item)
                }
                focusInputElementWithIndex(2);
            }
        }
    };

    const handleOnGenericNameSelect = async (item: any) => {
        try {
            if (item.length > 0) {
                let res = await getGenericEqualantDrugs(item[0].id)
                const medicineNameListResponse: any = await prescriptionApiService.getMedicineNameList(res[0].drugsName, "11");
                if (medicineNameListResponse.length > 0) {
                    let med = await handleMedicineSelectedInit(medicineNameListResponse, { ...prescription })
                    tempPrescriptions[tempPrescriptions.length - 1] = med;
                    setTempPrescriptions([...tempPrescriptions]);
                }
            } else {
                setEqualantDrugs([{ id: "0", drugsName: "EQUALANT DRUGS" }])
            }
            setSelectedGenericName([...item]);
        } catch (error) {

        }
    };

    const handlePreviousPrescrionSelected = async (selectedDisplayNumber: string) => {
        try {
            let selected = [...previousPrescriptionAllList].filter((pres: any) => pres.displayNo == selectedDisplayNumber).filter((pre: any) => pre.formType)
            // if (selected.length == 0) {
            //     setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: "" }))
            // } else {
            //     setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: `${selected[0].displayNo}` }))
            // }
            setPreviousPrescriptionSelectedValue([...selected])
            // getGeneralInstruction(Number(selectedDisplayNumber))
        } catch (error) {
            handleError(error)
        }
    };

    const handleMapPrevMed = () => {
        let con = [...previousPrescriptionSelectedValue].map((preMed: any) => {
            preMed = hanldePrevMedicineInit(preMed)
            return preMed
        })
        if (con.length != 0) {
            setTempPrescriptions(con);
            setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: "" }))
        } else {
            setTempPrescriptions([prescription])
        }
        setCommonDuration({ number: 0, duration: 0 })
        setShowPreviousPrescription(false);
        setPreviousPrescriptionSelectedValue([])
        setIsSave(true)
        setIsPrescriptionSaved(false)
        setIsPrescriptionCurrent(false)
    };

    const handleMapEditMed = () => {
        let con = [...previousPrescriptionSelectedValue].map((preMed: any) => {
            preMed = hanldePrevMedicineInit(preMed)
            return preMed
        })
        if (con.length != 0) {
            setTempPrescriptions(con);
            setIsPrescriptionUpdated({ status: false, id: previousPrescriptionSelectedValue[0].displayNo })
            getGeneralInstruction(previousPrescriptionSelectedValue[0].displayNo)
        } else {
            setTempPrescriptions([prescription])
            setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: "" }))
        }
        setCommonDuration({ number: 0, duration: 0 })
        setShowEditPrescription(false);
        setIsSave(false)
        setIsPrescriptionCurrent(false)
        setPreviousPrescriptionSelectedValue([])
    };

    const handleMapLastPrescription = async () => {
        try {
            const lastPrescriptionResponse: any = await prescriptionApiService.fetchPatientLastPrescriptionDetails(`${patientDetails.patientId}`, hospitalDisponsoryStoreId);
            if(lastPrescriptionResponse[0].visitId){ 
                setIsPrescriptionCurrent(true)
                setIsPrescriptionSaved(true)

            } else {
                setIsPrescriptionSaved(false)
            }
            let con = [...lastPrescriptionResponse].map((preMed: any) => {
                preMed = hanldePrevMedicineInit(preMed)
                return preMed
            })
            if (con.length != 0) {
                setTempPrescriptions(con);
            }
            else {
                tempPrescriptions.forEach((item: any, idx: any) => {
                    if (idx == 0) {
                        item?.component?.focus();
                    }
                })
            }
            setCommonDuration({ number: 0, duration: 0 })
            setShowPreviousPrescription(false);
            setPreviousPrescriptionSelectedValue([])
            setIsSave(true)
            // setIsPrescriptionSaved(false)
        } catch (error) {
            handleError(error)
        }
    };
    const handleEditTemplate = async (tempId : string) => {
        let id = Number(tempId)
        const selectedTemplate = templateNameList.find(template => template.id === id);
        if(selectedTemplate){
            setSelTemplateName((prev : any)=> ({...prev, id : selectedTemplate.id, templateName : selectedTemplate.templateName}) )
        }
        console.log(selectedTemplate)
    }

    const handleChangeTemplateName = (value : any, fieldName : string) => {
        console.log(value, fieldName);
        if(fieldName === "isValid") {
            value = value ? 0 : 1
        }
        console.log(value, fieldName);
        setSelTemplateName((prev : any)=> ({...prev, [fieldName] : value}) )
    }

    const handleDeleteTemplate = async () => {
            try { 
                let payload = {...selTemplateName , editUid : userId}
                let tempId = selTemplateName.id;
                if (tempId === 0) {
                    toastWarningBounceDark("Please select a template to delete.")
                    return;
                }
                if (selTemplateName.isValid ===1 && selTemplateName.templateName === "") {
                    toastWarningBounceDark("Template Name cannot be Empty.")
                    return;
                }
                console.log(payload);
                let result = await prescriptionApiService.editPrescriptionTemplate(payload);
                if (result) {
                    if (result === "Template name already exists"){
                        toastWarningBounceDark(result)
                        setSelTemplateName({"id": 0,"templateName": "", "isValid" : 1});
                        return
                    }
                    else{
                        toastSuccessBounceDark(result)
                        hanldeGetTemplateNameList()
                        setSelTemplateName({"id": 0,"templateName": "", "isValid" : 1});
                    }
                } else {
                    toastErrorBounceDark("Failed to edit Template.")
                    hanldeGetTemplateNameList()
                    setSelTemplateName({"id": 0,"templateName": "", "isValid" : 1});
                }
                
            } catch (error) {
                handleError(error);
                setSelTemplateName({"id": 0,"templateName": "", "isValid" : 1});
                console.log("Error while deleting template", error);
            } finally {
                
            }
        }
    
    const handleMapTemplate = () => {
        let con = [...templateSelectedValue].map((preMed: any) => {
            preMed = hanldePrevMedicineInit({ ...preMed, route: preMed.routeId, instruction: preMed.instructionId })
            return { ...preMed, own: 0 }
        })
        if (con.length != 0) {
            let local = [...tempPrescriptions].filter((prod: any) => prod.id != "")
            setTempPrescriptions((pre: any) => [...local, ...con]);
            setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: "" }))
        }
        setCommonDuration({ number: 0, duration: 0 })
        setShowPrescriptionTemplates(false);
        setTemplateSelectedValue([])
        setIsSave(true)
        setIsPrescriptionSaved(false)
        setIsPrescriptionCurrent(false)
    };

    const hanldePrevMedicineInit = ((prevMed: any) => {
        let posibilitiesTimingsCondition: Boolean
        let item = { ...prescription, genId: prevMed.genId, genName: prevMed.genName, id: prevMed.id, medName: prevMed.medName, formType: prevMed.formType, unit: prevMed.unit, medStrength: prevMed.medStrength, medQuantity: prevMed.medQuantity, stock: prevMed.stock, quantity: prevMed.quantity, duration: prevMed.duration, mrpPrice: prevMed.mrpPrice, no: prevMed.no, }
        // If previous prescription has a manual total quantity set, preserve it and mark as manual to skip recalculation
        item.isManualTotal = (Number(prevMed.no) || 0) > 0 ? true : false
        item.selectedUnit = [...item.units].find((unit: any) => unit.id == prevMed.unitId)
        item.selectedTiming = [...item.timings].find((time: any) => time.id == prevMed.timingId)
        item.selectedPeriod = [...item.periods].find((period: any) => period.id == prevMed.periodId)
        item.selectedRoute = [...item.routes].find((route: any) => route.id == prevMed.routeId)
        item.selectedInstruction = [...item.instructions].find((instruction: any) => instruction.id == prevMed.instructionId)
        item.selectedMedicine = [prevMed.medName]
        const timingSource = prevMed.timingUnit || prevMed.timingUnits || ""
        const timingParts = timingSource ? String(timingSource).split("-") : []
        item.timingValue = timingParts.length >= 4
            ? [...timingParts]
            : [...timingParts, ...new Array(4 - timingParts.length).fill("0")]
        const hasTimingUnits = !!timingSource && timingSource !== "0-0-0" && timingSource !== "0-0-0-0"
        item.isVariableDose = item.formType == 3 && hasTimingUnits
        item.searchMedName = prevMed.medName
        item.own = prevMed.own
        item.notes = prevMed.notes

        if (typeof item.selectedUnit == "undefined") {
            if (item.formType == 2 || item.formType == 3) {
                item.selectedUnit = [...item.units].find((unit: any) => unit.name.toLowerCase() == 'ml')
            } else {
                item.selectedUnit = [...item.units].find((unit: any) => unit.name.toLowerCase() == '"none"')
            }
        }
        if (!item.selectedPeriod || item.selectedPeriod.id == 0) {
            const dayPeriod = getDefaultPeriod(item.periods || [])
            if (dayPeriod) {
                item.selectedPeriod = dayPeriod
            }
        }
        if (item.formType == 1 && (!item.selectedRoute || item.selectedRoute.id == 0)) {
            const oralRoute = getOralRoute(item.routes || [])
            if (oralRoute) {
                item.selectedRoute = oralRoute
            }
        }
        if (item.formType == 1) {
            item.selectedUnit = [...item.units].find((unit: any) => unit.name.toLowerCase() == 'tab')
            // item.isUnitDisabled = true
        } else if (item.formType == 4) {
            item.selectedUnit = [...item.units].find((unit: any) => unit.name.toLowerCase() == 'gm')
            // item.isUnitDisabled = true
        }
        posibilitiesTimingsCondition = timingPossibilitiesCondition(item)
        if (posibilitiesTimingsCondition) {
            item.selectedPeriod = item.periods[0];
            // item.isPeriodDisabled = true
            item.no = item.duration
            if (item.formType == 3 && item.quantity < 2) {
                // item.isPeriodDisabled = false;
            }
        } else {
            item.isPeriodDisabled = false
        }
        item.rate = Number(item.no * item.mrpPrice).toFixed(2)
        if (item.stock < 1) {
            item.no = 0
        }
        item = updateRowItemWithCalculation(item)

        return item
    });

    const handleError = (error: any) => {

        if (error.message === "Network Error") {
            toastErrorBounceDark("Please Contact Admin.");
        } else {
            // toastErrorBounceDark(error.response?.data?.message || "Something went wrong.");
        }

        if (error instanceof AxiosError) {
            dispatch(errorHandling(error.message));
            console.log(error)
        } else {
            console.log(error)
        }
    };

    const addMorePrescription = (item: any, idx: number) => {
        // Validate current row before adding a new one
        const validation = validatePrescriptionItem(item);
        if (!validation.isValid) {
            // Highlight the error item
            item.itemHasError = validation.errorMessage;
            setTempPrescriptions([...tempPrescriptions]);
            // Show error toast
            toastErrorBounceDark(validation.errorMessage);
            return;
        }

        if (item.no > 0) {
            setTempPrescriptions((pre: any) => {
                // Build a fresh row copying current lookup lists to avoid shared references
                const defaultPeriod = getDefaultPeriod(prescriptionDurationDetails)
                const newItem: any = {
                    ...prescription,
                    units: [...prescriptionUnitDetails],
                    timings: [...prescriptionTimingDetails],
                    periods: [...prescriptionDurationDetails],
                    instructions: [...phInstructionDetails],
                    routes: [...phRoutesDetails],
                    selectedUnit: { id: "0", name: 'None', typeId: 0 },
                    selectedTiming: { id: '0', name: 'None', totalUnits: 0, doseDuration: 1 },
                    selectedPeriod: defaultPeriod || { id: '0', name: 'None', days: 0 },
                    selectedInstruction: { id: '0', name: 'None' },
                    selectedRoute: { id: '0', name: 'None' },
                    selectedMedicine: [],
                    timingValue: ["0", "0", "0", "0"],
                    duration: 0,
                    quantity: "1",
                    medName: '',
                    searchMedName: '',
                    id: '',
                    stock: 0,
                    mrpPrice: 0,
                    medStrength: 0,
                    medQuantity: 0,
                    own: 0,
                    itemHasError: "",
                    isVariableDose: false,
                    isManualTotal: false
                };

                // Apply commonDuration (number + period) to the new blank row, respecting timing exceptions
                try {
                    const commonNum = Number(commonDuration?.number || 0);
                    const commonPeriodId = commonDuration?.duration;
                    const skipForTiming = timingPossibilitiesCondition(newItem);

                    if (!skipForTiming && commonNum > 0) {
                        // keep the same shape as other code expects (string/number mix handled elsewhere)
                        newItem.duration = String(commonNum);
                    }
                    if (commonPeriodId && String(commonPeriodId) !== "0") {
                        const period = [...newItem.periods].find((p: any) => String(p.id) === String(commonPeriodId));
                        if (period) newItem.selectedPeriod = period;
                    }
                } catch (err) {
                    // don't block adding a row on any error
                    console.error(err);
                }

                const updated = updateRowItemWithCalculation(newItem);
                const state = [...pre, updated];
                // focus after render when the typeahead ref is attached
                setTimeout(() => {
                    try { state[idx + 1].component.focus(); } catch (e) { /* ignore focus errors */ }
                }, 0);
                return state;
            });
        }
    };

    const removePrescription = (a_idx: number) => {
        if (tempPrescriptions.length > 1) {
            setTempPrescriptions((pre: any) => pre.filter((item: any, idx: number) => idx != a_idx));
        } else {
            setTempPrescriptions([prescription])
            setIsSave(true)
        }
    };

    const handleEqualantDrugsChange = async (equalantDrugId: any) => {
        let selectedDrug = equalantDrugs.find((drug: any) => drug.id == equalantDrugId)
        const medicineNameListResponse: any = await prescriptionApiService.getMedicineNameList(selectedDrug.drugsName, "11");
        if (medicineNameListResponse.length > 0) {
            let med = await handleMedicineSelectedInit(medicineNameListResponse, { ...prescription })
            tempPrescriptions[tempPrescriptions.length - 1] = med;
            setTempPrescriptions([...tempPrescriptions]);
        }
        setSelectedEqualantDrug({ ...selectedDrug })
    };

    const handleMedicineSelectedInit = async (selectedArr: any, item: any) => {
        console.log("selectedArr " + JSON.stringify(selectedArr))
        if (selectedArr.length == 1) {
            const selectedMedicine = selectedArr[0];
            const stockArr = await prescriptionApiService.getStoreWiseAvailableStock(selectedMedicine.id);
            console.log("stock " , stockArr)
            item = { ...item, ...selectedMedicine }
            item.allStock = stockArr;
            console.log("item " , item)
            let dispensoryStock = 0
            let mrp = 0
            if (stockArr.find((item: any) => item.storeId == hospitalDisponsoryStoreId)) {
                dispensoryStock = stockArr.find((item: any) => item.storeId == hospitalDisponsoryStoreId).availableStock
                mrp = stockArr.find((item: any) => item.storeId == hospitalDisponsoryStoreId).mrpPrice
            }
            item.stock = dispensoryStock;
            item.mrpPrice = mrp;
            item.selectedMedicine = [...selectedArr].map((med: any) => med.medName);

            // Map unit
            for (let i = 0; i < item.units.length; i++) {
                if (item.units[i].name == selectedMedicine.unit) {
                    item.units[i].selected = true;
                    item = { ...item, selectedUnit: item.units[i] }
                } else {
                    item.units[i].selected = false;
                }
            }

            // Always use TAB unit for tablet form medicines
            if (Number(item.formType) === 1) {
                const tabUnit = [...item.units].find((unit: any) => String(unit?.name || "").toLowerCase() === "tab")
                if (tabUnit) {
                    item.selectedUnit = tabUnit
                }
            }

            // Map timingId -> selectedTiming when provided by API
            try {
                if (typeof selectedMedicine.timingId !== 'undefined' && selectedMedicine.timingId !== null) {
                    const matchTiming = [...item.timings].find((t: any) => String(t.id) === String(selectedMedicine.timingId));
                    if (matchTiming) {
                        item.selectedTiming = matchTiming;
                        item = applyTimingPatternToItem(item, true)
                    }
                }
            } catch (err) {
                // ignore mapping errors
                console.error(err)
            }

            // Map routeId -> selectedRoute when provided by API
            try {
                if (typeof selectedMedicine.routeId !== 'undefined' && selectedMedicine.routeId !== null) {
                    const matchRoute = [...item.routes].find((r: any) => String(r.id) === String(selectedMedicine.routeId));
                    if (matchRoute) {
                        item.selectedRoute = matchRoute;
                    }
                }
            } catch (err) {
                console.error(err)
            }

            const dayPeriod = getDefaultPeriod(item.periods || [])
            if (dayPeriod && (!item.selectedPeriod || item.selectedPeriod.id == 0)) {
                item.selectedPeriod = dayPeriod
            }
            if (item.formType == 1 && (!item.selectedRoute || item.selectedRoute.id == 0)) {
                const oralRoute = getOralRoute(item.routes || [])
                if (oralRoute) {
                    item.selectedRoute = oralRoute
                }
            }

            if (item.formType == 1 || item.formType == 4) {
                // item.isUnitDisabled = true
            }
            item.itemHasError = ""
        } else {
            item.selectedMedicine = [...selectedArr].map((med: any) => med.medName)
            item.allStock = [];
            item.stock = 0
            item.isUnitDisabled = false
            item.formType = 0
            item.itemHasError = "Medicine Name Empty"
        }
        return item
    };

    const handleOnQuantityChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        // value = hanldeNumberInputZero(String(value))
        item.isManualTotal = false
        item.quantity = value
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnUnitChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        item.isManualTotal = false
        item.selectedUnit = [...item.units].find((unit: any) => unit.id == value)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnTimingChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        item.isManualTotal = false
        item.selectedTiming = [...item.timings].find((time: any) => time.id == value)
        item = applyTimingPatternToItem(item, true)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleTimingSelect = (idx: number, item: any, timing: any) => {
        item.isManualTotal = false
        item.selectedTiming = timing
        item = applyTimingPatternToItem(item, true)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handlePeriodSelect = (idx: number, item: any, period: any) => {
        item.isManualTotal = false
        item.selectedPeriod = period
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handleRouteSelect = (idx: number, item: any, route: any) => {
        item.isManualTotal = false
        item.selectedRoute = route
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handleInstructionSelect = (idx: number, item: any, instruction: any) => {
        item.isManualTotal = false
        item.selectedInstruction = instruction
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handleOnInputTimingChange = (event: any, idx: number, item: any) => {
        if (event.key == "Enter") {
            event.preventDefault()
            if (item.id && item.selectedTiming.id != 0) {
                setTempPrescriptions((pre: any) => {
                    let state = [...pre, prescription]
                    setTimeout(() => {
                        state[idx + 1].component.focus();
                    }, 0);
                    return state
                });
            }
        }
    };

    const handleOnDurationChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        value = hanldeNumberInputZero(String(value))
        item.isManualTotal = false
        item.duration = value
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnPeriodChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        item.isManualTotal = false
        item.selectedPeriod = [...item.periods].find((period: any) => period.id == value)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnInstructionChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        item.isManualTotal = false
        item.selectedInstruction = [...item.instructions].find((instruction: any) => instruction.id == value)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };
    const handleOnRouteChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        item.isManualTotal = false
        item.selectedRoute = [...item.routes].find((route: any) => route.id == value)
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnOwnChange = (event: any, idx: number, item: any) => {
        let { checked } = event.target
        if (checked == true) {
            item.own = 1
        } else {
            item.own = 0
        }
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleOnTimingUnitsChange = (event: any, idx: number, item: any) => {
        let { name, value } = event.target
        item.isManualTotal = false
        value = normalizeTimingDoseInput(String(value))
        item.timingValue[name] = value
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item);
    };

    const handleDoseTimingChange = (idx: number, item: any, name: string, value: string) => {
        item.isManualTotal = false
        const normalized = normalizeTimingDoseInput(String(value))
        item.timingValue[name] = normalized === "" ? "0" : normalized
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handleDoseQuantityChange = (idx: number, item: any, value: string) => {
        item.isManualTotal = false
        item.quantity = value
        item = updateRowItemWithCalculation(item)
        validateAndClearError(idx, item)
    }

    const handleOnTotalQtyChange = (event: any, idx: number, item: any) => {
        let { value } = event.target
        if (value === "") {
            item.no = ""
        } else {
            const num = Number(value)
            item.no = isNaN(num) ? 0 : num
        }
        item.isManualTotal = true
        item.rate = Number((Number(item.no) || 0) * Number(item.mrpPrice)).toFixed(2)
        if ((item.stock - (Number(item.no) || 0)) < 1 && item.own == 0 && item.id) {
            toastErrorBounceDark("Stock is Less than or Equal to Zero")
        }
        validateAndClearError(idx, item)
    }

    const handleOnTotalQtyBlur = (idx: number, item: any) => {
        if (item.no === "" || item.no === null || item.no === undefined) {
            item.no = 0
            item.rate = Number((Number(item.no) || 0) * Number(item.mrpPrice)).toFixed(2)
            validateAndClearError(idx, item)
            return
        }
        if ((item.stock - (Number(item.no) || 0)) < 1 && item.own == 0 && item.id) {
            toastErrorBounceDark("Stock is Less than or Equal to Zero")
        }
        validateAndClearError(idx, item)
    }

    function handleDiscount(e: any) {
        if (e.target.value < 0) {
            toastErrorBounceDark("Check Discount Value.")
        }
        else {
            setDiscountAmount({ ...discountAmount, [e.target.name]: e.target.value })
        }
    }
    async function AddDiscount() {
        if (discountAmount.discAmt != 0) {
            await discountApiService.savePrescriptionOrderDiscount(discountAmount)
        }
    }

    const updateRowItemWithCalculation = (item: any) => {
        if (item.isManualTotal) {
            if ((item.stock - item.no) < 1 && item.own == 0 && item.id) {
                toastErrorBounceDark("Stock is Less than or Equal to Zero")
            }
            item.rate = Number(item.no * item.mrpPrice).toFixed(2)
            return item
        }

        // For formType 2,3,4,5: if medStrength or medQuantity is 0, skip calculation and set to 1
        if (item.formType != 1 && (Number(item.medStrength) === 0 || Number(item.medQuantity) === 0)) {
            item.no = 1
            item.rate = Number(item.no * item.mrpPrice).toFixed(2)
            return item
        }

        let posibilitiesTimingsCondition: Boolean
        posibilitiesTimingsCondition = timingPossibilitiesCondition(item)
        const timingPattern = getTimingPatternFromItem(item)
        if (timingPattern) {
            item = applyTimingPatternToItem(item, false)
        }
        const timingDoseTotal = timingPattern
            ? item.timingValue.reduce((c: any, n: any) => Number(c) + Number(n), 0)
            : 0

        if (item.formType == 1) { // for tablet
            if (posibilitiesTimingsCondition) {
                item.no = Number(item.duration);
                item.selectedPeriod = item.periods[0];
                // item.isPeriodDisabled = true;
            } else {
                if (timingPattern) {
                    item.no = Math.ceil(Number(timingDoseTotal) * Number(item.duration) * Number(item.selectedPeriod.days)).toFixed();
                } else {
                    item.no = Math.ceil(Number(item.quantity) * (Number(item.selectedTiming.totalUnits) / Number(item.selectedTiming.doseDuration)) * Number(item.duration) * Number(item.selectedPeriod.days)).toFixed();
                }
                item.isPeriodDisabled = false;
            }
        }
        else if (item.formType == 2) { // for liquid
            if (posibilitiesTimingsCondition) {
                item.no = Number(item.duration);
                item.selectedPeriod = item.periods[0];
                // item.isPeriodDisabled = true;
            } else {
                if (timingPattern) {
                    item.no = Math.ceil(Number(timingDoseTotal) * Number(item.duration) * Number(item.selectedPeriod.days)).toFixed();
                } else {
                    item.no = Math.ceil(Number(item.quantity) * (Number(item.selectedTiming.totalUnits) / Number(item.selectedTiming.doseDuration)) * Number(item.duration) * Number(item.selectedPeriod.days)).toFixed();
                }
                item.isPeriodDisabled = false;
                if (item.selectedUnit.typeId == 1) {  // for mg 
                    item.no = Math.ceil(item.no / item.medStrength)
                } else if (item.selectedUnit.typeId == 2) {   // for ml 
                    item.no = Math.ceil(item.no / item.medQuantity)
                }
                else {
                    item.no = 0
                }
            }
        } else if (item.formType == 3) {  // for Insulin     
            if (posibilitiesTimingsCondition) {
                item.no = Number(item.duration);
                item.selectedPeriod = item.periods[0];
                // item.isPeriodDisabled = true;
            } else {
                item.isPeriodDisabled = false;
                if (timingPattern) {   // for timing input box 
                    if (item.selectedUnit.typeId == 5) {  // for Unit
                        item.no = Math.ceil((Number(item.selectedPeriod.days) * Number(item.duration) * Number(timingDoseTotal)) / item.medStrength)
                    } else if (item.selectedUnit.typeId == 2) {   // for ml
                        item.no = Math.ceil((Number(item.selectedPeriod.days) * Number(item.duration) * Number(timingDoseTotal)) / item.medQuantity)
                    } else {
                        item.no = 0
                    }
                } else {   // for select option
                    if (item.selectedUnit.typeId == 5) {  // for Unit
                        item.no = Math.ceil((Number(item.quantity) * (Number(item.selectedTiming.totalUnits) / Number(item.selectedTiming.doseDuration)) * Number(item.duration) * Number(item.selectedPeriod.days)) / item.medStrength)
                    } else if (item.selectedUnit.typeId == 2) {   // for ml
                        item.no = Math.ceil((Number(item.quantity) * (Number(item.selectedTiming.totalUnits) / Number(item.selectedTiming.doseDuration)) * Number(item.duration) * Number(item.selectedPeriod.days)) / item.medQuantity)
                    } else {
                        item.no = 0
                    }
                }
            }
        } else if (item.formType == 4) { // for powder
            if (posibilitiesTimingsCondition) {
                item.no = Number(item.duration);
                item.selectedPeriod = item.periods[0];
                // item.isPeriodDisabled = true;
            } else {
                if (timingPattern) {
                    item.no = Math.ceil((Number(timingDoseTotal) * Number(item.duration) * Number(item.selectedPeriod.days)) / item.medStrength).toFixed();
                } else {
                    item.no = Math.ceil((Number(item.quantity) * (Number(item.selectedTiming.totalUnits) / Number(item.selectedTiming.doseDuration)) * Number(item.duration) * Number(item.selectedPeriod.days)) / item.medStrength).toFixed();
                }
                item.isPeriodDisabled = false;
            }
        } else if (item.formType == 5) { // for cream
            if (posibilitiesTimingsCondition) {
                item.no = Number(item.duration);
                item.selectedPeriod = item.periods[0];
                // item.isPeriodDisabled = true;
            } else {
                if (timingPattern) {
                    item.no = Math.ceil(Number(timingDoseTotal)).toFixed();
                } else {
                    item.no = Math.ceil(Number(item.quantity)).toFixed();
                }
                item.isPeriodDisabled = false;
            }
        } else {
            item.no = 0
        }
        if (item.no == "NaN" || item.no == "Infinity") {
            item.no = 0
        }
       
        if ((item.stock - item.no) < 1 && item.own == 0 && item.id) {  // for Stock Zero alert Message
            toastErrorBounceDark("Stock is Less than or Equal to Zero")
        }

        item.rate = Number(item.no * item.mrpPrice).toFixed(2)
        return item
    };

    const updateRowItem = (idx: number, item: any) => {
        tempPrescriptions[idx] = item;
        setTempPrescriptions([...tempPrescriptions]);
    };

    // Validation helper - only validates if item already has an error showing
    // This allows automatic clearing when user corrects the field
    const validateAndClearError = (idx: number, item: any) => {
        // Only validate if this item is already marked with an error
        if (item.itemHasError && item.itemHasError !== "") {
            const validation = validatePrescriptionItem(item);
            if (validation.isValid) {
                item.itemHasError = "";
            } else {
                item.itemHasError = validation.errorMessage;
            }
        }
        updateRowItem(idx, item);
    };

    const getGeneralInstruction = async (dispNo : number) => {
        try {
            let genPrescription : string = await prescriptionApiService.getGeneralInstructionByPresId(dispNo)
            if (genPrescription != null) {
                setGeneralInstruction(genPrescription);
            }
        } catch (error) {
            handleError(error)
        }
    }


    const updateGenericName = async (genericName: string, genId: string, medName: string) => {
        try {
            const genName: string[] = [];
            const obj: any = {};
            obj.name = genericName;
            genName.push(obj);
            let equalantDrugs = await getGenericEqualantDrugs(genId)
            let selectedMed = [...equalantDrugs].find((drug: any) => drug.drugsName == medName)
            setSelectedEqualantDrug(selectedMed)
            setSelectedGenericName([...genName]);
        } catch (error) {

        }
    };

    // Validation function for prescription items
    const validatePrescriptionItem = (item: any): { isValid: boolean; errorMessage: string } => {
        // Skip validation for own medicines (item.own == 1)
        if (item.own == 1) {
            return { isValid: true, errorMessage: "" };
        }

        // 1. Check if total_qty (no) is zero or NaN
        if (item.no == 0 || isNaN(item.no) || item.no === "" || item.no === null) {
            return { isValid: false, errorMessage: "Total Quantity is Empty or Invalid" };
        }

        // 2. Check if dose (timingValue) is zero or 0-0-0-0
        const allZeroDose = Array.isArray(item.timingValue) && item.timingValue.every((v: any) => v === "0" || v === 0);
        if (allZeroDose && item.selectedTiming?.id !== 0) {
            return { isValid: false, errorMessage: "Dose cannot be all zeros" };
        }

        // 3. Check if unit (selectedUnit) is None
        if (!item.selectedUnit || item.selectedUnit.id === 0 || item.selectedUnit.id === "0") {
            return { isValid: false, errorMessage: "Unit is not selected (None)" };
        }

        // 4. Check if frequency (selectedTiming) is None
        if (!item.selectedTiming || item.selectedTiming.id === 0 || item.selectedTiming.id === "0") {
            return { isValid: false, errorMessage: "Frequency is not selected (None)" };
        }

        // 5. Check if duration is zero
        if (item.duration == 0 || item.duration === "" || item.duration === null) {
            return { isValid: false, errorMessage: "Duration is Empty" };
        }

        return { isValid: true, errorMessage: "" };
    };
    let ot_orderTotal = Number([...tempPrescriptions].filter((prod: any) => prod.own != 1 ? true : false).map((prod: any) => prod.rate).reduce((p: any, c: any) => Number(p) + Number(c), 0)).toFixed(2)

    const handleSavePrescription = async () => {
        if (Number(discountAmount.discAmt > Number(ot_orderTotal))) {
            toastErrorBounceDark("Check Discount Value.")
        }
        else {
            try {
                setIsPrescriptionSaved(true)
                let validationSuccess: any[] = [];
                let tempPrescriptionsSample = [...tempPrescriptions].map((med: any) => {
                    let tempMed = { ...med }
                    if (med.own == 1) {
                        tempMed.itemHasError = "";
                        return tempMed;
                    }

                    // Apply new comprehensive validation
                    const validation = validatePrescriptionItem(tempMed);
                    if (!validation.isValid) {
                        tempMed.itemHasError = validation.errorMessage;
                        validationSuccess.push(true);
                    } else if (tempMed.id == "") {
                        tempMed.itemHasError = "MedName is Wrong"
                        validationSuccess.push(true)
                    } else if (tempMed.stock == "0") {
                        tempMed.itemHasError = "Stock is Zero"
                        validationSuccess.push(true)
                    } else if ((tempMed.stock - tempMed.no) < 0 && tempMed.own == 0) {
                        tempMed.itemHasError = "Stock is Less than Zero"
                        validationSuccess.push(true)
                    } else if (tempMed.quantity == 0) {
                        tempMed.itemHasError = "Medicine Quantity is Zero"
                        validationSuccess.push(true)
                    } else {
                        tempMed.itemHasError = "";
                    }
                    if (tempMed.itemHasError != "") {
                        toastErrorBounceDark(tempMed.itemHasError)
                    }
                    return tempMed;
                })
                setTempPrescriptions([...tempPrescriptionsSample]);
                if (validationSuccess.length == 0) {
                    const temp = [...tempPrescriptions].map((prod: any) => {
                        let tempProd = { ...prescriptionFormat, generic_id: prod.genId, prods_id: prod.id, quantity: prod.quantity, unit: prod.selectedUnit.id, timing: prod.selectedTiming.id, timingUnits: getTimingUnitsForSave(prod), duration: prod.duration, period: prod.selectedPeriod.id, is_own: prod.own, qno: prod.no, route: prod.selectedRoute.id, instruction: prod.selectedInstruction.id, notes: prod.notes }
                        if (prod.formType == 3) {
                            tempProd = { ...tempProd, timing: getTimingUnitWithPosibilities(tempProd.timingUnits) ? getTimingUnitWithPosibilities(tempProd.timingUnits).id : 0 }
                        }
                        return tempProd
                    })
                    if (temp.length != 0) {
                        let isFromSummary: any = location.search?.split("?")[1]?.split("&&")?.includes("via=summary")
                        if (isFromSummary) {
                            isFromSummary = 1
                        } else {
                            isFromSummary = 0
                        }
                        let save = { ...saveFormat, notes : generalInstruction , createPrescriptionDetailsRequestList: temp, pat_id: patientDetails.patientId, doc_id: patientDetails.doctorId, visit_id: patientDetails.visitId, uid: loginUser.id, isFromSummary, discAmt: discountAmount?.discAmt }
                        let res = await prescriptionApiService.savePrescription(save)
                        let displayNo = { ...res[0] }.display
                        getGeneralInstruction(displayNo)
                        toastSuccessBounceDark("Prescription Saved")
                        setIsPrescriptionUpdated((pre: any) => ({ ...pre, id: displayNo }))
                        setSavePrescriptionsData([...res])
                        setShowSavePreviewPrescription(true)
                        setIsPrescriptionSaved(true)
                        setIsPrescriptionCurrent(true)
                    }
                } else {
                    setIsPrescriptionSaved(false)
                    setIsPrescriptionCurrent(false)
                }
            } catch (error) {
                setIsPrescriptionSaved(false)
                setIsPrescriptionCurrent(false)
                handleError(error)

            }
        }

    };

    const handleUpdatePrescription = async () => {
        if (Number(discountAmount.discAmt > Number(ot_orderTotal))) {
            toastErrorBounceDark("Check Discount Value.")
        }
        else {
            try {
                setIsPrescriptionUpdated((pre: any) => ({ ...pre, status: true }))
                let validationSuccess = [];
                let tempPrescriptionsSample = [...tempPrescriptions].map((med: any) => {
                    let tempMed = { ...med }
                    if (med.own == 1) {
                        tempMed.itemHasError = "";
                        return tempMed;
                    }

                    // Apply new comprehensive validation
                    const validation = validatePrescriptionItem(tempMed);
                    if (!validation.isValid) {
                        tempMed.itemHasError = validation.errorMessage;
                        validationSuccess.push(true);
                    } else if (tempMed.id == "") {
                        tempMed.itemHasError = "MedName is Wrong"
                        validationSuccess.push(true)
                    } else if (tempMed.stock == "0") {
                        tempMed.itemHasError = "Stock is Zero"
                        validationSuccess.push(true)
                    } else if ((tempMed.stock - tempMed.no) < 0 && tempMed.own == 0) {
                        tempMed.itemHasError = "Stock is Less than Zero"
                        validationSuccess.push(true)
                    } else if (tempMed.quantity == 0) {
                        tempMed.itemHasError = "Medicine Quantity is Zero"
                        validationSuccess.push(true)
                    } else {
                        tempMed.itemHasError = "";
                    }
                    if (tempMed.itemHasError != "") {
                        toastErrorBounceDark(tempMed.itemHasError)
                    }
                    return tempMed;
                })
                setTempPrescriptions([...tempPrescriptionsSample]);
                if (validationSuccess.length == 0) {
                    const temp = [...tempPrescriptions].map((prod: any) => {
                        let tempProd = { ...prescriptionFormat, generic_id: prod.genId, prods_id: prod.id, quantity: prod.quantity, unit: prod.selectedUnit.id, timing: prod.selectedTiming.id, timingUnits: getTimingUnitsForSave(prod), duration: prod.duration, period: prod.selectedPeriod.id, is_own: prod.own, qno: prod.no, route: prod.selectedRoute.id, instruction: prod.selectedInstruction.id, notes: prod.notes }
                        if (prod.formType == 3) {
                            tempProd = { ...tempProd, timing: getTimingUnitWithPosibilities(tempProd.timingUnits) ? getTimingUnitWithPosibilities(tempProd.timingUnits).id : 0 }
                        }
                        return tempProd
                    })
                    let isFromSummary: any = location.search?.split("?")[1]?.split("&&")?.includes("via=summary")
                    if (isFromSummary) {
                        isFromSummary = 1
                    } else {
                        isFromSummary = 0
                    }
                    let save = { ...saveFormat, notes : generalInstruction  , createPrescriptionDetailsRequestList: temp, pat_id: patientDetails.patientId, doc_id: patientDetails.doctorId, visit_id: patientDetails.visitId, uid: loginUser.id, isFromSummary, discAmt: discountAmount.discAmt }
                    if (isPrescriptionUpdated.id) {
                        let data = await prescriptionApiService.updatePrescription(isPrescriptionUpdated.id, save)
                        let displayNo = { ...data[0] }.display
                        getGeneralInstruction(displayNo)
                        toastSuccessBounceDark("Prescription Updated")
                        setSavePrescriptionsData([...data])
                        setShowSavePreviewPrescription(true)
                        setIsPrescriptionUpdated({ status: true, id: displayNo })
                    }
                } else {
                    setIsPrescriptionUpdated((pre: any) => ({ ...pre, status: false }))
                }
            } catch (error) {
                setIsPrescriptionUpdated((pre: any) => ({ ...pre, status: false }))
                handleError(error)
            }
        };
    }

    const handleSavePrescriptionTemplate = async () => {
        try {
            setTemplateStatus((pre: any) => ({ ...pre, status: true }))
            let validationSuccess: any[] = [];
            let tempPrescriptionsSample = [...tempPrescriptions].map((med: any) => {
                let tempMed = { ...med }
                if (med.own == 1) {
                    tempMed.itemHasError = "";
                    return tempMed;
                }
                if (tempMed.no == 0) {
                    tempMed.itemHasError = "Total Number is Empty"
                    validationSuccess.push(true)
                } else if (tempMed.id == "") {
                    tempMed.itemHasError = "MedName is Wrong"
                    validationSuccess.push(true)
                } else if (templateStatus.text == "") {
                    tempMed.itemHasError = "Template Name is Empty"
                    validationSuccess.push(true)
                } else {
                    tempMed.itemHasError = "";
                }
                if (tempMed.itemHasError != "") {
                    toastErrorBounceDark(tempMed.itemHasError)
                    setTemplateStatus((pre: any) => ({ ...pre, status: false }))
                }
                return tempMed;
            })
            setTempPrescriptions([...tempPrescriptionsSample]);
            if (validationSuccess.length == 0) {
                const temp = [...tempPrescriptions].map((prod: any) => {
                    let tempProd = { ...createPrescTemplateRequestList, genericId: prod.genId, prodsId: prod.id, quantity: prod.quantity, unit: prod.selectedUnit.id, timing: prod.selectedTiming.id, duration: prod.duration, period: prod.selectedPeriod.id, no: prod.no, route: prod.selectedRoute.id, instruction: prod.selectedInstruction.id, notes: prod.notes }
                        if (prod.formType == 3) {
                            tempProd = { ...tempProd, timingUnit: getTimingUnitsForSave(prod) }
                            if (prod.quantity > 1) {
                                tempProd = { ...tempProd, timingUnit: getTimingUnitsString(new Array(prod.timingValue?.length || 4).fill("0")) }
                            } else {
                                tempProd = { ...tempProd, timing: getTimingUnitWithPosibilities(tempProd.timingUnit) ? getTimingUnitWithPosibilities(tempProd.timingUnit).id : 0 }
                            }
                        }
                    return tempProd
                })
                if (temp.length != 0) {
                    let saveTemp = { ...saveTemplateFormat, createPrescTemplateRequestList: temp, uid: loginUser.id, name: templateStatus.text }
                    await prescriptionApiService.savePrescriptionTemplate(saveTemp)
                    toastSuccessBounceDark("Template Saved")
                }
            }
        } catch (error) {
            setTemplateStatus((pre: any) => ({ ...pre, status: false }))
            handleError(error)
        }
    };

    const refresh = () => {
        setTempPrescriptions([prescription])
        setSavePrescriptionsData([])
        setMedicineNameListOption([])
        setGenericNameOptions([])
        setConsultantOption([])
        setEqualantDrugs([{ id: "0", drugsName: "EQUALANT DRUGS" }])
        setSelectedGenericName([])
        setSelectedEqualantDrug({})
        setSelectedConsultant([])
        setTemplateNameList([])
        setTemplateSelectedValue([])
        setPreviousPrescriptionAllList([])
        setPreviousPrescriptionNameList([])
        setPreviousPrescriptionSelectedValue([])
        setIsPrescriptionSaved(false)
        setIsPrescriptionCurrent(false)
        setIsPrescriptionUpdated({ status: false, id: "" })
        setIsSave(true)
        setShowPrescriptionTemplates(false)
        setShowPreviousPrescription(false)
        setShowEditPrescription(false)
        setShowSavePreviewPrescription(false)
        setShowPrescribedDetails(false)
        setPrescribedDetailsData([])
        setCommonDuration({ number: 0, duration: 0 })

        setTemplateStatus({ status: false, text: "" })
        setGeneralInstruction("")
        init();
    };

    const getTimingUnitWithPosibilities = (timingValue: string) => {
        let timingPossibilitiesArray: any[] = prescriptionTimingDetails.filter((item: any) => timingPossibilitiesId.includes(item.id.toString()))
        let selectedTiming = timingPossibilitiesArray.find((item: any) => {
            let tempValue = timingValue.split('-').map((subItem: string) => subItem == "0" ? "0" : "1").join('-')
            if (tempValue == "1-1-1") {   // only for Thrice a day
                return item.id == "3" // thrice a day id is 3
            }
            return item.name == tempValue
        })
        return selectedTiming
    }

    const init = async () => {
        getTimingDetails();
        getDurationDetails();
        await getUnitDetails();
        await getInstructionDetails();
        await getRouteDetails();
        fetchPrescribedDetailsByVstId()

    };
    const initialState = async () => {
        await init();
        handleMapLastPrescription()
        fetchPrescribedDetailsByVstId()
    }
    useEffect(() => {
        initialState()
        return () => {
            dispatch(clearErrorHandling())
        }
    }, []);
    const casesheet = "PRESCRIPTION"
    const showPrescribed = isSave && isPrescriptionCurrent;
    const prescribedDetailsCount = new Set(prescribedDetailsData.map((item: any) => item.displayNo).filter((displayNo: any) => displayNo !== null && displayNo !== undefined && displayNo !== "")).size
    return (
        <ClinicalLayout {...{casesheet}}>
            {/* <FormLabel className='heading mx-auto'>PRESCRIPTION ENTRY OF <span className="text-dark">{patientDetails?.fullName} - {isIp == 0 ? patientDetails.displayNumber : patientDetails.ipNo} - {patientDetails?.age} - {patientDetails?.gender}</span></FormLabel> */}
            <Row className="py-1">
                <Col>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {/* Template name + save */}
                        {/* <InputGroup size="sm" style={{ minWidth: 260 }} className="me-2 gap-2">
                            <Form.Control placeholder="Create Template name" aria-label="Template name"  value={templateStatus.text} onChange={(e) => setTemplateStatus((pre: any) => ({ ...pre, text: e.target.value }))} />
                            <Button variant='success' title="Save Template" onClick={handleSavePrescriptionTemplate} disabled={templateStatus.status}>Save</Button>
                        </InputGroup> */}

                        {/* Generic typeahead + equivalent select */}
                        <div className="d-flex align-items-center gap-2" style={{ minWidth: 450, flex: '1 1 450px' }}>
                            <div style={{ flex: '1 1 60%' }}>
                                <AsyncTypeahead
                                    size='sm'
                                    filterBy={() => true}
                                    id="genericName"
                                    isLoading={false}
                                    labelKey="name"
                                    onSearch={handleTypeHeadGenericSearch}
                                    options={genericNameOptions}
                                    placeholder="Generic name"
                                    selected={selectedGenericName}
                                    onChange={(selected: any[]) => handleOnGenericNameSelect(selected)}
                                    renderMenuItemChildren={(option: any, { text }) => (
                                        <>
                                            <Highlighter search={text}>{option.name}</Highlighter>
                                        </>
                                    )}
                                />
                            </div>
                            <div style={{ width: 160 }}>
                                <Form.Select size="sm" value={selectedEqualantDrug?.id} onChange={(e) => handleEqualantDrugsChange(e.target.value)}>
                                    {equalantDrugs.map((drug: any, idx: number) => (
                                        <option value={drug.id} key={idx}>{drug.drugsName}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>

                        {/* spacer */}
                        <div style={{ flex: '1 1 1px' }} />

                        {/* Common duration + Order total */}
                        <div className="d-flex align-items-center gap-1">
                            <InputGroup size="sm" style={{ width: 80 }}>
                                <Form.Control id='com_dur' value={commonDuration.number} placeholder="COM.DUR" aria-label="Common duration number" onFocus={(e) => e.target.select()} onChange={(e) => handleCommonDurationForAll(e)} />
                            </InputGroup>
                            <Form.Select size='sm' value={commonDuration.duration} onChange={(e) => handleCommonDurationPeriodForAll(e)} style={{ width: 140 }}>
                                {prescriptionDurationDetails.map((item: any, sub_idx: number) => (
                                    <option value={item.id} key={sub_idx}>{item?.id == 0 ? "PERIOD" : item.name}</option>
                                ))}
                            </Form.Select>
                            <div className="fw-bold text-nowrap">Order total: <span className="text-success">{ot_orderTotal}</span></div>
                        </div>

                        {/* Actions */}
                        <ButtonGroup size="sm" className="ms-2 gap-1 px-1">
                            <Button variant='dark' title="View Templates" onClick={() => { hanldeGetTemplateNameList(); setShowPrescriptionTemplates(true) }}>Templates</Button>
                            <Button variant='dark' title="Edit Prescription" className='border-rounded border-0' onClick={() => { fetchPrevPrescriptionDetailsByVstId(); setShowEditPrescription(true) }}>Edit Prescription</Button>
                            <Button  title="Prescribed Details" className="position-relative" onClick={() => { fetchPrescribedDetailsByVstId(); setShowPrescribedDetails(true) }} style={{backgroundColor : 'rgb(23, 127, 156)'}}>
                                <FontAwesomeIcon icon={faFilePrescription} className="me-1" />
                                
                                {prescribedDetailsCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ fontSize: '0.65em' , backgroundColor : 'rgb(23, 127, 156)'}}>
                                        {prescribedDetailsCount}
                                    </span>
                                )}
                            </Button>
                            <Button variant='dark' title="Previous Prescription" onClick={() => { fetchGetPreviousPrescription(); setShowPreviousPrescription(true) }}>Previous Prescription</Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>

            {/* ---------------------------- MAIN ------------------------------- */}

            <Row className="clinical-prescription-container d-block col text-start px-2" >
                <Table hover >
                    <thead className="table-dark sticky-top fs-12px" >
                        <tr >
                            <th >Sl.</th>
                            <th>MEDICINE</th>
                            <th>STOCK</th>
                            <th>DOSE</th>
                            <th>UNIT</th>
                            <th>FREQUENCY</th>
                            <th>DUR.</th>
                            <th>PERIOD</th>
                            <th>TOTAL_QTY</th>
                            <th>RATE</th>
                            <th>ROUTE</th>
                            <th>INSTRUCTION</th>
                            <th>OWN</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tempPrescriptions?.map((item: any, idx: number) => {
                                const timingPattern = getTimingPatternFromItem(item)
                                return (
                                <tr key={idx}  className={item.itemHasError == "" ? "" : "my-1 error-danger"}>
                                    <td className="min-w-35px w-35px " title={`MedQuantity : ${item.medQuantity} / MedStrength : ${item.medStrength}`} >
                                        {idx + 1}
                                    </td>
                                    <td className='w- 200px'>
                                        <AsyncTypeahead
                                            className="min-w-200px typeahead-mark shadow-none my-1"
                                            filterBy={() => true}
                                            isLoading={false}
                                            size='sm'
                                            id={`medName_${idx}`}
                                            labelKey="medName"
                                            minLength={2}
                                            selected={item.selectedMedicine}
                                            onSearch={(q) => handleMedicineSearch(q, item, idx)}
                                            options={medicineNameListOption}
                                            placeholder="MEDICINE NAME"
                                            inputProps={{ className: "shadow-sm" }}
                                            onFocus={(e) => handleMedicineSearch(item.searchMedName, item, idx)}
                                            onKeyDown={async (e) => await handleMedicineOnKeyDown(e, idx, item)}
                                            onChange={(selected: any[]) => handleMedicineSelect(selected, idx, item)}
                                            flip={true}
                                            ref={(component) => item.component = component}
                                            onBlur={() => item?.component?.hideMenu()}
                                            renderMenuItemChildren={(option: any, { text }) => (
                                                <>
                                                    <Highlighter search={text} highlightClassName={`${option.stock === 0 ? "text-danger" : option.stock < 10 ? "text-warning" : "text-dark"}`}>{`${option.medName} -> `}</Highlighter> 
                                                    <span
                                                        style={{
                                                        color:
                                                            option.stock === 0 ? "red" :
                                                            option.stock < 10 ? "yellow" :
                                                            "green"
                                                        }}
                                                    >
                                                        {option.stock}
                                                    </span>
                                                    <span>{' -> '}</span>
                                                    <span style={{ color: "blue" }}>{option.genName}</span>
                                                </>
                                            )}
                                        />
                                    </td >
                                    <td className="w-60px" title={`RS.${Number(item.mrpPrice).toFixed(2)}`}>
                                        {item?.stock}
                                    </td>
                                    <td className="min-w-70px w-70px">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100 text-truncate"
                                            title={timingPattern ? item.timingValue.join("-") : String(item.quantity || "0")}
                                            onClick={() => setDosePicker({ show: true, idx })}
                                        >
                                            {timingPattern ? item.timingValue.join("-") : String(item.quantity || "0")}
                                        </Button>
                                    </td>
                                    <td className="min-w-75px w-75px">
                                        <Form.Select size='sm' className="w-100" name="unit" value={item.selectedUnit?.id} onChange={(event) => handleOnUnitChange(event, idx, item)} disabled={item.isUnitDisabled}>
                                            {
                                                item.units.map((unit: any, unitIdx: number) => (
                                                    <option value={unit.id} key={unitIdx}>{unit.name}</option>
                                                ))
                                            }
                                        </Form.Select >
                                    </td>
                                    <td className="min-w-110px w-110px">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100 text-truncate"
                                            title={`${item.selectedTiming?.name || "Timing"}${item.selectedTiming?.timingName ? ` - ${item.selectedTiming.timingName}` : ""}`}
                                            onClick={() => {
                                                if (item.selectedTiming?.id == 0 && item.timings?.length > 1) {
                                                    handleTimingSelect(idx, item, item.timings[1])
                                                }
                                                setTimingPicker({ show: true, idx })
                                            }}
                                        >
                                            {item.selectedTiming?.timingName || item.selectedTiming?.name || "Timing"}
                                        </Button>
                                    </td>
                                    < td className="min-w-60px w-60px" >
                                        <Form.Control type='number' size='sm'
                                            placeholder="DUR." className=" w-100"
                                            name="duration" value={item.duration}
                                            onChange={(event) => handleOnDurationChange(event, idx, item)}
                                            autoComplete="off"
                                            onFocus={(e) => e.target.select()}
                                            onKeyDown={(e) => (e.key == "ArrowUp" || e.key == "ArrowDown") ? e.preventDefault() : null}
                                        />
                                    </td>
                                    <td className="min-w-70px w-70px">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100 text-truncate"
                                            title={item.selectedPeriod?.name || "Period"}
                                            onClick={() => setPeriodPicker({ show: true, idx })}
                                            disabled={item.isPeriodDisabled}
                                        >
                                            {item.selectedPeriod?.name || "Period"}
                                        </Button>
                                    </td>
                                    <td className="min-w-60px w-60px">
                                        <Form.Control
                                            size='sm'
                                            placeholder="NO"
                                            className="w-100 pe-0"
                                            name="no"
                                            type="number"
                                            value={item.no}
                                            autoComplete="off"
                                            onChange={(e) => handleOnTotalQtyChange(e, idx, item)}
                                            onBlur={() => handleOnTotalQtyBlur(idx, item)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                    <td className="w-75px">
                                        <Form.Control size='sm' placeholder="RATE" className=" w-75px" name="rate" value={item.rate} autoComplete="off" disabled />
                                    </td>
                                    <td className="min-w-70px w-70px">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100 text-truncate"
                                            title={item.selectedRoute?.name || "Route"}
                                            onClick={() => setRoutePicker({ show: true, idx })}
                                            disabled={item.isPeriodDisabled}
                                        >
                                            {item.selectedRoute?.name || "Route"}
                                        </Button>
                                    </td>
                                    <td className="min-w-70px w-70px">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100 text-truncate"
                                            title={item.selectedInstruction?.name || "Instruction"}
                                            onClick={() => setInstructionPicker({ show: true, idx })}
                                            disabled={item.isPeriodDisabled}
                                        >
                                            {item.selectedInstruction?.name || "Instruction"}
                                        </Button>
                                    </td>
                                    <td className="max-w-50px w-50px text-center">
                                        <Form.Check checked={item.own == 1 ? true : false} onChange={(e) => handleOnOwnChange(e, idx, item)} />
                                    </td>
                                    <td className="min-w-80px w-80px text-nowrap">
                                        <Button variant="success" className="px-2 py-1 mx-1" title="Add Row" onClick={() => addMorePrescription(item, idx)}><FontAwesomeIcon icon={faPlus} /></Button>
                                        <Button variant="danger" className="px-2 py-1 mx-1" title="Del Row" onClick={() => removePrescription(idx)}><FontAwesomeIcon icon={faTrash} /></Button>
                                        {/* <Button variant="primary" className="px-2 py-1 mx-1" title="Stock Checker"><FontAwesomeIcon icon={faCircleInfo} /></Button> */}
                                    </td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Row >
            <Row>
                <Col>
                    <Form.Group className='my-2 d-flex'>
                        <Form.Label className='fw-bold text-uppercase pt-4 w-50'>General Instruction</Form.Label>
                        <Form.Control className='border border-black' as="textarea" rows={3} value={generalInstruction}  onChange={(e) => setGeneralInstruction(e.target.value)}/>
                        
                    </Form.Group>
                </Col>
            </Row>

            {/* ---------------------------- FOOTER ------------------------------- */}

            <Row className='py-2 border-top'>
                <Col xs={12} md={6} className='d-flex align-items-center gap-2'>
                    {/* Template name + Save Template */}
                    <InputGroup size="sm" className='flex-grow-1 gap-4'>
                        <Form.Control placeholder="Create Template name" aria-label="Template name" value={templateStatus.text} onChange={(e) => setTemplateStatus((pre: any) => ({ ...pre, text: e.target.value }))} />
                        <Button variant='outline-success' className='me-2' title="Save Template" onClick={handleSavePrescriptionTemplate} disabled={templateStatus.status}>Save Template</Button>
                    </InputGroup>

                    {/* Quick access: templates modal */}
                    {/* <Button variant='dark' size='sm' onClick={() => { hanldeGetTemplateNameList(); setShowPrescriptionTemplates(true); }}>Templates</Button> */}
                </Col>

                <Col xs={12} md={3} className='d-flex justify-content-center my-2 my-md-0'>
                    {!isSave ? (
                        <Button size='lg' className='w-100' variant='primary' title="Update Prescription" onClick={handleUpdatePrescription} disabled={isPrescriptionUpdated.status}>
                            UPDATE PRESCRIPTION
                        </Button>
                    ) : (
                        <Button size='lg' className='w-100' variant={showPrescribed ? 'info' : 'success'} title="Save Prescription" onClick={handleSavePrescription} disabled={isPrescriptionSaved}>
                            {showPrescribed ? 'PRESCRIBED' : 'SAVE PRESCRIPTION'}
                        </Button>
                    )}
                </Col>

                <Col xs={12} md={3} className='d-flex justify-content-center'>
                    {/* <Button variant='secondary' size='sm' onClick={() => { fetchGetPreviousPrescription(); setShowPreviousPrescription(true); }}>Prev</Button> */}
                    <Button variant='warning' size='sm' onClick={() => refresh()}>Refresh</Button>
                </Col>
                {/* <Col className='row  justify-content-center '>
                    <Col xs="10">
                        <Form.Control placeholder="TEMPLATE NAME" className="button_style" value={templateStatus.text} onChange={(e) => setTemplateStatus((pre: any) => ({ ...pre, text: e.target.value }))} />
                    </Col>
                </Col> */}
                {/* <Col className='row justify-content-center'>
                    <Col xs="10">
                        <AsyncTypeahead
                            filterBy={() => true}
                            id="medicineName"
                            isLoading={false}
                            labelKey="name"
                            flip={true}
                            onSearch={handleConsultantSearch}
                            options={consultantOption}
                            placeholder="CONSULTANT NAME"
                            onChange={(select: any) => handleConsultantSelect(select)}
                            renderMenuItemChildren={(option: any, { text }) => (
                                <>
                                    <Highlighter search={text}>{option.name}</Highlighter>
                                </>
                            )} />
                    </Col>
                </Col> */}
                {/* <Col className='row  justify-content-center'>
                    <Col xs="10">
                        <Button variant='success' className='w-100 button_style' title="Save Templates" onClick={handleSavePrescriptionTemplate} disabled={templateStatus.status}>SAVE TEMPLATE</Button>
                    </Col>
                </Col> */}

                {/* <Col className='row  justify-content-center'>
                    <Col xs="10">
                        <Form.Control placeholder="DISCOUNT" type='number' name='discAmt' className="button_style" onChange={(e) => handleDiscount(e)} />
                    </Col>
                </Col> */}
            </Row >

            <PrescriptionTemplates
                show={showPrescriptionTemplates}
                onHide={() => { setShowPrescriptionTemplates(false); setTemplateSelectedValue([]); }}
                handleError={handleError}
                templateNameList={templateNameList}
                templateSelectedValue={templateSelectedValue}
                hanldeGetSelectedTemplateDetails={hanldeGetSelectedTemplateDetails}
                handleMapTemplate={handleMapTemplate}
                handleEditTemplate = {handleEditTemplate}
                selTemplateName = {selTemplateName}
                handleChangeTemplateName = {handleChangeTemplateName}
                handleDeleteTemplate = {handleDeleteTemplate}
            />
            <PreviousPrescription
                show={showPreviousPrescription}
                onHide={() => { setShowPreviousPrescription(false); setPreviousPrescriptionSelectedValue([]) }}
                previousPrescriptionNameList={previousPrescriptionNameList}
                previousPrescriptionSelectedValue={previousPrescriptionSelectedValue}
                handlePreviousPrescrionSelected={handlePreviousPrescrionSelected}
                handleMapPrevMed={handleMapPrevMed}
            />
            <EditPrescription
                show={showEditPrescription}
                onHide={() => { setShowEditPrescription(false); setPreviousPrescriptionSelectedValue([]) }}
                previousPrescriptionNameList={previousPrescriptionNameList}
                previousPrescriptionSelectedValue={previousPrescriptionSelectedValue}
                handlePreviousPrescrionSelected={handlePreviousPrescrionSelected}
                handleMapEditMed={handleMapEditMed}
                handleChangeTemplateName = {handleChangeTemplateName}
            />
            <Modal
                show={showPrescribedDetails}
                onHide={() => { setShowPrescribedDetails(false) }}
                size="xl"
                centered
                scrollable
            >
                <Modal.Header closeButton className="text-white" style={{ backgroundColor: 'rgb(23, 127, 156)' }}>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faFilePrescription} className="me-2" />
                        Prescribed Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light p-3">
                    {prescribedDetailsData.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <FontAwesomeIcon icon={faFilePrescription} size="3x" className="mb-3 opacity-25" />
                            <div className="fs-6">No prescriptions found for this visit.</div>
                        </div>
                    ) : (
                        Object.entries(
                            prescribedDetailsData.reduce((acc: any, cur: any) => {
                                if (!acc[cur.displayNo]) acc[cur.displayNo] = []
                                acc[cur.displayNo].push(cur)
                                return acc
                            }, {})
                        )
                        .sort(([a]: any, [b]: any) => Number(b) - Number(a))
                        .map(([displayNo, items]: any) => (
                            <div key={displayNo} className="mb-4 rounded shadow-sm overflow-hidden border">
                                <div className="d-flex justify-content-between align-items-center text-white px-3 py-2" style={{ backgroundColor: 'rgb(23, 127, 156)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge fs-12px">Rx {displayNo}</span>
                                        <span className="fw-bold fs-12px">Dr. {items[0]?.doctorName || "N/A"}</span>
                                        <span>
                                            <small className="text-white-50">
                                                {items[0]?.date ? new Date(items[0].date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                                            </small>
                                        </span>
                                    </div>
                                        <span className={`badge text-uppercase fw-bold fs-12px`}>{items[0]?.billingStatus || "N/A"}</span>
                                </div>
                                <Table striped bordered size="sm" className="mb-0 bg-white fs-12px">
                                    <thead style={{ backgroundColor: 'rgb(23, 127, 156)', color: 'white' }}>
                                        <tr>
                                            <th style={{ width: 35 }}>Sl No</th>
                                            <th>Medicine</th>
                                            <th>Frequency</th>
                                            <th>Dose</th>
                                            <th>Duration</th>
                                            <th>Route</th>
                                            <th>Instruction</th>
                                            <th>Notes</th>
                                            <th className="text-center">Total Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(items as any[]).map((item: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="text-muted">{idx + 1}</td>
                                                <td>
                                                    <div className="fw-semibold">{item.medName}</div>
                                                    {item.genName ? <div className="small text-muted">{item.genName}</div> : null}
                                                </td>
                                                <td>
                                                    <div>{item.frequencyName || "-"}</div>
                                                    {item.frequencyDescription ? <div className="small text-muted">({item.frequencyDescription})</div> : null}
                                                </td>
                                                <td>{item.timingUnit || item.timing || "-"}</td>
                                                <td>{(item.duration && item.period) ? `${item.duration} ${item.period}` : item.duration || item.period || "-"}</td>
                                                <td>{item.routeText || "-"}</td>
                                                <td>{item.instructionText || "-"}</td>
                                                <td>{item.notesText || "-"}</td>
                                                <td className="text-center fw-bold">{item.no}</td>
                                                {/* <td className="text-center">
                                                    <span className={`badge ${item.billingStatus === "Billed" ? "bg-success" : "bg-secondary"}`}>
                                                        {item.billingStatus}
                                                    </span>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ))
                    )}
                </Modal.Body>
            </Modal>
            <SavePreviewPrescription
                show={showSavePreviewPrescription}
                onHide={() => setShowSavePreviewPrescription(false)}
                savePrescriptionsData={savePrescriptionsData}
                setSavePrescriptionsData={setSavePrescriptionsData}
                isPrescriptionUpdated={isPrescriptionUpdated}
                setIsPrescriptionUpdated={setIsPrescriptionUpdated}
                setIsSave={setIsSave}
                setCommonDuration={setCommonDuration}
                prescriptionApiService={prescriptionApiService}
                handleError={handleError}
                generalInstruction = {generalInstruction}
            />
            <Modal
                show={timingPicker.show}
                onHide={() => setTimingPicker({ show: false, idx: null })}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Frequency</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        className="gap-3 px-2 m-2"
                        style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
                    >
                        {(timingPicker.idx !== null ? tempPrescriptions[timingPicker.idx]?.timings : [])
                            ?.filter((t: any) => t.id != 0)
                            .map((timing: any, tIdx: number) => (
                                <Button
                                    key={tIdx}
                                    variant={tempPrescriptions[timingPicker.idx!]?.selectedTiming?.id == timing.id ? "primary" : "outline-secondary"}
                                    className="text-center"
                                    onClick={() => {
                                        const rowItem = tempPrescriptions[timingPicker.idx!]
                                        handleTimingSelect(timingPicker.idx!, rowItem, timing)
                                        setTimingPicker({ show: false, idx: null })
                                    }}
                                >
                                    <div className="fw-bold">{timing.timingName}</div>
                                    {timing.description ? (
                                        <div className="small text-muted">{timing.description}</div>
                                    ) : null}
                                </Button>
                            ))}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={periodPicker.show}
                onHide={() => setPeriodPicker({ show: false, idx: null })}
                centered className='px-4 mx-4'
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select Period</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        className="gap-4 px-4 mx-4 my-4"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                    >
                        {(periodPicker.idx !== null ? tempPrescriptions[periodPicker.idx]?.periods : [])
                            ?.filter((p: any) => p.id != 0)
                            .map((period: any, pIdx: number) => (
                                <Button
                                    key={pIdx} size='lg'
                                    variant={tempPrescriptions[periodPicker.idx!]?.selectedPeriod?.id == period.id ? "primary" : "outline-secondary"}
                                    className="text-start"
                                    onClick={() => {
                                        const rowItem = tempPrescriptions[periodPicker.idx!]
                                        handlePeriodSelect(periodPicker.idx!, rowItem, period)
                                        setPeriodPicker({ show: false, idx: null })
                                    }}
                                >
                                    <div className="fw-bold">{period.name}</div>
                                </Button>
                            ))}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={routePicker.show}
                onHide={() => setRoutePicker({ show: false, idx: null })}
                centered className='px-4 mx-4'
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select Route</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        className="gap-4 px-4 mx-4 my-4"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                    >
                        {(routePicker.idx !== null ? tempPrescriptions[routePicker.idx]?.routes : [])
                            ?.filter((r: any) => r.id != 0)
                            .map((route: any, rIdx: number) => (
                                <Button
                                    key={rIdx} size='lg'
                                    variant={tempPrescriptions[routePicker.idx!]?.selectedRoute?.id == route.id ? "primary" : "outline-secondary"}
                                    className="text-start"
                                    onClick={() => {
                                        const rowItem = tempPrescriptions[routePicker.idx!]
                                        handleRouteSelect(routePicker.idx!, rowItem, route)
                                        setRoutePicker({ show: false, idx: null })
                                    }}
                                >
                                    <div className="fw-bold">{route.name}</div>
                                </Button>
                            ))}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={instructionPicker.show}
                onHide={() => setInstructionPicker({ show: false, idx: null })}
                centered
                size="lg" className='mx-4 px-4'
            >
                <Modal.Header closeButton>
                    <Modal.Title >Select Instruction</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-4 m-4 '>
                    <div
                        className="gap-4 px-4"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                    >
                        {(instructionPicker.idx !== null ? tempPrescriptions[instructionPicker.idx]?.instructions : [])
                            ?.filter((i: any) => i.id != 0)
                            .map((instruction: any, iIdx: number) => (
                                <Button size='lg'
                                    key={iIdx}
                                    variant={tempPrescriptions[instructionPicker.idx!]?.selectedInstruction?.id == instruction.id ? "primary" : "outline-secondary"}
                                    className="text-start"
                                    onClick={() => {
                                        const rowItem = tempPrescriptions[instructionPicker.idx!]
                                        handleInstructionSelect(instructionPicker.idx!, rowItem, instruction)
                                        setInstructionPicker({ show: false, idx: null })
                                    }}
                                >
                                    <div className="fw-bold">{instruction.name}</div>
                                </Button>
                            ))}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={dosePicker.show}
                onHide={() => setDosePicker({ show: false, idx: null })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dose</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {dosePicker.idx !== null ? (() => {
                        const rowItem = tempPrescriptions[dosePicker.idx!]
                        const pattern = getTimingPatternFromItem(rowItem)
                        if (pattern) {
                            return (
                                <div
                                    className="gap-2"
                                    style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
                                >
                                    <div>
                                        <Form.Label className="small">Morning</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            value={rowItem.timingValue[0]}
                                            onChange={(e) => handleDoseTimingChange(dosePicker.idx!, rowItem, "0", e.target.value)}
                                            onBlur={(e) => {
                                                if (String(e.target.value).trim() === "") {
                                                    handleDoseTimingChange(dosePicker.idx!, rowItem, "0", "0")
                                                }
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            disabled={pattern[0] === 0}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label className="small">Afternoon</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            value={rowItem.timingValue[1]}
                                            onChange={(e) => handleDoseTimingChange(dosePicker.idx!, rowItem, "1", e.target.value)}
                                            onBlur={(e) => {
                                                if (String(e.target.value).trim() === "") {
                                                    handleDoseTimingChange(dosePicker.idx!, rowItem, "1", "0")
                                                }
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            disabled={pattern[1] === 0}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label className="small">Evening</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            value={rowItem.timingValue[2]}
                                            onChange={(e) => handleDoseTimingChange(dosePicker.idx!, rowItem, "2", e.target.value)}
                                            onBlur={(e) => {
                                                if (String(e.target.value).trim() === "") {
                                                    handleDoseTimingChange(dosePicker.idx!, rowItem, "2", "0")
                                                }
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            disabled={pattern[2] === 0}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label className="small">Night</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            value={rowItem.timingValue[3]}
                                            onChange={(e) => handleDoseTimingChange(dosePicker.idx!, rowItem, "3", e.target.value)}
                                            onBlur={(e) => {
                                                if (String(e.target.value).trim() === "") {
                                                    handleDoseTimingChange(dosePicker.idx!, rowItem, "3", "0")
                                                }
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            disabled={pattern[3] === 0}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <Form.Control
                                size="sm"
                                placeholder="QTY"
                                value={rowItem.quantity}
                                onChange={(e) => handleDoseQuantityChange(dosePicker.idx!, rowItem, e.target.value)}
                                onBlur={(e) => {
                                    if (String(e.target.value).trim() === "") {
                                        handleDoseQuantityChange(dosePicker.idx!, rowItem, "0")
                                    }
                                }}
                                disabled={rowItem.isQuantityDisabled}
                            />
                        )
                    })() : null}
                </Modal.Body>
            </Modal>
        </ClinicalLayout >
    )
}

export default Prescription