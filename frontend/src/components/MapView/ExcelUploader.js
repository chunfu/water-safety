import React, { useCallback } from 'react';
import * as xlsx from 'xlsx';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const excel2json = (data) => {
  const workbook = xlsx.read(data, { type: 'buffer' });
  const sheets = workbook.SheetNames;
  const sheetsData = sheets.reduce((acc, sheet) => {
    const ws = workbook.Sheets[sheet];
    return {
      ...acc,
      [sheet]: xlsx.utils.sheet_to_json(ws, { raw: false }),
    };
  }, {});

  return sheetsData;
}

const getColor = props => {
  if (props.isDragActive) {
    return '#cfcfcf';
  }
  return '#eeeeee';
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  padding: 20px;
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

const ExcelUploader = ({ onDropFile }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      // Do something with the files
      acceptedFiles.forEach(file => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          const sheetsData = excel2json(binaryStr);
          onDropFile(sheetsData);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [onDropFile],
  );
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
      <h3>拖拉上傳歷年資料</h3>
    </Container>
  );
};

export default ExcelUploader;
