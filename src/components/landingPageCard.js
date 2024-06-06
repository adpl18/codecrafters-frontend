import React from "react";

export default function LandingPageCard(props) {
  const { principalText, secondaryText, icon } = props;
  return (
    <div className="flex-col bg-white 2xl:h-96 lg:h-80 sm:h-72 2xl:w-96 lg:w-72 sm:w-56 drop-shadow-2xl rounded-2xl align-center justify-center">
      <img
        className="align-center justify-center mx-auto my-5 2xl:scale-100 lg:scale-75 sm:scale-50 "
        src={icon}
        alt="Input icon"
      />
      <div className="2xl:mx-8 lg:mx-4 sm:mx-2 2xl:my-8 lg:my-4 sm:my-2">
        <p className="2xl:my-4 lg:my-3 sm:my-2 2xl:text-3xl lg:text-2xl sm:text-xl text-black">
          {principalText}
        </p>
        <p className="2xl:my-4 lg:my-3 sm:my-2 2xl:text-2xl lg:text-xl sm:text-base">
          {secondaryText}
        </p>
      </div>
    </div>
  );
}