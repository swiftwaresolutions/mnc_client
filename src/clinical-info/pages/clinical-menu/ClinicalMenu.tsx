import { Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import InPatientMenu from "./components/InPatientMenu";
import OutPatientMenu from "./components/OutPatientMenu";
const ClinicalMenu = () => {
  const { isIp } = useSelector((s: RootState) => s.clinicalPersistReducer);

  return (
    <Container>
      {isIp == 0 && (
        <Row className="h-100  row-cols-1 row-cols-sm-3">
          <OutPatientMenu />
        </Row>
      )}
      {isIp == 1 && (
        <Row className="h-100  row-cols-1 row-cols-sm-3">
          <InPatientMenu />
        </Row>
      )}
    </Container>
  );
};

export default ClinicalMenu;
