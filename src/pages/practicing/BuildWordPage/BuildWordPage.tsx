import { useParams } from 'react-router-dom'
import { useRecords } from '../../../hooks/useRecords'
import { useCallback, useEffect, useState } from 'react'
import { IRecord } from '../../../interfaces/IRecord'
import { Button, Flex, Typography } from 'antd'
import s from './BuildWordPage.module.scss'
import cn from 'classnames'
import { shuffleArray } from '../../../utils/shuffleArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'

enum Progress {
  InProgress,
  Success,
  Failed,
}

export const BuildWordPage = () => {
  const { vocabId } = useParams()
  const records = useRecords(vocabId, { withTranslation: true })
  const [isPageReady, setIsPageReady] = useState<boolean>(false)
  const [currentCard, setCurrentCard] = useState<IRecord | null>(null)
  const [letters, setLetters] = useState<string[]>([])
  const [builtWord, setBuiltWord] = useState<string>('')
  const [progress, setProgress] = useState<Progress>(Progress.InProgress)

  const showNextCard = useCallback(() => {
    const cardIndex = Math.round(Math.random() * (records.length - 1))
    const card = records[cardIndex]
    setCurrentCard(card)
    setLetters(shuffleArray(card.word.split('')))
    setBuiltWord('')
    setProgress(Progress.InProgress)
  }, [records])

  const onShowNextCard = useCallback(() => {
    navigator.vibrate(45)

    if (progress === Progress.InProgress) {
      setProgress(builtWord === currentCard!.word ? Progress.Success : Progress.Failed)
    } else {
      showNextCard()
    }
  }, [builtWord, currentCard, progress, showNextCard])

  const resetBuiltWord = useCallback(() => {
    if (!currentCard) return

    navigator.vibrate(45)
    setLetters(shuffleArray(currentCard.word.split('')))
    setBuiltWord('')
  }, [currentCard])

  const addLetter = useCallback(
    (indexOfLetter: number) => {
      navigator.vibrate(45)

      const newLetters = [...letters]
      const letter = newLetters.splice(indexOfLetter, 1)

      const newWord = builtWord + letter

      if (!newLetters.length) {
        setProgress(newWord === currentCard!.word ? Progress.Success : Progress.Failed)
      }
      setLetters(newLetters)
      setBuiltWord(newWord)
    },
    [builtWord, currentCard, letters]
  )

  useEffect(() => {
    if (isPageReady || !records.length) return

    setIsPageReady(true)
  }, [isPageReady, records.length])

  useEffect(() => {
    if (!isPageReady) return

    showNextCard()
  }, [isPageReady, showNextCard])

  const builtWordStatusType = progress === Progress.InProgress ? undefined : progress === Progress.Success ? 'success' : 'danger'

  if (!currentCard) {
    return null
  }

  return (
    <Flex
      className={cn(s.cardContainer, {
        [s.moreThan2]: currentCard.translation!.length > 2,
        [s.moreThan5]: currentCard.translation!.length > 5,
        [s.moreThan10]: currentCard.translation!.length > 10,
        [s.moreThan20]: currentCard.translation!.length > 20,
        [s.moreThan40]: currentCard.translation!.length > 40,
      })}
      justify='space-between'
      align='stretch'
      vertical
    >
      <Flex vertical justify='space-between' align='stretch' flex={1} onClick={onShowNextCard} className={s.cardContent}>
        <Flex className={s.wordContainer} justify='center' align='center'>
          {currentCard?.translation}
        </Flex>
      </Flex>

      <Flex justify='center' align='center' gap='large' className={s.builtWordContainer}>
        <Typography.Text type={builtWordStatusType} className={s.builtWord}>
          {builtWord}
        </Typography.Text>
        {progress === Progress.Failed && (
          <Typography.Text type='success' className={s.builtWord}>
            {currentCard.word}
          </Typography.Text>
        )}
        {Boolean(builtWord) && progress === Progress.InProgress && (
          <Button onClick={resetBuiltWord}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </Button>
        )}
      </Flex>

      <Flex gap='middle' justify='center' align='center' wrap='wrap' className={s.shuffledLettersContainer}>
        {!letters.length && ' '}
        {letters.map((letter, ind) => (
          <Button key={letter + ind} size='large' onClick={() => addLetter(ind)} disabled={progress !== Progress.InProgress}>
            {letter}
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}
