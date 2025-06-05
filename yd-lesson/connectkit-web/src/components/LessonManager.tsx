import { useYDCollege } from '../hooks/useYDCollege'
import { useEffect, useState } from 'react'

export default function LessonManager() {
  const { isOwner, addLesson, deleteLesson, isAdding, error } = useYDCollege()
  const [deleteId, setDeleteId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    link: '',
    cover: ''
  })
  const [addLoading, setAddLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    if (addLoading) return
    setAddLoading(true)
    e.preventDefault()
    addLesson({
      name: formData.name,
      description: formData.description,
      price: BigInt(formData.price),
      link: formData.link,
      cover: formData.cover
    })
  }

  useEffect(() => {
    if (error) {
      console.error(error)
    }
    if (!isAdding || addLoading) {
      // 添加成功,关闭弹窗
      setIsModalOpen(false)
      setAddLoading(false)
      setFormData({
        name: '',
        description: '',
        price: '',
        link: '',
        cover: ''
      })
    }
  }, [isAdding, error, addLoading])

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    if (deleteId) {
      deleteLesson(Number(deleteId))
      setDeleteId('')
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 如果不是合约所有者，不显示管理界面
  if (!isOwner) {
    return null
  }

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='fixed right-4 bottom-4 p-4 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-6 h-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          />
        </svg>
      </button>

      {/* 弹窗遮罩层 */}
      {isModalOpen && (
        <div className='flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50'>
          {/* 弹窗内容 */}
          <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4'>
            <div className='p-6 space-y-8'>
              {/* 弹窗标题和关闭按钮 */}
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>课程管理</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              {/* 添加课程表单 */}
              <div className='p-6 bg-white rounded-lg shadow'>
                <h2 className='mb-6 text-2xl font-bold'>添加课程</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      课程名称
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='px-3 py-2 w-full rounded-md border'
                      placeholder='输入课程名称'
                    />
                  </div>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      课程描述
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className='px-3 py-2 w-full rounded-md border'
                      placeholder='输入课程描述'
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      价格 (YD)
                    </label>
                    <input
                      type='number'
                      name='price'
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min='0'
                      className='px-3 py-2 w-full rounded-md border'
                      placeholder='输入课程价格'
                    />
                  </div>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      课程链接
                    </label>
                    <input
                      type='url'
                      name='link'
                      value={formData.link}
                      onChange={handleInputChange}
                      required
                      className='px-3 py-2 w-full rounded-md border'
                      placeholder='输入课程链接'
                    />
                  </div>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      封面图片
                    </label>
                    <input
                      type='url'
                      name='cover'
                      value={formData.cover}
                      onChange={handleInputChange}
                      required
                      className='px-3 py-2 w-full rounded-md border'
                      placeholder='输入封面图片链接'
                    />
                  </div>
                  <button
                    type='submit'
                    className='px-4 py-2 w-full text-white bg-blue-500 rounded-md hover:bg-blue-600'>
                    {isAdding ? '添加中...' : '添加课程'}
                  </button>
                </form>
              </div>

              {/* 删除课程表单 */}
              <div className='p-6 bg-white rounded-lg shadow'>
                <h2 className='mb-6 text-2xl font-bold'>删除课程</h2>
                <form onSubmit={handleDelete} className='space-y-4'>
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700'>
                      课程 ID
                    </label>
                    <div className='flex gap-4'>
                      <input
                        type='number'
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        required
                        min='1'
                        className='flex-1 px-3 py-2 rounded-md border'
                        placeholder='输入要删除的课程 ID'
                      />
                      <button
                        type='submit'
                        className='px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'>
                        删除
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
