import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import CodeBlock from './CodeBlock';

function ExampleModal({ code, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} center>
      <CodeBlock language={'javascript'} filename={'foo.js'} value={code} />
    </Modal>
  );
}

export default ExampleModal;
