import { Button, Layout, List } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { IVocab, useVocabs } from '../../../hooks/useVocabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import s from './ManageVocabsPage.module.scss'
import { useCallback, useEffect, useState } from 'react'
import { VocabListItem } from '../../../components/VocabListItem/VocabListItem'
import { getDatabase, ref, update } from 'firebase/database'
import { useBusy } from '../../../hooks/useBusy'
import { useAppSelector } from '../../../hooks/store'
import { useVocab } from '../../../hooks/useVocab'

export const ManageVocabsPage = () => {
  const vocabs = useVocabs()
  const [vocabList, setVocabList] = useState<IVocab[]>([])
  const [, setIsBusy] = useBusy()
  const uid = useAppSelector((state) => state.user.user?.uid)
  const defaultV = useVocab()

  useEffect(() => {
    setVocabList([...vocabs])
  }, [vocabs])

  const onCreateVocab = useCallback(() => {
    const newVocab = vocabList.find((vocab) => !vocab.name)
    if (newVocab) return

    setVocabList([
      ...vocabList,
      {id: '', name: ''},
    ])
  }, [vocabList])

  const onCancelEditing = useCallback((id: string) => {
    if (id) return

    setVocabList(vocabList.filter(({id}) => id))
  }, [vocabList])

  const onSetDefault = useCallback((id: string) => {
    if (!id) return

    const updates: { [key: string]: boolean } = {
      [`/${id}/isDefault`]: true
    }
    const prevDefaultVocab = vocabs.find(({isDefault}) => isDefault)
    if (prevDefaultVocab) {
      updates[`/${prevDefaultVocab.id}/isDefault`] = false
    }

    setIsBusy(true)

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)

    update(vocabListRef, updates).catch((err) => {console.error(err)}).finally(() => {
      setIsBusy(false)
    })
  }, [setIsBusy, uid, vocabs])

  return <Layout>
    <Content>
      <Title level={3}>Your vocabs ({defaultV?.name})</Title>

      <List
        bordered
        dataSource={vocabList}
        renderItem={(item, index) => (
          <VocabListItem key={index} vocab={item} index={index} onCancel={onCancelEditing} onSetDefault={onSetDefault} isAlone={vocabList.length === 1} />
        )}
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
}
