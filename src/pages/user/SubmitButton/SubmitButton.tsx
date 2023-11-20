import { Button, Form, FormInstance } from 'antd'
import { PropsWithChildren, useEffect, useState } from 'react'

interface ISubmitButtonProps {
  form: FormInstance
  loading?: boolean
}

export const SubmitButton = ({ form, loading, children }: PropsWithChildren<ISubmitButtonProps>) => {
  const [submittable, setSubmittable] = useState(false)

  const values = Form.useWatch([], form)

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      (...args) => {
        setSubmittable(true)
      },
      () => {
        setSubmittable(false)
      }
    )
  }, [form, values])

  return (
    <Button type='primary' htmlType='submit' disabled={!submittable} loading={loading}>
      {children}
    </Button>
  )
}
