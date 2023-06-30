import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

export default function Sidebar() {
  return <>
    <div className="sidebar">
      <ul>
        <li><NavLink to="/brand" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Profile</div></NavLink></li>
        <li><NavLink to="/items" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Items</div></NavLink></li>
        <li><NavLink to="/collections" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Collections</div></NavLink></li>
        <li><NavLink to="/sale" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Sale</div></NavLink></li>
        <li><NavLink to="/categories" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Categories</div></NavLink></li>
        {/* <li><NavLink to="/advertisements" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Advertisements</div></NavLink></li> */}
      </ul>
    </div>
  </>
}
