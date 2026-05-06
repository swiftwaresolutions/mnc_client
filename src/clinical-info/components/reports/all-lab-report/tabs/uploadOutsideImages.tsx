import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PatientInvImageInterface } from '../model/interfaces';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../state/store';
import { hostAddress } from '../../../../../clinicalConfig';

interface ComponentProps {
    outsideImages : PatientInvImageInterface[];
}

const UploadOutsideImages : React.FC<ComponentProps> = ({ outsideImages}) => {
    const appData = useSelector((state : RootState) => state.appReducer)
    // let hostName = isDev ? "192.168.1.20" : window.location.hostname
    let hostName = hostAddress
    const uploadedBaseUrl = `http://${hostName}:${appData.organization.port}/${appData.organization.code}`;
    const [patientImageDetails, setPatientImageDetails] = useState<PatientInvImageInterface[]>([])
    const [previewSelectedImage, setPreviewSelectedImage] = useState<string | null>(null)
    const [previewSelectedIndex, setPreviewSelectedIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });


    const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%
    const [isZoomed, setIsZoomed] = useState(false);
    const [initialTouchDistance, setInitialTouchDistance] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);



  
    // const handlePreviewClick = (image :any) => {
    //     setPreviewSelectedImage(`${uploadedBaseUrl}/${image.path}`);
    //   };
      
    //   const handleClosePreview = () => {
    //     setPreviewSelectedImage(null);
    //   };      

    const handleImageClick = () => {
        if (zoomLevel === 1) {
          setZoomLevel(2); // Zoom in to 200%
          setIsZoomed(true);
        } else {
          setZoomLevel(1); // Reset zoom
          setIsZoomed(false);
        }
      };
      
      // const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
      //   e.preventDefault();
      //   const delta = e.deltaY > 0 ? -0.1 : 0.1; // Scroll down to zoom out
      //   setZoomLevel(prev => {
      //     let newZoom = prev + delta;
      //     if (newZoom < 1) newZoom = 1;
      //     if (newZoom > 4) newZoom = 4; // Limit zoom to 400%
      //     return newZoom;
      //   });
      // };

      const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  e.preventDefault();

  if (!containerRef.current) return;

  const containerRect = containerRef.current.getBoundingClientRect();

  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  const containerCenterX = containerRect.width / 2;
  const containerCenterY = containerRect.height / 2;

  const delta = e.deltaY > 0 ? -0.1 : 0.1;

  setZoomLevel((prevZoom) => {
    let newZoom = prevZoom + delta;
    if (newZoom < 1) newZoom = 1;
    if (newZoom > 4) newZoom = 4;

    // Calculate the zoom factor difference
    const zoomFactor = newZoom / prevZoom;

    // Shift the position to zoom into the cursor
    setPosition((prev) => {
      const dx = (mouseX - containerCenterX);
      const dy = (mouseY - containerCenterY);

      const newX = prev.x - dx * (zoomFactor - 1);
      const newY = prev.y - dy * (zoomFactor - 1);

      return { x: newX, y: newY };
    });

    return newZoom;
  });
};


      const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
        if (zoomLevel > 1) {
          setIsDragging(true);
          setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
      };
      
      const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (isDragging) {
          const newX = e.clientX - startPos.x;
          const newY = e.clientY - startPos.y;
          setPosition({ x: newX, y: newY });
        }
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
      };

      const handleDoubleClick = () => {
        if (zoomLevel === 1) {
          setZoomLevel(2);
          setIsZoomed(true);
        } else {
          setZoomLevel(1);
          setIsZoomed(false);
          setPosition({ x: 0, y: 0 });
        }
      };
   
        
    const handlePreviewClick = (index: number) => {
        setPreviewSelectedIndex(index);
    };

    const handleClosePreview = () => {
        setPreviewSelectedIndex(null);
        setZoomLevel(1);
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      };
      

    const handleNext = () => {
        if (previewSelectedIndex !== null && previewSelectedIndex < patientImageDetails.length - 1) {
            setPreviewSelectedIndex(previewSelectedIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (previewSelectedIndex !== null && previewSelectedIndex > 0) {
            setPreviewSelectedIndex(previewSelectedIndex - 1);
        }
    };

    // ⌨️ Keyboard arrow navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (previewSelectedIndex !== null) {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'Escape') handleClosePreview();
        }
    }, [previewSelectedIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

      useEffect(() => {
        if (outsideImages && outsideImages.length > 0) {
          setPatientImageDetails(outsideImages);
        }
      }, [outsideImages]);
      
  return (
    <>
        <Row className="h-100">
            <Col className='overflow-auto'>
                {patientImageDetails.length < 1 ? (
                    <Row className="h-100 align-items-center">
                      <Col>
                          <h4 className='p-2 text-center text-danger'>Image Details are Empty!.</h4>
                      </Col>
                    </Row>  
                ): 
                (
                    Object.entries(
                      patientImageDetails.reduce((acc, image) => {
                        if (!acc[image.vstId]) acc[image.vstId] = [];
                        acc[image.vstId].push(image);
                        return acc;
                      }, {} as { [vstId: number]: PatientInvImageInterface[] })
                    ).map(([vstId, images]) => (
                      <div key={vstId}>
                        <h6 className="mt-3">Visit No : {vstId.length}</h6>
                        <Row className="gap-2 justify-content-start p-2">
                          {images.map((image, idx) => (
                            <Col className="position-relative border rounded min-w-150px max-w-150px p-0" key={idx}>
                              <img
                                src={`${uploadedBaseUrl}/${image.path}`}
                                alt={`Preview ${idx}`}
                                // onClick={() => handlePreviewClick(image)}
                                onClick={() => handlePreviewClick(patientImageDetails.findIndex(img => img.id === image.id))}
                                style={{
                                  width: '100%',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              />
                              <div className='text-center'>{image.invDate == "0000-00-00"  ? "" : image.invDate}</div>
                              <div className="text-center mt-1">{image.invName}</div>
                              <div className='text-center mt-1'>{image.otherInv}</div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ))
                  )
            }
            </Col>
        </Row>

        {previewSelectedIndex !== null && (
                <div
                    className="modal show d-block"
                    tabIndex={-1}
                    role="dialog"
                    onClick={handleClosePreview}
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        role="document"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
                    >
                        <div className="modal-content position-relative">
                            <div className="modal-body p-0 text-center bg-dark">
                                <button
                                    onClick={handlePrevious}
                                    disabled={previewSelectedIndex === 0}
                                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                                    style={{ zIndex: 10 }}
                                >
                                    ‹
                                </button>

                                <div
                                ref={containerRef}
  className="image-preview-container position-relative mx-auto"
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
  onWheel={handleWheel}
  onDoubleClick={handleDoubleClick}
  style={{
    width: '800px', // Set desired width
    height: '600px', // Set desired height
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : isZoomed ? 'zoom-out' : 'zoom-in',
  }}
>
  <img
    src={`${uploadedBaseUrl}/${patientImageDetails[previewSelectedIndex].path}`}
    alt="Full Preview"
    onClick={handleImageClick}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain', // <-- ensures full image fits inside
     // transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
     transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`, 
     transition: isDragging ? 'none' : 'transform 0.3s ease',
      userSelect: 'none',
      pointerEvents: 'none',
    }}
    draggable={false}
/>
</div>


                                

                                <button
                                    onClick={handleNext}
                                    disabled={previewSelectedIndex === patientImageDetails.length - 1}
                                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                                    style={{ zIndex: 10 }}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        {/* {previewSelectedImage && (
            <div
                className="modal show d-block"
                tabIndex={-1}
                role="dialog"
                onClick={handleClosePreview}
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body p-0">
                    <img src={previewSelectedImage} alt="Full Preview" style={{ width: '100%' }} />
                    </div>
                </div>
                </div>
            </div>
            )} */}
    </>
  )
}

export default UploadOutsideImages