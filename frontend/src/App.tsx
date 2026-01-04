import React, { useState } from 'react'
import TokenDashboard from './TokenDashboard'
import TokenCreator from './TokenCreator'
import './App.css'

function App()
{
    const defaultFactoryAddress = import.meta.env.VITE_FACTORY_ADDRESS || ''
    const [activeTab, setActiveTab] = useState<'dashboard' | 'creator'>('dashboard')
    const [factoryAddress, setFactoryAddress] = useState<string>(defaultFactoryAddress)

    return (
        <div className="App">
            <nav className="app-nav">
                <h1>🪙 Token Management Dashboard</h1>
                <div className="nav-tabs">
                    <button
                        className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Token Dashboard
                    </button>
                    <button
                        className={`tab ${activeTab === 'creator' ? 'active' : ''}`}
                        onClick={() => setActiveTab('creator')}
                    >
                        Token Creator
                    </button>
                </div>
            </nav>

            <div className="app-content">
                {activeTab === 'dashboard' && <TokenDashboard />}
                {activeTab === 'creator' && (
                    <div className="creator-section">
                        <div className="factory-input">
                            <label>TokenFactory Address:</label>
                            <input
                                type="text"
                                placeholder="0x... (paste your TokenFactory contract address)"
                                value={factoryAddress}
                                onChange={(e) => setFactoryAddress(e.target.value)}
                            />
                        </div>
                        {factoryAddress && <TokenCreator factoryAddress={factoryAddress} />}
                        {!factoryAddress && (
                            <div className="placeholder">
                                👆 Please enter TokenFactory contract address to use Token Creator
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
