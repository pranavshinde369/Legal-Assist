import React, { useState } from 'react';
import { ShieldAlert, BookOpen, MessageSquare, Send, FileText, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { simplifyText, analyzeRisks, chatWithDocument, SimplifyResponse, RiskAnalysisResponse, ChatMessage } from './api';

function App() {
  const [activeTab, setActiveTab] = useState<'simplify' | 'risks' | 'chat'>('simplify');
  const [documentText, setDocumentText] = useState('');
  
  // States for Simplifier
  const [simplifyData, setSimplifyData] = useState<SimplifyResponse | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);

  // States for Risk Analyzer
  const [riskData, setRiskData] = useState<RiskAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // States for Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const handleSimplify = async () => {
    if (!documentText.trim()) return;
    setIsSimplifying(true);
    try {
      const data = await simplifyText(documentText);
      setSimplifyData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to simplify document. Is the backend running?");
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeRisks(documentText);
      setRiskData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze risks. Is the backend running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !documentText.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: currentMessage } as ChatMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsChatting(true);

    try {
      const data = await chatWithDocument(documentText, newMessages);
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1>Legal Assist</h1>
        <p>Understand, compare, and navigate complex legal documents effortlessly.</p>
        <div className="disclaimer">
          <AlertTriangle size={16} />
          This tool provides information and assistance, and does not replace professional legal advice.
        </div>
      </header>

      <main className="main-content">
        {/* Left Column: Input */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2><FileText size={20} style={{ display: 'inline', marginRight: '8px' }}/> Document Input</h2>
          <p>Paste your legal contract, terms of service, or clause below.</p>
          <div className="textarea-container">
            <textarea 
              className="input-field" 
              placeholder="Paste legal text here..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
            />
          </div>
        </section>

        {/* Right Column: Tools */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'simplify' ? 'active' : ''}`}
              onClick={() => setActiveTab('simplify')}
            >
              <BookOpen size={18} style={{ display: 'inline', marginRight: '6px' }}/>
              Simplify
            </button>
            <button 
              className={`tab-btn ${activeTab === 'risks' ? 'active' : ''}`}
              onClick={() => setActiveTab('risks')}
            >
              <ShieldAlert size={18} style={{ display: 'inline', marginRight: '6px' }}/>
              Risk Analysis
            </button>
            <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={18} style={{ display: 'inline', marginRight: '6px' }}/>
              Chat
            </button>
          </div>

          <div className="tab-content">
            {/* SIMPLIFY TAB */}
            {activeTab === 'simplify' && (
              <div className="results-area animate-fade-in">
                <button className="btn-primary" onClick={handleSimplify} disabled={isSimplifying || !documentText}>
                  {isSimplifying ? 'Simplifying...' : 'Simplify Document'}
                </button>
                
                {simplifyData && (
                  <>
                    <div className="result-card">
                      <h3>Summary</h3>
                      <p>{simplifyData.summary}</p>
                    </div>
                    <div className="result-card">
                      <h3>Plain English Translation</h3>
                      <p>{simplifyData.simplified_text}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* RISKS TAB */}
            {activeTab === 'risks' && (
              <div className="results-area animate-fade-in">
                <button className="btn-primary" onClick={handleAnalyze} disabled={isAnalyzing || !documentText}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Risks'}
                </button>

                {riskData && (
                  <>
                    <div className="result-card">
                      <h3>Overall Assessment</h3>
                      <p>{riskData.overall_assessment}</p>
                    </div>
                    
                    <div className="risks-list">
                      {riskData.risks.map((risk, index) => (
                        <div key={index} className={`risk-item ${risk.risk_level.toLowerCase()}`}>
                          <span className={`badge ${risk.risk_level.toLowerCase()}`}>{risk.risk_level} Risk</span>
                          <h4>{risk.clause}</h4>
                          <p><strong>Explanation:</strong> {risk.explanation}</p>
                          <p><strong>Recommendation:</strong> {risk.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="results-area animate-fade-in">
                <p style={{marginBottom: '1rem'}}>Ask questions specifically about the provided document.</p>
                <div className="chat-box">
                  <div className="chat-messages">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.role}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ))}
                    {isChatting && <div className="message assistant">Thinking...</div>}
                  </div>
                  <div className="chat-input">
                    <input 
                      type="text" 
                      placeholder="e.g. Can they terminate my account without notice?" 
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn-primary" onClick={handleSendMessage} disabled={isChatting || !documentText}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
