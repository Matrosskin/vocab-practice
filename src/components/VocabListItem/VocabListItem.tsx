import { Button, Dropdown, List, MenuProps } from 'antd';
import { IVocab } from '../../hooks/useVocabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import s from './VocabListItem.module.scss'
import { useCallback, useRef, useState } from 'react';
import { VocabListItemNameInput } from '../VocabListItemNameInput/VocabListItemNameInput';
import { child, getDatabase, push, ref, remove, set } from 'firebase/database';
import { useAppSelector } from '../../hooks/store';
import { useBusy } from '../../hooks/useBusy';
import { useVocabItemMenu } from './useVocabItemMenu';
import { VocabListItemNameLabel } from '../VocabListItemNameLabel/VocabListItemNameLabel';

const ItemMenu = ({items} : { items: MenuProps['items'] }) => {
  return <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" arrow={{ pointAtCenter: true }}>
    <Button type='text' size='small'><FontAwesomeIcon icon={faEllipsis} /></Button>
  </Dropdown>
}

interface IVocabListItemProps {
  vocab: IVocab
  index: number
  isAlone: boolean
  onCancel: (id: string) => void
  onSetDefault: (id: string) => void
}

export const VocabListItem = ({vocab, index, isAlone, onCancel, onSetDefault}: IVocabListItemProps) => {
  const uid = useAppSelector((state) => state.user.user?.uid)
  const [isEditing, setIsEditing] = useState(!vocab.name)
  const [canBeSaved, setCanBeSaved] = useState(false)
  const [, setIsBusy] = useBusy()
  const nameRef = useRef<string>('')

  const saveVocab = useCallback(() => {
    setIsBusy(true)

    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
    const newVocabRef = vocab.id
      ? child(vocabListRef, vocab.id)
      : push(vocabListRef)
    set(newVocabRef, {
      name: nameRef.current
    }).finally(() => {
      setIsEditing(false)
      setIsBusy(false)
    })
  }, [setIsBusy, uid, vocab.id])

  const startEditing = useCallback(() => {
    setIsEditing(true)
  }, [])

  const deleteVocab = useCallback(() => {
    setIsBusy(true)

    const db = getDatabase()
    const vocabRef = ref(db, `v-p-app-v1/users/${uid}/vocabs/${vocab.id}`)
    remove(vocabRef).finally(() => {
      setIsBusy(false)
    })
  }, [setIsBusy, uid, vocab.id])

  const setAsDefault = useCallback(() => onSetDefault(vocab.id), [onSetDefault, vocab.id])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    onCancel(vocab.id)
  }, [onCancel, vocab.id])

  const menuItems = useVocabItemMenu({
    isEditing,
    canBeSaved,
    saveVocab,
    cancelEditing,
    isExistedVocab: !!vocab.name,
    startEditing,
    setAsDefault,
    deleteVocab,
    isDefault: !!vocab.isDefault,
  })

  const inputOrLabel = isEditing
    ? <VocabListItemNameInput nameRef={nameRef} vocab={vocab} onValidityChange={setCanBeSaved} onPressEnter={saveVocab} />
    : <VocabListItemNameLabel vocab={vocab} />

  return <List.Item actions={[<ItemMenu items={menuItems} />]}>
    <div className={s.listItem} onDoubleClick={startEditing}>
      <span>{index + 1}.&nbsp;</span>{inputOrLabel}
    </div>
  </List.Item>
}
