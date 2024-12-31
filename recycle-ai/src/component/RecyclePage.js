
import { React, useRef, useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRect } from "./draw";
import Image3 from "../enviormental_image_1.jpeg";
import '../RecyclePage.css'

import { useState } from 'react';

const ProCard = ({ text }) => {
  return (
    <div className="pro-card">
      <h3>Pros</h3>
      <p>{text}</p>
    </div>
  );
};

const ConCard = ({ text }) => {
  return (
    <div className="con-card">
      <h3>Cons</h3>
      <p>{text}</p>
    </div>
  );
};

function RecyclePage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const impactContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [showContainer, setShowContainer] = useState(false);

  const handleConfirmClick = async () => {
    setShowContainer(true);
  
    // Get the canvas element
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    // Get the video element
    const video = webcamRef.current.video;
  
    // Set the canvas dimensions to match the video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Get the data URL of the canvas
    const dataURL = canvas.toDataURL();
  
    console.log(dataURL);
  
    // Send the data URL to the backend
    const response = await fetch('/api/save-canvas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataURL }),
    });
  
    const result = await response.json();
    console.log(result);
  };
  
  

  let model = undefined;

  async function loadModel() {
    let location = 'http://localhost:5000/modelfiles/model.json';
    model = await tf.loadGraphModel(location);
    //const modelUrl =
   //'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';
    //const model = await tf.loadGraphModel(modelUrl);
    //const zeros = tf.zeros([1, 224, 224, 3]);
    //console.log(model.predict(zeros).print());
    //model.summary();
    return model;
    
  }
  
  // Main function
  const runModel = async () => {
    console.log("tf version : ", tf.version);
    console.log("tf.version_core :", tf.version_core);
    const net = await tf.loadGraphModel('http://localhost:5000/modelfiles/model.json');
    // const net = tf.loadGraphModel("https://raw.githubusercontent.com/daved01/tensorflowjs-web-app-demo/main/models/fullyConvolutionalModelTfjs/model.json")
    console.log("Model Version : ", net.inputs.length)
    const outputs = net.outputs;
    console.log("outputs : ", outputs);
    console.log("model loaded!");
    // Initialize the ModelConfig
    // const modelConfig = {
    //   base: 'mobilenet_v2', // or 'mobilenet_v2'
    //   modelUrl: 'http://localhost:5000/modelfiles/model.json' // optional, if you have a custom model
    // };
    // const net = await cocossd.load(modelConfig); //coco is lightweight detections, our tensorflow based backend model is still training
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10000);
   // setLoading(false); // Set loading to false when everything is loaded
  };

  const detect = async (net) => {
    // Check data is available
    if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
    ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width and height
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Create a tensor from the video frame
        const img = tf.browser.fromPixels(video);
        const resizedImg = tf.image.resizeBilinear(img, [1280, 1280]);
        const reversedImg = resizedImg.reverse(-1);
        const castedImg = reversedImg.cast('float32');
        const inputTensor = castedImg.expandDims(0);
        // const predictions = await net.predict(inputTensor)

      // const NEW_OD_OUTPUT_TENSORS = ['detected_boxes', 'detected_scores', 'detected_classes'];
      const predictions = await net.execute(inputTensor);
      console.log("predictions :", predictions);
     
      /*
       
         // Draw mesh
         const ctx = canvasRef.current.getContext("2d");

        const boxes = await predictions[0].array()
        const classes = await predictions[0].array()
        const scores = await predictions[0].array()

        

         requestAnimationFrame(() => {
             drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx);
         });
 */
        // Dispose tensors to release memory
        img.dispose();
        resizedImg.dispose();
        castedImg.dispose();
        inputTensor.dispose();
        predictions.dispose();
    
    }
};

  useEffect(()=>{runModel()},[]);

  return (
    <div className="App">
      <section className="video-container">
        <Webcam ref={webcamRef} muted={true} className="video" />
        <canvas ref={canvasRef} className="canvas" />
      </section>

      <div className="isTrashable">
        <button onClick={() => handleConfirmClick()}>Confirm</button>
      </div>

      {showContainer && (
        <div className="container">
          <ProCard text="Reduces the amount of waste in landfills." />
          <ConCard text="Can be time-consuming to sort and recycle." />
          <ProCard text="Conserves natural resources and energy." />
          <ConCard text="May require extra effort or transportation to recycle properly." />
        </div>
      )}
    </div>
  );
}

export default RecyclePage;
