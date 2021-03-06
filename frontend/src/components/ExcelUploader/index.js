import React from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const getColor = props => {
  if (props.isDragActive) {
    return '#cfcfcf';
  }
  return '#eeeeee';
};

const Container = styled.div`
  background: #cfcfcf;
  padding: 10px;
  width: 100%;
  text-align: center;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  color: ${props => getColor(props)};
  outline: none;
  transition: border 0.24s ease-in-out;
  transition: color 0.24s ease-in-out;
  cursor: pointer;
`;

const ExcelUploader = ({ onDrop, title }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: '.xlsx' });

  return (
    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      <h3>{title}</h3>
    </Container>
  );
};

export default ExcelUploader;
