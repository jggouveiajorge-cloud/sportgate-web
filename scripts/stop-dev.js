#!/usr/bin/env node
// Detiene el servidor de "next dev" que esté escuchando en un puerto dado
// (por defecto 3000). Usa solo Node (sin paquetes externos), así que
// funciona igual en Windows, macOS y Linux — pensado para invocarse con
// `npm run stop` o directamente con `node scripts/stop-dev.js`.
//
// Por qué existe: en Windows, un .bat que intenta hacer esto mismo con
// "netstat" a mano se rompe con localizaciones distintas del idioma (por
// ejemplo, "LISTENING" aparece como "ESCUTANDO" en Windows en portugués).
// Aquí la lógica vive en JavaScript, donde es mucho más fácil de mantener
// y de probar.
const { execSync } = require("child_process");

const port = process.argv[2] || process.env.PORT || 3000;

function killWindows(port) {
  let output;
  try {
    output = execSync("netstat -aon", { encoding: "utf8" });
  } catch (err) {
    console.error("No se pudo ejecutar netstat:", err.message);
    process.exit(1);
  }

  const pids = new Set();
  for (const line of output.split("\n")) {
    const parts = line.trim().split(/\s+/);
    // Formato de cada línea: Proto  DirecciónLocal  DirecciónRemota  Estado  PID
    if (parts.length < 4) continue;
    const localAddress = parts[1];
    const pid = parts[parts.length - 1];
    if (localAddress && localAddress.endsWith(":" + port) && /^\d+$/.test(pid)) {
      pids.add(pid);
    }
  }

  if (pids.size === 0) {
    console.log("No encontre ningun servidor escuchando en el puerto " + port + ".");
    return;
  }

  for (const pid of pids) {
    try {
      execSync("taskkill /F /PID " + pid, { stdio: "inherit" });
    } catch (err) {
      // El mismo PID puede aparecer dos veces (IPv4 e IPv6); la segunda
      // vez taskkill falla porque ya no existe — no es un error real.
    }
  }
  console.log("SPORTGATE detenido.");
}

function killUnix(port) {
  let pidsOutput;
  try {
    pidsOutput = execSync("lsof -ti tcp:" + port, { encoding: "utf8" });
  } catch {
    console.log("No encontre ningun servidor escuchando en el puerto " + port + ".");
    return;
  }
  const pids = pidsOutput.split("\n").map((p) => p.trim()).filter(Boolean);
  if (pids.length === 0) {
    console.log("No encontre ningun servidor escuchando en el puerto " + port + ".");
    return;
  }
  for (const pid of pids) {
    try {
      process.kill(Number(pid), "SIGKILL");
    } catch {
      // Ya estaba detenido.
    }
  }
  console.log("SPORTGATE detenido.");
}

if (process.platform === "win32") {
  killWindows(port);
} else {
  killUnix(port);
}
