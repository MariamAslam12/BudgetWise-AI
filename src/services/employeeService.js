
import { apiRequest } from './api'

export const getEmployees = () => {
  return apiRequest('/users')
}

export const addEmployee = (employeeData) => {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(employeeData)
  })
}
