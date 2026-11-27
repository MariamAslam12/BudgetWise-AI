
const API = 'http://localhost:5000/api'

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('budgetwise_token')

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export default API
