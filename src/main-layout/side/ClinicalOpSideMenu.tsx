import { faAnglesRight, faEye, faFileMedical, faHandHoldingMedical, faHeartbeat, faHospitalUser, faListCheck, faMicroscope, faPersonPregnant, faPills, faStethoscope, faTemperatureHigh, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Col, ListGroup, Nav, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { routerPathNames } from "../../routes/routerPathNames";
import { RootState } from "../../state/store";

const iconGroup : {[key : string]: any} = {
  "faPills": faPills,
  "faHandHoldingMedical" : faHandHoldingMedical,
  "faStethoscope" :faStethoscope,
  "faMicroscope" : faMicroscope,
  "faTemperatureHigh" : faTemperatureHigh,
  "faEye" : faEye,
  "faHeartbeat" : faHeartbeat,
  "faFileMedical" : faFileMedical,
  "faPersonPregnant" : faPersonPregnant
}

const clinicalMenus = [

  // op work station
  
  {
    groupType: "OP WORK STATION",
    color: "success",
    menus: [
      {
        groupName: "CASE SHEET",
        path: routerPathNames.clinical.generalcasesheet,
        menuCode: "001",
        icon : "faStethoscope"
      },
      {
        groupName: "CASE SHEET",
        path: routerPathNames.clinical.directgeneralcasesheet,
        menuCode: "002",
        icon : "faStethoscope"
      },
      
      {
        groupName: "CASE SHEET",
        path: routerPathNames.clinical.generalCaseSheet3,
        menuCode: "026",
        icon : "faStethoscope"
      },
      {
        groupName: "ANTENATAL-1",
        path: routerPathNames.clinical.antenatalcasesheet,
        menuCode: "003",
        icon : "faPersonPregnant"
      },
      {
        groupName: "ANTENATAL-2",
        path: routerPathNames.clinical.antenatalcasesheet2,
        menuCode: "004",
        icon : "faPersonPregnant"
      },
      {
        groupName: "ANTENATAL",
        path: routerPathNames.clinical.antenatalcasesheet3,
        menuCode: "005",
        icon : "faPersonPregnant"
      },
      {
        groupName: "PEDIATRIC",
        path: routerPathNames.clinical.pediatriccasesheet,
        menuCode: "006",
      },
      {
        groupName: "DENTAL",
        path: routerPathNames.clinical.dentalcasesheet,
        menuCode: "007",
      },
      {
        groupName: "NEONATE",
        path: routerPathNames.clinical.neonate,
        menuCode: "008",
      },
      {
        groupName: "VITALS",
        path: routerPathNames.clinical.vitals,
        menuCode: "009",
        icon : "faTemperatureHigh"
      },
    ],
  },
  //
  {
    groupType: "OTHER ENTRY",
    color: "primary",
    menus: [
      {
        groupName: "PRESCRIPTION",
        path: routerPathNames.clinical.prescription,
        menuCode: "010",
        icon : "faPills"
      },
      {
        groupName: "INV & PROCEDURES",
        path: routerPathNames.clinical.labandprocedure,
        menuCode: "011",
        icon : "faMicroscope"
      },
      {
        groupName: "OUTSIDE LAB & INV",
        path: routerPathNames.clinical.outsideLab,
        menuCode: "028",
      },
    ],
  },
  {
    groupType: "",
    color: "danger",
    menus: [
      {
        groupName: "VISIT DETAILS",
        path: routerPathNames.clinical.viewdetails,
        menuCode: "012",
      },
      // {
      //   groupName: "CLINICAL REPORT",
      //   path: routerPathNames.clinical.clinicalReport,
      //   menuCode: "013",
      //   icon : "faFileMedical"
      // },
      {
        groupName: "DICOM VIEWER",
        path: routerPathNames.clinical.dicomViewer,
        menuCode: "027",
      },
      {
        groupName: "LAB REPORT",
        path: routerPathNames.clinical.outsideReport,
        menuCode: "030",
        icon : "faFileMedical"
      },
      {
        groupName: "ALL LAB REPORT",
        path: routerPathNames.clinical.allLabReport,
        menuCode: "031",
        icon : "faMicroscope"
      }
    ],
  },
];

const clinicicalMainMenu = [
  {
    name: "PATIENT LIST",
    path: routerPathNames.clinical.dashboard,
  },
];

const SideNavMenu = ({ sideView }: any) => {
  const ignoreRoutes = ["dashboard", "clinicalmenu"];

  const navigate: any = useNavigate();

  const location = useLocation();

  const currentPath = location.pathname.split("/")[location.pathname.split("/").length - 1];

  const {clinicalModuleDetails} = useSelector((s:RootState)=>s.appReducer)

  const subMenuChange = (e: any, path: any) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <ListGroup className="fs-12px sidebar-container px-2">
      {clinicicalMainMenu.map((item: any, idx) => (
        <ListGroup.Item className={`border-0 px-2 ${item.path.includes(currentPath) ? "active-link" : ""}`} key={idx}>
          <NavLink to={item.path} onClick={(e) => subMenuChange(e, item.path)} className={`d-flex text-decoration-none align-items-center`}>
            <Row className="flex-nowrap align-items-center">
              <Col>
                <FontAwesomeIcon icon={faUsers} className="text-success fs-15px" />
              </Col>
              <Col className={`text-nowrap text-warning ${sideView === false ? "d-none" : "flex-grow-0 min-w-150px px-3 fw-bold"}`}>{item.name}</Col>
              <Col>
                <FontAwesomeIcon icon={faAnglesRight} className="text-success fs-15px" />
              </Col>
            </Row>
          </NavLink>
        </ListGroup.Item>
      ))}

      {!ignoreRoutes.includes(currentPath) &&
        clinicalMenus.map((item, idx) => (
          <ListGroup.Item className={`border-0`} key={idx}>
            <Row>
              <Col className={sideView === false ? "d-none" : "min-w-150px px-3 fw-bold"}>{item.groupType}</Col>
            </Row>
            <Row>
              {item.menus &&
                item.menus.filter((menu)=>clinicalModuleDetails.find((mod)=>mod.menuCode==menu.menuCode)).map((menu: any, menuIdx: number) => {
                  const selectedIcon =  menu.icon ? iconGroup[menu.icon] : faListCheck;
                  return(
                  <ListGroup.Item className={`border-0 px-1 ${menu.path.includes(currentPath) ? "active-link" : ""} ${!menu.path ? "d-none" : "d-block"}`} key={menuIdx}>
                    <NavLink to={menu.path} onClick={(e) => subMenuChange(e, menu.path)} className={`d-flex text-decoration-none align-items-center `}>
                      <Row className="flex-nowrap align-items-center">
                      <Col><FontAwesomeIcon icon={selectedIcon} className={`text-${item.color} fs-15px`} /></Col>
                        <Col className={sideView === false ? "d-none" : `min-w-150px px-3 fw-bold text-${item.color}`}>{menu.groupName}</Col>
                      </Row>
                    </NavLink>
                  </ListGroup.Item>
                )})}
            </Row>
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
};

export default SideNavMenu;
