import React from 'react'
import { Typography } from '@mui/material'

export const ErrorLabel: React.FC = ({ children }) => {
  return (
    <Typography variant="body1" sx={{ mb: 2, color: 'red' }}>
      {children}
    </Typography>
  )
}
