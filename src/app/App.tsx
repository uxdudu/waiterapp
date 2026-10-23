import { useEffect, useState } from "react";
import { Button, StatusBadge, Wordmark } from "../components/base";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { GarcomPage } from "./GarcomPage";
import { KitchenOrdersPage } from "./KitchenOrdersPage";
import { DeliveryPage } from "./DeliveryPage";
import { PlaygroundPage } from "./PlaygroundPage";

type ConnectionState = "checking" | "connected" | "offline";

const areas = [
  { label: "App Garçom", path: "/garcom" },
  { label: "Dashboard Cozinha", path: "/cozinha" },
  { label: "Delivery App", path: "/delivery" },
  { label: "Playground", path: "/playground" },
];

function Shell() {
  const location = useLocation();
  const [connection, setConnection] = useState<ConnectionState>("checking");

  useEffect(() => {
    let active = true;

    api.health().then(
      () => active && setConnection("connected"),
      () => active && setConnection("offline"),
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          <Wordmark size="sm" />
        </Link>

        <nav aria-label="Áreas do produto" className="app-nav">
          {areas.map((area) => (
            <Link
              className={`app-nav__link ${location.pathname === area.path ? "app-nav__link--active" : ""}`}
              key={area.path}
              to={area.path}
            >
              {area.label}
            </Link>
          ))}
        </nav>

        <StatusBadge tone={connection === "connected" ? "ready" : connection === "offline" ? "danger" : "neutral"}>{connection === "connected" ? "Backend conectado" : connection === "offline" ? "Backend indisponível" : "Verificando backend"}</StatusBadge>
      </header>

      <main className="app-main">
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<AreaPlaceholder title="App Garçom" />} path="/garcom" />
          <Route element={<AreaPlaceholder title="Dashboard Cozinha" />} path="/cozinha" />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="intro-panel">
      <div className="eyebrow">Fundação do produto</div>
      <h1>Três experiências, a mesma base visual.</h1>
      <p>
        O App Garçom orienta a interface da Cozinha e do Delivery. Explore os
        fluxos do protótipo e consulte os componentes Base e Blocks no playground.
      </p>
      <div className="intro-panel__actions">
        <Button onPress={() => navigate("/garcom")}>
          Abrir App Garçom
        </Button>
        <Button onPress={() => navigate("/delivery")} variant="secondary">
          Explorar Delivery App
        </Button>
        <Button
          onPress={() => navigate("/cozinha")}
          variant="secondary"
        >
          Ver Dashboard Cozinha
        </Button>
      </div>
    </section>
  );
}

function AreaPlaceholder({ title }: { title: string }) {
  return (
    <section className="placeholder-panel">
      <div className="eyebrow">Área preparada</div>
      <h1>{title}</h1>
      <p>
        Esta rota já está conectada ao shell do produto. A interface detalhada
        entra aqui quando fecharmos o desenho tela a tela.
      </p>
    </section>
  );
}

export function App() {
  const location = useLocation();

  if (location.pathname === "/cozinha") {
    return <KitchenOrdersPage />;
  }

  if (location.pathname === "/garcom") {
    return <GarcomPage />;
  }

  if (location.pathname === "/delivery") {
    return <DeliveryPage />;
  }

  if (location.pathname === "/playground") {
    return <PlaygroundPage />;
  }

  return <Shell />;
}
