import React, {useContext} from "react";
import { WhiteLabelContext } from "../context/WhiteLabelContext";


const AboutUs = () => {
  const { WhiteLabelBrandName } = useContext(WhiteLabelContext);
  return (
    <div className="rounded-md">
      <div className="flex justify-center py-3 bg-skin-nav border-b border-gray-900">
        <h2 className="text-skin-white font-bold">About Us</h2>
        <hr className="text-grey" />
      </div>
      <div className=" text-skin-white bg-skin-nav text-lg px-4 py-4">
        <p className="mt-2 ">
          {WhiteLabelBrandName} is a sports betting exchange community, driven by cutting
          edge technology and a focus on offering value back to our customers.
        </p>
        <p className="py-2">
          We actively encourage our thinking to be focused on innovation so we
          can constantly improve and enhance our product. Our goal is to provide
          a best-in-class platform so our users can have the ultimate online
          gaming experience.
        </p>
        <p className="py-2">
          We want to grow our community by focusing on our liquidity, one market
          and sport at a time. To do this, we ensure we have critical mass along
          with the best price and liquidity offering in the industry, before we
          add any further markets.
        </p>
        <p className="py-2">
          We are resolutely committed to low margin, high volume betting and we
          aim to continue to disrupt the market with a focus on quality
          liquidity for the customer.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
