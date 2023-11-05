import { Button, Form, FormInstance } from 'antd'
import { PropsWithChildren, useEffect, useState } from 'react'

export const SubmitButton = ({ form, loading, children }: PropsWithChildren<{ form: FormInstance, loading: boolean }>) => {
  const [submittable, setSubmittable] = useState(false)

  const values = Form.useWatch([], form)

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      (...args) => {
        setSubmittable(true)
      },
      () => {
        setSubmittable(false)
      },
    )
  }, [form, values])

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} loading={loading}>
      {children}
    </Button>
  )
}
