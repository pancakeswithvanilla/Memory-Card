function MemoryCard({ name, image}){
    return (<div className = "memorycard">
    <img src={image} alt="" />
    <h3>{name}</h3>
    </div>)
}
export default MemoryCard;