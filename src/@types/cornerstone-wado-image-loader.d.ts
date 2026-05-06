declare module "cornerstone-wado-image-loader" {
  interface DICOMImageLoader {
    wadouri: { fileManager: { add: (imageBuffer) => string } };
    external: any;
    webWorkerManager: { initialize: (config: any) => void };
  }

  const cornerstoneWadoImageLoader: DICOMImageLoader;
  export default cornerstoneWadoImageLoader;
}
