import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const result = await res.json();

        console.log("Single incident:", result);

        if (!res.ok) {
          setIncident(null);
          return;
        }

        setIncident(result.data);
      } catch (err) {
        console.error(err);
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!incident) {
    return (
      <div className="p-10 text-center">
        <h2>Report Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <button onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>

      <h1>{incident.licence_plate}</h1>
      <p>{incident.description}</p>
      <p>Status: {incident.status}</p>
    </div>
  );
};

export default IncidentDetails;