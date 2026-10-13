import { useEffect, useRef, useState } from 'react'
import { Stage } from './stage'
import { buildModel, floorName, kindOf, levelsOf } from './models'
import './Maquette.css'

/**
 * One residence's white model, standing still at three-quarter view.
 * Pointing at it separates the storeys; the storey under the pointer is
 * outlined and named, with whether it is free or taken. Dragging turns
 * the model; a click on it calls `onOpen`. On a touch screen the first
 * tap separates the storeys and names the one touched.
 */
function Maquette({ residence, taken, lang, labels, onOpen, ground = null }) {
  const boxRef = useRef(null)
  const stageRef = useRef(null)
  const gesture = useRef(null)
  const [tag, setTag] = useState(null)
  const takenKey = taken.join(',')
  const shape = `${residence.slug}-${kindOf(residence)}-${levelsOf(residence)}-${takenKey}-${ground}`

  useEffect(() => {
    // A fresh canvas per stage: a disposed stage gives its WebGL context
    // back, and that canvas cannot get a new one.
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    boxRef.current.prepend(canvas)
    const stage = new Stage(canvas, { ground })
    stage.setModel(buildModel({ ...residence, floorsTaken: taken }))
    stageRef.current = stage
    return () => {
      stage.dispose()
      canvas.remove()
      stageRef.current = null
    }
    // The model is rebuilt only when its shape changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape])

  const pointAt = (e) => {
    const stage = stageRef.current
    if (!stage) return
    const index = stage.pickFloor(e.clientX, e.clientY)
    stage.highlight(index)
    if (index === null) {
      setTag(null)
      return
    }
    const rect = boxRef.current.getBoundingClientRect()
    setTag({ index, taken: taken.includes(index), x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const settle = () => {
    const stage = stageRef.current
    stage?.explode(false)
    stage?.highlight(null)
    setTag(null)
  }

  return (
    <div
      ref={boxRef}
      className="mq"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') stageRef.current?.explode(true)
      }}
      onPointerLeave={() => {
        if (!gesture.current) settle()
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        gesture.current = { moved: false }
        stageRef.current?.startDrag(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        const stage = stageRef.current
        if (gesture.current) {
          if (stage?.moveDrag(e.clientX, e.clientY)) gesture.current.moved = true
          if (gesture.current.moved) {
            setTag(null)
            return
          }
        }
        if (e.pointerType === 'mouse') pointAt(e)
      }}
      onPointerUp={(e) => {
        const stage = stageRef.current
        stage?.endDrag()
        const g = gesture.current
        gesture.current = null
        if (!stage || !g || g.moved) return
        const index = stage.pickFloor(e.clientX, e.clientY)
        if (e.pointerType === 'mouse') {
          if (index !== null) onOpen?.()
        } else if (!stage.exploded) {
          stage.explode(true)
          pointAt(e)
        } else if (index === null) {
          settle()
        } else {
          pointAt(e)
        }
      }}
      onPointerCancel={() => {
        stageRef.current?.endDrag()
        gesture.current = null
      }}
    >
      {tag && (
        <span className={`mq-tag${tag.taken ? ' is-taken' : ''}`} style={{ left: tag.x, top: tag.y }}>
          <span className="mq-tag-floor">{floorName(tag.index, lang)}</span>
          <span className="mq-tag-status">{tag.taken ? labels.taken : labels.free}</span>
        </span>
      )}
    </div>
  )
}

export default Maquette
