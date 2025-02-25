import React from 'react';

export function DropdownItem({ tag = 'button', onItemClick, children, className = '', ...props }) {
  const Component = tag;

  const handleClick = (e) => {
    if (onItemClick) {
      onItemClick(e);
    }
  };

  return (
    <Component onClick={handleClick} className={className} {...props}>
      {children}
    </Component>
  );
}