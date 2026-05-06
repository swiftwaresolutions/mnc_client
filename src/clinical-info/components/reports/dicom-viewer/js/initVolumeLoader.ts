import { volumeLoader } from '@cornerstonejs/core';
import {cornerstoneStreamingImageVolumeLoader,
  cornerstoneStreamingDynamicImageVolumeLoader
} from '@cornerstonejs/streaming-image-volume-loader';

export default function initVolumeLoader() {
  const volumeLoaderInst : any=volumeLoader
  volumeLoaderInst.registerUnknownVolumeLoader(
    cornerstoneStreamingImageVolumeLoader
  );
  volumeLoaderInst.registerVolumeLoader(
    'cornerstoneStreamingImageVolume',
    cornerstoneStreamingImageVolumeLoader
  );
  volumeLoaderInst.registerVolumeLoader(
    'cornerstoneStreamingDynamicImageVolume',
    cornerstoneStreamingDynamicImageVolumeLoader
  );
}
 