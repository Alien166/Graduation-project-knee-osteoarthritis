import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Alert, Progress, Row, Col, Tag, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const { Title, Text, Paragraph } = Typography;

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  recommended: boolean;
  trialDays: number;
  maxUsers: number;
  description: string;
  isActive: boolean;
}

const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(14);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token'); // get token from localStorage
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('http://localhost:3000/api/v1/subscriptions/plans', {
          headers: {
            token: `Bearer ${token}`, // attach token to request
          },
        });

        setPlans(response.data.data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // تأكد من إضافة التوكن إذا كنت تستخدم مصادقة JWT
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate subscription');
      }

      const data = await response.json();
      console.log('Subscription initiated:', data);
      const url = data.data.iframeUrl;

      if (url) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.href = url;
        } else {
          alert('Popup blocked. Please allow popups for this site.');
        }
      }

    } catch (error) {
      console.error('Error subscribing to plan:', error);
    }
  };


  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Title level={1} className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
              Choose Your Perfect Plan
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your needs and start your journey with us today.
              All plans include a free trial period to help you make the right decision.
            </Paragraph>
          </motion.div>

          {/* Trial Status */}
          {isTrialActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <Alert
                message="Free Trial Active"
                description={
                  <div>
                    <Text>You have {trialDaysLeft} days left in your free trial.</Text>
                    <Progress
                      percent={(14 - trialDaysLeft) * (100 / 14)}
                      status="active"
                      strokeColor={{
                        '0%': '#3498DB',
                        '100%': '#2C3E50',
                      }}
                    />
                  </div>
                }
                type="info"
                showIcon
                icon={<ClockCircleOutlined />}
                className="max-w-2xl mx-auto"
              />
            </motion.div>
          )}

          {/* Plans Grid */}
          <Row gutter={[32, 32]} justify="center" align="stretch">
            {plans.map((plan, index) => (
              <Col xs={24} sm={24} md={12} lg={8} key={plan._id} className='flex flex-col h-full'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    className={`h-full transform transition-all duration-300 hover:scale-105 ${plan.recommended ? 'border-2 border-[#3498DB]' : 'border border-gray-200'
                      }`}
                    style={{
                      borderRadius: '16px',
                      boxShadow: plan.recommended
                        ? '0 4px 20px rgba(52, 152, 219, 0.15)'
                        : '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div className="text-center mb-8">
                      {plan.recommended && (
                        <Tag
                          color="blue"
                          className="mb-4 px-4 py-1 text-sm font-semibold"
                          icon={<StarOutlined />}
                        >
                          Recommended
                        </Tag>
                      )}
                      <Title level={3} className="text-2xl font-bold text-[#2C3E50] mb-2">
                        {plan.name}
                      </Title>
                      <div className="flex items-center justify-center gap-1">
                        <Text className="text-4xl font-bold text-[#2C3E50]">
                          ${plan.price}
                        </Text>
                        <Text className="text-gray-500">/month</Text>
                      </div>
                    </div>

                    <Divider className="my-6" />

                    <Space direction="vertical" size="large" className="w-full">
                      <Paragraph className="text-center text-gray-600">
                        {plan.description}
                      </Paragraph>

                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <TeamOutlined />
                        <Text>Up to {plan.maxUsers} {plan.maxUsers === 1 ? 'user' : 'users'}</Text>
                      </div>

                      <div className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircleOutlined className="text-[#52c41a] mt-1" />
                            <Text>{feature}</Text>
                          </div>
                        ))}
                      </div>

                      <Button
                        type={plan.recommended ? 'primary' : 'default'}
                        block
                        size="large"
                        onClick={() => handleSubscribe(plan)}
                        icon={plan.recommended ? <RocketOutlined /> : null}
                        className={`h-12 text-lg font-semibold rounded-lg ${plan.recommended
                          ? 'bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50]'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        {plan.recommended ? 'Get Started' : 'Choose Plan'}
                      </Button>
                    </Space>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 text-center"
          >
            <Title level={2} className="text-3xl font-bold text-[#2C3E50] mb-8">
              Frequently Asked Questions
            </Title>
            <div className='flex justify-center items-center'>
              <Row gutter={[32, 32]} className="max-w-4xl" justify="center">
                <Col xs={24} md={12}>
                  <Card className="h-full">
                    <Title level={4}>What happens after my trial ends?</Title>
                    <Paragraph>
                      After your trial period, you'll need to choose a subscription plan to continue using our services.
                      We'll notify you before your trial ends so you can make a decision.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="h-full">
                    <Title level={4}>Can I change my plan later?</Title>
                    <Paragraph>
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;