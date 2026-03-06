export default function PriceRangeFilter({ minPrice, maxPrice, priceRange, setPriceRange }) {
  const { min: absMin, max: absMax } = priceRange

  const handleMinInput = (val) => {
    const n = Math.max(absMin, Math.min(Number(val), maxPrice))
    setPriceRange(n, maxPrice)
  }

  const handleMaxInput = (val) => {
    const n = Math.min(absMax, Math.max(Number(val), minPrice))
    setPriceRange(minPrice, n)
  }

  // Track fill percentages for the colored range between thumbs
  const leftPct  = absMax === absMin ? 0 : ((minPrice - absMin) / (absMax - absMin)) * 100
  const rightPct = absMax === absMin ? 100 : ((maxPrice - absMin) / (absMax - absMin)) * 100

  return (
    <div className="price-filter-bar">
      <span className="price-filter-label">PRICE</span>

      <div className="price-slider-wrap">
        {/* Track background + filled range */}
        <div className="price-track">
          <div
            className="price-track-fill"
            style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
          />
        </div>

        {/* Min thumb */}
        <input
          type="range"
          className="price-thumb price-thumb--min"
          min={absMin}
          max={absMax}
          step={1}
          value={minPrice}
          onChange={e => handleMinInput(e.target.value)}
        />

        {/* Max thumb */}
        <input
          type="range"
          className="price-thumb price-thumb--max"
          min={absMin}
          max={absMax}
          step={1}
          value={maxPrice}
          onChange={e => handleMaxInput(e.target.value)}
        />
      </div>

      {/* Number inputs */}
      <div className="price-inputs">
        <div className="price-input-box">
          <span className="price-input-prefix">$</span>
          <input
            type="number"
            className="price-input"
            value={minPrice}
            min={absMin}
            max={maxPrice}
            onChange={e => handleMinInput(e.target.value)}
          />
        </div>
        <span className="price-input-sep">–</span>
        <div className="price-input-box">
          <span className="price-input-prefix">$</span>
          <input
            type="number"
            className="price-input"
            value={maxPrice}
            min={minPrice}
            max={absMax}
            onChange={e => handleMaxInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
