
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} مركز المسوقين الجزائري. كل الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
