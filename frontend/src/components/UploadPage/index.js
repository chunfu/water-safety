import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Box, Heading, Button, TextField, Label, Text } from 'gestalt';
import axios from 'axios';
import ExcelUploader from '../ExcelUploader';
import userManagement from '../../utils/userManagement';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const file2form = (name) => (file) => {
  let formData = new FormData();
  formData.append(name, file, `${name}.xlsx`);

  return formData;
};

const UploadPage = () => {
  const [filesInfo, setFilesInfo] = useState({});

  useEffect(() => {
    async function getFilesInfo() {
      const { data } = await axios.get('/api/files');
      setFilesInfo(data);
    }

    getFilesInfo();
  }, []);

  const onDropDrown = (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const formData = file2form('drown_events')(file);
      try {
        await axios.post('/api/county', formData);
        alert('上傳成功');
      } catch (e) {
        alert('上傳失敗');
      }
    });
  };

  const onDropPurpleRed = (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      try {
        const formData = file2form('purple_red')(file);
        await axios.post('/api/purpleRed', formData);
        alert('上傳成功');
      } catch (e) {
        alert('上傳失敗');
      }
    });
  };

  const { drownFile, purpleRedFile } = filesInfo;
  return (
    <>
      <Box margin={2}>
        <Link to="/">回首頁</Link>
      </Box>
      <Box
        display="flex"
        marginLeft="auto"
        marginRight="auto"
        marginBottom={0}
        marginTop={0}
        wrap
        width="100%"
        direction="column"
        maxWidth={800}
      >
        <Box flex="grow" paddingX={3} paddingY={3}>
          <Heading size="sm" accessibilityLevel={2}>
            歷年溺水事件
          </Heading>
          {drownFile && (
            <>
              <Label>
                <a href="/api/file/drown">下載</a>
                <Text>檔案大小 {formatBytes(drownFile.size)}</Text>
                <Text>
                  上傳時間 {new Date(drownFile.ctime).toLocaleString()}
                </Text>
              </Label>
            </>
          )}
          <ExcelUploader title="拖拉或點擊上傳檔案" onDrop={onDropDrown} />
        </Box>
        <Box flex="grow" paddingX={3} paddingY={3}>
          <Heading size="sm" accessibilityLevel={2}>
            紫色紅色總表
          </Heading>
          {purpleRedFile && (
            <>
              <Label>
                <a href="/api/file/purpleRed">下載</a>
                <Text>檔案大小 {formatBytes(purpleRedFile.size)}</Text>
                <Text>
                  上傳時間 {new Date(purpleRedFile.ctime).toLocaleString()}
                </Text>
              </Label>
            </>
          )}
          <ExcelUploader title="拖拉或點擊上傳檔案" onDrop={onDropPurpleRed} />
        </Box>
      </Box>
    </>
  );
};

export default UploadPage;
