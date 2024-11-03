import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <div>
      <Image
        src="/logo.jpg" 
        width={150}
        height={50}
        alt="Paragon Logo"
      />
    </div>
  );
};

export default Header;
