import Navbar from '../components/Navbar'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2 style={{ color: 'white' }}>Dashboard existiert</h2>
      </div>
    </div>
  )
}
