import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getfromLocalStorage = ()=>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'));
  }else{
    return [] ;
  }
}

function App() {
  const [name,setName] = useState('');
  const [list,setList] = useState(getfromLocalStorage());
  const [isEditing,setIsEditing] = useState(false);
  const [editID,setEditID] = useState(null);
  const [alert,setAlert] = useState({show: false , msg : 'Hello World' , type : 'danger'});

  const handleSubmit = (event) =>{
    event.preventDefault();
    console.log('Was submitted');
    if(!name){
      //display alert
      showAlert(true,'Please enter Value','danger');

    }else if(name &&isEditing){
      // deal with edit
      setList(list.map(item => {
        if(item.id === editID){
          return {...item , title:name}
        }
      return item ;
      })
      )
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true,'Value Changed','success');
    }else{
        // show alert
        showAlert(true,'Item added','success');
        const newItem = {id : new Date().getTime().toString(), title:name};
        setList([...list,newItem]);
        setName(' ');
    }
  }
  const showAlert = (show=false,msg,type) =>{
    setAlert({show,msg,type});
  }
  const clearListHandler = ()=>{
    showAlert(true,'List is empty','danger');
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true,'Item has been just removed','danger');
    setList(list.filter((item) => item.id !== id));
  }

  const editItem = (id) =>{
    setIsEditing(true);
    const specified = list.find(item => item.id === id);
    setEditID(id);
    setName(specified.title);
  }  
  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list));
  },[list]);
  return <section className='section-center' > 
           <form className='grocery-form' onSubmit={handleSubmit} >
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
                <h3>Grocery Bud</h3>
                <div className='form-control' >
                  <input 
                  type='text' 
                  className='grocery' 
                  placeholder='e.g. egss' 
                  value={name} 
                  onChange={(e)=>setName(e.target.value)} />
                  <button type='submit' className='submit-btn' >{isEditing ? 'Edit' : 'Submit'}</button>
                </div>
          </form>
          {list.length > 0 &&        
        <div className='grocery-container'>
        <List 
        items={list} 
        removeItem={removeItem} 
        edit={editItem}/>
        <button className='clear-btn' onClick={clearListHandler} >Clear Items</button>
        </div> }

   </section>

}

export default App
