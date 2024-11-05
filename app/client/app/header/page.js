import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <div>
      <Image
        src="/plogo.jpeg" 
        width={100}
        height={10}
        alt="Paragon Logo"
        className='rounded-lg'
      />
    </div>
  );
};

export default Header;
