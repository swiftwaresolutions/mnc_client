interface ScoreChartModel{
    id: Number,
    patId: Number,
    visitId: Number,
    ipId: Number,
    activity:Number,
    conscious:Number,
    respiration:Number,
    saturation:Number,
    dtm:String,
    userId:number
}
const ScoreChartSaveFormat={
    id: 0,
    patId: 0,
    visitId: 0,
    ipId: 0,
    activity:0,
    conscious:0,
    respiration:0,
    saturation:0,
    dtm:"",
    userId:0
}
export {type ScoreChartModel,ScoreChartSaveFormat}