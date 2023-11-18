import { App, ConfigProvider, Layout, Spin } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import s from './VocabPracticeApp.module.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from './hooks/store'
import { useEffect } from 'react'
import { HeaderDropdownMenu } from "./components/HeaderDropdownMenu/HeaderDropdownMenu"
import { useBusy } from './hooks/useBusy'

export function VocabPracticeApp() {
  const isDetermined = useAppSelector((state) => state.user.isDetermined)
  const user = useAppSelector((state) => state.user.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [isBusy, setIsBusy] = useBusy()

  useEffect(() => {
    if (!isDetermined) {
      return
    }

    setIsBusy(false)

    const isNoUserPage = ['/login', '/registration', '/logout'].includes(location.pathname)
    if ((user && !isNoUserPage) || (!user && isNoUserPage)) {
      return
    }

    navigate(user ? '/vocab' : '/login')
  }, [isDetermined, location.pathname, navigate, setIsBusy, user])

  return (
    <ConfigProvider >
      <App>
        <Spin spinning={isBusy} size='large' tip='Loading...'>
          <Layout className={s.mainLayout}>
            <Header className={s.header}>
              <HeaderDropdownMenu />
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
