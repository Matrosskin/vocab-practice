import { App, Button, ConfigProvider, Layout, Spin } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import s from './VocabPracticeApp.module.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from './hooks/store'
import { useEffect } from 'react'
import { getAuth, signOut } from 'firebase/auth'

export function VocabPracticeApp() {
  const isDetermined = useAppSelector((state) => state.user.isDetermined)
  const user = useAppSelector((state) => state.user.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isDetermined) {
      return
    }

    const isNoUserPage = ['/login', '/registration'].includes(location.pathname)
    if ((user && !isNoUserPage) || (!user && isNoUserPage)) {
      return
    }

    navigate(user ? '/vocab' : '/login')
  }, [isDetermined, location.pathname, navigate, user])

  const onDoLogout = () => {
    signOut(getAuth())
  }

  return (
    <ConfigProvider >
      <App>
        <Spin spinning={!isDetermined} size='large' tip='Loading...'>
          <Layout>
            <Header className={s.header}>
              <Button size='large' onClick={onDoLogout}>
                Logout
              </Button>
            </Header>

            <Content className={s.content}>
              <Outlet />
            </Content>
          </Layout>
        </Spin>
      </App>
    </ConfigProvider>
  )
}
