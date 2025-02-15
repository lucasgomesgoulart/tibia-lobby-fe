interface World {
  id: string;
  name: string;
}

interface OtServer {
  id: string;
  name: string;
  worlds: World[];
}

interface OtServerSelectionProps {
  otServers: OtServer[];
  selectedOtServer: string;
  setSelectedOtServer: (serverId: string) => void;
  selectedOtServerWorld: string;
  setSelectedOtServerWorld: (worldId: string) => void;
}

export default function OtServerSelection({
  otServers,
  selectedOtServer,
  setSelectedOtServer,
  selectedOtServerWorld,
  setSelectedOtServerWorld,
}: OtServerSelectionProps) {
  const handleOtServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServerId = e.target.value;
    setSelectedOtServer(selectedServerId);

    const selectedServer = otServers.find(server => server.id === selectedServerId);
    setSelectedOtServerWorld(selectedServer?.worlds?.[0]?.id || '');
  };

  return (
    <div className="space-y-4">
      {/* Seleção de OTServer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Selecione um OTServer
        </label>
        <select
          value={selectedOtServer}
          onChange={handleOtServerChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Escolha um OTServer</option>
          {otServers.map((server) => (
            <option key={server.id} value={server.id}>
              {server.name}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de Mundo do OTServer */}
      {selectedOtServer && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Selecione um Mundo do OTServer
          </label>
          <select
            value={selectedOtServerWorld}
            onChange={(e) => setSelectedOtServerWorld(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Escolha um Mundo</option>
            {otServers
              .find((server) => server.id === selectedOtServer)
              ?.worlds.map((world) => (
                <option key={world.id} value={world.id}>
                  {world.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}
