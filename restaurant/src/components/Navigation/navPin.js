import React from "react";
import Link from "next/link";
import Image from 'next/image';

const NavbarPin = ({ children, image, label, path }) => {
  return (
    <Link href={path}>
      <div className="mt-5 relative">
        <div className="bg-gray-400 block h-8 w-0.5 absolute left-1/2 top-[-1rem] z-10 transform rotate-15 origin-bottom-center"></div>
        <div className="bg-red-700 rounded-full h-3 w-3 absolute left-[calc(50%_+_0.375rem)] top-[-1.375rem] z-20"></div>
        <blockquote className="text-gray-800 relative  h-auto m-auto mb-1 p-5 font-sans text-lg shadow-[0_10px_10px_2px_rgba(0,0,0,0.3)] bg-yellow-200 transform rotate-2 overflow-hidden whitespace-normal leading-3 flex flex-col items-center justify-center">
          <Image src={image} alt="Table Icon" width={80} height={70} />
          {children}
        </blockquote>
      </div>
    </Link>
  );
};

export default NavbarPin;
