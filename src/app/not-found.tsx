export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh', 
      padding: '4rem 0' 
    }}>
      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '1rem' 
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        color: '#4B5563', 
        marginBottom: '2rem', 
        textAlign: 'center', 
        maxWidth: '28rem' 
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a 
        href="/" 
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#4F46E5', 
          color: 'white', 
          borderRadius: '0.375rem', 
          textDecoration: 'none' 
        }}
      >
        Return Home
      </a>
    </div>
  );
}