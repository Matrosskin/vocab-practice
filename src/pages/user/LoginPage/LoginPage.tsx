import { Alert, Button, Card, Form, Input } from 'antd'
import s from './LoginPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { SubmitButton } from '../SubmitButton/SubmitButton'
import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

type FieldType = {
  email?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isInProgress, setInProgress] = useState(false)
  const [loginError, setLoginError] = useState<{code: string} | null>(null)

  const onFinish = (values: any) => {
    setInProgress(true)
    setLoginError(null)
    signInWithEmailAndPassword(getAuth(), values.email!, values.password!)
      .catch((error) => {
        if ([
          "auth/invalid-email",
          "auth/user-disabled",
          "auth/user-not-found",
          "auth/wrong-password",
        ].indexOf(error.code) !== -1) {
          setLoginError({code: error.code})
          return
        }

        setLoginError({code: 'unknown'})
      })
      .finally(() => {
        setInProgress(false)
      })
  }

  const onGoToRegistration = () => {
    navigate('/registration')
  }

  return <div className={s.loginCardContainer}>
    <Card title="Login form" className={s.loginCard}>
      <div className={s.errorMessage}>
        { "auth/invalid-email" === loginError?.code && <Alert message="Invalid email." type="error" />}
        { "auth/user-disabled" === loginError?.code && <Alert message="User exists but inactive. Contact the site owner please." type="error" />}
        { "auth/user-not-found" === loginError?.code && <Alert message="User and/or password were not found." type="error" />}
        { "auth/wrong-password" === loginError?.code && <Alert message="User and/or password were not found." type="error" />}
        { "unknown" === loginError?.code && <Alert message="Something broke during login. Try again later." type="error" />}
      </div>

      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Please input your e-mail!' },
            { type: 'email', message: 'The input is not valid e-mail!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ xs: {offset: 0, span: 24}, sm: {offset: 8, span: 16} }}>
          <div className={s.buttonsContainer}>
            <SubmitButton form={form} loading={isInProgress}>
              Login
            </SubmitButton>
            <Button htmlType="button" onClick={onGoToRegistration}>
              Register
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  </div>
}
