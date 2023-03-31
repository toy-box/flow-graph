import { Button } from 'antd'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const Test: React.FC = () => {
  const history = useNavigate()
  const submit = useCallback(() => {
    history('/main')
  }, [])
  return (
    <div>
      <Button onClick={submit}>进入主路由</Button>
    </div>
  )
}
