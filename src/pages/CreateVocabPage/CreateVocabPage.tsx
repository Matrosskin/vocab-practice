import { Form, Input, Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title"
import { SubmitButton } from "../user/SubmitButton/SubmitButton";
import { useState } from "react";
import { getDatabase, push, ref, set } from "firebase/database";
import { useAppSelector } from "../../hooks/store";

type FieldType = {
  vocabName: string
}

export const CreateVocabPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [form] = Form.useForm()
  const [isInProgress, setInProgress] = useState(false)
  const uid = useAppSelector((state) => state.user.user?.uid)

  const onFinish = (values: FieldType) => {
    setInProgress(true)

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    const newVocabRef = push(vocabListRef)
    set(newVocabRef, {
      name: values.vocabName
    }).finally(() => {
      setInProgress(false)
    })
  }

  return <Layout>
    <Content
      style={{
        padding: 15,
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      <Title level={3}>Create vocab</Title>

      <Form
        form={form}
        name="createVocab"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Vocab name"
          name="vocabName"
          rules={[
            { required: true, message: 'Please input vocab name!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ xs: {offset: 0, span: 24}, sm: {offset: 8, span: 16} }}>
          <SubmitButton form={form} loading={isInProgress}>
            Create
          </SubmitButton>
        </Form.Item>
      </Form>
    </Content>
  </Layout>
}
