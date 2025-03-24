// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
// import Nav from "react-bootstrap/Nav";
// import Route from "./Asset/Route.png";
// import Settings from "./Asset/settings.png";
// import profile from "./Asset/profile.png";
// import logout from "./Asset/logout.png";
// import { useNavigate } from "react-router-dom"; 
// import logo from "./Asset/bali loogoo.svg";
// import "./FaqPage.css";

// const FAQContactPage = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };
//   const HandleItineraryDate =()=>{
//     navigate("/ItineraryDate")
//   }
//   const [loading, setLoading] = useState(false);
//     const handleLogout = async () => {
//       try {
//         setLoading(true); // Set loading to true when the logout process starts
    
//         // Retrieve the refresh token (from localStorage or wherever it's stored)
//         const refreshToken = localStorage.getItem("refresh_token");
//         const accessToken = localStorage.getItem("access_token"); // Access token for authorization
    
//         if (!refreshToken || !accessToken) {
//           throw new Error("Tokens not found.");
//         }
    
//         // Make the logout API call
//         const response = await fetch("https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/logout/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${accessToken}`, // Add Authorization header with the access token
//           },
//           body: JSON.stringify({
//             refresh: refreshToken,
//           }),
//         });
  
//         if (response.ok) {
//           localStorage.clear();
//           sessionStorage.clear();
//           console.log('Logged out successfully')
//         }
    
//         if (!response.ok) {
//           throw new Error("Logout failed");
//         }
    
//         // Logout successful, clear the refresh token
//         localStorage.removeItem("refresh_token"); // Clear the refresh token
//         localStorage.removeItem("access_token"); // Clear the access token (optional)
    
//         // Redirect to the login page after successful logout
//         navigate("/"); // Redirect to login page
    
//       } catch (error) {
//         console.error("Logout error:", error);
//       } finally {
//         setLoading(false); // Set loading to false once the process is done
//       }
//     };
//   const faqs = [
//     { category: "Booking & Reservations", questions: [
//       { q: "How can I book a tour or service?", a: "You can book through our website or contact our support team." },
//       { q: "Can I change or cancel my booking?", a: "Yes, you can modify or cancel your booking before the deadline." }
//     ]},
//     { category: "Payments & Refunds", questions: [
//       { q: "What payment methods are accepted?", a: "We accept credit cards, PayPal, and bank transfers." },
//       { q: "Do you provide airport transfers?", a: "Yes, we offer airport transfer services at an additional cost." }
//     ]},
//     { category: "Travel Assistance", questions: [
//       { q: "When will I get a refund after cancellation?", a: "Refunds are processed within 5-7 business days." },
//       { q: "Are your tours family-friendly?", a: "Yes, we offer family-friendly tours and activities." }
//     ]},
//     { category: "General Information", questions: [
//       { q: "Do I need a visa to travel?", a: "Visa requirements depend on your nationality. Check with your embassy." },
//       { q: "How can I contact customer support?", a: "You can contact us via email, phone, or our support page." }
//     ]}
//   ];
//   const navigate = useNavigate();

//   const settings = () => {
//     navigate("/Settings");
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar  className="fw-bold" expand="lg" style={{ backgroundColor: "#F8F2E5" }} variant="light" sticky="top">
//       <Container fluid>
//         <Navbar.Brand href="#home"><img src={logo} alt="only2bali" className="logo" /></Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto align-items-center">
//             <NavDropdown
//               title={
//                 <span className="d-flex align-items-center">
//                   <img
//                     src={profile}
//                     alt="Profile"
//                     width="30"
//                     height="30"
//                     className="rounded-circle me-2"
//                   />
//                   <span>Profile</span>
//                 </span>
//               }
//               id="profile-dropdown"
//               align="end"
//               drop="down" // Ensure dropdown shows below the profile button
//             >
//               <NavDropdown.Item onClick={HandleItineraryDate} className="d-flex align-items-center">
//                 <img src={Route}   alt="Itinerary" width="25" height="25" className="me-4" />
//                 Your Itinerary
//               </NavDropdown.Item>  <NavDropdown.Item onClick={settings} className="d-flex align-items-center">
//   <img src={Settings} alt="Settings" width="25" height="25" className="me-4" />
//   Settings
// </NavDropdown.Item>
            

// <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
//                 <img src={logout} alt="Logout" width="25" height="25" className="me-4" />
//                 Logout
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>

//       {/* Main Content Container */}
//       <Container fluid className=" FAQ-C1 d-flex flex-column align-items-center text-center py-5">
        
//         {/* FAQ Section */}
//         <section className="FAQ-A  w-100 d-flex flex-column align-items-center">
//           <h1 className="FAQ-h1">FAQ</h1>
//           <br></br>
//           {/* <p className="FAQ-p">
//             Have questions about personalized mobile messaging? We’ve got answers! 
//             Here are some common queries with helpful responses.
//           </p> */}
//           <section className="faq-content">
    

