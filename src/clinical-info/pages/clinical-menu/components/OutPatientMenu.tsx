import React, { Fragment } from "react";
import { routerPathNames } from "../../../../routes/routerPathNames";
import { useNavigate } from "react-router-dom";
import { Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store";

const OutPatientMenu = () => {
  const menu1 = [
    {
      name: "GENERAL",
      color: "outline-success",
      path: routerPathNames.clinical.generalcasesheet,
      menuCode: "001",
    },
    {
      name: "GENERAL",
      color: "outline-success",
      path: routerPathNames.clinical.directgeneralcasesheet,
      menuCode: "002",
    },
    {
      name: "GENERAL",
      color: "outline-success",
      path: routerPathNames.clinical.generalCaseSheet3,
      menuCode: "026",
    },
    {
      name: "ANTENATAL",
      color: "outline-success",
      path: routerPathNames.clinical.antenatalcasesheet,
      menuCode: "003",
    },
    {
      name: "ANTENATAL - 2",
      color: "outline-success",
      path: routerPathNames.clinical.antenatalcasesheet2,
      menuCode: "004",
    },
    {
      name: "ANTENATAL",
      color: "outline-success",
      path: routerPathNames.clinical.antenatalcasesheet3,
      menuCode: "005",
    },
    { 
      name: "PEDIATRIC",
      color: "outline-success",
      path: routerPathNames.clinical.pediatriccasesheet,
      menuCode: "006",
    },
    {
      name: "DENTAL",
      color: "outline-success",
      path: routerPathNames.clinical.dentalcasesheet,
      menuCode: "007",
    },
    {
      name: "NEONATE",
      color: "outline-success",
      path: routerPathNames.clinical.neonate,
      menuCode: "008",
    },
    {
      name: "VITALS",
      color: "outline-success",
      path: routerPathNames.clinical.vitals,
      menuCode: "009",
    },
    {
      name: "DERMATOLOGY",
      color: "outline-success",
      path: routerPathNames.clinical.dermatologycasesheet,
      menuCode: "014",
    },
    {
      name: "OPTHAMOLOGY",
      color: "outline-success",
      path: routerPathNames.clinical.opthamologycasesheet,
      menuCode: "015",
    },
    {
      name: "ENT",
      color: "outline-success",
      path: routerPathNames.clinical.entcasesheet,
      menuCode: "016",
    },
  ];
  const menu2 = [
    {
      name: "PRESCRIPTION",
      color: "outline-primary",
      path: routerPathNames.clinical.prescription,
      menuCode: "010",
    },
    {
      name: "LAB & PROCEDURES",
      color: "outline-primary",
      path: routerPathNames.clinical.labandprocedure,
      menuCode: "011",
    },
    {
      name: "OUTSIDE LAB",
      color: "outline-primary",
      path: routerPathNames.clinical.outsideLab,
      menuCode: "028",
    },
 
  ];
  const menu3 = [
    {
      name: "VISIT DETAILS",
      color: "outline-danger",
      path: routerPathNames.clinical.viewdetails,
      menuCode: "012",
    },
    {
      name: "CLINICAL REPORT",
      color: "outline-danger",
      path: routerPathNames.clinical.clinicalReport,
      menuCode: "013",
    },
    {
      name: "LAB REPORT",
      color: "outline-danger",
      path: routerPathNames.clinical.outsideReport,
      menuCode: "030",
    },
    {
      name: "DICOM VIEWER",
      color: "outline-danger",
      path: routerPathNames.clinical.dicomViewer,
      menuCode: "027",
    },
    {
      name: "ALL LAB REPORT",
      color: "outline-danger",
      path: routerPathNames.clinical.allLabReport,
      menuCode: "031",
    }
    
  ];
  const { clinicalModuleDetails } = useSelector((s: RootState) => s.appReducer);
  const navigate = useNavigate();
  const onChangeSubmenu = (path: any) => {
    navigate(path);
  };
  return (
    <Fragment>
      <Col className="mt-5 row justify-content-center">
        <Col md="8">
          <Col>
            <Button variant="success" className=" mb-3 w-100">
              OP WORK STATIONS
            </Button>
          </Col>
          {menu1
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx}>
                <Button variant={item.color} className={`mb-3 w-100 ${item.path == "" ? "d-none" : ""}`} onClick={() => onChangeSubmenu(item.path)}>
                  {item.name}
                </Button>
              </Col>
            ))}
        </Col>
      </Col>
      <Col className="mt-5 row justify-content-center">
        <Col md="8">
          <Col>
            <Button variant="primary" className=" mb-3 w-100">
              OTHER ENTRY
            </Button>
          </Col>
          {menu2
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx}>
                <Button variant={item.color} className={`mb-3 w-100 ${item.path == "" ? "d-none" : ""}`} onClick={() => onChangeSubmenu(item.path)}>
                  {item.name}
                </Button>
              </Col>
            ))}
        </Col>
      </Col>
      <Col className="mt-5 row justify-content-center">
        <Col md="8">
          <Col>
            <Button variant="danger" className=" mb-3 w-100">
              REPORTS
            </Button>
          </Col>
          {menu3
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx}>
                <Button variant={item.color} className={`mb-3 w-100 ${item.path == "" ? "d-none" : ""}`} onClick={() => onChangeSubmenu(item.path)}>
                  {item.name}
                </Button>
              </Col>
            ))}
        </Col>
      </Col>
    </Fragment>
  );
};

export default OutPatientMenu;
