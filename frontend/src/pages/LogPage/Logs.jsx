import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import LogsPage from '../../components/logspage/logs';

export default function Logs() {
  return (
    <div className="App">
      <PageMeta
        title="SoilSnap | Logs"
        description="SoilSnap logs management page"
      />
      <PageBreadcrumb pageTitle="Logs" />
      <LogsPage />
    </div>
  );
}