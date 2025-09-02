import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownShortWide,
  faArrowUpShortWide,
  faPlus,
  faMinus,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons';

import { Modal } from 'antd';
import apiFetch from '@/utils/apiFetch';



/** This component renders a searchable and sortable table for products or orders
 It allows users to view details, modify stock quantities, and change order statuses
 Props:
 - tableHeaders: Array of header labels for the table
 - items: Array of item or order objects to display
 - type: Type of data ('stock' or 'orders') to determine specific functionalities
 - itemsId : @array of objects {id:of the item, name:to display the item in the modal}
 - refresh : invers data flow to refresh the parent
 Modal:
 -need itemsId in props
*/

function SearchTable({ items, type, refresh, itemsId, catToCheck, multipleSelect, notificationProp, modalOn }) {
  //1 - state and categories
  const categories = items.length ? Object.keys(items[0]) : [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [orderStatus, setOrderStatus] = useState({status:'', ref:''});
  const [sort, setSort] = useState({ key: '', direction: 1, index: 0 });
  const [typeSet, setTypeSet] = useState('');
  const [newStock, setNewStock] = useState({newName:'', quantity:0 , stock:0, id:'', unity:'unité du produit'});
  const [operator, setOperator] = useState(1);
  const [multiSelection, setMultiSelection] = useState([]);

  // 2 - Modal
    //2a - Function to close the modal and reset state
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setNewStock({newName:'', quantity:'', stock:0, id:'', unity:'unité du produit'})
        setMultiSelection([])
    };

    //2b - Function to change the name of a product
    const handleProductChange = async (routeChange,data) => {

      const validate = confirm('Souhaitez-vous valider ce changement ?')
      if (!data||!validate) return

        const dataToSend = typeSet==='Stock'?
                          { ...newStock, stock:newStock.stock + Number(newStock.quantity)*operator }
                          :
                          { ...newStock };
  

        try {
        const data = await apiFetch(`https://fluxi-backdep.vercel.app/api/products/${routeChange}`, {
            method: 'PUT',
            body: JSON.stringify(dataToSend)
        });

        if (!data.result) {
          console.error("Erreur lors de la mise à jour du stock:");
          notificationProp({typeText:"Erreur", message:"Mise à jour échouée"});
          return;
        }

        notificationProp({typeText:"Bravo !", message:"Modification réussie"});
        setIsModalVisible(!data.result)
        refresh(true)

        } catch (error) {
          console.error('Erreur lors de la mise à jour du stock:', error);
          notificationProp({typeText:"Erreur", message:"Mise à jour échouée"});
        }
        setNewStock({newName:'', quantity:'', stock:0, id:'', unity:'unité du produit'})
    }

    //2c - Function to handle order status changes
    const handleStatusChange = async (el) => {
      
      const dataToSend = el;
      
      try {
        const data = await apiFetch(`https://fluxi-backdep.vercel.app/api/orders/status`, {
            method: 'PUT',
            body: JSON.stringify( dataToSend )
        });

        if (data.result) {
          notificationProp({typeText:"Bravo !", message:"Modification réussie"})
          setIsModalVisible(!data.result)
          refresh(true)
          
          return
        }
        
        console.error('Commande non trouvée');
        notificationProp({typeText:"Erreur", message:"Mise à jour échouée"});


        } catch (error) {
          console.error('Erreur lors du changement de statut:', error);
          notificationProp({typeText:"Erreur", message:"Mise à jour échouée"});

        }
    };

    //2d - Handle modal access and set the associated states #OrderStatus & #newStock
  const handleOpenModal = (index) => {

    setCurrentItem(sortedItems[index]);
    sortedItems[index]['Status']&&setOrderStatus({status: sortedItems[index]['Status']})
    type==='stock'&&
    setNewStock({newName:sortedItems[index]['Nom'], type:sortedItems[index]['Type'] , stock:sortedItems[index]['Stock'], unity:sortedItems[index]['Unité']})
    setMultiSelection([])
    setIsModalVisible(true);
  };

//3 - Sort Icon and function
//3a - sort the rows following the #sort state
  const sortedItems = [...items].sort((a, b) => {
    const key = sort.key;
    return a[key] < b[key] ? sort.direction : -sort.direction;
  });

//3b - change the icon on the header depending of the #sort state
  const renderSortIcon = (index) =>
  sort.index === index && (
    <FontAwesomeIcon
      icon={sort.direction < 0 ? faArrowDownShortWide : faArrowUpShortWide}
      className='ml-2 text-gray-600'
    />
  );

//4 - The table maker
//4a - Header cells using #tableHeaders props
const renderHeader = () =>
  Object.keys(items[0]).map((header, index) => (
    <th
      key={index}
      className='bg-gray-100 text-gray-800 font-semibold text-[clamp(0.875rem,1.5vw,1rem)] px-4 py-2 cursor-pointer z-10 border border-gray-300 hover:bg-gray-200 transition'
      onClick={() =>
        setSort({
          key: categories[index],
          direction: -sort.direction,
          index,
        })
      }
    >
      <div className='flex flex-wrap items-center justify-center'>
        {header}
        {renderSortIcon(index)}
      </div>
    </th>
  ));

//4b - Row built using #sortedItems and set #modal visibility in the first colonne (colIndex=0)
const renderRows = () =>
  sortedItems.map((item, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    const selectedRow = multiSelection.some(el=>el.name===sortedItems[rowIndex][categories[0]])
    
    return (
      <tr
        key={rowIndex}
        onClick={()=>{ 
          multipleSelect&&(
            !selectedRow?setMultiSelection([...multiSelection, {status:'Livrée', ...itemsId.find((el)=>el.name===sortedItems[rowIndex][categories[0]])}])
            :
            setMultiSelection([ ...multiSelection.filter(el=>el.name!==sortedItems[rowIndex][categories[0]])])
          )
          }}
        className={`h-10 hover:bg-emerald-200 transition-color duration-200 
          ${isEven ? 'bg-[#EAF8F4]' : 'bg-white'} 
          ${selectedRow ? 'bg-emerald-50' : 'hover:bg-emerald-200'}
          ${selectedRow ? 'ring-2 ring-emerald-500 ring-inset' : ''}
          `}
      >
        {categories.map((key, colIndex) => (
          <td
            key={colIndex}
            onClick={()=>colIndex === 0&&modalOn&&handleOpenModal(rowIndex)}
            className={`text-center text-[clamp(0.875rem,1.5vw,1rem)] px-3 py-2 truncate overflow-hidden whitespace-nowrap ${
            colIndex === 0
                ? 'font-medium text-emerald-600 cursor-pointer hover:underline'
                : ''
            }`}
            title={colIndex === 0?'Accès à la fiche produit & modifier le stock':item[key]}
            
          >
            {Array.isArray(item[key])
              ? item[key].join(' ; ')
              : item[key]}
          </td>
        ))}
      </tr>
    );
  });



//5 - get the id and name (witch has to be unique) of the selected item. Not depending of parent type
const itemId = (currentItem && itemsId) && itemsId.find((el)=>el.name===currentItem[categories[0]]);


  return (
  <div className='border border-gray-300 rounded-md overflow-hidden text-sm shadow-sm'>
    {multipleSelect&&(
      <div className="p-2 flex flex-wrap justify-around gap-4">
        <div
          onClick={() => setMultiSelection([])}
          className="m-2 flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 cursor-pointer transition-colors shadow-sm"
        >
          Retirer vos sélections
        </div>

        <div
          onClick={() =>
            {multiSelection.forEach((el) => {
              handleStatusChange(el);
            })
            setMultiSelection([])}
          }
          className="m-2 flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors shadow-sm"
        >
          Changer le status des livraisons pour : Livré
        </div>
      </div>

    )}
  {isModalVisible && itemId && (
    <Modal
        className='w-[30vw] min-w-[300px] bg-white rounded-2xl p-0 shadow-none mx-[min(20px,10%)]'
        title={itemId.name}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={false}
        >
        <div className='p-4 text-gray-800 flex flex-col items-center'>
          <Link
            className='text-sm text-emerald-600 hover:underline'
            href={`/${type}/${itemId.id}`}
          >
            Accéder à la fiche {type === 'stock' ? 'produit' : 'commande'} de {itemId.name}
          </Link>

          <div className='p-4 font-semibold w-full text-center'>
            Que souhaitez-vous modifier ?
            <ul className='flex flex-wrap justify-center gap-2 mt-2'>
              {catToCheck.map((cat, i) => {
                if(cat==='Date de commande') return
                const isSelected = cat === typeSet
                return (
                  <li
                    key={i}
                    className={`text-sm px-3 py-1 border rounded-md cursor-pointer transition 
                      ${isSelected ? 'text-emerald-600 border-emerald-600 bg-emerald-50' : 'text-gray-500 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => setTypeSet(cat)}
                  >
                    {cat}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Stock section */}
          {typeSet === 'Stock' && (
            <div className='my-2 p-4 border border-gray-200 rounded-md w-full'>
              <label className='block text-sm text-center font-medium mb-4'>
                Modifier la quantité en stock de <span className='text-emerald-600'>{itemId.name}</span> :
              </label>
              <input
                type='number'
                className='w-full text-center p-2 border border-gray-300 rounded-md mb-4'
                value={newStock.quantity}
                placeholder='Variation des stocks'
                onChange={(e) => setNewStock({...newStock, id:itemId.id, quantity:e.target.value})}
              />
              <div className='flex flex-col items-center gap-2'>

                <div className='p-2 flex items-center justify-center bg-gray-200 rounded gap-2' >

                  <button
                    className={`px-3 py-1 ${operator<0?'bg-emerald-500':'bg-gray-400'} cursor-pointer text-white rounded-md hover:bg-emerald-600 transition flex items-center`}
                    onClick={() => setOperator(operator*-1)}
                  >
                    {'Retirer du stock'}
                    <FontAwesomeIcon icon={faMinus} className='ml-2' />
                  </button>

                  <button
                    className={`px-3 py-1 ${operator>0?'bg-emerald-500':'bg-gray-400'} cursor-pointer text-white rounded-md hover:bg-emerald-600 transition flex items-center`}
                    onClick={() => setOperator(operator*-1)}
                  >
                    {'Ajouter au stock'}
                    <FontAwesomeIcon icon={faPlus} className='ml-2' />
                  </button>

                </div>

                <div className={`text-sm ${(0>(newStock.stock + Number(newStock.quantity)*operator)) ? 'text-red-500' : 'text-gray-700'}`}>
                  Nouvelle quantité : {newStock.stock + (Number(newStock.quantity)||0)*operator} {newStock.unity}
                </div>
                <button
                  className='px-3 py-1 bg-emerald-500 text-white cursor-pointer rounded-md hover:bg-emerald-600 transition'
                  onClick={() => handleProductChange('stock',newStock.quantity)}
                >
                  Valider
                </button>
                
              </div>
            </div>
          )}
          {typeSet === 'Nom'&&(
            <div className='my-2 p-4 border border-gray-200 rounded-md w-full'>

              <label className='block text-sm text-center font-medium mb-4'>
                Modifier le nom de <span className='text-emerald-600'>{itemId.name}</span> :
              </label>
              <input
                type='text'
                className='w-full text-center p-2 border border-gray-300 rounded-md mb-4'
                value={newStock.newName}
                placeholder='Nouveau nom'
                onChange={(e) => setNewStock({...newStock, id:itemId.id, newName:(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))})}
              />
              <div className='flex flex-col items-center gap-2'>

                <button
                  className='px-3 py-1 bg-emerald-500 text-white cursor-pointer rounded-md hover:bg-emerald-600 transition'
                  onClick={() => handleProductChange('name',newStock.newName)}
                >
                  Valider
                </button>
                
              </div>

            </div>
          )}

          {/* Status section */}
          {typeSet === 'Status' && (
            <div className='my-2 p-4 border border-gray-200 rounded-md w-full'>
              <p className='text-sm font-medium mb-2'>Changer le statut :</p>
              <div className='flex flex-col gap-2'>
                {['En cours', 'Livrée'].map((label) => {
                  return (<label htmlFor={label} key={label} className='flex items-center gap-2 text-sm'>
                    <input
                      id = {label}
                      type='radio'
                      name='status'
                      value={label}
                      checked={orderStatus.status === label}
                      onChange={(e) =>
                        setOrderStatus({ status: e.target.value, ref: itemId.name, id: itemId.id })
                      }
                    />
                    {label}
                  </label>)
                })}
                <button
                  className='mt-2 px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition flex items-center gap-1 self-start'
                  onClick={()=>handleStatusChange(orderStatus)}
                >
                  <FontAwesomeIcon icon={faFlagCheckered}className='mx-1' />
                  Valider
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

  )}

  {/* Header fixe */}
  <div className='bg-white z-20'>
    <table className='table-fixed w-full border-collapse text-sm'>
      <thead className='tracking-wider'>
        <tr>{renderHeader()}</tr>
      </thead>
    </table>
  </div>

  {/* Corps scrollable */}
  <div className='max-h-[500px] w-full overflow-y-auto bg-white'>
    <table className='table-fixed w-full border-collapse text-sm'>
      <tbody>{renderRows()}</tbody>
    </table>
  </div>
</div>


  );
}

export default SearchTable;
