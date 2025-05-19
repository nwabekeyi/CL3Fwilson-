import React, { useState } from "react";
import Banner1 from "../../assets/images/banner_1.jpg";
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
      category: "Fashion Store",
      questions: [
        {
          question: "How do I choose the right size for clothing?",
          answer:
            "Our sizing chart is available on each product page. Measure your chest, waist, and hips, and compare them to our guide. For tailored fits, consider one size up for comfort. If you’re unsure, contact our support team at support@menstyle.com.",
        },
        {
          question: "What is your shipping policy?",
          answer:
            "We offer free standard shipping on orders over $50 within Nigeria. Orders are processed within 1-2 business days and delivered in 3-7 days. International shipping is available; rates vary by location. Check our Shipping page for details.",
        },
        {
          question: "Can I return or exchange an item?",
          answer:
            "Yes, we accept returns within 30 days of delivery if the item is unworn and in original condition. Exchanges are free within Nigeria. Start a return via your account or email support@menstyle.com. See our Returns page for more.",
        },
        {
          question: "Do you offer custom tailoring services?",
          answer:
            "Currently, we offer standard sizes, but we’re launching a custom tailoring service in 2026. Sign up for our newsletter to stay updated on this feature!",
        },
      ],
    },
    {
      category: "Pageant Voting",
      questions: [
        {
          question: "How can I vote for a pageant contestant?",
          answer:
            "Visit the 'Vote for Your Candidate' page under the Workshop menu. Log in or create an account, browse contestant profiles, and cast your vote. Each user gets one vote per day during the voting period.",
        },
        {
          question: "Who is eligible to participate in the pageant?",
          answer:
            "The pageant is open to men aged 18-35 who are registered on our platform. Contestants must submit a profile with photos and a bio. Registration is free and available on the 'Register' page under Workshop.",
        },
        {
          question: "When are the pageant results announced?",
          answer:
            "Voting closes on the last day of each month, and results are announced within 7 days on our website and social media. Winners receive exclusive fashion prizes and feature in our campaigns.",
        },
        {
          question: "Can I vote multiple times for the same contestant?",
          answer:
            "You can vote once per day for your favorite contestant. Multiple votes in a single day are not allowed to ensure fairness. Follow us on social media for voting reminders!",
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