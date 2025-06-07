import { Button, Card, Container, Navbar } from "react-bootstrap"
import Weather from "./Weather"

export function MainHeader(){

    return(
        <div style={{ minWidth: '900px'}}> {/* ✅ 최소 크기 보장 */}
        <Navbar
            expand="lg"
            style={{
            width: '100%',         // ✅ 반응형
            height: '70px',        // ✅ 고정 높이
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center'
            }}
        >
            <Container fluid className="d-flex align-items-center justify-content-between h-100 p-0">
            {/* 왼쪽: 날씨 */}
            <div className="d-flex align-items-center">
                <Weather />
            </div>

            {/* 가운데: 브랜드 */}
            <div
                className="text-center position-absolute start-50 translate-middle-x"
                style={{ fontSize: '20px', fontWeight: 'bold' }}
            >
                서울 페스타 
            </div>

            {/* 오른쪽: 메뉴 (비워두거나 확장용) */}
            <div>
                <Navbar.Collapse id="basic-navbar-nav">
                {/* 오른쪽 메뉴 자리 */}
                </Navbar.Collapse>
            </div>
            </Container>
        </Navbar>
        </div>

        )
}
export function DetailedHeader(){

    return(
        <></>
    )
}