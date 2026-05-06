const beforeInductionData=[
    {
        id:1,
        fieldName:"confermation",
        content:"Has the patient confirmed his/her identity, site, procedure, and consent?",
        options:[{name:"Yes",id:"122"},{name:"No",id:"123"}]
    },
    {
        id:2,
        fieldName:"medication",
        content:"Is the anaesthesia machine and medication check complete?",
        options:[{name:"Yes",id:"120"},{name:"No",id:"121"}]
    },
    {
        id:3,
        fieldName:"oximeter",
        content:"Is the pulse oximeter on the patient and functioning?",
        options:[{name:"Yes",id:"118"},{name:"No",id:"119"}]
    },
    {
        id:4,
        fieldName:"allergy",
        content:"Does the patient have a:Known allergy?",
        options:[{name:"Yes",id:"116"},{name:"No",id:"117"}]
    },
    {
        id:5,
        fieldName:"airway",
        content:"Difficult airway or aspiration risk?",
        options:[{name:"Yes, and equipment/assistance available",id:"114"},{name:"No",id:"115"}]
    },
    {
        id:6,
        fieldName:"bloodloss",
        content:" Risk of >500ml blood loss (7ml/kg in children)?",
        options:[{name:"Yes, and two IVs/central access and fluids planned",id:"112"},{name:"No",id:"113"}]
    },
    {
        id:7,
        fieldName:"marked",
        content:" Is the site marked?",
        options:[{name:"Yes",id:"110"},{name:"Not applicable",id:"111"}]
    },
   
]
const  beforeskinInsertion=[
    {
        id:8,
        fieldName:"teamMembers",
        content:"Confirm all team members have introduced themselves by name and role",
        options:[{name:"Yes",id:"108"},{name:"No",id:"109"}]
    },
    {
        id:9,
        fieldName:"incision",
        content:"Confirm the patient's name, procedure, and where the incision will be made",
        options:[{name:"Yes",id:"106"},{name:"No",id:"107"}]
    },
    {
        id:10,
        fieldName:"prophylaxis",
        content:"Has antibiotic prophylaxis been given within the last 60 minutes?",
        options:[{name:"Yes",id:"104"},{name:"Not applicable",id:"105"}]
    },
    {
        id:11,
        fieldName:"imaging",
        content:" Is essential imaging displayed?",
        options:[{name:"Yes",id:"102"},{name:"Not applicable",id:"103"}]
    },
]
const beforeskinInsertionSurgen=[
    {
        id:12,
        fieldName:"timeTaken",
        content:" How long will the case take?",
        options:[{name:"Yes",id:"100"},{name:"No",id:"101"}]
    },
    {
        id:13,
        fieldName:"critical",
        content:" What are the critical or non-routine steps?",
        options:[{name:"Yes",id:"98"},{name:"No",id:"99"}]
    },
    {
        id:14,
        fieldName:"anticipatedBlood",
        content:"What is the anticipated blood loss?",
        options:[{name:"Yes",id:"96"},{name:"No",id:"97"}]
    },
  
]
const beforeskinInsertionAnaesthetist=[
    {
        id:15,
        fieldName:"patientSpecific",
        content:"Are there any patient-specific concerns?",
        options:[{name:"Yes",id:"94"},{name:"No",id:"95"}]
    },
  
]
const beforeskinInsertionNursing=[
    {
        id:16,
        fieldName:"equipmentIssues",
        content:"Are there equipment issues or any concerns?",
        options:[{name:"Yes",id:"90"},{name:"No",id:"91"}]
    },
    {
        id:17,
        fieldName:"sterility",
        content:"Has sterility (including indicator results) been confirmed?",
        options:[{name:"Yes",id:"92"},{name:"No",id:"93"}]
    },
]
const beforeOperationVerbal=[
    {
        id:18,
        fieldName:"procedures",
        content:"The name of the procedure",
        options:[{name:"Yes",id:"124"},{name:"No",id:"125"}]
    },
    {
        id:19,
        fieldName:"sponge",
        content:"Completion of instrument, sponge and nee- dle counts",
        options:[{name:"Yes",id:"126"},{name:"No",id:"127"}]
    },
    {
        id:20,
        fieldName:"specimen",
        content:"Specimen labelling (read specimen labels aloud, including patient name)",
        options:[{name:"Yes",id:"128"},{name:"No",id:"129"}]
    },
    {
        id:21,
        fieldName:"equipmentProblems",
        content:"Whether there are any equipment problems to be addressed",
        options:[{name:"Yes",id:"130"},{name:"No",id:"131"}]
    },
]
const beforeOperation=[
    {
        id:22,
        fieldName:"recovery",
        content:"What are the key concerns for recovery and management of this patient?",
        options:[{name:"Yes",id:"132"},{name:"No",id:"133"}]
    },
]


export  {beforeInductionData,beforeskinInsertion,beforeskinInsertionSurgen,beforeskinInsertionAnaesthetist,beforeskinInsertionNursing,beforeOperationVerbal,beforeOperation}