import React, { Fragment } from "react";
import { Col, Button } from "react-bootstrap";
import { routerPathNames } from "../../../../routes/routerPathNames";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store";

const InPatientMenu = () => {
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
      path: routerPathNames.clinical.generalCaseSheet3,
      menuCode: "026",
    },
    {
      name: "IP PROGRESS_NOTES",
      color: "outline-success",
      path: routerPathNames.clinical.ipprocedure,
      menuCode: "021",
    },
    {
      name: "SURGERY",
      color: "outline-success",
      path: routerPathNames.clinical.surgery,
      menuCode: "020",
    },
    {
      name: "SURGERY CHECKLIST",
      color: "outline-success",
      path: routerPathNames.clinical.SafetyChecklist,
      menuCode: "018",
    },
    {
      name: "SURGERY SCORE CHART",
      color: "outline-success",
      path: routerPathNames.clinical.scoreChart,
      menuCode: "017",
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
      name: "PRESCRIPTION NURSE",
      color: "outline-primary",
      path: routerPathNames.clinical.NursingPrescription,
      menuCode: "022",
    },
    {
      name: "LAB & PROCEDURES",
      color: "outline-primary",
      path: routerPathNames.clinical.labandprocedure,
      menuCode: "011",
    },
    {
      name: "NURSING IO",
      color: "outline-primary",
      path: routerPathNames.clinical.ioNursing,
      menuCode: "019",
    },
    {
      name: "DISCHARGE SUMMARY",
      color: "outline-primary",
      path: routerPathNames.clinical.dischargesummary,
      menuCode: "024",
    },
    {
      name: "DELIVERY DETAILS",
      color: "outline-primary",
      path: routerPathNames.clinical.deliveryDetails,
      menuCode: "023",
    },
  ];

  const menu3 = [
    {
      name: "CLINICAL REPORT",
      color: "outline-danger",
      path: routerPathNames.clinical.clinicalReport,
      menuCode: "013",
    },
    {
      name: "SUMMARY PRINT",
      color: "outline-danger",
      path: routerPathNames.clinical.dischargesummaryprint,
      menuCode: "025",
    },

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
          <Col className="">
            <Button variant="success" className=" mb-3 w-100">
              IP WORK STATIONS
            </Button>
          </Col>
          {menu1
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx} className="">
                <Button variant={item.color} className={`mb-3 w-100 ${item.path == "" ? "d-none" : ""}`} onClick={() => onChangeSubmenu(item.path)}>
                  {item.name}
                </Button>
              </Col>
            ))}
        </Col>
      </Col>
      <Col className="mt-5 row justify-content-center">
        <Col md="8">
          <Col className="">
            <Button variant="primary" className=" mb-3 w-100">
              OTHER ENTRY
            </Button>
          </Col>
          {menu2
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx} className="">
                <Button variant={item.color} className={`mb-3 w-100 ${item.path == "" ? "d-none" : ""}`} onClick={() => onChangeSubmenu(item.path)}>
                  {item.name}
                </Button>
              </Col>
            ))}
        </Col>
      </Col>
      <Col className="mt-5 row justify-content-center">
        <Col md="8">
          <Col className="">
            <Button variant="danger" className=" mb-3 w-100">
              REPORTS
            </Button>
          </Col>
          {menu3
            .filter((mod) => clinicalModuleDetails.find((modItem) => modItem.menuCode == mod.menuCode))
            .map((item, idx) => (
              <Col key={idx} className="">
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

export default InPatientMenu;
