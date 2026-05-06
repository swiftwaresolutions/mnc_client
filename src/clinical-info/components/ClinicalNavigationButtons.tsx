import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const button = [
    {
        color: "outline-warning",
        name: "Refresh",
        path: "",
    },
    {
        color: "outline-primary",
        name: "Prescription",
        path: ""
    },
    {
        color: "outline-primary",
        name: "Lab & Procedures",
        path: "",
    },
    {
        color: "outline-primary",
        name: "Radiology",
        path: "",
    },
    {
        color: "outline-primary",
        name: "ECG",
        path: "",
    },
    {
        color: "outline-primary",
        name: "Eye optometry",
        path: "",
    },
    {
        color: "outline-primary",
        name: "Community Notes",
        path: "",
    },
    {
        color: "outline-danger",
        name: "Laboratory View",
        path: "",
    },
    {
        color: "outline-danger",
        name: "Investigation View",
        path: "",
    },
    {
        color: "outline-danger",
        name: "Prescription View",
        path: "",
    },
    {
        color: "outline-danger",
        name: "CaseSheet View",
        path: "",
    },
    {
        color: "outline-danger",
        name: "Visit Details",
        path: "",
    },
    {
        color: "outline-success",
        name: "General",
        path: "",
    },
    {
        color: "outline-success",
        name: "Antental",
        path: "",
    },
    {
        color: "outline-success",
        name: "Pediatric",
        path: "",
    },
    {
        color: "outline-success",
        name: "Ophthal",
        path: "",
    },
    {
        color: "outline-success",
        name: "Dental",
        path: "",
    },
]
const ClinicalNavigationButtons = ({ filterName, extra }: any) => {

    const navigate = useNavigate()

    const navigateRoute = (path: string, name: string) => {
        navigate(path)
    }
    return <>
        <Container fluid="lg" className="my-1">
            <Row>
                {extra?.map((data: any, idx: any) => (
                    <Col md={2} key={idx}>
                        <Button variant={data.color} className="w-100 m-1" onClick={() => navigateRoute(data.path, data.name,)}>{data.name}</Button>
                    </Col>
                ))}
                {button.filter((data: any) => data.name != filterName).map((data: any, idx: any) => (
                    <Col md={2} key={idx}>
                        <Button variant={data.color} className="w-100 m-1" onClick={() => navigateRoute(data.path, data.name)}>{data.name}</Button>
                    </Col>
                ))}
            </Row>
        </Container>
    </>
}
export default ClinicalNavigationButtons