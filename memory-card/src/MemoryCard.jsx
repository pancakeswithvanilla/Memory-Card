function MemoryCard({ name, image}){
    return (<>
    <img src={image} alt="" />
    <h3>{name}</h3>
    </>)
}
export default MemoryCard;