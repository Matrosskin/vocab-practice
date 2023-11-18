import { useParams } from 'react-router-dom'
import { useVocab } from '../../hooks/useVocab'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'

export const VocabPage = () => {
  const {vocabId} = useParams()
  const vocab = useVocab(vocabId)

  return <Layout>
    <Content>
      <Title level={3}>{vocab?.name}</Title>

      Here will be a list of words.
    </Content>
  </Layout>
}
