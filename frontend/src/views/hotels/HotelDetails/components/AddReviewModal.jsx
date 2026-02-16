import { useState } from "react";
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
} from "react-bootstrap";
import axios from "axios";

const AddReviewModal = ({ show, handleClose, propertyId, roomId, userId }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);



    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const updatedFiles = [...images, ...selectedFiles].slice(0, 5);
        setImages(updatedFiles);
    };

    const removeImage = (index) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("fromId", userId);
            formData.append("propertyId", propertyId);
            formData.append("roomId", roomId);
            formData.append("rating", rating);
            formData.append("feedback", feedback);

            images.forEach((img) => {
                formData.append("reviewImages", img);
            });

            await axios.post("http://localhost:5000/api/v1/customer/add-review", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            handleClose();
            setFeedback("");
            setImages([]);
            setRating(5);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Your Review</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4)</option>
                                <option value={3}>⭐⭐⭐ (3)</option>
                                <option value={2}>⭐⭐ (2)</option>
                                <option value={1}>⭐ (1)</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Write your experience..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label>Upload Images (Optional)</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Row className="mt-3">
                                {images.map((img, index) => (
                                    <Col xs={4} key={index} className="mb-3 text-center">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => removeImage(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                ))}
                            </Row>

                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddReviewModal;
