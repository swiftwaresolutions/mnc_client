declare module '@cornerstonejs/dicom-image-loader' {
    import cornerstone from 'cornerstone-core';
    import dicomParser from 'dicom-parser';

    interface DICOMImageLoader {
        external: any;
        configure: (options: {
            useWebWorkers: boolean;
            decodeConfig: {
                convertFloatPixelDataToInt: boolean;
                use16BitDataType: boolean;
            };
        }) => void;
        wadouri:any;
        webWorkerManager:any
    }

    const cornerstoneDICOMImageLoader: DICOMImageLoader;
    export default cornerstoneDICOMImageLoader;
}
