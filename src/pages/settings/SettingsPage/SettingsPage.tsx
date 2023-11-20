import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { Link } from 'react-router-dom'

export const SettingsPage = () => {
  return (
    <Layout>
      <Content>
        <Title level={3}>Settings</Title>

        <Link to='vocabs'>Manage vocabs</Link>
      </Content>
    </Layout>
  )
}
