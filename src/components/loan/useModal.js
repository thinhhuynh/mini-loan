import React from 'react';

const useModal = () => {
  const [open, setOpen] = React.useState(false);


  function toggle() {
    setOpen(!open);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleCreate() {
    setOpen(false);
  
  }

  return {
    open,
    toggle,
    handleOpen,
    handleClose,
    handleCreate
  }
};

export default useModal;