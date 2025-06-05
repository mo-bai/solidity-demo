import { LessonCard } from './components/LessonCard'
import { useYDCollege } from './hooks/useYDCollege'
import { useState } from 'react'
import { PurchaseLessonModal } from './components/PurchaseLessonModal'
import { ExchangeYdCoinModal } from './components/ExchangeYdCoinModal'

export function LessonList() {
  const { lessons } = useYDCollege()
  const [selectedLesson, setSelectedLesson] = useState<{
    id: number
    name: string
    price: bigint
  } | null>(null)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)

  const onPurchase = (lessonId: number) => {
    const lesson = lessons.find((lesson) => lesson.id === lessonId)
    if (lesson) {
      console.log('lesson', lesson)
      setSelectedLesson({
        id: lesson.id,
        name: lesson.name,
        price: BigInt(lesson.price)
      })
    }
  }

  const onExchangeYD = () => {
    setIsExchangeModalOpen(true)
  }

  return (
    <div className='w-full'>
      <h2 className='my-2 text-2xl font-bold text-gray-800'>课程列表</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {lessons?.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            name={lesson.name}
            price={Number(lesson.price)}
            cover={lesson.cover}
            purchased={lesson.purchased}
            onPurchase={onPurchase}
            onExchangeYD={onExchangeYD}
          />
        ))}
      </div>

      {/* 购买课程弹窗 */}
      {selectedLesson && (
        <PurchaseLessonModal
          lessonId={selectedLesson.id}
          name={selectedLesson.name}
          price={selectedLesson.price}
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}

      {/* 兑换YD币弹窗 */}
      <ExchangeYdCoinModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
      />
    </div>
  )
}
