'use client';

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  modules: any;
  formats: string[];
  placeholder?: string;
  className?: string;
  forwardedRef?: any;
}

const QuillWrapper: React.FC<QuillWrapperProps> = ({ 
  value, 
  onChange, 
  modules, 
  formats, 
  placeholder, 
  className,
  forwardedRef 
}) => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return <div>Loading editor...</div>;
  }

  return (
    <ReactQuill
      ref={forwardedRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default QuillWrapper;