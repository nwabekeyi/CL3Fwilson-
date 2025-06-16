import React from "react";
import FixedBackgroundLayout from "../../layouts/FixedBackgroundLayout";
import SectionContent from "../../components/SectionContent.jsx";
import mensBg from "../../assets/images/menEffect1.jpg";
import mensBg2 from "../../assets/images/menEffect2.jpg"; // Replace with actual image path
import womensBg1 from "../../assets/images/womenEffect1.png"; // Replace with actual image path
import womensBg2 from "../../assets/images/womenEffect2.jpg"; // Replace with actual image path

// Men's Section (Additional)
const MensSectionTwo = () => {
  return (
    <FixedBackgroundLayout backgroundImage={mensBg2}>
      <SectionContent
        heading={
          <>
            THE<br />
            SARTORIAL<br />
            CODE
          </>
        }
        linkTo="/mensProduct"
        buttonText="Shop now"
      />
    </FixedBackgroundLayout>
  );
};

// Women's Section 1
const WomensSectionOne = () => {
  return (
    <FixedBackgroundLayout backgroundImage={womensBg1}>
      <SectionContent
        heading="Chateau by Dusk(Wilster)"
        linkTo="/wilster"
        buttonText="Coming soon"
      />
    </FixedBackgroundLayout>
  );
};

// Women's Section 2
const WomensSectionTwo = () => {
  return (
    <FixedBackgroundLayout backgroundImage={womensBg2}>
      <SectionContent
        heading="Discover Timeless Beauty(By Wilster)"
        linkTo="/wilster"
        buttonText="Coming soon"
      />
    </FixedBackgroundLayout>
  );
};

// Original Men's Section
const MensSection = () => {
  return (
    <FixedBackgroundLayout backgroundImage={mensBg}>
      <SectionContent
        heading="Clavis Identitatis Tuae"
        linkTo="/mensProduct"
        buttonText="Shop Now"
      />
    </FixedBackgroundLayout>
  );
};

export {
  MensSection,
  MensSectionTwo,
  WomensSectionOne,
  WomensSectionTwo
};
