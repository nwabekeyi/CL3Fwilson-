import React from "react";
import PropTypes from "prop-types";
import DEALOFWEEK from "../../assets/images/advertBg.jpeg";

const Advertisement = () => {
  return (
    <div className="deal_ofthe_week">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="deal_ofthe_week_img" data-aos="fade-up">
              <img src={DEALOFWEEK} alt="Deal of the Week" />
            </div>
          </div>
          <div className="col-lg-6 text-right deal_ofthe_week_col">
            <div className="deal_ofthe_week_content d-flex flex-column align-items-center float-right" data-aos="fade-up">
              <div className="section_title">
                <h2>Ready to Deliver</h2>
              </div>
              <div className="red_button deal_ofthe_week_button">
                <a href="#">shop now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Advertisement.propTypes = {};

export default Advertisement;
