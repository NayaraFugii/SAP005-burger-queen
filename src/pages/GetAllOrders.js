import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import './GetAllOrders.css';

function GetAllOrders() {
  useEffect(() => {
    getOrders()
  }, [])

  const status = sessionStorage.getItem("status");
  const back = sessionStorage.getItem("back");

  const history = useHistory()
  const menu = (e) => {
    e.preventDefault();
    history.push(`/${back}`);
  }

  const routerStatus = () => {
    history.push('/status');
  }

  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState('');

  const getOrders = () => {
    fetch("https://lab-api-bq.herokuapp.com/orders", {
      headers: {
        "accept": "application/json",
        "Authorization": `${token}`
      },

    })
      .then((response) => response.json())
      .then((json) => {
        const order = json.filter(item => item.status === status)
        setOrders(order)
        console.log(order)
      })


  }

  return (
    <div className="GetAllOrders">
      <div className="SalaoHeader">
        <button onClick={(e) => menu(e)} className="logout">Voltar</button>

        {orders && orders.map((item) => (
          <div className="logout" key={Math.random()} onClick={(e) => {
            sessionStorage.setItem("itemId", item.id)
            routerStatus()
          }}>
            <p key={Math.random()}>{item.client_name}</p>
            <p key={Math.random()}>{item.id}</p>
            <p key={Math.random()}>{item.createdAt}</p>
          </div>
        ))}

        {/* <p>{teste()}</p> */}


      </div>
    </div>
  )
}


export default GetAllOrders;