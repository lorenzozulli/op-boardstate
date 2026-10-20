import { BoardStatePage } from './pages/BoardStatePage/BoardStatePage'
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <>
      <BoardStatePage />
      <Analytics />
    </>
  )
}
