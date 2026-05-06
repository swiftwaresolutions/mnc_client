const basic = [
    {
        name: 'Date of Admission',
        fieldName: 'doa',
        type: 'date'
    },
    {
        name: 'Time of Admission',
        fieldName: 'toa',
        type: 'time'
    },
]
const deliveryInfo = [
    {
        name: 'Augementation',
        fieldName: 'augmentation',
        type: 'text'
    },
    {
        name: 'Date of Delivery',
        fieldName: 'dod',
        type: 'date'
    },
    {
        name: 'Time of Delivery',
        fieldName: 'tod',
        type: 'time'
    },
    {
        name: 'Mode of Delivery',
        fieldName: 'modeDelivery',
        type: 'select',
        option: [
            {
                name: 'Select',
                value: 0
            },
            {
                name: 'Normal vaginal Delivery with Episotomy',
                value: 1
            },
            {
                name: 'Normal vaginal Delivery without Episotomy',
                value: 2
            },
            {
                name: 'Vaccum Delivery',
                value: 3
            },
            {
                name: 'Forcers',
                value: 4
            },
            {
                name: 'Caesarean Section',
                value: 5
            },
        ]
    },
]
const findings = [
    {
        name: 'Presentation',
        fieldName: 'presentation',
        type: 'text'
    },
    {
        name: 'Liquor',
        fieldName: 'liquor',
        type: 'text'
    },
    {
        name: 'Uterus',
        fieldName: 'uterus',
        type: 'text'
    },
    {
        name: 'Tubes and Ovaries',
        fieldName: 'overais',
        type: 'text'
    },
    {
        name: 'Others',
        fieldName: 'other',
        type: 'text'
    },
]
const babyDetail = [
    {
        name: 'Birth',
        fieldaname: 'birth',
        type: '',
        option: [
            {
                name: 'Select',
                value: 0
            },
            {
                name: 'Live Birth',
                value: 1
            },
            {
                name: 'Still Birth',
                value: 2
            }
        ]
    },
    {
        name: 'Sex',
        fieldaname: 'sex',
        type: '',
        option: [
            {
                name: 'Select',
                value: 0
            },
            {
                name: 'Boy',
                value: 1
            },
            {
                name: 'Girl',
                value: 2
            }
        ]
    },
    {
        name: 'Birth weight',
        fieldaname: 'birthWeight',
        type: 'text'
    },
    {
        name: 'Date of birth',
        fieldaname: 'dob',
        type: 'date'
    },
    {
        name: 'Time of Birth',
        fieldaname: 'tob',
        type: 'time'
    },
]
const induction = [
    {
        name: 'Name',
        fieldaname: 'indName',
        type: 'text'
    },
    {
        name: 'Date',
        fieldaname: 'indDate',
        type: 'date'
    },
    {
        name: 'Name',
        fieldaname: 'indTime',
        type: 'time'
    },
]
const deliverydetialsFormat = {
    mins1: '',
    mins5: "",
    augmentation: "",
    birth: "",
    birthWeight: "",
    complication: "",
    deliveryDoc: "",
    dod:'0000-00-00',
    doa: "0000-00-00",
    dob: "0000-00-00",
    indication: "",
    liquor: "",
    modeDelivery: "",
    other: "",
    overais: "",
    presentation: "",
    riskFactor: "",
    sex: "",
    toa: "00:00:00",
    tob: "00:00:00",
    tod: "00:00:00",
    uterus: ""
}
const inductionFormat=[
    { indNumber:0, indName: '', indDate: '0000-00-00', indTime: '00:00',isValid:1 }
]

export { basic, deliveryInfo, findings, babyDetail ,deliverydetialsFormat,inductionFormat}