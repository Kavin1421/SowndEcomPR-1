import React from 'react'
import Inventory from '../features/admin/components/Inventory';
import {Navbar} from '../features/navigation/components/Navbar'

export const InventoryPage  = () => {
  return (
    <>
    <Navbar/>
    <Inventory/>
    </>
  )
}

export default InventoryPage;

