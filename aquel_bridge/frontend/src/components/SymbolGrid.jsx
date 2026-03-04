import React, { useState, useEffect } from 'react';
import { symbolsApi } from '../api/client';

const SymbolGrid = ({ onSelectSymbol }) => {
    const [symbols, setSymbols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [symRes, catRes] = await Promise.all([
                    symbolsApi.getSymbols(),
                    symbolsApi.getCategories()
                ]);
                setSymbols(symRes.data.symbols);
                setCategories(['All', ...catRes.data.categories]);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch symbols:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredSymbols = activeCategory === 'All'
        ? symbols
        : symbols.filter(s => s.category === activeCategory);

    if (loading) return <div className="loading">Loading Board...</div>;

    return (
        <div className="symbol-grid-container">
            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="symbol-grid">
                {filteredSymbols.map(symbol => (
                    <button
                        key={symbol.id}
                        className="symbol-card"
                        style={{ borderLeft: `6px solid ${symbol.color}` }}
                        onClick={() => onSelectSymbol(symbol)}
                    >
                        <span className="symbol-emoji">{symbol.emoji}</span>
                        <span className="symbol-label">{symbol.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SymbolGrid;
