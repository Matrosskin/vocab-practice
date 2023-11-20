import { faArrowRightArrowLeft, faChevronDown, faChevronUp, faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Flex, Space, Typography, theme } from 'antd'
import { IRecord } from '../../interfaces/IRecord'
import { useCallback, useState } from 'react'
import s from './RecordListItem.module.scss'
import { Link } from 'react-router-dom'

interface IRecordListItemProps {
  record: IRecord
  vocabId: string
}
export const RecordListItem = ({ record, vocabId }: IRecordListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    token: { colorSplit },
  } = theme.useToken()

  const toggleDescription = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  return (
    <Flex
      className={s.listItemContainer}
      justify='space-between'
      align='flex-start'
      style={{
        borderBlockEnd: `1px solid ${colorSplit}`,
      }}
      onClick={toggleDescription}
    >
      <Space direction='vertical'>
        <Space>
          <Typography.Text strong>{record.word}</Typography.Text>
          {Boolean(record.translation) && (
            <>
              <Typography.Text type='secondary'>
                <FontAwesomeIcon size='xs' icon={faArrowRightArrowLeft} />
              </Typography.Text>
              <Typography.Text strong>{record.translation}</Typography.Text>
            </>
          )}
        </Space>

        {Boolean(record.description) && isExpanded && <Typography.Text type='secondary'>{record.description}</Typography.Text>}
      </Space>

      <div className={s.actionsContainer}>
        {Boolean(record.description) && (
          <>
            <Button type='text' size='small'>
              <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
            </Button>
          </>
        )}
        <Link to={`/vocab/${vocabId}/${record.id}`} className={s.linkLikeButton} onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon icon={faPencil} />
        </Link>
      </div>
    </Flex>
  )
}
