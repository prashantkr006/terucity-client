import React from "react";
import Image from "next/image";
export default function Header() {
  return (
    <header className="fixed top-0 flex justify-center items-center w-screen bg-gradient-to-l from-[#F8654D] to-[#EE8326]">
      <Image
        src="images/google.svg"
        alt="google"
        width={100}
        height={100}
        style={{height: 100, width: 100}}
        priority
      />
    </header>
  );
}
