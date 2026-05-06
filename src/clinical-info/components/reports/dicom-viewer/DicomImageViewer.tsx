import { useEffect, useRef, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from "cornerstone-tools";
import { useDispatch, useSelector } from 'react-redux'
import cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import Hammer from "hammerjs";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { ImageApiService } from "../../../../api/image/image-api-service";
import { RootState } from "../../../../state/store";
import { Col, Row } from "react-bootstrap";

const DicomImageViewer = () => {
  const [images, setImages] = useState<any[]>([]);
  const [DcmImageList, setDcmImageList] = useState<any[]>([]);

  const { clinicalCurrentOpPatient, clinicalCurrentIpPatient, isIp } = useSelector((state: RootState) => state.clinicalPersistReducer)

  let patientDetails: any;

  const imgPath = window.location.host

  let ipId;

  if (isIp == 0) {
    patientDetails = clinicalCurrentOpPatient
    ipId = 0
  } else {
    patientDetails = clinicalCurrentIpPatient
    ipId = patientDetails.ipId
  }

  console.log(patientDetails.patientId);

  const imageApiService = new ImageApiService()

  const viewerRef0 = useRef<any>(null);
  const viewerRef1 = useRef<any>(null);
  const viewerRef2 = useRef<any>(null);
  const viewerRef3 = useRef<any>(null);
  const viewerRef4 = useRef<any>(null);



  const fetchImgDetials = async () => {
    const res = await imageApiService.fetchPatientImageDetails(patientDetails.patientId)
    setDcmImageList([...res])
  }
  if (DcmImageList.length > 0) {
    DcmImageList.forEach((dcmImg, i) => {
      let mediaArray: any[] = [];
      const url = `http://172.16.44.217:8081/${dcmImg.imagePath}`;
      console.log(url);
      if (viewerRef0.current) {
        cornerstone.enable(viewerRef0.current);
      }
      if (viewerRef1.current) {
        cornerstone.enable(viewerRef1.current);
      }
      if (viewerRef2.current) {
        cornerstone.enable(viewerRef2.current);
      }
      if (viewerRef3.current) {
        cornerstone.enable(viewerRef3.current);
      }
      if (viewerRef4.current) {
        cornerstone.enable(viewerRef4.current);
      }

      const imageId = `wadouri:${url}`;
      mediaArray.push(imageId);
      const stack = { currentImageIdIndex: 0, imageIds: mediaArray };
      cornerstone
        .loadImage(mediaArray[0])
        .then((image) => {
          let val:any
          if (i == 0) {
             val = viewerRef0
          }
          if (i == 1) {
             val = viewerRef1
          }
          if (i == 2) {
             val = viewerRef2
          }
          if (i == 3) {
             val = viewerRef3
          }
         
          if (!val.current) return;
          cornerstone.displayImage(val.current, image);
          cornerstoneTools.addStackStateManager(val.current, ["stack"]);
          cornerstoneTools.addToolState(val.current, "stack", stack);
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
      ///continue
    })
  }
  const initializeCornerstone = () => {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneFileImageLoader.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();
    if (!viewerRef0.current) return;
    //cornerstone.enable(viewerRef.current);
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      taskConfiguration: {
        decodeTask: {
          initializeCodecsOnStartup: false,
          usePDFJS: false,
          strict: false,
        },
      },
    });
  };


  const handleCheck = (e: any,i:number) => {
    console.log(DcmImageList[i]);
    if(DcmImageList[i]){
      window.open(`http://172.16.44.6:8081/akh/DICOM_VIEWER/index.html?data=${DcmImageList[i].imagePath}`,'_blank')
    }
   // window.open(`http://172.16.44.217:8081/${DcmImageList[i].imagePath}`,'_blank')
  }
  useEffect(() => {
    fetchImgDetials()

    if (!viewerRef0.current) {
      return;
    }
    initializeCornerstone();
  }, [viewerRef0, images]);

  return (
    <div>
      <h2>Dicom Images</h2>
      <Row>
        {/* {
          DcmImageList.map((obj,i)=>{
            return(
              <Col md={4} className="m-2 p-2">
                <div>fff</div>
              <div onClick={(e) => { handleCheck(e)}} ref={`viewerRef${i}`} id="viewer"></div>
          </Col>
            )
          })
        } */}
        <Col md={2} className="m-2 p-2">
          <div onClick={(e) => { handleCheck(e,0) }} ref={viewerRef0} id="viewer"></div>
          <div className="text-center">{DcmImageList[0]?.imagePath.split('/')[1]}</div>
        </Col>
        <Col md={2} className="m-2 p-2">
          <div onClick={(e) => { handleCheck(e,1) }} ref={viewerRef1} id="viewer"></div>
          <div className="text-center">{DcmImageList[1]?.imagePath.split('/')[1]}</div>
        </Col>
        <Col md={2} className="m-2 p-2">
          <div onClick={(e) => { handleCheck(e,2)}} ref={viewerRef2} id="viewer"></div>
          <div className="text-center">{DcmImageList[2]?.imagePath.split('/')[1]}</div>
        </Col>
        <Col md={2} className="m-2 p-2">
          <div onClick={(e) => { handleCheck(e,3) }} ref={viewerRef3} id="viewer"></div>
          <div className="text-center">{DcmImageList[3]?.imagePath.split('/')[1]}</div>
        </Col>
      </Row>
    </div>
  );
};

export default DicomImageViewer;