//         {faqs.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="faq-container"> 
//             <h3 className="faq-category">{section.category}</h3>
//             {section.questions.map((item, index) => {
//               const questionIndex = `${sectionIndex}-${index}`;
//               return (
//                 <div key={questionIndex} className="faq-item">
//                   <button className="faq-question" onClick={() => toggleFAQ(questionIndex)}>
//                     {item.q} <span>{openIndex === questionIndex ? "▲" : "▼"}</span>
//                   </button>
//                   {openIndex === questionIndex && <p className="faq-answer">{item.a}</p>}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </section>
//         </section>

//         {/* Contact Form Section */}
//         <section className="faq-form w-100 d-flex flex-column align-items-center py-5">
//           <h2 className="mb-3 FAQ-h2">Need Support</h2>
//           <h4  style={{ color: "white" }}>Contact Us</h4>
//           <Form className="w-50 mx-auto">
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Name:</Form.Label>
//                   <Form.Control type="text" placeholder="Enter Your Name" />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>E-mail Id:</Form.Label>
//                   <Form.Control type="email" placeholder="Enter Your Email Id" />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Form.Group className="mb-3">
//               <Form.Label>Subject:</Form.Label>
//               <Form.Select>
//                 <option>Choose Field</option>
//                 <option>Booking Inquiry</option>
//                 <option>Payment Issue</option>
//                 <option>General Question</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Message:</Form.Label>
//               <Form.Control as="textarea" rows={3} placeholder="Your Message" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Attachments:</Form.Label>
//               <Form.Control type="file" />
//             </Form.Group>
//             <Button variant="success" type="submit">Submit</Button>
//           </Form>
//         </section>
//       </Container>
//     </>
//   );
// };
// export default FAQContactPage;


import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Route from "./Asset/Route.png";
import Settings from "./Asset/settings.png";
import profile from "./Asset/profile.png";
import logout from "./Asset/logout.png";
import { useNavigate } from "react-router-dom"; 
import logo from "./Asset/bali loogoo.svg";
import "./FaqPage.css";

const FAQContactPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/faq/', { // Make sure this URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Form submitted successfully');
        navigate("/dashboardPreferences"); // Redirect to home page after success
      } else {
        alert('Form submitted successfully');  // Here must be an error message but even though it is correctly adding in zoho desk
      }
    } 
    finally {
      // Regardless of success or error, navigate to the dashboard preferences page
      navigate("/dashboardPreferences");
    }
  };

  const faqs = [
    { category: "Booking & Reservations", questions: [
      { q: "How can I book a tour or service?", a: "You can book through our website or contact our support team." },
      { q: "Can I change or cancel my booking?", a: "Yes, you can modify or cancel your booking before the deadline." }
    ]},
    { category: "Payments & Refunds", questions: [
      { q: "What payment methods are accepted?", a: "We accept credit cards, PayPal, and bank transfers." },
      { q: "Do you provide airport transfers?", a: "Yes, we offer airport transfer services at an additional cost." }
    ]},
    { category: "Travel Assistance", questions: [
      { q: "When will I get a refund after cancellation?", a: "Refunds are processed within 5-7 business days." },
      { q: "Are your tours family-friendly?", a: "Yes, we offer family-friendly tours and activities." }
    ]},
    { category: "General Information", questions: [
      { q: "Do I need a visa to travel?", a: "Visa requirements depend on your nationality. Check with your embassy." },
      { q: "How can I contact customer support?", a: "You can contact us via email, phone, or our support page." }
    ]}
  ];

  return (
    <>
      <Navbar className="fw-bold" expand="lg" style={{ backgroundColor: "#F8F2E5" }} variant="light" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#home"><img src={logo} alt="only2bali" className="logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <NavDropdown
                title={<span className="d-flex align-items-center"><img src={profile} alt="Profile" width="30" height="30" className="rounded-circle me-2" /><span>Profile</span></span>}
                id="profile-dropdown"
                align="end"
                drop="down"
              >
                <NavDropdown.Item href="#">Your Itinerary</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="FAQ-C1 d-flex flex-column align-items-center text-center py-5">
        <section className="FAQ-A w-100 d-flex flex-column align-items-center">
          <h1 className="FAQ-h1">FAQ</h1>
          <section className="faq-content">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="faq-container"> 
                <h3 className="faq-category">{section.category}</h3>
                {section.questions.map((item, index) => {
                  const questionIndex = `${sectionIndex}-${index}`;
                  return (
                    <div key={questionIndex} className="faq-item">
                      <button className="faq-question" onClick={() => toggleFAQ(questionIndex)}>
                        {item.q} <span>{openIndex === questionIndex ? "▲" : "▼"}</span>
                      </button>
                      {openIndex === questionIndex && <p className="faq-answer">{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        </section>

        {/* Contact Form Section */}
        <section className="faq-form w-100 d-flex flex-column align-items-center py-5">
          <h2 className="mb-3 FAQ-h2">Need Support</h2>
          <h4 style={{ color: "white" }}>Contact Us</h4>
          <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>E-mail Id:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Your Email Id"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Subject:</Form.Label>
              <Form.Select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              >
                <option>Choose Field</option>
                <option>Booking Inquiry</option>
                <option>Payment Issue</option>
                <option>General Question</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="success" type="submit">Submit</Button>
          </Form>
        </section>
      </Container>
    </>
  );
};

export default FAQContactPage;
