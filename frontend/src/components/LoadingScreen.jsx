export default function LoadingScreen({ message = "Checking your session..." }) {
  return (
    <div className="loading-screen">
      <div className="card loading-card">
        <div className="spinner" />
        <h2 className="section-title">Securing your workspace</h2>
        <p className="muted">{message}</p>
      </div>
    </div>
  );
}
