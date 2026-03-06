import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { API_URL } from '../firebase'
import { useApp } from '../context/useApp'

const BATCH_SIZE = 12

export function useProducts() {
  const { fullData, setFullData, filterByCatRef, isAdult } = useApp()

  // Data visible to this user — strip Alcohol if under 21
  const visibleData = isAdult ? fullData : fullData.filter(p => p.Category?.toLowerCase() !== 'alcohol')

  const [currentCat, setCurrentCat]         = useState('ALL')
  const [filteredData, setFilteredData]     = useState([])
  const [displayedCount, setDisplayedCount] = useState(0)
  const [search, setSearch]                 = useState('')
  const [renderedItems, setRenderedItems]   = useState([])
  const [minPrice, setMinPrice]             = useState(0)
  const [maxPrice, setMaxPrice]             = useState(9999)
  const sentinelRef = useRef(null)

  // Compute actual price bounds from loaded data
  const priceRange = useMemo(() => {
    if (visibleData.length === 0) return { min: 0, max: 9999 }
    const prices = visibleData
      .map(p => parseFloat(String(p.Price).replace(/[^0-9.]/g, '')))
      .filter(n => !isNaN(n))
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
  }, [visibleData])

  // When data first loads, set slider to full range
  useEffect(() => {
    if (priceRange.max !== 9999) {
      setMinPrice(priceRange.min)   // ← change priceRange.min to a fixed number e.g. 0
      setMaxPrice(priceRange.max)   // ← change priceRange.max to a fixed number e.g. 50
    }
  }, [priceRange.min, priceRange.max])

  // Helper: apply category + price filter together
  const applyFilters = useCallback((data, cat, min, max) => {
    let result = cat === 'ALL' ? data : data.filter(p => p.Category === cat)
    result = result.filter(p => {
      const price = parseFloat(String(p.Price).replace(/[^0-9.]/g, ''))
      return !isNaN(price) && price >= min && price <= max
    })
    return result
  }, [])

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
      setFilteredData(applyFilters(visibleData, currentCat, minPrice, maxPrice))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when fullData arrives, adult status, or price range changes
  useEffect(() => {
    if (fullData.length > 0 && search === '') {
      setFilteredData(applyFilters(visibleData, currentCat, minPrice, maxPrice))
      setDisplayedCount(BATCH_SIZE)
    }
  }, [fullData, isAdult, minPrice, maxPrice]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setFilteredData(applyFilters(visibleData, cat, minPrice, maxPrice))
  }, [visibleData, minPrice, maxPrice, applyFilters])

  // Keep the context ref in sync so Footer can trigger navigation
  useEffect(() => {
    filterByCatRef.current = filterByCat
  }, [filterByCat, filterByCatRef])

  const handleSearch = useCallback((q) => {
    setSearch(q)
    setDisplayedCount(BATCH_SIZE)
    if (q === '') {
      setFilteredData(applyFilters(visibleData, currentCat, minPrice, maxPrice))
    } else {
      const searched = visibleData.filter(p => p.Product_Name.toLowerCase().includes(q.toLowerCase()))
      setFilteredData(applyFilters(searched, 'ALL', minPrice, maxPrice))
    }
  }, [visibleData, currentCat, minPrice, maxPrice, applyFilters])

  const resetToHome = useCallback(() => {
    setCurrentCat('ALL')
    setSearch('')
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setFilteredData(visibleData)
  }, [visibleData, priceRange])

  const setPriceRange = useCallback((min, max) => {
    setMinPrice(min)
    setMaxPrice(max)
  }, [])

  const categories = ['ALL', ...new Set(visibleData.map(i => i.Category).filter(Boolean))]

  return {
    currentCat, filteredData, search, renderedItems,
    categories, sentinelRef,
    filterByCat, handleSearch, resetToHome,
    minPrice, maxPrice, priceRange, setPriceRange,
  }
}
