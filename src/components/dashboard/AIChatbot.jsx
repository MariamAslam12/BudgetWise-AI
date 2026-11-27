
import { useState } from 'react'
import {
  Bot,
  MessageCircle,
  Send,
  X,
  LoaderCircle
} from 'lucide-react'

import { apiRequest } from '../../services/api'
import './AIChatbot.css'

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am BudgetWise AI. Ask me about your finances, expenses, invoices, or financial records.'
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()

    const text = message.trim()

    if (!text || loading) return

    setMessages(prev => [
      ...prev,
      { role: 'user', text }
    ])

    setMessage('')
    setLoading(true)

    try {
      const response = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text
        })
      })

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response.reply
        }
      ])

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: error.message || 'Something went wrong. Please try again.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-chatbot">

      {/* Floating chatbot button */}
      {!isOpen && (
        <button
          className="ai-chat-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open BudgetWise AI"
        >
          <MessageCircle size={25} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="ai-chat-window">

          <div className="ai-chat-header">
            <div className="ai-chat-heading">
              <div className="ai-chat-icon">
                <Bot size={23} />
              </div>

              <div>
                <strong>BudgetWise AI</strong>
                <small>Your finance assistant</small>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={21} />
            </button>
          </div>

          <div className="ai-chat-messages">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`ai-message ${item.role}`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message assistant ai-typing">
                <LoaderCircle size={16} className="ai-spinner" />
                Thinking...
              </div>
            )}

          </div>

          <form
            className="ai-chat-input"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>

        </div>
      )}

    </div>
  )
}

export default AIChatbot
