declare module "cornerstone-file-image-loader" {
    interface ConerstoneFileImageLoader {
      external:{
        cornerstone:any
      }
    }
    const conerstoneFileImageLoader: ConerstoneFileImageLoader;
    export default conerstoneFileImageLoader;
  }