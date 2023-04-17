import { response, request } from 'express'

export const validateRoles = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'No token found'
      })
    }

    const { role } = req.user

    if (!roles.includes(role)) {
      return res.status(401).status({
        msg: 'Unauthorized'
      })
    }

    next()
  }
}
