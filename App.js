import './App.css'
import React, { useRef, useState, useEffect } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [mouseOverCanvas, setMouseOverCanvas] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setX(event.clientX);
      setY(event.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      setImage(img);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseWheel = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    ctx.lineWidth += e.deltaY > 0 ? -1 : 1;
    document.getElementById("following").style.width = `${ctx.lineWidth * 3}px`;
    document.getElementById("following").style.height = `${ctx.lineWidth * 3}px`;
  };
  
return (
  <div>
    { mouseOverCanvas && (
      <div
        id="following"
        style={{
          position: "absolute",
          borderRadius: "50%",
          border: "2px solid #000",
          left: `${x}px`,
          top: `${y}px`,
          margin: '10px',
        }}
      ></div>
    )}
    <input type="file" onChange={handleFileChange} />
    {image && 
      <>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          onWheel={handleMouseWheel}
          onMouseEnter={() => setMouseOverCanvas(true)}
          onMouseLeave={() => setMouseOverCanvas(false)}
        />
      </>
  }
  </div>
  );
  };

export default App;
