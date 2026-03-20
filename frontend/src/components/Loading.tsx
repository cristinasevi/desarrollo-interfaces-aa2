export default function Loading() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      minHeight: '200px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #ddd',
        borderTop: '3px solid #646cff',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'girar 1s infinite linear'
      }}></div>
      
      <p style={{ color: '#888' }}>Cargando...</p>
      
      <style>{`
        @keyframes girar {
          from { 
            transform: rotate(0deg)
          }
          to { 
            transform: rotate(360deg)
          }
        }
      `}</style>
    </div>
  );
}
