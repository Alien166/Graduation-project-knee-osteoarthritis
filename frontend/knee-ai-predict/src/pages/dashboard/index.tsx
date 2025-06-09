import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space } from 'antd';
import { UserOutlined, FileOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import styled from 'styled-components';

const { Title } = Typography;

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 24px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }
`;

const Dashboard: React.FC = () => {
  // Sample data for the line chart
  const data = [
    { date: '2024-01', value: 35 },
    { date: '2024-02', value: 42 },
    { date: '2024-03', value: 38 },
    { date: '2024-04', value: 45 },
    { date: '2024-05', value: 50 },
  ];

  // Sample data for the recent patients table
  const recentPatients = [
    {
      key: '1',
      name: 'John Doe',
      age: 45,
      status: 'In Progress',
      lastVisit: '2024-05-15',
    },
    {
      key: '2',
      name: 'Jane Smith',
      age: 52,
      status: 'Completed',
      lastVisit: '2024-05-14',
    },
    {
      key: '3',
      name: 'Mike Johnson',
      age: 38,
      status: 'Scheduled',
      lastVisit: '2024-05-16',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'Completed' ? '#52c41a' : status === 'In Progress' ? '#1890ff' : '#faad14' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
    },
  ];

  return (
    <DashboardContainer>
      <Title level={2}>Dashboard</Title>

      {/* Summary Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Total Patients"
              value={156}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Active Cases"
              value={42}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Pending Analysis"
              value={8}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic
              title="Completed Cases"
              value={106}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <StyledCard title="Patient Analysis Trends">
            <Line
              data={data}
              xField="date"
              yField="value"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              style={{
                height: '300px',
              }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} lg={8}>
          <StyledCard title="Recent Activity">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <p>New patient registration</p>
                <small style={{ color: '#8c8c8c' }}>2 hours ago</small>
              </div>
              <div>
                <p>Analysis completed for Patient #123</p>
                <small style={{ color: '#8c8c8c' }}>4 hours ago</small>
              </div>
              <div>
                <p>System update completed</p>
                <small style={{ color: '#8c8c8c' }}>1 day ago</small>
              </div>
            </Space>
          </StyledCard>
        </Col>
      </Row>

      {/* Recent Patients Table */}
      <StyledCard title="Recent Patients">
        <Table
          columns={columns}
          dataSource={recentPatients}
          pagination={false}
          size="middle"
        />
      </StyledCard>
    </DashboardContainer>
  );
};

export default Dashboard;