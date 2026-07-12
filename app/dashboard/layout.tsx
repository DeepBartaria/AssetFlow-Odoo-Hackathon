import TaraChatbot from "../components/TaraChatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-shell">
      {children}
      <TaraChatbot />
    </div>
  );
}
