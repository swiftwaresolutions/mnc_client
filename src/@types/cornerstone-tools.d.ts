declare module "cornerstone-tools" {
  interface ConrnerstoneTools {
    external: any;
    init: () => void;
    addStackStateManager: (element, array) => void;
    addToolState: (element, stack: string, array) => void;
    WwwcTool:any
  }
  const cornerstoneTools: ConrnerstoneTools;
  export default cornerstoneTools;
}
