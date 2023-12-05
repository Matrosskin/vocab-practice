import { useCallback } from 'react'
import { useBusy } from '../../hooks/useBusy'
import { child, getDatabase, push, ref, remove, set } from 'firebase/database'
import { useUid } from '../../hooks/useUid'
import { IRecord } from '../../interfaces/IRecord'
import { Button, Form, Input, Layout, Space } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { SubmitButton } from '../user/SubmitButton/SubmitButton'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRecord } from '../../hooks/useRecord'
import { getSpaceOnlyForbiddenRule } from '../../misc/getSpaceOnlyForbiddenValidator'

type FieldType = {
  word: string
  translation?: string
  description?: string
}

export const EditRecord = () => {
  const { setIsBusy } = useBusy()
  const uid = useUid()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const { vocabId, recordId } = useParams()
  const record = useRecord(vocabId!, recordId)

  const onFinish = useCallback(
    (values: FieldType) => {
      setIsBusy(true)

      const db = getDatabase()
      const recordListRef = ref(db, `v-p-app-v1/users/${uid}/records/${vocabId}`)
      const recordRef = recordId ? child(recordListRef, recordId) : push(recordListRef)

      const recordData: Omit<IRecord, 'id'> = { word: values.word.trim() }
      if (values.translation) recordData.translation = values.translation.trim()
      if (values.description) recordData.description = values.description.trim()

      set(recordRef, recordData)
        .then(
          () => {
            navigate(`/vocab/${vocabId}`)
          },
          (err) => {
            console.error('failed saving', err)
          }
        )
        .finally(() => {
          setIsBusy(false)
        })
    },
    [navigate, recordId, setIsBusy, uid, vocabId]
  )

  const onCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const onDelete = useCallback(() => {
    setIsBusy(true)

    const db = getDatabase()
    const recordRef = ref(db, `v-p-app-v1/users/${uid}/records/${vocabId}/${recordId}`)
    remove(recordRef).finally(() => {
      navigate(`/vocab/${vocabId}`)
      setIsBusy(false)
    })
  }, [navigate, recordId, setIsBusy, uid, vocabId])

  return (
    <Layout>
      <Content>
        <Title level={3}>{Boolean(recordId) ? 'Editing' : 'Creating'}</Title>

        {(record || !recordId) && (
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
              label='Word/Phrase'
              name='word'
              initialValue={record?.word}
              rules={[{ required: true, message: 'Please input word/phrase!' }, { validator: getSpaceOnlyForbiddenRule() }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label='Translation'
              name='translation'
              initialValue={record?.translation}
              rules={[{ validator: getSpaceOnlyForbiddenRule() }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label='Description'
              name='description'
              initialValue={record?.description}
              rules={[{ validator: getSpaceOnlyForbiddenRule() }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ xs: { offset: 0, span: 24 }, sm: { offset: 8, span: 16 } }}>
              <Space>
                <SubmitButton form={form}>Save</SubmitButton>
                {location.key !== 'default' && <Button onClick={onCancel}>Cancel</Button>}
                {Boolean(recordId) && (
                  <Button onClick={onDelete} danger>
                    Delete
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        )}
      </Content>
    </Layout>
  )
}
