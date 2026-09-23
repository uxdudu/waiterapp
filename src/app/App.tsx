import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { GarcomPage } from "./GarcomPage";
import { KitchenOrdersPage } from "./KitchenOrdersPage";
import { DeliveryPage } from "./DeliveryPage";

type ConnectionState = "checking" | "connected" | "offline";

const areas = [
  { label: "App Garçom", path: "/garcom" },
  { label: "Dashboard Cozinha", path: "/cozinha" },
  { label: "Delivery App", path: "/delivery" },
];

function ConnectionBadge({ state }: { state: ConnectionState }) {
  const labels: Record<ConnectionState, string> = {
    checking: "Verificando backend",
    connected: "Backend conectado",
    offline: "Backend indisponível",
  };

  return (
    <span className={`status-badge status-badge--${state}`}>
      <span aria-hidden="true" className="status-badge__dot" />
      {labels[state]}
    </span>
  );
}

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
          <span aria-label="Waiterapp" className="brand__wordmark">
            <strong>Waiter</strong><span>App</span>
          </span>
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

        <ConnectionBadge state={connection} />
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
      <h1>Um ponto de partida simples para o Waiterapp.</h1>
      <p>
        A base está pronta para receber as telas do App Garçom e do Dashboard
        Cozinha, com uma API própria e persistência local enquanto definimos o
        produto.
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

  return <Shell />;
}
