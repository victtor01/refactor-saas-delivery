"use client";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return <div>Houve um erro ao tentar mostrar os seus produtos!

    <button onClick={reset}>
      Tentar novamente
    </button>
  </div>;
}
