import React, { useState } from "react";
import Banner1 from "../../assets/images/faq.png";
import { FaPlus, FaMinus } from "react-icons/fa"; // Icons for accordion toggle

function FAQPage() {
  // State to manage open/closed accordion sections
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  // FAQ data
  const faqs = [
    {
      category: "Shopping",
      questions: [
        {
          question: "Do You Ship Internationally?",
          answer:
            "Yes we do, through DHL",
        },
        {
          question: "How long does it take for home delivery?",
          answer:
            "Delivery dates on preorder will be any where between 7 days - 3 weeks depending on production and delivery timelines. Please speak with our consultants for more detailed assistance with delivery",
        },
      ],
    },
    {
      category: "Payment",
      questions: [
        {
          question: "What Payment Methods Are Accepted?",
          answer:
            "Paystack and stripe",
        },
        {
          question: "Can I use a different payment method?",
          answer:
            "No please",
        },
      ],
    },
    {
      category: "Workshop",
      questions: [
        {
          question: "How can I vote for a contestant?",
          answer:
            "Visit the 'Bootcamp' page under the Bootcamp menu  and cast your vote.",
        },
        {
          question: "Who is eligible to participate in the bootcamp?",
          answer:
            "The bootcamp is open to individuals aged 18-35 who are registered on our platform. Contestants must submit a profile with photos and a bio. Registration is free and available on the 'Register' page under bootcamp.",
        },
        {
          question: "Can I vote multiple times for the same contestant?",
          answer:
            "You can vote multiple times per day for your favorite contestant. Follow us on social media for voting reminders!",
        },
      ],
    },
  ];

  return (
    <div className="faq-page">
      {/* Fixed Background Banner */}
      <div
        className="faq-banner"
        style={{
          backgroundImage: `url(${Banner1})`,
        }}
      >
        <div className="faq-banner-overlay">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to your questions about our fashion store and pageant.</p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="container faq-container" data-aos="fade-up">
        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="faq-category">
            <h2 className="section_title">{category.category}</h2>
            <div className="faq-list">
              {category.questions.map((faq, qIndex) => {
                const index = `${catIndex}-${qIndex}`;
                const isOpen = openSection === index;
                return (
                  <div key={qIndex} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleSection(index)}
                    >
                      <h4>{faq.question}</h4>
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </div>
                    <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;