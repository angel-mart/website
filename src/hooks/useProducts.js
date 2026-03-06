import { useState, useEffect, useRef, useCallback } from 'react'
import { API_URL } from '../firebase'
import { useApp } from '../context/useApp'

const BATCH_SIZE = 12

export function useProducts() {
  const { fullData, setFullData, filterByCatRef, isAdult } = useApp()

  // Data visible to this user — strip Alcohol if under 21
  const visibleData = isAdult ? fullData : fullData.filter(p => p.Category?.toLowerCase() !== 'alcohol')
  const [currentCat, setCurrentCat]     = useState('ALL')
  const [filteredData, setFilteredData] = useState([])
  const [displayedCount, setDisplayedCount] = useState(0)
  const [search, setSearch]             = useState('')
  const [renderedItems, setRenderedItems] = useState([])
  const sentinelRef = useRef(null)

  // Fetch once
  useEffect(() => {
    if (fullData.length === 0) {
      fetch(API_URL)
        .then(r => r.json())
        .then(data => {
          setFullData(data)
          setFilteredData(data)
        })
    } else {
      setFilteredData(visibleData)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when fullData arrives or adult status changes
  useEffect(() => {
    if (fullData.length > 0 && search === '' && currentCat === 'ALL') {
      setFilteredData(visibleData)
    }
  }, [fullData, isAdult]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build rendered items
  useEffect(() => {
    if (search === '' && currentCat === 'ALL') {
      const cats = [...new Set(visibleData.map(i => i.Category).filter(Boolean))]
      setRenderedItems(cats.map(cat => ({ _type: 'category', cat })))
    } else {
      setRenderedItems(filteredData.slice(0, displayedCount))
    }
  }, [filteredData, displayedCount, visibleData, search, currentCat])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < filteredData.length) {
          setDisplayedCount(prev => prev + BATCH_SIZE)
        }
      },
      { threshold: 0.1 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [displayedCount, filteredData.length])

  const filterByCat = useCallback((cat) => {
    setCurrentCat(cat)
    setDisplayedCount(BATCH_SIZE)
    setSearch('')
    setFilteredData(cat === 'ALL' ? visibleData : visibleData.filter(p => p.Category === cat))
  }, [visibleData])

  // Keep the context ref in sync so Footer can trigger navigation
  useEffect(() => {
    filterByCatRef.current = filterByCat
  }, [filterByCat, filterByCatRef])

  const handleSearch = useCallback((q) => {
    setSearch(q)
    setDisplayedCount(BATCH_SIZE)
    if (q === '') {
      setFilteredData(currentCat === 'ALL' ? [...visibleData] : visibleData.filter(p => p.Category === currentCat))
    } else {
      setFilteredData(visibleData.filter(p => p.Product_Name.toLowerCase().includes(q.toLowerCase())))
    }
  }, [visibleData, currentCat])

  const resetToHome = useCallback(() => {
    setCurrentCat('ALL')
    setSearch('')
    setFilteredData(visibleData)
  }, [visibleData])

  const categories = ['ALL', ...new Set(visibleData.map(i => i.Category).filter(Boolean))]

  return {
    currentCat, filteredData, search, renderedItems,
    categories, sentinelRef,
    filterByCat, handleSearch, resetToHome,
  }
}
