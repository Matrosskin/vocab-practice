import { Alert, Button, Card, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import s from './RegistrationPage.module.scss'
import { SubmitButton } from '../SubmitButton/SubmitButton'
import { GoogleButton } from '../../../components/GoogleButton/GoogleButton'
import { useBusy } from '../../../hooks/useBusy'
import { getDatabase, push, ref, set } from 'firebase/database'

type FieldType = {
  email?: string
  password?: string
  repeatPassword?: string
}

export function RegistrationPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isInProgress, setInProgress] = useState(false)
  const [regError, setRegError] = useState<{ code: string; message: string } | null>(null)
  const { setIsBusy } = useBusy()

  const onFinish = (values: FieldType) => {
    setInProgress(true)
    setRegError(null)
    createUserWithEmailAndPassword(getAuth(), values.email!, values.password!)
      .then((result) => {
        setIsBusy(true)

        const uid = result.user.uid
        const db = getDatabase()
        const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
        const vocabRef = push(vocabListRef)
        set(vocabRef, {
          name: 'Your vocabulary',
        }).finally(() => {
          setIsBusy(false)
        })
      })
      .catch((error) => {
        if (['auth/email-already-in-use', 'auth/invalid-email', 'auth/operation-not-allowed', 'auth/weak-password'].indexOf(error.code) !== -1) {
          setRegError({
            code: error.code,
            message: error.message.replace('Firebase: ', '').replace(` (${error.code})`, ''),
          })
          return
        }

        setRegError({ code: 'unknown', message: '' })
      })
      .finally(() => {
        setInProgress(false)
      })
  }

  const onGoToLogin = () => {
    navigate('/login')
  }

  return (
    <div className={s.registrationCardContainer}>
      <Card title='Registration form' className={s.registrationCard}>
        <div className={s.errorMessage}>
          {'auth/email-already-in-use' === regError?.code && <Alert message='User with such email already registered.' type='error' />}
          {('auth/invalid-email' === regError?.code ||
            'auth/operation-not-allowed' === regError?.code ||
            'auth/weak-password' === regError?.code) && <Alert message={regError?.message} type='error' />}
          {'unknown' === regError?.code && <Alert message='Something broke during registration. Try again later.' type='error' />}
        </div>

        <Form
          form={form}
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item<FieldType>
            label='E-mail'
            name='email'
            rules={[
              { required: true, message: 'Please input your e-mail!' },
              { type: 'email', message: 'The input is not valid e-mail!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label='Password' name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label='Repeat password'
            name='repeatPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please repeat your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The input does not match the password!'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: { offset: 0, span: 24 }, sm: { offset: 8, span: 16 } }}>
            <div className={s.buttonsContainer}>
              <SubmitButton form={form} loading={isInProgress}>
                Register
              </SubmitButton>
              <Button htmlType='button' onClick={onGoToLogin}>
                Login
              </Button>
              <GoogleButton />
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
