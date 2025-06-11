import { Container, Button } from 'react-bootstrap';
import { FaMapSigns } from 'react-icons/fa';
import background from '../assets/question-background.png'
import { usePageTitle } from '../Hooks/FestivalHooks';

export default function NotFoundPage() {
  usePageTitle("페이지를 찾을 수 없습니다");
  const base = import.meta.env.BASE_URL;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container>
        <h1 style={{ fontSize: '80px', fontWeight: 'bold' }}>404</h1>

        <div className="d-flex justify-content-center my-3">
          <FaMapSigns size="48" color="#000" variant="Linear" />
        </div>

        <h2 style={{ fontWeight: 'bold', marginBottom: '10px' }}>길을 잃으셨군요!</h2>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px' }}>
          아래 버튼을 누르면 되돌아갈 수 있어요!
        </p>

        <Button
          variant="dark"
          size="lg"
          onClick={() => window.location.href = `${base}`}
          style={{ padding: '10px 30px', fontWeight: 'bold' }}
        >
          GO HOME
        </Button>
      </Container>
    </div>
  );
}
