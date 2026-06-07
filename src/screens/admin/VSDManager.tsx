import React, { useEffect, useMemo, useRef, useState } from 'react'
import { apiFetch } from '../../services/api-client'

interface Scene {
  id: number
  child_id: string
  title: string
  context: string
  image_url: string
}

interface Hotspot {
  id: number
  scene_id: number
  label: string
  x: number
  y: number
  width: number
  height: number
  utterance: string
  vocab_id?: number | null
}

type DragState = {
  id: number
  mode: 'move' | 'resize'
  startX: number
  startY: number
  origin: { x: number; y: number; width: number; height: number }
}

const clamp = (val: number, min = 0, max = 1) => Math.min(max, Math.max(min, val))

const VSDManager: React.FC<{ childId?: string }> = ({ childId }) => {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null)
  const [selectedHotspotId, setSelectedHotspotId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragState, setDragState] = useState<DragState | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [sceneForm, setSceneForm] = useState({
    child_id: childId || '',
    title: '',
    context: 'home',
    image_url: ''
  })

  const selectedScene = useMemo(
    () => scenes.find(scene => scene.id === selectedSceneId) || null,
    [scenes, selectedSceneId]
  )

  const selectedHotspot = useMemo(
    () => hotspots.find(h => h.id === selectedHotspotId) || null,
    [hotspots, selectedHotspotId]
  )

  const loadScenes = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(`/api/vsd/scenes${childId ? `?childId=${childId}` : ''}`)
      const data = await response.json()
      setScenes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load scenes', error)
    } finally {
      setLoading(false)
    }
  }

  const loadHotspots = async (sceneId: number) => {
    try {
      const response = await apiFetch(`/api/vsd/scenes/${sceneId}/hotspots`)
      const data = await response.json()
      setHotspots(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load hotspots', error)
    }
  }

  useEffect(() => {
    setSceneForm(prev => ({ ...prev, child_id: childId || '' }))
    loadScenes()
  }, [childId])

  useEffect(() => {
    if (selectedSceneId) {
      loadHotspots(selectedSceneId)
    } else {
      setHotspots([])
    }
  }, [selectedSceneId])

  const createScene = async () => {
    try {
      await apiFetch('/api/vsd/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sceneForm)
      })
      setSceneForm({ child_id: childId || '', title: '', context: 'home', image_url: '' })
      loadScenes()
    } catch (error) {
      console.error('Failed to create scene', error)
    }
  }

  const createHotspotAt = async (x: number, y: number) => {
    if (!selectedSceneId) return
    try {
      const defaultSize = 0.15
      const response = await apiFetch('/api/vsd/hotspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene_id: selectedSceneId,
          label: 'New hotspot',
          x: clamp(x),
          y: clamp(y),
          width: defaultSize,
          height: defaultSize,
          utterance: 'Say something',
          vocab_id: null
        })
      })
      const created = await response.json()
      setHotspots(prev => [...prev, created])
      setSelectedHotspotId(created.id)
    } catch (error) {
      console.error('Failed to create hotspot', error)
    }
  }

  const updateHotspot = async (id: number, updates: Partial<Hotspot>) => {
    try {
      const response = await apiFetch(`/api/vsd/hotspots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      setHotspots(prev => prev.map(h => h.id === id ? data : h))
    } catch (error) {
      console.error('Failed to update hotspot', error)
    }
  }

  const handleContainerClick = (event: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    createHotspotAt(x, y)
  }

  const startDrag = (event: React.MouseEvent, hotspot: Hotspot, mode: 'move' | 'resize') => {
    event.stopPropagation()
    setSelectedHotspotId(hotspot.id)
    setDragState({
      id: hotspot.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: { x: hotspot.x, y: hotspot.y, width: hotspot.width, height: hotspot.height }
    })
  }

  useEffect(() => {
    if (!dragState) return

    const handleMove = (event: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dx = (event.clientX - dragState.startX) / rect.width
      const dy = (event.clientY - dragState.startY) / rect.height

      setHotspots(prev => prev.map(h => {
        if (h.id !== dragState.id) return h
        if (dragState.mode === 'move') {
          return {
            ...h,
            x: clamp(dragState.origin.x + dx),
            y: clamp(dragState.origin.y + dy)
          }
        }
        return {
          ...h,
          width: clamp(dragState.origin.width + dx, 0.05, 1),
          height: clamp(dragState.origin.height + dy, 0.05, 1)
        }
      }))
    }

    const handleUp = async () => {
      const target = hotspots.find(h => h.id === dragState.id)
      if (target) {
        await updateHotspot(target.id, {
          x: target.x,
          y: target.y,
          width: target.width,
          height: target.height
        })
      }
      setDragState(null)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragState, hotspots])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">VSD 场景管理</h3>
          <button onClick={loadScenes} className="text-sm text-blue-600">刷新</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Child ID"
            value={sceneForm.child_id}
            onChange={(e) => setSceneForm(prev => ({ ...prev, child_id: e.target.value }))}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="场景标题"
            value={sceneForm.title}
            onChange={(e) => setSceneForm(prev => ({ ...prev, title: e.target.value }))}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={sceneForm.context}
            onChange={(e) => setSceneForm(prev => ({ ...prev, context: e.target.value }))}
          >
            <option value="home">home</option>
            <option value="school">school</option>
            <option value="custom">custom</option>
          </select>
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="场景图片 URL"
            value={sceneForm.image_url}
            onChange={(e) => setSceneForm(prev => ({ ...prev, image_url: e.target.value }))}
          />
          <button
            onClick={createScene}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold"
          >
            新建场景
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-semibold mb-3">场景列表</h4>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {scenes.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`w-full text-left border rounded-lg p-3 ${selectedSceneId === scene.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-semibold">{scene.title}</div>
                  <div className="text-sm text-gray-500">{scene.context} | {scene.child_id}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-semibold mb-3">热点可视化编辑</h4>
          {selectedScene ? (
            <>
              <div className="text-sm text-gray-500 mb-2">点击图片添加热点，拖拽移动，右下角拖拽调整大小。</div>
              <div
                ref={containerRef}
                className="relative w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border"
                onClick={handleContainerClick}
              >
                <img src={selectedScene.image_url} alt={selectedScene.title} className="absolute inset-0 h-full w-full object-cover" />
                {hotspots.map(h => (
                  <div
                    key={h.id}
                    onMouseDown={(event) => startDrag(event, h, 'move')}
                    className={`absolute border-2 rounded-lg cursor-move ${selectedHotspotId === h.id ? 'border-blue-500 bg-blue-500/20' : 'border-amber-400 bg-amber-200/20'}`}
                    style={{
                      left: `${h.x * 100}%`,
                      top: `${h.y * 100}%`,
                      width: `${h.width * 100}%`,
                      height: `${h.height * 100}%`
                    }}
                  >
                    <div className="px-2 py-1 text-xs font-semibold text-white bg-black/40 rounded-t-md">{h.label}</div>
                    <div
                      className="absolute right-0 bottom-0 h-3 w-3 bg-blue-500 cursor-se-resize"
                      onMouseDown={(event) => startDrag(event, h, 'resize')}
                    />
                  </div>
                ))}
              </div>

              {selectedHotspot && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder="标签"
                    value={selectedHotspot.label}
                    onChange={(e) => setHotspots(prev => prev.map(h => h.id === selectedHotspot.id ? { ...h, label: e.target.value } : h))}
                    onBlur={() => updateHotspot(selectedHotspot.id, { label: selectedHotspot.label })}
                  />
                  <input
                    className="border rounded-lg px-3 py-2 md:col-span-3"
                    placeholder="触发语句"
                    value={selectedHotspot.utterance}
                    onChange={(e) => setHotspots(prev => prev.map(h => h.id === selectedHotspot.id ? { ...h, utterance: e.target.value } : h))}
                    onBlur={() => updateHotspot(selectedHotspot.id, { utterance: selectedHotspot.utterance })}
                  />
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder="关联 vocab_id"
                    value={selectedHotspot.vocab_id || ''}
                    onChange={(e) => setHotspots(prev => prev.map(h => h.id === selectedHotspot.id ? { ...h, vocab_id: e.target.value ? Number(e.target.value) : null } : h))}
                    onBlur={() => updateHotspot(selectedHotspot.id, { vocab_id: selectedHotspot.vocab_id || null })}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">请选择一个场景</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VSDManager
