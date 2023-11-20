import { ItemType } from 'antd/es/menu/hooks/useItems'
import { insertAIf } from '../../utils/insertAIf'
import { useVocabs } from '../../hooks/useVocabs'

interface IuseVocabItemMenuProps {
  isEditing: boolean
  canBeSaved: boolean
  saveVocab: () => void
  cancelEditing: () => void
  isExistedVocab: boolean
  startEditing: () => void
  setAsDefault: () => void
  deleteVocab: () => void
  isDefault: boolean
}
export const useVocabItemMenu = ({
  isEditing,
  canBeSaved,
  saveVocab,
  cancelEditing,
  isExistedVocab,
  startEditing,
  setAsDefault,
  deleteVocab,
  isDefault,
}: IuseVocabItemMenuProps) => {
  const vocabs = useVocabs()
  const isAlone = vocabs?.length === 1

  return [
    ...insertAIf<ItemType>(
      isEditing,
      {
        key: 'save',
        label: 'Save',
        disabled: !canBeSaved,
        onClick: saveVocab,
      },
      {
        key: 'cancel',
        label: 'Cancel',
        onClick: cancelEditing,
      }
    ),
    ...insertAIf<ItemType>(isExistedVocab && !isEditing, {
      key: 'edit',
      label: 'Edit',
      onClick: startEditing,
    }),
    ...insertAIf<ItemType>(isExistedVocab && !isEditing && !isDefault, {
      key: 'setDefault',
      label: 'Set as default',
      onClick: setAsDefault,
    }),
    ...insertAIf<ItemType>(isExistedVocab && !isEditing && !isAlone, {
      key: 'remove',
      label: 'Remove',
      onClick: deleteVocab,
    }),
  ]
}
