import { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { routerPathNames } from "./routerPathNames";
import { routerBaseUrl } from "../clinicalConfig";
import Login from "../login/Login";
import MainLayout from "../main-layout/MainLayout";
import GeneralCaseSheet from "../clinical-info/components/casesheet/general-case-sheet/GeneralCaseSheet";
import GeneralCaseSheet3 from "../clinical-info/components/casesheet/general-casesheet-3/generalCaseSheet";
import ClinicalMenu from "../clinical-info/pages/clinical-menu/ClinicalMenu";
import Prescription from "../clinical-info/components/other-entries/prescription/Prescription";
import CaseSheetPatientList from "../patient-list/CaseSheetPatientList";
import LabAndProcedure from "../clinical-info/components/other-entries/lab-procedures/LabAndProcedure";
import AuthGuard from "../auth-guard/AuthGuard";
import Vitals from "../clinical-info/components/casesheet/vitals/Vitals";
import ViewDetails from "../clinical-info/components/reports/visit-details/ViewDetails";
import DischargeSummary from "../clinical-info/components/other-entries/discharge-summary/DischargeSummary";
import DischargeSummaryPrint from "../clinical-info/components/other-entries/discharge-summary/DischargeSummaryPrint";
import SurgeryCaseSheet from "../clinical-info/components/casesheet/IP-Surgery-case-sheet/SurgeryCaseSheet";
import SafetyCheckList from "../clinical-info/components/other-entries/safetyCheckList/SafetyCheckList";
import IpProcedure from "../clinical-info/components/casesheet/ip-procedures/IpProcedure";
import ClinicalReport from "../clinical-info/components/reports/clinical-report/CLinicalReport";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import ScoreChart from "../clinical-info/components/other-entries/scoreChart/ScoreChart";
import NursingIo from "../clinical-info/components/other-entries/nursingIO/NursingIo";
import NursePrescription from "../clinical-info/components/other-entries/nursingPrescripion/NursePrescription";
import DeliveryDetails from "../clinical-info/components/other-entries/deliveryDetails/DeliveryDetails";
import DischargeSummaryPrintC from "../clinical-info/components/other-entries/discharge-summary/DischargeSummaryPrintC";
import DicomImageViewer from "../clinical-info/components/reports/dicom-viewer/DicomImageViewer";
import OutsideLabAndProcedure from "../clinical-info/components/other-entries/outside-Lab-Procedure/OutsideLabAndProceudre";
import OutsideLabInvReport from "../clinical-info/components/reports/outside-lab-inv-report/outsideLabInvReport";
import AllLabReport from "../clinical-info/components/reports/all-lab-report/allLabReport";
import DirectGeneralCaseSheet from "../clinical-info/components/casesheet/direct-general-case-sheet/DirectGeneralCaseSheet";

const AppRouter = () => {
  const { clinicalModuleDetails } = useSelector((s: RootState) => s.appReducer);
  
  
  
  return (
    <>
      <Fragment>
        <Router basename={routerBaseUrl}>
          <Routes>
            <Route index path="/" element={<Login />} />
            {clinicalModuleDetails.find((mod) => mod.menuCode == "025") ? <Route path={routerPathNames.clinical.dischargesummaryprintC} element={<AuthGuard doctorOnly={true}><DischargeSummaryPrintC /></AuthGuard>} /> : null}
            <Route path="/clinical" element={<MainLayout />}>
              <Route path={routerPathNames.clinical.dashboard} element={<AuthGuard><CaseSheetPatientList /></AuthGuard>} />
              <Route path={routerPathNames.clinical.clinicalmenu} element={<AuthGuard><ClinicalMenu /></AuthGuard>} />
              {clinicalModuleDetails.find((mod) => mod.menuCode == "001") ? <Route path={routerPathNames.clinical.generalcasesheet} element={<AuthGuard><GeneralCaseSheet /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "002") ? <Route path={routerPathNames.clinical.directgeneralcasesheet} element={<AuthGuard><DirectGeneralCaseSheet /></AuthGuard>} /> : null}

              {clinicalModuleDetails.find((mod) => mod.menuCode == "009") ? <Route path={routerPathNames.clinical.vitals} element={<AuthGuard doctorOnly={false}><Vitals /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "010") ? <Route path={routerPathNames.clinical.prescription} element={<AuthGuard><Prescription /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "011") ? <Route path={routerPathNames.clinical.labandprocedure} element={<AuthGuard><LabAndProcedure /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "012") ? <Route path={routerPathNames.clinical.viewdetails} element={<AuthGuard><ViewDetails /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "013") ? <Route path={routerPathNames.clinical.clinicalReport} element={<AuthGuard ><ClinicalReport /></AuthGuard>} /> : null}
              
              
              {clinicalModuleDetails.find((mod) => mod.menuCode == "017") ? <Route path={routerPathNames.clinical.scoreChart} element={<AuthGuard><ScoreChart /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "018") ? <Route path={routerPathNames.clinical.SafetyChecklist} element={<AuthGuard><SafetyCheckList /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "019") ? <Route path={routerPathNames.clinical.ioNursing} element={<AuthGuard><NursingIo /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "020") ? <Route path={routerPathNames.clinical.surgery} element={<AuthGuard><SurgeryCaseSheet /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "021") ? <Route path={routerPathNames.clinical.ipprocedure} element={<AuthGuard><IpProcedure /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "022") ? <Route path={routerPathNames.clinical.NursingPrescription} element={<AuthGuard><NursePrescription /></AuthGuard>} /> : null}
            
              {clinicalModuleDetails.find((mod) => mod.menuCode == "023") ? <Route path={routerPathNames.clinical.deliveryDetails} element={<AuthGuard><DeliveryDetails /></AuthGuard>} /> : null}

              {/* <Route path={routerPathNames.clinical.deliveryDetails} element={<AuthGuard component={<DeliveryDetails />} />} /> */}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "024") ? <Route path={routerPathNames.clinical.dischargesummary} element={<AuthGuard><DischargeSummary /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "025") ? <Route path={routerPathNames.clinical.dischargesummaryprint} element={<AuthGuard><DischargeSummaryPrint /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "025") ? <Route path={routerPathNames.clinical.dischargesummaryprintC} element={<AuthGuard><DischargeSummaryPrint /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "026") ? <Route path={routerPathNames.clinical.generalCaseSheet3} element={<AuthGuard><GeneralCaseSheet /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "027") ? <Route path={routerPathNames.clinical.dicomViewer} element={<AuthGuard><DicomImageViewer /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "028") ? <Route path={routerPathNames.clinical.outsideLab} element={<AuthGuard><OutsideLabAndProcedure /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "030") ? <Route path={routerPathNames.clinical.outsideReport} element={<AuthGuard><OutsideLabInvReport /></AuthGuard>} /> : null}
              {clinicalModuleDetails.find((mod) => mod.menuCode == "031") ? <Route path={routerPathNames.clinical.allLabReport} element={<AuthGuard><AllLabReport /></AuthGuard>} /> : null}
              
              
              </Route>
              
          </Routes>
        </Router>
      </Fragment>
    </>
  );
};

export default AppRouter;
