import { useEffect, useRef, useState } from "react";
import { Card, Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { Star } from "lucide-react";
import { RatingStars } from "./RatingStars";

// 리뷰 게시판 컴포넌트
function ReviewBoard({ initialReviews = [] }) {
    // 초기값 -> props로 가져온 리뷰 리스트 + 최대 9개만 보이도록 설정
    const [reviews, setReviews] = useState(
        initialReviews.slice(-9).map((text) => ({ text, isMine: false, rating: 0 }))
    );
    const [input, setInput] = useState("");
    const [rating, setRating] = useState(0);

    const [editingIdx, setEditingIdx] = useState(null); // 현재 수정 중인 리뷰 인덱스
    const [editInput, setEditInput] = useState("");     // 수정 입력 값(텍스트)

    const [alertMsg, setAlertMsg] = useState("");      // 알림 메세지
    const [showAlert, setShowAlert] = useState(false); // alert 창 출력 여부

    const inputRef = useRef(null); // 리뷰 입력창에 포커싱 설정을 위한 ref

    // alert이 보이게 되면 동작 -> 5초 뒤 자동 숨김처리
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // 리뷰 등록 버튼 핸들러
    const handleAddReview = () => {
        const trimmed = input.trim();           // 입력값에서 앞뒤 공백 제거

        if (!trimmed || rating === 0) { // 내용이 없는(공백) 경우 || 별점이 없는 경우 등록 X
            setAlertMsg(!trimmed ? "리뷰 내용을 입력해주세요!" : "별점을 선택해주세요! (별점은 수정 불가입니다.)");
            setShowAlert(true);
            return;
        }

        // 기존 리뷰 + 새로운 리뷰 객체 생성하여 추가 {}, 최신 9개만 보이도록 설정 {내용,본인작성여부,별점}
        const newReviews = [...reviews, { text: trimmed, isMine: true, rating }].slice(-9);

        setReviews(newReviews);  // 새로운 리뷰 리스트 setting
        setInput("");            // 입력 필드 초기화
        setRating(0);            // 평점 초기화
        setShowAlert(false);     // 등록 버튼 눌러도 alert창 숨김처리
    };


    // 리뷰 삭제 버튼 핸들러
    const handleDelete = (idx) => {
        if (!reviews[idx].isMine) return; // 내가 쓴 리뷰만 삭제 가능
        // 해당하는 idx 제외하고 새로운 리스트 생성
        const newReviews = reviews.filter((_, i) => i !== idx);
        setReviews(newReviews);
    };


    // 리뷰 수정저장 버튼 핸들러
    const handleSaveEdit = (idx) => {

        // 수정 필드 입력값 공백 제거 후 빈 값이면 저장하지 않음
        if (editInput.trim() === "") return;

        // 기존 리뷰 updated에 저장하여 초기화
        const updated = [...reviews];

        // 있는 리뷰 리스트 중 현재 index의 값을 수정된 값으로 변경
        updated[idx].text = editInput.trim();

        setReviews(updated);
        setEditingIdx(null);  // 수정중이 아닌 상태로 변경 -> 삭제,수정 버튼 활성화
        setEditInput("");     // 저장후 수정 입력 필드의 값 초기화
    };


    return (
        <Container className="my-4">
            {/* 3x3으로만 보이도록 설정 */}
            <Row className="g-3 justify-content-center">
                {reviews.map((review, idx) => (
                    <Col key={idx}
                        style={{
                            flex: '0 0 auto',
                            width: 'calc(100% / 3 - 1rem)', // 정확히 3열로 고정 (gap 고려)
                            maxWidth: '300px',
                        }}>
                        <Card
                            style={{
                                backgroundColor: "rgb(247, 220, 104)",
                                border: "none",
                                minHeight: "140px",
                                maxHeight: "200px",
                                boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                                borderRadius: "5px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            className="p-2"
                        >
                            {/* 카드 상단 장식 css */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "6px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "#f6f3e9",
                                    width: "40px",
                                    height: "10px",
                                    borderRadius: "2px",
                                    zIndex: 2,
                                }}
                            ></div>

                            {/* 카드 내부 내용 */}
                            <Card.Body className="pt-4 px-2 d-flex flex-column justify-between"
                                style={{
                                    fontSize: "0.875rem",
                                    lineHeight: "1.4",
                                    overflow: "hidden",
                                    position: "relative",
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                }}>

                                {/* 내용 스크롤 부분분 */}
                                <div
                                    className="flex-grow-1 overflow-auto pe-2"
                                    style={{
                                        scrollbarWidth: "none",      // Firefox
                                        msOverflowStyle: "none",     // IE/Edge
                                    }}
                                >
                                    <Card.Text className="fw-bold mb-1"># {idx + 1}</Card.Text>

                                    {/* 수정중일 경우 입력창 표시 아니면 리뷰 글 보여주기 */}
                                    {editingIdx === idx ? (
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            value={editInput}
                                            onChange={(e) => setEditInput(e.target.value)}
                                            className="mb-2"
                                        />
                                    ) : (
                                        <Card.Text>{review.text}</Card.Text>
                                    )}

                                    {/* 별점 설정 부분 */}
                                    {review.rating > 0 && (
                                        <div className="mt-2 d-flex">
                                            <RatingStars rating={review.rating}/>
                                        </div>
                                    )}
                                </div>

                                {/* 내가 작성한 리뷰 버튼 영역 */}
                                {review.isMine && (
                                    <div className="text-end mt-2 d-flex justify-content-end gap-1">
                                        {editingIdx === idx ? ( // 수정중일 경우 저장, 취소 버튼 표시 | 아닐경우 삭제, 수정 버튼 표시
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                    }}
                                                    onClick={() => handleSaveEdit(idx)}
                                                >
                                                    저장
                                                </Button>

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "1px 6px",
                                                        borderRadius: "4px",
                                                    }}
                                                    onClick={() => {
                                                        setEditingIdx(null); // 수정 상태 확인 state 초기화
                                                        setEditInput("");    // 수정 필드의 값 초기화
                                                    }}
                                                >
                                                    취소
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(idx)}
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "1px 4px",
                                                        backgroundColor: "#FFF066",
                                                        border: "1px solid red",
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        borderRadius: "4px",
                                                        lineHeight: "1.2",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#FFD4D4";
                                                        e.currentTarget.style.borderColor = "#cc0000";
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#FFF066";
                                                        e.currentTarget.style.borderColor = "red";
                                                    }}
                                                >
                                                    삭제
                                                </Button>

                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "1px 4px",
                                                        fontWeight: "bold",
                                                        borderRadius: "4px"
                                                    }}
                                                    onClick={() => {
                                                        setEditingIdx(idx);         // 수정 중으로 변경 -> 저장,취소 버튼 활성화
                                                        setEditInput(review.text);  // 수정 필드의 값을 리뷰의 텍스트로 변경 
                                                    }}
                                                >
                                                    수정
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* alter 메세지 보여주기 */}
            {showAlert && (
                <div className="d-flex justify-content-center mt-3">
                    <Alert
                        variant="danger"
                        className="border-0 rounded px-4 py-2 text-sm fw-semibold text-red-800 bg-red-100 shadow-sm"
                    >
                        {alertMsg}
                    </Alert>
                </div>
            )}

            {/* 하단 리뷰 등록 입력창 */}
            <div className="mt-2 d-flex justify-content-center">
                <Form
                    onSubmit={(e) => e.preventDefault()} // 기본 제출 막기 (엔터치면 새로고침되어 추가)
                    className="d-flex flex-column flex-sm-row flex-wrap align-items-center justify-content-center gap-2"
                    style={{ width: "100%" }}
                >
                    <Form.Control
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {     // 엔터 입력시에도 등록 되도록 설정
                                e.preventDefault();
                                handleAddReview();
                            }
                        }}
                        placeholder="짧은 후기를 남겨보세요."
                        className="w-auto"
                        style={{ maxWidth: 250 }}
                    />
                    <div className="d-flex align-items-center gap-2">
                        <span className="me-1">평점:</span>
                        {[1, 2, 3, 4, 5].map((val) => (
                            <Star
                                key={val}
                                size={18}
                                fill={val <= rating ? "#FFA500" : "none"}
                                color={val <= rating ? "#FFA500" : "#ccc"}
                                onClick={() => {
                                    setRating(val);
                                    inputRef.current?.focus();
                                }}
                                style={{ cursor: "pointer" }
                                }
                            />
                        ))}
                        <span className="text-muted small ms-2">{rating}점</span>
                    </div>

                    <Button variant="warning" onClick={handleAddReview}>
                        등록
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default ReviewBoard;