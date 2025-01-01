/*
export const drawRect = (detections, ctx) =>{
  // Loop through each prediction
  detections.forEach(prediction => {

    // Extract boxes and classes
    const [x, y, width, height] = prediction['bbox']; 
    let text = prediction['class'];
    const score = prediction['score'];
    let color = 'blue';
    const recycle = ['bottle', 'wine glass', 'cup', 'fork','knife', 'spoon', 'bowl', 'vase','toothbrush'];
    const trash = ['banana', 'apple'];
    if(recycle.indexOf(text) > -1){
      color = 'blue';
      text += " "+ Math.round((score*100) * 100) / 100 + "%";
      text = "(Recylable) " + text;
    // Set styling
    ctx.strokeStyle = color
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = color
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
    } else if (trash.indexOf(text) > -1){
      //color='red';
      text += " "+ Math.round((score*100) * 100) / 100 + "%";
      text = "(Trash) " + text;
    // Set styling
    ctx.strokeStyle = '#' + color
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = '#' + color
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
    }
    
  });
}


*/
// Define our labelmap
const labelMap = {
  1:{name:'Aluminium foil', color:'green'},
  2:{name:'Bottle Cap', color:'green'},
  3:{name:'Bottle', color:'green'},
  4:{name:'Broken Glass', color:'green'},
  5:{name:'Can', color:'green'},
  6:{name:'Carton', color:'green'},
  7:{name:'Cigarette', color:'green'},
  8:{name:'Cup', color:'green'},
  9:{name:'Lid', color:'green'},
  10:{name:'Other Litter', color:'green'},
  11:{name:'Other plastic', color:'green'},
  12:{name:'Paper', color:'green'},
  13:{name:'Plastic bag - wrapper', color:'green'},
  14:{name:'Plastic container', color:'green'},
  15:{name:'Pop tab', color:'green'},
  16:{name:'Straw', color:'green'},
  17:{name:'Styrofoam piece', color:'green'},
  18:{name:'Unlabeled litter', color:'green'},
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
  for(let i=0; i<=boxes.length; i++){
      if(boxes[i] && classes[i] && scores[i]>threshold){
          // Extract variables
          const [y,x,height,width] = boxes[i]
          const text = classes[i]
          
          // Set styling
          ctx.strokeStyle = labelMap[text]['color']
          ctx.lineWidth = 10
          ctx.fillStyle = 'white'
          ctx.font = '30px Arial'         
          
          // DRAW!!
          ctx.beginPath()
          ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
          ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
          ctx.stroke()
      }
  }
}


