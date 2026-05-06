import { faHospitalUser, faListCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Col, ListGroup, Nav, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { routerPathNames } from "../../routes/routerPathNames"
import { RootState } from "../../state/store"


const clinicalMenus = [
  {
    groupType: "IP WORK STATION",
    color: "success",
    menus: [
      {
        groupName: "GENERAL",
        path: routerPathNames.clinical.generalcasesheet,
        menuCode: "001",
      },
      {
        groupName: "GENERAL",
        path: routerPathNames.clinical.directgeneralcasesheet,
        menuCode: "002",
      },
      
      {
        groupName: "GENERAL",
        path: routerPathNames.clinical.generalCaseSheet3,
        menuCode: "026",
      },
      {
        groupName: "PROGRESS NOTES",
        path: routerPathNames.clinical.ipprocedure,
        menuCode: "021",
      },
      {
        groupName: "CHECKLIST",
        path: routerPathNames.clinical.SafetyChecklist,
        menuCode: "018",
      },
      {
        groupName: "SURGERY",
        path: routerPathNames.clinical.surgery,
        menuCode: "020",
      },
      {
        groupName: "SCORE CHART",
        path: routerPathNames.clinical.scoreChart,
        menuCode: "017",
      },

    ]
  },
  {
    groupType: "OTHER ENTRY",
    color: "primary",
    menus: [
      {
        groupName: "PRESCRIPTION",
        path: routerPathNames.clinical.prescription,
        menuCode: "010",
      },
      {
        groupName: "LAB & PROCEDURES",
        path: routerPathNames.clinical.labandprocedure,
        menuCode: "011",
      },
      {
        groupName: "PRESCRIPTION NURSE",
        path: routerPathNames.clinical.NursingPrescription,
        menuCode: "022",
      },
      {
        groupName: "NURSING IO",
        path: routerPathNames.clinical.ioNursing,
        menuCode: "019",
      },
      {
        groupName: "DISCHARGE SUMMARY",
        path: routerPathNames.clinical.dischargesummary,
        menuCode: "024",
      },
    ]
  },
  {
    groupType: "REPORTS",
    color: "danger",
    menus: [
      {
        groupName: "VISIT DETAILS",
        path: routerPathNames.clinical.viewdetails,
        menuCode: "012",
      },
      {
        groupName: "CLINICAL REPORT",
        path: routerPathNames.clinical.clinicalReport,
        menuCode: "013",
      },
      {
        groupName: "SUMMARY PRINT",
        path: routerPathNames.clinical.dischargesummaryprint,
        menuCode: "025",
      },

    ]
  },
]

const clinicicalMainMenu = [
  {
    name: "PATIENT LIST",
    path: routerPathNames.clinical.dashboard
  }
]

const SideNavMenu = ({ sideView }: any) => {

  const ignoreRoutes = ['dashboard', 'clinicalmenu']

  const navigate: any = useNavigate();

  const location = useLocation()

  const currentPath = location.pathname.split('/')[location.pathname.split('/').length - 1];

  const { clinicalModuleDetails } = useSelector((s: RootState) => s.appReducer)

  const subMenuChange = (path: any) => {
    navigate(path);
  };

  return (
    <ListGroup className="fs-12px sidebar-container px-2">
      {clinicicalMainMenu.map((item: any, idx) => (
        <ListGroup.Item className={`border-0 px-2 ${item.path.includes(currentPath) ? 'active-link' : ''}`} key={idx}>
          <NavLink
            to={item.path}
            onClick={() => subMenuChange(item.path)}
            className={`d-flex text-decoration-none align-items-center`}
          >
            <Row className="flex-nowrap align-items-center">
              <Col><FontAwesomeIcon icon={faListCheck} className="text-warning fs-15px" /></Col>
              <Col className={`text-nowrap text-warning ${sideView === false ? "d-none" : "flex-grow-0 min-w-150px px-3 fw-bold"}`}>{item.name}</Col>
            </Row>
          </NavLink>
        </ListGroup.Item>
      ))}

      {!ignoreRoutes.includes(currentPath) && clinicalMenus.map((item, idx) => (
        <ListGroup.Item className={`border-0`} key={idx}>
          <Row>
            <Col className={sideView === false ? "d-none" : "px-3 fw-bold"}>{item.groupType}</Col>
          </Row>
          <Row>
            {item.menus && item.menus.filter((menu) => clinicalModuleDetails.find((mod) => mod.menuCode == menu.menuCode)).map((menu: any, menuIdx: number) => (
              <ListGroup.Item className={`border-0 px-4 ${menu.path.includes(currentPath) ? 'active-link' : ''} ${!menu.path ? "d-none" : "d-block"}`} key={menuIdx}>
                <NavLink
                  to={menu.path}
                  onClick={() => subMenuChange(menu.path)}
                  className={`d-flex text-decoration-none align-items-center `}
                >
                  <Row>
                    <Col className={sideView === false ? "d-none" : `px-3 fw-bold text-${item.color}`}>{menu.groupName}</Col>
                  </Row>
                </NavLink>
              </ListGroup.Item>
            ))}
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SideNavMenu;