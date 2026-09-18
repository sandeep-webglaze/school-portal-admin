import React, { useState, useCallback } from 'react';

const useDialog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const [msg, setMsg] = useState({ active: false, severity: '', msg: '' });

  return { handleClose, handleOpen, open, setOpen, msg, setMsg };
};

export default useDialog;
