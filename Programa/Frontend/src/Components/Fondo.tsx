import fondoVideo from "../assets/fondo.mp4";
import "../Style/fondo.css";

export default function fondo() {
  return (
    <>
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={fondoVideo} type="video/mp4" />
      </video>
      <div className="bg-overlay"></div>
    </>
  );
}
