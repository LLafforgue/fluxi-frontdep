
// React
import React , {useState, useEffect} from 'react';
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBoxOpen, faBoxesStacked} from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

//antd
import { Popover, Button, Badge, notification } from 'antd';

// Next
import { useRouter } from "next/router";

// redux
import { useSelector } from 'react-redux';

import apiFetch from '@/utils/apiFetch';
import setDate from '@/utils/setDate';

// framer-motion pour animations
import { motion, AnimatePresence } from "framer-motion";




function UserMenu({ style, refresh }) {
    
    //Alertes
        //Orders
        const [contentOrderAlert, setContentOrderAlert] = useState([])  
        //Stocks 
        const [contentStockAlert, setContentStockAlert] = useState([])  
        // refresh
        const [refreshAlert, setRefreshAlert] = useState(false)
        //notifications
        const [api, contextHolder] = notification.useNotification();
        //AlerteIndex
        const [index,setIndex] = useState(0)

    //Route
    const router = useRouter();    
    //User
    const name = useSelector((state)=>state.user.value.firstname)
    
    //State for animation
    const [arrow,setArrow] = useState('')
        
    //Notification
    const openNotification = (object) => {
       if( router.asPath!=="/dashboard") return
    const color = object.type==='stock'?'bg-[#ffc7a7ff]':'bg-[#fbffa7ff]'
    api.open({
            message: 'Alert',
            description: object.message,
            className: color,
            style: {
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                overflow: "hidden",
              },
            })
    };
    

useEffect(()=>{
    const getProductAlert = async () =>{
    try{
    const data = await apiFetch('http://localhost:3001/api/products/alert',{
        method: 'GET',
    })
    if(data.result&&typeof(data.data)==='object'){
        setContentStockAlert(data.data.map((product)=>{
            const option = product.supplier&&'Contacter {product.supplier}'||'Faire un production';
            return{name:product.name, alert:'stock : '+ product.stock, option:option}
        }));
        openNotification({
            message:'Produits en tension : ' + data.data.map((product)=>product.name).join(' ; '),
            type:'stock'
            });
        }
        
        if(data.result&&typeof(data.data)!=='object'){
            setContentStockAlert([]);
           return  
        } 
    }catch(error){
        console.error('Erreur du serveur')
    };
    };

    const getOrderAlert = async () =>{
    try{
    const data = await apiFetch('http://localhost:3001/api/orders/alert',{
        method: 'GET',
    })
    if(data.result&&typeof(data.data)==='object'){
        setContentOrderAlert(data.data.map((order)=>{
            const option = order.products.map((a,i)=>{return <div key={i}>{a.product.name}</div> });
            
            return{name:order.ref, alert:'Date : '+setDate(order.deliveryDate), option:option}
        }));
        openNotification({
            message:'Commandes à honnorer : ' + data.data.map((order,i)=>(i<10)?order.ref:'').slice(0,11).join(' ; '),
            type:'order'
            });
        }
        if(data.result&&typeof(data.data)!=='object'){
            setContentOrderAlert([]);
           return  
        } 
    }catch(error){
        console.error('Erreur du serveur')
    };
    };
    getProductAlert();
    getOrderAlert();
},[refreshAlert, refresh])

    //Badges
    const countStocksAlert = contentStockAlert.length
    const countOrdersAlert = contentOrderAlert.length
    const totalAlerts = countOrdersAlert + countStocksAlert;

    //Content Popover settings
    const setPopoverContent = (content) => {
        const contentCar = content.map((alertContent, i) => {
            return (
                <div>
                    <div className="text-[15px] text-[#333333] font-semibold font-DMSans">
                        {alertContent.name}
                    </div>
                    <div className="text-[14px] text-gray-600 font-DMSans">
                        {alertContent.alert}
                    </div>
                    <div className="text-[14px] text-gray-500 font-DMSans">
                        {alertContent.option}
                    </div>
                </div>
            )
        });

        return (
            <div className="flex items-center justify-between w-full h-40 p-2">
                
                <button 
                    aria-label="Alerte prev"
                    onClick={() => {setIndex(index - 1 + content.length);setArrow('left')}} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#333333] rounded-[10px] text-[15px] font-bold transition-colors"
                >
                    {"<"}
                </button>

                    <AnimatePresence mode="wait">
                    <motion.div
                    key={index} 
                    className='box'
                    initial={arrow==='left'&&{ opacity: 0, x: 10 }||{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={arrow==='left'&&{ opacity: 0, x: -10 }||{ opacity: 1, x: 10 }}
                    transition={{ duration: 0.2 }}
                    >

                    <div className="flex flex-col items-center bg-white text-center mx-4 rounded-[10px] p-2 shadow">

                    {contentCar[index% content.length]}
                    <span className="text-[14px] text-gray-500 mt-1 font-DMSans">
                        {(index)% content.length + 1}/{content.length}
                    </span>
                    </div>

                    </motion.div>
                    </AnimatePresence>

                <button 
                    aria-label="Alerte next"
                    onClick={() => {setIndex(index + 1 + content.length); setArrow('right')}} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#333333] rounded-[10px] text-[15px] font-bold transition-colors"
                >
                    {">"}
                </button>
            </div>
            )
    }


    //Popover
    const contentPopover =  <div className='flex gap-5'>
                                <div>
                                    {contentOrderAlert.length>0&&(<Popover 
                                    placement="bottom"
                                    arrow={{ pointAtCenter: true }}
                                    title="Commandes Urgentes :" 
                                    content={setPopoverContent(contentOrderAlert)} 
                                    className={`mr-4`}  
                                    trigger="click">
                                        <Button>
                                            <h3 className='font-DMSans'>Commandes Urgentes</h3>
                                            <Badge count={countOrdersAlert} overflowCount={99}>
                                            <FontAwesomeIcon icon={faBoxOpen} className="text-xl cursor-pointer" />
                                            </Badge>
                                        </Button>
                                    </Popover>)}
                                </div>
                                <div>
                                    {countStocksAlert>0&&(<Popover 
                                    placement="bottom"
                                    arrow={{ pointAtCenter: true }}
                                    title="Alerte de Stock" 
                                    content={setPopoverContent(contentStockAlert)} 
                                    className={`mr-4`}  
                                    trigger="click">
                                        <Button>
                                            <h3 className='font-DMSans'>Alerte de Stock</h3>
                                            <Badge count={countStocksAlert} overflowCount={99}>
                                            <FontAwesomeIcon icon={faBoxesStacked} className="text-xl cursor-pointer" />
                                            </Badge>
                                        </Button>
                                    </Popover>)}
                                </div>

                            </div>;       

    const username = name

    async function handleClick(){
        router.push("/settings");
    }
    

    return (
        <div className={style}>
            <div className="flex items-center">
                {contextHolder}
                <Popover
                title="Alertes"
                arrow={false}
                content={contentPopover}
                trigger="click"
                >
                <div className="mr-4 relative">
                    
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-emerald-400 hover:text-white shadow-sm">
                    <Badge count={totalAlerts} overflowCount={99}>
                        <FontAwesomeIcon
                        icon={faBell}
                        className="text-xl text-gray-600 hover:text-white transition-colors"
                        />
                    </Badge>
                    </div>

                </div>
                </Popover>
                
                <div className="flex cursor-pointer items-center" onClick={handleClick}>
                <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
                <div className="font-bold ml-3">Hello, {username}.</div>
                </div>
            </div>
        </div>
    );
}

export default UserMenu
