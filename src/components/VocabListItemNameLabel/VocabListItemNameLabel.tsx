import { Typography } from 'antd'
import { IVocab } from '../../hooks/useVocabs'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import s from './VocabListItemNameLabel.module.scss'

export const VocabListItemNameLabel = ({vocab} : { vocab: IVocab }) => {
  return <span className={s.itemLabel}>
    {vocab.name}
    {vocab.isDefault && <> <Typography.Text type="secondary">(default)</Typography.Text></>}
    {Boolean(vocab.id) && <>{' '}&nbsp;&nbsp;&nbsp;<Link to={`/vocab/${vocab.id}`}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></Link></>}
  </span>
}
