import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBarIndex from "../Layouts/NavBar/NavBarIndex";
import Background from "../Layouts/Background";
import Login from "./Login";
import Register from "./Register";
import Logo from "../../assets/logo.jpg";
import BackgroundImg1 from "../../assets/LogInBackground (1).png";
import BackgroundImg2 from "../../assets/LogInBackground (2).png";
import TextLogo from "../../assets/TextLogo.png";
import TransparentLogo from "../../assets/TransparentLogo.png";
import sampleImage from "../../assets/Background.jpg";
import overlay from "../../assets/OverlayBackground.jpg";
import { PreLoader } from "./PreLoader";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import { over } from "lodash";
// import ExampleCarouselImage from "components/ExampleCarouselImage";

const IndexPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get("http://localhost:8081/announcement");

        if (response.status === 200) {
          setLatestAnnouncement(response.data);
        } else {
          console.error("No announcement found");
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleLoginClick = () => {
    if (!isLoginPage) {
      setFadeIn(false);
      setTimeout(() => {
        setIsLoginPage(true);
        setFadeIn(true);
      }, 200);
    }
  };

  const handleRegisterClick = () => {
    if (isLoginPage) {
      setFadeIn(false);
      setTimeout(() => {
        setIsLoginPage(false);
        setFadeIn(true);
      }, 200); // duration of the fade-out animation
    }
  };
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <PreLoader></PreLoader>

      <div className=" vh-100">
        <NavBarIndex></NavBarIndex>

        <div
          className="mt-4 d-flex flex-column gap-5"
          style={{ height: "100dvh" }}
        >
          {/* CAROUSEL */}
          <div className="mt-5">
            <Carousel activeIndex={index} onSelect={handleSelect}>
              <Carousel.Item>
                <div className="carouselBlackFade"></div>
                <img src={sampleImage} alt="" />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>
                    Nulla vitae elit libero, a pharetra augue mollis interdum.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <div className="carouselBlackFade"></div>
                <img src={sampleImage} alt="" />
                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <div className="carouselBlackFade"></div>
                <img src={sampleImage} alt="" />
                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>

          {/* EVENTS AND ANNOUNCEMENTS */}
          <div
            className="mx-4 p-4 d-flex flex-column gap-3 rounded shadow-sm"
            style={{ backgroundColor: "white" }}
          >
            <div
              className="rounded text-light py-3"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <h2 className="m-0">Events/Announcements</h2>
            </div>
            <div className="row gap-2">
              <div
                className="col-lg d-flex align-items-center"
                style={{ minHeight: "clamp(20rem, 50dvw, 30rem)" }}
              >
                <img
                  className="rounded"
                  src={sampleImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="col-lg d-flex flex-column align-items-center justify-content-center gap-2">
                <h4
                  className="m-0 px-2"
                  // style={{ borderBottom: ".2rem solid var(--primary)" }}
                >
                  Sample Title Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Commodi assumenda quidem velit corporis ex
                  rem eaque illo ipsum placeat? Iure?
                </h4>
                <p className="m-0 text-secondary">
                  Sample Description. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Quaerat itaque, reiciendis adipisci
                  doloremque sit iste. Harum vero sunt ab facilis. Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. In voluptates
                  enim earum, reiciendis quis obcaecati amet cumque id delectus
                  nemo totam porro dolorem, nam est? Officia fugit, quidem
                  officiis sit, nihil at, sed exercitationem autem est
                  laboriosam qui ab minus.
                </p>
              </div>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="row gap-2 mx-4 rounded">
            <div
              className="col-md rounded text-light py-3 shadow-sm"
              style={{ background: "var(--primary)" }}
            >
              <h1 className="m-0">00</h1>
              <h5 className="m-0">Users</h5>
            </div>
            <div
              className="col-md rounded text-light py-3 shadow-sm"
              style={{ background: "var(--primary)" }}
            >
              <h1 className="m-0">00</h1>
              <h5 className="m-0">Posted Diaries</h5>
            </div>
            <div
              className="col-md rounded text-light py-3 shadow-sm"
              style={{ background: "var(--primary)" }}
            >
              <h1 className="m-0">00</h1>
              <h5 className="m-0">Resolved Cases</h5>
            </div>
          </div>

          {/* MISSION AND VISION */}
          <div className="mx-4 px-2 rounded">
            <div className="row gap-2 px-1">
              <div
                className="col-md p-4 rounded shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <h1
                  className="m-0 mb-3 pb-3 fw-bolder"
                  style={{
                    borderBottom: ".2rem solid var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  Mission
                </h1>
                <h5 className="m-0 fw-bold text-secondary">
                  A gender responsive educational institution where stakeholders
                  enjoy equal responsibilities and opportunities.
                </h5>
              </div>
              <div
                className="col-md p-4 rounded shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <h1
                  className="m-0 mb-3 pb-3 fw-bolder"
                  style={{
                    borderBottom: ".2rem solid var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  Vision
                </h1>
                <h5 className="m-0 fw-bold text-secondary">
                  CvSU–GAD Resource Center shall integrate and advocate gender
                  equity and equality principles and perspectives in providing
                  instruction, research and extension services.
                </h5>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div
            className="mx-4 rounded p-5 shadow-sm"
            style={{ backgroundColor: "white" }}
          >
            <div className="d-flex flex-column gap-4">
              <h1
                className="m-0 d-flex align-items-center gap-1 text-start text-light py-3 px-3 rounded"
                style={{ backgroundColor: "var(--secondary)" }}
              >
                <i class="bx bx-info-circle"></i>
                About
              </h1>
              <h4
                className="m-0 mx-3 text-secondary text-start fw-lighter"
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                The SIKAT eDiary is designed to address critical issues faced by
                stakeholders at CvSU-CCAT, especially those affected by Republic
                Act 9262 (The Violence Against Women and Children Act). This
                online diary provides a secure platform where victims can:
                <ol className="my-4">
                  <li>Share their experiences safely.</li>
                  <li>Seek help and support.</li>
                  <li>Connect with support communities.</li>
                </ol>
                By leveraging the internet's wide reach and anonymity, the SIKAT
                eDiary empowers victims to express themselves freely and access
                essential resources and assistance. Ultimately, the project aims
                to build a safer and more supportive community.
              </h4>
            </div>
          </div>

          {/* FOOTER */}
          <div>
            <div
              style={{
                minHeight: "15rem",
                backgroundColor: "#0f001a",
              }}
            >
              <div className="row p-5 text-light" style={{ height: "100%" }}>
                <div className="col-md-3 d-flex align-items-center">
                  <img
                    src={TextLogo}
                    alt=""
                    style={{
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-md">
                  <div className="row ps-5 pt-4 text-start">
                    <div className="col-md">
                      <h5
                        className="m-0 pb-3 mb-4"
                        style={{ borderBottom: ".1rem solid var(--secondary)" }}
                      >
                        CONTACTS
                      </h5>
                      <p>EMAIL: gadccat@cvsu-rosario.edu.ph</p>
                    </div>
                    <div className="col-md">
                      <h5
                        className="m-0 pb-3 mb-4"
                        style={{ borderBottom: ".1rem solid var(--secondary)" }}
                      >
                        SOCIALS
                      </h5>
                      <p>
                        FB:{" "}
                        <a
                          className="text-decoration-none text-light"
                          href="https://www.facebook.com/gadccat"
                        >
                          CvSU - CCAT Gender and Development
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-top border-light py-3 text-light">
                <p className="m-0">Copyright © 2024 | All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
        <Background>
          <div className="vh-100 position-sticky" style={{ opacity: ".08" }}>
            <img
              src={overlay}
              alt=""
              style={{ height: "100% ", width: "100%", objectFit: "cover" }}
            />
          </div>
        </Background>
      </div>
    </>
  );
};

export default IndexPage;
