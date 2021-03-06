import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import TemplateItemBurger from '../components/TemplateItemBurger'
import TemplateCommandBurger from '../components/TemplateCommandBurger'
import Button from '../components/Button'
import '../style//Burger.css';

function Burger() {
  useEffect(() => {
    getProducts()
    getData()
  }, [])

  const history = useHistory()

  const routerFechar = () => {
    history.push('/salao/fecharallday')
  }

  const routerAllDay = () => {
    const objPedidos = [
      { "pedidos": pedidos }
    ]
    const objValor = [
      totalValor,
    ]

    console.log(objPedidos)
    sessionStorage.setItem("pedidos", JSON.stringify(objPedidos));
    sessionStorage.setItem("valor", JSON.stringify(objValor));
    history.push('/salao/allday')
  }

  const getData = () => {
    const dataPedido = sessionStorage.getItem("pedidos")
    if (dataPedido) {
      const getData = JSON.parse(sessionStorage.getItem("pedidos"))
      const itemPedido = getData[0].pedidos
      setPedidos(itemPedido)
    }

    const dataValor = sessionStorage.getItem("valor")
    if (dataValor) {
      const getValue = JSON.parse(sessionStorage.getItem("valor"))
      const valuePedido = getValue[0]
      setTotalValor(valuePedido)
    }
  }

  const [menu, setMenu] = useState('');

  const [totalValor, setTotalValor] = useState(0);

  const token = localStorage.getItem("token");

  const name = sessionStorage.getItem("name");

  const [valueDelect, setValueDelect] = useState(totalValor);

  const getProducts = () => {
    fetch('https://lab-api-bq.herokuapp.com/products', {
      headers: {
        "accept": "application/json",
        "Authorization": `${token}`
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const breakfast = json.filter(item => item.name === name)
        setMenu(breakfast)
      })
  }

  const [pedidos, setPedidos] = useState([]);

  const adicionarItem = (item) => {
    const newArray = pedidos
    const price = Number(item.price);
    const index = newArray.findIndex(pedido => pedido.id === item.id)
    if(index < 0){
      newArray.push(item)
      setPedidos(newArray)
      somarItens(item)
    }else{
      newArray.splice(index, 1, {...item, qnt:  newArray[index].qnt +  1, price: Number(newArray[index].price) + price})
      setPedidos(newArray)
      somarItens(item)
    }
  }

  const somarItens = (item) => {
    const newArray = pedidos;
    const index = newArray.findIndex(pedido => pedido.nome === item.nome);
    if(index < 0){
      newArray.forEach(item => {
        const aux = Number(item.price)
        setTotalValor(aux + totalValor)
      })
    } else {
      const unidade = Number(item.unidade)
      newArray.splice(index, {...item, price: Number(newArray[index].price) + unidade})
      setTotalValor(totalValor + unidade)
    }
  }

  const deletItem = (item, pedidos) => {
    pedidos.splice(pedidos.indexOf(item), 1)
    const value = item.price
    setValueDelect(totalValor - value)
    setTotalValor(totalValor - Number(item.price))
  }

  const fazendoPedido = (e) => {
    e.preventDefault();
    const parent = e.target.parentNode.parentNode;
    const complement = parent.getAttribute('complement');
    const flavor = parent.getAttribute('flavor');
    const price = parent.getAttribute('price');
    const id = parent.getAttribute('id');
    const name = parent.getAttribute('name');

    const itemPedido = {
      qnt:1,
      complement: complement,
      flavor: flavor,
      id: id,
      nome: name,
      price: price,
      unidade: price
    }
    adicionarItem(itemPedido)
  }

  const setFinalPedido = (e) => {
    e.preventDefault();

    const objPedidos = [
      { "pedidos": pedidos }
    ]
    const objValor = [
      totalValor,
    ]

    sessionStorage.setItem("pedidos", JSON.stringify(objPedidos));
    sessionStorage.setItem("valor", JSON.stringify(objValor));

    routerFechar()
  }

  return (
    <div className="Burger">
      <div className="BurgerNav">
        <button onClick={routerAllDay} className="CafeMenuBtnBack">Menu</button>
        <h2>{name}</h2>
        <div className="BurgerMenu">
          {menu && menu.map((item) => (
            <TemplateItemBurger
              divClassName="divMaeBurger"
              divKey={Math.random()}
              divName={item.name}
              divFlavor={item.flavor}
              divComplement={item.complement}
              divId={item.id}
              divPrice={item.price}
              divOnClick={(e) => fazendoPedido(e)}
              itemFlavor={item.flavor}
              itemComplement={item.complement}
              itemPrice={item.price}
            />
          ))}
        </div>
        </div>
        <div className="divPedidosBlock">
          <div className="divPedidos">
            <h1 className="divPedidosTitle">Pedido:</h1>

            {pedidos && pedidos.map((item) =>
              <TemplateCommandBurger
              divClassName="divPedidosIndividuais"
              divKey={Math.random()}
              btnKey={Math.random()}
              btnClassName='btnDelet'
              btnOnClick={() => deletItem(item, pedidos)}
              btnText="X"
              itemQnt={item.qnt}
              itemName={item.nome}
              itemNameKey={Math.random()}
              itemFlavor={item.flavor}
              itemFlavorKey={Math.random()}
              itemComplement={item.complement}
              itemComplementKey={Math.random()}
              itemPrice={item.price}
              itemPriceKey={Math.random()}
              />
            )}
            <h3> Total : {totalValor},00</h3>
          </div>

          <Button
            buttonOnClick={(e) => setFinalPedido(e)}
            buttonText="Ver Resumo"
            btnClassName="btnResumoBurguer"
          />
        </div>
      
    </div>
  );
}
export default Burger;