import React from "react";
import FixedBackgroundLayout from "../../layouts/FixedBackgroundLayout";
import SectionContent from "../../components/SectionContent.jsx";
import mensBg from "../../assets/images/first-men.png";
// import mensBg2 from "../../assets/images/second-men.png"; // Replace with actual image path
import womensBg1 from "../../assets/images/women1.png"; // Replace with actual image path
// import womensBg2 from "../../assets/images/second-women.png"; // Replace with actual image path

// // Men's Section (Additional)
// const MensSectionTwo = () => {
//   return (
//     <FixedBackgroundLayout backgroundImage={mensBg2}>
//       <SectionContent
//         heading="Elevate Your Style"
//         linkTo="/shop/men"
//         buttonText="Explore Men's Collection"
//       />
//     </FixedBackgroundLayout>
//   );
// };

// Women's Section 1
const WomensSectionOne = () => {
  return (
    <FixedBackgroundLayout backgroundImage={womensBg1}>
      <SectionContent
        heading="Chateau by Dusk(Wilster)"
        linkTo="/shop/women"
        buttonText="Coming soon"
      />
    </FixedBackgroundLayout>
  );
};

// // Women's Section 2
// const WomensSectionTwo = () => {
//   return (
//     <FixedBackgroundLayout backgroundImage={womensBg2}>
//       <SectionContent
//         heading="Discover Timeless Beauty"
//         linkTo="/shop/women"
//         buttonText="Browse Now"
//       />
//     </FixedBackgroundLayout>
//   );
// };

// Original Men's Section
const MensSection = () => {
  return (
    <FixedBackgroundLayout backgroundImage={mensBg}>
      <SectionContent
        heading="Clavis Identitatis Tuae"
        linkTo="/shop/men"
        buttonText="Shop Now"
      />
    </FixedBackgroundLayout>
  );
};

export { 
  MensSection, 
  // MensSectionTwo, 
  WomensSectionOne, 
  // WomensSectionTwo 
};