"use client";
import React, { useEffect, useState } from 'react';
import Validate from './validation/page';
import Browse from './browse/page';
import Reporting from './reporting/page';
import Login from '@/components/common/login';
import NavBar from '@/components/navigation/navbar';
import { Plot } from '@/components/filehandling/selectplot';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  const initialState: Plot = { plotName: '', plotNumber: 0 };
  const [localPlot, setLocalPlot] = useState(initialState);

  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }
  return (
    <Router>
      {userInfo ? <NavBar /> : <p></p>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/validation"
          element={<Validate plot={localPlot} setPlot={setLocalPlot} />}
        />
        <Route
          path="/browse"
          element={<Browse plot={localPlot} setPlot={setLocalPlot} />}
        />
        <Route path="/reporting" element={<Reporting />} />
      </Routes>
    </Router>
  );
}

export default Home;
