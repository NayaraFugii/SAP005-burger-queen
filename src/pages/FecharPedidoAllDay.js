import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import TemplateOrderVolumeAllDay from '../components/TemplateOrderVolumeAllDay'
import TemplateValueOrder from '../components/TemplateValueOrder'
import Button from '../components/Button'
import '../style/FecharPedido.css';

function FecharPedidoAllDay() {
  const history = useHistory()

  const routerSalao = () => {
    history.push('/salao')
  }

  const routerAllDay = () => {
    history.push('/salao/allday')
  }

  const getValue = JSON.parse(sessionStorage.getItem("valor"))
  const valuePedido = getValue[0]

  const getData = JSON.parse(sessionStorage.getItem("pedidos"))
  const itemPedido = getData[0].pedidos

  const token = localStorage.getItem("token")
  const nameClient = sessionStorage.getItem("nameCliente");
  const table = sessionStorage.getItem("table");

  function postItems(e) {
    e.preventDefault();

    fetch('https://lab-api-bq.herokuapp.com/orders', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        "client": nameClient,
        "table": table,
        "products":
          itemPedido.map((item) => (
            {
              "id": Number(item.id),
              "qtd": 1
            }
          ))

      })
    })
      .then((response) => response.json())
      .then((json) => {
        sessionStorage.removeItem("pedidos")
        sessionStorage.removeItem("valor")
        routerSalao()
      })
  }

  return (
    <>
      <div className="FecharPedido">
      <Button
          buttonOnClick={routerAllDay}
          buttonText="Voltar"
          btnClassName="btnResumo"
        />
        <h1 className="FecharPedidoTitle">Resumo do Pedido</h1>
        {itemPedido && itemPedido.map((item) => (
          <TemplateOrderVolumeAllDay
          divClassName="FecharPedidoItem"
          divKey={Math.random()}
          divId={item.id}
          itemName={item.nome}
          itemQnt={item.qnt}
          itemPrice={item.price}
          itemFlavor={item.flavor}
          itemComplement={item.complement}
          itemNameKey={Math.random()}
          itemPriceKey={Math.random()}
          itemFlavorKey={Math.random()}
          itemComplementKey={Math.random()}
          />
        ))}
        <TemplateValueOrder
          divClassName="FecharPedidoItem"
          valueText="Total:"
          valueClassName="FecharPedidoTotal"
          valuePrice={valuePedido}
        />
        <Button
          buttonOnClick={(e) => postItems(e)}
          buttonText="Enviar pedido"
          btnClassName="btnResumo"
        />
      </div>
    </>
  );


}
export default FecharPedidoAllDay;