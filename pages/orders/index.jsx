import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from '../../components/UserMenu';
import SearchTable from '../../components/searchTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faCalendarDays,
  faBoxOpen,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import useMobile from '../../hook/useMobile';
import apiFetch from '@/utils/apiFetch';
import Protected from '@/utils/Protected';
import setDate from '@/utils/setDate';
import { notification } from 'antd';



function Orders() {

  //States & setting fct
  const [input, setInput] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([{ chargement: 'en attente des données' }]);
  const [ordersList, setOrdersList] = useState([]);
  const token = useSelector((state) => state.user.value.token);
  const [filter, setFilter] = useState({on:false, categories:['Réf', 'Date de commande', 'Date souhaitée', 'Prix', 'Status', 'Client', 'Produits']});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [ordersId, setOrdersId] = useState([]);

     //notifications
  const [api, contextHolder] = notification.useNotification();
  

  const openNotification = (object) => {
    const color = object.typeText==='Erreur'?'bg-[#f93e31c1]':'bg-[#abfda4ff]'
    api.open({
            message: object.typeText,
            description: object.message,
            className: color,
            style: {
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                overflow: "hidden",
              },
            })
    };
  

  useEffect(() => {
    setLoading(true)
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('http://localhost:3001/api/orders');

        if (data.result) {
          const useData = data.data.map(order => {
            return {
                    id : order._id,
                    'Réf': order.ref, 
                    'Date de commande':setDate(order.creationDate),
                    'Date souhaitée': setDate(order.deliveryDate),
                    'Prix': order.price, 
                    'Status': order.status, 
                    'Client': order.customer.name,
                    'Produits':
                        [...order.products.map(product => product.product.name)].sort()
                        };
                      });
          setFilteredOrders(useData.map(
            (order)=>{
              return Object.fromEntries(filter.categories.map(cat=> [cat,order[cat]]));
            }
          ));
          setOrdersList(useData.map(
            (order)=>{
              return Object.fromEntries(filter.categories.map(cat=> [cat,order[cat]]));
            }
          ));
          setOrdersId(useData.map(((order)=>{
            return {id:order.id, name:order['Réf']}
          })));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setFilteredOrders([{ Erreur: 'Aucune commande trouvée' }]);
      }
      setLoading(false);
    };
    fetchOrders();
    setRefresh(false);

  }, [filter.categories, refresh]);

  const tableHeaders =  ordersList.length > 0 ? Object.keys(ordersList[0]) : [];

  const handleFilterText = (text) => {
    setInput(text);
     
      const inputFilter = text ?
      ordersList.filter(
          (order) =>
            order['Client']&&order['Client'].toLowerCase().includes(text.toLowerCase()) ||
            order['Produits']&&order['Produits'].some((el) =>
              el.toLowerCase().includes(text.toLowerCase())
            ) ||
            order['Réf'].toLowerCase().includes(text.toLowerCase())
        )
        : ordersList

        setFilteredOrders(inputFilter);
    
  };
  
  const deleveryDateOn = ordersList[0]&&(tableHeaders.includes('Date de commande')||tableHeaders.includes('Date souhaitée'));
  
  //filter by delivery date
  const handleFilterDate = (date) => {
    setFilteredOrders(
      ordersList.filter((order) => {
        const deliveryDate = new Date(order['Date souhaitée']);
        return !date || deliveryDate >= new Date(date);
      })
    );
  };

  const handleCategories = (value) =>{
    filter.categories.includes(value.label)?
                  setFilter({...filter, categories:[...filter.categories.filter(cat=>cat!==value.label)]})
                  :
                  setFilter({ ...filter, categories:[...filter.categories, value.category] })
  }


  return (
    <div className='min-h-screen bg-gray-50'>
      <UserMenu 
      style='absolute top-5 right-10'
      refresh = {refresh}
      />

      <div className='w-full max-w-6xl mx-auto px-6 pt-20'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='font-semibold text-3xl text-center text-gray-800'>
            COMMANDES
          </h1>
        </div>

        {/* Count summary */}
        <div className='text-lg text-gray-700 mb-4 text-center'>
          Mes commandes : {`${filteredOrders.length} parmi ${ordersList.length}`}
        </div>

        {/* Zone filtres et bouton ajout */}
<div className="flex flex-col lg:flex-row gap-4 mb-6 items-start justify-between">
  
  {/* Bloc filtres */}
  <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 w-full lg:w-3/4">
    <p className="text-sm font-medium text-gray-700 mb-3">
      🔍 Filtrer les commandes par produits, clients, référence ou date de livraison
    </p>
    <div className="flex flex-col lg:flex-row gap-3">
      
      {/* Recherche texte */}
      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 mr-3" />
        <input
          type="text"
          name="SearchBar"
          placeholder="Rechercher une commande..."
          className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400"
          value={input}
          onChange={(e) => handleFilterText(e.target.value)}
        />
      </div>

      {/* Recherche par date */}
      {deleveryDateOn && (
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full lg:w-1/3 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
          <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400 mr-3" />
          <input
            type="date"
            className="flex-1 focus:outline-none text-gray-700"
            onChange={(e) => handleFilterDate(e.target.value)}
          />
        </div>
      )}
    </div>
  </div>

  {/* Bouton ajout commande */}
  <Link href="/orders/new" className="self-center lg:self-start">
    <div className="flex items-center bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm">
      <span className="font-medium">Passer une commande</span>
      <FontAwesomeIcon icon={faBoxOpen} className="ml-2" />
    </div>
  </Link>
</div>

        
        {/* Orders Table */}
        <div
          className={`${
            useMobile() ? '' : ' p-4'
          } mt-8 flex w-full flex-col items-center max-h-[600px] rounded-md border border-gray-200 shadow-sm bg-white`}
        > 
        <div className='flex flex-col items-center'>
          <div className='flex text-lg text-gray-700 mb-4 text-center' >{'Tableau des commandes'}</div>
          <div className='flex items-center mt-2'>
          Catégories à afficher
          <FontAwesomeIcon 
            icon={faFilter}
            className={`${!filter.on?'text-black':'text-emerald-600'} ml-3`}
            onClick={()=>setFilter({...filter, on:!filter.on})}
            /> 
          </div>
          <div className='flex items-center mt-2'>
            
          {filter.on&&['Date de commande', 'Date souhaitée', 'Prix', 'Status', 'Client', 'Produits'].map((label,i)=>{
            return(
            <label key={label} className='items-center gap-2 text-sm mx-2'>
              <input
              key={i}
              type='checkbox'
              name='categories'
              className='bg-emerald-500'
              checked={filter.categories.includes(label)}
              value={label}
              onChange={(e) => handleCategories({category:e.target.value, label:label})}
            />
            {label}
            </label>
          )})} 

        {contextHolder}
                        
        </div>
        </div>
          {loading ? (
            <div className='flex flex-col items-center p-6 text-gray-500'>
              <div className='w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2'></div>
              Chargement des commandes...
            </div>
          ) : (
            <SearchTable
              items={filteredOrders}
              type='orders'
              token={token}
              refresh = {setRefresh}
              itemsId = {ordersId}
              catToCheck={['Status','Date souhaitée']}
              notificationProp={openNotification}
              multipleSelect={true}
              modalOn = {true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Protected(Orders);
