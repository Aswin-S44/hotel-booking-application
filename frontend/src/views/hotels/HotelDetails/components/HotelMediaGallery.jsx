import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NoImg from "@/assets/images/gallery/NoImage.jpg";


const HotelMediaGallery = ({ gallery }) => {

console.log(gallery);

    const images =
        gallery && gallery.length > 0
            ? gallery
            : [NoImg];

    // 1 Image
    if (images.length === 1) {
        return (
            <Container  style={{paddingBottom:"2.8rem"}}>
                <Row>
                    <Col>
                        <Card
                            className="overflow-hidden"
                            style={{
                                backgroundImage: `url(${images[0]})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: "400px",
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    // 2 Images
    if (images.length === 2) {
        return (
            <Container  style={{paddingBottom:"2.8rem"}}>
                <Row className="g-2">
                    {images.map((img, index) => (
                        <Col md={6} key={index}>
                            <Card
                                className="overflow-hidden"
                                style={{
                                    backgroundImage: `url(${img})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "400px",
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        );
    }

    // 3 or More Images
    return (
        <Container  style={{paddingBottom:"2.8rem"}}>
            <Row className="g-2">
                <Col md={6}>
                    <Card
                        className="overflow-hidden"
                        style={{
                            backgroundImage: `url(${images[0]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "400px",
                        }}
                    />
                </Col>

                <Col md={6}>
                    <Row className="g-2">
                        {images.slice(1, 3).map((img, index) => (
                            <Col xs={12} key={index}>
                                <Card
                                    className="overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        height: "195px",
                                    }}
                                />
                            </Col>
                        ))}

                        {images.length > 3 && (
                            <Col xs={12}>
                                <Card
                                    className="position-relative overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${images[3]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        height: "195px",
                                    }}
                                >
                                    <div className="bg-dark position-absolute w-100 h-100 opacity-50" />
                                    <div className="position-absolute top-50 start-50 translate-middle text-white">
                                        <h5>+{images.length - 3} More</h5>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default HotelMediaGallery;
