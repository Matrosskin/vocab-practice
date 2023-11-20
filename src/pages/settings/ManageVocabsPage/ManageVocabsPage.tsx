import { Button, Layout, List } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { IVocab, useVocabs } from '../../../hooks/useVocabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import s from './ManageVocabsPage.module.scss'
import { useCallback, useEffect, useState } from 'react'
import { VocabListItem } from '../../../components/VocabListItem/VocabListItem'
import { useVocab } from '../../../hooks/useVocab'

export const ManageVocabsPage = () => {
  const vocabs = useVocabs()
  const [vocabList, setVocabList] = useState<IVocab[]>([])
  const defaultV = useVocab()

  useEffect(() => {
    setVocabList([...vocabs])
  }, [vocabs])

  const onCreateVocab = useCallback(() => {
    const newVocab = vocabList.find((vocab) => !vocab.name)
    if (newVocab) return

    setVocabList([...vocabList, { id: '', name: '' }])
  }, [vocabList])

  const onCancelEditing = useCallback(
    (id: string) => {
      if (id) return

      setVocabList(vocabList.filter(({ id }) => id))
    },
    [vocabList]
  )

  return (
    <Layout>
      <Content>
        <Title level={3}>Your vocabs ({defaultV?.name})</Title>

        <List
          bordered
          dataSource={vocabList}
          renderItem={(item, index) => <VocabListItem key={index} vocab={item} index={index} onCancel={onCancelEditing} />}
          footer={
            <div>
              <Button className={s.createVocabBtn} type='text' onClick={onCreateVocab}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          }
        />
      </Content>
    </Layout>
  )
}
