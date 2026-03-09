type StatProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatCard({ title, value, icon }: StatProps) {
  return (
    <div className="card bg-neutral-600/10 border border-gray-400/10 shadow-md rounded-lg">
      <div className="card-body flex-row items-center justify-between">
        <div>
          <p className="text-sm opacity-60">{title}</p>

          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        <div className="text-primary">{icon}</div>
      </div>
    </div>
  );
}
