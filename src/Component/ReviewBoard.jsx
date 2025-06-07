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
        const review = reviews[idx];
        if (!review.isMine) return;
        const newReviews = reviews.filter((_, i) => i !== idx);
        setReviews(newReviews);
    };

    return (
        <Container className="my-4">
            {/* 3x3으로만 보이도록 설정 */}
            <Row xs={1} sm={2} md={3} className="g-3 justify-content-center">
                {reviews.map((review, idx) => (
                    <Col key={idx}>
                        <Card
                            style={{
                                backgroundColor: "#FFF066",
                                border: "none",
                                minHeight: "140px",
                                boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                                borderRadius: "5px",
                                position: "relative",
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

                            <Card.Body className="pt-4 px-2">
                                <Card.Text className="fw-bold mb-1"># {idx + 1}</Card.Text>
                                <Card.Text className="small">{review.text}</Card.Text>

                                {review.rating > 0 && (
                                    <div className="mt-2">
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
                                )} {/* 내가 작성한 리뷰 별점 표시 */}

                                {review.isMine && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(idx)}
                                        style={{ position: "absolute", bottom: "8px", right: "8px" }}
                                    >
                                        삭제
                                    </Button>
                                )} {/* 내가 작성한 리뷰 삭제버튼 */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 하단 입력창 */}
            <div className="mt-5 d-flex justify-content-center">
                <Form
                    className="d-flex flex-wrap align-items-center gap-2 justify-content-center"
                    style={{ width: "100%" }}
                >
                    <Form.Control
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="짧은 후기를 남겨보세요."
                        style={{ maxWidth: 250 }}
                    />

                    <div className="d-flex align-items-center gap-1">
                        <span className="me-1">평점:</span>
                        {[1, 2, 3, 4, 5].map((val) => (
                            <Star
                                key={val}
                                size={20}
                                fill={val <= rating ? "#FFA500" : "none"}
                                color={val <= rating ? "#FFA500" : "#ccc"}
                                onClick={() => setRating(val)}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                        <span className="text-muted small ms-2">{rating}점</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <Button variant="warning" onClick={handleAddReview}>
                            등록
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default ReviewBoard;