import { Badge, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import s from './VocabListItemNameLabel.module.scss'
import { useUserSettings } from '../../hooks/useUserSettings'
import { IVocab } from '../../interfaces/IVocab'

export const VocabListItemNameLabel = ({ vocab }: { vocab: IVocab }) => {
  const { defaultVocabId } = useUserSettings()

  return (
    <span className={s.itemLabel}>
      {vocab.name}
      {vocab.id === defaultVocabId && (
        <>
          {' '}
          <Typography.Text type='secondary'>(default)</Typography.Text>
        </>
      )}
      {Boolean(vocab.id) && (
        <>
          {' '}
          <Badge count={vocab.recordsCount || 0} showZero color='DodgerBlue' />
          {' '}
          &nbsp;&nbsp;&nbsp;
          <Link to={`/vocab/${vocab.id}`}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>
        </>
      )}
    </span>
  )
}
