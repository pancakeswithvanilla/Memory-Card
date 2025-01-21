function MemoryCard({id, name, image}){
    return (<div className = "memorycard" id = {id}>
    <img src={image} alt="" />
    <h3>{name}</h3>
    </div>)
}
export default MemoryCard;