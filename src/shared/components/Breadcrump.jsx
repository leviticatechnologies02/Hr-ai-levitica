import React from 'react'
import { Link } from 'react-router-dom';

const Breadcrump = ({items}) => {
  return (
    <>
  <nav aria-label="breadcrump">
    
    <ol className='breadcrump d-flex align-items-center' style={{padding: "1px", }} >
      <i className='fe fe-home me-1' ></i>
      {items.map((item , idx) =>(
       
        <li
          key={idx}
          className={`mt-1  gap-1 breadcrump-item ${item.active ? "active" : ""}`}
          aria-current={item.active ? "page" : undefined}
          style={{fontSize: "13px"}}
        >
           
          {item.link ? <Link to={item.link} >{item.label}</Link> : item.label}
          {idx < items.length - 1 && (
              <i className="fe fe-chevron-right mx-2 text-muted" />
            )}
        </li>
      ))}
    </ol>
  </nav>
    </>
  )
}

export default Breadcrump;