interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Carregando notas explicativas..." }: LoadingStateProps) {
  return (
    <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <div className="text-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
}