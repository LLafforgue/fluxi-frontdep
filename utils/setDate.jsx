const  setDate = (date) => {
    const setDate = typeof(date)===Date? date : new Date(date);
  return `${('0'+setDate.getDate()).slice(-2)}/${('0'+(setDate.getMonth()+1)).slice(-2)}/${setDate.getFullYear()}`
  }
export default setDate