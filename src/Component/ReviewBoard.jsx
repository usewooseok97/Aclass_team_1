import { useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { Star } from "lucide-react";

function ReviewBoard({ initialReviews = [] }) {
    // 최신 리뷰 9개만 보이도록 설정 
    const [reviews, setReviews] = useState(
        initialReviews.slice(-9).map((text) => ({ text, isMine: false, rating: 0 }))
    );
    const [input, setInput] = useState("");
    const [rating, setRating] = useState(0);
    const [editingIdx, setEditingIdx] = useState(null); // 수정 중인 인덱스
    const [editInput, setEditInput] = useState("");     // 수정 입력값

    // 등록 버튼 핸들러
    const handleAddReview = () => {
        const trimmed = input.trim();
        if (!trimmed || rating === 0) return;
        const newReviews = [...reviews, { text: trimmed, isMine: true, rating }].slice(-9);
        setReviews(newReviews);
        setInput("");
        setRating(0);
    };

    // 삭제 버튼 핸들러
    const handleDelete = (idx) => {
        if (!reviews[idx].isMine) return;
        const newReviews = reviews.filter((_, i) => i !== idx);
        setReviews(newReviews);
    };

    // 수정 버튼 핸들러
    const handleSaveEdit = (idx) => {
        if (editInput.trim() === "") return;
        const updated = [...reviews];
        updated[idx].text = editInput.trim();
        setReviews(updated);
        setEditingIdx(null);
        setEditInput("");
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
                                backgroundColor: "#FFF066",
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

                            <Card.Body className="pt-4 px-2 d-flex flex-column justify-between"
                                style={{
                                    fontSize: "0.875rem",
                                    lineHeight: "1.4",
                                    overflow: "hidden",
                                    position: "relative",
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                }}>

                                {/* 내용 영역 (스크롤) ,내가 작성한 리뷰 별점 표시 */}
                                <div
                                    className="flex-grow-1 overflow-auto pe-2"
                                    style={{
                                        scrollbarWidth: "none",      // Firefox
                                        msOverflowStyle: "none",     // IE/Edge
                                    }}
                                >
                                    <Card.Text className="fw-bold mb-1"># {idx + 1}</Card.Text>

                                    {/* 수정 */}
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

                                    {review.rating > 0 && (
                                        <div className="mt-2 d-flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className="me-1"
                                                    fill={i < review.rating ? "#FFA500" : "none"}
                                                    color={i < review.rating ? "#FFA500" : "#ccc"}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 내가 작성한 리뷰 버튼 영역 */}
                                {review.isMine && (
                                    <div className="text-end mt-2 d-flex justify-content-end gap-1">
                                        {editingIdx === idx ? (
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
                                                        setEditingIdx(null);
                                                        setEditInput("");
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
                                                        setEditingIdx(idx);
                                                        setEditInput(review.text);
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

            {/* 하단 입력창 */}
            <div className="mt-5 d-flex justify-content-center">
                <Form
                    className="d-flex flex-column flex-sm-row flex-wrap align-items-center justify-content-center gap-2"
                    style={{ width: "100%" }}
                >
                    <Form.Control
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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
                                onClick={() => setRating(val)}
                                style={{ cursor: "pointer" }}
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