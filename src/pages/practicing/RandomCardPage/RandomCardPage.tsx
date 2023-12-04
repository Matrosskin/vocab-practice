import { useParams } from 'react-router-dom'
import { useRecords } from '../../../hooks/useRecords'
import { useCallback, useEffect, useState } from 'react'
import { IRecord } from '../../../interfaces/IRecord'
import { Button, Flex } from 'antd'
import s from './RandomCardPage.module.scss'
import cn from 'classnames'

const defaultSectionVisibilityState = {
  translation: false,
  description: false,
}

export const RandomCardPage = () => {
  const { vocabId } = useParams()
  const records = useRecords(vocabId)
  const [currentCard, setCurrentCard] = useState<IRecord | null>(null)
  const [isSectionVisible, setIsSectionVisible] = useState(defaultSectionVisibilityState)

  const showNextCard = useCallback(() => {
    navigator.vibrate(45)
    const cardIndex = Math.round(Math.random() * (records.length - 1))
    setIsSectionVisible(defaultSectionVisibilityState)
    setCurrentCard(records[cardIndex])
  }, [records])

  useEffect(() => {
    showNextCard()
  }, [showNextCard])

  const showTranslation = useCallback(() => {
    setIsSectionVisible({
      ...isSectionVisible,
      translation: true,
    })
  }, [isSectionVisible])

  const showDescription = useCallback(() => {
    setIsSectionVisible({
      ...isSectionVisible,
      description: true,
    })
  }, [isSectionVisible])

  if (!currentCard) {
    return null
  }

  return (
    <Flex
      className={cn(s.cardContainer, {
        [s.moreThan2]: currentCard.word.length > 2,
        [s.moreThan5]: currentCard.word.length > 5,
        [s.moreThan10]: currentCard.word.length > 10,
        [s.moreThan20]: currentCard.word.length > 20,
        [s.moreThan40]: currentCard.word.length > 40,
      })}
      justify='space-between'
      align='stretch'
      vertical
    >
      <Flex vertical justify='space-between' align='stretch' flex={1} onClick={showNextCard} className={s.cardContent}>
        <Flex className={s.wordContainer} justify='center' align='center'>
          {currentCard?.word}
        </Flex>

        {isSectionVisible.translation && (
          <Flex className={s.translationContainer} justify='center' align='center'>
            {currentCard?.translation}
          </Flex>
        )}

        {isSectionVisible.description && (
          <Flex className={s.descriptionContainer} justify='center' align='center'>
            {currentCard?.description}
          </Flex>
        )}
      </Flex>

      <Flex className={s.actionsContainer} justify='center' align='center'>
        {!isSectionVisible.translation && Boolean(currentCard?.translation) && <Button onClick={showTranslation}>Translation</Button>}
        {(isSectionVisible.translation || !currentCard?.translation) && !isSectionVisible.description && Boolean(currentCard?.description) && (
          <Button onClick={showDescription}>Description</Button>
        )}
      </Flex>
    </Flex>
  )
}
