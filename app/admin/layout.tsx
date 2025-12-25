"use client"
import React from 'react'
import AdminSidebar from './AdminSidebar'

const AdminLayouts = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='flex '>
      <AdminSidebar />
      <main className='flex-1 p-6 bg-gray-100 min-h-screen'>
        {children}
      </main>
    </div>
  )
}

export default AdminLayouts
