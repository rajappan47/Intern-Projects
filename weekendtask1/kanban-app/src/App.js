import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchBoards } from './store/boardSlice';
import MainLayout from './components/MainLayout';

function App() {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // Dynamically sync theme to document body for custom CSS properties
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#635FC7',
          colorBgBase: isDarkMode ? '#2B2C37' : '#FFFFFF',
          colorBgContainer: isDarkMode ? '#20212C' : '#F4F7FD',
          colorText: isDarkMode ? '#FFFFFF' : '#000112',
          colorTextDescription: '#828FA3',
        },
      }}
    >
      <MainLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </ConfigProvider>
  );
}

export default App;