import { Form, Input } from 'antd'
import { IVocab } from '../../hooks/useVocabs'
import { MutableRefObject, useEffect, useState } from 'react'
import s from './VocabListItemNameInput.module.scss'

type FieldType = {
  itemName: string
}

interface IVocabListItemNameInputProps {
  vocab: IVocab
  onValidityChange: (isValid: boolean) => void
  nameRef: MutableRefObject<string>
  onPressEnter: () => void
}

export const VocabListItemNameInput = ({vocab, onValidityChange, nameRef, onPressEnter}: IVocabListItemNameInputProps) => {
  const [form] = Form.useForm<FieldType>()
  const [isValid, setIsValid] = useState(false)

  const values = Form.useWatch([], form)
  useEffect(() => {
    nameRef.current = values?.itemName || ''

    form.validateFields({ validateOnly: true }).then(
      (...args) => {
        setIsValid(true)
      },
      () => {
        setIsValid(false)
      },
    )
  }, [form, nameRef, values])

  useEffect(() => {
    onValidityChange(isValid)
  }, [isValid, onValidityChange])

  return <Form
    form={form}
    name="basic"
    autoComplete="off"
    layout='inline'
    size='small'
    className={s.itemLabel}
    wrapperCol={{ span: 24 }}
    initialValues={{itemName: vocab.name}}
  >
    <Form.Item<FieldType>
      name="itemName"
      wrapperCol={{ span: 24 }}
      className={s.itemInput}
      rules={[{ required: true, message: 'Please input your e-mail!' }]}
    >
      <Input placeholder="Vocab name" onPressEnter={onPressEnter} />
    </Form.Item>
  </Form>
}
