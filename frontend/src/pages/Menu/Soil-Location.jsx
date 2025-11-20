import Map from '../../components/map/mymap.jsx';
import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';

export default function LandingPage() {
  return (
    <>
      <PageMeta
        title="SoilSnap"
        description="SoilSnap is a platform for soil data management and analysis."
      />
      <Navbar />
      <Map />
    </>
  );
}
