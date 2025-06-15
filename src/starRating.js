import { useState } from "react";
import PropTypes  from "prop-types";

const containerStyle= {
    display:"flex",
    alignItem: "center",
    gap:"16px"
};

const starContainerStyle={
    display:'flex',
    gap:'4px',

 };

   StarRating.propTypes={
    maxRating:PropTypes.number,
    defaultRating:PropTypes.number,
    message:PropTypes.array,
    fontSize:PropTypes.number,
    color:PropTypes.string,
    className:PropTypes.string,
    onsetRating:PropTypes.func

  };
 
export default function StarRating({
    maxRating=5,
    color='green',
     fontSize='1.5rem',
     className='',
      message=[],
    defaultRating=0,
    onsetRating}){
    

    const[rating,setRating]=useState(defaultRating)
    const[tempRating, setTempRating]= useState(0)
    
    /*function handleRating(rating){
       setRating(rating)
        onsetRating(rating)
    } */
 
       const textStyle={
        lineHeight:'1',
        margin:'0',
        color,
        fontSize
    }
 return <div style={containerStyle} className={className}>
    <div style={starContainerStyle}>
     {/*Array.from({length:maxRating}, (_,i)=><span>S{i+1}</span>)*/}
     {Array.from({length:maxRating}, (_,i)=> (
     <Star key={i} 
     onRate={()=>setRating(i+1) & onsetRating(i+1)} 
     full={tempRating ? tempRating>=i+1:rating >= i+1}
     onHover={()=>setTempRating(i+1)}
     onHoverOut={()=>setTempRating(0)}
      coLOR={color}
      />
    
    ))
     
     }

    </div>
    <p style={textStyle}>{message.length===maxRating?
    message[tempRating?tempRating-1:rating-1]:
    tempRating || rating||''}</p>
    </div>
}





function Star({onRate,full,onHover,onHoverOut, color='red',coLOR }){

    const starStyle={ cursor:'pointer', margin:'4px',coLOR}
    return <span typeof="button" 
    style={starStyle} 
    onClick={onRate} 
    onMouseOver={onHover}
    onMouseLeave={onHoverOut} >
         
       {full?'⭐':'✡'}
        </span>
}